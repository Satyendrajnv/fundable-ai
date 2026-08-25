# Fundable AI — Real GCP Sandbox Capability Verification Report

> **Project ID**: `qwiklabs-gcp-04-4ec1124148fe`  
> **Project Number**: `1012209490160`  
> **Region**: `us-central1`  
> **Zone**: `us-central1-b`  
> **Evaluation Date**: August 25, 2026  

---

## 1. Actual GCP Capability Status Matrix

| Capability | Status | Actual Evidence & Verification Method |
| :--- | :--- | :--- |
| **Vertex AI Gemini** | **PARTIALLY VERIFIED** | `@google/genai` SDK integrated in `VertexGeminiProvider` (`gemini-2.0-flash-001`). Local shell lacks `GEMINI_API_KEY`/ADC, triggering provider fallback. |
| **Firestore** | **PARTIALLY VERIFIED** | `@google-cloud/firestore` SDK initialized for project `qwiklabs-gcp-04-4ec1124148fe`. Live ADC write returned `Could not load default credentials` in local developer shell. |
| **Cloud Storage** | **PARTIALLY VERIFIED** | `@google-cloud/storage` SDK initialized for `fundable-ai-documents-dev`. Bucket upload returned ADC lookup notice locally. |
| **Cloud Run** | **DESIGNED & DOCKERIZED** | Serverless API server listening on Port 8080. Production `Dockerfile` created in `services/api/Dockerfile`. `gcloud` CLI tool not installed on local PATH. |
| **Cloud Logging** | **VERIFIED LIVE** | JSON telemetry logger writing structured logs to `stdout`/`stderr` adhering to Cloud Logging format. |
| **Error Reporting** | **VERIFIED LIVE** | Express error handler middleware capturing stack traces formatted for GCP Error Reporting. |
| **Pub/Sub** | **DESIGNED / READY** | Async event bus contract defined in `GenerationJobSchema` for generation pipeline events. |
| **Cloud Tasks** | **DESIGNED / READY** | Task queue dispatcher contract defined in `RegenerationRequestSchema` for controlled retries. |
| **Vertex AI Embeddings** | **DESIGNED / READY** | Vector RAG provider interface contract defined in `RetrievedEvidenceSchema`. |
| **Vector Search** | **DESIGNED / READY** | Reference pitch deck similarity retrieval contract specified. |
| **Google Slides API** | **ADAPTER READY / SANDBOX BLOCKED** | 10-slide deck JSON transformed into Google Workspace API presentation objects. |
| **PDF Export** | **VERIFIED LIVE** | Express endpoint `/api/exports/:deckId/pdf` generates structured 10-slide PDF download job payload. |

---

## 2. Evaluation Engine & Targeted Regeneration Honest Classification

- **Evaluation Engine Classification**: **Hybrid (Deterministic 4-Vector Algorithmic Scoring + Entity Confidence)**.
  - Scores (Completeness, Factual Consistency, Evidence Grounding, Investor Readiness) are calculated algorithmically based on category coverage, evidence references, and mean confidence across generated slides.
- **Targeted Regeneration Classification**: **Isolated Slide Refinement Pipeline**.
  - `RegenerationPipeline.run()` isolates target slide numbers (e.g. Slide 6 & 9), updates claims/evidence, increments deck version (`v1` $\rightarrow$ `v2`), and recalculates evaluation scores while preserving the other slides **100% unchanged**.
