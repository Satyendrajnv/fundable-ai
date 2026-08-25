import { PitchDeck, StartupEntity, EvaluationResult, EvaluationResultSchema } from '@fundable-ai/core-types';
import { GeminiProvider, VertexGeminiProvider } from '../providers/gemini.js';

export class EvaluationPipeline {
  private provider: GeminiProvider;

  constructor(provider?: GeminiProvider) {
    this.provider = provider || new VertexGeminiProvider();
  }

  async run(deck: PitchDeck, intelligence: StartupEntity): Promise<EvaluationResult> {
    const evaluation = await this.provider.evaluatePitchDeck(deck, intelligence);
    return EvaluationResultSchema.parse(evaluation);
  }
}
