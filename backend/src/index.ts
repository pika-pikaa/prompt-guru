import express from 'express';
import type { Express, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.routes.js';
import promptsRoutes from './routes/prompts.routes.js';
import modelsRoutes from './routes/models.routes.js';
import recipesRoutes from './routes/recipes.routes.js';
import { apiLimiter, authLimiter, registrationLimiter } from './middleware/rateLimit.js';

dotenv.config();

const app: Express = express();
const PORT = process.env.PORT || 4000;

// Trust proxy for rate limiting behind reverse proxy
app.set('trust proxy', 1);

// Security middleware
app.use(helmet());
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  credentials: true,
}));

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Health check endpoint (no rate limit)
app.get('/health', (_req: Request, res: Response) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    version: process.env.npm_package_version || '1.0.0'
  });
});

// API routes placeholder
app.get('/api', (_req: Request, res: Response) => {
  res.json({ message: 'Prompt Guru API v1.0' });
});

// Apply rate limiters to auth routes
app.use('/api/auth/login', authLimiter);
app.use('/api/auth/register', registrationLimiter);

// Mount auth routes
app.use('/api/auth', authRoutes);

// Apply general API rate limiter to other routes
app.use('/api', apiLimiter);

// Mount prompt generation routes
app.use('/api/prompts', promptsRoutes);

// Mount models routes
app.use('/api/models', modelsRoutes);

// Mount recipes routes
app.use('/api/recipes', recipesRoutes);

// 404 handler
app.use((_req: Request, res: Response) => {
  res.status(404).json({ error: 'Nie znaleziono' });
});

// Global error handler
app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error('Blad:', err.message);
  res.status(500).json({
    error: process.env.NODE_ENV === 'production'
      ? 'Wewnetrzny blad serwera'
      : err.message
  });
});

app.listen(PORT, () => {
  console.log(`[Server] Running on http://localhost:${PORT}`);
  console.log(`[Server] Environment: ${process.env.NODE_ENV || 'development'}`);
});

export default app;
