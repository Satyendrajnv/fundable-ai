import { Router, Request, Response } from 'express';
import { ExportJobSchema } from '@fundable-ai/core-types';

export const exportsRouter = Router();

// POST /api/exports/:deckId/pdf — Trigger PDF rendering & export
exportsRouter.post('/:deckId/pdf', (req: Request, res: Response) => {
  const exportJob = {
    exportJobId: `exp_pdf_${Date.now()}`,
    deckId: req.params.deckId,
    format: 'PDF' as const,
    status: 'COMPLETED' as const,
    downloadUrl: `https://storage.googleapis.com/fundable-ai-exports-dev/${req.params.deckId}.pdf`,
    createdAt: new Date().toISOString()
  };

  const parseResult = ExportJobSchema.safeParse(exportJob);
  if (!parseResult.success) {
    return res.status(500).json({ error: 'Failed to construct PDF export job payload' });
  }

  res.status(200).json({ exportJob: parseResult.data });
});

// POST /api/exports/:deckId/slides — Trigger Google Slides API export
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
