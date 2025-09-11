// app/api/unsubscribe/route.ts
import fs from 'fs';
import path from 'path';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { email } = await req.json();
    if (!email || !email.includes('@')) return NextResponse.json({ error: 'Invalid email' }, { status: 400 });

    const batchesDir = path.join(process.cwd(), 'data', 'batches');
    const batchFiles = fs.readdirSync(batchesDir).filter(f => f.startsWith('batch-'));

    for (const file of batchFiles) {
      const filePath = path.join(batchesDir, file);
      const contacts = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
      const filtered = contacts.filter((c: any) => c.Email !== email);

      if (filtered.length !== contacts.length) {
        fs.writeFileSync(filePath, JSON.stringify(filtered, null, 2));
      }
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('[Unsubscribe error]', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}