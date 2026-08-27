# 3-Minute Code Kitchen Demo Runbook

Follow this runbook to record the 3-minute Code Kitchen selfie video for Fundable AI. Focus on clear pacing, screen alignment, and high-impact messaging.

---

## 🕒 0:00–0:20 — Founder + Problem
* **Visual**: Camera on founder (Satyendra) or split-screen with the landing page of the React Web Studio showing.
* **Talking Points**:
  * "Hi, I'm Satyendra, founder and developer of Fundable AI.
  * Founders struggle to transform fragmented business metrics, raw pitch draft PDFs, and financial spreadsheet data into a cohesive investor narrative.
  * Fundable AI is a cloud-native, serverless platform built on Google Cloud designed to ingest messy files and synthesize structured, evaluated, and evidence-grounded pitch presentations. Our core narrative is: *Don't give Fundable AI a form. Give it your existing pitch.*"

---

## 🕒 0:20–0:50 — System Architecture
* **Visual**: Show the Architecture section of the Web Studio (or the Mermaid diagram in the README).
* **Talking Points**:
  * "Our architecture is natively serverless: a containerized React + Express application deployed on **Cloud Run**, storing metadata in **Firestore**, and documents in **Cloud Storage**.
  * We don't just pass text to a generic LLM wrapper. We enforce strict Zod schema contracts at every stage.
  * Every generated output is evaluated by a multi-vector quality gate and refined surgically to guarantee accuracy."

---

## 🕒 0:50–2:20 — Live Hero Demo (Venture Ingestion to Pitch Generation)
* **Visual**: Click through the 7 wizard steps interactively on the live application:
  1. **Step 1 (Ingestion)**: Show the landing page with the two main entry points: **Option A (Upload Venture Deck)** and **Option B (Paste Venture Text)**. Paste the AgroPulse description into Option B: *"AgroPulse is building sensor-driven irrigation recommendations for small farms. We currently serve 127 paying farms and are raising ₹3 crore."* Explain that this creates a clean sandbox session and stores the text as a document.
  2. **Step 2 (Venture Intelligence)**: Click *"Understand My Venture"*. Show the 10 extracted business vector cards (Problem, ICP, Solution, Runway, Ask) returning from Gemini. Explain that the AI has mapped these to the ingested AgroPulse text.
  3. **Step 3 (Founder Q&A)**: Click *"Founder Q&A"*. Show the Q&A wizard asking targeted interview questions to fill knowledge gaps. Answer a question (e.g. business model) and show how the answer updates the venture intelligence context.
  4. **Step 4 (Grounded Synthesis)**: Click *"Synthesize 10-Slide Investor Deck"*. Scroll through the Zod-enforced 10 slides. Point out the title, category, and slide confidence scores.
  5. **Step 5 (Quality Gate)**: Click *"Run Automated Evaluation Engine"*. Show the overall readiness score and the Completeness, Consistency, Grounding, and Readiness metrics returning from the AI Quality Gate.
  6. **Step 6 (Targeted Regen)**: Click *"Run Targeted Slide Regeneration"*. Point out how Slides 6 and 9 are isolated and refined by Gemini based on critique feedback, while the other 8 slides remain 100% unchanged.
  7. **Step 7 (Export)**: Click *"Download PDF Document"*. Open the downloaded PDF showing a real 10-page binary document with titles, bullet points, speaker notes, and evidence references.

---

## 🕒 2:20–2:40 — Core Differentiators
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
