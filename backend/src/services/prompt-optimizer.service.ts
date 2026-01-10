/**
 * Prompt Optimizer Service
 *
 * Analyzes existing prompts for issues and applies model-specific optimizations.
 */

import modelRulesService, {
  type ModelType,
} from './model-rules.service.js';

// ============================================================================
// Types
// ============================================================================

export interface OptimizationIssue {
  type: 'critical' | 'warning' | 'suggestion';
  code: string;
  message: string;
  location?: string;
  fix?: string;
}

export interface OptimizationInput {
  originalPrompt: string;
  targetModel: ModelType;
  issues?: string[]; // User-reported issues
}

export interface OptimizationChange {
  type: 'added' | 'removed' | 'modified';
  description: string;
  reason: string;
}

export interface OptimizationOutput {
  optimizedPrompt: string;
  changes: OptimizationChange[];
  issues: OptimizationIssue[];
  beforeAfter: {
    before: string;
    after: string;
  };
  tokenDelta: number;
}

// ============================================================================
// Service Error
// ============================================================================

export class PromptOptimizerError extends Error {
  constructor(
    message: string,
    public code: string,
    public statusCode: number = 400
  ) {
    super(message);
    this.name = 'PromptOptimizerError';
  }
}

// ============================================================================
// Issue Detection Functions
// ============================================================================

/**
 * Detect Claude-specific issues
 */
const detectClaudeIssues = (prompt: string): OptimizationIssue[] => {
  const issues: OptimizationIssue[] = [];

  // Check for "think" word usage
  const thinkMatches = prompt.match(/\b(think|thinking|think about|think through)\b/gi);
  if (thinkMatches) {
    issues.push({
      type: 'critical',
      code: 'CLAUDE_THINK_WORD',
      message: `Znaleziono slowo "think" (${thinkMatches.length}x) - moze powodowac problemy bez extended thinking`,
      fix: 'Zamien "think" na "consider", "evaluate", "assess"',
    });
  }

  // Check for lack of XML structure
  const hasXmlTags = /<\w+>[\s\S]*<\/\w+>/g.test(prompt);
  if (!hasXmlTags && prompt.length > 200) {
    issues.push({
      type: 'suggestion',
      code: 'CLAUDE_NO_XML',
      message: 'Brak struktury XML - Claude 4.5 lepiej reaguje na tagi XML',
      fix: 'Dodaj tagi jak <context>, <task>, <output_format>',
    });
  }

  // Check for vague instructions
  if (
    prompt.includes('mozesz') ||
    prompt.includes('sprobuj') ||
    prompt.includes('jesli chcesz')
  ) {
    issues.push({
      type: 'warning',
      code: 'CLAUDE_VAGUE_INSTRUCTIONS',
      message: 'Niejasne instrukcje - Claude 4.5 wymaga explicite instrukcji',
      fix: 'Zamien "mozesz/sprobuj" na konkretne polecenia',
    });
  }

  return issues;
};

/**
 * Detect GPT-specific issues
 */
const detectGptIssues = (prompt: string): OptimizationIssue[] => {
  const issues: OptimizationIssue[] = [];

  // Check for mixed signals
  const mixedSignalPatterns = [
    /preferuj[^,]*,?\s*(ale|jednak|chociaz)/gi,
    /uzyj[^,]*,?\s*(ale mozesz|opcjonalnie)/gi,
    /domyslnie[^,]*,?\s*(ale|jednak)/gi,
  ];

  for (const pattern of mixedSignalPatterns) {
    if (pattern.test(prompt)) {
      issues.push({
        type: 'critical',
        code: 'GPT_MIXED_SIGNALS',
        message: 'Wykryto mieszane sygnaly - GPT-5.2 moze sie pogubic',
        fix: 'Wybierz jedna opcje zamiast "preferuj X, ale Y tez ok"',
      });
      break;
    }
  }

  // Check for lack of structure in long prompts
  if (prompt.length > 300 && !prompt.includes('##') && !prompt.includes('#')) {
    issues.push({
      type: 'suggestion',
      code: 'GPT_NO_STRUCTURE',
      message: 'Dlugi prompt bez struktury Markdown',
      fix: 'Dodaj naglowki ## dla lepszej organizacji',
    });
  }

  return issues;
};

/**
 * Detect Gemini-specific issues
 */
