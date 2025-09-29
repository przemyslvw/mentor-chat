import * as admin from "firebase-admin";
import * as logger from "firebase-functions/logger";
import { setGlobalOptions } from "firebase-functions/v2";
import { onCall } from "firebase-functions/v2/https";
import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize Firebase Admin
admin.initializeApp();

// Initialize Google Gemini
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY || "");

// Set global options
setGlobalOptions({ maxInstances: 10 });

interface EmbeddingRequest {
  text: string;
  provider?: "gemini";
}

/**
 * Generate a single embedding
 */
export const generateEmbedding = onCall(async (request) => {
  // Check if the request is authenticated
  if (!request.auth) {
    throw new Error("Authentication required");
  }

  const { text } = request.data as EmbeddingRequest;

  // Input validation
  if (!text || typeof text !== "string") {
    throw new Error("Text is required and must be a string");
  }

  try {
    // Generate embedding using Gemini
    const model = genAI.getGenerativeModel({ model: "embedding-001" });
    const result = await model.embedContent(text);
    const embedding = result.embedding.values;

    return { embedding };
  } catch (error) {
    logger.error("Error generating embedding:", error);
    throw new Error("Failed to generate embedding");
  }
});

// Eksport funkcji z embeddingService
export { batchGenerateEmbeddingsCF, findSimilarDocumentsCF } from "./embeddingService";
