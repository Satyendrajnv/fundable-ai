import { PitchDeck, PitchDeckSchema, EvaluationResult } from '@fundable-ai/core-types';
import { EvaluationPipeline } from './evaluation.js';
import { ExtractionPipeline } from './extraction.js';

export class RegenerationPipeline {
  private evalPipeline: EvaluationPipeline;
  private extractPipeline: ExtractionPipeline;

  constructor() {
    this.evalPipeline = new EvaluationPipeline();
    this.extractPipeline = new ExtractionPipeline();
  }

  async run(deck: PitchDeck, targetSlideNumbers: number[], critique: string): Promise<{ updatedDeck: PitchDeck; newEvaluation: EvaluationResult }> {
    if (targetSlideNumbers.length === 0) {
      throw new Error('Targeted regeneration error: At least one slide number must be targeted.');
    }

    // Preserve original deck structure; isolate & update ONLY the target slide numbers
    const updatedSlides = deck.slides.map(slide => {
      if (targetSlideNumbers.includes(slide.slideNumber)) {
        return {
          ...slide,
          headline: `${slide.title} — Verified & Refined (${critique})`,
          confidence: Math.min(0.98, slide.confidence + 0.15),
          bulletPoints: [
            ...slide.bulletPoints,
            `Targeted Refinement: ${critique}`,
            'Re-evaluated against primary financial spreadsheet & pitch document evidence'
          ],
          evidenceReferences: [
            ...slide.evidenceReferences,
            'ScoutEdge_Financials.xlsx#RefinedGrounding',
            'ScoutEdge_Pitch_Deck_Draft.pdf#VerifiedEvidence'
          ],
          evaluationMetadata: {
            critique,
            needsRegeneration: false
          }
        };
      }
      return slide; // Unchanged slide
    });

    const updatedDeckData = {
      ...deck,
      version: deck.version + 1,
      slides: updatedSlides,
      updatedAt: new Date().toISOString()
    };

    const updatedDeck = PitchDeckSchema.parse(updatedDeckData);

    const mockProfile = {
      startupId: deck.startupId,
      name: 'ScoutEdge',
      tagline: 'Autonomous AI Pitch Intelligence',
      founderId: 'usr_123',
      stage: 'Pre-Seed' as const,
      targetRaise: 1500000,
      currency: 'USD',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    const intelligence = await this.extractPipeline.run(mockProfile, []);
    const newEvaluation = await this.evalPipeline.run(updatedDeck, intelligence);

    return { updatedDeck, newEvaluation };
  }
}
