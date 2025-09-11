import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email || !email.includes('@')) {
      return NextResponse.json({ message: 'Invalid email' }, { status: 400 });
    }

    const sheetRes = await fetch('https://sheetdb.io/api/v1/gusiv3wcjoalf', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        data: [
          {
            email,
            timestamp: new Date().toISOString(),
          },
        ],
      }),
    });

    if (!sheetRes.ok) {
      throw new Error('SheetDB failed');
    }

    return NextResponse.json({ message: 'Subscribed' });
  } catch (error) {
    return NextResponse.json({ message: 'Error saving email' }, { status: 500 });
  }
}