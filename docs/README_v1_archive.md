# Fundable AI

## Investor Intelligence & Pitch Engineering Platform

> **Turn fragmented startup information into structured investor intelligence, measurable pitch quality, and an investment-ready 10-slide deck.**

Fundable AI is a cloud-native, serverless investor intelligence and pitch engineering platform built to transform fragmented startup information into a structured, evidence-aware investment narrative.

It is designed around a simple principle:

> **AI should not only generate a pitch. It should be able to measure the quality of what it generated and improve weak sections without destroying the rest of the work.**

The core product loop is:

```text
INGEST
   ↓
EXTRACT
   ↓
GROUND
   ↓
GENERATE
   ↓
EVALUATE
   ↓
REGENERATE
   ↓
EXPORT
````

Fundable AI was built for **AIM Code Kitchen Season 01**, using Google Cloud as the primary cloud platform and ScoutEdge as the primary demonstration startup.

---

# Table of Contents

* [1. What is Fundable AI?](#1-what-is-fundable-ai)
* [2. The Problem](#2-the-problem)
* [3. The Solution](#3-the-solution)
* [4. Product Thesis](#4-product-thesis)
* [5. Core Innovation](#5-core-innovation)
* [6. Golden Path](#6-golden-path)
* [7. System Architecture](#7-system-architecture)
* [8. Google Cloud Architecture](#8-google-cloud-architecture)
* [9. Application Architecture](#9-application-architecture)
* [10. Intelligence Model](#10-intelligence-model)
* [11. Ten Business Intelligence Vectors](#11-ten-business-intelligence-vectors)
* [12. Ten-Slide Investor Deck](#12-ten-slide-investor-deck)
* [13. Evidence Grounding](#13-evidence-grounding)
* [14. Evaluation Engine](#14-evaluation-engine)
* [15. Targeted Regeneration](#15-targeted-regeneration)
* [16. AI Provider Architecture](#16-ai-provider-architecture)
* [17. Current Technical Baseline](#17-current-technical-baseline)
* [18. Live Deployment](#18-live-deployment)
* [19. ScoutEdge Demonstration](#19-scoutedge-demonstration)
* [20. Repository Structure](#20-repository-structure)
* [21. Technology Stack](#21-technology-stack)
* [22. API Surface](#22-api-surface)
* [23. Data Contracts](#23-data-contracts)
* [24. Local Development](#24-local-development)
* [25. Testing](#25-testing)
* [26. Security](#26-security)
* [27. Capability Matrix](#27-capability-matrix)
* [28. Roadmap](#28-roadmap)
* [29. Engineering Principles](#29-engineering-principles)
* [30. Code Kitchen Submission](#30-code-kitchen-submission)
* [31. Documentation](#31-documentation)
* [32. Final Product Loop](#32-final-product-loop)

---

# 1. What is Fundable AI?

Fundable AI is an **Investor Intelligence & Pitch Engineering Platform**.

It converts fragmented founder information such as:

* pitch decks
* financial spreadsheets
* product information
* market research
* traction metrics
* customer information
* business models
* fundraising requirements
* supporting documents
* founder notes

into:

1. structured startup intelligence
2. evidence-linked business claims
3. a standardized 10-slide investor narrative
4. measurable pitch quality
5. targeted slide-level improvements
6. final presentation exports

The platform therefore treats pitch creation as an **engineering pipeline**, rather than simply prompting an LLM to write presentation content.

---

# 2. The Problem

Startup information is rarely organized in an investor-ready format.

A founder may have the information required to build a strong pitch, but that information is distributed across multiple sources.

For example:

```text
Pitch Deck
    +
Financial Spreadsheet
    +
Product Documentation
    +
Traction Data
    +
Market Research
    +
Founder Notes
    +
Fundraising Requirements
```

The problem is not merely:

> "How do we generate slides?"

The harder problem is:

> "How do we convert fragmented startup information into a coherent, evidence-grounded investment narrative and know whether the resulting pitch is actually good?"

Traditional AI generation approaches often collapse this workflow into:

```text
Input → LLM → Slides
```

Fundable AI instead creates an intermediate intelligence layer:

```text
Raw Information
      ↓
Structured Business Intelligence
      ↓
Evidence
      ↓
Investor Narrative
      ↓
10-Slide Deck
      ↓
Evaluation
      ↓
