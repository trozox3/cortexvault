import { NextRequest, NextResponse } from 'next/server';
import { readDB } from '@/lib/server/db';
import { getAI } from '@/lib/server/rag';

export async function POST(req: NextRequest) {
  try {
    const { doc1Id, doc2Id } = await req.json();

    if (!doc1Id || !doc2Id) {
      return NextResponse.json({ error: 'Two document IDs are required' }, { status: 400 });
    }

    const db = readDB();
    
    // Get chunks for doc1
    const doc1Chunks = db.chunks.filter(c => c.docId === doc1Id).slice(0, 15).map(c => c.content).join('\n');
    const doc1Title = db.documents.find(d => d.id === doc1Id)?.title || 'Document 1';
    
    // Get chunks for doc2
    const doc2Chunks = db.chunks.filter(c => c.docId === doc2Id).slice(0, 15).map(c => c.content).join('\n');
    const doc2Title = db.documents.find(d => d.id === doc2Id)?.title || 'Document 2';

    if (!doc1Chunks || !doc2Chunks) {
       return NextResponse.json({ error: 'Could not find sufficient content for comparison' }, { status: 400 });
    }

    const prompt = `You are a legal and compliance AI assistant. Compare the following two documents and identify any conflicting policies, differing obligations, or key differences.
Format your output as a strict JSON object with this schema:
{
  "summary": "Overall summary of the comparison.",
  "conflicts": [
    {
      "topic": "What the conflict is about (e.g. Data Retention)",
      "doc1Excerpt": "Summary of what Doc 1 says",
      "doc2Excerpt": "Summary of what Doc 2 says",
      "severity": "High", "Medium", or "Low"
    }
  ]
}

Document 1 (${doc1Title}):
${doc1Chunks}

Document 2 (${doc2Title}):
${doc2Chunks}
`;

    const ai = getAI();
    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      }
    });

    const comparisonText = response.text || "{}";
    const comparison = JSON.parse(comparisonText);

    return NextResponse.json(comparison);
  } catch (error: any) {
    console.error('Compare Error:', error);
    return NextResponse.json({ error: error.message || 'Failed to compare documents' }, { status: 500 });
  }
}
