/**
 * SessionStore — Shared in-memory state for pipeline stage continuity
 * 
 * Ensures intelligence → generation → evaluation → regeneration
 * pass data between stages rather than each route independently
 * constructing mock profiles.
 * 
 * In production, this would be backed by Firestore with TTL.
 */

import { StartupEntity, PitchDeck, EvaluationResult, StartupProfile, StartupEvidence, Question, FounderAnswer } from '@fundable-ai/core-types';

interface SessionData {
  startupProfile?: StartupProfile;
  documents?: StartupEvidence[];
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
      this.sessions.set(startupId, {
        documents: [],
        answers: []
      });
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

  addDocument(startupId: string, doc: StartupEvidence): void {
    const session = this.getSession(startupId);
    if (!session.documents) session.documents = [];
    session.documents.push(doc);
    console.log(`[SessionStore] Document added for ${startupId}: ${doc.fileName}`);
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

// Singleton instance shared across all routes
export const sessionStore = new PipelineSessionStore();

