import { Router } from 'express';
import type { Response } from 'express';
import { z } from 'zod';
import asyncHandler from 'express-async-handler';
import { validate } from '../middleware/validate.js';
import { authenticate, type AuthRequest } from '../middleware/auth.js';
import promptGeneratorService, {
  type GenerationInput,
  PromptGeneratorError,
} from '../services/prompt-generator.service.js';
import promptOptimizerService, {
  PromptOptimizerError,
} from '../services/prompt-optimizer.service.js';
import prisma from '../lib/prisma.js';

const router = Router();

// ============================================================================
// Validation Schemas
// ============================================================================

const modelSchema = z.enum([
  'claude-4.5',
  'gpt-5.2',
  'grok-4.1',
  'gemini-3-pro',
  'nano-banana',
  'grok-aurora',
  'grok-imagine',
  'perplexity-pro',
]);

const taskTypeSchema = z.enum([
  'code-generation',
  'code-review',
  'analysis',
  'creative-writing',
  'translation',
  'summarization',
  'system-prompt',
  'image-generation',
  'video-generation',
  'research',
  'general',
]);

const toneSchema = z.enum(['formal', 'casual', 'technical', 'concise']);

const versionTypeSchema = z.enum(['extended', 'standard', 'minimal']);

const generateSchema = z.object({
  body: z.object({
    goal: z
      .string()
      .min(5, 'Cel musi miec co najmniej 5 znakow')
      .max(5000, 'Cel moze miec maksymalnie 5000 znakow'),
    model: modelSchema,
    taskType: taskTypeSchema.optional(),
    context: z.string().max(10000, 'Kontekst moze miec maksymalnie 10000 znakow').optional(),
    tone: toneSchema.optional(),
    constraints: z.array(z.string().max(500)).max(20).optional(),
    examples: z.array(z.string().max(2000)).max(10).optional(),
  }),
});

const optimizeSchema = z.object({
  body: z.object({
    originalPrompt: z
      .string()
      .min(5, 'Prompt musi miec co najmniej 5 znakow')
      .max(20000, 'Prompt moze miec maksymalnie 20000 znakow'),
    targetModel: modelSchema,
    issues: z.array(z.string().max(500)).max(10).optional(),
  }),
});

const savePromptSchema = z.object({
  body: z.object({
    title: z
      .string()
      .min(1, 'Tytul jest wymagany')
      .max(200, 'Tytul moze miec maksymalnie 200 znakow'),
    description: z.string().max(2000).optional(),
    content: z
      .string()
      .min(1, 'Tresc jest wymagana')
      .max(50000, 'Tresc moze miec maksymalnie 50000 znakow'),
    model: modelSchema,
    versionType: versionTypeSchema.default('standard'),
    category: z.string().max(100).optional(),
    tags: z.array(z.string().max(50)).max(20).optional(),
    techniques: z.array(z.string().max(100)).max(20).optional(),
    isPublic: z.boolean().default(false),
  }),
});

const listPromptsSchema = z.object({
  query: z.object({
    page: z.string().regex(/^\d+$/).transform(Number).optional(),
    limit: z.string().regex(/^\d+$/).transform(Number).optional(),
    model: modelSchema.optional(),
    category: z.string().max(100).optional(),
    isPublic: z.enum(['true', 'false']).transform((v) => v === 'true').optional(),
  }),
});

const promptIdSchema = z.object({
  params: z.object({
    id: z.string().uuid('Nieprawidlowy identyfikator promptu'),
  }),
});

// ============================================================================
// Prisma Enum Mapping
// ============================================================================

// Map API model types to Prisma AIModel enum
const mapModelToPrisma = (model: string) => {
  const mapping: Record<string, string> = {
    'claude-4.5': 'CLAUDE_4',
    'gpt-5.2': 'GPT_5',
    'grok-4.1': 'GROK_4',
    'gemini-3-pro': 'GEMINI_3',
    'nano-banana': 'NANO_BANANA',
    'grok-aurora': 'GROK_AURORA',
    'grok-imagine': 'GROK_AURORA', // Uses same Prisma enum
    'perplexity-pro': 'PERPLEXITY_PRO',
  };
  return mapping[model] || 'CLAUDE_4';
};

const mapVersionToPrisma = (version: string) => {
  const mapping: Record<string, string> = {
    extended: 'EXTENDED',
    standard: 'STANDARD',
    minimal: 'MINIMAL',
  };
  return mapping[version.toLowerCase()] || 'STANDARD';
};

// ============================================================================
// Route Handlers
// ============================================================================

/**
 * POST /api/prompts/generate
 * Generate prompts in 3 versions
 */
router.post(
  '/generate',
  validate(generateSchema),
  asyncHandler(async (req: AuthRequest, res: Response): Promise<void> => {
    const input: GenerationInput = req.body;

    try {
      const result = await promptGeneratorService.generatePrompt(input);

      res.status(200).json({
        success: true,
        data: result,
        error: null,
      });
    } catch (error) {
      if (error instanceof PromptGeneratorError) {
        res.status(error.statusCode).json({
          success: false,
          data: null,
          error: {
            code: error.code,
            message: error.message,
          },
        });
        return;
      }
      throw error;
    }
  })
);

