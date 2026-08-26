import { PitchDeck, StartupEntity, EvaluationResult, EvaluationResultSchema, SlideCategory } from '@fundable-ai/core-types';
import { GeminiProvider, VertexGeminiProvider } from '../providers/gemini.js';

export class EvaluationPipeline {
  private provider: GeminiProvider;

  constructor(provider?: GeminiProvider) {
    this.provider = provider || new VertexGeminiProvider();
  }

  /**
   * 4-Vector Quality Evaluation Pipeline
   * 
   * Strategy:
   *   1. Run deterministic baseline evaluation (always available, fast)
   *   2. Attempt Gemini-powered evaluation via provider
   *   3. If Gemini succeeds, use AI scores (more nuanced)
   *   4. If Gemini fails, return deterministic baseline (graceful degradation)
   */
  async run(deck: PitchDeck, intelligence: StartupEntity): Promise<EvaluationResult> {
    // Always compute deterministic baseline first
    const baseline = this.computeDeterministicEvaluation(deck, intelligence);

    // Attempt Gemini-powered evaluation
    try {
      const aiEvaluation = await this.provider.evaluatePitchDeck(deck, intelligence);
      console.log(`[EvaluationPipeline] Gemini evaluation returned score: ${aiEvaluation.overallScore}/100`);
      return aiEvaluation;
    } catch (err: any) {
      console.warn(`[EvaluationPipeline] Gemini evaluation unavailable, using deterministic baseline: ${err.message}`);
      return baseline;
    }
  }

  /**
   * Deterministic Baseline Evaluation
   * 
   * Computes 4 evaluation vectors using rule-based analysis:
   * 1. Completeness  — Are all 10 mandatory categories present and populated?
   * 2. Evidence Grounding — Are slides linked to source evidence?
   * 3. Factual Consistency — Average confidence across slides
   * 4. Investor Readiness — Weighted composite of all dimensions
   */
  private computeDeterministicEvaluation(deck: PitchDeck, intelligence: StartupEntity): EvaluationResult {
    const requiredCategories: SlideCategory[] = [
      'TITLE', 'PROBLEM', 'MARKET_ICP', 'SOLUTION', 'BUSINESS_MODEL',
      'TRACTION', 'GTM_STRATEGY', 'COMPETITION_MOAT', 'FINANCIAL_PROJECTIONS', 'ASK_TEAM'
    ];

    // 1. Completeness Vector (0.0 - 1.0)
    const presentCategories = new Set(deck.slides.map(s => s.category));
    const categoryCoverage = requiredCategories.filter(c => presentCategories.has(c)).length / 10;

    const fullyPopulatedSlides = deck.slides.filter(
      s => s.title.length > 0 && s.headline.length > 0 && s.bulletPoints.length >= 1 && s.speakerNotes.length > 0
    ).length;

    const completenessScore = Number(((categoryCoverage * 0.6) + ((fullyPopulatedSlides / 10) * 0.4)).toFixed(2));

    // 2. Evidence Grounding Vector (0.0 - 1.0)
    const groundedSlides = deck.slides.filter(s => s.evidenceReferences && s.evidenceReferences.length > 0).length;
    const groundingScore = Number((groundedSlides / 10).toFixed(2));

    // 3. Factual Consistency Vector (0.0 - 1.0)
    const confidenceAverage = deck.slides.reduce((acc, s) => acc + s.confidence, 0) / deck.slides.length;
    const consistencyScore = Number(confidenceAverage.toFixed(2));

    // 4. Investor Readiness Score (composite, 0 - 100)
    const investorReadinessScore = Number(((completenessScore * 0.35 + groundingScore * 0.35 + consistencyScore * 0.30)).toFixed(2));
    const overallScore = Math.round(investorReadinessScore * 100);

    // Identify Low Confidence Slides (< 0.85 confidence or missing evidence)
    const lowConfidenceSlideNumbers = deck.slides
      .filter(s => s.confidence < 0.85 || !s.evidenceReferences || s.evidenceReferences.length === 0)
      .map(s => s.slideNumber);

    const feedback: string[] = [
      `Completeness: ${Math.round(completenessScore * 100)}% — ${categoryCoverage * 10}/10 mandatory investor categories verified.`,
      `Evidence Grounding: ${Math.round(groundingScore * 100)}% — ${groundedSlides}/10 slides linked to source evidence.`,
      `Factual Consistency: ${Math.round(consistencyScore * 100)}% — average slide confidence score.`
    ];

    if (lowConfidenceSlideNumbers.length > 0) {
      feedback.push(`Targeted regeneration recommended for slide(s): ${lowConfidenceSlideNumbers.join(', ')}.`);
    } else {
      feedback.push('All slides meet confidence threshold. Deck approved for investor review.');
    }

    const evalData = {
      evalId: `eval_${deck.deckId}_${Date.now()}`,
      deckId: deck.deckId,
      startupId: deck.startupId,
      overallScore,
      readinessStatus: overallScore >= 80 ? ('PASSED' as const) : ('NEEDS_REGENERATION' as const),
      metrics: {
        completeness: completenessScore,
        factualConsistency: consistencyScore,
        evidenceGrounding: groundingScore,
        investorReadiness: investorReadinessScore
      },
      lowConfidenceSlideNumbers,
      feedback,
      evaluatedAt: new Date().toISOString()
    };

    return EvaluationResultSchema.parse(evalData);
  }
}
