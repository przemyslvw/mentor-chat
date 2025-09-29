import * as admin from 'firebase-admin';
import * as logger from 'firebase-functions/logger';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize Google Gemini
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY || '');

interface BatchEmbeddingRequest {
  texts: string[];
  collection: string;
  fieldToEmbed: string;
  fieldToStore: string;
}

interface SimilaritySearchRequest {
  query: string;
  collection: string;
  fieldToSearch: string;
  limit?: number;
}

/**
 * Generate and store embeddings in batch for a collection
 */
export const batchGenerateEmbeddings = async (request: BatchEmbeddingRequest) => {
  const { texts, collection, fieldToEmbed, fieldToStore } = request;

  if (!texts || !collection || !fieldToEmbed || !fieldToStore) {
    throw new Error('Missing required parameters');
  }

  const db = admin.firestore();
  const batch = db.batch();
  const batchSize = 100; // Firestore batch limit
  let batchCount = 0;
  const results = [];

  for (const text of texts) {
    try {
      // Generate embedding using Gemini
      const model = genAI.getGenerativeModel({ model: 'embedding-001' });
      const result = await model.embedContent(text);
      const embedding = result.embedding.values;

      // Create or update document with embedding
      const docRef = db.collection(collection).doc();
      batch.set(docRef, {
        [fieldToEmbed]: text,
        [fieldToStore]: embedding,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
      });

      results.push({ text, success: true });
      batchCount++;

      // Commit batch if we reach batch size
      if (batchCount >= batchSize) {
        await batch.commit();
        batchCount = 0;
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      logger.error(`Error processing text:`, errorMessage);
      results.push({ text, success: false, error: errorMessage });
    }
  }

  // Commit any remaining documents
  if (batchCount > 0) {
    await batch.commit();
  }

  return { success: true, processed: texts.length, results };
};

/**
 * Find similar documents using cosine similarity
 */
export const findSimilarDocuments = async (request: SimilaritySearchRequest) => {
  const { query, collection, fieldToSearch, limit = 5 } = request;

  if (!query || !collection || !fieldToSearch) {
    throw new Error('Missing required parameters');
  }

  // Generate embedding for the query
  const model = genAI.getGenerativeModel({ model: 'embedding-001' });
  const result = await model.embedContent(query);
  const queryEmbedding = result.embedding.values;

  // Get all documents from the collection
  const snapshot = await admin.firestore().collection(collection).get();

  // Calculate cosine similarity for each document
  const similarities = [];

  for (const doc of snapshot.docs) {
    const docData = doc.data();
    if (docData.embedding) {
      const similarity = cosineSimilarity(queryEmbedding, docData.embedding);
      similarities.push({
        id: doc.id,
        score: similarity,
        ...docData,
      });
    }
  }

  // Sort by similarity score (descending) and limit results
  return similarities.sort((a, b) => b.score - a.score).slice(0, limit);
};

// Helper function to calculate cosine similarity
function cosineSimilarity(vecA: number[], vecB: number[]): number {
  if (vecA.length !== vecB.length) return 0;

  let dotProduct = 0;
  let normA = 0;
  let normB = 0;

  for (let i = 0; i < vecA.length; i++) {
    dotProduct += vecA[i] * vecB[i];
    normA += vecA[i] * vecA[i];
    normB += vecB[i] * vecB[i];
  }

  normA = Math.sqrt(normA);
  normB = Math.sqrt(normB);

  if (normA === 0 || normB === 0) return 0;

  return dotProduct / (normA * normB);
}

// Cloud Functions wrappers
import { onCall } from 'firebase-functions/v2/https';

export const batchGenerateEmbeddingsCF = onCall(
  { enforceAppCheck: true, maxInstances: 1 },
  async request => {
    if (!request.auth) {
      throw new Error('Authentication required');
    }
    return batchGenerateEmbeddings(request.data);
  },
);

export const findSimilarDocumentsCF = onCall({ enforceAppCheck: true }, async request => {
  if (!request.auth) {
    throw new Error('Authentication required');
  }
  return findSimilarDocuments(request.data);
});