Targeted Improvement
```

This separation creates a system that is easier to validate, test, evaluate, and evolve.

---

# 3. The Solution

Fundable AI introduces a structured intelligence pipeline between raw startup information and investor presentation generation.

The system separates:

```text
DATA
  ↓
BUSINESS INTELLIGENCE
  ↓
EVIDENCE
  ↓
PITCH GENERATION
  ↓
QUALITY EVALUATION
  ↓
TARGETED REGENERATION
  ↓
EXPORT
```

Instead of treating the pitch as one large generated artifact, the platform treats it as a collection of structured investor-facing components that can be independently evaluated and improved.

---

# 4. Product Thesis

The central product thesis is:

> **Don't let AI generation be a black box. Structure the input, ground the output, measure the result, and regenerate only what needs improvement.**

This leads to five foundational principles:

### Structure before generation

Raw startup information should first become structured business intelligence.

### Evidence before claims

Important investor-facing claims should be connected to supporting evidence whenever available.

### Evaluation after generation

A generated deck should not automatically be considered successful merely because an AI model produced it.

### Regeneration should be surgical

Weak sections should be improved without unnecessarily changing strong sections.

### Capability claims must match technical evidence

The platform explicitly distinguishes live capabilities from provider abstractions and future architecture.

---

# 5. Core Innovation

## Surgical / Targeted Pitch Regeneration

The central architectural differentiator of Fundable AI is **targeted regeneration**.

Most AI generation workflows take this approach:

```text
Generate Deck
     ↓
Find Problem
     ↓
Regenerate Entire Deck
```

Fundable AI instead aims for:

```text
Generate Deck
     ↓
Evaluate Every Component
     ↓
Identify Weak Slides
     ↓
Regenerate Only Weak Slides
     ↓
Preserve Strong Slides
     ↓
Re-evaluate
```

For example:

```text
Generated Deck

Slide 1   ✓
Slide 2   ✓
Slide 3   ✓
Slide 4   ✓
Slide 5   ✓
Slide 6   ⚠ LOW CONFIDENCE
Slide 7   ✓
Slide 8   ✓
Slide 9   ⚠ LOW CONFIDENCE
Slide 10  ✓
```

The system can isolate:

```text
Slide 6
   +
Slide 9
```

for targeted refinement.

The remaining eight slides remain unchanged.

This makes the generation process:

* measurable
* iterative
* non-destructive
* easier to debug
* easier to evaluate
* more controllable

---

# 6. Golden Path

The primary Fundable AI workflow is:

```text
                    FUNDABLE AI GOLDEN PATH

             Startup Profile / Raw Evidence
                         │
                         ▼
                 ┌───────────────┐
                 │    INGEST     │
                 └───────┬───────┘
                         │
                         ▼
                 ┌───────────────┐
                 │    EXTRACT    │
                 └───────┬───────┘
                         │
                         ▼
                 ┌───────────────┐
                 │     GROUND    │
                 └───────┬───────┘
                         │
                         ▼
                 ┌───────────────┐
                 │    GENERATE   │
                 │   10 SLIDES   │
                 └───────┬───────┘
                         │
                         ▼
                 ┌───────────────┐
                 │    EVALUATE   │
                 └───────┬───────┘
                         │
                    ┌────┴────┐
                    │         │
                   PASS     WEAK
                    │         │
                    │         ▼
                    │   TARGETED
                    │ REGENERATION
                    │         │
                    │         ▼
                    │   RE-EVALUATE
                    │         │
                    └────┬────┘
                         │
                         ▼
                  FINAL 10-SLIDE DECK
                         │
                    ┌────┴────┐
                    ▼         ▼
                   PDF     SLIDES
