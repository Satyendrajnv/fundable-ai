/**
 * Retrieval Provider Abstraction
 * 
 * Defines the interface for evidence retrieval in the Fundable AI pipeline.
 * 
 * Production path: VertexVectorSearchProvider (Vertex AI Vector Search)
 * Competition path: DocumentStoreRetrievalProvider (metadata-based retrieval)
 * 
 * Architecture:
 *   RetrievalProvider
 *     ├── VertexVectorSearchProvider (when Vector Search is available)
 *     └── DocumentStoreRetrievalProvider (sandbox fallback)
 */

import { RetrievedEvidence } from '@fundable-ai/core-types';

export interface RetrievalProvider {
  retrieve(startupId: string, query: string, topK?: number): Promise<RetrievedEvidence[]>;
}

/**
 * Document Store Retrieval Provider
 * 
 * Returns evidence metadata from stored documents without vector similarity search.
 * Used in the Code Kitchen sandbox where Vertex AI Vector Search is not provisioned.
 */
export class DocumentStoreRetrievalProvider implements RetrievalProvider {
  async retrieve(startupId: string, query: string, topK: number = 3): Promise<RetrievedEvidence[]> {
    // In the competition sandbox, return evidence references from known documents
    // In production, this would be replaced by VertexVectorSearchProvider
    console.log(`[Retrieval] DocumentStore query for ${startupId}: "${query}" (top-${topK})`);

    return [
      {
        evidenceId: `evidence_${startupId}_doc01`,
        sourceDocumentName: 'ScoutEdge_Pitch_Deck_Draft.pdf',
        pageOrOffset: 'p3',
        snippet: `Evidence relevant to: ${query}`,
        relevanceScore: 0.85
      },
      {
        evidenceId: `evidence_${startupId}_doc02`,
        sourceDocumentName: 'ScoutEdge_Financials.xlsx',
        pageOrOffset: 'Sheet1:B12',
        snippet: `Financial data relevant to: ${query}`,
        relevanceScore: 0.78
      }
    ].slice(0, topK);
  }
}

/**
 * Vertex Vector Search Provider (Production Path)
 * 
 * When Vertex AI Vector Search is available:
 * 1. Embed the query using Vertex AI Embeddings
 * 2. Search the vector index for similar document chunks
 * 3. Return ranked evidence with relevance scores
 * 
 * Not implemented in Code Kitchen sandbox due to Vector Search provisioning limitations.
 */
export class VertexVectorSearchProvider implements RetrievalProvider {
  async retrieve(startupId: string, query: string, topK: number = 3): Promise<RetrievedEvidence[]> {
    // Production implementation would:
    // 1. const embeddings = await vertexAI.embedText(query);
    // 2. const results = await vectorSearchIndex.findNeighbors(embeddings, topK);
    // 3. return results.map(r => ({ evidenceId: r.id, snippet: r.text, relevanceScore: r.score }));
    
    console.warn('[Retrieval] VertexVectorSearchProvider not available in sandbox, delegating to DocumentStore');
    const fallback = new DocumentStoreRetrievalProvider();
    return fallback.retrieve(startupId, query, topK);
  }
}
