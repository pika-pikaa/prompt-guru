import { Router } from 'express';
import type { Request, Response } from 'express';
import { z } from 'zod';
import asyncHandler from 'express-async-handler';
import { validate } from '../middleware/validate.js';
import quickRecipesService, { type RecipeSlug } from '../services/quick-recipes.service.js';
import { type ModelType } from '../services/model-rules.service.js';

const router = Router();

// ============================================================================
// Validation Schemas
// ============================================================================

const matchRecipeSchema = z.object({
  body: z.object({
    text: z
      .string()
      .min(3, 'Tekst musi miec co najmniej 3 znaki')
      .max(1000, 'Tekst moze miec maksymalnie 1000 znakow'),
    threshold: z.number().min(0).max(1).optional(),
    limit: z.number().int().min(1).max(10).optional(),
  }),
});

const recipeSlugSchema = z.object({
  params: z.object({
    slug: z.enum([
      'code-review',
      'system-prompt',
      'image-generation',
      'research',
      'video-generation',
      'portrait',
      'translation',
      'summarization',
      'debugging',
      'fact-check',
    ]),
  }),
});

const listRecipesSchema = z.object({
  query: z.object({
    model: z.enum([
      'claude-4.5',
      'gpt-5.2',
      'grok-4.1',
      'gemini-3-pro',
      'nano-banana',
      'grok-aurora',
      'grok-imagine',
      'perplexity-pro',
    ]).optional(),
  }),
});

// ============================================================================
// Route Handlers
// ============================================================================

/**
 * GET /api/recipes
 * List all available quick recipes
 */
router.get(
  '/',
  validate(listRecipesSchema),
  asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const modelFilter = req.query.model as string | undefined;

    let recipes;
    if (modelFilter) {
      recipes = quickRecipesService.getRecipesByModel(modelFilter as ModelType);
    } else {
      recipes = quickRecipesService.getAllRecipes();
    }

    // Transform for API response (hide internal properties)
    const apiRecipes = recipes.map((recipe) => ({
      slug: recipe.slug,
      name: recipe.name,
      description: recipe.description,
      defaultModel: recipe.defaultModel,
      alternativeModels: recipe.alternativeModels,
      keywords: recipe.keywords,
    }));

    res.status(200).json({
      success: true,
      data: apiRecipes,
      error: null,
      meta: {
        total: apiRecipes.length,
      },
    });
  })
);

/**
 * GET /api/recipes/:slug
 * Get a specific recipe by slug
 */
router.get(
  '/:slug',
  validate(recipeSlugSchema),
  asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { slug } = req.params as { slug: RecipeSlug };

    const recipe = quickRecipesService.getRecipeBySlug(slug);

    if (!recipe) {
      res.status(404).json({
        success: false,
        data: null,
        error: {
          code: 'RECIPE_NOT_FOUND',
          message: `Nie znaleziono przepisu: ${slug}`,
        },
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: {
        slug: recipe.slug,
        name: recipe.name,
        description: recipe.description,
        defaultModel: recipe.defaultModel,
        alternativeModels: recipe.alternativeModels,
        keywords: recipe.keywords,
        followUpQuestions: recipe.followUpQuestions,
        template: recipe.template,
      },
      error: null,
    });
  })
);

/**
 * POST /api/recipes/match
 * Match user input text to the best recipe(s)
 */
router.post(
  '/match',
  validate(matchRecipeSchema),
  asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { text, threshold = 0.1, limit = 3 } = req.body;

    // Find matching recipes
    const matches = quickRecipesService.findMatchingRecipes(text, threshold);

    if (matches.length === 0) {
      res.status(200).json({
        success: true,
        data: {
          bestMatch: null,
          alternatives: [],
          message: 'Nie znaleziono pasujacego przepisu. Sprobuj bardziej szczegolowego opisu.',
        },
        error: null,
      });
      return;
    }

    // Take top matches up to limit
    const topMatches = matches.slice(0, limit);

    // Format response
    const formattedMatches = topMatches.map((match) => ({
      recipe: {
        slug: match.recipe.slug,
        name: match.recipe.name,
        description: match.recipe.description,
        defaultModel: match.recipe.defaultModel,
        alternativeModels: match.recipe.alternativeModels,
      },
      confidence: Math.round(match.confidence * 100) / 100,
      matchedKeywords: match.matchedKeywords,
    }));

    res.status(200).json({
      success: true,
      data: {
        bestMatch: formattedMatches[0],
        alternatives: formattedMatches.slice(1),
        followUpQuestions: topMatches[0].recipe.followUpQuestions,
        suggestedModel: topMatches[0].recipe.defaultModel,
      },
      error: null,
    });
  })
);

/**
 * GET /api/recipes/:slug/template
 * Get just the template for a recipe
 */
router.get(
  '/:slug/template',
  validate(recipeSlugSchema),
  asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { slug } = req.params as { slug: RecipeSlug };

    const recipe = quickRecipesService.getRecipeBySlug(slug);

    if (!recipe) {
      res.status(404).json({
        success: false,
        data: null,
        error: {
          code: 'RECIPE_NOT_FOUND',
          message: `Nie znaleziono przepisu: ${slug}`,
        },
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: {
        slug: recipe.slug,
        template: recipe.template || null,
        defaultModel: recipe.defaultModel,
      },
      error: null,
    });
  })
);

/**
 * GET /api/recipes/:slug/questions
 * Get follow-up questions for a recipe
 */
router.get(
  '/:slug/questions',
  validate(recipeSlugSchema),
  asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { slug } = req.params as { slug: RecipeSlug };

    const recipe = quickRecipesService.getRecipeBySlug(slug);

    if (!recipe) {
      res.status(404).json({
        success: false,
        data: null,
        error: {
          code: 'RECIPE_NOT_FOUND',
          message: `Nie znaleziono przepisu: ${slug}`,
        },
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: {
        slug: recipe.slug,
        questions: recipe.followUpQuestions,
      },
      error: null,
    });
  })
);

export default router;
