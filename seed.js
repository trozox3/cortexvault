const fs = require('fs');
const { getEmbedding, chunkText } = require('./.next/server/app/api/chat/route.js');
const { v4: uuidv4 } = require('uuid');

async function seed() {
  const db = { documents: [], chunks: [], users: [] };
  
  // Keep existing users if DB exists
  try {
    const existing = JSON.parse(fs.readFileSync('data/db.json', 'utf8'));
    db.users = existing.users || [];
  } catch (e) { }

  const docs = [
    {
      title: 'RemoteWorkPolicy_HR.pdf',
      text: 'According to the official HR policy issued last year, remote work is permanently allowed for all employees globally. No office presence is required.',
      authorityRank: 1,
      category: 'Official Policy',
      decayRate: 0.005,
      uploadDate: new Date(Date.now() - 100 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] // 100 days old
    },
    {
      title: 'CEO_Memo_Return_To_Office.pdf',
      text: 'Effective immediately, the remote work policy is cancelled. All employees must return to the office full-time. This supersedes all previous HR guidelines.',
      authorityRank: 1,
      category: 'Official Policy',
      decayRate: 0.005,
      uploadDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] // 2 days old
    },
    {
      title: 'Engineering_Team_Notes.pdf',
      text: 'Our engineering team manager said we can still work remote on Fridays, regardless of the new memo.',
      authorityRank: 3,
      category: 'Employee Wiki',
      decayRate: 0.05,
      uploadDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] // 1 day old
    }
  ];

  for (const doc of docs) {
    const docId = uuidv4();
    db.documents.push({
      id: docId,
      title: doc.title,
      type: 'PDF',
      uploadDate: doc.uploadDate,
      status: 'Indexed',
      tags: ['Seed Data'],
      excerpt: doc.text.substring(0, 50) + '...',
      authorityRank: doc.authorityRank,
      category: doc.category,
      decayRate: doc.decayRate
    });

    try {
      // Need to require dotenv since this runs standalone
      require('dotenv').config({ path: '.env.local' });
      // Call getEmbedding dynamically or mock it
      // Actually, since getEmbedding might be tricky to import in CJS without ts-node, let's just make direct API call
      const { GoogleGenAI } = require('@google/genai');
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      const res = await ai.models.embedContent({ model: 'gemini-embedding-2', contents: doc.text });
      const embedding = res.embeddings[0].values;

      db.chunks.push({
        id: uuidv4(),
        docId,
        docTitle: doc.title,
        page: 1,
        content: doc.text,
        embedding: embedding,
        authorityRank: doc.authorityRank,
        category: doc.category,
        decayRate: doc.decayRate,
        uploadDate: doc.uploadDate
      });
      console.log(`Embedded and saved: ${doc.title}`);
    } catch (e) {
      console.error(`Failed to embed ${doc.title}:`, e.message);
    }
  }

  fs.writeFileSync('data/db.json', JSON.stringify(db, null, 2));
  console.log('Seed complete.');
}

seed();
