/**
 * Prompt Generator Service
 *
 * Generates optimized prompts in 3 versions (EXTENDED, STANDARD, MINIMAL)
 * using model-specific rules and best practices.
 */

import modelRulesService, {
  type ModelType,
  type ModelRules,
  ModelRulesError,
} from './model-rules.service.js';

// ============================================================================
// Types
// ============================================================================

export type VersionType = 'extended' | 'standard' | 'minimal';
export type TaskType =
  | 'code-generation'
  | 'code-review'
  | 'analysis'
  | 'creative-writing'
  | 'translation'
  | 'summarization'
  | 'system-prompt'
  | 'image-generation'
  | 'video-generation'
  | 'research'
  | 'general';

export type ToneType =
  | 'formal'
  | 'casual'
  | 'technical'
  | 'concise';

export interface GenerationInput {
  goal: string;
  model: ModelType;
  taskType?: TaskType;
  context?: string;
  tone?: ToneType;
  constraints?: string[];
  examples?: string[];
}

export interface GeneratedVersion {
  version: VersionType;
  content: string;
  tokenEstimate: number;
}

export interface GenerationOutput {
  versions: {
    extended: GeneratedVersion;
    standard: GeneratedVersion;
    minimal: GeneratedVersion;
  };
  techniques: string[];
  tips: string[];
  model: ModelType;
  taskType: TaskType;
}

// ============================================================================
// Service Error
// ============================================================================

export class PromptGeneratorError extends Error {
  constructor(
    message: string,
    public code: string,
    public statusCode: number = 400
  ) {
    super(message);
    this.name = 'PromptGeneratorError';
  }
}

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Estimates token count (rough approximation: ~4 chars per token)
 */
const estimateTokens = (text: string): number => {
  return Math.ceil(text.length / 4);
};

/**
 * Infers task type from goal if not provided
 */
const inferTaskType = (goal: string): TaskType => {
  const lowerGoal = goal.toLowerCase();

  if (
    lowerGoal.includes('code review') ||
    lowerGoal.includes('review kodu') ||
    lowerGoal.includes('przegla')
  ) {
    return 'code-review';
  }
  if (
    lowerGoal.includes('napisz kod') ||
    lowerGoal.includes('write code') ||
    lowerGoal.includes('funkcj') ||
    lowerGoal.includes('implement')
  ) {
    return 'code-generation';
  }
  if (
    lowerGoal.includes('analiz') ||
    lowerGoal.includes('analy') ||
    lowerGoal.includes('research') ||
    lowerGoal.includes('badanie')
  ) {
    return 'analysis';
  }
  if (
    lowerGoal.includes('przetlumacz') ||
    lowerGoal.includes('translat') ||
    lowerGoal.includes('tlumaczenie')
  ) {
    return 'translation';
  }
  if (
    lowerGoal.includes('podsumuj') ||
    lowerGoal.includes('summariz') ||
    lowerGoal.includes('streszcz')
  ) {
    return 'summarization';
  }
  if (
    lowerGoal.includes('system prompt') ||
    lowerGoal.includes('chatbot') ||
    lowerGoal.includes('asystent')
  ) {
    return 'system-prompt';
  }
  if (
    lowerGoal.includes('obraz') ||
    lowerGoal.includes('image') ||
    lowerGoal.includes('grafik') ||
    lowerGoal.includes('zdjeci')
  ) {
    return 'image-generation';
  }
  if (
    lowerGoal.includes('wideo') ||
    lowerGoal.includes('video') ||
    lowerGoal.includes('animacj') ||
    lowerGoal.includes('film')
  ) {
    return 'video-generation';
  }
  if (
    lowerGoal.includes('pisz') ||
    lowerGoal.includes('creat') ||
    lowerGoal.includes('write') ||
    lowerGoal.includes('story')
  ) {
    return 'creative-writing';
  }

  return 'general';
};

// ============================================================================
// Prompt Building Functions
// ============================================================================

/**
 * Build prompt for Claude 4.5
 */
