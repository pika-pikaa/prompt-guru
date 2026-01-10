/**
 * Model Rules Service
 *
 * Loads and caches model-specific rules from markdown files.
 * Provides best practices, avoid lists, checklists, and tips for each AI model.
 */

import path from 'path';
import markdownParserService, {
  type ExtractedRules,
  MarkdownParserError,
} from './markdown-parser.service.js';

// ============================================================================
// Types
// ============================================================================

export type ModelType =
  | 'claude-4.5'
  | 'gpt-5.2'
  | 'grok-4.1'
  | 'gemini-3-pro'
  | 'nano-banana'
  | 'grok-aurora'
  | 'grok-imagine'
  | 'perplexity-pro';

export type ModelCategory = 'llm' | 'image' | 'video' | 'search';

export interface ModelInfo {
  slug: ModelType;
  name: string;
  producer: string;
  category: ModelCategory;
  specialization: string;
  markdownFile: string;
}

export interface ModelRules extends ExtractedRules {
  model: ModelType;
  modelInfo: ModelInfo;
}

// ============================================================================
// Model Configuration
// ============================================================================

const MODELS_BASE_PATH = path.resolve(
  process.cwd(),
  '..',
  'models'
);

export const MODEL_REGISTRY: Record<ModelType, ModelInfo> = {
  'claude-4.5': {
    slug: 'claude-4.5',
    name: 'Claude 4.5 Opus/Sonnet',
    producer: 'Anthropic',
    category: 'llm',
    specialization: 'Najwyzsza jakosc, zlozone zadania',
    markdownFile: 'claude-4.md',
  },
  'gpt-5.2': {
    slug: 'gpt-5.2',
    name: 'ChatGPT 5.2',
    producer: 'OpenAI',
    category: 'llm',
    specialization: 'Precyzyjny, wieloetapowy',
    markdownFile: 'gpt-5.md',
  },
  'grok-4.1': {
    slug: 'grok-4.1',
    name: 'Grok 4.1',
    producer: 'xAI',
    category: 'llm',
    specialization: 'Aktualne informacje, iteracyjny',
    markdownFile: 'grok-4.md',
  },
  'gemini-3-pro': {
    slug: 'gemini-3-pro',
    name: 'Gemini 3 Pro',
    producer: 'Google',
    category: 'llm',
    specialization: 'Multimodal, dlugi kontekst',
    markdownFile: 'gemini-3.md',
  },
  'nano-banana': {
    slug: 'nano-banana',
    name: 'Nano Banana 2.5',
    producer: 'Google DeepMind',
    category: 'image',
    specialization: 'Generowanie i edycja obrazow',
    markdownFile: 'nano-banana.md',
  },
  'grok-aurora': {
    slug: 'grok-aurora',
    name: 'Grok Aurora',
    producer: 'xAI',
    category: 'image',
    specialization: 'Fotorealizm, tekst w obrazach',
    markdownFile: 'grok-aurora.md',
  },
  'grok-imagine': {
    slug: 'grok-imagine',
    name: 'Grok Imagine',
    producer: 'xAI',
    category: 'video',
    specialization: 'Wideo 6-15s z audio',
    markdownFile: 'grok-aurora.md', // Same file as grok-aurora
  },
  'perplexity-pro': {
    slug: 'perplexity-pro',
    name: 'Perplexity Pro',
    producer: 'Perplexity AI',
    category: 'search',
    specialization: 'Wyszukiwanie + Deep Research',
    markdownFile: 'perplexity-pro.md',
  },
};

// ============================================================================
// Cache
// ============================================================================

// Simple in-memory cache for parsed rules
// In production, consider using Redis or similar
const rulesCache = new Map<ModelType, ModelRules>();
const cacheExpiry = new Map<ModelType, number>();
const CACHE_TTL_MS = 60 * 60 * 1000; // 1 hour

/**
 * Check if cache entry is valid
 */
const isCacheValid = (model: ModelType): boolean => {
  const expiry = cacheExpiry.get(model);
  if (!expiry) return false;
  return Date.now() < expiry;
};