```

The Code Kitchen demonstration uses **ScoutEdge** as the primary startup case study.

---

# 7. System Architecture

```text
                         FUNDABLE AI
                Investor Intelligence Platform
                              │
                              ▼
                    ┌──────────────────┐
                    │   React Studio   │
                    │   Vite Frontend  │
                    └────────┬─────────┘
                             │
                             ▼
                    ┌──────────────────┐
                    │    Cloud Run     │
                    │   REST API       │
                    └────────┬─────────┘
                             │
              ┌──────────────┼──────────────┐
              │              │              │
              ▼              ▼              ▼
        ┌──────────┐   ┌────────────┐  ┌─────────────┐
        │Firestore │   │Cloud       │  │AI Provider  │
        │          │   │Storage     │  │Vertex/Gemini│
        └────┬─────┘   └─────┬──────┘  └──────┬──────┘
             │               │                │
             └───────────────┼────────────────┘
                             ▼
                 ┌─────────────────────┐
                 │ Intelligence Engine │
                 └──────────┬──────────┘
                            │
                            ▼
                 ┌─────────────────────┐
                 │ 10-Slide Generator  │
                 └──────────┬──────────┘
                            │
                            ▼
                 ┌─────────────────────┐
                 │ Evaluation Engine   │
                 │                     │
                 │ Completeness        │
                 │ Consistency         │
                 │ Grounding           │
                 │ Readiness           │
                 └──────────┬──────────┘
                            │
                     ┌──────┴──────┐
                     ▼             ▼
                    PASS      REGENERATE
                                  │
                                  ▼
                         Targeted Refinement
                                  │
                                  ▼
                            Final Pitch
                                  │
                         ┌────────┴────────┐
                         ▼                 ▼
                       PDF          Google Slides
```

---

# 8. Google Cloud Architecture

Fundable AI is built around managed and serverless Google Cloud infrastructure.

| Layer                    | Technology                               | Responsibility                     |
| ------------------------ | ---------------------------------------- | ---------------------------------- |
| Frontend                 | React + Vite                             | Investor pitch studio              |
| API                      | Node.js + TypeScript + Express           | REST API gateway                   |
| Compute                  | Google Cloud Run                         | Serverless application runtime     |
| Database                 | Cloud Firestore                          | Startup and pitch state            |
| Evidence                 | Cloud Storage                            | Documents and supporting materials |
| AI                       | Vertex AI / Gemini provider abstraction  | AI generation interface            |
| Logging                  | Cloud Logging-compatible structured logs | Application telemetry              |
| Error handling           | Error Reporting-compatible stack traces  | Failure visibility                 |
| Async architecture       | Pub/Sub contracts                        | Future event-driven execution      |
| Async retry architecture | Cloud Tasks contracts                    | Future task orchestration          |
| Retrieval architecture   | Embeddings / Vector Search interfaces    | Future retrieval layer             |
| Export                   | PDF + Google Slides adapter              | Presentation delivery              |
| Validation               | Zod                                      | Runtime data contracts             |

The architecture favors managed services and serverless infrastructure to reduce operational overhead.

---

# 9. Application Architecture

The repository is structured as a TypeScript monorepo.

```text
┌──────────────────────────────────────────┐
│                 apps/web                 │
│                                          │
│             React + Vite UI              │
└────────────────────┬─────────────────────┘
                     │
                     │ REST
                     ▼
┌──────────────────────────────────────────┐
│              services/api                │
│                                          │
│        Node.js + TypeScript + Express     │
│                                          │
│  ┌────────┐ ┌────────┐ ┌──────────────┐ │
│  │Routes  │ │Pipeline│ │Providers     │ │
│  └────────┘ └────────┘ └──────────────┘ │
└────────────────────┬─────────────────────┘
                     │
                     ▼
┌──────────────────────────────────────────┐
│            packages/core-types            │
│                                          │
│      Shared TypeScript + Zod Contracts   │
└──────────────────────────────────────────┘
```

---

# 10. Intelligence Model

Fundable AI establishes an intermediate structured intelligence representation before presentation generation.

Instead of:

```text
Raw Documents → Slides
```

the intended architecture is:

```text
Raw Documents
      ↓
Extraction
      ↓
Structured Entities
      ↓
Evidence References
      ↓
Investor Intelligence
      ↓
Pitch Narrative
      ↓
