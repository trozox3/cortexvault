export const mockUsers = [
  { id: 'u1', name: 'Alice Admin', role: 'Administrator', email: 'alice@northstardynamics.com' },
  { id: 'u2', name: 'Bob Analyst', role: 'Analyst', email: 'bob@northstardynamics.com' },
];

export const mockWorkspace = {
  id: 'w1',
  name: 'Northstar Dynamics HQ',
  healthScore: 92,
  totalDocuments: 12,
  processingStatus: 'Completed',
};

export const mockDocuments = [
  {
    id: 'd1',
    title: 'Information Security Policy v3.2',
    type: 'PDF',
    uploadDate: '2026-07-15',
    status: 'Indexed',
    tags: ['Policy', 'Security'],
    excerpt: 'This document outlines the mandatory security controls for all Northstar Dynamics employees and contractors.',
  },
  {
    id: 'd2',
    title: 'Vendor Master Agreement - TechCorp',
    type: 'DOCX',
    uploadDate: '2026-08-01',
    status: 'Indexed',
    tags: ['Contract', 'Legal'],
    excerpt: 'Master service agreement between Northstar Dynamics and TechCorp, valid until Dec 31, 2028.',
  },
  {
    id: 'd3',
    title: 'Data Processing Addendum (DPA) 2026',
    type: 'PDF',
    uploadDate: '2026-08-02',
    status: 'Indexed',
    tags: ['Compliance', 'Privacy'],
    excerpt: 'Standard clauses for processing of personal data in compliance with GDPR and CCPA.',
  },
  {
    id: 'd4',
    title: 'Employee Handbook 2026',
    type: 'PDF',
    uploadDate: '2026-01-10',
    status: 'Indexed',
    tags: ['HR', 'Policy'],
    excerpt: 'Company guidelines, benefits, and code of conduct.',
  },
  {
    id: 'd5',
    title: 'Business Continuity Plan (BCP)',
    type: 'PDF',
    uploadDate: '2026-05-20',
    status: 'Indexed',
    tags: ['Operations', 'Risk'],
    excerpt: 'Procedures to ensure essential business functions can continue during and after a disaster.',
  },
  {
    id: 'd6',
    title: 'Q2 2026 Board Report',
    type: 'PPTX',
    uploadDate: '2026-07-10',
    status: 'Indexed',
    tags: ['Finance', 'Executive'],
    excerpt: 'Financial performance and strategic updates for the second quarter.',
  },
  {
    id: 'd7',
    title: 'Cloud Services Contract - AWS',
    type: 'PDF',
    uploadDate: '2025-11-01',
    status: 'Indexed',
    tags: ['Contract', 'IT'],
    excerpt: 'Enterprise agreement for AWS cloud infrastructure hosting.',
  },
  {
    id: 'd8',
    title: 'Privacy Compliance Checklist',
    type: 'XLSX',
    uploadDate: '2026-08-10',
    status: 'Indexed',
    tags: ['Compliance', 'Audit'],
    excerpt: 'Internal checklist for auditing systems handling PII.',
  },
  {
    id: 'd9',
    title: 'Project Apollo PRD',
    type: 'DOCX',
    uploadDate: '2026-06-15',
    status: 'Indexed',
    tags: ['Engineering', 'Product'],
    excerpt: 'Product requirements for the upcoming Apollo AI release.',
  },
  {
    id: 'd10',
    title: 'Internal Audit Findings - 2025',
    type: 'PDF',
    uploadDate: '2026-02-28',
    status: 'Indexed',
    tags: ['Audit', 'Risk'],
    excerpt: 'Summary of findings from the annual internal security audit.',
  },
  {
    id: 'd11',
    title: 'Financial Forecast FY27',
    type: 'XLSX',
    uploadDate: '2026-08-15',
    status: 'Indexed',
    tags: ['Finance'],
    excerpt: 'Revenue and expense projections for the next fiscal year.',
  },
  {
    id: 'd12',
    title: 'Regulatory Requirements ISO27001',
    type: 'PDF',
    uploadDate: '2025-09-10',
    status: 'Indexed',
    tags: ['Compliance', 'Security'],
    excerpt: 'Checklist and mapping of internal controls to ISO27001 standards.',
  }
];

export const mockConflicts = [
  {
    id: 'c1',
    severity: 'High',
    description: 'Data Retention Discrepancy',
    affectedDocuments: ['Information Security Policy v3.2', 'Data Processing Addendum (DPA) 2026'],
    excerpt1: 'User data must be retained for 7 years. (InfoSec Policy, pg 12)',
    excerpt2: 'Personal data shall be deleted within 30 days of contract termination. (DPA, pg 4)',
    resolutionStatus: 'Open',
    suggestedResolution: 'Clarify exception for personal data in the InfoSec policy to align with DPA.',
  },
  {
    id: 'c2',
    severity: 'Medium',
    description: 'Conflicting Incident Reporting Deadlines',
    affectedDocuments: ['Vendor Master Agreement - TechCorp', 'Information Security Policy v3.2'],
    excerpt1: 'Vendor must report breaches within 72 hours. (VMA, pg 8)',
    excerpt2: 'All security incidents must be reported to the DPO within 24 hours. (InfoSec Policy, pg 5)',
    resolutionStatus: 'Open',
    suggestedResolution: 'Amend VMA to enforce a 24-hour SLA to match internal policy.',
  }
];

export const mockKnowledgeGaps = [
  {
    id: 'kg1',
    query: 'What is the penalty for SLA breach by AWS?',
    reason: 'The Cloud Services Contract - AWS does not contain penalty clauses in the provided excerpts.',
  },
  {
    id: 'kg2',
    query: 'Who is the designated Data Protection Officer?',
    reason: 'DPO is mentioned in the InfoSec Policy, but no specific individual is named.',
  }
];

export const mockChunks = [
  { id: 'chk1', docId: 'd1', page: 5, content: 'All security incidents must be reported to the DPO within 24 hours of discovery.' },
  { id: 'chk2', docId: 'd1', page: 12, content: 'User data must be retained for 7 years for compliance with financial regulations.' },
  { id: 'chk3', docId: 'd2', page: 8, content: 'In the event of a data breach, Vendor must report the incident to Northstar Dynamics within 72 hours.' },
  { id: 'chk4', docId: 'd3', page: 4, content: 'Upon termination of services, all personal data shall be deleted within 30 days.' },
  { id: 'chk5', docId: 'd5', page: 15, content: 'The primary alternate site for disaster recovery is located in us-west-2 region.' },
];

export const mockGraphNodes = [
  { id: 'n1', label: 'Northstar Dynamics', group: 'Organization' },
  { id: 'n2', label: 'TechCorp', group: 'Organization' },
  { id: 'n3', label: 'InfoSec Policy', group: 'Document' },
  { id: 'n4', label: 'Data Processing Addendum', group: 'Document' },
  { id: 'n5', label: '7-Year Retention', group: 'Obligation' },
  { id: 'n6', label: '30-Day Deletion', group: 'Obligation' },
];

export const mockGraphEdges = [
  { source: 'n1', target: 'n3', label: 'owns' },
  { source: 'n1', target: 'n4', label: 'owns' },
  { source: 'n2', target: 'n4', label: 'signs' },
  { source: 'n3', target: 'n5', label: 'mandates' },
  { source: 'n4', target: 'n6', label: 'mandates' },
  { source: 'n5', target: 'n6', label: 'CONFLICTS WITH', animated: true, style: { stroke: 'red' } },
];
