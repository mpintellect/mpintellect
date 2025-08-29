// app/api/license/activate/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { DevStore } from '../../../lib/dev-store';
import { hash } from '../../../lib/license';

export async function POST(req: NextRequest) {
  const { key, fingerprint } = await req.json() as { key?: string; fingerprint?: string };
  if (!key || !fingerprint) {
    return NextResponse.json({ ok: false, error: 'Missing key or fingerprint' }, { status: 400 });
  }

  const lic = DevStore.get(key.trim());
  if (!lic) return NextResponse.json({ ok: false, error: 'Invalid license' }, { status: 404 });

  if (new Date(lic.expiresAt).getTime() <= Date.now()) {
    return NextResponse.json({ ok: false, error: 'License expired' }, { status: 403 });
  }

  const fpHash = hash(fingerprint);
  const already = lic.activations.find(a => a.fingerprintHash === fpHash);
  if (!already) {
    if (lic.activations.length >= lic.maxActivations) {
      return NextResponse.json({ ok: false, error: 'Activation limit reached' }, { status: 403 });
    }
    lic.activations.push({ fingerprintHash: fpHash, activatedAt: new Date().toISOString() });
  }

  return NextResponse.json({ ok: true, license: { key: lic.key, plan: lic.plan, expiresAt: lic.expiresAt } });
}