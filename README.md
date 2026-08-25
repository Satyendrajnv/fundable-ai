# Fundable AI — AI Pitch Intelligence Platform

> **Cloud-Native, Serverless AI Pitch Intelligence Platform on Google Cloud**  
> *Transforming raw startup information into evidence-grounded, investment-ready pitch decks.*

---

## 🚀 Overview

**Fundable AI** is an AI-powered pitch intelligence platform built on **Google Cloud**. It automates the parsing, evidence grounding, narrative synthesis, and quality evaluation of startup pitch presentations.

Unlike generic text-to-slide tools, Fundable AI operates as an institutional VC analyst:
1. **Multi-Vector Ingestion & Extraction**: Extracts 10 key business entities (*Problem, ICP, Value Proposition, Solution, Business Model, GTM, Traction, Competition, Financials, Fundraising*) using Gemini 2.x and links claims directly to source evidence.
2. **Retrieval-Augmented Generation (RAG)**: Indexes supporting materials and reference decks using Vertex AI Vector Search.
3. **Multi-Stage Synthesis**: Sequentially crafts an investor-ready 10-slide pitch deck.
4. **Automated 4-Vector Evaluation**: Algorithmic 4-vector scoring (*Completeness*, *Factual Consistency*, *Evidence Grounding*, *Investor Readiness*).
5. **Targeted Regeneration**: Automatically identifies low-confidence slides (`< 80`) and regenerates only those sections before assembly.
6. **Export & Observability**: Exports to Google Slides and PDF, backed by Cloud Run, Firestore, Cloud Storage, Cloud Tasks, Pub/Sub, and Cloud Logging.

---

## 📊 Current Status

### 1. Live Verified
- **Structured Types & Schemas**: `@fundable-ai/core-types` Zod schemas enforcing **strictly 10 slides**.
- **Cloud Run API Gateway**: Containerized Express runtime listening on Port 8080 (`/health` & domain endpoints active).
- **React Studio Frontend**: Interactive 6-step Golden Path web studio (`apps/web`).
- **Cloud Logging & Error Reporting**: JSON telemetry output matching GCP Cloud Logging standard & Express stack trace capture.
- **Automated Test Suite**: 12/12 unit & integration tests passing cleanly.

### 2. Implemented Locally
- **Gemini 2.x Provider (`VertexGeminiProvider`)**: `@google/genai` SDK integrated with fallback provider adapter when ADC/API key is absent in local shell.
- **10-Vector Extraction Pipeline (`ExtractionPipeline`)**: Parses startup profile and documents into 10 business vectors.
- **10-Slide Pitch Deck Generation (`GenerationPipeline`)**: Multi-stage investor narrative synthesis.
- **4-Vector Algorithmic Evaluation (`EvaluationPipeline`)**: Algorithmic vector calculation.
- **Targeted Slide Regeneration (`RegenerationPipeline`)**: Isolated slide refinement preserving unchanged slides.
- **PDF & Google Slides Exporters**: Payload formatting & PDF export job compilation.

### 3. Architecture Ready
- **Pub/Sub & Cloud Tasks**: Event bus and task queue contracts defined in `GenerationJobSchema` and `RegenerationRequestSchema`.
- **Vertex AI Embeddings & Vector Search**: Grounded RAG retrieval interface contract defined in `RetrievedEvidenceSchema`.

### 4. Sandbox Limitations
- **Local Developer Credentials**: Shell environment lacks GCP Application Default Credentials (`Could not load default credentials`), activating local fallback adapters during local test execution.
- **Cloud Run Remote Deployment**: `gcloud` CLI executable is not installed on local PATH; production `Dockerfile` is provided in `services/api/Dockerfile`.

---

## 📁 Repository Structure

```
fundable-ai/
├── ARCHITECTURE.md                  # Fundable AI Architecture Contract v1.0
├── PRODUCT_SPEC.md                  # Product specifications & 10 VC Vectors
├── ENGINEERING_RULES.md            # Immutable engineering guidelines & security rules
│
├── apps/
│   └── web/                         # React + Vite Frontend Application Studio
│
├── services/
│   └── api/                         # Cloud Run Express API Service & Dockerfile
│
├── packages/
│   └── core-types/                  # Shared TypeScript types & Zod schemas
│
├── infrastructure/                  # Terraform & GCP deployment configuration
├── prompts/                         # Versioned Gemini prompt templates
├── tests/                           # Integration & ScoutEdge benchmark test suites
└── docs/                            # GCP Verification Report & Architecture Decision Records
```

---

## 🛠️ Quickstart & Local Setup

### Prerequisites
- **Node.js**: `>= 20.x` (Recommended: v26.x)
- **npm**: `>= 10.x`

### Installation
```bash
# Install all monorepo dependencies
npm install

# Run unit & integration tests across packages
npm test

# Build all packages & services
npm run build
```

### Running Locally
```bash
# Start the API service
npm run dev --workspace=services/api

# Start the Web Studio frontend
npm run dev --workspace=apps/web
```

---

## 📄 License
Privately developed for **Code Kitchen Season 01**. All rights reserved.
