import { Router, Request, Response } from 'express';
import { ExtractionPipeline } from '../pipeline/extraction.js';
import { sessionStore } from '../services/session-store.js';
import { VertexGeminiProvider } from '../providers/gemini.js';
import { FounderAnswerSchema, QuestionSchema } from '@fundable-ai/core-types';

export const intelligenceRouter = Router();

const pipeline = new ExtractionPipeline();
const geminiProvider = new VertexGeminiProvider();

// GET /api/intelligence/:startupId
intelligenceRouter.get('/:startupId', (req: Request, res: Response) => {
  const intel = sessionStore.getIntelligence(req.params.startupId);
  if (!intel) {
    return res.status(404).json({ error: `No intelligence extracted yet for startup '${req.params.startupId}'.` });
  }
  res.status(200).json({ intelligence: intel });
});

// POST /api/intelligence/:startupId/extract — Run Stage 2 Extraction
intelligenceRouter.post('/:startupId/extract', async (req: Request, res: Response) => {
  try {
    const profile = {
      startupId: req.params.startupId,
      name: req.body.name || 'ScoutEdge',
      tagline: req.body.tagline || 'Autonomous AI Pitch Intelligence & VC Scouting',
      founderId: req.body.founderId || 'founder_demo',
      stage: req.body.stage || 'Pre-Seed',
      targetRaise: req.body.targetRaise || 1500000,
      currency: req.body.currency || 'USD',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    // Keep track of profile in session
    sessionStore.setStartupProfile(req.params.startupId, profile);

    // If documents are already uploaded in session, use them; otherwise create a dummy registry
    const sessionDocs = sessionStore.getDocuments(req.params.startupId);
    const evidence = sessionDocs.length > 0 ? sessionDocs : [
      {
        evidenceId: 'doc_01',
        startupId: req.params.startupId,
        fileName: 'ScoutEdge_Pitch_Deck_Draft.pdf',
        fileType: 'pdf' as const,
        gcsPath: `gs://fundable-ai-documents-qwiklabs/${req.params.startupId}/ScoutEdge_Pitch_Deck_Draft.pdf`,
        fileSizeBytes: 2450000,
        uploadedAt: new Date().toISOString(),
        processedStatus: 'COMPLETED' as const,
        extractedSnippetsCount: 14
      }
    ];

    const intelligence = await pipeline.run(profile, evidence);
    sessionStore.setIntelligence(req.params.startupId, intelligence);

    res.status(200).json({ status: 'COMPLETED', intelligence });
  } catch (err: any) {
    console.error('[Intelligence Route] Extraction failed:', err.message);
    res.status(500).json({ error: 'Extraction failed', message: err.message });
  }
});

// POST /api/intelligence/:startupId/questions — Generate Founder Q&A Questions
intelligenceRouter.post('/:startupId/questions', async (req: Request, res: Response) => {
  try {
    let intel = sessionStore.getIntelligence(req.params.startupId);
    if (!intel) {
      // Fallback: extract fresh default intelligence if not present
      const profile = {
        startupId: req.params.startupId,
        name: 'ScoutEdge',
        tagline: 'Autonomous AI Pitch Intelligence & VC Scouting',
        founderId: 'founder_demo',
        stage: 'Pre-Seed' as const,
        targetRaise: 1500000,
        currency: 'USD',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      intel = await pipeline.run(profile, []);
      sessionStore.setIntelligence(req.params.startupId, intel);
    }

    const questions = await geminiProvider.generateVentureQuestions(intel);
    sessionStore.setQuestions(req.params.startupId, questions);

    res.status(200).json({ status: 'COMPLETED', questions });
  } catch (err: any) {
    console.error('[Intelligence Route] Question generation failed:', err.message);
    res.status(500).json({ error: 'Failed to generate questions', message: err.message });
  }
});

// POST /api/intelligence/:startupId/answers — Submit Founder Answers & Refine Intelligence
intelligenceRouter.post('/:startupId/answers', async (req: Request, res: Response) => {
  try {
    const intel = sessionStore.getIntelligence(req.params.startupId);
    if (!intel) {
      return res.status(400).json({ error: 'No active startup intelligence to refine.' });
    }

    // Validate request body answers
    const answers = req.body.answers;
    if (!Array.isArray(answers)) {
      return res.status(400).json({ error: 'Expected answers array in body.' });
    }

    const parsedAnswers = answers.map(a => FounderAnswerSchema.parse(a));

    const refinedIntel = await geminiProvider.refineIntelligenceWithAnswers(intel, parsedAnswers);
    sessionStore.setIntelligence(req.params.startupId, refinedIntel);
    sessionStore.setAnswers(req.params.startupId, parsedAnswers);

    res.status(200).json({ status: 'COMPLETED', intelligence: refinedIntel });
  } catch (err: any) {
    console.error('[Intelligence Route] Answer refinement failed:', err.message);
    res.status(500).json({ error: 'Failed to refine intelligence', message: err.message });
  }
});
