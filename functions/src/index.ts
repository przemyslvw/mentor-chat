import { GoogleGenerativeAI } from '@google/generative-ai';
import * as admin from 'firebase-admin';
import * as logger from 'firebase-functions/logger';
import { setGlobalOptions } from 'firebase-functions/v2';
import { onCall } from 'firebase-functions/v2/https';

// Initialize Firebase Admin
admin.initializeApp();

// Initialize Google Gemini
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY || '');

// Start writing functions
// https://firebase.google.com/docs/functions/typescript

// For cost control, you can set the maximum number of containers that can be
// running at the same time. This helps mitigate the impact of unexpected
// traffic spikes by instead downgrading performance. This limit is a
// per-function limit. You can override the limit for each function using the
// `maxInstances` option in the function's options, e.g.
// `onRequest({ maxInstances: 5 }, (req, res) => { ... })`.
// NOTE: setGlobalOptions does not apply to functions using the v1 API. V1
// functions should each use functions.runWith({ maxInstances: 10 }) instead.
// In the v1 API, each function can only serve one request per container, so
// this will be the maximum concurrent request count.
setGlobalOptions({ maxInstances: 10 });

interface EmbeddingRequest {
  text: string;
  provider?: 'gemini' | 'perplexity';
}

/**
 * Generate embeddings for a given text using the specified provider
 *
 * @param {EmbeddingRequest} request - The request object containing text and provider
 * @returns {Promise<{embedding: number[]}>} - The embedding vector
 * @throws {Error} If the text is empty, too long, or an error occurs
 */
export const generateEmbedding = onCall(async (request): Promise<{ embedding: number[] }> => {
  // Check if the request is authenticated
  if (!request.auth) {
    throw new Error('Authentication required');
  }

  const { text, provider = 'gemini' } = request.data as EmbeddingRequest;

  // Input validation
  if (!text || typeof text !== 'string') {
    throw new Error('Text is required and must be a string');
  }

  // Different providers have different max lengths
  const maxLength = provider === 'gemini' ? 30720 : 0; // Gemini: 30,720 chars, Perplexity: Not applicable (no embedding support)
  if (text.length > maxLength) {
    throw new Error(`Text is too long. Maximum length is ${maxLength} characters`);
  }

  try {
    let embedding: number[];
    let modelUsed: string;

    if (provider === 'gemini') {
      // Generate embedding using Google Gemini
      const model = genAI.getGenerativeModel({ model: 'gemini-embedding-001' });
      const result = await model.embedContent(text);
      embedding = result.embedding.values;
      modelUsed = 'gemini-embedding-001';
    } else {
      // Perplexity doesn't offer an embedding API
      // We'll use a placeholder or throw an error
      throw new Error('Perplexity does not support embeddings. Please use Gemini for embeddings.');
    }

    // Log the request for monitoring
    await admin.firestore().collection('embeddingLogs').add({
      userId: request.auth.uid,
      timestamp: admin.firestore.FieldValue.serverTimestamp(),
      textLength: text.length,
      model: modelUsed,
      provider,
      charactersProcessed: text.length,
    });

    return { embedding };
  } catch (error) {
    logger.error(`Error generating embedding with ${provider}:`, error);
    throw new Error(
      `Failed to generate embedding: ${error instanceof Error ? error.message : 'Unknown error'}`,
    );
  }
});

/**
 * Get information about available embedding models
 */
export const getEmbeddingModels = onCall(async () => {
  return {
    models: [
      {
        id: 'gemini',
        name: 'Google Gemini',
        model: 'gemini-embedding-001', // Poprawny model (bez 'models/')
        maxLength: 2048, // Maksymalna długość w tokenach
        dimensions: 768, // Lub 1536/3072 - zależy od konfiguracji
      },
      {
        id: 'perplexity-chat',
        name: 'Perplexity Chat',
        model: 'sonar-medium-online',
        maxLength: 127072,
        type: 'chat', // Nie embedding
      },
    ],
  };
});
