import { StartupEntity, RetrievedEvidence, PitchDeck, PitchDeckSchema } from '@fundable-ai/core-types';
import { GeminiProvider, VertexGeminiProvider } from '../providers/gemini.js';

export class GenerationPipeline {
  private provider: GeminiProvider;

  constructor(provider?: GeminiProvider) {
    this.provider = provider || new VertexGeminiProvider();
  }

  async run(intelligence: StartupEntity, retrievedEvidence?: RetrievedEvidence[]): Promise<PitchDeck> {
    const deck = await this.provider.generatePitchDeck(intelligence, retrievedEvidence);
    
    // Validate schema strictly (enforces exactly 10 slides)
    const validated = PitchDeckSchema.parse(deck);
    
    if (validated.slides.length !== 10) {
      throw new Error(`Generation pipeline contract error: Expected exactly 10 slides, got ${validated.slides.length}`);
    }

    return validated;
  }
}
