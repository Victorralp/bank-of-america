import { NextResponse } from 'next/server';
import serverMockDB from '@/lib/serverMockData';

export async function GET() {
  try {
    const data = serverMockDB.load();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error in /api/mockData:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
} 