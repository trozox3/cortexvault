const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

async function runTests() {
  console.log("========================================");
  console.log("CORTEXVAULT E2E API QA AUDIT");
  console.log("========================================");

  let passed = 0;
  let failed = 0;

  const baseUrl = 'http://localhost:3000';
  let cookie = '';

  const assert = (condition, message) => {
    if (condition) {
      console.log(`[PASS] ${message}`);
      passed++;
    } else {
      console.error(`[FAIL] ${message}`);
      failed++;
    }
  };

  try {
    // 1. AUTHENTICATION (Signup & Login)
    const uniqueEmail = `test_${Date.now()}@test.cortexvault.local`;
    const signupRes = await fetch(`${baseUrl}/api/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: 'Admin', email: uniqueEmail, password: 'password123' })
    });
    assert(signupRes.ok, "User Signup API");
    
    // Grab the session cookie
    const setCookieHeader = signupRes.headers.get('set-cookie');
    if (setCookieHeader) {
      cookie = setCookieHeader.split(';')[0];
    }
    assert(!!cookie, "Session Cookie generated");

    // Login test
    const loginRes = await fetch(`${baseUrl}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: uniqueEmail, password: 'password123' })
    });
    assert(loginRes.ok, "User Login API");

    // 2. DOCUMENT UPLOAD & PROCESSING
    // Create a dummy PDF buffer
    const buf = Buffer.from(
      'JVBERi0xLjcKCjEgMCBvYmogICUgZW50cnkgcG9pbnQKPDwKICAvVHlwZSAvQ2F0YWxvZwog' +
      'IC9QYWdlcyAyIDAgUgo+PgplbmRvYmoKCjIgMCBvYmoKPDwKICAvVHlwZSAvUGFnZXMKICAv' +
      'TWVkaWFCb3ggWyAwIDAgMjAwIDIwMCBdCiAgL0NvdW50IDEKICAvS2lkcyBbIDMgMCBSIF0K' +
      'Pj4KZW5kb2JqCgozIDAgb2JqCjw8CiAgL1R5cGUgL1BhZ2UKICAvUGFyZW50IDIgMCBSCiAg' +
      'L1Jlc291cmNlcyA8PAogICAgL0ZvbnQgPDwKICAgICAgL0YxIDQgMCBSCgkgID4+CiAgPj4K' +
      'ICAvQ29udGVudHMgNSAwIFIKPj4KZW5kb2JqCgo0IDAgb2JqCjw8CiAgL1R5cGUgL0ZvbnQK' +
      'ICAvU3VidHlwZSAvVHlwZTExCiAgL0Jhc2VGb250IC9UaW1lcy1Sb21hbgorPj4KZW5kb2Jq' +
      'Cgo1IDAgb2JqICAlIHBhZ2UgY29udGVudAo8PAogIC9MZW5ndGggNDQKPj4Kc3RyZWFtCkJU' +
      'CjcwIDUwIFRECi9GMSAxMiBUZgooSGVsbG8sIHdvcmxkISBJbmNpZGVudCByZXBvcnRpbmcgZGVhZGxpbmUgaXMgMjQgaG91cnMuKSBUagpFVAplbmRzdHJlYW0KZW5kb2JqCgp4cmVmCjAgNgowMDAwMDAwMDAwIDY1NTM1IGYgCjAwMDAwMDAwMTAgMDAwMDAgbiAKMDAwMDAwMDA2MCAwMDAwMCBuIAowMDAwMDAwMTU3IDAwMDAwIG4gCjAwMDAwMDAyNTkgMDAwMDAgbiAKMDAwMDAwMDM0OSAwMDAwMCBuIAp0cmFpbGVyCjw8CiAgL1NpemUgNgogIC9Sb290IDEgMCBSCj4+CnN0YXJ0eHJlZgo0NDIKJSVFT0YK', 'base64'
    );

    const formData = new FormData();
    const blob = new Blob([buf], { type: 'application/pdf' });
    formData.append('file', blob, 'Security_Policy_v1.pdf');

    const uploadRes = await fetch(`${baseUrl}/api/documents`, {
      method: 'POST',
      headers: { 'Cookie': cookie },
      body: formData
    });
    
    assert(uploadRes.ok, "Document Upload & Ingestion API");
    const uploadData = await uploadRes.json();
    assert(uploadData.success && uploadData.document, "Document Processed and Indexed");

    // 3. RAG RETRIEVAL & CITATION
    const chatRes = await fetch(`${baseUrl}/api/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Cookie': cookie },
      body: JSON.stringify({ query: 'What is the incident reporting deadline?' })
    });
    assert(chatRes.ok, "Chat RAG API");
    
    const chatData = await chatRes.json();
    assert(chatData.answer && typeof chatData.answer === 'string', "RAG Answer Generated");
    assert(chatData.citations && Array.isArray(chatData.citations), "Citations Linked");
    
    // 4. DATABASE VALIDATION
    const dbPath = path.join(__dirname, 'data', 'db.json');
    const dbContent = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
    assert(dbContent.users.some(u => u.email === uniqueEmail), "User persisted in Database");
    assert(dbContent.documents.length > 0, "Documents persisted in Database");
    assert(dbContent.chunks.some(c => c.docTitle === 'Security_Policy_v1.pdf'), "Chunks persisted in Database");
    
    // 5. SECURITY & LOGOUT
    const logoutRes = await fetch(`${baseUrl}/api/auth/logout`, {
      method: 'POST',
      headers: { 'Cookie': cookie }
    });
    assert(logoutRes.ok, "Logout API");

  } catch (err) {
    console.error("Test execution failed:", err);
    failed++;
  }

  console.log("========================================");
  console.log(`Passed: ${passed}`);
  console.log(`Failed: ${failed}`);
  console.log("========================================");
}

runTests();
