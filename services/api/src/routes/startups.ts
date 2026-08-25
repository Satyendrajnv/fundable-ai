import { Router, Request, Response } from 'express';
import { StartupProfileSchema } from '@fundable-ai/core-types';

export const startupsRouter = Router();

// In-memory store stub for Phase 2 foundation
const startupsStore = new Map<string, any>();

// Seed ScoutEdge demo profile
const scoutedgeProfile = {
  startupId: 'scoutedge-001',
  name: 'ScoutEdge',
  tagline: 'Autonomous AI Pitch Intelligence & VC Scouting',
  website: 'https://scoutedge.ai',
  founderId: 'demo_founder_scoutedge',
  stage: 'Pre-Seed',
  targetRaise: 1500000,
  currency: 'USD',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString()
};
startupsStore.set(scoutedgeProfile.startupId, scoutedgeProfile);

// GET /api/startups — List startups
startupsRouter.get('/', (req: Request, res: Response) => {
  const startups = Array.from(startupsStore.values());
  res.status(200).json({ startups });
});

// GET /api/startups/:id — Get startup profile
startupsRouter.get('/:id', (req: Request, res: Response) => {
  const startup = startupsStore.get(req.params.id);
  if (!startup) {
    return res.status(404).json({ error: `Startup with ID '${req.params.id}' not found.` });
  }
  res.status(200).json({ startup });
});

// POST /api/startups — Create startup profile
startupsRouter.post('/', (req: Request, res: Response) => {
  const parseResult = StartupProfileSchema.safeParse({
    ...req.body,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  });

  if (!parseResult.success) {
    return res.status(400).json({
      error: 'Invalid startup profile payload',
      details: parseResult.error.format()
    });
  }

  const newStartup = parseResult.data;
  startupsStore.set(newStartup.startupId, newStartup);
  res.status(201).json({ startup: newStartup });
});