Slides
```

This allows the system to reason about the startup at the business-vector level.

---

# 11. Ten Business Intelligence Vectors

The Fundable AI intelligence model organizes startup information into ten core business vectors.

## 1. Problem

What meaningful problem exists?

What pain does the customer experience?

---

## 2. Ideal Customer Profile

Who specifically experiences the problem?

Who is the target customer?

---

## 3. Value Proposition / Solution

How does the product solve the identified problem?

Why is the proposed solution valuable?

---

## 4. Business Model

How does the company make money?

What is the commercial mechanism?

---

## 5. Go-To-Market

How does the company acquire customers?

What channels and distribution mechanisms are relevant?

---

## 6. Traction

What evidence demonstrates product, customer, revenue, usage, or market progress?

---

## 7. Competition

Who else addresses the problem?

What alternatives already exist?

---

## 8. Market

What market does the company operate in?

What market opportunity and customer segment are relevant?

---

## 9. Financials

What are the relevant financial assumptions, projections, economics, and requirements?

---

## 10. Fundraising / Ask & Team

What is being raised?

Why now?

Who is building the company?

---

# 12. Ten-Slide Investor Deck

Fundable AI enforces a strict ten-slide investor presentation contract.

|  # | Slide                 | Purpose                       |
| -: | --------------------- | ----------------------------- |
|  1 | Title / Company       | Establish company identity    |
|  2 | Problem               | Establish the problem         |
|  3 | Market & ICP          | Establish market and customer |
|  4 | Solution              | Explain the product           |
|  5 | Business Model        | Explain monetization          |
|  6 | Traction              | Demonstrate progress          |
|  7 | Go-To-Market          | Explain distribution          |
|  8 | Competition & Moat    | Establish defensibility       |
|  9 | Financial Projections | Explain financial trajectory  |
| 10 | Fundraise & Team      | Explain ask and founding team |

The shared `PitchDeckSchema` enforces the ten-slide requirement at the data-contract level.

Conceptually:

```text
PitchDeck
   │
   ├── Slide 1
   ├── Slide 2
   ├── Slide 3
   ├── Slide 4
   ├── Slide 5
   ├── Slide 6
   ├── Slide 7
   ├── Slide 8
   ├── Slide 9
   └── Slide 10
```

A deck with fewer or more than ten required slides should not satisfy the core pitch contract.

---

# 13. Evidence Grounding

Evidence is treated as a first-class concept.

The platform models the relationship between:

```text
Startup
   │
   ├── Profile
   │
   ├── Documents
   │      │
   │      └── Evidence
   │
   └── Intelligence
          │
          └── Claims
                 │
                 └── Source References
```

A business claim can therefore be conceptually connected to the document or evidence from which it originated.

Examples of potential evidence sources include:

```text
Pitch Deck
Financial Spreadsheet
Product Document
Traction Report
Market Research
Customer Data
Founder Notes
```

This creates the foundation for future retrieval-augmented generation and reference-document search.

---

# 14. Evaluation Engine

Generation is not considered complete when content is produced.

The generated pitch is evaluated across four dimensions.

## 14.1 Completeness

Measures whether the mandatory investor narrative is covered.

The system evaluates whether the deck contains the expected slide categories and supporting content.

---

## 14.2 Factual Consistency

Measures whether generated content is consistent with the structured startup intelligence and associated confidence attributes.

---

## 14.3 Evidence Grounding

Measures how much of the generated content can be connected to available evidence references.

---

## 14.4 Investor Readiness

Produces a consolidated readiness view from the underlying evaluation dimensions.

Conceptually:

```text
                     GENERATED DECK
                           │
            ┌──────────────┼──────────────┐
            ▼              ▼              ▼
      Completeness    Consistency     Grounding
            │              │              │
            └──────────────┼──────────────┘
                           ▼
                  Investor Readiness
                           │
                    ┌──────┴──────┐
                    ▼             ▼
                   PASS        REGENERATE
```

The current evaluation implementation performs deterministic algorithmic scoring based on deck structure, evidence references, and confidence attributes.

This is deliberately different from claiming that an external AI model independently validates every score.

---

# 15. Targeted Regeneration

Targeted regeneration is Stage 7 of the Fundable AI pipeline.

Suppose evaluation identifies:

```text
Slide 6 — Traction
Slide 9 — Financials
```

as weak.

Instead of regenerating the complete presentation:

```text
10 slides
   ↓
regenerate all 10
```

Fundable AI isolates the targets:

```text
Slide 6 ────────┐
                ├── Targeted Regeneration
Slide 9 ────────┘
```

The remaining slides remain unchanged.

The intended lifecycle is:

```text
Deck v1
  │
  ▼
Evaluate
  │
  ▼
Identify weak slides
  │
  ▼
Regenerate targets
  │
  ▼
Update evidence / confidence
  │
  ▼
Re-evaluate
  │
  ▼
Deck v2
```

This is one of the most important architectural ideas in Fundable AI.

---

# 16. AI Provider Architecture

The AI layer is abstracted behind a provider interface.

Conceptually:

```text
Application
    │
    ▼
AI Provider Interface
    │
    ▼
Gemini Provider
    │
    ▼
