# 3-Minute Code Kitchen Demo Runbook

Follow this runbook to record the 3-minute Code Kitchen selfie video for Fundable AI. Focus on clear pacing, screen alignment, and high-impact messaging.

---

## 🕒 0:00–0:20 — Founder + Problem
* **Visual**: Camera on founder (Satyendra) or split-screen with the landing page of the React Web Studio showing.
* **Talking Points**:
  * "Hi, I'm Satyendra, founder and developer of Fundable AI.
  * Founders struggle to transform fragmented business metrics, raw pitch draft PDFs, and financial spreadsheet data into a cohesive investor narrative.
  * Fundable AI is a cloud-native, serverless platform built on Google Cloud designed to ingest messy files and synthesize structured, evaluated, and evidence-grounded pitch presentations."

---

## 🕒 0:20–0:50 — System Architecture
* **Visual**: Show the Architecture section of the Web Studio (or the Mermaid diagram in the README).
* **Talking Points**:
  * "Our architecture is natively serverless: a containerized React + Express application deployed on **Cloud Run**, storing metadata in **Firestore**, and documents in **Cloud Storage**.
  * We don't just pass text to a generic LLM wrapper. We enforce strict Zod schema contracts at every stage.
  * Every generated output is evaluated by a multi-vector quality gate and refined surgically to guarantee accuracy."

---

## 🕒 0:50–2:10 — Live Hero Demo (ScoutEdge)
* **Visual**: Click through the 6 wizard steps interactively on the live Cloud Run application:
  1. **Step 1 (Ingestion)**: Show the ScoutEdge profile metadata and the indexed documents stored in Cloud Storage. Explain that we are using our own product, ScoutEdge, as the first real-world validation case.
  2. **Step 2 (Extraction)**: Click "Run 10-Vector Extraction". Show the 10 extracted business vector cards (Problem, ICP, Solution, Runway, Ask) returning live from Gemini.
  3. **Step 3 (Synthesis)**: Click "Synthesize 10-Slide Investor Deck". Scroll through the Zod-enforced 10 slides. Point out the title, Category, and slide confidence scores.
  4. **Step 4 (Evaluation)**: Click "Run Automated Evaluation Engine". Show the overall readiness score (e.g. 93/100) and the Completeness, Consistency, and Grounding metrics returning from the AI Quality Gate.
  5. **Step 5 (Regeneration)**: Click "Run Targeted Slide Regeneration". Point out how Slides 6 and 9 are isolated and refined by Gemini based on critique feedback, while the other 8 slides remain 100% unchanged.
  6. **Step 6 (Export)**: Click "Download PDF Document". Open the downloaded PDF showing a real 10-page binary document with titles, bullet points, speaker notes, and evidence references.

---

## 🕒 2:10–2:40 — Core Differentiators
* **Visual**: Hover over the visual pipeline flow diagram at the top of the interface.
* **Talking Points**:
  * "What makes Fundable AI special are three core decisions:
    1. **Strict Structure**: A Zod schema enforces exactly 10 mandatory VC presentation slides.
    2. **AI Quality Gate**: The deck is evaluated on Completeness, Factual Consistency, and Grounding.
    3. **Targeted Regeneration**: We isolate weak sections and rewrite them surgically instead of generating a whole new presentation.
  * The backend is engineered with clean provider abstractions for Vertex AI Gemini models and DocumentStore evidence retrieval."

---

## 🕒 2:40–3:00 — Why Satyendra / Closing
* **Visual**: Camera back to founder.
* **Talking Points**:
  * "As a founder-builder, I understand the friction of startup fundraising first-hand.
  * Fundable AI is a practical, structured tool designed under constraints to solve a real workflow problem.
  * Thank you, Google Cloud team, and I look forward to presenting at the Code Kitchen finals!"
