import { NextResponse } from 'next/server';
import serverMockDB from '@/lib/serverMockData';
import { MockDB } from '@/lib/mockData';

export async function POST(request: Request) {
  try {
    const data = await request.json() as MockDB;
    serverMockDB.save(data);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error in /api/saveMockData:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
} 