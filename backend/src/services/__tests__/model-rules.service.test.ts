/**
 * Model Rules Service Unit Tests
 *
 * Tests for model rules loading, caching, and retrieval.
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

// Mock the markdown-parser service - all functions must be defined inline
vi.mock('../markdown-parser.service.js', () => {
  return {
    default: {
      parseMarkdownFile: vi.fn().mockResolvedValue({
        content:
          '# Model Rules\n\n## Best Practices\n- Practice 1\n- Practice 2',
        metadata: {},
        sections: [
          { title: 'Best Practices', content: '- Practice 1\n- Practice 2' },
          { title: 'Avoid', content: '- Avoid 1\n- Avoid 2' },
          { title: 'Tips', content: '1. Tip 1\n2. Tip 2\n3. Tip 3' },
        ],
      }),
      extractRulesFromParsed: vi.fn().mockReturnValue({
        bestPractices: ['Practice 1', 'Practice 2'],
        avoid: ['Avoid 1', 'Avoid 2'],
        checklist: ['Check 1'],
        tips: ['Tip 1', 'Tip 2', 'Tip 3'],
      }),
    },
    MarkdownParserError: class MarkdownParserError extends Error {
      constructor(
        message: string,
        public code: string,
        public statusCode: number = 400
      ) {
        super(message);
        this.name = 'MarkdownParserError';
      }
    },
  };
});

import modelRulesService, {
  getRules,
  getAllModels,
  getModelsByCategory,
  getModelInfo,
  isValidModel,
  clearCache,
  getModelComparison,
  ModelRulesError,
  MODEL_REGISTRY,
  type ModelType,
} from '../model-rules.service.js';
import markdownParserService from '../markdown-parser.service.js';

// ============================================================================
// GetRules Tests
// ============================================================================

describe('ModelRulesService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    clearCache(); // Clear cache between tests

    // Reset mock implementations to defaults using vi.mocked
    vi.mocked(markdownParserService.parseMarkdownFile).mockResolvedValue({
      content:
        '# Model Rules\n\n## Best Practices\n- Practice 1\n- Practice 2',
      metadata: {},
      sections: [
        { title: 'Best Practices', content: '- Practice 1\n- Practice 2' },
        { title: 'Avoid', content: '- Avoid 1\n- Avoid 2' },
        { title: 'Tips', content: '1. Tip 1\n2. Tip 2\n3. Tip 3' },
      ],
    } as any);

    vi.mocked(markdownParserService.extractRulesFromParsed).mockReturnValue({
      bestPractices: ['Practice 1', 'Practice 2'],
      avoid: ['Avoid 1', 'Avoid 2'],
      checklist: ['Check 1'],
      tips: ['Tip 1', 'Tip 2', 'Tip 3'],
    });
  });

  afterEach(() => {
    clearCache();
  });

  describe('getRules()', () => {
    it('should return rules for a valid model', async () => {
      // Act
      const rules = await getRules('claude-4.5');

      // Assert
      expect(rules).toBeDefined();
      expect(rules.model).toBe('claude-4.5');
      expect(rules.modelInfo).toBeDefined();
      expect(rules.modelInfo.slug).toBe('claude-4.5');
    });

    it('should return bestPractices, avoid, checklist, and tips', async () => {
      // Act
      const rules = await getRules('claude-4.5');

      // Assert
      expect(rules.bestPractices).toBeDefined();
      expect(Array.isArray(rules.bestPractices)).toBe(true);
      expect(rules.avoid).toBeDefined();
      expect(Array.isArray(rules.avoid)).toBe(true);
      expect(rules.checklist).toBeDefined();
      expect(Array.isArray(rules.checklist)).toBe(true);
      expect(rules.tips).toBeDefined();
      expect(Array.isArray(rules.tips)).toBe(true);
    });

    it('should return rules for each supported model', async () => {
      // Arrange
      const models: ModelType[] = [
        'claude-4.5',
        'gpt-5.2',
        'grok-4.1',
        'gemini-3-pro',
        'nano-banana',
        'grok-aurora',
        'grok-imagine',
        'perplexity-pro',
      ];

      // Act & Assert
      for (const model of models) {
        clearCache(); // Clear cache to test each model
        const rules = await getRules(model);
        expect(rules.model).toBe(model);
        expect(rules.modelInfo.slug).toBe(model);
      }
    });

    it('should throw ModelRulesError for unknown model', async () => {
      // Act & Assert
      await expect(getRules('unknown-model' as ModelType)).rejects.toThrow(
        ModelRulesError
      );
      await expect(getRules('invalid' as ModelType)).rejects.toMatchObject({
        code: 'UNKNOWN_MODEL',
        statusCode: 400,
      });
    });

    it('should include model info in rules', async () => {
      // Act
      const rules = await getRules('claude-4.5');

      // Assert
      expect(rules.modelInfo.name).toBe('Claude 4.5 Opus/Sonnet');
      expect(rules.modelInfo.producer).toBe('Anthropic');
      expect(rules.modelInfo.category).toBe('llm');
    });

    it('should enhance rules with model-specific additions', async () => {
      // Act
      const claudeRules = await getRules('claude-4.5');

      // Assert - Claude should have XML tags tip
      expect(
        claudeRules.tips.some((t) => t.toLowerCase().includes('xml'))
      ).toBe(true);
    });

    it('should add Gemini-specific temperature warning', async () => {
      // Act
      clearCache();
      const geminiRules = await getRules('gemini-3-pro');

      // Assert - The enhancement only adds if not already present in mock data
      // Since mock data doesn't have temperature warning, it should be added
      expect(
        geminiRules.avoid.some(
          (a) =>
            a.toLowerCase().includes('temperatura') ||
            a.toLowerCase().includes('temperature') ||
            a.toLowerCase().includes('1.0')
        )
      ).toBe(true);
    });

    it('should add Perplexity-specific warnings', async () => {
      // Act
      clearCache();
      const perplexityRules = await getRules('perplexity-pro');

      // Assert
      expect(
        perplexityRules.avoid.some((a) => a.toLowerCase().includes('few-shot'))
      ).toBe(true);
    });
  });

  // ============================================================================
  // Caching Tests
  // ============================================================================

  describe('caching', () => {
    it('should cache rules after first fetch', async () => {
      // Act - first call
      await getRules('claude-4.5');
      const parseCallsAfterFirst = vi.mocked(
        markdownParserService.parseMarkdownFile
      ).mock.calls.length;

      // Act - second call
      await getRules('claude-4.5');
      const parseCallsAfterSecond = vi.mocked(
        markdownParserService.parseMarkdownFile
      ).mock.calls.length;

      // Assert - should not call parser again
      expect(parseCallsAfterSecond).toBe(parseCallsAfterFirst);
    });

    it('should return same result from cache', async () => {
      // Act
      const rules1 = await getRules('claude-4.5');
      const rules2 = await getRules('claude-4.5');

      // Assert
      expect(rules1).toEqual(rules2);
    });

    it('should clear cache when clearCache is called', async () => {
      // Arrange - populate cache
      await getRules('claude-4.5');
      const callsBeforeClear = vi.mocked(
        markdownParserService.parseMarkdownFile
      ).mock.calls.length;

      // Act - clear cache and fetch again
      clearCache();
      await getRules('claude-4.5');
      const callsAfterClear = vi.mocked(
        markdownParserService.parseMarkdownFile
      ).mock.calls.length;

      // Assert - should call parser again after cache clear
      expect(callsAfterClear).toBeGreaterThan(callsBeforeClear);
    });

    it('should clear cache for specific model only', async () => {
      // Arrange - populate cache for multiple models
      await getRules('claude-4.5');
      await getRules('gpt-5.2');
      const callsBeforeClear = vi.mocked(
        markdownParserService.parseMarkdownFile
      ).mock.calls.length;

      // Act - clear cache for claude only
      clearCache('claude-4.5');
      await getRules('claude-4.5'); // Should call parser
      await getRules('gpt-5.2'); // Should use cache
      const callsAfterClear = vi.mocked(
        markdownParserService.parseMarkdownFile
      ).mock.calls.length;

      // Assert - only one additional call (for claude)
      expect(callsAfterClear).toBe(callsBeforeClear + 1);
    });
  });

  // ============================================================================
  // GetAllModels Tests
  // ============================================================================

  describe('getAllModels()', () => {
    it('should return all registered models', () => {
      // Act
      const models = getAllModels();

      // Assert
      expect(models.length).toBe(Object.keys(MODEL_REGISTRY).length);
      expect(models.length).toBeGreaterThan(0);
    });

    it('should return ModelInfo objects', () => {
      // Act
      const models = getAllModels();

      // Assert
      models.forEach((model) => {
        expect(model.slug).toBeDefined();
        expect(model.name).toBeDefined();
        expect(model.producer).toBeDefined();
        expect(model.category).toBeDefined();
        expect(model.specialization).toBeDefined();
        expect(model.markdownFile).toBeDefined();
      });
    });
  });

  // ============================================================================
  // GetModelsByCategory Tests
  // ============================================================================

  describe('getModelsByCategory()', () => {
    it('should return LLM models', () => {
      // Act
      const llmModels = getModelsByCategory('llm');

      // Assert
      expect(llmModels.length).toBeGreaterThan(0);
      llmModels.forEach((model) => {
        expect(model.category).toBe('llm');
      });
    });

    it('should return image models', () => {
      // Act
      const imageModels = getModelsByCategory('image');

      // Assert
      expect(imageModels.length).toBeGreaterThan(0);
      imageModels.forEach((model) => {
        expect(model.category).toBe('image');
      });
    });

    it('should return video models', () => {
      // Act
      const videoModels = getModelsByCategory('video');

      // Assert
      expect(videoModels.length).toBeGreaterThan(0);
      videoModels.forEach((model) => {
        expect(model.category).toBe('video');
      });
    });

    it('should return search models', () => {
      // Act
      const searchModels = getModelsByCategory('search');

      // Assert
      expect(searchModels.length).toBeGreaterThan(0);
      searchModels.forEach((model) => {
        expect(model.category).toBe('search');
      });
    });

    it('should return empty array for non-existent category', () => {
      // Act
      const models = getModelsByCategory('nonexistent' as any);

      // Assert
      expect(models).toEqual([]);
    });
  });

  // ============================================================================
  // GetModelInfo Tests
  // ============================================================================

  describe('getModelInfo()', () => {
    it('should return model info for valid model', () => {
      // Act
      const info = getModelInfo('claude-4.5');

      // Assert
      expect(info).toBeDefined();
      expect(info?.slug).toBe('claude-4.5');
      expect(info?.name).toBe('Claude 4.5 Opus/Sonnet');
    });

    it('should return null for invalid model', () => {
      // Act
      const info = getModelInfo('invalid' as ModelType);

      // Assert
      expect(info).toBeNull();
    });
  });

  // ============================================================================
  // IsValidModel Tests
  // ============================================================================

  describe('isValidModel()', () => {
    it('should return true for valid models', () => {
      expect(isValidModel('claude-4.5')).toBe(true);
      expect(isValidModel('gpt-5.2')).toBe(true);
      expect(isValidModel('gemini-3-pro')).toBe(true);
      expect(isValidModel('grok-4.1')).toBe(true);
      expect(isValidModel('perplexity-pro')).toBe(true);
      expect(isValidModel('nano-banana')).toBe(true);
      expect(isValidModel('grok-aurora')).toBe(true);
      expect(isValidModel('grok-imagine')).toBe(true);
    });

    it('should return false for invalid models', () => {
      expect(isValidModel('invalid')).toBe(false);
      expect(isValidModel('')).toBe(false);
      expect(isValidModel('gpt-4')).toBe(false);
      expect(isValidModel('claude')).toBe(false);
    });
  });

  // ============================================================================
  // GetModelComparison Tests
  // ============================================================================

  describe('getModelComparison()', () => {
    it('should return comparison data for all models', () => {
      // Act
      const comparison = getModelComparison();

      // Assert
      expect(comparison).toBeDefined();
      expect(comparison.dosłowność).toBeDefined();
      expect(comparison.struktura).toBeDefined();
      expect(comparison.temperatura).toBeDefined();
    });

    it('should include all models in each comparison category', () => {
      // Act
      const comparison = getModelComparison();
      const allModels = Object.keys(MODEL_REGISTRY);

      // Assert
      Object.values(comparison).forEach((category) => {
        allModels.forEach((model) => {
          expect(category[model as ModelType]).toBeDefined();
        });
      });
    });

    it('should have specific values for key models', () => {
      // Act
      const comparison = getModelComparison();

      // Assert
      expect(comparison.struktura['claude-4.5']).toBe('XML tagi');
      expect(comparison.struktura['gpt-5.2']).toBe('Markdown');
      expect(comparison.temperatura['gemini-3-pro']).toContain('NIE ZMIENIAC');
    });
  });

  // ============================================================================
  // MODEL_REGISTRY Tests
  // ============================================================================

  describe('MODEL_REGISTRY', () => {
    it('should contain all expected models', () => {
      expect(MODEL_REGISTRY['claude-4.5']).toBeDefined();
      expect(MODEL_REGISTRY['gpt-5.2']).toBeDefined();
      expect(MODEL_REGISTRY['grok-4.1']).toBeDefined();
      expect(MODEL_REGISTRY['gemini-3-pro']).toBeDefined();
      expect(MODEL_REGISTRY['nano-banana']).toBeDefined();
      expect(MODEL_REGISTRY['grok-aurora']).toBeDefined();
      expect(MODEL_REGISTRY['grok-imagine']).toBeDefined();
      expect(MODEL_REGISTRY['perplexity-pro']).toBeDefined();
    });

    it('should have correct structure for each model', () => {
      Object.values(MODEL_REGISTRY).forEach((model) => {
        expect(model.slug).toBeDefined();
        expect(model.name).toBeDefined();
        expect(model.producer).toBeDefined();
        expect(['llm', 'image', 'video', 'search']).toContain(model.category);
        expect(model.specialization).toBeDefined();
        expect(model.markdownFile).toMatch(/\.md$/);
      });
    });
  });

  // ============================================================================
  // Error Handling Tests
  // ============================================================================

  describe('error handling', () => {
    it('should throw error when markdown parsing fails', async () => {
      // Arrange - use a generic error since mocked MarkdownParserError doesn't pass instanceof check
      const parseError = new Error('File not found');
      vi.mocked(markdownParserService.parseMarkdownFile).mockRejectedValueOnce(
        parseError
      );

      clearCache();

      // Act & Assert - the error is re-thrown as-is since it's not a MarkdownParserError instance
      await expect(getRules('claude-4.5')).rejects.toThrow('File not found');
    });

    it('should handle unknown model gracefully', async () => {
      // Act & Assert
      await expect(getRules('nonexistent-model' as any)).rejects.toThrow(
        ModelRulesError
      );
      await expect(getRules('nonexistent-model' as any)).rejects.toMatchObject({
        code: 'UNKNOWN_MODEL',
      });
    });
  });

  // ============================================================================
  // ModelRulesError Tests
  // ============================================================================

  describe('ModelRulesError', () => {
    it('should create error with correct properties', () => {
      // Act
      const error = new ModelRulesError('Test message', 'TEST_CODE', 404);

      // Assert
      expect(error).toBeInstanceOf(Error);
      expect(error).toBeInstanceOf(ModelRulesError);
      expect(error.message).toBe('Test message');
      expect(error.code).toBe('TEST_CODE');
      expect(error.statusCode).toBe(404);
      expect(error.name).toBe('ModelRulesError');
    });

    it('should default statusCode to 400', () => {
      // Act
      const error = new ModelRulesError('Test', 'TEST');

      // Assert
      expect(error.statusCode).toBe(400);
    });
  });
});
