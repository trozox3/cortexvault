import { NextRequest, NextResponse } from 'next/server';
import { readDB } from '@/lib/server/db';
import { getAI } from '@/lib/server/rag';

export async function POST(req: NextRequest) {
  try {
    const db = readDB();
    
    if (db.documents.length < 2) {
       return NextResponse.json({ conflicts: [] });
    }

    // Take a small sample of chunks from the first two documents to avoid token limits
    const doc1 = db.documents[0];
    const doc2 = db.documents[1];
    const chunks1 = db.chunks.filter(c => c.docId === doc1.id).slice(0, 10).map(c => c.content).join('\n');
    const chunks2 = db.chunks.filter(c => c.docId === doc2.id).slice(0, 10).map(c => c.content).join('\n');

    const prompt = `You are a compliance AI. Analyze the following two documents and identify any conflicting policies.
Format as strict JSON:
{
  "conflicts": [
    {
      "id": "1",
      "description": "Short title of conflict",
      "severity": "High" or "Medium",
      "affectedDocuments": ["${doc1.title}", "${doc2.title}"],
      "excerpt1": "Quote or summary from doc1",
      "excerpt2": "Quote or summary from doc2",
      "suggestedResolution": "How to resolve this."
    }
  ]
}

Doc 1: ${chunks1}
Doc 2: ${chunks2}
`;

    const ai = getAI();
    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      }
    });

    const resultText = response.text || '{"conflicts": []}';
    return NextResponse.json(JSON.parse(resultText));
  } catch (error: any) {
    console.error('Conflicts Error:', error);
    return NextResponse.json({ error: error.message || 'Failed to generate conflicts' }, { status: 500 });
  }
}