const buildClaudePrompt = (
  input: GenerationInput,
  version: VersionType,
  _rules: ModelRules
): string => {
  const parts: string[] = [];

  if (version === 'extended') {
    if (input.context) {
      parts.push(`<context>\n${input.context}\n</context>`);
    }

    parts.push(`<task>\n${input.goal}\n</task>`);

    if (input.constraints && input.constraints.length > 0) {
      parts.push(
        `<constraints>\n${input.constraints.map((c) => `- ${c}`).join('\n')}\n</constraints>`
      );
    }

    parts.push(`<output_format>\n[Okresl oczekiwany format odpowiedzi]\n</output_format>`);

    if (input.examples && input.examples.length > 0) {
      parts.push(
        `<examples>\n${input.examples.map((e) => `Przykład: ${e}`).join('\n\n')}\n</examples>`
      );
    }

    // Add anti-overengineering for complex tasks
    if (input.taskType === 'code-generation' || input.taskType === 'code-review') {
      parts.push(`<avoid_overengineering>
Unikaj over-engineeringu. Wprowadzaj tylko zmiany bezposrednio zadane.
Nie dodawaj funkcji poza zakresem zadania.
</avoid_overengineering>`);
    }
  } else if (version === 'standard') {
    if (input.context) {
      parts.push(`<context>\n${input.context}\n</context>`);
    }
    parts.push(`<task>\n${input.goal}\n</task>`);
    parts.push(`<output_format>\n[Format odpowiedzi]\n</output_format>`);
  } else {
    // Minimal
    parts.push(`<task>\n${input.goal}\n</task>`);
  }

  return parts.join('\n\n');
};

/**
 * Build prompt for GPT 5.2
 */
const buildGptPrompt = (
  input: GenerationInput,
  version: VersionType,
  _rules: ModelRules
): string => {
  const parts: string[] = [];

  if (version === 'extended') {
    parts.push(`## Rola\nJestes ekspertem specjalizujacym sie w realizacji ponizszego zadania.`);

    if (input.context) {
      parts.push(`## Kontekst\n${input.context}`);
    }

    parts.push(`## Zadanie\n${input.goal}`);

    if (input.constraints && input.constraints.length > 0) {
      parts.push(`## Wymagania\n${input.constraints.map((c) => `- ${c}`).join('\n')}`);
    }

    parts.push(`## Format odpowiedzi\n[Okresl oczekiwany format]`);

    if (input.examples && input.examples.length > 0) {
      parts.push(`## Przykłady\n${input.examples.map((e) => `Input: ${e}\nOutput: [oczekiwany wynik]`).join('\n\n')}`);
    }
  } else if (version === 'standard') {
    if (input.context) {
      parts.push(`## Kontekst\n${input.context}`);
    }
    parts.push(`## Zadanie\n${input.goal}`);
    parts.push(`## Format odpowiedzi\n[Okresl format]`);
  } else {
    // Minimal
    parts.push(input.goal);
    if (input.constraints && input.constraints.length > 0) {
      parts.push(`Wymagania: ${input.constraints.join(', ')}`);
    }
  }

  return parts.join('\n\n');
};

/**
 * Build prompt for Gemini 3 Pro
 */
const buildGeminiPrompt = (
  input: GenerationInput,
  version: VersionType,
  _rules: ModelRules
): string => {
  // Gemini needs shorter prompts (30-50% less)
  const parts: string[] = [];

  if (version === 'extended') {
    parts.push(`Rola: Ekspert w realizacji zadania`);
    parts.push(`Cel: ${input.goal}`);

    if (input.constraints && input.constraints.length > 0) {
      parts.push(`Ograniczenia:\n${input.constraints.map((c) => `- ${c}`).join('\n')}`);
    }

    // Critical instructions at end (Gemini pays more attention to end)
    parts.push(`Format: [Okresl format odpowiedzi]`);
  } else if (version === 'standard') {
    parts.push(`Cel: ${input.goal}`);
    parts.push(`Format: [Okresl format]`);
  } else {
    // Minimal
    parts.push(input.goal);
  }

  return parts.join('\n\n');
};

/**
 * Build prompt for Grok 4.1
 */
