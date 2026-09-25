import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from 'jose';
import { readDB } from '@/lib/server/db';

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || 'cortexvault-super-secret-key-change-in-prod');

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get('cortex_session')?.value;
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { payload } = await jwtVerify(token, JWT_SECRET);
    const db = readDB();
    const user = db.users.find(u => u.id === payload.userId);

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role || 'Viewer'
      }
    });
  } catch (error) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
}
