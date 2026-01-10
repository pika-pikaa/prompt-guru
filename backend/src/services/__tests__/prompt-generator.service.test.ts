/**
 * Prompt Generator Service Unit Tests
 *
 * Tests for prompt generation across different AI models and task types.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock the model-rules service - must use inline functions since vi.mock is hoisted
vi.mock('../model-rules.service.js', () => {
  const validModels = [
    'claude-4.5',
    'gpt-5.2',
    'gemini-3-pro',
    'grok-4.1',
    'perplexity-pro',
    'nano-banana',
    'grok-aurora',
    'grok-imagine',
  ];

  return {
    default: {
      isValidModel: vi.fn((model: string) => validModels.includes(model)),
      getRules: vi.fn().mockResolvedValue({
        bestPractices: ['Use clear instructions', 'Be specific'],
        avoid: ['Vague language', 'Ambiguous requests'],
        checklist: ['Define goal', 'Set constraints'],
        tips: [
          'Tip 1: Use structured format',
          'Tip 2: Provide context',
          'Tip 3: Set expectations',
          'Tip 4: Include examples',
          'Tip 5: Define output format',
        ],
      }),
    },
    ModelRulesError: class ModelRulesError extends Error {
      constructor(
        message: string,
        public code: string,
        public statusCode: number = 400
      ) {
        super(message);
        this.name = 'ModelRulesError';
      }
    },
  };
});

import {
  generatePrompt,
  PromptGeneratorError,
  type GenerationInput,
  type TaskType,
} from '../prompt-generator.service.js';
import modelRulesService from '../model-rules.service.js';

// ============================================================================
// Test Data Factories
// ============================================================================

const createGenerationInput = (
  overrides: Partial<GenerationInput> = {}
): GenerationInput => ({
  goal: 'Write a function that sorts an array',
  model: 'claude-4.5',
  ...overrides,
});

// ============================================================================
// Generate Prompt Tests
// ============================================================================

describe('PromptGeneratorService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Reset mock implementations to defaults using vi.mocked
    vi.mocked(modelRulesService.isValidModel).mockImplementation(
      (model: string) => {
        const validModels = [
          'claude-4.5',
          'gpt-5.2',
          'gemini-3-pro',
          'grok-4.1',
          'perplexity-pro',
          'nano-banana',
          'grok-aurora',
          'grok-imagine',
        ];
        return validModels.includes(model);
      }
    );
    vi.mocked(modelRulesService.getRules).mockResolvedValue({
      bestPractices: ['Use clear instructions', 'Be specific'],
      avoid: ['Vague language', 'Ambiguous requests'],
      checklist: ['Define goal', 'Set constraints'],
      tips: [
        'Tip 1: Use structured format',
        'Tip 2: Provide context',
        'Tip 3: Set expectations',
        'Tip 4: Include examples',
        'Tip 5: Define output format',
      ],
      model: 'claude-4.5',
      modelInfo: {
        slug: 'claude-4.5',
        name: 'Claude 4.5 Opus/Sonnet',
        producer: 'Anthropic',
        category: 'llm',
        specialization: 'Najwyzsza jakosc, zlozone zadania',
        markdownFile: 'claude-4.md',
      },
    } as any);
  });

  describe('generatePrompt()', () => {
    it('should return 3 versions (extended, standard, minimal)', async () => {
      // Arrange
      const input = createGenerationInput();

      // Act
      const result = await generatePrompt(input);

      // Assert
      expect(result.versions).toBeDefined();
      expect(result.versions.extended).toBeDefined();
      expect(result.versions.standard).toBeDefined();
      expect(result.versions.minimal).toBeDefined();

      expect(result.versions.extended.version).toBe('extended');
      expect(result.versions.standard.version).toBe('standard');
      expect(result.versions.minimal.version).toBe('minimal');
    });

    it('should include content and token estimates in each version', async () => {
      // Arrange
      const input = createGenerationInput();

      // Act
      const result = await generatePrompt(input);

      // Assert
      for (const version of Object.values(result.versions)) {
        expect(version.content).toBeDefined();
        expect(typeof version.content).toBe('string');
        expect(version.content.length).toBeGreaterThan(0);
        expect(version.tokenEstimate).toBeDefined();
        expect(typeof version.tokenEstimate).toBe('number');
        expect(version.tokenEstimate).toBeGreaterThan(0);
      }
    });

    it('should return extended version with more tokens than minimal', async () => {
      // Arrange
      const input = createGenerationInput({
        context: 'This is additional context for the task',
        constraints: ['Must be O(n log n)', 'Use TypeScript'],
        examples: ['Example input: [3, 1, 2]'],
      });

      // Act
      const result = await generatePrompt(input);

      // Assert
      expect(result.versions.extended.tokenEstimate).toBeGreaterThan(
        result.versions.minimal.tokenEstimate
      );
    });

    it('should return techniques used in generation', async () => {
      // Arrange
      const input = createGenerationInput({
        examples: ['Example 1'],
        constraints: ['Constraint 1'],
      });

      // Act
      const result = await generatePrompt(input);

      // Assert
      expect(result.techniques).toBeDefined();
      expect(Array.isArray(result.techniques)).toBe(true);
      expect(result.techniques.length).toBeGreaterThan(0);
    });

    it('should return tips from model rules', async () => {
      // Arrange
      const input = createGenerationInput();

      // Act
      const result = await generatePrompt(input);

      // Assert
      expect(result.tips).toBeDefined();
      expect(Array.isArray(result.tips)).toBe(true);
      expect(result.tips.length).toBeLessThanOrEqual(5); // Top 5 tips
    });

    it('should throw PromptGeneratorError for unknown model', async () => {
      // Arrange
      vi.mocked(modelRulesService.isValidModel).mockReturnValue(false);

      const input = createGenerationInput({
        model: 'unknown-model' as any,
      });

      // Act & Assert
      await expect(generatePrompt(input)).rejects.toThrow(PromptGeneratorError);
      await expect(generatePrompt(input)).rejects.toMatchObject({
        code: 'UNKNOWN_MODEL',
        statusCode: 400,
      });
    });

    // ========================================================================
    // Model-Specific Output Tests
    // ========================================================================

    describe('model-specific output', () => {
      it('should produce Claude-specific output with XML tags', async () => {
        // Arrange
        const input = createGenerationInput({ model: 'claude-4.5' });

        // Act
        const result = await generatePrompt(input);

        // Assert - Claude uses XML tags
        expect(result.versions.extended.content).toContain('<task>');
        expect(result.versions.extended.content).toContain('</task>');
        expect(result.model).toBe('claude-4.5');
      });

      it('should produce Claude-specific output with context XML when context provided', async () => {
        // Arrange
        const input = createGenerationInput({
          model: 'claude-4.5',
          context: 'We are building a sorting library',
        });

        // Act
        const result = await generatePrompt(input);

        // Assert
        expect(result.versions.extended.content).toContain('<context>');
        expect(result.versions.extended.content).toContain('</context>');
      });

      it('should produce GPT-specific output with Markdown headers', async () => {
        // Arrange
        const input = createGenerationInput({ model: 'gpt-5.2' });

        // Act
        const result = await generatePrompt(input);

        // Assert - GPT uses Markdown
        expect(result.versions.extended.content).toContain('##');
        expect(result.model).toBe('gpt-5.2');
      });

      it('should produce GPT-specific output with role section', async () => {
        // Arrange
        const input = createGenerationInput({ model: 'gpt-5.2' });

        // Act
        const result = await generatePrompt(input);

        // Assert
        expect(result.versions.extended.content.toLowerCase()).toContain('rola');
      });

      it('should produce Gemini-specific shorter prompts', async () => {
        // Arrange
        const claudeInput = createGenerationInput({ model: 'claude-4.5' });
        const geminiInput = createGenerationInput({ model: 'gemini-3-pro' });

        // Act
        const claudeResult = await generatePrompt(claudeInput);
        const geminiResult = await generatePrompt(geminiInput);

        // Assert - Gemini prompts should be more concise
        expect(geminiResult.versions.extended.content.length).toBeLessThan(
          claudeResult.versions.extended.content.length
        );
        expect(geminiResult.model).toBe('gemini-3-pro');
      });

      it('should produce Perplexity-specific search-style queries', async () => {
        // Arrange
        const input = createGenerationInput({ model: 'perplexity-pro' });

        // Act
        const result = await generatePrompt(input);

        // Assert - Perplexity should not have role-playing
        expect(result.versions.extended.content.toLowerCase()).not.toContain(
          'jestes ekspertem'
        );
        expect(result.model).toBe('perplexity-pro');
      });

      it('should produce Nano Banana image prompt with natural language', async () => {
        // Arrange
        const input = createGenerationInput({
          model: 'nano-banana',
          goal: 'A cat sitting on a windowsill',
        });

        // Act
        const result = await generatePrompt(input);

        // Assert - image prompt structure
        expect(result.versions.extended.content).toContain('[');
        expect(result.model).toBe('nano-banana');
      });

      it('should produce Grok Aurora image prompt', async () => {
        // Arrange
        const input = createGenerationInput({
          model: 'grok-aurora',
          goal: 'A mountain landscape at sunset',
        });

        // Act
        const result = await generatePrompt(input);

        // Assert
        expect(result.model).toBe('grok-aurora');
        expect(result.versions.extended.content.length).toBeGreaterThan(0);
      });

      it('should produce Grok Imagine video prompt with motion elements', async () => {
        // Arrange
        const input = createGenerationInput({
          model: 'grok-imagine',
          goal: 'A bird flying over the ocean',
        });

        // Act
        const result = await generatePrompt(input);

        // Assert - video prompts should mention motion/camera
        expect(result.model).toBe('grok-imagine');
      });
    });
  });

  // ============================================================================
  // Task Type Inference Tests
  // ============================================================================

  describe('inferTaskType()', () => {
    it('should infer code-generation from keywords', async () => {
      // Arrange
      const input = createGenerationInput({
        goal: 'Write code to implement a binary search',
      });

      // Act
      const result = await generatePrompt(input);

      // Assert
      expect(result.taskType).toBe('code-generation');
    });

    it('should infer code-review from keywords', async () => {
      // Arrange
      const input = createGenerationInput({
        goal: 'Code review this function for bugs',
      });

      // Act
      const result = await generatePrompt(input);

      // Assert
      expect(result.taskType).toBe('code-review');
    });

    it('should infer analysis from keywords', async () => {
      // Arrange
      const input = createGenerationInput({
        goal: 'Analyze this dataset for trends',
      });

      // Act
      const result = await generatePrompt(input);

      // Assert
      expect(result.taskType).toBe('analysis');
    });

    it('should infer translation from keywords', async () => {
      // Arrange
      const input = createGenerationInput({
        goal: 'Translate this document to Spanish',
      });

      // Act
      const result = await generatePrompt(input);

      // Assert
      expect(result.taskType).toBe('translation');
    });

    it('should infer summarization from keywords', async () => {
      // Arrange
      const input = createGenerationInput({
        goal: 'Summarize this article',
      });

      // Act
      const result = await generatePrompt(input);

      // Assert
      expect(result.taskType).toBe('summarization');
    });

    it('should infer system-prompt from keywords', async () => {
      // Arrange
      const input = createGenerationInput({
        goal: 'Create a system prompt for a customer service chatbot',
      });

      // Act
      const result = await generatePrompt(input);

      // Assert
      expect(result.taskType).toBe('system-prompt');
    });

    it('should infer image-generation from keywords', async () => {
      // Arrange
      const input = createGenerationInput({
        goal: 'Generate an image of a sunset',
      });

      // Act
      const result = await generatePrompt(input);

      // Assert
      expect(result.taskType).toBe('image-generation');
    });

    it('should infer video-generation from keywords', async () => {
      // Arrange
      const input = createGenerationInput({
        goal: 'Create a video animation of a bouncing ball',
      });

      // Act
      const result = await generatePrompt(input);

      // Assert
      expect(result.taskType).toBe('video-generation');
    });

    it('should default to general for unrecognized goals', async () => {
      // Arrange
      const input = createGenerationInput({
        goal: 'Help me with something',
      });

      // Act
      const result = await generatePrompt(input);

      // Assert
      expect(result.taskType).toBe('general');
    });

    it('should use explicit taskType when provided', async () => {
      // Arrange
      const input = createGenerationInput({
        goal: 'Do something with this data',
        taskType: 'analysis',
      });

      // Act
      const result = await generatePrompt(input);

      // Assert
      expect(result.taskType).toBe('analysis');
    });

    it('should include anti-overengineering for code tasks', async () => {
      // Arrange
      const input = createGenerationInput({
        model: 'claude-4.5',
        goal: 'Write code to parse JSON',
        taskType: 'code-generation',
      });

      // Act
      const result = await generatePrompt(input);

      // Assert
      expect(result.versions.extended.content.toLowerCase()).toContain(
        'over'
      );
      expect(result.techniques).toContain('Anti-overengineering directive');
    });
  });

  // ============================================================================
  // Edge Cases
  // ============================================================================

  describe('edge cases', () => {
    it('should handle empty context gracefully', async () => {
      // Arrange
      const input = createGenerationInput({
        context: '',
      });

      // Act
      const result = await generatePrompt(input);

      // Assert
      expect(result).toBeDefined();
      expect(result.versions.extended.content).toBeDefined();
    });

    it('should handle empty constraints gracefully', async () => {
      // Arrange
      const input = createGenerationInput({
        constraints: [],
      });

      // Act
      const result = await generatePrompt(input);

      // Assert
      expect(result).toBeDefined();
    });

    it('should handle empty examples gracefully', async () => {
      // Arrange
      const input = createGenerationInput({
        examples: [],
      });

      // Act
      const result = await generatePrompt(input);

      // Assert
      expect(result).toBeDefined();
    });

    it('should handle very long goals', async () => {
      // Arrange
      const longGoal = 'Write a function '.repeat(100);
      const input = createGenerationInput({
        goal: longGoal,
      });

      // Act
      const result = await generatePrompt(input);

      // Assert
      expect(result).toBeDefined();
      expect(result.versions.extended.content).toContain(longGoal.slice(0, 50));
    });

    it('should handle special characters in goal', async () => {
      // Arrange
      const input = createGenerationInput({
        goal: 'Parse JSON with <script> tags & special "characters"',
      });

      // Act
      const result = await generatePrompt(input);

      // Assert
      expect(result).toBeDefined();
      expect(result.versions.minimal.content).toContain('&');
    });
  });

  // ============================================================================
  // PromptGeneratorError Tests
  // ============================================================================

  describe('PromptGeneratorError', () => {
    it('should create error with correct properties', () => {
      // Act
      const error = new PromptGeneratorError('Test message', 'TEST_CODE', 422);

      // Assert
      expect(error).toBeInstanceOf(Error);
      expect(error).toBeInstanceOf(PromptGeneratorError);
      expect(error.message).toBe('Test message');
      expect(error.code).toBe('TEST_CODE');
      expect(error.statusCode).toBe(422);
      expect(error.name).toBe('PromptGeneratorError');
    });
  });
});