/**
 * Set cache entry with expiry
 */
const setCache = (model: ModelType, rules: ModelRules): void => {
  rulesCache.set(model, rules);
  cacheExpiry.set(model, Date.now() + CACHE_TTL_MS);
};

/**
 * Clear cache for a specific model or all models
 */
export const clearCache = (model?: ModelType): void => {
  if (model) {
    rulesCache.delete(model);
    cacheExpiry.delete(model);
  } else {
    rulesCache.clear();
    cacheExpiry.clear();
  }
};

// ============================================================================
// Service Error
// ============================================================================

export class ModelRulesError extends Error {
  constructor(
    message: string,
    public code: string,
    public statusCode: number = 400
  ) {
    super(message);
    this.name = 'ModelRulesError';
  }
}

// ============================================================================
// Main Service Functions
// ============================================================================

/**
 * Get all available models
 */
export const getAllModels = (): ModelInfo[] => {
  return Object.values(MODEL_REGISTRY);
};

/**
 * Get models by category
 */
export const getModelsByCategory = (category: ModelCategory): ModelInfo[] => {
  return Object.values(MODEL_REGISTRY).filter((m) => m.category === category);
};

/**
 * Get model info by slug
 */
export const getModelInfo = (model: ModelType): ModelInfo | null => {
  return MODEL_REGISTRY[model] || null;
};

/**
 * Check if a model slug is valid
 */
export const isValidModel = (model: string): model is ModelType => {
  return model in MODEL_REGISTRY;
};

/**
 * Get rules for a specific model
 * Uses caching to avoid repeated file reads
 */
export const getRules = async (model: ModelType): Promise<ModelRules> => {
  // Check cache first
  if (isCacheValid(model)) {
    const cached = rulesCache.get(model);
    if (cached) return cached;
  }

  const modelInfo = MODEL_REGISTRY[model];
  if (!modelInfo) {
    throw new ModelRulesError(
      `Nieznany model: ${model}`,
      'UNKNOWN_MODEL',
      400
    );
  }

  const filePath = path.join(MODELS_BASE_PATH, modelInfo.markdownFile);

  try {
    const parsed = await markdownParserService.parseMarkdownFile(filePath);
    const extractedRules = markdownParserService.extractRulesFromParsed(parsed);

    // Add model-specific rules enhancements
    const enhancedRules = enhanceRulesForModel(model, extractedRules);

    const rules: ModelRules = {
      ...enhancedRules,
      model,
      modelInfo,
    };

    // Cache the result
    setCache(model, rules);

    return rules;
  } catch (error) {
    if (error instanceof MarkdownParserError) {
      throw new ModelRulesError(
        `Nie udalo sie wczytac regul dla ${model}: ${error.message}`,
        'RULES_LOAD_ERROR',
        error.statusCode
      );
    }
    throw error;
  }
};

/**
 * Get rules for multiple models at once
 */
export const getRulesForModels = async (
  models: ModelType[]
): Promise<Map<ModelType, ModelRules>> => {
  const results = new Map<ModelType, ModelRules>();

  await Promise.all(
    models.map(async (model) => {
      const rules = await getRules(model);
      results.set(model, rules);
    })
  );

  return results;
};

/**
 * Add model-specific hardcoded rules that may not be in the markdown
 */
