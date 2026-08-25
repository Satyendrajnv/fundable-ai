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
4. **Automated 4-Vector Evaluation**: Algorithmic evaluation across *Completeness*, *Factual Consistency*, *Evidence Grounding*, and *Investor Readiness*.
5. **Targeted Regeneration**: Automatically identifies low-confidence slides (`< 80`) and regenerates only those sections before assembly.
6. **Export & Observability**: Exports to Google Slides and PDF, backed by Cloud Run, Firestore, Cloud Storage, Cloud Tasks, Pub/Sub, and Cloud Logging.

---

## 📊 Implementation & Verification Status

| Feature | Status | Description |
| :--- | :--- | :--- |
| **React Studio Frontend** | **IMPLEMENTED & LIVE VERIFIED** | 6-step interactive Golden Path studio shell. |
| **Cloud Run Express API** | **IMPLEMENTED & LIVE VERIFIED** | Containerized serverless API gateway with health & domain endpoints. |
| **10-Vector Extraction Pipeline** | **IMPLEMENTED & LIVE VERIFIED** | Gemini 2.x extraction with Zod schema validation. |
| **10-Slide Deck Generation** | **IMPLEMENTED & LIVE VERIFIED** | Multi-stage pitch deck synthesis enforcing strictly 10 slides. |
| **Automated Evaluation Engine** | **IMPLEMENTED & LIVE VERIFIED** | Algorithmic 4-vector scoring engine (Completeness, Consistency, Grounding, Readiness). |
| **Targeted Slide Regeneration** | **IMPLEMENTED & LIVE VERIFIED** | Isolated slide refinement preserving unchanged slides. |
| **Firestore & Cloud Storage** | **IMPLEMENTED & LIVE VERIFIED** | Persistence layer with GCP SDKs and local fallback adapters. |
| **PDF & Google Slides Exporters** | **IMPLEMENTED & LIVE VERIFIED** | Export engine formatting presentation payloads & PDF downloads. |
| **Pub/Sub & Cloud Tasks** | **DESIGNED & READY** | Event bus and task queue dispatcher contracts for async execution. |
| **Vertex Vector Search RAG** | **DESIGNED & READY** | Vector index provider interface for reference deck retrieval. |

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
│   └── api/                         # Cloud Run Express API Service
│
├── packages/
│   └── core-types/                  # Shared TypeScript types & Zod schemas
│
├── infrastructure/                  # Terraform & GCP deployment configuration
├── prompts/                         # Versioned Gemini prompt templates
├── tests/                           # Integration & ScoutEdge benchmark test suites
└── docs/                            # API specs, GCP verification report, & ADRs
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
