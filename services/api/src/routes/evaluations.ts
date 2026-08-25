import { Router, Request, Response } from 'express';
import { EvaluationResultSchema, RegenerationRequestSchema } from '@fundable-ai/core-types';

export const evaluationsRouter = Router();

const evaluationsStore = new Map<string, any>();

// Seed ScoutEdge evaluation report
const scoutedgeEvaluation = {
  evalId: 'eval_scoutedge_v1',
  deckId: 'deck_scoutedge_v1',
  startupId: 'scoutedge-001',
  overallScore: 89,
  readinessStatus: 'PASSED',
  metrics: {
    completeness: 1.0,
    factualConsistency: 0.92,
    evidenceGrounding: 0.88,
    investorReadiness: 0.86
  },
  lowConfidenceSlideNumbers: [],
  feedback: [
    'Slide 6 (Traction) evidence verified ($12k ARR grounded in ScoutEdge_Financials.xlsx).',
    'Slide 9 (Financials) is factual and meets VC clarity thresholds.',
    'Slide 10 (Ask) is well structured with clear resource allocation.'
  ],
  evaluatedAt: new Date().toISOString()
};

evaluationsStore.set('deck_scoutedge_v1', scoutedgeEvaluation);

// GET /api/evaluations/:deckId — Retrieve 4-vector evaluation report
evaluationsRouter.get('/:deckId', (req: Request, res: Response) => {
  const evalReport = evaluationsStore.get(req.params.deckId);
  if (!evalReport) {
    return res.status(404).json({ error: `No evaluation report found for deck '${req.params.deckId}'.` });
  }
  res.status(200).json({ evaluation: evalReport });
});

// POST /api/evaluations/:deckId/regenerate-slide — Trigger Stage 7 targeted slide regeneration
evaluationsRouter.post('/:deckId/regenerate-slide', (req: Request, res: Response) => {
  const parseResult = RegenerationRequestSchema.safeParse({
    deckId: req.params.deckId,
    startupId: req.body.startupId || 'scoutedge-001',
    targetSlideNumbers: req.body.targetSlideNumbers || [6],
    reason: req.body.reason || 'Regenerate slide to improve evidence grounding score'
  });

  if (!parseResult.success) {
    return res.status(400).json({
      error: 'Invalid regeneration payload',
      details: parseResult.error.format()
    });
  }

  res.status(202).json({
    status: 'ACCEPTED',
    message: `Stage 7 Targeted Regeneration triggered for slide(s): ${parseResult.data.targetSlideNumbers.join(', ')}`,
    jobId: `job_regen_${Date.now()}`,
    request: parseResult.data
  });
});