const enhanceRulesForModel = (
  model: ModelType,
  rules: ExtractedRules
): ExtractedRules => {
  const enhanced = { ...rules };

  switch (model) {
    case 'claude-4.5':
      // Ensure critical Claude rules are present
      if (!enhanced.avoid.some((a) => a.toLowerCase().includes('think'))) {
        enhanced.avoid.push(
          'Unikaj slowa "think" (bez extended thinking) - uzyj "consider", "evaluate", "assess"'
        );
      }
      if (!enhanced.tips.some((t) => t.toLowerCase().includes('xml'))) {
        enhanced.tips.push(
          'Uzywaj XML tagow dla struktury (<task>, <context>, <output_format>)'
        );
      }
      break;

    case 'gemini-3-pro':
      // Ensure Gemini temperature warning is present
      if (
        !enhanced.avoid.some(
          (a) => a.toLowerCase().includes('temperatura') || a.toLowerCase().includes('temperature')
        )
      ) {
        enhanced.avoid.push(
          'NIE obniżaj temperatury poniżej 1.0 - powoduje looping i degradację'
        );
      }
      if (!enhanced.tips.some((t) => t.toLowerCase().includes('30-50%'))) {
        enhanced.tips.push('Skroc prompt o 30-50% w porownaniu z innymi modelami');
      }
      break;

    case 'gpt-5.2':
      // Ensure GPT mixed signals warning
      if (
        !enhanced.avoid.some((a) => a.toLowerCase().includes('mieszanych'))
      ) {
        enhanced.avoid.push(
          'Unikaj mieszanych sygnalow - "preferuj X, ale Y tez ok" -> wybierz jedno'
        );
      }
      break;

    case 'perplexity-pro':
      // Ensure Perplexity specific warnings
      if (
        !enhanced.avoid.some(
          (a) => a.toLowerCase().includes('few-shot') || a.toLowerCase().includes('example')
        )
      ) {
        enhanced.avoid.push(
          'NIE uzywaj few-shot examples - mylą wyszukiwarke'
        );
      }
      if (
        !enhanced.avoid.some(
          (a) => a.toLowerCase().includes('role') || a.toLowerCase().includes('ekspert')
        )
      ) {
        enhanced.avoid.push(
          'NIE uzywaj role-playing ("Jestes ekspertem...") - nie dziala z wyszukiwarka'
        );
      }
      break;

    case 'nano-banana':
      if (
        !enhanced.avoid.some((a) => a.toLowerCase().includes('techniczne'))
      ) {
        enhanced.avoid.push(
          'Unikaj technicznych parametrow (octane render, unreal engine) - uzywaj naturalnego jezyka'
        );
      }
      break;

    case 'grok-aurora':
    case 'grok-imagine':
      if (!enhanced.tips.some((t) => t.toLowerCase().includes('600-700'))) {
        enhanced.tips.push('Optymalna dlugosc promptu: 600-700 znakow');
      }
      if (!enhanced.avoid.some((a) => a.toLowerCase().includes('rak'))) {
        enhanced.avoid.push(
          'Unikaj rak w kadrze - czesto znieksztalcone'
        );
      }
      break;
  }

  return enhanced;
};

/**
 * Get quick reference for model differences
 */
export const getModelComparison = (): Record<string, Record<ModelType, string>> => {
  return {
    dosłowność: {
      'claude-4.5': 'Bardzo wysoka',
      'gpt-5.2': 'Wysoka',
      'grok-4.1': 'Srednia',
      'gemini-3-pro': 'Wysoka',
      'nano-banana': 'N/A',
      'grok-aurora': 'N/A',
      'grok-imagine': 'N/A',
      'perplexity-pro': 'Wysoka',
    },
    struktura: {
      'claude-4.5': 'XML tagi',
      'gpt-5.2': 'Markdown',
      'grok-4.1': 'Markdown/XML',
      'gemini-3-pro': 'Role+Goal+Constraints',
      'nano-banana': 'Naturalny opis',
      'grok-aurora': 'Subject-first',
      'grok-imagine': 'Subject+Motion',
      'perplexity-pro': 'Search query',
    },
    temperatura: {
      'claude-4.5': 'Domyslna',
      'gpt-5.2': 'Domyslna',
      'grok-4.1': 'Domyslna',
      'gemini-3-pro': '1.0 (NIE ZMIENIAC!)',
      'nano-banana': 'N/A',
      'grok-aurora': 'N/A',
      'grok-imagine': 'N/A',
      'perplexity-pro': 'N/A',
    },
  };
};

// ============================================================================
// Service Export
// ============================================================================

const modelRulesService = {
  getAllModels,
  getModelsByCategory,
  getModelInfo,
  isValidModel,
  getRules,
  getRulesForModels,
  getModelComparison,
  clearCache,
  ModelRulesError,
};

export default modelRulesService;
