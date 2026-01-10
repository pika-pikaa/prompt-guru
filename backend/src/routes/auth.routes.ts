import { Router } from 'express';
import type { Request, Response } from 'express';
import { z } from 'zod';
import asyncHandler from 'express-async-handler';
import { validate } from '../middleware/validate.js';
import authService, { AuthError } from '../services/auth.service.js';

const router = Router();

// ============================================================================
// Validation Schemas
// ============================================================================

const registerSchema = z.object({
  body: z.object({
    email: z
      .string()
      .email('Nieprawidlowy format adresu email')
      .max(255, 'Email moze miec maksymalnie 255 znakow'),
    password: z
      .string()
      .min(8, 'Haslo musi miec co najmniej 8 znakow')
      .max(128, 'Haslo moze miec maksymalnie 128 znakow')
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        'Haslo musi zawierac co najmniej jedna mala litere, jedna wielka litere i jedna cyfre'
      ),
    name: z
      .string()
      .min(1, 'Imie musi miec co najmniej 1 znak')
      .max(100, 'Imie moze miec maksymalnie 100 znakow')
      .optional(),
  }),
});

const loginSchema = z.object({
  body: z.object({
    email: z.string().email('Nieprawidlowy format adresu email'),
    password: z.string().min(1, 'Haslo jest wymagane'),
  }),
});

const refreshSchema = z.object({
  body: z.object({
    refreshToken: z.string().min(1, 'Token odswiezania jest wymagany'),
  }),
});

const logoutSchema = z.object({
  body: z.object({
    refreshToken: z.string().min(1, 'Token odswiezania jest wymagany'),
  }),
});

// ============================================================================
// Route Handlers (Controllers)
// ============================================================================

/**
 * POST /api/auth/register
 * Register a new user account
 */
router.post(
  '/register',
  validate(registerSchema),
  asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { email, password, name } = req.body;

    try {
      const result = await authService.register(email, password, name);

      res.status(201).json({
        success: true,
        data: {
          user: result.user,
          accessToken: result.tokens.accessToken,
          refreshToken: result.tokens.refreshToken,
        },
        error: null,
      });
    } catch (error) {
      if (error instanceof AuthError) {
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
 * POST /api/auth/login
 * Authenticate user and return tokens
 */
router.post(
  '/login',
  validate(loginSchema),
  asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { email, password } = req.body;

    try {
      const result = await authService.login(email, password);

      res.status(200).json({
        success: true,
        data: {
          user: result.user,
          accessToken: result.tokens.accessToken,
          refreshToken: result.tokens.refreshToken,
        },
        error: null,
      });
    } catch (error) {
      if (error instanceof AuthError) {
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
 * POST /api/auth/refresh
 * Refresh access token using refresh token
 * Implements token rotation for security
 */
router.post(
  '/refresh',
  validate(refreshSchema),
  asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { refreshToken } = req.body;

    try {
      const tokens = await authService.refreshToken(refreshToken);

      res.status(200).json({
        success: true,
        data: {
          accessToken: tokens.accessToken,
          refreshToken: tokens.refreshToken,
        },
        error: null,
      });
    } catch (error) {
      if (error instanceof AuthError) {
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
 * POST /api/auth/logout
 * Invalidate refresh token
 */
router.post(
  '/logout',
  validate(logoutSchema),
  asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { refreshToken } = req.body;

    try {
      await authService.logout(refreshToken);

      res.status(200).json({
        success: true,
        data: {
          message: 'Pomyslnie wylogowano',
        },
        error: null,
      });
    } catch (error) {
      if (error instanceof AuthError) {
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

export default router;
