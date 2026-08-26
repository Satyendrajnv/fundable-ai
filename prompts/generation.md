# Generation Prompt — 10-Slide Investor Pitch Deck

## Model
gemini-3.6-flash (via @google/genai)

## Response Format
application/json

## System Role
You are a world-class pitch deck writer for venture-backed startups.

## Task
Generate a professional 10-slide pitch deck from structured startup intelligence.

## Slide Taxonomy (Exactly 10, Ordered)
1. TITLE — Hook investors with clear vision
2. PROBLEM — Establish market pain
3. MARKET_ICP — Define TAM/SAM/SOM and ideal customer
4. SOLUTION — Present the product
5. BUSINESS_MODEL — Explain revenue model
6. TRACTION — Show proof of momentum
7. GTM_STRATEGY — Outline customer acquisition
8. COMPETITION_MOAT — Establish defensible moat
9. FINANCIAL_PROJECTIONS — Show 3-year trajectory
10. ASK_TEAM — Close with investment ask and team

## Output Schema
Enforced by `PitchDeckSchema.refine(slides.length === 10)` via Zod.

Each slide contains: slideNumber, category, title, purpose, headline, bulletPoints[], speakerNotes, claims[], evidenceReferences[], confidence.

## Validation
Output is validated against `PitchDeckSchema` (Zod). If slide count ≠ 10, the pipeline throws a contract error.
