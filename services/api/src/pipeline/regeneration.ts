import { PitchDeck, EvaluationResult } from '@fundable-ai/core-types';
import { GeminiProvider, VertexGeminiProvider } from '../providers/gemini.js';

export class RegenerationPipeline {
  private provider: GeminiProvider;

  constructor(provider?: GeminiProvider) {
    this.provider = provider || new VertexGeminiProvider();
  }

  async run(deck: PitchDeck, targetSlideNumbers: number[], critique: string): Promise<{ updatedDeck: PitchDeck; newEvaluation: EvaluationResult }> {
    if (targetSlideNumbers.length === 0) {
      throw new Error('Targeted regeneration error: At least one slide number must be targeted.');
    }

    // Isolate & regenerate targeted slides only
    const result = await this.provider.regenerateSlide(deck, targetSlideNumbers, critique);
    return result;
  }
}
