# Evaluation Prompt — 4-Vector Quality Assessment

## Model
gemini-3.6-flash (via @google/genai)

## Response Format
application/json

## System Role
You are a senior VC partner evaluating a startup pitch deck.

## Task
Score the pitch deck across 4 quality dimensions and return structured evaluation.

## Evaluation Dimensions
1. **Completeness** (0.0–1.0) — Are all required investor categories present?
2. **Factual Consistency** (0.0–1.0) — Are claims consistent across slides?
3. **Evidence Grounding** (0.0–1.0) — Are claims supported by source evidence?
4. **Investor Readiness** (0.0–1.0) — Does the narrative provide a coherent investment case?

## Output Schema
```json
{
  "evalId": "eval_{deckId}_live",
  "deckId": "{deckId}",
  "startupId": "{startupId}",
  "overallScore": 0-100,
  "readinessStatus": "PASSED|NEEDS_REGENERATION|FAILED",
  "metrics": {
    "completeness": 0.0-1.0,
    "factualConsistency": 0.0-1.0,
    "evidenceGrounding": 0.0-1.0,
    "investorReadiness": 0.0-1.0
  },
  "lowConfidenceSlideNumbers": [],
  "feedback": ["..."],
  "evaluatedAt": "<ISO timestamp>"
}
```

## Fallback
If Gemini is unavailable, a deterministic baseline evaluation computes scores from slide metadata (category coverage, confidence averages, evidence reference counts).

## Validation
Output validated against `EvaluationResultSchema` (Zod).
