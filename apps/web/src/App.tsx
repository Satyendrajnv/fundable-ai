import { useState } from 'react';

type Step = 'PROFILE' | 'EXTRACTION' | 'GENERATION' | 'EVALUATION' | 'REGENERATION' | 'EXPORT';

export function App() {
  const [activeStep, setActiveStep] = useState<Step>('PROFILE');

  // Pre-populated ScoutEdge demo states for Phase 2 shell
  const scoutedgeData = {
    name: 'ScoutEdge',
    tagline: 'Autonomous AI Pitch Intelligence & VC Scouting Platform',
    stage: 'Pre-Seed',
    targetRaise: '$1,500,000',
    documents: ['ScoutEdge_Pitch_Deck_Draft.pdf', 'ScoutEdge_Financials.xlsx']
  };

  const extractedEntities = [
    { label: 'Problem', val: 'VC analysts spend 40+ hours per memo reviewing ungrounded pitch decks.', evidence: 'ScoutEdge_Deck_Draft.pdf#p2' },
    { label: 'ICP', val: 'Early-stage VC firms ($10M-$150M AUM) & Seed Accelerators.', evidence: 'ScoutEdge_Deck_Draft.pdf#p3' },
    { label: 'Value Prop', val: 'Automated 10-vector pitch parsing and evidence-grounded investment memo synthesis.', evidence: 'ScoutEdge_Deck_Draft.pdf#p1' },
    { label: 'Solution', val: 'Serverless AI platform leveraging Vertex AI Gemini 2.x and Cloud Run.', evidence: 'ScoutEdge_Deck_Draft.pdf#p4' },
    { label: 'Business Model', val: '$499/mo per analyst seat + $5,000/mo accelerator tier (Gross Margin > 85%).', evidence: 'ScoutEdge_Deck_Draft.pdf#p5' },
    { label: 'GTM Strategy', val: 'Direct outbound sales to accelerator cohorts & VC network referral flywheel.', evidence: 'ScoutEdge_Deck_Draft.pdf#p7' },
    { label: 'Traction', val: '$12k ARR, 4 pilot accelerators, 150 parsed decks in initial beta cohort.', evidence: 'ScoutEdge_Financials.xlsx#KPIs' },
    { label: 'Competition', val: 'Generic AI tools (Tome, Gamma) lack factual grounding and VC scoring.', evidence: 'ScoutEdge_Deck_Draft.pdf#p8' },
    { label: 'Financials', val: 'Burn: $15k/mo | Runway: 10 mos | 12-mo ARR Target: $250k.', evidence: 'ScoutEdge_Financials.xlsx#Summary' },
    { label: 'Fundraising', val: 'Ask: $1.5M Pre-Seed | Use of Funds: 60% R&D, 25% GTM, 15% Ops.', evidence: 'ScoutEdge_Deck_Draft.pdf#p10' }
  ];

  const evalScores = {
    overall: 89,
    completeness: 100,
    factualConsistency: 92,
    evidenceGrounding: 88,
    investorReadiness: 86
  };

  return (
    <div className="app-container">
      {/* Header / Navbar */}
      <header className="navbar">
        <div className="brand">
          <span>⚡ FUNDABLE AI</span>
          <span className="brand-badge">Google Cloud</span>
        </div>
        <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
          Active Startup: <strong style={{ color: 'var(--text-main)' }}>{scoutedgeData.name}</strong> ({scoutedgeData.stage})
        </div>
      </header>

      {/* Golden Path Step Navigation */}
      <nav className="golden-path-nav">
        <button
          className={`step-btn ${activeStep === 'PROFILE' ? 'active' : ''}`}
          onClick={() => setActiveStep('PROFILE')}
        >
          1. Profile &amp; Evidence
        </button>
        <button
          className={`step-btn ${activeStep === 'EXTRACTION' ? 'active' : ''}`}
          onClick={() => setActiveStep('EXTRACTION')}
        >
          2. 10-Vector Intelligence
        </button>
        <button
          className={`step-btn ${activeStep === 'GENERATION' ? 'active' : ''}`}
          onClick={() => setActiveStep('GENERATION')}
        >
          3. Multi-Stage 10-Slide Deck
        </button>
        <button
          className={`step-btn ${activeStep === 'EVALUATION' ? 'active' : ''}`}
          onClick={() => setActiveStep('EVALUATION')}
        >
          4. 4-Vector Evaluation
        </button>
        <button
          className={`step-btn ${activeStep === 'REGENERATION' ? 'active' : ''}`}
          onClick={() => setActiveStep('REGENERATION')}
        >
          5. Targeted Regeneration
        </button>
        <button
          className={`step-btn ${activeStep === 'EXPORT' ? 'active' : ''}`}
          onClick={() => setActiveStep('EXPORT')}
        >
          6. Export Presentation
        </button>
      </nav>

      {/* Step 1: Startup Profile & Document Ingestion */}
      {activeStep === 'PROFILE' && (
        <main className="card">
          <div className="card-title">
            <span>Startup Profile &amp; Supporting Evidence</span>
            <span className="tag tag-primary">Step 1 — Ingestion</span>
          </div>
          <div className="grid-2">
            <div>
              <h3>Company Metadata</h3>
              <p style={{ marginTop: '8px', color: 'var(--text-muted)' }}>Name: {scoutedgeData.name}</p>
              <p style={{ color: 'var(--text-muted)' }}>Tagline: {scoutedgeData.tagline}</p>
              <p style={{ color: 'var(--text-muted)' }}>Stage: {scoutedgeData.stage}</p>
              <p style={{ color: 'var(--text-muted)' }}>Target Raise: {scoutedgeData.targetRaise}</p>
            </div>
            <div>
              <h3>Ingested Documents (Cloud Storage)</h3>
              <ul style={{ marginTop: '8px', listStyle: 'none' }}>
                {scoutedgeData.documents.map((doc, idx) => (
                  <li key={idx} style={{ padding: '8px', background: 'rgba(255,255,255,0.05)', borderRadius: '6px', marginBottom: '6px' }}>
                    📄 {doc} <span className="tag tag-success" style={{ float: 'right' }}>Indexed</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div style={{ marginTop: '24px', textAlign: 'right' }}>
            <button className="btn-primary" onClick={() => setActiveStep('EXTRACTION')}>
              Proceed to Intelligence Extraction &rarr;
            </button>
          </div>
        </main>
      )}

      {/* Step 2: 10-Vector Entity Intelligence */}
      {activeStep === 'EXTRACTION' && (
        <main className="card">
          <div className="card-title">
            <span>Gemini 2.x Extracted Startup Intelligence (10 Vectors)</span>
            <span className="tag tag-success">Stage 2 &amp; 3 Complete</span>
          </div>
          <div className="grid-2">
            {extractedEntities.map((item, idx) => (
              <div key={idx} className="slide-card">
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                  <strong>{idx + 1}. {item.label}</strong>
                  <span className="tag tag-primary">Evidence: {item.evidence}</span>
                </div>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>{item.val}</p>
              </div>
            ))}
          </div>
          <div style={{ marginTop: '24px', textAlign: 'right' }}>
            <button className="btn-primary" onClick={() => setActiveStep('GENERATION')}>
              Synthesize 10-Slide Investor Deck &rarr;
            </button>
          </div>
        </main>
      )}

      {/* Step 3: Multi-Stage 10-Slide Deck */}
      {activeStep === 'GENERATION' && (
        <main className="card">
          <div className="card-title">
            <span>Synthesized 10-Slide Investor Presentation</span>
            <span className="tag tag-success">Enforces Exactly 10 Slides</span>
          </div>
          <p style={{ color: 'var(--text-muted)', marginBottom: '16px' }}>
            Multi-stage reasoning sequentially generated 10 grounded investor slides with speaker notes.
          </p>
          <div className="grid-3">
            {[
              'Title & Vision', 'The Problem', 'Market Opportunity & ICP', 'The Solution',
              'Business Model', 'Traction & Milestones', 'Go-To-Market Strategy',
              'Competitive Moat', 'Financial Projections', 'The Ask & Team'
            ].map((slideTitle, idx) => (
              <div key={idx} className="slide-card">
                <div style={{ fontSize: '0.8rem', color: 'var(--primary)' }}>SLIDE {idx + 1} OF 10</div>
                <h4 style={{ margin: '4px 0' }}>{slideTitle}</h4>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Confidence: 92% | Grounded in evidence</p>
              </div>
            ))}
          </div>
          <div style={{ marginTop: '24px', textAlign: 'right' }}>
            <button className="btn-primary" onClick={() => setActiveStep('EVALUATION')}>
              Run Automated Evaluation Engine &rarr;
            </button>
          </div>
        </main>
      )}

      {/* Step 4: 4-Vector Evaluation Engine */}
      {activeStep === 'EVALUATION' && (
        <main className="card">
          <div className="card-title">
            <span>Automated 4-Vector Quality Evaluation Report</span>
            <span className="tag tag-success">Overall Readiness: {evalScores.overall}/100</span>
          </div>
          <div className="grid-2">
            <div className="slide-card">
              <h4>Completeness Vector</h4>
              <p className="tag tag-success" style={{ marginTop: '8px' }}>Score: {evalScores.completeness}%</p>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '6px' }}>
                All 10 mandatory VC pitch categories are present and fully populated.
              </p>
            </div>
            <div className="slide-card">
              <h4>Factual Consistency Vector</h4>
              <p className="tag tag-success" style={{ marginTop: '8px' }}>Score: {evalScores.factualConsistency}%</p>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '6px' }}>
                Metrics on slides match extracted financial spreadsheet data ($12k ARR, $15k burn).
              </p>
            </div>
            <div className="slide-card">
              <h4>Evidence Grounding Vector</h4>
              <p className="tag tag-primary" style={{ marginTop: '8px' }}>Score: {evalScores.evidenceGrounding}%</p>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '6px' }}>
                88% of claims linked directly to uploaded documents.
              </p>
            </div>
            <div className="slide-card">
              <h4>Investor Readiness Vector</h4>
              <p className="tag tag-primary" style={{ marginTop: '8px' }}>Score: {evalScores.investorReadiness}%</p>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '6px' }}>
                Narrative meets institutional early-stage VC review standards.
              </p>
            </div>
          </div>
          <div style={{ marginTop: '24px', textAlign: 'right' }}>
            <button className="btn-primary" onClick={() => setActiveStep('REGENERATION')}>
              Test Targeted Slide Regeneration &rarr;
            </button>
          </div>
        </main>
      )}

      {/* Step 5: Targeted Slide Regeneration */}
      {activeStep === 'REGENERATION' && (
        <main className="card">
          <div className="card-title">
            <span>Stage 7 — Targeted Slide Regeneration Path</span>
            <span className="tag tag-warning">Isolated Slide Refinement</span>
          </div>
          <p style={{ color: 'var(--text-muted)', marginBottom: '16px' }}>
            Instead of re-generating the whole deck, Fundable AI isolates weak slides (`&lt; 80` confidence) and re-evaluates only targeted sections.
          </p>
          <div className="slide-card" style={{ borderColor: 'var(--warning)' }}>
            <h4>Targeted Refinement: Slide 6 (Traction) &amp; Slide 9 (Financials)</h4>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '6px' }}>
              Original Evidence Grounding: 76% &rarr; <strong style={{ color: 'var(--success)' }}>Refined Grounding: 94%</strong>
            </p>
          </div>
          <div style={{ marginTop: '24px', textAlign: 'right' }}>
            <button className="btn-primary" onClick={() => setActiveStep('EXPORT')}>
              View Final Presentation &amp; Export &rarr;
            </button>
          </div>
        </main>
      )}

      {/* Step 6: Export Presentation */}
      {activeStep === 'EXPORT' && (
        <main className="card">
          <div className="card-title">
            <span>Stage 9 — Export Final Presentation</span>
            <span className="tag tag-success">Google Cloud Serverless Export</span>
          </div>
          <p style={{ color: 'var(--text-muted)', marginBottom: '16px' }}>
            Export your evidence-grounded 10-slide presentation directly to Google Slides or high-res PDF.
          </p>
          <div className="grid-2">
            <div className="slide-card" style={{ textAlign: 'center', padding: '32px' }}>
              <h3>Google Slides Export</h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: '12px 0' }}>
                Generates a live editable presentation deck via Google Workspace API.
              </p>
              <button className="btn-primary" onClick={() => alert('Exporting to Google Slides API...')}>
                Export to Google Slides 📊
              </button>
            </div>
            <div className="slide-card" style={{ textAlign: 'center', padding: '32px' }}>
              <h3>Download PDF Presentation</h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: '12px 0' }}>
                Serverless HTML-to-PDF compilation saved to Cloud Storage.
              </p>
              <button className="btn-primary" onClick={() => alert('Downloading PDF from Cloud Storage...')}>
                Download PDF Document 📄
              </button>
            </div>
          </div>
        </main>
      )}
    </div>
  );
}
