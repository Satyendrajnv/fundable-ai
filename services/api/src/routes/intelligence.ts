import { Router, Request, Response } from 'express';
import { ExtractionPipeline } from '../pipeline/extraction.js';

export const intelligenceRouter = Router();

const pipeline = new ExtractionPipeline();
const intelligenceStore = new Map<string, any>();

// GET /api/intelligence/:startupId
intelligenceRouter.get('/:startupId', (req: Request, res: Response) => {
  const intel = intelligenceStore.get(req.params.startupId);
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
      tagline: req.body.tagline || 'Autonomous AI Pitch Intelligence',
      founderId: 'founder_demo',
      stage: req.body.stage || 'Pre-Seed',
      targetRaise: req.body.targetRaise || 1500000,
      currency: 'USD',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const evidence = [
      {
        evidenceId: 'doc_01',
        startupId: req.params.startupId,
        fileName: 'ScoutEdge_Pitch_Deck_Draft.pdf',
        fileType: 'pdf' as const,
        gcsPath: `gs://fundable-ai-documents-dev/${req.params.startupId}/ScoutEdge_Pitch_Deck_Draft.pdf`,
        fileSizeBytes: 2450000,
        uploadedAt: new Date().toISOString(),
        processedStatus: 'COMPLETED' as const,
        extractedSnippetsCount: 14
      }
    ];

    const intelligence = await pipeline.run(profile, evidence);
    intelligenceStore.set(req.params.startupId, intelligence);

    res.status(200).json({ status: 'COMPLETED', intelligence });
  } catch (err: any) {
    res.status(500).json({ error: 'Extraction failed', message: err.message });
  }
});