Vertex AI / Gemini
```

This separation prevents the application pipeline from being tightly coupled to a particular model invocation implementation.

The provider abstraction is intended to support:

* structured extraction
* pitch generation
* evaluation-related AI workflows
* targeted regeneration

The architectural intent is:

```text
Business Logic
      │
      ▼
Provider Interface
      │
      ├── Vertex AI / Gemini
      │
      └── Future providers if required
```

---

# 17. Current Technical Baseline

## Important: Honest Capability Boundary

Fundable AI is deployed on Google Cloud and has a working serverless application vertical slice.

However, the temporary Code Kitchen environment restricted live Vertex AI billing/API enablement.

Therefore the project **does not claim live Gemini execution where it could not be verified**.

The current defensible description is:

> **A production-deployed, serverless Google Cloud application with live Firestore and Cloud Storage, deterministic intelligence/evaluation pipelines, targeted regeneration, and a Vertex AI/Gemini provider abstraction.**

This distinction is intentional.

The system separates:

### Live / Verified

Capabilities that have been exercised against the deployed system.

### Implemented

Application logic and contracts that are present and tested.

### Adapter / Provider Ready

Interfaces and transformations designed for external services but not fully exercised against live APIs in the constrained environment.

### Architecture Ready

Future infrastructure contracts that are designed but not activated.

This prevents the documentation from overstating technical capabilities.

---

# 18. Live Deployment

The Code Kitchen deployment runs on:

## Google Cloud Run

Live application:

**[https://fundable-ai-api-1012209490160.us-central1.run.app](https://fundable-ai-api-1012209490160.us-central1.run.app)**

The deployed service provides the React Web Studio and REST API.

```text
https://fundable-ai-api-1012209490160.us-central1.run.app/
```

### Application surface

```text
/
│
├── React Web Studio
│
├── /health
│
├── /api/startups
├── /api/documents
├── /api/intelligence
├── /api/pitches
├── /api/evaluations
└── /api/exports
```

---

# 19. ScoutEdge Demonstration

The Code Kitchen Golden Path uses **ScoutEdge** as the primary demonstration startup.

The demonstration is structured as:

```text
ScoutEdge
   │
   ▼
Startup Profile
   │
   ▼
Evidence
   │
   ▼
10 Business Vectors
   │
   ▼
10-Slide Investor Deck
   │
   ▼
4-Vector Evaluation
   │
   ▼
Targeted Regeneration
   │
   ▼
Final Deck
   │
   ▼
