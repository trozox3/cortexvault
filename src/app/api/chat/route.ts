import { NextRequest, NextResponse } from 'next/server';
import { readDB, Chunk } from '@/lib/server/db';
import { cosineSimilarity, generateAnswer, getEmbedding, getAI } from '@/lib/server/rag';

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

    // Calculate similarities and composite scores
    const scoredChunks = chunks.map(chunk => {
      const cosine = cosineSimilarity(queryEmbedding, chunk.embedding!);
      
      // Calculate recency (decay based on category)
      const uploadTime = chunk.uploadDate ? new Date(chunk.uploadDate).getTime() : Date.now();
      const daysOld = Math.max(0, (Date.now() - uploadTime) / (1000 * 3600 * 24));
      const decayRate = chunk.decayRate || 0.01;
      const recency = Math.exp(-decayRate * daysOld);

      // Calculate authority
      const rank = chunk.authorityRank || 2;
      const authScore = rank === 1 ? 1.0 : rank === 2 ? 0.7 : 0.4;

      // Composite Score formula (50% similarity, 30% authority, 20% recency)
      const compositeScore = (cosine * 0.5) + (authScore * 0.3) + (recency * 0.2);

      return {
        ...chunk,
        cosine,
        recency,
        authScore,
        compositeScore
      };
    });

    // Sort by composite score descending and take top 5
    scoredChunks.sort((a, b) => b.compositeScore - a.compositeScore);
    const topChunks = scoredChunks.slice(0, 5);

    if (topChunks.length === 0 || topChunks[0].cosine < 0.2) {
      return NextResponse.json({
        answer: "I couldn't find relevant information in the uploaded documents to answer your question.",
        citations: [],
        confidenceScore: 0,
        isExternalContextUsed: false,
        trace: { retrieved: 0 }
      });
    }

    let conflictDetected = false;
    let conflictGap = 0;
    let resolution = 'none';
    let answerText = '';
    let modifiedQuery = query;

    // Detect Conflicts between top 2 chunks
    if (topChunks.length >= 2) {
      try {
        const ai = getAI();
        const conflictPrompt = `Analyze these two document excerpts. Do they contain fundamentally conflicting information regarding this query: "${query}"?
Excerpt 1 (${topChunks[0].docTitle}): "${topChunks[0].content}"
Excerpt 2 (${topChunks[1].docTitle}): "${topChunks[1].content}"
Respond strictly with JSON: { "conflict": true/false, "description": "brief explanation" }`;

        const conflictRes = await ai.models.generateContent({
          model: 'gemini-3.6-flash',
          contents: conflictPrompt,
          config: { responseMimeType: "application/json" }
        });
        
        const conflictData = JSON.parse(conflictRes.text || '{"conflict":false}');
        
        if (conflictData.conflict) {
          conflictDetected = true;
          conflictGap = topChunks[0].compositeScore - topChunks[1].compositeScore;
          
          if (conflictGap > 0.25) {
            resolution = 'auto-resolved';
            modifiedQuery = query + `\n\nSystem Note: Two documents conflict. Rely strictly on "${topChunks[0].docTitle}" as it has a higher authoritative ranking. Ignore contradictory info from "${topChunks[1].docTitle}".`;
          } else {
            resolution = 'clarify';
            answerText = `I found conflicting information in the documents regarding your query.\n\n` +
              `* **${topChunks[0].docTitle}** (Auth Rank: ${topChunks[0].authorityRank})\n` +
              `* **${topChunks[1].docTitle}** (Auth Rank: ${topChunks[1].authorityRank})\n\n` +
              `**Conflict Details:** ${conflictData.description}\n\n` +
              `Because these documents have similar composite scores (gap: ${conflictGap.toFixed(3)}), I cannot auto-resolve this safely. Could you clarify which policy context you want me to follow?`;
          }
        }
      } catch (e) {
        console.error('Conflict Check Error', e);
      }
    }

    // Generate answer if not asking for clarification
    if (!answerText) {
      const context = topChunks.map(c => ({
        content: c.content,
        docTitle: c.docTitle,
        page: c.page
      }));
      answerText = await generateAnswer(modifiedQuery, context);
    }

    // Format trace and citations
    const trace = {
      chunksRetrieved: topChunks.length,
      scoring: topChunks.map(c => ({
        id: c.id,
        docTitle: c.docTitle,
        cosine: c.cosine,
        composite: c.compositeScore,
        auth: c.authScore,
        recency: c.recency
      })),
      conflictDetected,
      conflictGap,
      resolution
    };

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
      confidenceScore: topChunks[0].compositeScore,
      isExternalContextUsed: false,
      trace
    });

  } catch (error: any) {
    console.error('Chat Error:', error);
    return NextResponse.json({ error: error.message || 'Failed to process chat' }, { status: 500 });
  }
}
