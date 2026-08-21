import { NextResponse } from 'next/server';
import { getAllDocuments } from '@/lib/server/db';

export async function GET() {
  try {
    const docs = getAllDocuments();
    return NextResponse.json({
      healthScore: docs.length > 0 ? 100 : 0,
      totalDocuments: docs.length,
      processingStatus: 'Completed',
    });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