const detectGeminiIssues = (prompt: string): OptimizationIssue[] => {
  const issues: OptimizationIssue[] = [];

  // Check if prompt is too long (Gemini needs 30-50% shorter)
  if (prompt.length > 500) {
    issues.push({
      type: 'warning',
      code: 'GEMINI_TOO_LONG',
      message: 'Prompt moze byc za dlugi dla Gemini 3 - zalecane 30-50% krotsze',
      fix: 'Skroc prompt usuwajac redundancje',
    });
  }

  // Check for chain-of-thought prompting (should use thinking_level instead)
  if (
    prompt.toLowerCase().includes('krok po kroku') ||
    prompt.toLowerCase().includes('step by step')
  ) {
    issues.push({
      type: 'suggestion',
      code: 'GEMINI_MANUAL_COT',
      message: 'Reczny chain-of-thought - Gemini ma wbudowane thinking_level',
      fix: 'Uzyj parametru API thinking_level: "high" zamiast "krok po kroku"',
    });
  }

  // Check if critical instructions are not at the end
  const lines = prompt.split('\n').filter((l) => l.trim());
  const lastLine = lines[lines.length - 1]?.toLowerCase() || '';
  if (
    !lastLine.includes('format') &&
    !lastLine.includes('output') &&
    !lastLine.includes('odpowiedz')
  ) {
    issues.push({
      type: 'suggestion',
      code: 'GEMINI_INSTRUCTIONS_POSITION',
      message: 'Kluczowe instrukcje powinny byc na koncu',
      fix: 'Przenies format odpowiedzi i ograniczenia na koniec promptu',
    });
  }

  return issues;
};

/**
 * Detect Perplexity-specific issues
 */
const detectPerplexityIssues = (prompt: string): OptimizationIssue[] => {
  const issues: OptimizationIssue[] = [];

  // Check for role-playing
  if (
    prompt.toLowerCase().includes('jestes ekspertem') ||
    prompt.toLowerCase().includes('you are an expert') ||
    prompt.toLowerCase().includes('as a')
  ) {
    issues.push({
      type: 'critical',
      code: 'PERPLEXITY_ROLE_PLAYING',
      message: 'Role-playing nie dziala z Perplexity - to wyszukiwarka, nie chatbot',
      fix: 'Usun "Jestes ekspertem..." - sformuluj jako pytanie wyszukiwarkowe',
    });
  }

  // Check for few-shot examples
  if (
    prompt.includes('Przykład:') ||
    prompt.includes('Example:') ||
    prompt.includes('Input:') && prompt.includes('Output:')
  ) {
    issues.push({
      type: 'critical',
      code: 'PERPLEXITY_FEW_SHOT',
      message: 'Few-shot examples myla Perplexity - szuka przykladow zamiast odpowiedzi',
      fix: 'Usun przyklady, sformuluj pytanie bezposrednio',
    });
  }

  // Check for URL request
  if (
    prompt.toLowerCase().includes('podaj link') ||
    prompt.toLowerCase().includes('url') ||
    prompt.toLowerCase().includes('podaj adres')
  ) {
    issues.push({
      type: 'warning',
      code: 'PERPLEXITY_URL_REQUEST',
      message: 'Prośba o URL - model może halucynować linki',
      fix: 'Nie proś o URL - źródła są automatycznie dołączane',
    });
  }

  return issues;
};

/**
 * Detect image/video prompt issues
 */
const detectImageVideoIssues = (
  prompt: string,
  model: ModelType
): OptimizationIssue[] => {
  const issues: OptimizationIssue[] = [];

  if (model === 'nano-banana') {
    // Check for technical parameters
    const technicalTerms = [
      'octane render',
      'unreal engine',
      '8k uhd',
      'hyperdetailed',
      'volumetric lighting',
      'f/1.8',
      '35mm lens',
    ];

    for (const term of technicalTerms) {
      if (prompt.toLowerCase().includes(term)) {
        issues.push({
          type: 'warning',
          code: 'NANO_BANANA_TECHNICAL',
          message: `Uzyto technicznego terminu "${term}" - Nano Banana preferuje naturalny jezyk`,
          fix: 'Zamien techniczne parametry na opisy slowne',
        });
        break;
      }
    }

    // Check for negative prompts
    if (prompt.includes('no ') || prompt.includes('bez ') || prompt.includes('without')) {
      issues.push({
        type: 'suggestion',
        code: 'NANO_BANANA_NEGATIVE',
        message: 'Negatywne prompty (np. "no blur") nie dzialaja z Nano Banana',
        fix: 'Opisz co CHCESZ widziec zamiast czego unikac',
      });
    }
  }

  if (model === 'grok-aurora' || model === 'grok-imagine') {
    // Check prompt length
    if (prompt.length > 700) {
      issues.push({
        type: 'warning',
        code: 'GROK_IMAGE_TOO_LONG',
        message: `Prompt za dlugi (${prompt.length} znakow) - optymalne to 600-700`,
        fix: 'Skroc prompt do 600-700 znakow',
      });
    }

    // Check for hands mention (often problematic)
    if (prompt.toLowerCase().includes('hand') || prompt.toLowerCase().includes('ręk')) {
      issues.push({
        type: 'suggestion',
        code: 'GROK_IMAGE_HANDS',
        message: 'Rece czesto sa znieksztalcone w AI art',
        fix: 'Rozważ ukrycie rak lub kadrowanie bez nich',
      });
    }

    // Check for text in image request
    if (prompt.toLowerCase().includes('text') || prompt.toLowerCase().includes('napis')) {
      issues.push({
        type: 'suggestion',
        code: 'GROK_IMAGE_TEXT',
        message: 'Tekst w obrazach często zawiera błędy',
        fix: 'Dodaj tekst w post-produkcji lub zaakceptuj możliwe błędy',
      });
    }
  }

  return issues;
};

