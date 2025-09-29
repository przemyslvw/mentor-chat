import { onCall } from 'firebase-functions/v2/https';
import { generateEmbedding } from './index';
import { batchGenerateEmbeddings, findSimilarDocuments } from './embeddingService';

// Eksport wszystkich funkcji
export { generateEmbedding };

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