/**
 * POST /api/prompts/optimize
 * Analyze and optimize an existing prompt
 */
router.post(
  '/optimize',
  validate(optimizeSchema),
  asyncHandler(async (req: AuthRequest, res: Response): Promise<void> => {
    const { originalPrompt, targetModel, issues } = req.body;

    try {
      const result = await promptOptimizerService.optimizePrompt({
        originalPrompt,
        targetModel,
        issues,
      });

      res.status(200).json({
        success: true,
        data: result,
        error: null,
      });
    } catch (error) {
      if (error instanceof PromptOptimizerError) {
        res.status(error.statusCode).json({
          success: false,
          data: null,
          error: {
            code: error.code,
            message: error.message,
          },
        });
        return;
      }
      throw error;
    }
  })
);

/**
 * GET /api/prompts
 * List user's prompts (requires authentication)
 */
router.get(
  '/',
  authenticate,
  validate(listPromptsSchema),
  asyncHandler(async (req: AuthRequest, res: Response): Promise<void> => {
    const page = Number(req.query.page) || 1;
    const limit = Math.min(Number(req.query.limit) || 20, 100);
    const skip = (page - 1) * limit;

    const userId = req.userId!;

    // Build where clause
    const where: Record<string, unknown> = {
      authorId: userId,
    };

    if (req.query.model) {
      where.model = mapModelToPrisma(req.query.model as string);
    }

    if (req.query.category) {
      where.category = req.query.category;
    }

    if (req.query.isPublic !== undefined) {
      where.isPublic = req.query.isPublic === 'true';
    }

    // Get total count and prompts
    const [total, prompts] = await Promise.all([
      prisma.prompt.count({ where }),
      prisma.prompt.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          title: true,
          description: true,
          model: true,
          versionType: true,
          category: true,
          tags: true,
          techniques: true,
          isPublic: true,
          createdAt: true,
          updatedAt: true,
        },
      }),
    ]);

    res.status(200).json({
      success: true,
      data: prompts,
      error: null,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  })
);

/**
 * POST /api/prompts
 * Save a new prompt (requires authentication)
 */
router.post(
  '/',
  authenticate,
  validate(savePromptSchema),
  asyncHandler(async (req: AuthRequest, res: Response): Promise<void> => {
    const userId = req.userId!;
    const {
      title,
      description,
      content,
      model,
      versionType,
      category,
      tags,
      techniques,
      isPublic,
    } = req.body;

    const prompt = await prisma.prompt.create({
      data: {
        title,
        description: description || null,
        content,
        model: mapModelToPrisma(model) as 'CLAUDE_4' | 'GPT_5' | 'GROK_4' | 'GEMINI_3' | 'NANO_BANANA' | 'GROK_AURORA' | 'PERPLEXITY_PRO',
        versionType: mapVersionToPrisma(versionType) as 'EXTENDED' | 'STANDARD' | 'MINIMAL',
        category: category || null,
        tags: tags || [],
        techniques: techniques || [],
        isPublic,
        authorId: userId,
      },
      select: {
        id: true,
        title: true,
        description: true,
        content: true,
        model: true,
        versionType: true,
        category: true,
        tags: true,
        techniques: true,
        isPublic: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    res.status(201).json({
      success: true,
      data: prompt,
      error: null,
    });
  })
);

/**
 * GET /api/prompts/:id
 * Get a specific prompt by ID
 */
router.get(
  '/:id',
  authenticate,
  validate(promptIdSchema),
  asyncHandler(async (req: AuthRequest, res: Response): Promise<void> => {
    const { id } = req.params;
    const userId = req.userId!;

    const prompt = await prisma.prompt.findFirst({
      where: {
        id,
        OR: [
          { authorId: userId },
          { isPublic: true },
        ],
      },
      select: {
        id: true,
        title: true,
        description: true,
        content: true,
        model: true,
        versionType: true,
        category: true,
        tags: true,
        techniques: true,
        isPublic: true,
        createdAt: true,
        updatedAt: true,
        author: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    if (!prompt) {
      res.status(404).json({
        success: false,
        data: null,
        error: {
          code: 'PROMPT_NOT_FOUND',
          message: 'Nie znaleziono promptu lub nie masz do niego dostepu',
        },
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: prompt,
      error: null,
    });
  })
);

/**
 * DELETE /api/prompts/:id
 * Delete a prompt (requires authentication and ownership)
 */
router.delete(
  '/:id',
  authenticate,
  validate(promptIdSchema),
  asyncHandler(async (req: AuthRequest, res: Response): Promise<void> => {
    const { id } = req.params;
    const userId = req.userId!;

    // First check if prompt exists and belongs to user
    const prompt = await prisma.prompt.findFirst({
      where: {
        id,
        authorId: userId,
      },
    });

    if (!prompt) {
      res.status(404).json({
        success: false,
        data: null,
        error: {
          code: 'PROMPT_NOT_FOUND',
          message: 'Nie znaleziono promptu lub nie masz uprawnien do jego usuniecia',
        },
      });
      return;
    }

    await prisma.prompt.delete({
      where: { id },
    });

    res.status(200).json({
      success: true,
      data: {
        message: 'Pomyslnie usunieto prompt',
        id,
      },
      error: null,
    });
  })
);

export default router;
