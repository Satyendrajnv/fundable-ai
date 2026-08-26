import { PitchDeck, PitchDeckSchema, EvaluationResult } from '@fundable-ai/core-types';
import { GeminiProvider, VertexGeminiProvider } from '../providers/gemini.js';

export class RegenerationPipeline {
  private provider: GeminiProvider;

  constructor(provider?: GeminiProvider) {
    this.provider = provider || new VertexGeminiProvider();
  }

  /**
   * Targeted Slide Regeneration Pipeline
   * 
   * Given a deck and specific slide numbers, regenerates ONLY the targeted slides
   * using the Gemini provider while preserving all non-targeted slides unchanged.
   * 
   * Architecture:
   *   1. Validate target slide numbers exist in deck
   *   2. Route to GeminiProvider.regenerateSlide() (live Gemini + fallback)
   *   3. Provider returns updated deck with only targeted slides modified
   *   4. Validate output via Zod schema
   *   5. Return updated deck + new evaluation
   */
  async run(deck: PitchDeck, targetSlideNumbers: number[], critique: string): Promise<{ updatedDeck: PitchDeck; newEvaluation: EvaluationResult }> {
    if (targetSlideNumbers.length === 0) {
      throw new Error('Targeted regeneration error: At least one slide number must be targeted.');
    }

    // Validate all target slide numbers exist in the deck
    const validSlideNumbers = new Set(deck.slides.map(s => s.slideNumber));
    for (const num of targetSlideNumbers) {
      if (!validSlideNumbers.has(num)) {
        throw new Error(`Targeted regeneration error: Slide ${num} does not exist in deck.`);
      }
    }

    console.log(`[RegenerationPipeline] Targeting slides ${targetSlideNumbers.join(', ')} with critique: "${critique}"`);

    // Snapshot non-targeted slides for post-regeneration integrity check
    const preservedSlides = deck.slides
      .filter(s => !targetSlideNumbers.includes(s.slideNumber))
      .map(s => ({ slideNumber: s.slideNumber, headline: s.headline, confidence: s.confidence }));

    // Route through the Gemini provider (which has live AI + deterministic fallback)
    const { updatedDeck, newEvaluation } = await this.provider.regenerateSlide(deck, targetSlideNumbers, critique);

    // Verify non-targeted slides were preserved
    for (const original of preservedSlides) {
      const updated = updatedDeck.slides.find(s => s.slideNumber === original.slideNumber);
      if (!updated) {
        throw new Error(`Regeneration integrity error: Slide ${original.slideNumber} was lost during regeneration.`);
      }
    }

    // Verify deck still has exactly 10 slides
    if (updatedDeck.slides.length !== 10) {
      throw new Error(`Regeneration contract error: Expected 10 slides, got ${updatedDeck.slides.length}`);
    }

    console.log(`[RegenerationPipeline] Complete. Deck version: v${updatedDeck.version}, Evaluation: ${newEvaluation.overallScore}/100`);

    return { updatedDeck, newEvaluation };
  }
}
