import { Router, Request, Response } from 'express';
import { PitchDeckSchema, SlideCategory } from '@fundable-ai/core-types';

export const pitchesRouter = Router();

const pitchesStore = new Map<string, any>();

// Seed ScoutEdge 10-slide pitch deck
const slideCategories: SlideCategory[] = [
  'TITLE', 'PROBLEM', 'MARKET_ICP', 'SOLUTION', 'BUSINESS_MODEL',
  'TRACTION', 'GTM_STRATEGY', 'COMPETITION_MOAT', 'FINANCIAL_PROJECTIONS', 'ASK_TEAM'
];

const scoutedgeDeck = {
  deckId: 'deck_scoutedge_v1',
  startupId: 'scoutedge-001',
  version: 1,
  status: 'COMPLETED',
  slides: [
    {
      slideNumber: 1,
      category: 'TITLE',
      title: 'ScoutEdge — Autonomous Pitch Intelligence',
      purpose: 'Hook investors with company vision',
      headline: 'Transforming Fragmented Pitch Data into Investment-Ready Intelligence',
      bulletPoints: ['Powered by Google Cloud & Gemini 2.x', 'Evidence-Grounded Investor Narratives'],
      speakerNotes: 'Welcome investors. ScoutEdge automates pitch evaluation and memo drafting.',
      claims: ['AI Pitch Intelligence Platform'],
      evidenceReferences: ['doc_scoutedge_deck_01#page=1'],
      confidence: 0.95
    },
    {
      slideNumber: 2,
      category: 'PROBLEM',
      title: 'The VC Deal Scouting Bottleneck',
      purpose: 'Define the core market pain point',
      headline: 'VC Analysts Spend 40+ Hours per Investment Memo on Manual Pitch Evaluation',
      bulletPoints: ['Thousands of ungrounded decks received annually', 'Missed high-potential seed deals due to review backlog'],
      speakerNotes: 'VC analysts are overwhelmed with raw pitch decks lacking evidence verification.',
      claims: ['40+ hours spent per memo'],
      evidenceReferences: ['doc_scoutedge_deck_01#page=2'],
      confidence: 0.91
    },
    {
      slideNumber: 3,
      category: 'MARKET_ICP',
      title: 'Target Market & Ideal Customer Profile',
      purpose: 'Outline TAM, SAM, and buyer persona',
      headline: '$5.2B Global Venture Software & Accelerator Tech Market',
      bulletPoints: ['Primary ICP: Early-stage VC firms ($10M-$150M AUM)', 'Secondary ICP: Seed Accelerators & Incubators'],
      speakerNotes: 'Our focus is mid-market VC firms seeking institutional speed in deal screening.',
      claims: ['$5.2B market opportunity'],
      evidenceReferences: ['doc_scoutedge_deck_01#page=3'],
      confidence: 0.88
    },
    {
      slideNumber: 4,
      category: 'SOLUTION',
      title: 'The ScoutEdge Intelligence Platform',
      purpose: 'Present product value and core innovation',
      headline: 'Evidence-Grounded 10-Vector Pitch Parsing & Multi-Stage Narrative Synthesis',
      bulletPoints: ['Direct claim-to-evidence linking', 'Automated 4-vector investor readiness scoring'],
      speakerNotes: 'ScoutEdge extracts 10 core startup vectors and grounds every slide in raw evidence.',
      claims: ['10-vector pitch parsing'],
      evidenceReferences: ['doc_scoutedge_deck_01#page=4'],
      confidence: 0.94
    },
    {
      slideNumber: 5,
      category: 'BUSINESS_MODEL',
      title: 'Predictable B2B SaaS Monetization',
      purpose: 'Explain pricing and unit economics',
      headline: '$499/month per Analyst Seat + $5,000/month Accelerator Tier',
      bulletPoints: ['Gross Margins > 85%', 'Annual contracts with usage-based AI parsing add-ons'],
      speakerNotes: 'High-margin B2B SaaS business model with expansion potential per fund seat.',
      claims: ['$499/mo per seat', '85% gross margin'],
      evidenceReferences: ['doc_scoutedge_deck_01#page=5'],
      confidence: 0.92
    },
    {
      slideNumber: 6,
      category: 'TRACTION',
      title: 'Early Growth & Market Validation',
      purpose: 'Demonstrate traction velocity and KPIs',
      headline: '$12,000 ARR with 4 Accelerator Pilot Customers in Beta',
      bulletPoints: ['150+ startup pitch decks parsed and evaluated', '92% founder satisfaction score'],
      speakerNotes: 'We have proven early demand with $12k ARR and active accelerator pilots.',
      claims: ['$12k ARR', '4 pilot accelerators'],
      evidenceReferences: ['doc_scoutedge_fin_02#sheet=KPIs'],
      confidence: 0.89
    },
    {
      slideNumber: 7,
      category: 'GTM_STRATEGY',
      title: 'Go-To-Market & Growth Engine',
      purpose: 'Detail customer acquisition strategy',
      headline: 'Accelerator Cohort Integration & VC Network Referral Flywheel',
      bulletPoints: ['Partnering directly with demo-day accelerators', 'Bottom-up analyst adoption driving fund-level enterprise deals'],
      speakerNotes: 'Accelerators serve as our primary customer acquisition engine.',
      claims: ['Cohort distribution model'],
      evidenceReferences: ['doc_scoutedge_deck_01#page=7'],
      confidence: 0.87
    },
    {
      slideNumber: 8,
      category: 'COMPETITION_MOAT',
      title: 'Competitive Advantage & Defensive Moat',
      purpose: 'Show competitive matrix and defensibility',
      headline: 'Proprietary Evidence Grounding & 4-Vector Automated Evaluation Engine',
      bulletPoints: ['Generic AI tools (Tome, Gamma) lack factual grounding and VC scoring', 'Deep integration with Google Cloud & Vertex AI Vector Search'],
      speakerNotes: 'Our moat lies in grounded evidence verification and automated VC scoring.',
      claims: ['Proprietary grounding engine'],
      evidenceReferences: ['doc_scoutedge_deck_01#page=8'],
      confidence: 0.90
    },
    {
      slideNumber: 9,
      category: 'FINANCIAL_PROJECTIONS',
      title: 'Financial Projections & Capital Efficiency',
      purpose: 'Present 3-year revenue forecast and runway',
      headline: 'Path to $250,000 ARR in 12 Months with 10 Months Capital Runway',
      bulletPoints: ['Current monthly burn: $15,000', 'Projected break-even at Month 16'],
      speakerNotes: 'Disciplined capital allocation with a clear path to $250k ARR.',
      claims: ['$250k ARR target', '10 months runway'],
      evidenceReferences: ['doc_scoutedge_fin_02#sheet=Summary'],
      confidence: 0.93
    },
    {
      slideNumber: 10,
      category: 'ASK_TEAM',
      title: 'The Investment Ask & Capital Deployment',
      purpose: 'Close with funding target and milestone roadmap',
      headline: 'Raising $1,500,000 Pre-Seed Round to Scale Engineering & GTM',
      bulletPoints: ['60% AI R&D & Engineering, 25% GTM & Sales, 15% Operations', 'Targeting 50 VC fund customers and $500k ARR over next 18 months'],
      speakerNotes: 'We invite investors to join our $1.5M Pre-Seed round to transform VC intelligence.',
      claims: ['$1.5M Pre-Seed ask'],
      evidenceReferences: ['doc_scoutedge_deck_01#page=10'],
      confidence: 0.96
    }
  ],
  exportLinks: {
    googleSlidesUrl: 'https://docs.google.com/presentation/d/demo_scoutedge_slides/edit',
    pdfGcsPath: 'gs://fundable-ai-exports-dev/scoutedge-001/deck_scoutedge_v1.pdf'
  },
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString()
};

pitchesStore.set('scoutedge-001', scoutedgeDeck);

// GET /api/pitches/:startupId — Get current 10-slide pitch deck for startup
pitchesRouter.get('/:startupId', (req: Request, res: Response) => {
  const deck = pitchesStore.get(req.params.startupId);
  if (!deck) {
    return res.status(404).json({ error: `No pitch deck generated yet for startup '${req.params.startupId}'.` });
  }
  res.status(200).json({ deck });
});

// POST /api/pitches/:startupId/generate — Trigger Stage 4-8 multi-stage generation
pitchesRouter.post('/:startupId/generate', (req: Request, res: Response) => {
  res.status(202).json({
    status: 'ACCEPTED',
    message: 'Multi-stage 10-Slide Gemini Generation Pipeline triggered',
    jobId: `job_gen_${Date.now()}`,
    startupId: req.params.startupId
  });
});
