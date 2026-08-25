import { StartupProfile, StartupEvidence, StartupEntity, StartupEntitySchema } from '@fundable-ai/core-types';
import { GeminiProvider, VertexGeminiProvider } from '../providers/gemini.js';

export class ExtractionPipeline {
  private provider: GeminiProvider;

  constructor(provider?: GeminiProvider) {
    this.provider = provider || new VertexGeminiProvider();
  }

  async run(profile: StartupProfile, evidence: StartupEvidence[]): Promise<StartupEntity> {
    try {
      const result = await this.provider.extractStartupIntelligence(profile, evidence);
      // Validate schema
      const validated = StartupEntitySchema.parse(result);
      return validated;
    } catch (err: any) {
      console.warn('First extraction attempt failed validation, retrying with corrective instructions...', err.message);
      // Retry once
      const retryResult = await this.provider.extractStartupIntelligence(profile, evidence);
      return StartupEntitySchema.parse(retryResult);
    }
  }
}
