import { Router, Request, Response } from 'express';
import { StartupEvidenceSchema } from '@fundable-ai/core-types';
import { Storage } from '@google-cloud/storage';
import { config } from '../config.js';

export const documentsRouter = Router();

const BUCKET_NAME = 'fundable-ai-documents-qwiklabs';
const documentsStore = new Map<string, any[]>();

// Seed ScoutEdge initial evidence documents
documentsStore.set('scoutedge-001', [
  {
    evidenceId: 'doc_scoutedge_deck_01',
    startupId: 'scoutedge-001',
    fileName: 'ScoutEdge_Pitch_Deck_Draft.pdf',
    fileType: 'pdf',
    gcsPath: `gs://${BUCKET_NAME}/scoutedge-001/ScoutEdge_Pitch_Deck_Draft.pdf`,
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
    gcsPath: `gs://${BUCKET_NAME}/scoutedge-001/ScoutEdge_Financials.xlsx`,
    fileSizeBytes: 540000,
    uploadedAt: new Date().toISOString(),
    processedStatus: 'COMPLETED',
    extractedSnippetsCount: 8
  }
]);

function getStorageInstance(): Storage | null {
  if (process.env.GOOGLE_APPLICATION_CREDENTIALS || process.env.K_SERVICE) {
    try {
      return new Storage({ projectId: config.GCP_PROJECT_ID });
    } catch {
      return null;
    }
  }
  return null;
}

// GET /api/documents/:startupId — List documents for a startup
documentsRouter.get('/:startupId', (req: Request, res: Response) => {
  const docs = documentsStore.get(req.params.startupId) || [];
  res.status(200).json({ startupId: req.params.startupId, documents: docs, bucket: BUCKET_NAME });
});

// POST /api/documents/:startupId — Register & upload document
documentsRouter.post('/:startupId', async (req: Request, res: Response) => {
  const startupId = req.params.startupId;
  const fileName = req.body.fileName || 'uploaded_doc.pdf';
  const fileContent = req.body.fileContent;
  const fileType = req.body.fileType || 'pdf';

  // 1. Enforce validation on content
  if (!fileContent || typeof fileContent !== 'string' || fileContent.trim().length === 0) {
    return res.status(400).json({ error: 'Document content cannot be empty.' });
  }

  const gcsPath = `gs://${BUCKET_NAME}/${startupId}/${fileName}`;

  // 2. Upload to Cloud Storage if available
  let storageStatus = 'MEMORY_ONLY';
  const gcs = getStorageInstance();
  if (gcs) {
    try {
      const bucket = gcs.bucket(BUCKET_NAME);
      const file = bucket.file(`${startupId}/${fileName}`);
      await file.save(fileContent, { contentType: 'text/plain' });
      storageStatus = 'GCS_LIVE';
    } catch (err: any) {
      console.warn('Cloud Storage upload fallback:', err.message);
    }
  }

  const payload = {
    evidenceId: `doc_${Date.now()}`,
    startupId,
    fileName,
    fileType,
    gcsPath,
    fileSizeBytes: Buffer.byteLength(fileContent, 'utf-8'),
    uploadedAt: new Date().toISOString(),
    processedStatus: 'COMPLETED',
    extractedSnippetsCount: 5
  };

  const parseResult = StartupEvidenceSchema.safeParse(payload);
  if (!parseResult.success) {
    return res.status(400).json({
      error: 'Invalid document payload',
      details: parseResult.error.format()
    });
  }

  const currentDocs = documentsStore.get(startupId) || [];
  currentDocs.push(parseResult.data);
  documentsStore.set(startupId, currentDocs);

  // 3. Sync and ensure startup session exists in sessionStore
  const { sessionStore } = await import('../services/session-store.js');
  let profile = sessionStore.getStartupProfile(startupId);
  if (!profile) {
    profile = {
      startupId,
      name: fileName.split('.')[0].slice(0, 30),
      tagline: 'Extracted from uploaded venture materials',
      founderId: 'usr_custom_123',
      stage: 'Seed',
      targetRaise: 1000000,
      currency: 'USD',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    sessionStore.setStartupProfile(startupId, profile);
  }
  
  sessionStore.addDocument(startupId, parseResult.data, fileContent);

  // 4. Return correct JSON structure (no raw text)
  res.status(201).json({
    documentId: parseResult.data.evidenceId,
    fileName: parseResult.data.fileName,
    characterCount: fileContent.length,
    ingestionStatus: 'SUCCESS',
    storageStatus
  });
});
