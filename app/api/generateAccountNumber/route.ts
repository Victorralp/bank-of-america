import { NextResponse } from 'next/server'

function generateAccountNumber(): string {
  // Format: XXXX-XXXX-XXXX (12 digits in groups of 4)
  const section1 = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  const section2 = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  const section3 = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  return `${section1}-${section2}-${section3}`;
}

export async function GET() {
  try {
    const accountNumber = generateAccountNumber();
    return NextResponse.json({ accountNumber });
  } catch (error) {
    console.error('Error generating account number:', error);
    return NextResponse.json(
      { error: 'Failed to generate account number' },
      { status: 500 }
    );
  }
} 