import { test, describe } from 'node:test';
import assert from 'node:assert';
import {
  StartupProfileSchema,
  PitchDeckSchema,
  PitchSlideSchema,
  EvaluationResultSchema,
  RegenerationRequestSchema,
  SlideCategory
} from '../index.js';

describe('Core Types & Schemas Validation Suite', () => {

  test('StartupProfileSchema accepts valid startup data', () => {
    const validProfile = {
      startupId: 'scoutedge-001',
      name: 'ScoutEdge',
      tagline: 'Autonomous AI Pitch Intelligence & VC Scouting',
      website: 'https://scoutedge.ai',
      founderId: 'usr_123',
      stage: 'Pre-Seed' as const,
      targetRaise: 1500000,
      currency: 'USD',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const parsed = StartupProfileSchema.safeParse(validProfile);
    assert.strictEqual(parsed.success, true);
  });

  test('PitchDeckSchema ENFORCES EXACTLY 10 SLIDES', () => {
    const slideCategories: SlideCategory[] = [
      'TITLE', 'PROBLEM', 'MARKET_ICP', 'SOLUTION', 'BUSINESS_MODEL',
      'TRACTION', 'GTM_STRATEGY', 'COMPETITION_MOAT', 'FINANCIAL_PROJECTIONS', 'ASK_TEAM'
    ];

    const generateSlides = (count: number) => {
      return Array.from({ length: count }, (_, i) => ({
        slideNumber: i + 1,
        category: slideCategories[i % slideCategories.length],
        title: `Slide ${i + 1}`,
        purpose: `Purpose for slide ${i + 1}`,
        headline: `Headline for slide ${i + 1}`,
        bulletPoints: [`Bullet point 1 for slide ${i + 1}`],
        speakerNotes: `Speaker notes for slide ${i + 1}`,
        claims: [`Claim A`],
        evidenceReferences: [`doc_1.pdf#page=${i + 1}`],
        confidence: 0.9
      }));
    };

    // Valid 10-slide deck
    const valid10SlideDeck = {
      deckId: 'deck_100',
      startupId: 'scoutedge-001',
      version: 1,
      status: 'COMPLETED' as const,
      slides: generateSlides(10),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const validParsed = PitchDeckSchema.safeParse(valid10SlideDeck);
    assert.strictEqual(validParsed.success, true, '10-slide deck should pass validation');

    // Invalid 9-slide deck
    const invalid9SlideDeck = { ...valid10SlideDeck, slides: generateSlides(9) };
    const invalid9Parsed = PitchDeckSchema.safeParse(invalid9SlideDeck);
    assert.strictEqual(invalid9Parsed.success, false, '9-slide deck must be rejected');
    if (!invalid9Parsed.success) {
      assert.ok(
        invalid9Parsed.error.issues.some(issue => issue.message.includes('exactly 10 slides')),
        'Error message must specify exactly 10 slides constraint'
      );
    }

    // Invalid 11-slide deck
    const invalid11SlideDeck = { ...valid10SlideDeck, slides: generateSlides(11) };
    const invalid11Parsed = PitchDeckSchema.safeParse(invalid11SlideDeck);
    assert.strictEqual(invalid11Parsed.success, false, '11-slide deck must be rejected');
  });

  test('EvaluationResultSchema validates 4-vector metrics and scores', () => {
    const validEvaluation = {
      evalId: 'eval_001',
      deckId: 'deck_100',
      startupId: 'scoutedge-001',
      overallScore: 88,
      readinessStatus: 'PASSED' as const,
      metrics: {
        completeness: 0.95,
        factualConsistency: 0.92,
        evidenceGrounding: 0.88,
        investorReadiness: 0.85
      },
      lowConfidenceSlideNumbers: [],
      feedback: ['Strong evidence grounding'],
      evaluatedAt: new Date().toISOString()
    };

    const parsed = EvaluationResultSchema.safeParse(validEvaluation);
    assert.strictEqual(parsed.success, true);
  });

  test('RegenerationRequestSchema requires at least one slide number', () => {
    const invalidRegen = {
      deckId: 'deck_100',
      startupId: 'scoutedge-001',
      targetSlideNumbers: [],
      reason: 'Improve traction slide'
    };

    const parsed = RegenerationRequestSchema.safeParse(invalidRegen);
    assert.strictEqual(parsed.success, false);
  });
});