PDF Export
```

The ScoutEdge case study demonstrates the complete product journey rather than a standalone AI generation prompt.

---

# 20. Repository Structure

```text
fundable-ai/
│
├── apps/
│   └── web/
│       ├── src/
│       │   ├── App.tsx
│       │   ├── main.tsx
│       │   └── index.css
│       │
│       ├── index.html
│       ├── package.json
│       ├── tsconfig.json
│       └── vite.config.ts
│
├── services/
│   └── api/
│       ├── src/
│       │   │
│       │   ├── pipeline/
│       │   │   ├── extraction.ts
│       │   │   ├── generation.ts
│       │   │   ├── evaluation.ts
│       │   │   └── regeneration.ts
│       │   │
│       │   ├── providers/
│       │   │   └── gemini.ts
│       │   │
│       │   ├── routes/
│       │   │   ├── startups.ts
│       │   │   ├── documents.ts
│       │   │   ├── intelligence.ts
│       │   │   ├── pitches.ts
│       │   │   ├── evaluations.ts
│       │   │   └── exports.ts
│       │   │
│       │   ├── config.ts
│       │   ├── app.ts
│       │   └── index.ts
│       │
│       ├── Dockerfile
│       ├── package.json
│       └── tsconfig.json
│
├── packages/
│   └── core-types/
│       ├── src/
│       │   ├── index.ts
│       │   └── test/
│       │       └── index.test.ts
│       ├── package.json
│       └── tsconfig.json
│
├── docs/
│   └── SUBMISSION_SUMMARY.md
│
├── ARCHITECTURE.md
├── PRODUCT_SPEC.md
├── ENGINEERING_RULES.md
├── GCP_VERIFICATION.md
├── README.md
├── package.json
├── tsconfig.json
└── .env.example
```

---

# 21. Technology Stack

## Frontend

* React
* TypeScript
* Vite
* Custom CSS / design system

## Backend

* Node.js
* TypeScript
* Express

## Validation

* Zod
* Shared TypeScript contracts

## Cloud

* Google Cloud Run
* Google Cloud Firestore
* Google Cloud Storage
* Cloud Logging-compatible structured logs
* Error Reporting-compatible error handling

## AI

* Vertex AI / Gemini provider abstraction
* `@google/genai`

## Future / Adapter Architecture

* Vertex AI Embeddings
* Vector Search
* Pub/Sub
* Cloud Tasks
* Google Slides API

---

# 22. API Surface

The API is organized around the Fundable AI Golden Path.

## Health

```http
GET /health
```

Returns application health and deployment metadata.

---

## Startups

```http
GET /api/startups
```

Returns available startup profiles.

```http
GET /api/startups/:startupId
```

Returns a specific startup profile.

---

## Documents

```http
GET /api/documents/:startupId
```

Returns evidence/document information associated with a startup.

---

## Intelligence

```http
POST /api/intelligence/:startupId/extract
```

Executes the startup intelligence extraction workflow.

The conceptual result is the structured ten-vector startup intelligence model.

---

## Pitch Generation

```http
GET /api/pitches/:startupId
```

Returns the generated pitch state.

```http
POST /api/pitches/:startupId/generate
```

Executes the pitch generation workflow.

The pitch contract requires exactly ten slides.

---

## Evaluation

```http
GET /api/evaluations/:deckId
```

Returns the evaluation result for a deck.

```http
POST /api/evaluations/:deckId/regenerate-slide
```

Requests targeted regeneration for selected slides.

Example:

```json
{
  "targetSlideNumbers": [6, 9],
  "reason": "Improve traction and financial grounding"
}
```

---

## Export

```http
POST /api/exports/:deckId/pdf
```

Creates a PDF export job for the deck.

---

# 23. Data Contracts

Fundable AI follows a schema-first architecture.

The shared `@fundable-ai/core-types` package contains Zod schemas and inferred TypeScript types for core entities.

The architecture includes contracts for concepts such as:

```text
StartupProfile
StartupEvidence
StartupEntity
ReferenceDocument
RetrievedEvidence
PitchSlide
PitchDeck
EvaluationResult
RegenerationRequest
GenerationJob
ExportJob
```

The schema layer exists to prevent the frontend, API, pipeline, and provider layers from developing incompatible representations.

---

# 24. Local Development

## Requirements

* Node.js
* npm
* Git

Optional for Google Cloud workflows:

* Google Cloud CLI (`gcloud`)
* Google Cloud project credentials
* Docker

---

## Clone the repository

```bash
git clone https://github.com/Satyendrajnv/fundable-ai.git

cd fundable-ai
```

---

## Install dependencies

```bash
npm install
```

---

## Run tests

```bash
npm test
```

---

## Build the entire monorepo

```bash
npm run build
```

---

## Run the API

```bash
npm run dev --workspace=services/api
```

The local API is expected at:

```text
http://localhost:8080
```

---

## Run the frontend

The frontend is built using Vite.

During local development, the Vite configuration proxies API requests to the local API service.

Expected frontend URL:

```text
http://localhost:3000
```

---

# 25. Testing

Fundable AI uses automated tests to protect the core product contracts.

Current verification baseline:

```text
12 / 12 tests passing
0 build errors
```

Tests cover areas including:

* startup profile validation
* schema contracts
* pitch deck validation
* exactly ten slides
* evaluation result validation
* regeneration request validation
* API endpoint behavior
* targeted regeneration behavior

The key invariant is:

> **A valid Fundable AI pitch deck contains exactly ten investor slides.**

---

# 26. Security

Security is treated as a first-class engineering concern.

## Never commit credentials

Never commit:

```text
.env
.env.*
service-account.json
*.pem
*.key
API keys
access tokens
private credentials
```

Credentials should be supplied through:

* environment variables
* Google Cloud authentication
* Secret Manager
* appropriate deployment identity mechanisms

---

## Least privilege

Cloud identities should receive only the permissions required for the workload.

Fundable AI's intended IAM posture avoids broad project-level privileges for application service accounts.

---

## Repository hygiene

Before pushing changes:

```bash
git diff --check
```

Audit tracked files for secrets.

Example:

```bash
git ls-files | grep -E "service-account|\.env"
```

The repository should contain no credential material.

---

# 27. Capability Matrix

Fundable AI intentionally documents its current technical maturity.

| Capability                        | Current Status                    |
| --------------------------------- | --------------------------------- |
| React Web Studio                  | **Live**                          |
| Cloud Run deployment              | **Live**                          |
| REST API                          | **Live**                          |
| Firestore integration             | **Live / deployed**               |
| Cloud Storage integration         | **Live / deployed**               |
| PDF export                        | **Live / binary PDF document**    |
| 10-vector intelligence model      | **Implemented**                   |
| 10-slide pitch contract           | **Implemented**                   |
| Deterministic evaluation engine   | **Implemented**                   |
| Targeted slide regeneration       | **Implemented**                   |
| Gemini provider abstraction       | **Implemented**                   |
| Live Vertex AI / Gemini execution | **Sandbox constrained**           |
| Evidence-reference architecture   | **Implemented**                   |
| Embeddings                        | **Architecture / provider-ready** |
| Vector Search                     | **Architecture-ready**            |
| Pub/Sub                           | **Architecture-ready**            |
| Cloud Tasks                       | **Architecture-ready**            |
| Google Slides API                 | **Adapter-ready**                 |
| Firebase Authentication           | **Future**                        |
| Accelerator integrations          | **Future**                        |
| CRM integrations                  | **Future**                        |
| Multi-tenant platform             | **Future**                        |

---

# 28. Roadmap

The current build intentionally prioritizes the core vertical slice.

Future development can extend the same architecture.

---

## Phase 1 — Live AI Intelligence

### Objectives

* Activate live Vertex AI Gemini execution
* Replace deterministic provider fallback where appropriate
* Implement document-level extraction
* Improve evidence offsets
* Add structured claim verification

Target architecture:

```text
Documents
   ↓
