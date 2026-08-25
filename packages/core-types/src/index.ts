import { z } from 'zod';

// ============================================================================
// 1. Startup Profile Schema
// ============================================================================
export const StartupProfileSchema = z.object({
  startupId: z.string().min(1, 'Startup ID is required'),
  name: z.string().min(1, 'Startup name is required'),
  tagline: z.string().min(1, 'Tagline is required'),
  website: z.string().url().optional().or(z.literal('')),
  founderId: z.string().min(1, 'Founder ID is required'),
  stage: z.enum(['Pre-Seed', 'Seed', 'Series A', 'Series B', 'Growth']),
  targetRaise: z.number().positive('Target raise must be greater than zero'),
  currency: z.string().default('USD'),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime()
});

export type StartupProfile = z.infer<typeof StartupProfileSchema>;

// ============================================================================
// 2. Startup Evidence & Document Schemas
// ============================================================================
export const StartupEvidenceSchema = z.object({
  evidenceId: z.string().min(1),
  startupId: z.string().min(1),
  fileName: z.string().min(1),
  fileType: z.enum(['pdf', 'xlsx', 'csv', 'docx', 'txt', 'audio_transcript']),
  gcsPath: z.string().min(1),
  fileSizeBytes: z.number().nonnegative(),
  uploadedAt: z.string().datetime(),
  processedStatus: z.enum(['PENDING', 'PROCESSING', 'COMPLETED', 'FAILED']),
  extractedSnippetsCount: z.number().default(0)
});

export type StartupEvidence = z.infer<typeof StartupEvidenceSchema>;

export const ReferenceDocumentSchema = z.object({
  documentId: z.string().min(1),
  title: z.string().min(1),
  category: z.enum(['benchmark_deck', 'vc_memo_template', 'industry_report']),
  gcsPath: z.string().min(1),
  vectorIndexId: z.string().optional()
});

export type ReferenceDocument = z.infer<typeof ReferenceDocumentSchema>;

export const RetrievedEvidenceSchema = z.object({
  evidenceId: z.string().min(1),
  sourceDocumentName: z.string().min(1),
  pageOrOffset: z.string().optional(),
  snippet: z.string().min(1),
  relevanceScore: z.number().min(0).max(1)
});

export type RetrievedEvidence = z.infer<typeof RetrievedEvidenceSchema>;

// ============================================================================
// 3. Startup Entity Extraction Schema (10 VC Pitch Vectors)
// ============================================================================
export const EntityValueSchema = z.object({
  statement: z.string().min(1),
  groundingEvidenceIds: z.array(z.string()).default([])
});

export const StartupEntitySchema = z.object({
  intelligenceId: z.string().min(1),
  startupId: z.string().min(1),
  version: z.number().int().positive(),
  entities: z.object({
    problem: EntityValueSchema,
    icp: EntityValueSchema,
    valueProposition: EntityValueSchema,
    solution: EntityValueSchema,
    businessModel: EntityValueSchema,
    gtm: EntityValueSchema,
    traction: EntityValueSchema,
    competition: EntityValueSchema,
    financials: z.object({
      burnRate: z.number().nonnegative().optional(),
      runwayMonths: z.number().nonnegative().optional(),
      projectedARR: z.number().nonnegative().optional(),
      groundingEvidenceIds: z.array(z.string()).default([])
    }),
    fundraising: z.object({
      ask: z.string().min(1),
      useOfFunds: z.string().min(1),
      groundingEvidenceIds: z.array(z.string()).default([])
    })
  }),
  extractionConfidence: z.number().min(0).max(1),
  createdAt: z.string().datetime()
});

export type StartupEntity = z.infer<typeof StartupEntitySchema>;

// ============================================================================
// 4. Pitch Slide & 10-Slide Deck Schema (Enforces Exactly 10 Slides)
// ============================================================================
export const SlideCategorySchema = z.enum([
  'TITLE',
  'PROBLEM',
  'MARKET_ICP',
  'SOLUTION',
  'BUSINESS_MODEL',
  'TRACTION',
  'GTM_STRATEGY',
  'COMPETITION_MOAT',
  'FINANCIAL_PROJECTIONS',
  'ASK_TEAM'
]);

