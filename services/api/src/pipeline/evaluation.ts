import { PitchDeck, StartupEntity, EvaluationResult, EvaluationResultSchema, SlideCategory } from '@fundable-ai/core-types';

export class EvaluationPipeline {

  async run(deck: PitchDeck, intelligence: StartupEntity): Promise<EvaluationResult> {
    const requiredCategories: SlideCategory[] = [
      'TITLE', 'PROBLEM', 'MARKET_ICP', 'SOLUTION', 'BUSINESS_MODEL',
      'TRACTION', 'GTM_STRATEGY', 'COMPETITION_MOAT', 'FINANCIAL_PROJECTIONS', 'ASK_TEAM'
    ];

    // 1. Calculate Completeness Vector (0.0 - 1.0)
    const presentCategories = new Set(deck.slides.map(s => s.category));
    const categoryCoverage = requiredCategories.filter(c => presentCategories.has(c)).length / 10;
    
    const fullyPopulatedSlides = deck.slides.filter(
      s => s.title.length > 0 && s.headline.length > 0 && s.bulletPoints.length >= 1 && s.speakerNotes.length > 0
    ).length;

    const completenessScore = Number(((categoryCoverage * 0.6) + ((fullyPopulatedSlides / 10) * 0.4)).toFixed(2));

    // 2. Calculate Evidence Grounding Vector (0.0 - 1.0)
    const groundedSlides = deck.slides.filter(s => s.evidenceReferences && s.evidenceReferences.length > 0).length;
    const groundingScore = Number((groundedSlides / 10).toFixed(2));

    // 3. Calculate Factual Consistency Vector (0.0 - 1.0)
    const confidenceAverage = deck.slides.reduce((acc, s) => acc + s.confidence, 0) / deck.slides.length;
    const consistencyScore = Number(confidenceAverage.toFixed(2));

    // 4. Calculate Investor Readiness Score (0 - 100)
    const investorReadinessScore = Number(((completenessScore * 0.35 + groundingScore * 0.35 + consistencyScore * 0.30)).toFixed(2));
    const overallScore = Math.round(investorReadinessScore * 100);

    // Identify Low Confidence Slides (< 0.85 confidence or missing evidence)
    const lowConfidenceSlideNumbers = deck.slides
      .filter(s => s.confidence < 0.85 || !s.evidenceReferences || s.evidenceReferences.length === 0)
      .map(s => s.slideNumber);

    const feedback: string[] = [
      `Completeness Score: ${Math.round(completenessScore * 100)}% (${categoryCoverage * 10}/10 mandatory categories verified).`,
      `Evidence Grounding Score: ${Math.round(groundingScore * 100)}% (${groundedSlides}/10 slides linked directly to source evidence).`,
      `Factual Consistency Score: ${Math.round(consistencyScore * 100)}% (average slide confidence score).`
    ];

    if (lowConfidenceSlideNumbers.length > 0) {
      feedback.push(`Targeted regeneration recommended for slide(s): ${lowConfidenceSlideNumbers.join(', ')}.`);
    } else {
      feedback.push('Deck approved for institutional investor review.');
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
