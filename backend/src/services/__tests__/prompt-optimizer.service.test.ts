/**
 * Prompt Optimizer Service Unit Tests
 *
 * Tests for prompt analysis, issue detection, and model-specific optimizations.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock the model-rules service
vi.mock('../model-rules.service.js', () => {
  return {
    default: {
      isValidModel: vi.fn((model: string) => {
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
      }),
    },
  };
});

import promptOptimizerService, {
  optimizePrompt,
  analyzePrompt,
  PromptOptimizerError,
  type OptimizationInput,
  type OptimizationIssue,
} from '../prompt-optimizer.service.js';
import modelRulesService from '../model-rules.service.js';

// ============================================================================
// Test Data Factories
// ============================================================================

const createOptimizationInput = (
  overrides: Partial<OptimizationInput> = {}
): OptimizationInput => ({
  originalPrompt: 'Think about this problem and solve it.',
  targetModel: 'claude-4.5',
  ...overrides,
});

// ============================================================================
// Optimize Prompt Tests
// ============================================================================

describe('PromptOptimizerService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(modelRulesService.isValidModel).mockReturnValue(true);
  });

  describe('optimizePrompt()', () => {
    it('should return optimized prompt with changes and issues', async () => {
      // Arrange
      const input = createOptimizationInput();

      // Act
      const result = await optimizePrompt(input);

      // Assert
      expect(result).toBeDefined();
      expect(result.optimizedPrompt).toBeDefined();
      expect(result.changes).toBeDefined();
      expect(result.issues).toBeDefined();
      expect(result.beforeAfter).toBeDefined();
      expect(result.tokenDelta).toBeDefined();
    });

    it('should return before and after in diff format', async () => {
      // Arrange
      const input = createOptimizationInput({
        originalPrompt: 'Original prompt text',
      });

      // Act
      const result = await optimizePrompt(input);

      // Assert
      expect(result.beforeAfter.before).toBe('Original prompt text');
      expect(result.beforeAfter.after).toBe(result.optimizedPrompt);
    });

    it('should calculate token delta correctly', async () => {
      // Arrange
      const input = createOptimizationInput({
        originalPrompt: 'Short prompt',
        targetModel: 'gpt-5.2', // GPT adds structure
      });

      // Act
      const result = await optimizePrompt(input);

      // Assert
      expect(typeof result.tokenDelta).toBe('number');
    });

    it('should throw PromptOptimizerError for unknown model', async () => {
      // Arrange
      vi.mocked(modelRulesService.isValidModel).mockReturnValue(false);

      const input = createOptimizationInput({
        targetModel: 'unknown-model' as any,
      });

      // Act & Assert
      await expect(optimizePrompt(input)).rejects.toThrow(PromptOptimizerError);
      await expect(optimizePrompt(input)).rejects.toMatchObject({
        code: 'UNKNOWN_MODEL',
        statusCode: 400,
      });
    });
  });

  // ============================================================================
  // Issue Detection Tests
  // ============================================================================

  describe('issue detection', () => {
    it('should detect issues in prompt', async () => {
      // Arrange
      const input = createOptimizationInput({
        originalPrompt: 'Think about this problem and solve it',
        targetModel: 'claude-4.5',
      });

      // Act
      const result = await optimizePrompt(input);

      // Assert
      expect(result.issues.length).toBeGreaterThan(0);
    });

    it('should detect Claude "think" word usage', async () => {
      // Arrange
      const input = createOptimizationInput({
        originalPrompt:
          'I want you to think about this problem. Think through the solution.',
        targetModel: 'claude-4.5',
      });

      // Act
      const result = await optimizePrompt(input);

      // Assert
      const thinkIssue = result.issues.find(
        (i) => i.code === 'CLAUDE_THINK_WORD'
      );
      expect(thinkIssue).toBeDefined();
      expect(thinkIssue?.type).toBe('critical');
    });

    it('should detect lack of XML structure for Claude with prompts over 200 chars', async () => {
      // Arrange - prompt must be over 200 characters to trigger this check
      const input = createOptimizationInput({
        originalPrompt:
          'This is a very long prompt without any XML structure that should trigger the suggestion about using XML tags for better organization of the content and improved processing by Claude models. It needs to be over two hundred characters long to trigger this check.',
        targetModel: 'claude-4.5',
      });

      // Act
      const result = await optimizePrompt(input);

      // Assert
      const xmlIssue = result.issues.find((i) => i.code === 'CLAUDE_NO_XML');
      expect(xmlIssue).toBeDefined();
      expect(xmlIssue?.type).toBe('suggestion');
    });

    it('should detect vague instructions for Claude', async () => {
      // Arrange
      const input = createOptimizationInput({
        originalPrompt: 'mozesz sprobuj zrobic to zadanie jesli chcesz',
        targetModel: 'claude-4.5',
      });

      // Act
      const result = await optimizePrompt(input);

      // Assert
      const vagueIssue = result.issues.find(
        (i) => i.code === 'CLAUDE_VAGUE_INSTRUCTIONS'
      );
      expect(vagueIssue).toBeDefined();
      expect(vagueIssue?.type).toBe('warning');
    });

    it('should detect GPT mixed signals', async () => {
      // Arrange
      const input = createOptimizationInput({
        originalPrompt: 'Preferuj JSON, ale XML tez ok',
        targetModel: 'gpt-5.2',
      });

      // Act
      const result = await optimizePrompt(input);

      // Assert
      const mixedIssue = result.issues.find(
        (i) => i.code === 'GPT_MIXED_SIGNALS'
      );
      expect(mixedIssue).toBeDefined();
      expect(mixedIssue?.type).toBe('critical');
    });

    it('should detect GPT lack of structure for prompts over 300 chars', async () => {
      // Arrange - prompt must be over 300 characters to trigger this check
      const input = createOptimizationInput({
        originalPrompt:
          'This is a very long prompt that has no markdown structure at all and just keeps going on and on without any headers or organization which makes it harder for GPT to process effectively. It needs some markdown headers to be better organized. Adding more text to ensure we exceed the three hundred character threshold that triggers this particular check in the GPT optimization logic.',
        targetModel: 'gpt-5.2',
      });

      // Act
      const result = await optimizePrompt(input);

      // Assert
      const structureIssue = result.issues.find(
        (i) => i.code === 'GPT_NO_STRUCTURE'
      );
      expect(structureIssue).toBeDefined();
      expect(structureIssue?.type).toBe('suggestion');
    });

    it('should detect Gemini prompt too long', async () => {
      // Arrange
      const longPrompt = 'A'.repeat(600);
      const input = createOptimizationInput({
        originalPrompt: longPrompt,
        targetModel: 'gemini-3-pro',
      });

      // Act
      const result = await optimizePrompt(input);

      // Assert
      const lengthIssue = result.issues.find(
        (i) => i.code === 'GEMINI_TOO_LONG'
      );
      expect(lengthIssue).toBeDefined();
      expect(lengthIssue?.type).toBe('warning');
    });

    it('should detect Gemini manual chain-of-thought', async () => {
      // Arrange
      const input = createOptimizationInput({
        originalPrompt: 'Rozwiaz to krok po kroku, step by step',
        targetModel: 'gemini-3-pro',
      });

      // Act
      const result = await optimizePrompt(input);

      // Assert
      const cotIssue = result.issues.find((i) => i.code === 'GEMINI_MANUAL_COT');
      expect(cotIssue).toBeDefined();
      expect(cotIssue?.type).toBe('suggestion');
    });

    it('should detect Perplexity role-playing', async () => {
      // Arrange
      const input = createOptimizationInput({
        originalPrompt: 'Jestes ekspertem od AI. Powiedz mi o LLMs.',
        targetModel: 'perplexity-pro',
      });

      // Act
      const result = await optimizePrompt(input);

      // Assert
      const roleIssue = result.issues.find(
        (i) => i.code === 'PERPLEXITY_ROLE_PLAYING'
      );
      expect(roleIssue).toBeDefined();
      expect(roleIssue?.type).toBe('critical');
    });

    it('should detect Perplexity few-shot examples', async () => {
      // Arrange
      const input = createOptimizationInput({
        originalPrompt: 'Przyklad: Input: 5, Output: 10. Teraz oblicz dla 7.',
        targetModel: 'perplexity-pro',
      });

      // Act
      const result = await optimizePrompt(input);

      // Assert
      const fewShotIssue = result.issues.find(
        (i) => i.code === 'PERPLEXITY_FEW_SHOT'
      );
      expect(fewShotIssue).toBeDefined();
      expect(fewShotIssue?.type).toBe('critical');
    });

    it('should detect Nano Banana technical parameters', async () => {
      // Arrange
      const input = createOptimizationInput({
        originalPrompt: 'A cat, octane render, 8k uhd, hyperdetailed',
        targetModel: 'nano-banana',
      });

      // Act
      const result = await optimizePrompt(input);

      // Assert
      const techIssue = result.issues.find(
        (i) => i.code === 'NANO_BANANA_TECHNICAL'
      );
      expect(techIssue).toBeDefined();
      expect(techIssue?.type).toBe('warning');
    });

    it('should detect Grok Aurora/Imagine prompt too long', async () => {
      // Arrange
      const longPrompt = 'A'.repeat(800);
      const input = createOptimizationInput({
        originalPrompt: longPrompt,
        targetModel: 'grok-aurora',
      });

      // Act
      const result = await optimizePrompt(input);

      // Assert
      const lengthIssue = result.issues.find(
        (i) => i.code === 'GROK_IMAGE_TOO_LONG'
      );
      expect(lengthIssue).toBeDefined();
      expect(lengthIssue?.type).toBe('warning');
    });

    it('should add user-reported issues', async () => {
      // Arrange
      const input = createOptimizationInput({
        originalPrompt: 'Simple prompt',
        targetModel: 'claude-4.5',
        issues: ['Output is too verbose', 'Missing code examples'],
      });

      // Act
      const result = await optimizePrompt(input);

      // Assert
      const userIssues = result.issues.filter(
        (i) => i.code === 'USER_REPORTED'
      );
      expect(userIssues.length).toBe(2);
      expect(userIssues[0].type).toBe('warning');
    });
  });

  // ============================================================================
  // Claude-Specific Optimization Tests
  // ============================================================================

  describe('Claude-specific optimization', () => {
    it('should replace "think" with alternatives', async () => {
      // Arrange
      const input = createOptimizationInput({
        originalPrompt: 'Think about this problem carefully',
        targetModel: 'claude-4.5',
      });

      // Act
      const result = await optimizePrompt(input);

      // Assert
      expect(result.optimizedPrompt.toLowerCase()).not.toContain('think');
      expect(
        result.optimizedPrompt.toLowerCase().includes('assess') ||
          result.optimizedPrompt.toLowerCase().includes('consider')
      ).toBe(true);
    });

    it('should replace "thinking" with "evaluating"', async () => {
      // Arrange
      const input = createOptimizationInput({
        originalPrompt: 'I need you thinking about solutions',
        targetModel: 'claude-4.5',
      });

      // Act
      const result = await optimizePrompt(input);

      // Assert
      expect(result.optimizedPrompt.toLowerCase()).toContain('evaluating');
    });

    it('should replace "think through" with "work through"', async () => {
      // Arrange
      const input = createOptimizationInput({
        originalPrompt: 'Please think through the problem',
        targetModel: 'claude-4.5',
      });

      // Act
      const result = await optimizePrompt(input);

      // Assert
      expect(result.optimizedPrompt.toLowerCase()).toContain('work through');
    });

    it('should add XML structure to long prompts without it (over 200 chars)', async () => {
      // Arrange - prompt must be over 200 chars and not contain "kontekst" or "context"
      const input = createOptimizationInput({
        originalPrompt:
          'This is a fairly long prompt that needs some structure because it contains multiple instructions and requirements that would benefit from XML tags for better organization. Adding more text to ensure this exceeds two hundred characters.',
        targetModel: 'claude-4.5',
      });

      // Act
      const result = await optimizePrompt(input);

      // Assert
      expect(result.optimizedPrompt).toContain('<task>');
      expect(result.optimizedPrompt).toContain('</task>');
    });

    it('should record changes made during optimization', async () => {
      // Arrange
      const input = createOptimizationInput({
        originalPrompt: 'Think about this and solve it',
        targetModel: 'claude-4.5',
      });

      // Act
      const result = await optimizePrompt(input);

      // Assert
      expect(result.changes.length).toBeGreaterThan(0);
      expect(result.changes[0].type).toBeDefined();
      expect(result.changes[0].description).toBeDefined();
      expect(result.changes[0].reason).toBeDefined();
    });
  });

  // ============================================================================
  // GPT-Specific Optimization Tests
  // ============================================================================

  describe('GPT-specific optimization', () => {
    it('should add Markdown structure to long prompts over 300 chars with multiple lines', async () => {
      // Arrange - prompt must be over 300 chars AND have more than 3 lines
      const input = createOptimizationInput({
        originalPrompt:
          `This is a long prompt that should get markdown structure added to it.
It is broken into multiple lines so the optimization logic can detect it.
Each line adds more context about what needs to be done.
Adding more text to ensure we exceed three hundred characters for the threshold.
This final line brings us well over the required character count for GPT optimization.`,
        targetModel: 'gpt-5.2',
      });

      // Act
      const result = await optimizePrompt(input);

      // Assert
      expect(result.optimizedPrompt).toContain('##');
    });
  });

  // ============================================================================
  // Gemini-Specific Optimization Tests
  // ============================================================================

  describe('Gemini-specific optimization', () => {
    it('should remove verbose phrases', async () => {
      // Arrange
      const input = createOptimizationInput({
        originalPrompt: 'Prosze, czy moglbys mi pomoc z tym zadaniem?',
        targetModel: 'gemini-3-pro',
      });

      // Act
      const result = await optimizePrompt(input);

      // Assert
      expect(result.optimizedPrompt).not.toContain('Prosze, ');
      expect(result.optimizedPrompt).not.toContain('Czy moglbys ');
    });

    it('should move format instructions to end', async () => {
      // Arrange
      const input = createOptimizationInput({
        originalPrompt:
          'Format: JSON\n\nPrzeanalizuj dane i podaj wyniki.',
        targetModel: 'gemini-3-pro',
      });

      // Act
      const result = await optimizePrompt(input);

      // Assert - format should be at the end
      const formatIndex = result.optimizedPrompt.indexOf('Format:');
      const lastIndex = result.optimizedPrompt.length - 20;
      expect(formatIndex).toBeGreaterThan(lastIndex / 2);
    });
  });

  // ============================================================================
  // Perplexity-Specific Optimization Tests
  // ============================================================================

  describe('Perplexity-specific optimization', () => {
    it('should remove role-playing statements', async () => {
      // Arrange
      const input = createOptimizationInput({
        originalPrompt:
          'Jestes ekspertem od programowania. Wytlumacz mi jak dziala rekurencja.',
        targetModel: 'perplexity-pro',
      });

      // Act
      const result = await optimizePrompt(input);

      // Assert
      expect(result.optimizedPrompt).not.toContain('Jestes ekspertem');
    });
  });

  // ============================================================================
  // Analyze Prompt Tests
  // ============================================================================

  describe('analyzePrompt()', () => {
    it('should return only issues without optimization', async () => {
      // Arrange
      const prompt = 'Think about this problem and solve it';
      const model = 'claude-4.5';

      // Act
      const issues = await analyzePrompt(prompt, model);

      // Assert
      expect(Array.isArray(issues)).toBe(true);
      expect(issues.length).toBeGreaterThan(0);
      expect(issues[0]).toHaveProperty('type');
      expect(issues[0]).toHaveProperty('code');
      expect(issues[0]).toHaveProperty('message');
    });

    it('should return issue types (critical, warning, suggestion)', async () => {
      // Arrange
      const prompt = 'Think about this. mozesz sprobuj to zrobic.';
      const model = 'claude-4.5';

      // Act
      const issues = await analyzePrompt(prompt, model);

      // Assert
      const types = issues.map((i) => i.type);
      expect(types.some((t) => ['critical', 'warning', 'suggestion'].includes(t))).toBe(true);
    });
  });

  // ============================================================================
  // Edge Cases
  // ============================================================================

  describe('edge cases', () => {
    it('should handle empty prompt', async () => {
      // Arrange
      const input = createOptimizationInput({
        originalPrompt: '',
      });

      // Act
      const result = await optimizePrompt(input);

      // Assert
      expect(result).toBeDefined();
      expect(result.optimizedPrompt).toBeDefined();
    });

    it('should handle prompt with only whitespace', async () => {
      // Arrange
      const input = createOptimizationInput({
        originalPrompt: '   \n\t   ',
      });

      // Act
      const result = await optimizePrompt(input);

      // Assert
      expect(result).toBeDefined();
    });

    it('should handle models with no specific optimizations', async () => {
      // Arrange
      const input = createOptimizationInput({
        originalPrompt: 'A simple prompt',
        targetModel: 'grok-4.1',
      });

      // Act
      const result = await optimizePrompt(input);

      // Assert
      expect(result).toBeDefined();
      // For models without specific optimizations, original should be preserved
      expect(result.optimizedPrompt).toBe('A simple prompt');
    });

    it('should handle already optimized prompts', async () => {
      // Arrange
      const input = createOptimizationInput({
        originalPrompt: '<task>Consider this problem</task>',
        targetModel: 'claude-4.5',
      });

      // Act
      const result = await optimizePrompt(input);

      // Assert
      expect(result.issues.length).toBe(0); // No XML issue
      expect(result.changes.length).toBe(0); // No changes needed
    });
  });

  // ============================================================================
  // PromptOptimizerError Tests
  // ============================================================================

  describe('PromptOptimizerError', () => {
    it('should create error with correct properties', () => {
      // Act
      const error = new PromptOptimizerError('Test message', 'TEST_CODE', 422);

      // Assert
      expect(error).toBeInstanceOf(Error);
      expect(error).toBeInstanceOf(PromptOptimizerError);
      expect(error.message).toBe('Test message');
      expect(error.code).toBe('TEST_CODE');
      expect(error.statusCode).toBe(422);
      expect(error.name).toBe('PromptOptimizerError');
    });
  });
});
