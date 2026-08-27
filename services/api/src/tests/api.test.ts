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

  test('POST /api/intelligence/test-startup-002/questions generates structured interview questions', async () => {
    const res = await executeRequest('POST', '/api/intelligence/test-startup-002/questions');
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.body.status, 'COMPLETED');
    assert.ok(Array.isArray(res.body.questions));
    assert.ok(res.body.questions.length >= 3);
    assert.ok(res.body.questions[0].questionId);
    assert.ok(res.body.questions[0].question);
    assert.ok(res.body.questions[0].relatedVector);
  });

  test('POST /api/intelligence/test-startup-002/answers refines business vectors with founder answers', async () => {
    const answersPayload = [
      {
        questionId: 'q_traction_1',
        answer: '$150k ARR, 15% MoM customer growth',
        skipped: false
      },
      {
        questionId: 'q_gtm_1',
        answer: 'Direct sales to Enterprise VCs and growth accelerators',
        skipped: false
      }
    ];

    const res = await executeRequest('POST', '/api/intelligence/test-startup-002/answers', { answers: answersPayload });
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.body.status, 'COMPLETED');
    assert.ok(res.body.intelligence);
    assert.strictEqual(res.body.intelligence.version, 2, 'Version should increment on refinement');
    assert.ok(res.body.intelligence.entities.traction.statement.includes('$150k ARR'));
  });

  describe('AgroPulse User-First End-to-End Regression Validation', () => {
    const startupId = 'agropulse-regression';

    test('1. Upload evidence document with custom text', async () => {
      const docRes = await executeRequest('POST', `/api/documents/${startupId}`, {
        fileName: 'AgroPulse_Spec.txt',
        fileContent: 'Startup: AgroPulse. Problem: Small farms waste water because irrigation decisions are based on fixed schedules. Solution: Low-cost sensor-driven irrigation recommendations. Traction: 127 paying farms.',
        fileType: 'txt'
      });
      assert.strictEqual(docRes.status, 201);
      assert.strictEqual(docRes.body.fileName, 'AgroPulse_Spec.txt');
      assert.strictEqual(docRes.body.ingestionStatus, 'SUCCESS');
    });

    test('2. Extract intelligence and assert strict grounding without ScoutEdge leakage', async () => {
      const extRes = await executeRequest('POST', `/api/intelligence/${startupId}/extract`, {
        name: 'AgroPulse',
        tagline: 'Precision irrigation for small farms'
      });
      assert.strictEqual(extRes.status, 200);
      const intel = extRes.body.intelligence;
      assert.ok(intel);
      
      // Problem vector assertion
      assert.ok(intel.entities.problem.statement.includes('waste water'), 'Problem must match AgroPulse data');
      assert.ok(!intel.entities.problem.statement.includes('ScoutEdge'), 'No ScoutEdge leakage in problem');
      
      // Solution vector assertion
      assert.ok(intel.entities.solution.statement.includes('sensor-driven'), 'Solution must match AgroPulse data');
      assert.ok(!intel.entities.solution.statement.includes('Serverless multi-stage'), 'No generic SaaS leakage in solution');
    });

    test('3. Founder Q&A generation detects gaps and answers refine traction', async () => {
      // Get gaps questions
      const qRes = await executeRequest('POST', `/api/intelligence/${startupId}/questions`);
      assert.strictEqual(qRes.status, 200);
      assert.ok(qRes.body.questions.length > 0);

      // Submit answers
      const ansRes = await executeRequest('POST', `/api/intelligence/${startupId}/answers`, {
        answers: [
          {
            questionId: 'q_traction_1',
            answer: 'Refined traction: 127 paying farms validated in July 2026.',
            skipped: false
          }
        ]
      });
      assert.strictEqual(ansRes.status, 200);
      assert.strictEqual(ansRes.body.intelligence.version, 2);
      assert.ok(ansRes.body.intelligence.entities.traction.statement.includes('127 paying farms'));
    });

    test('4. Generate deck and assert 10 slides ground in AgroPulse context', async () => {
      const deckRes = await executeRequest('POST', `/api/pitches/${startupId}/generate`);
      assert.strictEqual(deckRes.status, 200);
      const deck = deckRes.body.deck;
      assert.strictEqual(deck.slides.length, 10, 'Deck must enforce exactly 10 slides');
      assert.ok(deck.slides[1].headline.includes('AgroPulse') || deck.slides[1].bulletPoints[0].includes('waste water') || deck.slides[1].bulletPoints[0].includes('AgroPulse'), 'Slide content must reflect AgroPulse problem');
    });

    test('5. Evaluate and perform targeted regeneration preserving non-targeted slides', async () => {
      // First get a deck
      const deckRes = await executeRequest('POST', `/api/pitches/${startupId}/generate`);
      const deck = deckRes.body.deck;

      // Evaluate
      const evalRes = await executeRequest('GET', `/api/evaluations/${deck.deckId}`);
      assert.strictEqual(evalRes.status, 200);
      assert.ok(evalRes.body.evaluation);

      // Regenerate Slide 6 and 9
      const regenRes = await executeRequest('POST', `/api/evaluations/${deck.deckId}/regenerate-slide`, {
        targetSlideNumbers: [6, 9],
        reason: 'Improve evidence grounding scores'
      });
      assert.strictEqual(regenRes.status, 200);
      const updatedDeck = regenRes.body.updatedDeck;
      assert.strictEqual(updatedDeck.version, 2);

      // Assert non-target slide (Slide 1) has unchanged title
      assert.strictEqual(updatedDeck.slides[0].title, deck.slides[0].title, 'Non-target slide 1 must remain unchanged');
      
      // Assert target slide (Slide 6) is mutated
      assert.ok(updatedDeck.slides[5].headline.includes('Refined & Grounded'), 'Target slide 6 must be mutated');
    });
  });

  describe('Ingestion Validation & Multi-User Isolation Tests', () => {
    test('TEST A & B: TXT upload and pasted text equivalent caching', async () => {
      const startupId = 'startup-caching-test';
      
      // Upload text content (Option A/B)
      const docRes = await executeRequest('POST', `/api/documents/${startupId}`, {
        fileName: 'AgroPulse_Input.txt',
        fileContent: 'AgroPulse provides sensor-driven irrigation recommendations to small farms.',
        fileType: 'txt'
      });
      assert.strictEqual(docRes.status, 201);
      assert.strictEqual(docRes.body.ingestionStatus, 'SUCCESS');
      assert.strictEqual(docRes.body.characterCount, 75);
      assert.ok(docRes.body.documentId);
      
      // Check that it's cached in the session store
      const { sessionStore } = await import('../services/session-store.js');
      const content = sessionStore.getDocumentContent(startupId, docRes.body.documentId);
      assert.strictEqual(content, 'AgroPulse provides sensor-driven irrigation recommendations to small farms.');
    });

    test('TEST C: Reject empty or missing content with 400 Bad Request', async () => {
      const docRes = await executeRequest('POST', '/api/documents/empty-test', {
        fileName: 'Empty_File.txt',
        fileContent: '   ', // whitespace only
        fileType: 'txt'
      });
      assert.strictEqual(docRes.status, 400);
      assert.strictEqual(docRes.body.error, 'Document content cannot be empty.');
    });

    test('TEST D: Extraction grounding asserts no ScoutEdge leakage', async () => {
      const startupId = 'agropulse-clean-grounding';
      
      await executeRequest('POST', `/api/documents/${startupId}`, {
        fileName: 'AgroPulse.txt',
        fileContent: 'Startup: AgroPulse. Problem: Small farms waste water because irrigation decisions are based on fixed schedules. Solution: Low-cost sensor-driven irrigation recommendations. Traction: 127 paying farms.',
        fileType: 'txt'
      });

      const extRes = await executeRequest('POST', `/api/intelligence/${startupId}/extract`, {
        name: 'AgroPulse',
        tagline: 'Sensor-driven irrigation'
      });
      
      assert.strictEqual(extRes.status, 200);
      const intel = extRes.body.intelligence;
      
      // Assert AgroPulse specific content is found
      assert.ok(intel.entities.problem.statement.includes('waste water'));
      assert.ok(intel.entities.solution.statement.includes('sensor-driven'));
      assert.ok(intel.entities.traction.statement.includes('127 paying farms'));
      
      // Assert no ScoutEdge or default SaaS details leaked
      const strIntel = JSON.stringify(intel);
      assert.ok(!strIntel.includes('ScoutEdge'), 'Contamination: ScoutEdge found in clean AgroPulse extract');
      assert.ok(!strIntel.includes('Serverless multi-stage'), 'Contamination: default SaaS found in solution');
    });

    test('TEST E: Multi-user session evidence isolation', async () => {
      const startupA = 'startup-a-irrigation';
      const startupB = 'startup-b-solar';

      // Upload different content for A
      await executeRequest('POST', `/api/documents/${startupA}`, {
        fileName: 'A.txt',
        fileContent: 'Startup A is called AgroPulse. We do water irrigation sensors for farms.',
        fileType: 'txt'
      });

      // Upload different content for B
      await executeRequest('POST', `/api/documents/${startupB}`, {
        fileName: 'B.txt',
        fileContent: 'Startup B is called Heliotech. We do micro-grid solar collectors for warehouses.',
        fileType: 'txt'
      });

      // Extract A
      const extA = await executeRequest('POST', `/api/intelligence/${startupA}/extract`, {
        name: 'AgroPulse',
        tagline: 'Water irrigation'
      });

      // Extract B
      const extB = await executeRequest('POST', `/api/intelligence/${startupB}/extract`, {
        name: 'Heliotech',
        tagline: 'Solar collectors'
      });

      // Assert isolation
      assert.ok(extA.body.intelligence.entities.problem.statement.includes('irrigation') || extA.body.intelligence.entities.solution.statement.includes('irrigation'));
      assert.ok(!JSON.stringify(extA.body.intelligence).includes('Heliotech'), 'Leakage: A contains B info');
      assert.ok(!JSON.stringify(extA.body.intelligence).includes('solar'), 'Leakage: A contains B keywords');

      assert.ok(extB.body.intelligence.entities.problem.statement.includes('solar') || extB.body.intelligence.entities.solution.statement.includes('solar'));
      assert.ok(!JSON.stringify(extB.body.intelligence).includes('AgroPulse'), 'Leakage: B contains A info');
      assert.ok(!JSON.stringify(extB.body.intelligence).includes('irrigation'), 'Leakage: B contains A keywords');
    });
  });
});
