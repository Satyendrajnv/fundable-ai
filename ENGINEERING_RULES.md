# Fundable AI — Engineering Rules & Quality Standards

> **Document Version**: 1.0  
> **Status**: Immutable Engineering Policy  
> **Applies to**: `Satyendrajnv/fundable-ai` Repository

---

## 1. Core Platform Compliance Rules

### 1.1 Product Contract Lock
- **AI Provider**: Vertex AI / Gemini (Gemini 2.x models) is the required AI platform. No non-GCP AI provider may be substituted.
- **Cloud Infrastructure**: Google Cloud Platform (Cloud Run, Firestore, Cloud Storage, Pub/Sub, Cloud Tasks, Secret Manager) is the required infrastructure.
- **Data Stores**: Firestore is the required structured datastore; Cloud Storage is the required document object store.

### 1.2 Sandbox Constraint Protocol
- **No Silent Substitutions**: Never replace a required GCP service with a third-party non-GCP service.
- **No Fabricated Capabilities**: Never claim a GCP service was deployed or executed if it was not.
- **Constraint Reporting**: If a Code Kitchen sandbox permission or API restriction blocks a GCP service, STOP, document the exact constraint, propose the closest GCP-native alternative, and obtain explicit approval.

---

## 2. Security & Secrets Management

### 2.1 Zero-Credential-Exposure Policy
- **Never Commit Secrets**: Service account keys, API keys, OAuth client secrets, or private keys MUST NEVER be committed to git.
- **Secret Manager Integration**: Use GCP Secret Manager for production environment runtime configuration.
- **Local Development Secrets**: Store local development environment variables in `.env` (which is excluded via `.gitignore`).

### 2.2 Security Best Practices
- **Firebase Auth Validation**: All Cloud Run API endpoints must validate Firebase ID Tokens via authentication middleware.
- **Least Privilege Access**: Service accounts must operate with minimal IAM roles (`roles/datastore.user`, `roles/storage.objectAdmin`, `roles/aiplatform.user`).

---

## 3. Architecture & Code Standards

### 3.1 Monorepo Layout & Boundaries
- All application code must strictly reside in designated monorepo directories:
  - `apps/`: Web applications (React / Vite studio).
  - `services/`: Serverless microservices / Cloud Run API.
  - `packages/`: Shared SDKs, TypeScript types, and Zod schemas.
  - `infrastructure/`: Terraform and GCP configuration files.
  - `prompts/`: Version-controlled Gemini system prompts.
  - `tests/`: Integration, E2E, and benchmark evaluation suites.
  - `docs/`: Technical specifications and ADRs.

### 3.2 Type Safety & Schema Validation
- All API contracts, Firestore documents, and LLM structured outputs MUST use explicit TypeScript interfaces and Zod runtime schemas.
- Free-form JSON payloads without schema validation are prohibited in the core pipeline.

### 3.3 Prompt Engineering Standards
- All prompts sent to Gemini MUST be version-controlled in the `prompts/` directory.
- Never write hardcoded inline prompts inside application route handlers.
- Prompts must instruct Gemini to produce structured JSON matching defined Zod schemas.

---

## 4. Testing & Quality Requirements

### 4.1 Test Coverage Mandate
Every module or service created MUST include corresponding test coverage before declaring completion:
- **Unit Tests**: Test Zod schemas, scoring algorithms, and data transformers.
- **Integration Tests**: Test Firestore repository abstractions and API routes.
- **Benchmark Evaluation**: Run automated evaluations against the `ScoutEdge` benchmark dataset.

### 4.2 Incremental Verification
- Never submit large unverified code drops.
- Each component must be verified locally or in test mode before merging/committing.
