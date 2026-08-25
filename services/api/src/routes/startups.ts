import { Router, Request, Response } from 'express';
import { StartupProfileSchema } from '@fundable-ai/core-types';
import { Firestore } from '@google-cloud/firestore';
import { config } from '../config.js';

export const startupsRouter = Router();

const COLLECTION_NAME = 'startups';
const memoryStore = new Map<string, any>();

// Seed ScoutEdge demo profile
const scoutedgeProfile = {
  startupId: 'scoutedge-001',
  name: 'ScoutEdge',
  tagline: 'Autonomous AI Pitch Intelligence & VC Scouting',
  website: 'https://scoutedge.ai',
  founderId: 'demo_founder_scoutedge',
  stage: 'Pre-Seed' as const,
  targetRaise: 1500000,
  currency: 'USD',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString()
};
memoryStore.set(scoutedgeProfile.startupId, scoutedgeProfile);

function getFirestoreInstance(): Firestore | null {
  if (process.env.GOOGLE_APPLICATION_CREDENTIALS || process.env.K_SERVICE) {
    try {
      return new Firestore({ projectId: config.GCP_PROJECT_ID });
    } catch {
      return null;
    }
  }
  return null;
}

// GET /api/startups — List startups
startupsRouter.get('/', async (req: Request, res: Response) => {
  const db = getFirestoreInstance();
  if (db) {
    try {
      const snapshot = await db.collection(COLLECTION_NAME).get();
      if (!snapshot.empty) {
        const startups = snapshot.docs.map(doc => doc.data());
        return res.status(200).json({ startups, source: 'FIRESTORE_LIVE' });
      }
    } catch (err: any) {
      console.warn('Firestore query fallback:', err.message);
    }
  }
  const startups = Array.from(memoryStore.values());
  res.status(200).json({ startups, source: 'MEMORY_STORE' });
});

// GET /api/startups/:id — Get startup profile
startupsRouter.get('/:id', async (req: Request, res: Response) => {
  const db = getFirestoreInstance();
  if (db) {
    try {
      const doc = await db.collection(COLLECTION_NAME).doc(req.params.id).get();
      if (doc.exists) {
        return res.status(200).json({ startup: doc.data(), source: 'FIRESTORE_LIVE' });
      }
    } catch (err: any) {
      console.warn(`Firestore get '${req.params.id}' fallback:`, err.message);
    }
  }
  const startup = memoryStore.get(req.params.id);
  if (!startup) {
    return res.status(404).json({ error: `Startup with ID '${req.params.id}' not found.` });
  }
  res.status(200).json({ startup, source: 'MEMORY_STORE' });
});

// POST /api/startups — Create startup profile
startupsRouter.post('/', async (req: Request, res: Response) => {
  const parseResult = StartupProfileSchema.safeParse({
    ...req.body,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  });

  if (!parseResult.success) {
    return res.status(400).json({
      error: 'Invalid startup profile payload',
      details: parseResult.error.format()
    });
  }

  const newStartup = parseResult.data;
  memoryStore.set(newStartup.startupId, newStartup);

  let persistedLocation = 'MEMORY_STORE';
  const db = getFirestoreInstance();
  if (db) {
    try {
      await db.collection(COLLECTION_NAME).doc(newStartup.startupId).set(newStartup);
      persistedLocation = 'FIRESTORE_LIVE';
    } catch (err: any) {
      console.warn('Firestore write fallback:', err.message);
    }
  }

  res.status(201).json({ startup: newStartup, persistedLocation });
});
