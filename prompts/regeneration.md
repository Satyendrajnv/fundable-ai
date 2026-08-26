# Regeneration Prompt — Targeted Slide Refinement

## Model
gemini-3.6-flash (via @google/genai)

## Response Format
application/json

## System Role
You are a pitch deck expert.

## Task
Regenerate ONLY the targeted slides based on evaluator critique. Non-targeted slides must remain unchanged.

## Input
- `critique` — Specific feedback from evaluation (e.g., "Improve evidence grounding for traction")
- `targetSlides[]` — Only the slides that need refinement
- Original slide content for each target

## Regeneration Contract
- ONLY modify targeted slide numbers
- Preserve all non-targeted slides byte-for-byte
- Improve headline, bullet points, speaker notes based on critique
- Bump confidence score (capped at 0.98)
- Set `evaluationMetadata.needsRegeneration = false`

## Output Schema
```json
{
  "updatedSlides": [
    {
      "slideNumber": N,
      "category": "...",
      "title": "...",
      "headline": "<improved based on critique>",
      "bulletPoints": ["<improved>", "..."],
      "speakerNotes": "<improved>",
      "confidence": 0.98,
      "evaluationMetadata": { "critique": "...", "needsRegeneration": false }
    }
  ]
}
```

## Post-Regeneration
After regeneration, the pipeline re-evaluates the full deck to produce updated scores.

## Validation
Updated slides are merged back into the full deck and validated against `PitchDeckSchema` (Zod, enforces 10 slides).
