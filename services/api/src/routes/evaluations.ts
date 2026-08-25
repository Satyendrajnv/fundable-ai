import { Router, Request, Response } from 'express';
import { EvaluationPipeline } from '../pipeline/evaluation.js';
import { RegenerationPipeline } from '../pipeline/regeneration.js';
import { GenerationPipeline } from '../pipeline/generation.js';
import { ExtractionPipeline } from '../pipeline/extraction.js';

export const evaluationsRouter = Router();

const evalPipeline = new EvaluationPipeline();
const regenPipeline = new RegenerationPipeline();
const genPipeline = new GenerationPipeline();
const extractPipeline = new ExtractionPipeline();

const evaluationsStore = new Map<string, any>();
const deckStore = new Map<string, any>();

// GET /api/evaluations/:deckId
evaluationsRouter.get('/:deckId', async (req: Request, res: Response) => {
  let evalReport = evaluationsStore.get(req.params.deckId);
  if (!evalReport) {
    // Generate evaluation on the fly for demo deck
    const mockProfile = {
      startupId: 'scoutedge-001',
      name: 'ScoutEdge',
      tagline: 'Autonomous AI Pitch Intelligence',
      founderId: 'founder_demo',
      stage: 'Pre-Seed' as const,
      targetRaise: 1500000,
      currency: 'USD',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    const intel = await extractPipeline.run(mockProfile, []);
    const deck = await genPipeline.run(intel);
    evalReport = await evalPipeline.run(deck, intel);
    evaluationsStore.set(req.params.deckId, evalReport);
    deckStore.set(req.params.deckId, deck);
  }
  res.status(200).json({ evaluation: evalReport });
});

// POST /api/evaluations/:deckId/regenerate-slide — Trigger Targeted Slide Regeneration
evaluationsRouter.post('/:deckId/regenerate-slide', async (req: Request, res: Response) => {
  try {
    const targetSlideNumbers: number[] = req.body.targetSlideNumbers || [6];
    const critique = req.body.reason || 'Improve evidence grounding score for traction';

    let deck = deckStore.get(req.params.deckId);
    if (!deck) {
      const mockProfile = {
        startupId: 'scoutedge-001',
        name: 'ScoutEdge',
        tagline: 'Autonomous AI Pitch Intelligence',
        founderId: 'founder_demo',
        stage: 'Pre-Seed' as const,
        targetRaise: 1500000,
        currency: 'USD',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      const intel = await extractPipeline.run(mockProfile, []);
      deck = await genPipeline.run(intel);
    }

    const { updatedDeck, newEvaluation } = await regenPipeline.run(deck, targetSlideNumbers, critique);
    deckStore.set(req.params.deckId, updatedDeck);
    evaluationsStore.set(req.params.deckId, newEvaluation);

    res.status(200).json({
      status: 'COMPLETED',
      message: `Stage 7 Targeted Regeneration completed for slide(s): ${targetSlideNumbers.join(', ')}`,
      updatedDeck,
      newEvaluation
    });
  } catch (err: any) {
    res.status(500).json({ error: 'Regeneration failed', message: err.message });
  }
});
