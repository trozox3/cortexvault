import { getEmbedding, generateAnswer, cosineSimilarity } from './src/lib/server/rag';
import { readDB } from './src/lib/server/db';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

async function runTest() {
  try {
    console.log('1. Testing Embedding API with the new key...');
    console.log('API KEY:', process.env.GEMINI_API_KEY ? 'Present' : 'Missing');
    const query = "What is the policy?";
    const queryEmbedding = await getEmbedding(query);
    console.log('Embedding successful. Dimensions:', queryEmbedding.length);
    
    console.log('\n2. Testing DB read...');
    const db = readDB();
    console.log('Documents in DB:', db.documents.length);
    console.log('Chunks in DB:', db.chunks.length);

    console.log('\n3. Testing generation...');
    const ans = await generateAnswer(query, [{ content: 'The policy is to be good.', docTitle: 'Test Doc', page: 1 }]);
    console.log('Generated answer:', ans);
    
  } catch (err) {
    console.error('Test Failed:', err);
  }
}
runTest();
