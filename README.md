# Fundable AI

### From raw venture evidence to investment-grade narrative.
**An evidence-first AI Pitch Intelligence Platform engineered on Google Cloud.**

Fundable AI transforms fragmented startup information — decks, documents, founder notes, traction, financials, and venture context — into structured intelligence and then into a coherent, investor-ready pitch. But Fundable AI doesn't start by writing slides. **It starts by understanding the venture.**

---

<p align="center">
  **EVIDENCE → INTELLIGENCE → QUESTIONS → REFINEMENT → SYNTHESIS → EVALUATION**
</p>

---

## The Idea
Most AI pitch builders follow a familiar pattern:
```text
Prompt → LLM → Slides
```
Fundable AI takes a different approach.

```text
┌─────────────────────────────────────┐
│          VENTURE EVIDENCE           │
│    Decks · Docs · Data · Notes      │
└──────────────────┬──────────────────┘
                   ↓
┌─────────────────────────────────────┐
│         INTELLIGENCE LAYER          │
│         10 Venture Vectors          │
└──────────────────┬──────────────────┘
                   ↓
┌─────────────────────────────────────┐
│            GAP DISCOVERY            │
│         What don't we know?         │
└──────────────────┬──────────────────┘
                   ↓
┌─────────────────────────────────────┐
│             FOUNDER Q&A             │
│       Targeted clarification        │
└──────────────────┬──────────────────┘
                   ↓
┌─────────────────────────────────────┐
│        REFINED INTELLIGENCE         │
└──────────────────┬──────────────────┘
                   ↓
┌─────────────────────────────────────┐
│           PITCH SYNTHESIS           │
│              10 slides              │
└──────────────────┬──────────────────┘
                   ↓
┌─────────────────────────────────────┐
│            QUALITY GATE             │
│    Completeness · Consistency       │
│       Grounding · Readiness         │
└──────────────────┬──────────────────┘
                   ↓
┌─────────────────────────────────────┐
│        SURGICAL REGENERATION        │
└──────────────────┬──────────────────┘
                   ↓
┌─────────────────────────────────────┐
│         INVESTOR NARRATIVE          │
└─────────────────────────────────────┘
```

Generation isn't the finish line. It is an intermediate state that has to earn its way through the quality gate.

### Why Fundable AI?
A pitch deck can look impressive and still be wrong. The fundamental problem isn't always writing. It is understanding. Fundable AI treats a startup as a structured intelligence problem before treating it as a presentation problem.

The system progressively moves from:
**Evidence → Understanding → Missing Information → Refinement → Narrative → Evaluation**

This creates a more disciplined generation loop:
```text
Source Evidence ↓ Structured Intelligence ↓ Generated Narrative ↓ Evaluation ↓ Targeted Improvement
```
The objective is not simply to produce more content. The objective is to produce better-supported content.

---

## The 10-Vector Venture Model
Fundable AI converts unstructured venture information into a structured intelligence representation:

| Vector | Intelligence Question |
|---|---|
| **Problem** | What fundamental problem exists? |
| **ICP** | Who experiences it? |
| **Value Proposition** | Why does the solution matter? |
| **Product** | What is actually being built? |
| **Business Model** | How does the venture create revenue? |
| **GTM** | How does it reach customers? |
| **Traction** | What evidence of demand exists? |
| **Competition** | What alternatives already exist? |
| **Financials** | What are the economics? |
| **Fundraising** | What capital is being raised and why? |

This model becomes the foundation for every downstream operation.

---

## The Intelligence Loop

### 01 — Ingest
Bring the venture's evidence into the system. 
* **Supported inputs**: PDF, TXT, Markdown, and Direct founder-provided text.
* Input is validated before it enters the intelligence pipeline.

### 02 — Understand
Gemini transforms raw venture evidence into structured intelligence. The objective isn't to generate impressive prose. It is to answer: *What does the evidence actually tell us?*

### 03 — Discover the Gaps
Incomplete or ambiguous areas are surfaced before the pitch is generated. Instead of forcing the model to guess, Fundable AI asks targeted questions. *If the system doesn't know, it should ask.*

### 04 — Refine
Founder answers are merged back into the structured intelligence layer. The venture model becomes progressively more complete. This creates a feedback loop between:
```text
Machine Understanding ↕ Founder Knowledge
```

### 05 — Synthesize
The refined intelligence is transformed into a strict 10-slide pitch contract. The deck is generated from the structured venture model rather than from an unconstrained prompt.

