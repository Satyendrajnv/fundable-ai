# Extraction Prompt — 10-Vector Startup Intelligence

## Model
gemini-3.6-flash (via @google/genai)

## Response Format
application/json

## System Role
You are a senior VC analyst.

## Task
Extract the 10 core pitch intelligence vectors from the startup profile and return ONLY valid JSON.

## Input Variables
- `profile.name` — Startup name
- `profile.tagline` — One-line description
- `profile.stage` — Funding stage (Pre-Seed, Seed, Series A, etc.)
- `profile.targetRaise` — Target raise amount
- `profile.currency` — Currency (USD default)
- `evidence[].fileName` — Names of uploaded evidence documents

## Output Schema
```json
{
  "intelligenceId": "intel_{startupId}_live",
  "startupId": "{startupId}",
  "version": 1,
  "entities": {
    "problem": { "statement": "<specific market problem>", "groundingEvidenceIds": [] },
    "icp": { "statement": "<ideal customer profile>", "groundingEvidenceIds": [] },
    "valueProposition": { "statement": "<core value proposition>", "groundingEvidenceIds": [] },
    "solution": { "statement": "<technical solution approach>", "groundingEvidenceIds": [] },
    "businessModel": { "statement": "<revenue model, pricing>", "groundingEvidenceIds": [] },
    "gtm": { "statement": "<go-to-market strategy>", "groundingEvidenceIds": [] },
    "traction": { "statement": "<traction metrics, milestones>", "groundingEvidenceIds": [] },
    "competition": { "statement": "<competitive landscape, moat>", "groundingEvidenceIds": [] },
    "financials": { "burnRate": 0, "runwayMonths": 0, "projectedARR": 0, "groundingEvidenceIds": [] },
    "fundraising": { "ask": "<raise amount>", "useOfFunds": "<allocation>", "groundingEvidenceIds": [] }
  },
  "extractionConfidence": 0.94,
  "createdAt": "<ISO timestamp>"
}
```

## Validation
Output is validated against `StartupEntitySchema` (Zod) before entering the pipeline.
