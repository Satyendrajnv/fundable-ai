import { Router, Request, Response } from 'express';
import { StartupEntitySchema } from '@fundable-ai/core-types';

export const intelligenceRouter = Router();

const intelligenceStore = new Map<string, any>();

// Seed ScoutEdge extracted intelligence (10 vectors)
const scoutedgeIntelligence = {
  intelligenceId: 'intel_scoutedge_v1',
  startupId: 'scoutedge-001',
  version: 1,
  entities: {
    problem: {
      statement: 'VC analysts waste 40+ hours per investment memo manually reviewing ungrounded pitch decks.',
      groundingEvidenceIds: ['doc_scoutedge_deck_01#page=2']
    },
    icp: {
      statement: 'Early-stage venture capital firms ($10M-$150M AUM) and Seed accelerators.',
      groundingEvidenceIds: ['doc_scoutedge_deck_01#page=3']
    },
    valueProposition: {
      statement: 'Automated 10-vector pitch parsing and evidence-grounded investment memo synthesis.',
      groundingEvidenceIds: ['doc_scoutedge_deck_01#page=1']
    },
    solution: {
      statement: 'Serverless AI platform leveraging Vertex AI Gemini 2.x and Cloud Run.',
      groundingEvidenceIds: ['doc_scoutedge_deck_01#page=4']
    },
    businessModel: {
      statement: 'B2B SaaS subscription: $499/mo per analyst seat; $5k/mo accelerator tier.',
      groundingEvidenceIds: ['doc_scoutedge_deck_01#page=5']
    },
    gtm: {
      statement: 'Direct outbound sales to accelerator cohorts & VC network referral flywheel.',
      groundingEvidenceIds: ['doc_scoutedge_deck_01#page=7']
    },
    traction: {
      statement: '$12k ARR, 4 pilot accelerators, 150 parsed decks in initial beta cohort.',
      groundingEvidenceIds: ['doc_scoutedge_fin_02#sheet=KPIs']
    },
    competition: {
      statement: 'Generic presentation generators (Tome, Gamma) lack VC-grade evidence grounding and scoring.',
      groundingEvidenceIds: ['doc_scoutedge_deck_01#page=8']
    },
    financials: {
      burnRate: 15000,
      runwayMonths: 10,
      projectedARR: 250000,
      groundingEvidenceIds: ['doc_scoutedge_fin_02#sheet=Summary']
    },
    fundraising: {
      ask: '$1.5M Pre-Seed',
      useOfFunds: '60% AI R&D, 25% GTM, 15% Operations',
      groundingEvidenceIds: ['doc_scoutedge_deck_01#page=10']
    }
  },
  extractionConfidence: 0.92,
  createdAt: new Date().toISOString()
};

intelligenceStore.set('scoutedge-001', scoutedgeIntelligence);

// GET /api/intelligence/:startupId — Get extracted 10-vector startup intelligence
intelligenceRouter.get('/:startupId', (req: Request, res: Response) => {
  const intel = intelligenceStore.get(req.params.startupId);
  if (!intel) {
    return res.status(404).json({ error: `No intelligence extracted yet for startup '${req.params.startupId}'.` });
  }
  res.status(200).json({ intelligence: intel });
});

// POST /api/intelligence/:startupId/extract — Trigger Stage 2 extraction
intelligenceRouter.post('/:startupId/extract', (req: Request, res: Response) => {
  res.status(202).json({
    status: 'ACCEPTED',
    message: 'Stage 2 Gemini Entity Extraction triggered',
    jobId: `job_extract_${Date.now()}`,
    startupId: req.params.startupId
  });
});