### 06 — Evaluate
Every generated pitch passes through a four-dimensional quality gate:
* **Completeness**: Is the required venture information present?
* **Consistency**: Does the narrative remain internally coherent?
* **Grounding**: Are claims supported by the available evidence?
* **Investor Readiness**: Does the resulting narrative meet the expected standard for an investor-facing pitch?

The system doesn't simply ask: *"Does this sound good?"* It asks: *"Is this sufficiently supported, coherent, complete, and ready to present?"*

### 07 — Regenerate
When a slide underperforms, Fundable AI performs targeted regeneration.
```text
Weak Slide ↓ Identify Defect ↓ Regenerate Target ↓ Preserve Remaining Deck
```
The objective is surgical rather than destructive. Why regenerate an entire deck when one component needs improvement?

---

## Architecture
Fundable AI is designed as a cloud-native, serverless Google Cloud application.

```text
┌──────────────────────────────────────────────┐
│                  WEB STUDIO                  │
│              React / TypeScript              │
└───────────────────────┬──────────────────────┘
                        │
                        ▼
┌──────────────────────────────────────────────┐
│                  API LAYER                   │
│              Node.js / Express               │
└───────────────┬────────────────┬─────────────┘
                │                │
                ▼                ▼
        ┌────────────────┐ ┌────────────────┐
        │   Firestore    │ │ Cloud Storage  │
        │  Structured    │ │   Venture      │
        │  Application   │ │  Evidence &    │
        │    State       │ │  Artifacts     │
        └────────────────┘ └───────┬────────┘
                                   │
                                   ▼
                          ┌──────────────────┐
                          │   AI PIPELINE    │
                          │ Gemini / Vertex  │
                          └────────┬─────────┘
                                   │
         ┌─────────────────────────┼─────────────────────────┐
         ▼                         ▼                         ▼
    Extraction               Gap Discovery               Synthesis
         │                         │                         │
         └─────────────────────────┼─────────────────────────┘
                                   ▼
                             ┌─────────────┐
                             │Quality Gate │
                             └──────┬──────┘
                                    ▼
                          Targeted Regeneration
                                    │
                                    ▼
                              Pitch Artifact
```

### Google Cloud Architecture
The intended cloud architecture uses:
* **Cloud Run** — serverless application and API execution
* **Firestore** — structured application state
* **Cloud Storage** — venture evidence and generated artifacts
* **Vertex AI / Gemini** — intelligence, reasoning, and generation
* **Pub/Sub / Cloud Tasks** — asynchronous orchestration
* **Cloud Monitoring** — operational visibility
* **Cloud Logging** — application and infrastructure logs
* **Error Reporting** — failure visibility

### Architecture Principle
The system separates:
```text
Evidence ↓ Intelligence ↓ Generation ↓ Evaluation
```
rather than collapsing everything into a single LLM request.

---

## Evidence-First by Design
Fundable AI treats grounding as a first-class system property. The pipeline is intentionally designed around the relationship:
```text
SOURCE ↓ UNDERSTANDING ↓ NARRATIVE ↓ EVALUATION
```

During validation, the system was tested for:
* unsupported claims
* cross-session contamination
* venture context leakage
* fabricated fallback content
* irrelevant template information

The goal is straightforward: **A venture should be represented by its evidence — not by whatever the model happens to assume.**

---

## End-to-End Venture Journey
The system has been validated using AgroPulse, an independent venture scenario:
```text
Raw Venture Evidence ↓ Evidence Ingestion ↓ Startup Profile ↓ 10-Vector Extraction ↓ Missing Information Discovery ↓ Founder Q&A ↓ Intelligence Refinement ↓ 10-Slide Synthesis ↓ 4-Dimensional Evaluation ↓ Targeted Slide Regeneration ↓ 10-Page PDF
```

### Evaluation Snapshot
* **Completeness**: 100%
* **Consistency**: 95%
* **Grounding**: 88%
* **Readiness**: 87%

*These values represent demo evaluation output from the validation journey. They are not presented as universal quality guarantees.*

### Grounding & Isolation Verification
The AgroPulse journey was specifically used to verify that venture context remains isolated:
* **AgroPulse Understanding**: `PASS`
* **ScoutEdge Contamination**: `PASS`
* **Cross-Session Leakage**: `PASS`
* **Unsupported Claims**: `PASS`
* **Fabricated Fallback**: `PASS`

The system correctly identified AgroPulse's water-management problem and sensor-driven solution without importing unrelated ScoutEdge context. This matters because a multi-venture intelligence system must preserve context boundaries.

---

## Engineering Principles

