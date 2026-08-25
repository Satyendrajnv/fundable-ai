# Fundable AI Architecture Contract v1.0

> **Status**: Immutable System Contract  
> **Repository**: `Satyendrajnv/fundable-ai`  
> **Cloud Platform**: Google Cloud Platform (GCP)  
> **Primary AI Stack**: Vertex AI + Gemini 2.x

---

## 1. Executive Summary & System Context

Fundable AI is a serverless, cloud-native pitch intelligence platform built on **Google Cloud**. It ingests raw, un-structured startup information (documents, decks, financial tables, text notes) and transforms it into a structured, evidence-grounded startup intelligence representation. This representation powers a multi-stage Gemini generation pipeline, an automated 4-vector evaluation engine, targeted slide-level regeneration, and export to Google Slides and PDF.

---

## 2. Immutable Technology Stack & GCP Capability Matrix

| Layer | Component | Technology / GCP Service | Purpose | Fallback / Local Dev Strategy |
| :--- | :--- | :--- | :--- | :--- |
| **Frontend Studio** | Web Application | React + Vite (TypeScript) | Interactive Pitch Studio & Evaluation Dashboard | Local Vite Dev Server |
| **Authentication** | Auth Service | Firebase Authentication | Secure user sign-in & JWT token management | Firebase Auth SDK / Local Token Mock |
| **Serverless API** | API Gateway | Cloud Run (Node.js/Express) | Serverless REST API handlers & pipeline orchestration | Local Express Runtime container |
| **Structured Datastore** | Database | Cloud Firestore | Real-time storage of Startup Profiles, Decks, & Evals | Firestore Emulator / Cloud API |
| **Object Storage** | Blob Store | Cloud Storage (GCS) | Secure storage for PDFs, spreadsheets, & deck exports | GCS SDK / Local File Adapter |
| **AI / LLM Engine** | Reasoning Engine | Vertex AI (Gemini 2.x) | Entity extraction, multi-stage slide generation, evaluation | Vertex AI SDK / `@google/genai` |
| **RAG / Vector Index** | Retrieval Engine | Vertex AI Vector Search | Reference pitch deck embedding & evidence retrieval | Vector Search API / In-Memory Indexer |
| **Async Tasks** | Task Queue | Cloud Tasks & Pub/Sub | Asynchronous generation, evaluation, & regeneration | GCP Cloud Tasks / Local Event Queue |
| **Observability** | Telemetry | Cloud Logging & Monitoring | Operational metrics, structured logs, error tracking | GCP Cloud Logging / Pino Console Logger |
| **Export Engines** | Presentation Export | Google Slides API & PDF Renderer | Export final 10-slide deck to Slides & PDF | Workspace API / Puppeteer HTML-to-PDF |

---

## 3. The 9-Stage AI Pipeline Specification

```
[Stage 1: Ingestion] -> [Stage 2: Extraction] -> [Stage 3: Evidence Linking]
                                                            |
[Stage 6: Evaluation] <- [Stage 5: Multi-Stage Gen] <- [Stage 4: RAG Retrieval]
         |
         +--> [Pass >= 80?] ---> [Stage 8: Assembly] ---> [Stage 9: Export]
         |
         +--> [Fail < 80?]  ---> [Stage 7: Targeted Regeneration] --+ (Loop back to Stage 6)
```

1. **Stage 1 — Ingestion**: Secure upload of documents to `gs://fundable-ai-documents/{startupId}/` and Firestore doc indexing.
2. **Stage 2 — Extraction**: Gemini 2.x processes documents with Zod structured output to extract 10 business entities (*Problem, ICP, Value Proposition, Solution, Business Model, GTM, Traction, Competition, Financials, Fundraising*).
3. **Stage 3 — Evidence Linking**: Links extracted facts directly to source document chunks (`docId`, `page`, `snippet`).
4. **Stage 4 — RAG Retrieval**: Fetches relevant reference market benchmarks and deck layout context from Vertex AI Vector Search.
5. **Stage 5 — Multi-Stage Generation**: Sequentially synthesizes the 10 investor slides (Title, Problem, ICP, Solution, Business Model, Traction, GTM, Competition, Financials, Ask) with speaker notes and bullet points.
6. **Stage 6 — Evaluation Engine**: Evaluates the generated deck across 4 vectors: Completeness, Factual Consistency, Evidence Grounding, and Investor Readiness.
7. **Stage 7 — Targeted Regeneration**: Isolates slides scoring `< 80` confidence, passes evaluation critique back to Gemini, and regenerates only the low-confidence slides.
8. **Stage 8 — Assembly**: Combines refined slides into a verified 10-slide JSON deck structure.
9. **Stage 9 — Export**: Triggers Google Slides API rendering and serverless PDF compilation.

---

## 4. Firestore Data Model Specifications

### 4.1 Collection Layout
- `startups/{startupId}`
- `startups/{startupId}/documents/{docId}`
- `startups/{startupId}/intelligence/{intelligenceId}`
- `startups/{startupId}/pitch_decks/{deckId}`
- `startups/{startupId}/evaluations/{evalId}`

---

## 5. REST API Specifications

All endpoints are hosted under `/api/v1/` on Cloud Run.

- `POST /api/v1/startups` — Create startup profile
- `POST /api/v1/startups/{id}/documents` — Ingest document
- `POST /api/v1/startups/{id}/extract` — Execute Stage 2 Extraction
- `POST /api/v1/startups/{id}/generate-deck` — Trigger Stage 4-8 Generation Pipeline
- `GET  /api/v1/startups/{id}/decks/{deckId}` — Retrieve Pitch Deck & Evaluation Report
- `POST /api/v1/startups/{id}/decks/{deckId}/regenerate-slide` — Trigger Stage 7 Regeneration
- `POST /api/v1/startups/{id}/decks/{deckId}/export/pdf` — Render & Export PDF
- `POST /api/v1/startups/{id}/decks/{deckId}/export/slides` — Export to Google Slides
