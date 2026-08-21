import { NextRequest, NextResponse } from 'next/server';
import { readDB, Chunk } from '@/lib/server/db';
import { cosineSimilarity, generateAnswer, getEmbedding } from '@/lib/server/rag';

export async function POST(req: NextRequest) {
  try {
    const { query } = await req.json();

    if (!query) {
      return NextResponse.json({ error: 'Query is required' }, { status: 400 });
    }

    // Embed the query
    const queryEmbedding = await getEmbedding(query);

    // Read DB
    const db = readDB();
    const chunks = db.chunks.filter(c => c.embedding && c.embedding.length > 0);

    // Calculate similarities
    const scoredChunks = chunks.map(chunk => ({
      ...chunk,
      score: cosineSimilarity(queryEmbedding, chunk.embedding!)
    }));

    // Sort by score descending and take top 5
    scoredChunks.sort((a, b) => b.score - a.score);
    const topChunks = scoredChunks.slice(0, 5);

    // If no chunks matched well, or db is empty
    if (topChunks.length === 0 || topChunks[0].score < 0.2) {
      return NextResponse.json({
        answer: "I couldn't find relevant information in the uploaded documents to answer your question.",
        citations: [],
        confidenceScore: 0,
        isExternalContextUsed: false
      });
    }

    // Generate answer with context
    const context = topChunks.map(c => ({
      content: c.content,
      docTitle: c.docTitle,
      page: c.page
    }));

    const answerText = await generateAnswer(query, context);

    // Format citations
    const citations = topChunks.map(c => ({
      chunkId: c.id,
      docId: c.docId,
      docTitle: c.docTitle,
      page: c.page,
      text: c.content.slice(0, 150) + '...'
    }));

    return NextResponse.json({
      answer: answerText,
      citations,
      confidenceScore: topChunks[0].score, // Use max similarity as confidence proxy
      isExternalContextUsed: false
    });

  } catch (error: any) {
    console.error('Chat Error:', error);
    return NextResponse.json({ error: error.message || 'Failed to process chat' }, { status: 500 });
  }
}
