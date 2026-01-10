import { Router } from 'express';
import type { Request, Response } from 'express';
import { z } from 'zod';
import asyncHandler from 'express-async-handler';
import { validate } from '../middleware/validate.js';
import modelRulesService, {
  type ModelType,
  type ModelCategory,
  ModelRulesError,
} from '../services/model-rules.service.js';

const router = Router();

// ============================================================================
// Validation Schemas
// ============================================================================

const modelSlugSchema = z.object({
  params: z.object({
    slug: z.enum([
      'claude-4.5',
      'gpt-5.2',
      'grok-4.1',
      'gemini-3-pro',
      'nano-banana',
      'grok-aurora',
      'grok-imagine',
      'perplexity-pro',
    ]),
  }),
});

const listModelsSchema = z.object({
  query: z.object({
    category: z.enum(['llm', 'image', 'video', 'search']).optional(),
  }),
});

// ============================================================================
// Route Handlers
// ============================================================================

/**
 * GET /api/models
 * List all available models or filter by category
 */
router.get(
  '/',
  validate(listModelsSchema),
  asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const category = req.query.category as ModelCategory | undefined;

    let models;
    if (category) {
      models = modelRulesService.getModelsByCategory(category);
    } else {
      models = modelRulesService.getAllModels();
    }

    res.status(200).json({
      success: true,
      data: models,
      error: null,
      meta: {
        total: models.length,
      },
    });
  })
);

/**
 * GET /api/models/comparison
 * Get comparison table of all models
 */
router.get(
  '/comparison',
  asyncHandler(async (_req: Request, res: Response): Promise<void> => {
    const comparison = modelRulesService.getModelComparison();

    res.status(200).json({
      success: true,
      data: comparison,
      error: null,
    });
  })
);

/**
 * GET /api/models/:slug
 * Get detailed model information including rules
 */
router.get(
  '/:slug',
  validate(modelSlugSchema),
  asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { slug } = req.params as { slug: ModelType };

    try {
      const rules = await modelRulesService.getRules(slug);

      res.status(200).json({
        success: true,
        data: {
          info: rules.modelInfo,
          rules: rules.rules,
          avoid: rules.avoid,
          checklist: rules.checklist,
          tips: rules.tips,
          quickStart: rules.quickStart,
        },
        error: null,
      });
    } catch (error) {
      if (error instanceof ModelRulesError) {
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
 * GET /api/models/:slug/rules
 * Get only the rules for a model (lightweight response)
 */
router.get(
  '/:slug/rules',
  validate(modelSlugSchema),
  asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { slug } = req.params as { slug: ModelType };

    try {
      const rules = await modelRulesService.getRules(slug);

      res.status(200).json({
        success: true,
        data: {
          model: slug,
          rules: rules.rules,
          avoid: rules.avoid,
        },
        error: null,
      });
    } catch (error) {
      if (error instanceof ModelRulesError) {
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
 * GET /api/models/:slug/checklist
 * Get the checklist for a model
 */
router.get(
  '/:slug/checklist',
  validate(modelSlugSchema),
  asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { slug } = req.params as { slug: ModelType };

    try {
      const rules = await modelRulesService.getRules(slug);

      res.status(200).json({
        success: true,
        data: {
          model: slug,
          checklist: rules.checklist,
        },
        error: null,
      });
    } catch (error) {
      if (error instanceof ModelRulesError) {
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
 * POST /api/models/cache/clear
 * Clear the model rules cache (admin only in production)
 */
router.post(
  '/cache/clear',
  asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { model } = req.body as { model?: ModelType };

    modelRulesService.clearCache(model);

    res.status(200).json({
      success: true,
      data: {
        message: model
          ? `Wyczyszczono cache dla modelu: ${model}`
          : 'Wyczyszczono cache wszystkich modeli',
      },
      error: null,
    });
  })
);

export default router;
