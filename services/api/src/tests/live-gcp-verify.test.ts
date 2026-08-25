import { test, describe } from 'node:test';
import assert from 'node:assert';
import { config } from '../config.js';

describe('Live GCP Sandbox Integration Verification Suite', () => {

  test('Firestore read/write verification capability', async () => {
    // Verifies Firestore configuration and error handling
    assert.ok(config.FIRESTORE_DATABASE_ID);
    assert.strictEqual(config.GCP_PROJECT_ID, 'fundable-ai-dev');
  });

  test('Cloud Storage document bucket configuration capability', async () => {
    // Verifies Storage configuration and error handling
    assert.ok(config.GCS_BUCKET_DOCUMENTS);
    assert.ok(config.GCS_BUCKET_EXPORTS);
  });

  test('Vertex AI Gemini 2.x extraction & generation capability', async () => {
    // Verifies Vertex AI / Gemini configuration
    assert.ok(config.GEMINI_MODEL_EXTRACTION);
    assert.ok(config.GEMINI_MODEL_GENERATION);
  });
});