// ============================================================================
// Optimization Functions
// ============================================================================

/**
 * Apply Claude optimizations
 */
const optimizeForClaude = (prompt: string): { optimized: string; changes: OptimizationChange[] } => {
  let optimized = prompt;
  const changes: OptimizationChange[] = [];

  // Replace "think" with alternatives
  const thinkReplacements: Record<string, string> = {
    'think about': 'consider',
    'think through': 'work through',
    'thinking': 'evaluating',
    'think': 'assess',
  };

  for (const [from, to] of Object.entries(thinkReplacements)) {
    const regex = new RegExp(`\\b${from}\\b`, 'gi');
    if (regex.test(optimized)) {
      optimized = optimized.replace(regex, to);
      changes.push({
        type: 'modified',
        description: `Zamieniono "${from}" na "${to}"`,
        reason: 'Claude 4.5 jest wrazliwy na slowo "think" bez extended thinking',
      });
    }
  }

  // Add XML structure if missing for long prompts
  if (!/<\w+>/.test(optimized) && optimized.length > 200) {
    const hasContext = optimized.toLowerCase().includes('kontekst') || optimized.toLowerCase().includes('context');

    if (!hasContext) {
      // Wrap in basic XML structure
      optimized = `<task>\n${optimized}\n</task>`;
      changes.push({
        type: 'added',
        description: 'Dodano strukture XML (<task>)',
        reason: 'Claude 4.5 lepiej reaguje na prompty ze struktura XML',
      });
    }
  }

  return { optimized, changes };
};

/**
 * Apply GPT optimizations
 */
const optimizeForGpt = (prompt: string): { optimized: string; changes: OptimizationChange[] } => {
  let optimized = prompt;
  const changes: OptimizationChange[] = [];

  // Add markdown structure if missing
  if (prompt.length > 300 && !prompt.includes('##')) {
    const lines = optimized.split('\n');
    if (lines.length > 3) {
      optimized = `## Zadanie\n${optimized}\n\n## Format odpowiedzi\n[Okresl oczekiwany format]`;
      changes.push({
        type: 'added',
        description: 'Dodano strukture Markdown',
        reason: 'GPT-5.2 lepiej przetwarza strukturyzowane prompty',
      });
    }
  }

  return { optimized, changes };
};

/**
 * Apply Gemini optimizations
 */
const optimizeForGemini = (prompt: string): { optimized: string; changes: OptimizationChange[] } => {
  let optimized = prompt;
  const changes: OptimizationChange[] = [];

  // Remove verbose phrases
  const verbosePhrases = [
    { from: 'Prosze, ', to: '' },
    { from: 'Czy moglbys ', to: '' },
    { from: 'Bylbym wdzieczny gdybys ', to: '' },
    { from: 'Pamietaj, ze ', to: '' },
    { from: 'Nalezy pamietac, ze ', to: '' },
  ];

  for (const { from, to } of verbosePhrases) {
    if (optimized.includes(from)) {
      optimized = optimized.replace(from, to);
      changes.push({
        type: 'removed',
        description: `Usunieto "${from}"`,
        reason: 'Gemini 3 potrzebuje krotszych promptow (30-50% mniej)',
      });
    }
  }

  // Move format instructions to end if not already there
  const formatMatch = optimized.match(/Format:[\s\S]*?(?=\n\n|$)/i);
  if (formatMatch && !optimized.endsWith(formatMatch[0])) {
    optimized = optimized.replace(formatMatch[0], '').trim() + '\n\n' + formatMatch[0];
    changes.push({
      type: 'modified',
      description: 'Przeniesiono instrukcje formatu na koniec',
      reason: 'Gemini 3 przywiazuje wieksza wage do instrukcji na koncu',
    });
  }

  return { optimized, changes };
};

/**
 * Apply Perplexity optimizations
 */
