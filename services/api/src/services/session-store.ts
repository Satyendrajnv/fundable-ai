import { StartupEntity, PitchDeck, EvaluationResult, StartupProfile, StartupEvidence, Question, FounderAnswer } from '@fundable-ai/core-types';

interface SessionData {
  startupProfile?: StartupProfile;
  documents?: StartupEvidence[];
  documentContents?: Record<string, string>; // mapping evidenceId -> text content
  intelligence?: StartupEntity;
  questions?: Question[];
  answers?: FounderAnswer[];
  deck?: PitchDeck;
  evaluation?: EvaluationResult;
}

class PipelineSessionStore {
  private sessions = new Map<string, SessionData>();

  getSession(startupId: string): SessionData {
    if (!this.sessions.has(startupId)) {
      const isScoutEdge = startupId === 'scoutedge-001';
      
      const session: SessionData = {
        documents: isScoutEdge ? [
          {
            evidenceId: 'doc_scoutedge_deck_01',
            startupId: 'scoutedge-001',
            fileName: 'ScoutEdge_Pitch_Deck_Draft.pdf',
            fileType: 'pdf' as const,
            gcsPath: 'gs://fundable-ai-documents-qwiklabs/scoutedge-001/ScoutEdge_Pitch_Deck_Draft.pdf',
            fileSizeBytes: 2450000,
            uploadedAt: new Date().toISOString(),
            processedStatus: 'COMPLETED' as const,
            extractedSnippetsCount: 14
          },
          {
            evidenceId: 'doc_scoutedge_fin_02',
            startupId: 'scoutedge-001',
            fileName: 'ScoutEdge_Financials.xlsx',
            fileType: 'xlsx' as const,
            gcsPath: 'gs://fundable-ai-documents-qwiklabs/scoutedge-001/ScoutEdge_Financials.xlsx',
            fileSizeBytes: 540000,
            uploadedAt: new Date().toISOString(),
            processedStatus: 'COMPLETED' as const,
            extractedSnippetsCount: 8
          }
        ] : [],
        documentContents: isScoutEdge ? {
          'doc_scoutedge_deck_01': `Startup Name: ScoutEdge
Tagline: Autonomous AI Pitch Intelligence & VC Scouting Platform
Problem: Early-stage VCs receive thousands of unstructured pitch decks and financials. Manual screening takes weeks and leads to missed deals.
Solution: ScoutEdge is an autonomous AI agent system that parses startup materials, extracts 10 business vectors, runs 4-vector evaluations, and alerts VCs of top opportunities.
ICP: Seed to Series A VCs and growth accelerators looking to automate inbound funnel deal sourcing.
Business Model: SaaS subscription for VCs starting at $500/seat/month, plus dynamic enterprise portal fees.
Traction: $12k ARR, 4 active pilot accelerators, 150+ pitch decks parsed in beta.
Financials: Burn rate is $15k/month, runway is 10 months, projected ARR is $250k next year.
Fundraising: Raising $1.5M Pre-Seed, 60% engineering, 20% GTM, 20% operations.`,
          'doc_scoutedge_fin_02': `ScoutEdge Financials:
Current ARR: $12,000
Monthly Burn Rate: $15,000
Runway remaining: 10 months
Projected ARR next year: $250,000
Target Raise: $1,500,000 USD
Allocation of Funds: 60% Engineering, 20% GTM Sales, 20% Operations.`
        } : {},
        answers: []
      };

      if (isScoutEdge) {
        session.startupProfile = {
          startupId: 'scoutedge-001',
          name: 'ScoutEdge',
          tagline: 'Autonomous AI Pitch Intelligence & VC Scouting',
          founderId: 'founder_demo',
          stage: 'Pre-Seed',
          targetRaise: 1500000,
          currency: 'USD',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
      }

      this.sessions.set(startupId, session);
    }
    return this.sessions.get(startupId)!;
  }

  setStartupProfile(startupId: string, profile: StartupProfile): void {
    const session = this.getSession(startupId);
    session.startupProfile = profile;
    console.log(`[SessionStore] Profile stored for ${startupId}`);
  }

  getStartupProfile(startupId: string): StartupProfile | undefined {
    return this.getSession(startupId).startupProfile;
  }

  addDocument(startupId: string, doc: StartupEvidence, content?: string): void {
    const session = this.getSession(startupId);
    if (!session.documents) session.documents = [];
    session.documents.push(doc);
    if (content) {
      if (!session.documentContents) session.documentContents = {};
      session.documentContents[doc.evidenceId] = content;
    }
    console.log(`[SessionStore] Document added for ${startupId}: ${doc.fileName} (${content ? content.length : 0} chars cached)`);
  }

  getDocumentContent(startupId: string, evidenceId: string): string | undefined {
    return this.getSession(startupId).documentContents?.[evidenceId];
  }

  getDocuments(startupId: string): StartupEvidence[] {
    return this.getSession(startupId).documents || [];
  }

  setQuestions(startupId: string, questions: Question[]): void {
    const session = this.getSession(startupId);
    session.questions = questions;
    console.log(`[SessionStore] ${questions.length} questions stored for ${startupId}`);
  }

  getQuestions(startupId: string): Question[] | undefined {
    return this.getSession(startupId).questions;
  }

  setAnswers(startupId: string, answers: FounderAnswer[]): void {
    const session = this.getSession(startupId);
    session.answers = answers;
    console.log(`[SessionStore] ${answers.length} answers stored for ${startupId}`);
  }

  getAnswers(startupId: string): FounderAnswer[] {
    return this.getSession(startupId).answers || [];
  }

  setIntelligence(startupId: string, intelligence: StartupEntity): void {
    const session = this.getSession(startupId);
    session.intelligence = intelligence;
    console.log(`[SessionStore] Intelligence stored for ${startupId} (${intelligence.intelligenceId})`);
  }

  setDeck(startupId: string, deck: PitchDeck): void {
    const session = this.getSession(startupId);
    session.deck = deck;
    console.log(`[SessionStore] Deck stored for ${startupId} (${deck.deckId}, v${deck.version})`);
  }

  setEvaluation(startupId: string, evaluation: EvaluationResult): void {
    const session = this.getSession(startupId);
    session.evaluation = evaluation;
    console.log(`[SessionStore] Evaluation stored for ${startupId} (${evaluation.overallScore}/100)`);
  }

  getIntelligence(startupId: string): StartupEntity | undefined {
    return this.getSession(startupId).intelligence;
  }

  getDeck(startupId: string): PitchDeck | undefined {
    return this.getSession(startupId).deck;
  }

  getDeckByDeckId(deckId: string): PitchDeck | undefined {
    for (const session of this.sessions.values()) {
      if (session.deck?.deckId === deckId) {
        return session.deck;
      }
    }
    return undefined;
  }

  getStartupIdByDeckId(deckId: string): string | undefined {
    for (const [startupId, session] of this.sessions.entries()) {
      if (session.deck?.deckId === deckId) {
        return startupId;
      }
    }
    return undefined;
  }

  getEvaluation(startupId: string): EvaluationResult | undefined {
    return this.getSession(startupId).evaluation;
  }
}

export const sessionStore = new PipelineSessionStore();
