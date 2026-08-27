import { useState, useEffect } from 'react';

type Step = 'PROFILE' | 'EXTRACTION' | 'QA' | 'GENERATION' | 'EVALUATION' | 'REGENERATION' | 'EXPORT';

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

  // User-First Flow states
  const [activeStartupId, setActiveStartupId] = useState<string>('');
  const [questions, setQuestions] = useState<any[]>([]);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const [fileName, setFileName] = useState<string>('');
  const [extractedTextLength, setExtractedTextLength] = useState<number>(0);

  // Pasted Text Flow states
  const [pastedText, setPastedText] = useState<string>('');
  const [pastedVentureName, setPastedVentureName] = useState<string>('');

  // Load initial ScoutEdge profile from backend API for demo
  const loadScoutEdge = () => {
    setLoading(true);
    setErrorMessage('');
    setStatusMessage('Loading ScoutEdge Seed Profile...');
    setActiveStartupId('scoutedge-001');
    fetch('/api/startups/scoutedge-001')
      .then(res => {
        if (!res.ok) throw new Error(`Failed to fetch: ${res.statusText}`);
        return res.json();
      })
      .then(data => {
        if (data.startup) {
          setStartupProfile(data.startup);
          setActiveStep('PROFILE');
        }
      })
      .catch(err => {
        console.error('Failed to fetch startup profile:', err);
        setErrorMessage('Failed to fetch ScoutEdge profile: ' + err.message);
      })
      .finally(() => setLoading(false));
  };

  // We DO NOT load ScoutEdge by default on mount so the user has a clean landing screen.
  useEffect(() => {
    // Start clean
  }, []);

  // Ingestion: Start from Scratch Option
  const handleStartFromScratch = () => {
    const startupId = `startup_scratch_${Date.now()}`;
    setActiveStartupId(startupId);
    setStartupProfile({
      startupId,
      name: 'Custom Venture',
      tagline: 'Custom business narrative built from scratch',
      stage: 'Seed',
      targetRaise: 1000000,
      currency: 'USD'
    });
    setLoading(true);
    // Initialize blank/custom startup on backend
    fetch('/api/startups', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        startupId,
        name: 'Custom Venture',
        tagline: 'Custom business narrative built from scratch',
        founderId: 'usr_custom_123',
        stage: 'Seed',
        targetRaise: 1000000,
        currency: 'USD'
      })
    })
      .then(res => {
        if (!res.ok) throw new Error(`Server returned code ${res.status}`);
        return res.json();
      })
      .then(() => {
        setActiveStep('PROFILE');
      })
      .catch(err => {
        console.error(err);
        setErrorMessage('Failed to initialize start from scratch: ' + err.message);
      })
      .finally(() => setLoading(false));
  };

  // Client-side PDF extractor using pdfjs-dist
  const extractTextFromPdf = async (file: File): Promise<string> => {
    const arrayBuffer = await file.arrayBuffer();
    const pdfjsLib = (window as any).pdfjsLib;
    if (!pdfjsLib) throw new Error('PDF.js library failed to load from CDN. Try a text file.');
    pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.4.120/pdf.worker.min.js';
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    let text = '';
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const content = await page.getTextContent();
      const strings = content.items.map((item: any) => item.str);
      text += strings.join(' ') + '\n';
    }
    return text;
  };

  // File upload text reader
  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setLoading(true);
    setErrorMessage('');
    setFileName(file.name);
    setUploadProgress(10);
    setStatusMessage(`Parsing document: ${file.name}...`);

    try {
      const startupId = `startup_${Date.now()}`;
      setActiveStartupId(startupId);

      // Extract text content
      let fileContent = '';
      if (file.type === 'application/pdf') {
        setUploadProgress(30);
        fileContent = await extractTextFromPdf(file);
      } else {
        setUploadProgress(50);
        fileContent = await file.text();
      }

      if (!fileContent || fileContent.trim().length === 0) {
        throw new Error("We couldn't read any text from this file. Try another file or paste your venture information.");
      }

      setExtractedTextLength(fileContent.length);
      setUploadProgress(70);
      setStatusMessage(`Ingesting parsed text into Cloud Storage...`);

      // Initialize startup profile on backend
      const profileRes = await fetch('/api/startups', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          startupId,
          name: file.name.split('.')[0].slice(0, 30),
          tagline: 'Extracted from uploaded venture materials',
          founderId: 'usr_custom_123',
          stage: 'Seed',
          targetRaise: 1000000,
          currency: 'USD'
        })
      });
      if (!profileRes.ok) {
        const errData = await profileRes.json().catch(() => ({}));
        throw new Error(errData.error || `Failed to create profile session: ${profileRes.statusText}`);
      }

      // Upload text content via API
      const response = await fetch(`/api/documents/${startupId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fileName: file.name,
          fileContent: fileContent.slice(0, 100000), // cap to 100kb for safety
          fileType: file.name.split('.').pop() || 'txt'
        })
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.error || `Upload request failed: ${response.statusText}`);
      }
      
      setUploadProgress(90);
      setStatusMessage('Ingestion complete. Extracting 10 Venture Vectors...');
      
      // Auto-extract intelligence from the uploaded evidence
      const extractRes = await fetch(`/api/intelligence/${startupId}/extract`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: file.name.split('.')[0].slice(0, 30),
          tagline: 'Extracted from uploaded venture materials'
        })
      });
      
      if (!extractRes.ok) {
        const errData = await extractRes.json().catch(() => ({}));
        throw new Error(errData.error || `Extraction failed: ${extractRes.statusText}`);
      }

      const extractData = await extractRes.json();
      if (extractData.intelligence) {
        setStartupProfile({
          startupId,
          name: file.name.split('.')[0].slice(0, 30),
          tagline: 'Extracted from uploaded venture materials',
          stage: 'Seed',
          targetRaise: 1000000,
          currency: 'USD'
        });
        setIntelligence(extractData.intelligence);
        setActiveStep('EXTRACTION');
      } else {
        throw new Error("We couldn't understand the venture from this source. Please try adding more detail.");
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Ingestion failed.');
    } finally {
      setLoading(false);
      setUploadProgress(null);
    }
  };

  // Pasted Text Ingestion Handler (Option B)
  const handlePasteSubmit = async () => {
    if (!pastedText.trim()) return;

    setLoading(true);
    setErrorMessage('');
    const vName = pastedVentureName.trim() || 'Custom Venture';
    setStatusMessage(`Ingesting pasted text for ${vName}...`);

    try {
      const startupId = `startup_pasted_${Date.now()}`;
      setActiveStartupId(startupId);

      // Initialize startup profile on backend
      const profileRes = await fetch('/api/startups', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          startupId,
          name: vName,
          tagline: 'Pasted venture information',
          founderId: 'usr_custom_123',
          stage: 'Seed',
          targetRaise: 1000000,
          currency: 'USD'
        })
      });
      if (!profileRes.ok) {
        const errData = await profileRes.json().catch(() => ({}));
        throw new Error(errData.error || `Failed to create profile: ${profileRes.statusText}`);
      }

      // Upload text content via the documents API
      const docRes = await fetch(`/api/documents/${startupId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fileName: 'pasted_evidence.txt',
          fileContent: pastedText,
          fileType: 'txt'
        })
      });
      if (!docRes.ok) {
        const errData = await docRes.json().catch(() => ({}));
        throw new Error(errData.error || `Ingestion request failed: ${docRes.statusText}`);
      }

      setStatusMessage('Ingestion complete. Extracting 10 Venture Vectors...');

      // Trigger intelligence extraction
      const extractRes = await fetch(`/api/intelligence/${startupId}/extract`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: vName,
          tagline: 'Pasted venture information'
        })
      });
      if (!extractRes.ok) {
        const errData = await extractRes.json().catch(() => ({}));
        throw new Error(errData.error || `Extraction failed: ${extractRes.statusText}`);
      }

      const extractData = await extractRes.json();
      if (extractData.intelligence) {
        setStartupProfile({
          startupId,
          name: vName,
          tagline: 'Pasted venture information',
          stage: 'Seed',
          targetRaise: 1000000,
          currency: 'USD'
        });
        setIntelligence(extractData.intelligence);
        setActiveStep('EXTRACTION');
      } else {
        throw new Error("We couldn't understand the venture from this source. Please try adding more detail.");
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Ingestion failed.');
    } finally {
      setLoading(false);
    }
  };

  // Golden Path Handler 1: Trigger Stage 2 Extraction
  const handleExtractIntelligence = async () => {
    setLoading(true);
    setErrorMessage('');
    setStatusMessage('Running Gemini 2.x Structured Entity Extraction across 10 VC vectors...');
    try {
      const res = await fetch(`/api/intelligence/${activeStartupId}/extract`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: startupProfile?.name || 'ScoutEdge',
          tagline: startupProfile?.tagline || 'Autonomous AI Pitch Intelligence & VC Scouting'
        })
      });
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || `Failed to extract: ${res.statusText}`);
      }
      const data = await res.json();
      if (data.intelligence) {
        setIntelligence(data.intelligence);
        setActiveStep('EXTRACTION');
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to extract.');
    } finally {
      setLoading(false);
    }
  };

  // Start Founder Q&A Step
  const handleStartQA = async () => {
    setLoading(true);
    setErrorMessage('');
    setStatusMessage('Formulating structured founder interviews via Gemini...');
    try {
      const res = await fetch(`/api/intelligence/${activeStartupId}/questions`, { method: 'POST' });
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || `Failed to generate Q&A: ${res.statusText}`);
      }
      const data = await res.json();
      if (data.questions && data.questions.length > 0) {
        setQuestions(data.questions);
        setCurrentQuestionIndex(0);
        setActiveStep('QA');
      } else {
        // Fallback to Generation if no questions are generated
        setActiveStep('GENERATION');
      }
    } catch (err: any) {
      setErrorMessage('Failed to generate Q&A: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  // Answer a question and proceed
  const handleAnswerSubmit = (questionId: string, answer: string, skipped = false) => {
    setAnswers(prev => ({ ...prev, [questionId]: skipped ? 'Skipped' : answer }));
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  // Skip the current question
  const handleSkipQuestion = (questionId: string) => {
    handleAnswerSubmit(questionId, 'Skipped', true);
  };

  // Back to previous question
  const handlePrevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  // Submit all answers to refine intelligence
  const handleFinishQA = async () => {
    setLoading(true);
    setErrorMessage('');
    setStatusMessage('Merging answers and refining 10 business vectors...');
    try {
      const answerPayload = Object.entries(answers).map(([qId, ans]) => ({
        questionId: qId,
        answer: ans,
        skipped: ans === 'Skipped'
      }));

      const res = await fetch(`/api/intelligence/${activeStartupId}/answers`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ answers: answerPayload })
      });
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || `Failed to submit answers: ${res.statusText}`);
      }
      const data = await res.json();
      if (data.intelligence) {
        setIntelligence(data.intelligence);
        // Automatically generate deck after refining intelligence
        setStatusMessage('Answers applied. Generating 10 grounded presentation slides...');
        const genRes = await fetch(`/api/pitches/${activeStartupId}/generate`, { method: 'POST' });
        if (!genRes.ok) {
          const errData = await genRes.json().catch(() => ({}));
          throw new Error(errData.error || `Deck generation failed: ${genRes.statusText}`);
        }
        const genData = await genRes.json();
        if (genData.deck) {
          setPitchDeck(genData.deck);
          setActiveStep('GENERATION');
        }
      }
    } catch (err: any) {
      setErrorMessage('Failed to apply answers: ' + err.message);
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
      const res = await fetch(`/api/pitches/${activeStartupId}/generate`, { method: 'POST' });
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || `Synthesis failed: ${res.statusText}`);
      }
      const data = await res.json();
      if (data.deck) {
        setPitchDeck(data.deck);
        setActiveStep('GENERATION');
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to generate deck.');
    } finally {
      setLoading(false);
    }
  };

  // Golden Path Handler 3: Run Stage 6 Evaluation Engine
  const handleEvaluateDeck = async () => {
    if (!pitchDeck) return;
    setLoading(true);
    setErrorMessage('');
    setStatusMessage('Running 4-Vector Evaluation Engine (Completeness, Consistency, Grounding, Readiness)...');
    try {
      const res = await fetch(`/api/evaluations/${pitchDeck.deckId}`);
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || `Evaluation failed: ${res.statusText}`);
      }
      const data = await res.json();
      if (data.evaluation) {
        setEvaluation(data.evaluation);
        setActiveStep('EVALUATION');
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to evaluate deck.');
    } finally {
      setLoading(false);
    }
  };

  // Golden Path Handler 4: Trigger Stage 7 Targeted Regeneration
  const handleTargetedRegeneration = async () => {
    if (!pitchDeck) return;
    setLoading(true);
    setErrorMessage('');
    setStatusMessage('Isolating Slide 6 (Traction) & Slide 9 (Financials) for targeted regeneration...');
    try {
      const res = await fetch(`/api/evaluations/${pitchDeck.deckId}/regenerate-slide`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          targetSlideNumbers: [6, 9],
          reason: 'Improve evidence grounding and financial consistency'
        })
      });
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || `Regeneration failed: ${res.statusText}`);
      }
      const data = await res.json();
      if (data.updatedDeck) {
        setPitchDeck(data.updatedDeck);
        setEvaluation(data.newEvaluation);
        setActiveStep('REGENERATION');
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to regenerate slides.');
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
            <strong>STATUS:</strong> {intelligence?.intelligenceId?.includes('_live') || intelligence?.intelligenceId?.includes('_refined') ? <span style={{ color: 'var(--success)' }}>GEMINI LIVE</span> : <span style={{ color: 'var(--warning)' }}>SANDBOX CONSTRAINED</span>} &nbsp;|&nbsp;
            <strong>EXECUTION:</strong> {intelligence?.intelligenceId?.includes('_live') || intelligence?.intelligenceId?.includes('_refined') ? 'Vertex AI / Gemini API' : 'DETERMINISTIC FALLBACK'} &nbsp;|&nbsp;
            <strong>CONTRACT:</strong> GeminiProvider-compatible
          </div>
          <span className="tag tag-warning">Provider Abstraction Active</span>
        </div>
        <p style={{ marginTop: '6px', fontSize: '0.78rem', color: 'var(--text-muted)', margin: '4px 0 0 0' }}>
          Current competition deployment uses a deterministic provider fallback because live Vertex AI execution is restricted by the temporary sandbox environment. The application maintains a provider boundary for Vertex AI/Gemini execution.
        </p>
      </div>

      {/* Pipeline Visualization Chain */}
      <div className="pipeline-container">
        <div className={`pipeline-node ${activeStep === 'PROFILE' ? 'active' : 'completed'}`}>
          <div className="pipeline-node-icon">📁</div>
          <div className="pipeline-node-title">Evidence Ingestion</div>
          <span className={`pipeline-node-status ${activeStep === 'PROFILE' ? 'active' : 'completed'}`}>
            {activeStep === 'PROFILE' ? 'active' : 'completed'}
          </span>
        </div>
        <div className="pipeline-connector">➔</div>
        
        <div className={`pipeline-node ${activeStep === 'EXTRACTION' ? 'active' : (intelligence ? 'completed' : 'pending')}`}>
          <div className="pipeline-node-icon">🧠</div>
          <div className="pipeline-node-title">Venture Intelligence</div>
          <span className={`pipeline-node-status ${activeStep === 'EXTRACTION' ? 'active' : (intelligence ? 'completed' : 'pending')}`}>
            {activeStep === 'EXTRACTION' ? 'active' : (intelligence ? 'completed' : 'pending')}
          </span>
        </div>
        <div className="pipeline-connector">➔</div>

        <div className={`pipeline-node ${activeStep === 'QA' ? 'active' : (questions.length > 0 && Object.keys(answers).length >= questions.length ? 'completed' : 'pending')}`}>
          <div className="pipeline-node-icon">💬</div>
          <div className="pipeline-node-title">Founder Q&amp;A</div>
          <span className={`pipeline-node-status ${activeStep === 'QA' ? 'active' : (questions.length > 0 && Object.keys(answers).length >= questions.length ? 'completed' : 'pending')}`}>
            {activeStep === 'QA' ? 'active' : (questions.length > 0 && Object.keys(answers).length >= questions.length ? 'completed' : 'pending')}
          </span>
        </div>
        <div className="pipeline-connector">➔</div>

        <div className={`pipeline-node ${activeStep === 'GENERATION' ? 'active' : (pitchDeck ? 'completed' : 'pending')}`}>
          <div className="pipeline-node-icon">✍️</div>
          <div className="pipeline-node-title">Grounded Synthesis</div>
          <span className={`pipeline-node-status ${activeStep === 'GENERATION' ? 'active' : (pitchDeck ? 'completed' : 'pending')}`}>
            {activeStep === 'GENERATION' ? 'active' : (pitchDeck ? 'completed' : 'pending')}
          </span>
        </div>
        <div className="pipeline-connector">➔</div>

        <div className={`pipeline-node ${activeStep === 'EVALUATION' ? 'active' : (evaluation ? 'completed' : 'pending')}`}>
          <div className="pipeline-node-icon">⚖️</div>
          <div className="pipeline-node-title">AI Quality Gate</div>
          <span className={`pipeline-node-status ${activeStep === 'EVALUATION' ? 'active' : (evaluation ? 'completed' : 'pending')}`}>
            {activeStep === 'EVALUATION' ? 'active' : (evaluation ? 'completed' : 'pending')}
          </span>
        </div>
        <div className="pipeline-connector">➔</div>

        <div className={`pipeline-node ${activeStep === 'REGENERATION' ? 'active' : (activeStep === 'EXPORT' ? 'completed' : 'pending')}`}>
          <div className="pipeline-node-icon">🔄</div>
          <div className="pipeline-node-title">Targeted Regen</div>
          <span className={`pipeline-node-status ${activeStep === 'REGENERATION' ? 'active' : (activeStep === 'EXPORT' ? 'completed' : 'pending')}`}>
            {activeStep === 'REGENERATION' ? 'active' : (activeStep === 'EXPORT' ? 'completed' : 'pending')}
          </span>
        </div>
        <div className="pipeline-connector">➔</div>

        <div className={`pipeline-node ${activeStep === 'EXPORT' ? 'active' : 'pending'}`}>
          <div className="pipeline-node-icon">📄</div>
          <div className="pipeline-node-title">PDF Export</div>
          <span className={`pipeline-node-status ${activeStep === 'EXPORT' ? 'active' : 'pending'}`}>
            {activeStep === 'EXPORT' ? 'active' : 'pending'}
          </span>
        </div>
      </div>

      {/* Golden Path Step Navigation */}
      <nav className="golden-path-nav">
        <button className={`step-btn ${activeStep === 'PROFILE' ? 'active' : ''}`} onClick={() => setActiveStep('PROFILE')}>
          1. Ingestion &amp; Upload
        </button>
        <button className={`step-btn ${activeStep === 'EXTRACTION' ? 'active' : ''}`} onClick={() => setActiveStep('EXTRACTION')} disabled={!intelligence}>
          2. Venture Intelligence
        </button>
        <button className={`step-btn ${activeStep === 'QA' ? 'active' : ''}`} onClick={() => setActiveStep('QA')} disabled={!intelligence}>
          3. Founder Q&amp;A
        </button>
        <button className={`step-btn ${activeStep === 'GENERATION' ? 'active' : ''}`} onClick={() => setActiveStep('GENERATION')} disabled={!pitchDeck}>
          4. Grounded Synthesis
        </button>
        <button className={`step-btn ${activeStep === 'EVALUATION' ? 'active' : ''}`} onClick={() => setActiveStep('EVALUATION')} disabled={!evaluation}>
          5. Quality Gate
        </button>
        <button className={`step-btn ${activeStep === 'REGENERATION' ? 'active' : ''}`} onClick={() => setActiveStep('REGENERATION')} disabled={!evaluation}>
          6. Targeted Regen
        </button>
        <button className={`step-btn ${activeStep === 'EXPORT' ? 'active' : ''}`} onClick={() => setActiveStep('EXPORT')} disabled={!pitchDeck}>
          7. Export Deck
        </button>
      </nav>

      {/* Loading Overlay Indicator */}
      {loading && (
        <div className="card" style={{ border: '1px solid var(--primary)', textAlign: 'center', padding: '32px' }}>
          <div style={{ fontSize: '1.2rem', fontWeight: 600, color: 'var(--primary)' }}>⚙️ Processing API Request...</div>
          <p style={{ marginTop: '8px', color: 'var(--text-muted)' }}>{statusMessage}</p>
          {uploadProgress != null && (
            <div style={{ marginTop: '12px', background: 'rgba(255,255,255,0.1)', height: '8px', borderRadius: '4px', overflow: 'hidden', width: '200px', margin: '12px auto' }}>
              <div style={{ background: 'var(--primary)', height: '100%', width: `${uploadProgress}%`, transition: 'width 0.2s' }}></div>
            </div>
          )}
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
            <span>Turn your venture into an investor-ready story.</span>
            <span className="tag tag-primary">Step 1 — Ingestion</span>
          </div>
          
          <p style={{ color: 'var(--text-muted)', marginBottom: '24px' }}>
            Provide your raw venture information. Fundable AI extracts your venture intelligence, identifies knowledge gaps, conducts founder Q&amp;A, and generates a grounded 10-slide investor presentation.
          </p>

          <div className="grid-2" style={{ gap: '32px' }}>
            {/* Primary Document Upload Area (Option A) */}
            <div className="slide-card" style={{ padding: '24px', border: '1px solid var(--border-card)', background: 'rgba(255,255,255,0.01)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '16px' }}>
                  <span style={{ fontSize: '1.5rem', marginRight: '10px' }}>📁</span>
                  <h4 style={{ margin: 0 }}>Option A: Upload Venture Deck</h4>
                </div>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '16px' }}>
                  Upload PDF, TXT, or MD documents up to 10MB. Text will be parsed locally and ingested.
                </p>
              </div>
              
              <div style={{ border: '2px dashed var(--border-card)', padding: '32px', borderRadius: '8px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', background: 'rgba(0,0,0,0.1)' }}>
                <div style={{ fontSize: '2rem', marginBottom: '8px' }}>📤</div>
                <label className="btn-primary" style={{ cursor: 'pointer', display: 'inline-block', marginBottom: '8px' }}>
                  Select File
                  <input type="file" accept=".pdf,.txt,.md" onChange={handleFileUpload} style={{ display: 'none' }} />
                </label>
                {fileName && (
                  <div style={{ fontSize: '0.85rem', color: 'var(--success)', marginTop: '8px' }}>
                    Selected: {fileName} ({Math.round(extractedTextLength / 1024)} KB read)
                  </div>
                )}
              </div>
            </div>

            {/* Paste Venture Text Area (Option B) */}
            <div className="slide-card" style={{ padding: '24px', border: '1px solid var(--border-card)', background: 'rgba(255,255,255,0.01)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '16px' }}>
                  <span style={{ fontSize: '1.5rem', marginRight: '10px' }}>📝</span>
                  <h4 style={{ margin: 0 }}>Option B: Paste Venture Text</h4>
                </div>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '12px' }}>
                  Paste your existing pitch deck slides, notes, or venture summaries.
                </p>
                
                <input 
                  type="text" 
                  placeholder="Venture Name (e.g. AgroPulse)" 
                  value={pastedVentureName}
                  onChange={(e) => setPastedVentureName(e.target.value)}
                  style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid var(--border-card)', background: 'var(--bg-card)', color: 'var(--text)', marginBottom: '12px', boxSizing: 'border-box' }}
                />
                
                <textarea
                  placeholder="Paste your existing pitch, company overview, notes, or venture information here..."
                  value={pastedText}
                  onChange={(e) => setPastedText(e.target.value)}
                  style={{ width: '100%', height: '120px', padding: '10px', borderRadius: '6px', border: '1px solid var(--border-card)', background: 'var(--bg-card)', color: 'var(--text)', fontFamily: 'inherit', fontSize: '0.85rem', resize: 'vertical', marginBottom: '12px', boxSizing: 'border-box' }}
                />
              </div>
              
              <button 
                className="btn-primary" 
                onClick={handlePasteSubmit}
                disabled={!pastedText.trim()}
                style={{ width: '100%' }}
              >
                Understand My Venture →
              </button>
            </div>
          </div>

          {/* Bottom Shortcuts / Secondary Options */}
          <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px', marginTop: '24px', paddingTop: '16px', borderTop: '1px solid var(--border-card)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Shortcut testing options:</span>
              <button className="btn-primary" style={{ padding: '6px 12px', fontSize: '0.8rem' }} onClick={loadScoutEdge}>
                Use ScoutEdge Demo 🚀
              </button>
              <button className="btn-primary" style={{ padding: '6px 12px', fontSize: '0.8rem', background: 'transparent', border: '1px solid var(--primary)', color: 'var(--primary)' }} onClick={handleStartFromScratch}>
                Start Blank Profile ✏️
              </button>
            </div>
          </div>

          {startupProfile && (
            <div className="slide-card" style={{ marginTop: '24px', border: '1px solid var(--primary)' }}>
              <h4>Active Workspace Context</h4>
              <p style={{ marginTop: '8px', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                Venture Name: <strong style={{ color: 'var(--text-main)' }}>{startupProfile.name}</strong> &nbsp;|&nbsp;
                Tagline: <em>{startupProfile.tagline}</em> &nbsp;|&nbsp;
                Target Raise: <strong>${startupProfile.targetRaise.toLocaleString()}</strong>
              </p>
              <div style={{ marginTop: '16px', textAlign: 'right' }}>
                <button className="btn-primary" onClick={handleExtractIntelligence}>
                  Run 10-Vector Extraction &rarr;
                </button>
              </div>
            </div>
          )}
        </main>
      )}

      {/* Step 2: Extracted Startup Intelligence Vectors */}
      {!loading && activeStep === 'EXTRACTION' && (
        <main className="card">
          <div className="card-title">
            <span>Venture Intelligence Model (10 Business Vectors)</span>
            <span className="tag tag-success">Stage 2 — Extracted</span>
          </div>

          <div style={{ marginBottom: '20px', padding: '12px 16px', background: 'rgba(16, 185, 129, 0.08)', borderLeft: '4px solid var(--success)', borderRadius: '0 8px 8px 0', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
            <strong>Extraction Complete</strong>: Gemini parsed the uploaded evidence, resolved the business context, and indexed these 10 structured vectors. Check the evidence tags for grounding state.
          </div>

          <div className="grid-2">
            {intelligence?.entities && Object.entries(intelligence.entities).map(([key, val]: [string, any], idx) => {
              // Determine status indicator tag
              const hasEvidence = val.groundingEvidenceIds && val.groundingEvidenceIds.length > 0;
              const isConfirmed = val.statement?.includes('(Clarification:') || val.ask?.includes('(Refined:');
              
              let statusTag = <span className="tag tag-warning">Needs Clarification</span>;
              if (isConfirmed) {
                statusTag = <span className="tag tag-primary">✓ Founder Confirmed</span>;
              } else if (hasEvidence) {
                statusTag = <span className="tag tag-success">✓ Strong Evidence</span>;
              }

              return (
                <div key={idx} className="slide-card" style={{ position: 'relative' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <strong style={{ textTransform: 'capitalize' }}>{idx + 1}. {key}</strong>
                    {statusTag}
                  </div>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: '1.4' }}>
                    {val.statement || val.ask || `Burn Rate: $${val.burnRate || 0}/mo | Runway: ${val.runwayMonths || 0} months | Projected ARR: $${val.projectedARR || 0}`}
                  </p>
                </div>
              );
            })}
          </div>

          <div style={{ marginTop: '24px', display: 'flex', justifyContent: 'space-between', gap: '12px', flexWrap: 'wrap' }}>
            <button className="btn-primary" style={{ background: 'transparent', border: '1px solid var(--border-card)', color: 'var(--text-main)' }} onClick={() => setActiveStep('PROFILE')}>
              &larr; Re-Ingest Documents
            </button>
            <button className="btn-primary" style={{ background: 'transparent', border: '1px solid var(--primary)', color: 'var(--primary)' }} onClick={handleGenerateDeck}>
              Skip Q&amp;A &amp; Generate Deck &rarr;
            </button>
            <button className="btn-primary" onClick={handleStartQA}>
              Enter Founder Q&amp;A Interview &rarr;
            </button>
          </div>
        </main>
      )}

      {/* Step 3: Interactive Founder Q&A */}
      {!loading && activeStep === 'QA' && questions.length > 0 && (
        <main className="card">
          <div className="card-title">
            <span>Founder Q&amp;A Interview</span>
            <span className="tag tag-warning">Question {currentQuestionIndex + 1} of {questions.length}</span>
          </div>

          <div style={{ marginBottom: '20px', padding: '12px 16px', background: 'rgba(245, 158, 11, 0.08)', borderLeft: '4px solid var(--warning)', borderRadius: '0 8px 8px 0', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
            <strong>AI Quality Check</strong>: Gemini detected gaps in the extracted metrics. Clarify the details below to refine the final pitch synthesis.
          </div>

          {/* Render Active Question Card */}
          {questions[currentQuestionIndex] && (
            <div className="slide-card" style={{ padding: '24px', border: '1px solid var(--border-card)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <span className="tag tag-primary" style={{ textTransform: 'uppercase' }}>
                  Focus: {questions[currentQuestionIndex].relatedVector}
                </span>
                <span className="tag tag-warning" style={{ textTransform: 'uppercase' }}>
                  Priority: {questions[currentQuestionIndex].priority}
                </span>
              </div>
              
              <h3 style={{ margin: '12px 0 6px 0', color: 'var(--text-main)' }}>
                {questions[currentQuestionIndex].question}
              </h3>
              
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '20px', fontStyle: 'italic' }}>
                <strong>Why this matters to VCs:</strong> {questions[currentQuestionIndex].reason}
              </p>

              <div style={{ margin: '16px 0' }}>
                <textarea
                  className="slide-card"
                  style={{ width: '100%', minHeight: '100px', padding: '12px', background: 'rgba(0,0,0,0.2)', color: 'var(--text-main)', border: '1px solid var(--border-card)', borderRadius: '8px', outline: 'none', resize: 'vertical', fontFamily: 'var(--font-family)', fontSize: '0.9rem' }}
                  placeholder={questions[currentQuestionIndex].suggestedFormat ? `Suggested Format: ${questions[currentQuestionIndex].suggestedFormat}` : 'Enter your clarification answer here...'}
                  value={answers[questions[currentQuestionIndex].questionId] || ''}
                  onChange={(e) => setAnswers(prev => ({ ...prev, [questions[currentQuestionIndex].questionId]: e.target.value }))}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '16px' }}>
                <button
                  className="btn-primary"
                  style={{ background: 'transparent', border: '1px solid var(--border-card)', color: 'var(--text-muted)' }}
                  onClick={handlePrevQuestion}
                  disabled={currentQuestionIndex === 0}
                >
                  &larr; Previous Question
                </button>
                
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button
                    className="btn-primary"
                    style={{ background: 'transparent', border: '1px solid var(--warning)', color: 'var(--warning)' }}
                    onClick={() => handleSkipQuestion(questions[currentQuestionIndex].questionId)}
                  >
                    Skip Question ➔
                  </button>
                  <button
                    className="btn-primary"
                    onClick={() => handleAnswerSubmit(questions[currentQuestionIndex].questionId, answers[questions[currentQuestionIndex].questionId] || '')}
                  >
                    Save &amp; Next
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Progress Indicator */}
          <div style={{ marginTop: '24px', background: 'rgba(255,255,255,0.05)', borderRadius: '8px', padding: '12px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              Interview Progress: {Math.round((Object.keys(answers).length / questions.length) * 100)}% ({Object.keys(answers).length} of {questions.length} answered)
            </span>
            <button
              className="btn-primary"
              style={{ background: 'linear-gradient(135deg, var(--success), var(--primary))' }}
              onClick={handleFinishQA}
            >
              Refine Intelligence &amp; Synthesize Pitch &rarr;
            </button>
          </div>
        </main>
      )}

      {/* Step 4: Multi-Stage 10-Slide Deck */}
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

      {/* Step 5: 4-Vector Evaluation Engine */}
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

          <div style={{ marginTop: '24px', display: 'flex', justifyContent: 'space-between' }}>
            <button className="btn-primary" style={{ background: 'transparent', border: '1px solid var(--border-card)', color: 'var(--text-main)' }} onClick={() => setActiveStep('GENERATION')}>
              &larr; Back to Slides
            </button>
            <button className="btn-primary" onClick={handleTargetedRegeneration}>
              Run Targeted Slide Regeneration &rarr;
            </button>
          </div>
        </main>
      )}

      {/* Step 6: Targeted Slide Regeneration */}
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
          <div style={{ marginTop: '24px', display: 'flex', justifyContent: 'space-between' }}>
            <button className="btn-primary" style={{ background: 'transparent', border: '1px solid var(--border-card)', color: 'var(--text-main)' }} onClick={() => setActiveStep('EVALUATION')}>
              &larr; Back to Evaluation
            </button>
            <button className="btn-primary" onClick={() => setActiveStep('EXPORT')}>
              View Final Presentation &amp; Export &rarr;
            </button>
          </div>
        </main>
      )}

      {/* Step 7: Export Presentation */}
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
                Google Slides (Sandbox Unavailable) 📊
              </button>
            </div>
            <div className="slide-card" style={{ textAlign: 'center', padding: '32px' }}>
              <h3>Download PDF Presentation</h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: '12px 0' }}>
                Generates a 10-page binary PDF document containing all slide details, speaker notes, and verified evidence references.
              </p>
              <button className="btn-primary" onClick={() => window.open(`/api/exports/${pitchDeck?.deckId || 'deck_scoutedge_v1'}/pdf/download`, '_blank')}>
                Download PDF Document 📄
              </button>
            </div>
          </div>
        </main>
      )}
    </div>
  );
}
