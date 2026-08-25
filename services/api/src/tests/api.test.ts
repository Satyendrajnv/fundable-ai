import { test, describe, before, after } from 'node:test';
import assert from 'node:assert';
import http from 'node:http';
import { app } from '../app.js';
import { loadConfig } from '../config.js';

function executeRequest(method: string, path: string, body?: any): Promise<{ status: number; body: any }> {
  return new Promise((resolve, reject) => {
    const server = http.createServer(app);
    server.listen(0, '127.0.0.1', async () => {
      try {
        const addr = server.address() as { port: number };
        const url = `http://127.0.0.1:${addr.port}${path}`;
        const options: RequestInit = {
          method,
          headers: { 'Content-Type': 'application/json' }
        };
        if (body) {
          options.body = JSON.stringify(body);
        }
        const res = await fetch(url, options);
        const json = await res.json();
        server.close(() => {
          resolve({ status: res.status, body: json });
        });
      } catch (err) {
        server.close();
        reject(err);
      }
    });
  });
}

describe('Fundable AI API Shell & Endpoint Validation Suite', () => {

  test('Environment Configuration loads and validates cleanly', () => {
    const cfg = loadConfig();
    assert.ok(cfg.GCP_PROJECT_ID, 'GCP Project ID must be defined');
    assert.strictEqual(typeof cfg.PORT, 'number');
    assert.strictEqual(typeof cfg.ENABLE_MOCK_GCP, 'boolean');
  });

  test('GET /health returns 200 OK with GCP metadata', async () => {
    const res = await executeRequest('GET', '/health');
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.body.status, 'OK');
    assert.strictEqual(res.body.service, 'fundable-ai-api');
    assert.ok(res.body.gcpConfig.projectId);
  });

  test('GET /api/startups returns ScoutEdge demo profile', async () => {
    const res = await executeRequest('GET', '/api/startups');
    assert.strictEqual(res.status, 200);
    assert.ok(Array.isArray(res.body.startups));
    const scoutedge = res.body.startups.find((s: any) => s.startupId === 'scoutedge-001');
    assert.ok(scoutedge, 'ScoutEdge profile must be present');
    assert.strictEqual(scoutedge.name, 'ScoutEdge');
  });

  test('POST /api/startups validates payload and creates startup profile', async () => {
    const newStartup = {
      startupId: 'test-startup-002',
      name: 'Test Startup',
      tagline: 'Building next-gen AI',
      founderId: 'founder_999',
      stage: 'Seed',
      targetRaise: 2000000,
      currency: 'USD'
    };

    const res = await executeRequest('POST', '/api/startups', newStartup);
    assert.strictEqual(res.status, 201);
    assert.strictEqual(res.body.startup.startupId, 'test-startup-002');
  });

  test('GET /api/pitches/scoutedge-001 returns EXACTLY 10 slides', async () => {
    const res = await executeRequest('GET', '/api/pitches/scoutedge-001');
    assert.strictEqual(res.status, 200);
    const deck = res.body.deck;
    assert.ok(deck);
    assert.strictEqual(deck.slides.length, 10, 'Pitch deck must contain exactly 10 slides');
    assert.strictEqual(deck.slides[0].category, 'TITLE');
    assert.strictEqual(deck.slides[9].category, 'ASK_TEAM');
  });

  test('GET /api/evaluations/deck_scoutedge_v1 returns 4-vector readiness scores', async () => {
    const res = await executeRequest('GET', '/api/evaluations/deck_scoutedge_v1');
    assert.strictEqual(res.status, 200);
    const evalData = res.body.evaluation;
    assert.ok(evalData);
    assert.strictEqual(evalData.readinessStatus, 'PASSED');
    assert.ok(evalData.metrics.completeness >= 0);
    assert.ok(evalData.metrics.factualConsistency >= 0);
    assert.ok(evalData.metrics.evidenceGrounding >= 0);
    assert.ok(evalData.metrics.investorReadiness >= 0);
  });

  test('POST /api/evaluations/deck_scoutedge_v1/regenerate-slide triggers targeted regeneration', async () => {
    const regenPayload = {
      startupId: 'scoutedge-001',
      targetSlideNumbers: [6, 9],
      reason: 'Improve traction & financials grounding scores'
    };

    const res = await executeRequest('POST', '/api/evaluations/deck_scoutedge_v1/regenerate-slide', regenPayload);
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.body.status, 'COMPLETED');
    assert.ok(res.body.updatedDeck);
    assert.ok(res.body.newEvaluation);
  });

  test('POST /api/exports/deck_scoutedge_v1/pdf generates PDF export job', async () => {
    const res = await executeRequest('POST', '/api/exports/deck_scoutedge_v1/pdf');
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.body.exportJob.format, 'PDF');
    assert.ok(res.body.exportJob.downloadUrl.includes('/pdf/download'));
  });

  test('GET /api/exports/deck_scoutedge_v1/pdf/download serves binary PDF document', async () => {
    const server = http.createServer(app);
    await new Promise<void>((resolve) => server.listen(0, '127.0.0.1', () => resolve()));
    const addr = server.address() as { port: number };
    const url = `http://127.0.0.1:${addr.port}/api/exports/deck_scoutedge_v1/pdf/download`;

    const res = await fetch(url);
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.headers.get('content-type'), 'application/pdf');
    const buf = await res.arrayBuffer();
    assert.ok(buf.byteLength > 1000, 'PDF size must be > 1000 bytes');

    // Verify PDF header magic bytes "%PDF-"
    const headerStr = Buffer.from(buf.slice(0, 5)).toString('utf-8');
    assert.strictEqual(headerStr, '%PDF-');
    server.close();
  });

  test('POST /api/exports/deck_scoutedge_v1/slides generates Google Slides export job', async () => {
    const res = await executeRequest('POST', '/api/exports/deck_scoutedge_v1/slides');
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.body.exportJob.format, 'GOOGLE_SLIDES');
    assert.ok(res.body.exportJob.downloadUrl.includes('docs.google.com/presentation'));
  });
});
