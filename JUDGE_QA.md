# Fundable AI — Code Kitchen Judge Q&A Guide

Prepare for technical questions from Google Cloud engineering judges using this reference sheet.

---

### Q1: Why did you choose Gemini and the `@google/genai` SDK?
> **Answer**: Gemini models excel at structured data extraction (with native support for JSON schema enforcement via `responseMimeType: 'application/json'`). The modern `@google/genai` SDK provides unified support for both direct API key execution (for sandbox environments) and Vertex AI native enterprise deployments.

### Q2: Why did you use Cloud Run?
> **Answer**: Cloud Run provides a serverless container hosting environment. It automatically scales to zero when idle, handles REST API routing, compiles React static assets under one unified Express container, and captures standard system stdout logs directly into Google Cloud Logging.

### Q3: How do you handle persistence on the backend?
> **Answer**: We use Native Google Cloud Firestore to store startup profile states in the `startups` collection, and Cloud Storage to persist raw documents. To ensure local offline developer isolation, we implement silent in-memory fallback stores (`Map`) if database instances are unreachable.

### Q4: Why are Zod schemas so critical in your architecture?
> **Answer**: LLM output is untrusted. By validating all structured model extraction, slide parameters, evaluation results, and regeneration request payloads against strict Zod schema contracts (e.g. enforcing exactly 10 slides via Zod's `refine`), we guarantee downstream API stability.

### Q5: What is "Targeted Slide Regeneration" and why is it useful?
> **Answer**: Regenerating an entire deck on a simple tweak is wasteful, slow, and alters accepted content. Fundable AI isolates only the specific slide indices flagged with low confidence (e.g., Slides 6 & 9), triggers surgical updates via Gemini critique loops, and merges them back while preserving the other 8 slides byte-for-byte.

### Q6: Why isn't Vertex AI Vector Search active?
> **Answer**: The temporary competition sandbox does not provision similarity indices or allow creation of vector index endpoints. We implement a clean `RetrievalProvider` interface with a sandbox-compatible `DocumentStoreRetrievalProvider` that maps document source locations, allowing direct swap-in of native Vector Search in production.

### Q7: Why is Google Slides export disabled?
> **Answer**: Google Workspace authentication is restricted in the temporary sandbox environment. The REST endpoint (`POST /api/exports/:deckId/slides`) returns the correctly structured API contract payload, while the frontend guides judges through the fully implemented PDF download.

### Q8: How is authentication handled?
> **Answer**: For the competition demo, endpoints are deployed with `--allow-unauthenticated` to remove login friction for judges. In a production environment, we would secure routes using Firebase Authentication tokens validated by Express middleware.

### Q9: Why is execution synchronous instead of using Pub/Sub or Cloud Tasks?
> **Answer**: The current MVP prioritizes absolute demo determinism and low latency. The monorepo layout isolates pipeline wrappers (`ExtractionPipeline`, `GenerationPipeline`, `EvaluationPipeline`) making migration to asynchronous task runner workers simple.
