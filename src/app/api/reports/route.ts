import { NextRequest, NextResponse } from 'next/server';
import { readDB } from '@/lib/server/db';
import { getAI } from '@/lib/server/rag';

export async function POST(req: NextRequest) {
  try {
    const { topic } = await req.json();

    if (!topic) {
      return NextResponse.json({ error: 'Topic is required' }, { status: 400 });
    }

    const db = readDB();
    if (db.chunks.length === 0) {
      return NextResponse.json({ report: 'No documents indexed in the database to generate a report from.' });
    }

    // Get all chunks (up to 20 for context to avoid token limits)
    const context = db.chunks.slice(0, 20).map(c => `[${c.docTitle}]: ${c.content}`).join('\n\n');

    const prompt = `You are a professional enterprise analyst. Generate a comprehensive business report about: "${topic}".
Use the following context from our internal documents to write the report. Use Markdown formatting (headings, bullet points, bold text).
If the context doesn't contain enough information, state that clearly but write whatever you can based on the context.

Context:
${context}
`;

    const ai = getAI();
    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: prompt,
    });

    return NextResponse.json({ report: response.text });
  } catch (error: any) {
    console.error('Report Error:', error);
    return NextResponse.json({ error: error.message || 'Failed to generate report' }, { status: 500 });
  }
}
