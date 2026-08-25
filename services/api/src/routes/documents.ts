import { Router, Request, Response } from 'express';
import { StartupEvidenceSchema } from '@fundable-ai/core-types';

export const documentsRouter = Router();

const documentsStore = new Map<string, any[]>();

// Seed ScoutEdge initial evidence documents
documentsStore.set('scoutedge-001', [
  {
    evidenceId: 'doc_scoutedge_deck_01',
    startupId: 'scoutedge-001',
    fileName: 'ScoutEdge_Pitch_Deck_Draft.pdf',
    fileType: 'pdf',
    gcsPath: 'gs://fundable-ai-documents-dev/scoutedge-001/ScoutEdge_Pitch_Deck_Draft.pdf',
    fileSizeBytes: 2450000,
    uploadedAt: new Date().toISOString(),
    processedStatus: 'COMPLETED',
    extractedSnippetsCount: 14
  },
  {
    evidenceId: 'doc_scoutedge_fin_02',
    startupId: 'scoutedge-001',
    fileName: 'ScoutEdge_Financials.xlsx',
    fileType: 'xlsx',
    gcsPath: 'gs://fundable-ai-documents-dev/scoutedge-001/ScoutEdge_Financials.xlsx',
    fileSizeBytes: 540000,
    uploadedAt: new Date().toISOString(),
    processedStatus: 'COMPLETED',
    extractedSnippetsCount: 8
  }
]);

// GET /api/documents/:startupId — List documents for a startup
documentsRouter.get('/:startupId', (req: Request, res: Response) => {
  const docs = documentsStore.get(req.params.startupId) || [];
  res.status(200).json({ startupId: req.params.startupId, documents: docs });
});

// POST /api/documents/:startupId — Upload/Register document for a startup
documentsRouter.post('/:startupId', (req: Request, res: Response) => {
  const payload = {
    evidenceId: `doc_${Date.now()}`,
    startupId: req.params.startupId,
    fileName: req.body.fileName || 'uploaded_doc.pdf',
    fileType: req.body.fileType || 'pdf',
    gcsPath: `gs://fundable-ai-documents-dev/${req.params.startupId}/${req.body.fileName || 'uploaded_doc.pdf'}`,
    fileSizeBytes: req.body.fileSizeBytes || 102400,
    uploadedAt: new Date().toISOString(),
    processedStatus: 'PENDING',
    extractedSnippetsCount: 0
  };

  const parseResult = StartupEvidenceSchema.safeParse(payload);
  if (!parseResult.success) {
    return res.status(400).json({
      error: 'Invalid document payload',
      details: parseResult.error.format()
    });
  }

  const currentDocs = documentsStore.get(req.params.startupId) || [];
  currentDocs.push(parseResult.data);
  documentsStore.set(req.params.startupId, currentDocs);

  res.status(201).json({ document: parseResult.data });
});