const buildGrokPrompt = (
  input: GenerationInput,
  version: VersionType,
  _rules: ModelRules
): string => {
  const parts: string[] = [];

  if (version === 'extended') {
    parts.push(`## Cel\n${input.goal}`);

    if (input.context) {
      parts.push(`## Kontekst\n${input.context}`);
    }

    if (input.constraints && input.constraints.length > 0) {
      parts.push(`## Szczegoly zadania\n${input.constraints.map((c) => `- ${c}`).join('\n')}`);
    }

    parts.push(`## Oczekiwany output\n[Okresl format]`);
  } else if (version === 'standard') {
    parts.push(`## Cel\n${input.goal}`);
    if (input.context) {
      parts.push(`## Kontekst\n${input.context}`);
    }
  } else {
    // Minimal - Grok encourages iteration
    parts.push(input.goal);
  }

  return parts.join('\n\n');
};

/**
 * Build prompt for Perplexity Pro
 */
const buildPerplexityPrompt = (
  input: GenerationInput,
  version: VersionType,
  _rules: ModelRules
): string => {
  // Perplexity needs search-style queries, no role-playing, no few-shot
  const parts: string[] = [];

  if (version === 'extended') {
    parts.push(input.goal);

    if (input.context) {
      parts.push(`Kontekst: ${input.context}`);
    }

    parts.push(`Zakres czasowy: [np. 2024-2025]`);
    parts.push(`Zrodla: [np. oficjalne dokumentacje, peer-reviewed]`);
    parts.push(`Format: [tabela/lista/raport]`);
  } else if (version === 'standard') {
    parts.push(input.goal);
    parts.push(`Format: [okresl format odpowiedzi]`);
  } else {
    // Minimal
    parts.push(input.goal);
  }

  return parts.join('\n');
};

/**
 * Build prompt for Nano Banana (image generation)
 */
const buildNanaBananaPrompt = (
  input: GenerationInput,
  version: VersionType,
  _rules: ModelRules
): string => {
  // Natural language descriptions, not technical parameters
  const parts: string[] = [];

  if (version === 'extended') {
    parts.push(`[Glowny podmiot]: ${input.goal}`);
    parts.push(`[Działanie/Poza]: [co robi]`);
    parts.push(`[Lokalizacja]: [gdzie sie znajduje]`);
    parts.push(`[Oswietlenie]: [np. zlota godzina, swiatlo studyjne]`);
    parts.push(`[Styl]: [np. fotorealizm, akwarela, anime]`);
    parts.push(`[Nastroj]: [atmosfera obrazu]`);
  } else if (version === 'standard') {
    parts.push(`${input.goal}.`);
    parts.push(`[Oswietlenie i atmosfera]. [Styl: fotorealizm/inny].`);
  } else {
    // Minimal
    parts.push(input.goal);
  }

  return parts.join('\n');
};

/**
 * Build prompt for Grok Aurora (image) or Grok Imagine (video)
 */
const buildGrokImageVideoPrompt = (
  input: GenerationInput,
  version: VersionType,
  _rules: ModelRules,
  isVideo: boolean
): string => {
  // Photographic/cinematic language, 600-700 chars optimal
  const parts: string[] = [];

  if (isVideo) {
    // Video: Subject + Motion + Background + Motion + Camera + Motion
    if (version === 'extended') {
      parts.push(`[Podmiot + ruch]: ${input.goal}`);
      parts.push(`[Tlo + ruch]: [opis tla z elementami ruchu]`);
      parts.push(`[Kamera + ruch]: [slow pan right / tracking shot / static]`);
      parts.push(`[Styl]: [cinematic / documentary / ASMR]`);
      parts.push(`[Atmosfera]: [nastroj emocjonalny]`);
    } else if (version === 'standard') {
      parts.push(`${input.goal}, [ruch kamery], [styl], [atmosfera]`);
    } else {
      parts.push(input.goal);
    }
  } else {
    // Image: Subject + Style + Mood + Lighting + Details
    if (version === 'extended') {
      parts.push(`[Podmiot]: ${input.goal}`);
      parts.push(`[Styl]: [photorealistic / editorial / cinematic]`);
      parts.push(`[Nastroj]: [peaceful / dramatic / mysterious]`);
      parts.push(`[Oswietlenie]: [golden hour / studio lighting / neon]`);
      parts.push(`[Kompozycja]: [close-up / wide shot / rule of thirds]`);
      if (input.constraints && input.constraints.length > 0) {
        parts.push(`[Detale]: ${input.constraints.join(', ')}`);
      }
    } else if (version === 'standard') {
      parts.push(
        `${input.goal}, [oswietlenie], [styl], sharp focus, [format np. 16:9]`
      );
    } else {
      parts.push(input.goal);
    }
  }

  return parts.join(', ');
};

