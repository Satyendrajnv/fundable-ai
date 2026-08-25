import { Router, Request, Response } from 'express';
import { config } from '../config.js';

export const healthRouter = Router();

healthRouter.get('/', (req: Request, res: Response) => {
  res.status(200).json({
    status: 'OK',
    service: 'fundable-ai-api',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    gcpConfig: {
      projectId: config.GCP_PROJECT_ID,
      region: config.GCP_REGION,
      vertexAiLocation: config.VERTEX_AI_LOCATION,
      mockMode: config.ENABLE_MOCK_GCP
    }
  });
});
