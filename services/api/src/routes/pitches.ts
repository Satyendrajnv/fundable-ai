import { Router, Request, Response } from 'express';
import { GenerationPipeline } from '../pipeline/generation.js';
import { ExtractionPipeline } from '../pipeline/extraction.js';
import { sessionStore } from '../services/session-store.js';

export const pitchesRouter = Router();

const generationPipeline = new GenerationPipeline();
const extractionPipeline = new ExtractionPipeline();

// GET /api/pitches/:startupId — Retrieve 10-slide deck
pitchesRouter.get('/:startupId', async (req: Request, res: Response) => {
  let deck = sessionStore.getDeck(req.params.startupId);
  if (!deck) {
    // Generate on the fly if not yet created — uses session intelligence or extracts fresh
    let intelligence = sessionStore.getIntelligence(req.params.startupId);
    if (!intelligence) {
      const profile = {
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
      intelligence = await extractionPipeline.run(profile, []);
      sessionStore.setIntelligence(req.params.startupId, intelligence);
    }
    deck = await generationPipeline.run(intelligence);
    sessionStore.setDeck(req.params.startupId, deck);
  }
  res.status(200).json({ deck });
});

// POST /api/pitches/:startupId/generate — Trigger Multi-Stage Generation
pitchesRouter.post('/:startupId/generate', async (req: Request, res: Response) => {
  try {
    // Use existing intelligence from session if available
    let intelligence = sessionStore.getIntelligence(req.params.startupId);
    if (!intelligence) {
      const profile = {
        startupId: req.params.startupId,
        name: req.body.name || 'ScoutEdge',
        tagline: req.body.tagline || 'Autonomous AI Pitch Intelligence',
        founderId: req.body.founderId || 'founder_demo',
        stage: req.body.stage || 'Pre-Seed' as const,
        targetRaise: req.body.targetRaise || 1500000,
        currency: req.body.currency || 'USD',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      intelligence = await extractionPipeline.run(profile, []);
      sessionStore.setIntelligence(req.params.startupId, intelligence);
    }

    const deck = await generationPipeline.run(intelligence);
    sessionStore.setDeck(req.params.startupId, deck);

    res.status(200).json({ status: 'COMPLETED', deck });
  } catch (err: any) {
    console.error('[Pitches Route] Generation failed:', err.message);
    res.status(500).json({ error: 'Pitch deck generation failed', message: err.message });
  }
});
