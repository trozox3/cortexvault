import { NextRequest, NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import { addChunks, addDocument, Chunk, Document, getAllDocuments } from '@/lib/server/db';
import { chunkText, getEmbedding } from '@/lib/server/rag';

export async function GET() {
  try {
    const docs = getAllDocuments();
    return NextResponse.json({ documents: docs });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const pdfParse = require('pdf-parse');
    const formData = await req.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Parse PDF
    const pdfData = await pdfParse(buffer);
    const text = pdfData.text;

    const docId = uuidv4();
    const doc: Document = {
      id: docId,
      title: file.name,
      type: 'PDF',
      uploadDate: new Date().toISOString().split('T')[0],
      status: 'Indexed',
      tags: ['Uploaded'],
      excerpt: text.slice(0, 150).replace(/\n/g, ' ') + '...',
    };

    // Save document metadata
    addDocument(doc);

    // Chunking and embedding
    const rawChunks = chunkText(text, 1000, 200);
    const dbChunks: Chunk[] = [];

    // Process chunks (in sequence to avoid rate limits, or batch if supported)
    for (let i = 0; i < rawChunks.length; i++) {
      const content = rawChunks[i];
      try {
        const embedding = await getEmbedding(content);
        dbChunks.push({
          id: uuidv4(),
          docId,
          docTitle: doc.title,
          page: i + 1, // approximate
          content,
          embedding,
        });
      } catch (embErr) {
        console.error('Embedding failed for chunk', i, embErr);
        // Continue with other chunks even if one fails
      }
    }

    addChunks(dbChunks);

    return NextResponse.json({ success: true, document: doc });
  } catch (error: any) {
    console.error('Upload Error:', error);
    return NextResponse.json({ error: error.message || 'Upload failed' }, { status: 500 });
  }
}