Gemini
   ↓
Structured Entities
   ↓
Evidence References
   ↓
Validated Intelligence
```

---

# Phase 2 — Retrieval Intelligence

Introduce retrieval over reference material.

Potential components:

* Vertex AI Embeddings
* Vector Search
* reference deck indexing
* retrieval-augmented generation
* comparable startup intelligence
* benchmark retrieval

Conceptually:

```text
Startup
   │
   ▼
Structured Intelligence
   │
   ▼
Query
   │
   ▼
Vector Search
   │
   ▼
Comparable Evidence
   │
   ▼
Pitch Generation
```

---

# Phase 3 — Distributed Orchestration

Introduce asynchronous workflow execution.

Potential infrastructure:

* Pub/Sub
* Cloud Tasks
* asynchronous generation jobs
* retry policies
* pipeline state transitions
* long-running document processing

Target architecture:

```text
Request
   │
   ▼
Cloud Run
   │
   ▼
Pub/Sub
   │
   ├── Extraction
   │
   ├── Generation
   │
   ├── Evaluation
   │
   └── Regeneration
```

---

# Phase 4 — Presentation Infrastructure

Extend export capabilities.

Potential features:

* Google Slides API
* richer PDF rendering
* slide templates
* presentation versioning
* collaborative editing
* presentation themes

---

# Phase 5 — Platform

Turn the core engine into a broader startup intelligence platform.

Potential capabilities:

* Firebase Authentication
* multi-tenant workspaces
* accelerator integrations
* CRM integrations
* portfolio analytics
* startup benchmarking
* investor intelligence
* application/program management
* founder workflow automation

---

# 29. Engineering Principles

## 29.1 Schema-first

Core business objects should have explicit schemas.

TypeScript and Zod contracts provide a shared language across the application.

---

## 29.2 Evidence-first

Investor-facing claims should be grounded in available source material wherever possible.

---

## 29.3 Evaluation-first

Generation should be followed by measurable evaluation.

---

## 29.4 Targeted regeneration

Avoid unnecessary destruction of valid generated content.

Regenerate only the components that need improvement.

---

## 29.5 Serverless by default

Use managed cloud infrastructure wherever practical.

This reduces operational complexity and keeps the application focused on product intelligence.

---

## 29.6 Provider abstraction

Business logic should not be unnecessarily coupled to one AI implementation.

The provider layer creates a boundary between:

```text
Application Logic
        │
        ▼
Provider Contract
        │
        ▼
AI Infrastructure
```

---

## 29.7 Security by design

Secrets must never be hardcoded or committed.

Application identities should use least-privilege permissions.

---

## 29.8 Honest capability reporting

Documentation must distinguish:

```text
LIVE
IMPLEMENTED
ADAPTER-READY
ARCHITECTURE-READY
FUTURE
```

This is particularly important for AI infrastructure.

---

# 30. Code Kitchen Submission

Fundable AI was built for:

**AIM Code Kitchen Season 01**

The project was developed under a constrained build window with the objective of producing a working cloud-native application rather than an unfinished collection of architectural components.

The Code Kitchen implementation prioritizes:

```text
Stable Vertical Slice
        over
