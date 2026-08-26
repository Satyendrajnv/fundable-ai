# Fundable AI — Code Kitchen Season 01 Submission Checklist

This checklist summarizes the technical implementation status of the Fundable AI platform for the AIM Code Kitchen Season 01 submission.

## Product Capabilities
- [x] **ScoutEdge Hero Case**: Real startup data used as the primary validation test case.
- [x] **Startup Profile Ingestion**: Ingests founder-supplied metadata and indexed document lists.
- [x] **10-Vector Intelligence Extraction**: Sequentially extracts the 10 core startup business vectors via Gemini.
- [x] **10-Slide Pitch Synthesis**: Sequentially generates exactly 10 investor presentation slides, verified by Zod schema contracts.
- [x] **AI-Powered Evaluation**: Scores generated presentations across completeness, factual consistency, evidence grounding, and investor readiness.
- [x] **Targeted Slide Regeneration**: Surgically refines low-confidence slides based on critique logs, preserving non-targeted slides.
- [x] **10-Page Binary PDF Export**: Compiles slides into a downloadable presentation PDF (`application/pdf`) via the `pdfkit` service.

## Cloud Architecture
- [x] **Serverless Gateway (Cloud Run)**: Deployed Express API gateway and static React SPA container.
- [x] **Structured Persistence (Firestore)**: Writes and reads startup metadata to collection `startups`.
- [x] **Document Persistence (Cloud Storage)**: Maintains uploaded evidence documents.
- [x] **Gemini Integration**: Dual-mode `@google/genai` API key and Vertex AI publisher model interfaces.
- [x] **Observability**: Direct stdout structured logging captured automatically by Cloud Logging.

## Engineering Standards
- [x] **Zod Data Contracts**: Strongly typed schema validation enforcing slide counts, metric ranges, and extraction types.
- [x] **Provider Abstraction**: Common `GeminiProvider` abstraction to switch between Vertex AI native credentials and API keys.
- [x] **Retrieval Abstraction**: Decoupled `RetrievalProvider` interface supporting DocumentStore search for local/sandbox execution.
- [x] **Error Boundaries**: Frontend captures, displays, and resets API connection failures gracefully.
- [x] **Secret Hygiene**: `.env` and `service-account*.json` are strictly gitignored. Zero credential leaks.
- [x] **Automated Tests**: 13 unit and integration tests covering core API routers and schema bounds.

## Deployed Sandbox Constraints
- [x] **Vertex AI native model permissions**: Constrained by Sandbox IAM restrictions; active provider fallback utilizes API key routing.
- [x] **Vertex AI Vector Search**: Sandbox does not provision vector indices; active retrieval uses sandbox DocumentStore provider.
- [x] **Google Slides Export**: Sandbox Workspace integrations are disabled; endpoint exports payload structures.
- [x] **Firebase Authentication**: Intentionally disabled to provide frictionless public judging of the competition MVP.
- [x] **Pub/Sub & Cloud Tasks**: Kept as production-scale architectures; the MVP executes tasks synchronously to ensure demo reliability.
