import { mockChunks, mockDocuments } from '../db/mockData';

export type Citation = {
  chunkId: string;
  docId: string;
  docTitle: string;
  page: number;
  text: string;
};

export type RagResponse = {
  answer: string;
  citations: Citation[];
  confidenceScore: number;
  isExternalContextUsed: boolean;
};

export async function askQuestion(query: string): Promise<RagResponse> {
  // Simulate network latency and RAG processing
  await new Promise(resolve => setTimeout(resolve, 1500));

  const lowerQuery = query.toLowerCase();
  
  if (lowerQuery.includes('retention') || lowerQuery.includes('delete')) {
    return {
      answer: "There is a conflict regarding data retention. The Information Security Policy mandates that user data must be retained for 7 years for compliance. However, the Data Processing Addendum (DPA) states that personal data must be deleted within 30 days of contract termination.",
      citations: [
        {
          chunkId: 'chk2',
          docId: 'd1',
          docTitle: 'Information Security Policy v3.2',
          page: 12,
          text: 'User data must be retained for 7 years for compliance with financial regulations.'
        },
        {
          chunkId: 'chk4',
          docId: 'd3',
          docTitle: 'Data Processing Addendum (DPA) 2026',
          page: 4,
          text: 'Upon termination of services, all personal data shall be deleted within 30 days.'
        }
      ],
      confidenceScore: 0.95,
      isExternalContextUsed: false,
    };
  }

  if (lowerQuery.includes('deadline') || lowerQuery.includes('incident') || lowerQuery.includes('report')) {
    return {
      answer: "The deadlines for reporting security incidents differ across documents. The internal Information Security Policy requires reporting to the DPO within 24 hours of discovery. Conversely, the Vendor Master Agreement allows the vendor 72 hours to report a data breach.",
      citations: [
        {
          chunkId: 'chk1',
          docId: 'd1',
          docTitle: 'Information Security Policy v3.2',
          page: 5,
          text: 'All security incidents must be reported to the DPO within 24 hours of discovery.'
        },
        {
          chunkId: 'chk3',
          docId: 'd2',
          docTitle: 'Vendor Master Agreement - TechCorp',
          page: 8,
          text: 'In the event of a data breach, Vendor must report the incident to Northstar Dynamics within 72 hours.'
        }
      ],
      confidenceScore: 0.88,
      isExternalContextUsed: false,
    };
  }
  
  if (lowerQuery.includes('disaster') || lowerQuery.includes('business continuity')) {
    return {
      answer: "The primary alternate site for disaster recovery is located in the us-west-2 region.",
      citations: [
        {
          chunkId: 'chk5',
          docId: 'd5',
          docTitle: 'Business Continuity Plan (BCP)',
          page: 15,
          text: 'The primary alternate site for disaster recovery is located in us-west-2 region.'
        }
      ],
      confidenceScore: 0.92,
      isExternalContextUsed: false,
    }
  }

  // Fallback for unanswered questions
  return {
    answer: "Based on the provided documents in this workspace, I could not find a definitive answer to your question. Please ensure the relevant documents are uploaded or rephrase your query.",
    citations: [],
    confidenceScore: 0.1,
    isExternalContextUsed: false,
  };
}
