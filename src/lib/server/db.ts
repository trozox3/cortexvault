import fs from 'fs';
import path from 'path';

export type Chunk = {
  id: string;
  docId: string;
  docTitle: string;
  page: number; // For PDF-parse, we might only have generic page/chunk index
  content: string;
  embedding?: number[];
  authorityRank: number;
  category: string;
  decayRate: number;
  uploadDate: string;
};

export type Document = {
  id: string;
  title: string;
  type: string;
  uploadDate: string;
  status: string;
  tags: string[];
  excerpt: string;
  authorityRank: number;
  category: string;
  decayRate: number;
};

export type User = {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  role: string;
};

export type DBData = {
  documents: Document[];
  chunks: Chunk[];
  users: User[];
};

const DB_PATH = path.join(process.cwd(), 'data', 'db.json');

function ensureDB() {
  const dataDir = path.dirname(DB_PATH);
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
  if (!fs.existsSync(DB_PATH)) {
    fs.writeFileSync(DB_PATH, JSON.stringify({ documents: [], chunks: [], users: [] }, null, 2));
  }
}

export function readDB(): DBData {
  ensureDB();
  const raw = fs.readFileSync(DB_PATH, 'utf-8');
  return JSON.parse(raw);
}

export function writeDB(data: DBData) {
  ensureDB();
  fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
}

export function addDocument(doc: Document) {
  const db = readDB();
  db.documents.push(doc);
  writeDB(db);
}

export function addChunks(chunks: Chunk[]) {
  const db = readDB();
  db.chunks.push(...chunks);
  writeDB(db);
}

export function getAllDocuments() {
  return readDB().documents;
}

export function addUser(user: User) {
  const db = readDB();
  // Migration for old dbs
  if (!db.users) db.users = [];
  db.users.push(user);
  writeDB(db);
}

export function getUserByEmail(email: string) {
  const db = readDB();
  if (!db.users) return undefined;
  return db.users.find(u => u.email === email);
}
