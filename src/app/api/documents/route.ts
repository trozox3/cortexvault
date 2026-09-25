import { NextRequest, NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import { addChunks, addDocument, Chunk, Document, getAllDocuments, readDB, writeDB } from '@/lib/server/db';
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
    const pdfParse = require('pdf-parse/lib/pdf-parse.js');
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

    // Demo: Assign authority/category based on filename heuristics
    const lowerName = file.name.toLowerCase();
    let authorityRank = 2; // Default Manager
    let category = "Project Status";
    let decayRate = 0.02;

    if (lowerName.includes('policy') || lowerName.includes('hr') || lowerName.includes('legal')) {
      authorityRank = 1; // HR/Legal
      category = "Official Policy";
      decayRate = 0.005; // Slow decay
    } else if (lowerName.includes('wiki') || lowerName.includes('notes') || lowerName.includes('draft')) {
      authorityRank = 3; // Employee wiki
      category = "Employee Wiki";
      decayRate = 0.05; // Fast decay
    }

    const docId = uuidv4();
    const doc: Document = {
      id: docId,
      title: file.name,
      type: 'PDF',
      uploadDate: new Date().toISOString().split('T')[0],
      status: 'Indexed',
      tags: ['Uploaded'],
      excerpt: text.slice(0, 150).replace(/\n/g, ' ') + '...',
      authorityRank,
      category,
      decayRate
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
          authorityRank: doc.authorityRank,
          category: doc.category,
          decayRate: doc.decayRate,
          uploadDate: doc.uploadDate
        });
      } catch (embErr) {
        console.error('Embedding failed for chunk', i, embErr);
        // Continue with other chunks even if one fails
      }
    }

    addChunks(dbChunks);

    return NextResponse.json({
      success: true,
      document: doc,
      chunksInserted: dbChunks.length
    });
  } catch (error: any) {
    console.error('Upload Error:', error);
    return NextResponse.json({ error: error.message || 'Failed to process document' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const id = url.searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Document ID is required' }, { status: 400 });
    }

    const db = readDB();
    const docIndex = db.documents.findIndex(d => d.id === id);
    if (docIndex === -1) {
      return NextResponse.json({ error: 'Document not found' }, { status: 404 });
    }

    db.documents.splice(docIndex, 1);
    db.chunks = db.chunks.filter(c => c.docId !== id);
    writeDB(db);

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Delete Error:', error);
    return NextResponse.json({ error: error.message || 'Failed to delete document' }, { status: 500 });
  }
}
