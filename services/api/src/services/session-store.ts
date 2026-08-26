/**
 * SessionStore — Shared in-memory state for pipeline stage continuity
 * 
 * Ensures intelligence → generation → evaluation → regeneration
 * pass data between stages rather than each route independently
 * constructing mock profiles.
 * 
 * In production, this would be backed by Firestore with TTL.
 */

import { StartupEntity, PitchDeck, EvaluationResult } from '@fundable-ai/core-types';

interface SessionData {
  intelligence?: StartupEntity;
  deck?: PitchDeck;
  evaluation?: EvaluationResult;
}

class PipelineSessionStore {
  private sessions = new Map<string, SessionData>();

  getSession(startupId: string): SessionData {
    if (!this.sessions.has(startupId)) {
      this.sessions.set(startupId, {});
    }
    return this.sessions.get(startupId)!;
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
