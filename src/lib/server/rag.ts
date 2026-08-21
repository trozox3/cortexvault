import { GoogleGenAI } from '@google/genai';

let aiInstance: GoogleGenAI | null = null;
function getAI() {
  if (!aiInstance) {
    aiInstance = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || 'dummy_key_for_build' });
  }
  return aiInstance;
}

/**
 * Split text into overlapping chunks
 */
export function chunkText(text: string, chunkSize = 1000, overlap = 200): string[] {
  const chunks: string[] = [];
  let i = 0;
  while (i < text.length) {
    chunks.push(text.slice(i, i + chunkSize));
    i += chunkSize - overlap;
  }
  return chunks;
}

/**
 * Get embedding vector from Gemini
 */
export async function getEmbedding(text: string): Promise<number[]> {
  const ai = getAI();
  const response = await ai.models.embedContent({
    model: 'text-embedding-004',
    contents: text,
  });
  
  if (!response.embeddings || response.embeddings.length === 0 || !response.embeddings[0].values) {
    throw new Error('Failed to generate embedding');
  }
  
  return response.embeddings[0].values;
}

/**
 * Calculate cosine similarity between two vectors
 */
export function cosineSimilarity(vecA: number[], vecB: number[]): number {
  let dotProduct = 0;
  let normA = 0;
  let normB = 0;
  for (let i = 0; i < vecA.length; i++) {
    dotProduct += vecA[i] * vecB[i];
    normA += vecA[i] * vecA[i];
    normB += vecB[i] * vecB[i];
  }
  if (normA === 0 || normB === 0) return 0;
  return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
}

/**
 * Generate an answer using retrieved chunks as context
 */
export async function generateAnswer(query: string, contextChunks: { content: string, docTitle: string, page: number }[]) {
  const contextStr = contextChunks.map((c, i) => `[Source ${i + 1}] (${c.docTitle}, Page ${c.page}):\n${c.content}\n`).join('\n');
  
  const prompt = `You are CortexVault, an enterprise document intelligence copilot.
Answer the user's question based ONLY on the provided context.
If the context does not contain the answer, state that you cannot answer based on the provided documents.
If there are conflicting statements in the documents, point out the conflict.

Context:
${contextStr}

Question:
${query}

Answer:`;

  const ai = getAI();
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: prompt,
  });

  return response.text;
}
