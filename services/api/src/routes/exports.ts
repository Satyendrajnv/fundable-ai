import { Router, Request, Response } from 'express';
import { ExportJobSchema, PitchDeck } from '@fundable-ai/core-types';
import { generatePitchDeckPdfBuffer } from '../services/pdf.js';
import { VertexGeminiProvider } from '../providers/gemini.js';

export const exportsRouter = Router();
const geminiProvider = new VertexGeminiProvider();

// Helper to construct a demo deck if needed
async function getDeckForExport(deckId: string): Promise<PitchDeck> {
  const startupId = deckId.includes('scoutedge') ? 'scoutedge-001' : 'demo-startup';
  const intelligence = await geminiProvider.extractStartupIntelligence({
    startupId,
    name: 'ScoutEdge',
    tagline: 'Autonomous AI Pitch Intelligence & VC Scouting',
    founderId: 'demo_founder_scoutedge',
    stage: 'Pre-Seed',
    targetRaise: 1500000,
    currency: 'USD',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }, []);

  return geminiProvider.generatePitchDeck(intelligence);
}

// GET /api/exports/:deckId/pdf/download — Serves real binary PDF bytes
exportsRouter.get('/:deckId/pdf/download', async (req: Request, res: Response) => {
  try {
    const deck = await getDeckForExport(req.params.deckId);
    const pdfBuffer = await generatePitchDeckPdfBuffer(deck);

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${req.params.deckId}.pdf"`);
    res.setHeader('Content-Length', pdfBuffer.length);
    return res.status(200).send(pdfBuffer);
  } catch (error: any) {
    return res.status(500).json({ error: 'Failed to render PDF export document', message: error.message });
  }
});

// POST /api/exports/:deckId/pdf — Trigger PDF rendering & export job
exportsRouter.post('/:deckId/pdf', (req: Request, res: Response) => {
  const protocol = req.protocol;
  const host = req.get('host') || 'localhost:8080';
  const downloadUrl = `${protocol}://${host}/api/exports/${req.params.deckId}/pdf/download`;

  const exportJob = {
    exportJobId: `exp_pdf_${Date.now()}`,
    deckId: req.params.deckId,
    format: 'PDF' as const,
    status: 'COMPLETED' as const,
    downloadUrl,
    createdAt: new Date().toISOString()
  };

  const parseResult = ExportJobSchema.safeParse(exportJob);
  if (!parseResult.success) {
    return res.status(500).json({ error: 'Failed to construct PDF export job payload' });
  }

  res.status(200).json({ exportJob: parseResult.data });
});

// POST /api/exports/:deckId/slides — Trigger Google Slides export preview
exportsRouter.post('/:deckId/slides', (req: Request, res: Response) => {
  const exportJob = {
    exportJobId: `exp_slides_${Date.now()}`,
    deckId: req.params.deckId,
    format: 'GOOGLE_SLIDES' as const,
    status: 'COMPLETED' as const,
    downloadUrl: `https://docs.google.com/presentation/d/demo_export_${req.params.deckId}/edit`,
    createdAt: new Date().toISOString()
  };

  const parseResult = ExportJobSchema.safeParse(exportJob);
  if (!parseResult.success) {
    return res.status(500).json({ error: 'Failed to construct Google Slides export job payload' });
  }

  res.status(200).json({ exportJob: parseResult.data });
});
