import { mockConflicts } from '../db/mockData';

export async function getConflicts() {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 800));
  return mockConflicts;
}