export type SlideCategory = z.infer<typeof SlideCategorySchema>;

export const PitchSlideSchema = z.object({
  slideNumber: z.number().int().min(1).max(10),
  category: SlideCategorySchema,
  title: z.string().min(1, 'Slide title is required'),
  purpose: z.string().min(1, 'Slide purpose is required'),
  headline: z.string().min(1, 'Slide headline is required'),
  bulletPoints: z.array(z.string()).min(1, 'At least one bullet point is required'),
  speakerNotes: z.string().min(1, 'Speaker notes are required'),
  claims: z.array(z.string()).default([]),
  evidenceReferences: z.array(z.string()).default([]),
  confidence: z.number().min(0).max(1),
  evaluationMetadata: z.object({
    critique: z.string().optional(),
    needsRegeneration: z.boolean().default(false)
  }).optional()
});

export type PitchSlide = z.infer<typeof PitchSlideSchema>;

export const PitchDeckSchema = z.object({
  deckId: z.string().min(1),
  startupId: z.string().min(1),
  version: z.number().int().positive(),
  status: z.enum(['DRAFT', 'GENERATING', 'EVALUATING', 'REGENERATING', 'COMPLETED', 'FAILED']),
  slides: z.array(PitchSlideSchema),
  exportLinks: z.object({
    googleSlidesUrl: z.string().url().optional().or(z.literal('')),
    pdfGcsPath: z.string().optional().or(z.literal(''))
  }).optional(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime()
}).refine((deck) => deck.slides.length === 10, {
  message: 'Pitch deck must contain exactly 10 slides.',
  path: ['slides']
});

export type PitchDeck = z.infer<typeof PitchDeckSchema>;

// ============================================================================
// 5. Evaluation Result Schema
// ============================================================================
export const EvaluationResultSchema = z.object({
  evalId: z.string().min(1),
  deckId: z.string().min(1),
  startupId: z.string().min(1),
  overallScore: z.number().min(0).max(100),
  readinessStatus: z.enum(['PASSED', 'NEEDS_REGENERATION', 'FAILED']),
  metrics: z.object({
    completeness: z.number().min(0).max(1),
    factualConsistency: z.number().min(0).max(1),
    evidenceGrounding: z.number().min(0).max(1),
    investorReadiness: z.number().min(0).max(1)
  }),
  lowConfidenceSlideNumbers: z.array(z.number().int().min(1).max(10)).default([]),
  feedback: z.array(z.string()).default([]),
  evaluatedAt: z.string().datetime()
});

export type EvaluationResult = z.infer<typeof EvaluationResultSchema>;

// ============================================================================
// 6. Job & Regeneration Schemas
// ============================================================================
export const RegenerationRequestSchema = z.object({
  deckId: z.string().min(1),
  startupId: z.string().min(1),
  targetSlideNumbers: z.array(z.number().int().min(1).max(10)).min(1, 'At least one slide number must be targeted'),
  reason: z.string().min(1)
});

export type RegenerationRequest = z.infer<typeof RegenerationRequestSchema>;

export const GenerationJobSchema = z.object({
  jobId: z.string().min(1),
  startupId: z.string().min(1),
  stage: z.enum(['INGESTION', 'EXTRACTION', 'EVIDENCE', 'RAG', 'GENERATION', 'EVALUATION', 'REGENERATION', 'ASSEMBLY', 'COMPLETED', 'FAILED']),
  progressPercent: z.number().min(0).max(100),
  errorMessage: z.string().optional(),
  startedAt: z.string().datetime(),
  completedAt: z.string().datetime().optional()
});

export type GenerationJob = z.infer<typeof GenerationJobSchema>;

export const ExportJobSchema = z.object({
  exportJobId: z.string().min(1),
  deckId: z.string().min(1),
  format: z.enum(['PDF', 'GOOGLE_SLIDES']),
  status: z.enum(['QUEUED', 'PROCESSING', 'COMPLETED', 'FAILED']),
  downloadUrl: z.string().url().optional().or(z.literal('')),
  createdAt: z.string().datetime()
});

export type ExportJob = z.infer<typeof ExportJobSchema>;
