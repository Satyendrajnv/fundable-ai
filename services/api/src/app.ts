import express, { Express, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import { healthRouter } from './routes/health.js';
import { startupsRouter } from './routes/startups.js';
import { documentsRouter } from './routes/documents.js';
import { intelligenceRouter } from './routes/intelligence.js';
import { pitchesRouter } from './routes/pitches.js';
import { evaluationsRouter } from './routes/evaluations.js';
import { exportsRouter } from './routes/exports.js';

export function createApp(): Express {
  const app = express();

  app.use(cors());
  app.use(express.json());

  // Mount Health Check Route
  app.use('/health', healthRouter);

  // Mount API Domain Routes
  app.use('/api/startups', startupsRouter);
  app.use('/api/documents', documentsRouter);
  app.use('/api/intelligence', intelligenceRouter);
  app.use('/api/pitches', pitchesRouter);
  app.use('/api/evaluations', evaluationsRouter);
  app.use('/api/exports', exportsRouter);

  // Global Error Handler Middleware
  app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    console.error('Unhandled API Error:', err);
    res.status(500).json({
      error: 'Internal Server Error',
      message: err.message || 'An unexpected error occurred.'
    });
  });

  return app;
}

export const app = createApp();