Unfinished Feature Breadth
```

The core demonstration is:

```text
ScoutEdge
    ↓
Evidence
    ↓
Intelligence
    ↓
10-Slide Pitch
    ↓
Evaluation
    ↓
Targeted Regeneration
    ↓
PDF
```

---

# 31. Documentation

The repository contains additional technical documentation.

## Architecture

[`ARCHITECTURE.md`](./ARCHITECTURE.md)

Contains:

* system architecture
* service boundaries
* pipeline stages
* cloud components
* API contracts
* data model direction

---

## Product Specification

[`PRODUCT_SPEC.md`](./PRODUCT_SPEC.md)

Contains:

* product requirements
* pitch structure
* business intelligence vectors
* evaluation requirements
* product behavior

---

## Engineering Rules

[`ENGINEERING_RULES.md`](./ENGINEERING_RULES.md)

Contains:

* engineering constraints
* security requirements
* architecture rules
* provider requirements
* testing expectations

---

## GCP Verification

[`GCP_VERIFICATION.md`](./GCP_VERIFICATION.md)

Contains:

* cloud verification evidence
* deployment information
* service capability status
* known environment limitations

---

## Submission Summary

[`docs/SUBMISSION_SUMMARY.md`](./docs/SUBMISSION_SUMMARY.md)

Contains:

* Code Kitchen submission narrative
* architecture summary
* demonstration flow
* video script
* evidence checklist
* technical positioning

---

# 32. Final Product Loop

The complete Fundable AI concept can be summarized as:

```text
                         FUNDABLE AI

              Fragmented Startup Information
                           │
                           ▼
                   ┌───────────────┐
                   │ INGEST        │
                   │ & STRUCTURE   │
                   └───────┬───────┘
                           │
                           ▼
                   ┌───────────────┐
                   │ BUSINESS      │
                   │ INTELLIGENCE  │
                   └───────┬───────┘
                           │
                           ▼
                   ┌───────────────┐
                   │ EVIDENCE      │
                   │ GROUNDING     │
                   └───────┬───────┘
                           │
                           ▼
                   ┌───────────────┐
                   │ 10-SLIDE      │
                   │ GENERATION    │
                   └───────┬───────┘
                           │
                           ▼
                   ┌───────────────┐
                   │ EVALUATION    │
                   │               │
                   │ Completeness  │
                   │ Consistency   │
                   │ Grounding     │
                   │ Readiness     │
                   └───────┬───────┘
                           │
                    ┌──────┴──────┐
                    │             │
                   PASS          WEAK
                    │             │
                    │             ▼
                    │      TARGETED
                    │    REGENERATION
                    │             │
                    │             ▼
                    │       RE-EVALUATE
                    │             │
                    └──────┬──────┘
                           │
                           ▼
                     FINAL PITCH
                           │
                     ┌─────┴─────┐
                     ▼           ▼
                    PDF        SLIDES
```

---

# The Fundable AI Thesis

Fundable AI is not positioned as another generic text-to-slide application.

Its technical identity is:

> **An evaluated investor intelligence pipeline that transforms fragmented startup information into structured business intelligence, generates a strict 10-slide investment narrative, measures the quality of that narrative, and surgically improves weak sections.**

The key workflow is:

```text
Extract
   ↓
Ground
   ↓
Generate
   ↓
Evaluate
   ↓
Regenerate
   ↓
Export
```

And the key architectural idea is:

> **Targeted regeneration instead of destructive full-deck regeneration.**

---

# Current Status

**Code Kitchen Submission Build — Frozen**

The current release prioritizes:

* working cloud deployment
* stable API contracts
* structured startup intelligence
* strict 10-slide generation
* deterministic evaluation
* targeted regeneration
* PDF export
* secure cloud architecture
* honest capability reporting

over unfinished infrastructure breadth.

The next generation of Fundable AI can activate live Gemini execution, retrieval, asynchronous orchestration, richer presentation exports, and broader platform integrations without changing the fundamental architecture.

---

# Fundable AI

### From founder information to investor intelligence.

**Extract → Ground → Generate → Evaluate → Regenerate → Export**
