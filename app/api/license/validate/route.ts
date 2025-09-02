// app/api/license/validate/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { DevStore } from '../../../lib/dev-store';
import { hash } from '../../../lib/licenses';

export async function GET(req: NextRequest) {
  const key = req.nextUrl.searchParams.get('key') || '';
  const fp  = req.nextUrl.searchParams.get('fp') || '';
  const lic = DevStore.get(key);
  if (!lic) return NextResponse.json({ ok: false }, { status: 404 });

  const validDate = new Date(lic.expiresAt).getTime() > Date.now();
  const bound = lic.activations.some(a => a.fingerprintHash === hash(fp));
  return NextResponse.json({ ok: validDate && bound });
}