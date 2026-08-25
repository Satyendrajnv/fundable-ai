import { Router, Request, Response } from 'express';
import { GenerationPipeline } from '../pipeline/generation.js';
import { ExtractionPipeline } from '../pipeline/extraction.js';

export const pitchesRouter = Router();

const generationPipeline = new GenerationPipeline();
const extractionPipeline = new ExtractionPipeline();
const pitchesStore = new Map<string, any>();

// GET /api/pitches/:startupId
pitchesRouter.get('/:startupId', (req: Request, res: Response) => {
  const deck = pitchesStore.get(req.params.startupId);
  if (!deck) {
    return res.status(404).json({ error: `No pitch deck generated yet for startup '${req.params.startupId}'.` });
  }
  res.status(200).json({ deck });
});

// POST /api/pitches/:startupId/generate — Trigger Multi-Stage Generation
pitchesRouter.post('/:startupId/generate', async (req: Request, res: Response) => {
  try {
    const mockProfile = {
      startupId: req.params.startupId,
      name: 'ScoutEdge',
      tagline: 'Autonomous AI Pitch Intelligence',
      founderId: 'founder_demo',
      stage: 'Pre-Seed' as const,
      targetRaise: 1500000,
      currency: 'USD',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const intelligence = await extractionPipeline.run(mockProfile, []);
    const deck = await generationPipeline.run(intelligence);

    pitchesStore.set(req.params.startupId, deck);

    res.status(200).json({ status: 'COMPLETED', deck });
  } catch (err: any) {
    res.status(500).json({ error: 'Pitch deck generation failed', message: err.message });
  }
});
