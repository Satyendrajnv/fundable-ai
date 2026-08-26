import { Router, Request, Response } from 'express';
import { EvaluationPipeline } from '../pipeline/evaluation.js';
import { RegenerationPipeline } from '../pipeline/regeneration.js';
import { GenerationPipeline } from '../pipeline/generation.js';
import { ExtractionPipeline } from '../pipeline/extraction.js';
import { sessionStore } from '../services/session-store.js';

export const evaluationsRouter = Router();

const evalPipeline = new EvaluationPipeline();
const regenPipeline = new RegenerationPipeline();
const genPipeline = new GenerationPipeline();
const extractPipeline = new ExtractionPipeline();

// GET /api/evaluations/:deckId
evaluationsRouter.get('/:deckId', async (req: Request, res: Response) => {
  // Check if we have an existing evaluation for this deck
  const startupId = sessionStore.getStartupIdByDeckId(req.params.deckId) || 'scoutedge-001';
  let evaluation = sessionStore.getEvaluation(startupId);

  if (!evaluation) {
    // Generate evaluation on the fly
    let intelligence = sessionStore.getIntelligence(startupId);
    let deck = sessionStore.getDeckByDeckId(req.params.deckId) || sessionStore.getDeck(startupId);

    if (!intelligence) {
      const mockProfile = {
        startupId,
        name: 'ScoutEdge',
        tagline: 'Autonomous AI Pitch Intelligence',
        founderId: 'founder_demo',
        stage: 'Pre-Seed' as const,
        targetRaise: 1500000,
        currency: 'USD',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      intelligence = await extractPipeline.run(mockProfile, []);
      sessionStore.setIntelligence(startupId, intelligence);
    }

    if (!deck) {
      deck = await genPipeline.run(intelligence);
      sessionStore.setDeck(startupId, deck);
    }

    evaluation = await evalPipeline.run(deck, intelligence);
    sessionStore.setEvaluation(startupId, evaluation);
  }

  res.status(200).json({ evaluation });
});

// POST /api/evaluations/:deckId/regenerate-slide — Trigger Targeted Slide Regeneration
evaluationsRouter.post('/:deckId/regenerate-slide', async (req: Request, res: Response) => {
  try {
    const targetSlideNumbers: number[] = req.body.targetSlideNumbers || [6];
    const critique = req.body.reason || 'Improve evidence grounding score for traction';
    const startupId = sessionStore.getStartupIdByDeckId(req.params.deckId) || 'scoutedge-001';

    let deck = sessionStore.getDeckByDeckId(req.params.deckId) || sessionStore.getDeck(startupId);
    if (!deck) {
      let intelligence = sessionStore.getIntelligence(startupId);
      if (!intelligence) {
        const mockProfile = {
          startupId,
          name: 'ScoutEdge',
          tagline: 'Autonomous AI Pitch Intelligence',
          founderId: 'founder_demo',
          stage: 'Pre-Seed' as const,
          targetRaise: 1500000,
          currency: 'USD',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        intelligence = await extractPipeline.run(mockProfile, []);
        sessionStore.setIntelligence(startupId, intelligence);
      }
      deck = await genPipeline.run(intelligence);
      sessionStore.setDeck(startupId, deck);
    }

    const { updatedDeck, newEvaluation } = await regenPipeline.run(deck, targetSlideNumbers, critique);
    sessionStore.setDeck(startupId, updatedDeck);
    sessionStore.setEvaluation(startupId, newEvaluation);

    res.status(200).json({
      status: 'COMPLETED',
      message: `Targeted Regeneration completed for slide(s): ${targetSlideNumbers.join(', ')}`,
      updatedDeck,
      newEvaluation
    });
  } catch (err: any) {
    console.error('[Evaluations Route] Regeneration failed:', err.message);
    res.status(500).json({ error: 'Regeneration failed', message: err.message });
  }
});