// ============================================================================
// Main Generation Function
// ============================================================================

/**
 * Generate prompts in all three versions
 */
export const generatePrompt = async (
  input: GenerationInput
): Promise<GenerationOutput> => {
  // Validate model
  if (!modelRulesService.isValidModel(input.model)) {
    throw new PromptGeneratorError(
      `Nieznany model: ${input.model}`,
      'UNKNOWN_MODEL',
      400
    );
  }

  // Infer task type if not provided
  const taskType = input.taskType || inferTaskType(input.goal);

  // Get model rules
  let rules: ModelRules;
  try {
    rules = await modelRulesService.getRules(input.model);
  } catch (error) {
    if (error instanceof ModelRulesError) {
      throw new PromptGeneratorError(
        error.message,
        error.code,
        error.statusCode
      );
    }
    throw error;
  }

  // Build prompts for each version
  const buildPrompt = (version: VersionType): string => {
    switch (input.model) {
      case 'claude-4.5':
        return buildClaudePrompt(input, version, rules);
      case 'gpt-5.2':
        return buildGptPrompt(input, version, rules);
      case 'gemini-3-pro':
        return buildGeminiPrompt(input, version, rules);
      case 'grok-4.1':
        return buildGrokPrompt(input, version, rules);
      case 'perplexity-pro':
        return buildPerplexityPrompt(input, version, rules);
      case 'nano-banana':
        return buildNanaBananaPrompt(input, version, rules);
      case 'grok-aurora':
        return buildGrokImageVideoPrompt(input, version, rules, false);
      case 'grok-imagine':
        return buildGrokImageVideoPrompt(input, version, rules, true);
      default:
        // Fallback to generic prompt
        return input.goal;
    }
  };

  const extendedContent = buildPrompt('extended');
  const standardContent = buildPrompt('standard');
  const minimalContent = buildPrompt('minimal');

  // Determine techniques used
  const techniques: string[] = [];

  if (input.model === 'claude-4.5') {
    techniques.push('XML tags dla struktury');
  }
  if (input.model === 'gpt-5.2') {
    techniques.push('Role-based prompting');
    techniques.push('Markdown structure');
  }
  if (input.model === 'gemini-3-pro') {
    techniques.push('Shortened prompt (30-50% less)');
    techniques.push('Critical instructions at end');
  }
  if (input.examples && input.examples.length > 0) {
    techniques.push('Few-shot examples');
  }
  if (input.constraints && input.constraints.length > 0) {
    techniques.push('Explicit constraints');
  }
  if (taskType === 'code-review' || taskType === 'code-generation') {
    techniques.push('Anti-overengineering directive');
  }

  return {
    versions: {
      extended: {
        version: 'extended',
        content: extendedContent,
        tokenEstimate: estimateTokens(extendedContent),
      },
      standard: {
        version: 'standard',
        content: standardContent,
        tokenEstimate: estimateTokens(standardContent),
      },
      minimal: {
        version: 'minimal',
        content: minimalContent,
        tokenEstimate: estimateTokens(minimalContent),
      },
    },
    techniques,
    tips: rules.tips.slice(0, 5), // Top 5 tips
    model: input.model,
    taskType,
  };
};

/**
 * Generate only a specific version
 */
export const generateSingleVersion = async (
  input: GenerationInput,
  version: VersionType
): Promise<GeneratedVersion> => {
  const result = await generatePrompt(input);
  return result.versions[version];
};

// ============================================================================
// Service Export
// ============================================================================

const promptGeneratorService = {
  generatePrompt,
  generateSingleVersion,
  inferTaskType,
  PromptGeneratorError,
};

export default promptGeneratorService;
