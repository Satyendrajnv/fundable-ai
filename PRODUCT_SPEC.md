# Fundable AI — Product Specification

> **Document Version**: 1.0  
> **Product Name**: Fundable AI  
> **Tagline**: Cloud-Native AI Pitch Intelligence Platform on Google Cloud

---

## 1. Product Vision & Value Proposition

### 1.1 Overview
Fundable AI is an AI-powered pitch intelligence and presentation synthesis platform designed to transform fragmented, raw startup information (founder notes, draft decks, financial tables, audio transcripts) into investment-ready, evidence-grounded 10-slide pitch decks and evaluation reports.

Unlike simple text-to-slide generators, Fundable AI acts as an institutional VC analyst:
1. **Extracts & Grounding**: Parses startup data across 10 core business vectors and grounds every claim to source documentation.
2. **Multi-Stage Synthesis**: Sequentially crafts an investor narrative grounded in reference deck benchmarks.
3. **Automated Evaluation**: Evaluates completeness, factual consistency, evidence grounding, and investor readiness.
4. **Targeted Regeneration**: Automatically identifies low-confidence sections and regenerates only those slides before final assembly.

---

## 2. The 10 VC Pitch Intelligence Vectors

Fundable AI evaluates and structures startup intelligence across 10 critical investment dimensions:

| Vector | Description |
| :--- | :--- |
| **1. Problem** | Core market pain point, validation, and quantifiable inefficiency. |
| **2. Ideal Customer Profile (ICP)** | Target buyer persona, market segment, and buyer demographics. |
| **3. Value Proposition** | Unique value claim, primary customer ROI, and key differentiator. |
| **4. Solution** | Product overview, core technology, and technical defensibility. |
| **5. Business Model** | Monetization mechanics, pricing tiers, unit economics, and margins. |
| **6. Go-To-Market (GTM)** | Customer acquisition strategy, distribution channels, and sales cycles. |
| **7. Traction** | Key performance indicators (ARR, MoM growth, pilot logos, active users). |
| **8. Competition** | Competitive matrix, moat, and market positioning relative to alternatives. |
| **9. Financials & Projections** | Current burn rate, runway, revenue projections, and financial health. |
| **10. Team & Ask** | Founder background, key hires, fundraising target, and use of funds allocation. |

---

## 3. The 10-Slide Investor Deck Structure

Fundable AI synthesizes decks adhering strictly to a 10-slide VC presentation structure:

1. **Slide 1: Title & Vision** — Company name, high-concept pitch line, founder info.
2. **Slide 2: The Problem** — Quantifiable customer pain point and market validation.
3. **Slide 3: Market Opportunity & ICP** — TAM / SAM / SOM breakdown and customer profile.
4. **Slide 4: The Solution** — Product demo summary, core innovation, and key capabilities.
5. **Slide 5: Business Model & Unit Economics** — Revenue streams, pricing, and gross margin profile.
6. **Slide 6: Traction & Milestones** — Historical metrics, growth velocity, and proof points.
7. **Slide 7: Go-To-Market Strategy** — CAC, LTV, channel strategy, and growth engine.
8. **Slide 8: Competitive Advantage & Moat** — Feature matrix, defensibility, and market position.
9. **Slide 9: Financial Projections & Health** — 3-year revenue forecast, burn rate, and runway.
10. **Slide 10: The Ask & Use of Funds** — Investment amount, round terms, and milestones targeted.

---

## 4. Evaluation Framework

Every generated pitch deck undergoes automated 4-vector quality evaluation:

- **Completeness Score (0-100%)**: Verifies all 10 required slide categories and essential data fields are present.
- **Factual Consistency Score (0-100%)**: Checks that numbers, metrics, and claims on slides match extracted startup intelligence.
- **Evidence Grounding Score (0-100%)**: Measures the percentage of slide claims linked directly to source documents.
- **Investor Readiness Score (0-100)**: Evaluates narrative clarity, value proposition strength, and VC standards compliance.

Decks scoring `< 80` in any vector trigger **Stage 7 Targeted Regeneration** before final export.

---

## 5. Demonstration Case Study — ScoutEdge

The primary benchmark and demo dataset for Fundable AI is **ScoutEdge**:
- **Startup Name**: ScoutEdge
- **Industry**: Autonomous AI Deal Scouting & Pitch Parsing for VC Firms
- **Stage**: Pre-Seed ($1.5M raise target)
- **Traction**: $12k ARR, 4 pilot accelerators, 150 parsed decks
- **Ingestion Files**: `ScoutEdge_Deck_Draft.pdf`, `ScoutEdge_Financials.xlsx`