1. **Evidence over assumptions**: If the system doesn't know, it should ask.
2. **Structure before generation**: Reason over structured venture intelligence before producing narrative.
3. **Evaluation before delivery**: A generated artifact is not automatically a finished artifact.
4. **Surgical over destructive**: Improve the weak component without unnecessarily rebuilding everything else.
5. **Isolation by design**: One venture's context should never silently become another venture's context.
6. **Visible failure over silent failure**: Network and ingestion failures should surface clearly rather than trapping users behind indefinite loading states.
7. **Reproducibility over theatrics**: A system should be explainable, testable, and reproducible — not merely impressive in a demo.

---

## Current Capability Matrix

| Capability | Status |
|---|---|
| React Web Studio | ✅ |
| Venture text ingestion | ✅ |
| PDF ingestion | ✅ |
| TXT / Markdown ingestion | ✅ |
| Structured venture intelligence | ✅ |
| 10-vector extraction | ✅ |
| Founder Q&A | ✅ |
| Intelligence refinement | ✅ |
| 10-slide pitch contract | ✅ |
| Four-dimensional evaluation | ✅ |
| Targeted regeneration | ✅ |
| PDF generation | ✅ |
| Multi-session isolation | ✅ |
| Local E2E workflow | ✅ |
| Automated integration tests | ✅ |
| Cloud-native architecture | ✅ |
| Competition Cloud Run deployment | ⏸️ Sandbox expired |

---

## Validation
Latest repository validation:
* **Build**: `PASS`
* **Integration Tests**: `24 / 24`
* **Browser / E2E**: `PASS`
* **PDF Generation**: `PASS`
* **Grounding Tests**: `PASS`
* **Isolation Tests**: `PASS`
* **Secret Audit**: `PASS`
* **Git Status**: `CLEAN`

### Repository State
* **Branch**: `main`
* **Commit**: `7ef6a5c`
* **Remote**: `origin/main`
* **Status**: `Clean`

*No credentials or API keys are committed to the repository.*

---

## Repository Structure
```text
fundable-ai/
├── apps/
│   └── web/            # React / TypeScript Web Studio
├── services/
│   └── api/            # API + intelligence pipeline
├── packages/
│   └── core-types/     # Shared TS schemas and contracts
├── ARCHITECTURE.md     # System architecture
├── DEMO_RUNBOOK.md     # End-to-End demo flow runbook
├── walkthrough.md      # Build / verification walkthrough
├── README.md           # Product & setup overview
└── package.json        # Workspace configuration
```

---

## Run Locally

### Requirements
* Node.js
* npm
* Git

### Install
```bash
npm install
```

### Development
```bash
npm run dev
```

### Production Build
```bash
npm run build
```

### Test
```bash
npm test
```

*Environment configuration is handled separately. No credentials are committed to the repository.*

---

## Cloud Run Status
The competition sandbox was used for the intended Google Cloud deployment environment. The official sandbox credentials expired before final deployment verification could be completed. The application therefore makes a deliberate distinction between:
**Implemented & Locally Verified** vs. **Competition Infrastructure Not Re-verified after Sandbox Expiration**

The codebase and deployment architecture remain structured for Google Cloud execution. No personal cloud deployment was substituted for the official competition environment.

---

## What's Next
The current build establishes the core Pitch Intelligence Loop. The longer-term direction is broader:
```text
Pitch Intelligence ↓ Investor Readiness ↓ Fundraising Intelligence ↓ Accelerator Infrastructure ↓ Founder Decision Intelligence
```

Potential future extensions include:
* richer retrieval infrastructure
* reference-deck intelligence
* investor-specific narrative optimization
* collaborative pitch editing
* Google Slides export
* accelerator / CRM integrations
* longitudinal founder intelligence
* portfolio-level analytics

*These are future extensions, not claims about the current competition build.*

---

## Built for Code Kitchen S01
Fundable AI was created for Code Kitchen Season 01. The challenge was simple: *Turn a concept into a functioning system.*

The approach was equally simple: *Build the intelligence layer first. Then let the pitch emerge from it.*

### The Thesis
> A better pitch shouldn't begin with better words. It should begin with better understanding.

Fundable AI is an experiment in turning that understanding into software.

---

## About

### Satyendra Kumar
*Founder · Builder · Data Scientist · Cricketer*

Building systems at the intersection of: **Artificial Intelligence · Data · Sport · Decision Intelligence**

Founder & CEO of [ScoutEdge](https://scoutedge.in/), building Sports Intelligence Infrastructure for athlete discovery, evaluation, development, and recruitment.

### Connect
* **GitHub**: [@Satyendrajnv](https://github.com/Satyendrajnv)
* **LinkedIn**: [Satyendra Kumar](https://www.linkedin.com/in/satyendra-scoutedge/)

---
**Fundable AI** — *Evidence → Intelligence → Decisions*
