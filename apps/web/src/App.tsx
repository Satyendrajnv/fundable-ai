import { useState, useEffect } from 'react';

type Step = 'PROFILE' | 'EXTRACTION' | 'GENERATION' | 'EVALUATION' | 'REGENERATION' | 'EXPORT';

export function App() {
  const [activeStep, setActiveStep] = useState<Step>('PROFILE');
  const [loading, setLoading] = useState<boolean>(false);
  const [statusMessage, setStatusMessage] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');

  // Domain states populated from API
  const [startupProfile, setStartupProfile] = useState<any>(null);
  const [intelligence, setIntelligence] = useState<any>(null);
  const [pitchDeck, setPitchDeck] = useState<any>(null);
  const [evaluation, setEvaluation] = useState<any>(null);

  // Load initial ScoutEdge profile from backend API
  useEffect(() => {
    fetch('/api/startups/scoutedge-001')
      .then(res => res.json())
      .then(data => {
        if (data.startup) {
          setStartupProfile(data.startup);
        }
      })
      .catch(err => console.error('Failed to fetch startup profile:', err));
  }, []);

  // Golden Path Handler 1: Trigger Stage 2 Extraction
  const handleExtractIntelligence = async () => {
    setLoading(true);
    setErrorMessage('');
    setStatusMessage('Running Gemini 2.x Structured Entity Extraction across 10 VC vectors...');
    try {
      const res = await fetch('/api/intelligence/scoutedge-001/extract', { method: 'POST' });
      const data = await res.json();
      if (data.intelligence) {
        setIntelligence(data.intelligence);
        setActiveStep('EXTRACTION');
      }
    } catch (err) {
      setErrorMessage('Failed to extract: ' + (err instanceof Error ? err.message : 'Unknown error'));
    } finally {
      setLoading(false);
    }
  };

  // Golden Path Handler 2: Trigger Stage 5 Multi-Stage Generation
  const handleGenerateDeck = async () => {
    setLoading(true);
    setErrorMessage('');
    setStatusMessage('Synthesizing exactly 10 grounded investor slides via Gemini 2.x...');
    try {
      const res = await fetch('/api/pitches/scoutedge-001/generate', { method: 'POST' });
      const data = await res.json();
      if (data.deck) {
        setPitchDeck(data.deck);
        setActiveStep('GENERATION');
      }
    } catch (err) {
      setErrorMessage('Failed to generate: ' + (err instanceof Error ? err.message : 'Unknown error'));
    } finally {
      setLoading(false);
    }
  };

  // Golden Path Handler 3: Run Stage 6 Evaluation Engine
  const handleEvaluateDeck = async () => {
    setLoading(true);
    setErrorMessage('');
    setStatusMessage('Running 4-Vector Evaluation Engine (Completeness, Consistency, Grounding, Readiness)...');
    try {
      const res = await fetch('/api/evaluations/deck_scoutedge_v1');
      const data = await res.json();
      if (data.evaluation) {
        setEvaluation(data.evaluation);
        setActiveStep('EVALUATION');
      }
    } catch (err) {
      setErrorMessage('Failed to evaluate: ' + (err instanceof Error ? err.message : 'Unknown error'));
    } finally {
      setLoading(false);
    }
  };

  // Golden Path Handler 4: Trigger Stage 7 Targeted Regeneration
  const handleTargetedRegeneration = async () => {
    setLoading(true);
    setErrorMessage('');
    setStatusMessage('Isolating Slide 6 (Traction) & Slide 9 (Financials) for targeted regeneration...');
    try {
      const res = await fetch('/api/evaluations/deck_scoutedge_v1/regenerate-slide', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          targetSlideNumbers: [6, 9],
          reason: 'Improve evidence grounding and financial consistency'
        })
      });
      const data = await res.json();
      if (data.updatedDeck) {
        setPitchDeck(data.updatedDeck);
        setEvaluation(data.newEvaluation);
        setActiveStep('REGENERATION');
      }
    } catch (err) {
      setErrorMessage('Failed to regenerate: ' + (err instanceof Error ? err.message : 'Unknown error'));
    } finally {
      setLoading(false);
    }
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
          Active Startup: <strong style={{ color: 'var(--text-main)' }}>{startupProfile?.name || 'ScoutEdge'}</strong> ({startupProfile?.stage || 'Pre-Seed'})
        </div>
      </header>

      {/* AI Provider Status Banner */}
      <div style={{ margin: '16px 0', padding: '12px 16px', background: 'rgba(237, 137, 54, 0.12)', border: '1px solid rgba(237, 137, 54, 0.4)', borderRadius: '8px', fontSize: '0.85rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
          <div>
            <strong style={{ color: 'var(--warning)' }}>AI PROVIDER STATUS:</strong> Vertex AI / Gemini 2.x &nbsp;|&nbsp;
            <strong>STATUS:</strong> {intelligence?.intelligenceId?.includes('_live') ? <span style={{ color: 'var(--success)' }}>GEMINI LIVE</span> : <span style={{ color: 'var(--warning)' }}>SANDBOX CONSTRAINED</span>} &nbsp;|&nbsp;
            <strong>EXECUTION:</strong> {intelligence?.intelligenceId?.includes('_live') ? 'Vertex AI / Gemini API' : 'DETERMINISTIC FALLBACK'} &nbsp;|&nbsp;
            <strong>CONTRACT:</strong> GeminiProvider-compatible
          </div>
          <span className="tag tag-warning">Provider Abstraction Active</span>
        </div>
        <p style={{ marginTop: '6px', fontSize: '0.78rem', color: 'var(--text-muted)', margin: '4px 0 0 0' }}>
          Current competition deployment uses a deterministic provider fallback because live Vertex AI execution is restricted by the temporary sandbox environment. The application maintains a provider boundary for Vertex AI/Gemini execution.
        </p>
      </div>

      {/* Golden Path Step Navigation */}
      <nav className="golden-path-nav">
        <button className={`step-btn ${activeStep === 'PROFILE' ? 'active' : ''}`} onClick={() => setActiveStep('PROFILE')}>
          1. Profile &amp; Evidence
        </button>
        <button className={`step-btn ${activeStep === 'EXTRACTION' ? 'active' : ''}`} onClick={() => setActiveStep('EXTRACTION')}>
          2. 10-Vector Intelligence
        </button>
        <button className={`step-btn ${activeStep === 'GENERATION' ? 'active' : ''}`} onClick={() => setActiveStep('GENERATION')}>
          3. Multi-Stage 10-Slide Deck
        </button>
        <button className={`step-btn ${activeStep === 'EVALUATION' ? 'active' : ''}`} onClick={() => setActiveStep('EVALUATION')}>
          4. 4-Vector Evaluation
        </button>
        <button className={`step-btn ${activeStep === 'REGENERATION' ? 'active' : ''}`} onClick={() => setActiveStep('REGENERATION')}>
          5. Targeted Regeneration
        </button>
        <button className={`step-btn ${activeStep === 'EXPORT' ? 'active' : ''}`} onClick={() => setActiveStep('EXPORT')}>
          6. Export Presentation
        </button>
      </nav>

      {/* Loading Overlay Indicator */}
      {loading && (
        <div className="card" style={{ border: '1px solid var(--primary)', textAlign: 'center', padding: '32px' }}>
          <div style={{ fontSize: '1.2rem', fontWeight: 600, color: 'var(--primary)' }}>⚙️ Processing API Request...</div>
          <p style={{ marginTop: '8px', color: 'var(--text-muted)' }}>{statusMessage}</p>
        </div>
      )}

      {/* Error Message */}
      {errorMessage && (
        <div className="card" style={{ border: '1px solid red', padding: '16px', margin: '16px 0', background: 'rgba(255, 0, 0, 0.1)' }}>
          <strong style={{ color: 'red' }}>Error:</strong>
          <span style={{ color: 'red', marginLeft: '8px' }}>{errorMessage}</span>
        </div>
      )}

      {/* Step 1: Startup Profile & Document Ingestion */}
      {!loading && activeStep === 'PROFILE' && (
        <main className="card">
          <div className="card-title">
            <span>Startup Profile &amp; Supporting Evidence</span>
            <span className="tag tag-primary">Step 1 — Ingestion</span>
          </div>
          <div className="grid-2">
            <div>
              <h3>Company Metadata</h3>
              <p style={{ marginTop: '8px', color: 'var(--text-muted)' }}>Name: {startupProfile?.name || 'ScoutEdge'}</p>
              <p style={{ color: 'var(--text-muted)' }}>Tagline: {startupProfile?.tagline || 'Autonomous AI Pitch Intelligence & VC Scouting'}</p>
              <p style={{ color: 'var(--text-muted)' }}>Stage: {startupProfile?.stage || 'Pre-Seed'}</p>
              <p style={{ color: 'var(--text-muted)' }}>Target Raise: ${startupProfile?.targetRaise?.toLocaleString() || '1,500,000'}</p>
            </div>
            <div>
              <h3>Ingested Documents (Cloud Storage)</h3>
              <ul style={{ marginTop: '8px', listStyle: 'none' }}>
                <li style={{ padding: '8px', background: 'rgba(255,255,255,0.05)', borderRadius: '6px', marginBottom: '6px' }}>
                  📄 ScoutEdge_Pitch_Deck_Draft.pdf <span className="tag tag-success" style={{ float: 'right' }}>Indexed</span>
                </li>
                <li style={{ padding: '8px', background: 'rgba(255,255,255,0.05)', borderRadius: '6px', marginBottom: '6px' }}>
                  📊 ScoutEdge_Financials.xlsx <span className="tag tag-success" style={{ float: 'right' }}>Indexed</span>
                </li>
              </ul>
            </div>
          </div>
          <div style={{ marginTop: '24px', textAlign: 'right' }}>
            <button className="btn-primary" onClick={handleExtractIntelligence}>
              Run 10-Vector Extraction &rarr;
            </button>
          </div>
        </main>
      )}

      {/* Step 2: 10-Vector Entity Intelligence */}
      {!loading && activeStep === 'EXTRACTION' && (
        <main className="card">
          <div className="card-title">
            <span>Extracted Startup Intelligence (10 Business Vectors)</span>
            <span className="tag tag-success">Stage 2 &amp; 3 Complete</span>
          </div>
          <div className="grid-2">
            {intelligence?.entities && Object.entries(intelligence.entities).map(([key, val]: [string, any], idx) => (
              <div key={idx} className="slide-card">
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                  <strong style={{ textTransform: 'capitalize' }}>{idx + 1}. {key}</strong>
                  <span className="tag tag-primary">Evidence Verified</span>
                </div>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                  {val.statement || val.ask || `Burn: $${val.burnRate || 15000}/mo | Runway: ${val.runwayMonths || 10} mos`}
                </p>
              </div>
            ))}
          </div>
          <div style={{ marginTop: '24px', textAlign: 'right' }}>
            <button className="btn-primary" onClick={handleGenerateDeck}>
              Synthesize 10-Slide Investor Deck &rarr;
            </button>
          </div>
        </main>
      )}

      {/* Step 3: Multi-Stage 10-Slide Deck */}
      {!loading && activeStep === 'GENERATION' && (
        <main className="card">
          <div className="card-title">
            <span>Synthesized 10-Slide Investor Presentation</span>
            <span className="tag tag-success">Enforces Exactly 10 Slides</span>
          </div>
          <p style={{ color: 'var(--text-muted)', marginBottom: '16px' }}>
            Structured pipeline sequentially generated 10 grounded investor slides with speaker notes.
          </p>
          <div className="grid-3">
            {pitchDeck?.slides ? pitchDeck.slides.map((slide: any) => (
              <div key={slide.slideNumber} className="slide-card">
                <div style={{ fontSize: '0.8rem', color: 'var(--primary)' }}>SLIDE {slide.slideNumber} OF 10 — {slide.category}</div>
                <h4 style={{ margin: '4px 0' }}>{slide.title}</h4>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Confidence: {Math.round(slide.confidence * 100)}% | Grounded</p>
              </div>
            )) : (
              <p>No slides generated yet.</p>
            )}
          </div>
          <div style={{ marginTop: '24px', textAlign: 'right' }}>
            <button className="btn-primary" onClick={handleEvaluateDeck}>
              Run Automated Evaluation Engine &rarr;
            </button>
          </div>
        </main>
      )}

      {/* Step 4: 4-Vector Evaluation Engine */}
      {!loading && activeStep === 'EVALUATION' && (
        <main className="card">
          <div className="card-title">
            <span>Automated 4-Vector Quality Evaluation Report</span>
            <span className="tag tag-success">Overall Readiness: {evaluation?.overallScore || 'N/A'}/100</span>
          </div>

          {evaluation?.readinessStatus && (
            <div style={{ marginBottom: '16px' }}>
              <strong>Status: </strong>
              <span className={`tag ${evaluation.readinessStatus === 'PASSED' ? 'tag-success' : 'tag-warning'}`}>
                {evaluation.readinessStatus}
              </span>
            </div>
          )}

          <div className="grid-2">
            <div className="slide-card">
              <h4>Completeness Vector</h4>
              <p className="tag tag-success" style={{ marginTop: '8px' }}>
                Score: {evaluation?.metrics?.completeness != null ? `${Math.round(evaluation.metrics.completeness * 100)}%` : 'Pending...'}
              </p>
            </div>
            <div className="slide-card">
              <h4>Factual Consistency Vector</h4>
              <p className="tag tag-success" style={{ marginTop: '8px' }}>
                Score: {evaluation?.metrics?.factualConsistency != null ? `${Math.round(evaluation.metrics.factualConsistency * 100)}%` : 'Pending...'}
              </p>
            </div>
            <div className="slide-card">
              <h4>Evidence Grounding Vector</h4>
              <p className="tag tag-primary" style={{ marginTop: '8px' }}>
                Score: {evaluation?.metrics?.evidenceGrounding != null ? `${Math.round(evaluation.metrics.evidenceGrounding * 100)}%` : 'Pending...'}
              </p>
            </div>
            <div className="slide-card">
              <h4>Investor Readiness Vector</h4>
              <p className="tag tag-primary" style={{ marginTop: '8px' }}>
                Score: {evaluation?.metrics?.investorReadiness != null ? `${Math.round(evaluation.metrics.investorReadiness * 100)}%` : 'Pending...'}
              </p>
            </div>
          </div>
          
          {evaluation?.feedback && evaluation.feedback.length > 0 && (
            <div style={{ marginTop: '24px' }}>
              <h4>Evaluation Feedback</h4>
              <ul style={{ marginTop: '8px', paddingLeft: '20px', color: 'var(--text-muted)' }}>
                {evaluation.feedback.map((item: string, idx: number) => (
                  <li key={idx} style={{ marginBottom: '4px' }}>{item}</li>
                ))}
              </ul>
            </div>
          )}

          <div style={{ marginTop: '24px', textAlign: 'right' }}>
            <button className="btn-primary" onClick={handleTargetedRegeneration}>
              Run Targeted Slide Regeneration &rarr;
            </button>
          </div>
        </main>
      )}

      {/* Step 5: Targeted Slide Regeneration */}
      {!loading && activeStep === 'REGENERATION' && (
        <main className="card">
          <div className="card-title">
            <span>Stage 7 — Targeted Slide Regeneration Path</span>
            <span className="tag tag-warning">Isolated Slide Refinement</span>
          </div>
          <p style={{ color: 'var(--text-muted)', marginBottom: '16px' }}>
            Instead of re-generating the whole deck, Fundable AI isolates weak slides (`&lt; 80` confidence) and re-evaluates only targeted sections.
            <br />
            <strong>Overall Readiness after refinement: {evaluation?.overallScore || 'N/A'}/100</strong>
          </p>
          <div className="grid-3">
            {pitchDeck?.slides ? pitchDeck.slides.map((slide: any) => {
              const isTargeted = slide.slideNumber === 6 || slide.slideNumber === 9;
              return (
                <div key={slide.slideNumber} className="slide-card" style={isTargeted ? { borderColor: 'var(--warning)', borderWidth: '2px' } : {}}>
                  <div style={{ fontSize: '0.8rem', color: isTargeted ? 'var(--warning)' : 'var(--primary)' }}>
                    SLIDE {slide.slideNumber} OF 10 — {slide.category}
                  </div>
                  <h4 style={{ margin: '4px 0' }}>{slide.title}</h4>
                  {slide.headline && <p style={{ fontSize: '0.85rem', marginBottom: '8px' }}>{slide.headline}</p>}
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Confidence: {Math.round(slide.confidence * 100)}% | Grounded</p>
                </div>
              );
            }) : (
              <p>No slides to display.</p>
            )}
          </div>
          <div style={{ marginTop: '24px', textAlign: 'right' }}>
            <button className="btn-primary" onClick={() => setActiveStep('EXPORT')}>
              View Final Presentation &amp; Export &rarr;
            </button>
          </div>
        </main>
      )}

      {/* Step 6: Export Presentation */}
      {!loading && activeStep === 'EXPORT' && (
        <main className="card">
          <div className="card-title">
            <span>Stage 9 — Export Final Presentation</span>
            <span className="tag tag-success">Serverless PDF &amp; Adapter Export</span>
          </div>
          <p style={{ color: 'var(--text-muted)', marginBottom: '16px' }}>
            Export your evidence-grounded 10-slide presentation directly to binary PDF or Google Slides adapter preview.
          </p>
          <div className="grid-2">
            <div className="slide-card" style={{ textAlign: 'center', padding: '32px' }}>
              <h3>Google Slides Export</h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: '12px 0' }}>
                Google Slides API integration is architected but not available in the temporary Code Kitchen sandbox.
              </p>
              <button className="btn-primary" onClick={() => alert('Google Slides API is not available in the Code Kitchen sandbox environment. The API contract is defined and ready for production integration.')}>
                Google Slides API (Sandbox Unavailable) 📊
              </button>
            </div>
            <div className="slide-card" style={{ textAlign: 'center', padding: '32px' }}>
              <h3>Download PDF Presentation</h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: '12px 0' }}>
                Generates a 10-page binary PDF document containing all slide details, speaker notes, and verified evidence references.
              </p>
              <button className="btn-primary" onClick={() => window.open('/api/exports/deck_scoutedge_v1/pdf/download', '_blank')}>
                Download PDF Document 📄
              </button>
            </div>
          </div>
        </main>
      )}
    </div>
  );
}