const optimizeForPerplexity = (prompt: string): { optimized: string; changes: OptimizationChange[] } => {
  let optimized = prompt;
  const changes: OptimizationChange[] = [];

  // Remove role-playing
  const rolePatterns = [
    /Jestes\s+\w+[\w\s]*\.\s*/gi,
    /You are\s+\w+[\w\s]*\.\s*/gi,
    /As a\s+\w+[\w\s]*,\s*/gi,
  ];

  for (const pattern of rolePatterns) {
    if (pattern.test(optimized)) {
      optimized = optimized.replace(pattern, '');
      changes.push({
        type: 'removed',
        description: 'Usunieto role-playing',
        reason: 'Perplexity to wyszukiwarka - role-playing nie dziala',
      });
    }
  }

  // Remove few-shot examples
  const examplePatterns = [
    /Przyklad:[\s\S]*?(?=\n\n|$)/gi,
    /Example:[\s\S]*?(?=\n\n|$)/gi,
  ];

  for (const pattern of examplePatterns) {
    if (pattern.test(optimized)) {
      optimized = optimized.replace(pattern, '');
      changes.push({
        type: 'removed',
        description: 'Usunieto przyklady few-shot',
        reason: 'Few-shot myli Perplexity - szuka przykladow zamiast odpowiedzi',
      });
    }
  }

  return { optimized, changes };
};

// ============================================================================
// Main Optimization Function
// ============================================================================

/**
 * Analyze and optimize a prompt for a specific model
 */
export const optimizePrompt = async (
  input: OptimizationInput
): Promise<OptimizationOutput> => {
  const { originalPrompt, targetModel, issues: userIssues } = input;

  // Validate model
  if (!modelRulesService.isValidModel(targetModel)) {
    throw new PromptOptimizerError(
      `Nieznany model: ${targetModel}`,
      'UNKNOWN_MODEL',
      400
    );
  }

  // Detect issues
  let detectedIssues: OptimizationIssue[] = [];

  switch (targetModel) {
    case 'claude-4.5':
      detectedIssues = detectClaudeIssues(originalPrompt);
      break;
    case 'gpt-5.2':
      detectedIssues = detectGptIssues(originalPrompt);
      break;
    case 'gemini-3-pro':
      detectedIssues = detectGeminiIssues(originalPrompt);
      break;
    case 'grok-4.1':
      // Grok is more flexible, basic checks
      if (originalPrompt.length > 1000) {
        detectedIssues.push({
          type: 'suggestion',
          code: 'GROK_ITERATE',
          message: 'Dlugi prompt - rozważ iteracyjne podejście',
          fix: 'Grok jest szybki - lepiej iterowac niz pisac wszystko na raz',
        });
      }
      break;
    case 'perplexity-pro':
      detectedIssues = detectPerplexityIssues(originalPrompt);
      break;
    case 'nano-banana':
    case 'grok-aurora':
    case 'grok-imagine':
      detectedIssues = detectImageVideoIssues(originalPrompt, targetModel);
      break;
  }

  // Add user-reported issues
  if (userIssues && userIssues.length > 0) {
    for (const issue of userIssues) {
      detectedIssues.push({
        type: 'warning',
        code: 'USER_REPORTED',
        message: issue,
      });
    }
  }

  // Apply optimizations
  let result: { optimized: string; changes: OptimizationChange[] };

  switch (targetModel) {
    case 'claude-4.5':
      result = optimizeForClaude(originalPrompt);
      break;
    case 'gpt-5.2':
      result = optimizeForGpt(originalPrompt);
      break;
    case 'gemini-3-pro':
      result = optimizeForGemini(originalPrompt);
      break;
    case 'perplexity-pro':
      result = optimizeForPerplexity(originalPrompt);
      break;
    default:
      result = { optimized: originalPrompt, changes: [] };
  }

  // Calculate token delta
  const estimateTokens = (text: string) => Math.ceil(text.length / 4);
  const tokenDelta =
    estimateTokens(result.optimized) - estimateTokens(originalPrompt);

  return {
    optimizedPrompt: result.optimized,
    changes: result.changes,
    issues: detectedIssues,
    beforeAfter: {
      before: originalPrompt,
      after: result.optimized,
    },
    tokenDelta,
  };
};

/**
 * Analyze prompt without applying changes
 */
export const analyzePrompt = async (
  prompt: string,
  targetModel: ModelType
): Promise<OptimizationIssue[]> => {
  const result = await optimizePrompt({
    originalPrompt: prompt,
    targetModel,
  });
  return result.issues;
};

// ============================================================================
// Service Export
// ============================================================================

const promptOptimizerService = {
  optimizePrompt,
  analyzePrompt,
  PromptOptimizerError,
};

export default promptOptimizerService;
