// app/api/license/activate/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { DevStore } from '../../../lib/dev-store';
import { hash } from '../../../lib/license';

function fallbackFingerprint(req: NextRequest) {
  // Best-effort fingerprint if the client didn't send one
  const ua = req.headers.get('user-agent') || '';
  // No req.ip in Next.js; use headers instead
  const ip =
    req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    req.headers.get('x-real-ip') ||
    '';
  const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || '';

  return hash(`${ua}|${ip}|${tz}`);
}

export async function POST(req: NextRequest) {
  const body = (await req.json().catch(() => ({}))) as { key?: string; fingerprint?: string };

  const k = body.key?.trim();
  // If missing, generate a (weak but useful) fallback so the flow still works
  const fp = body.fingerprint?.trim() || fallbackFingerprint(req);

  if (!k) {
    return NextResponse.json({ ok: false, error: 'Missing key' }, { status: 400 });
  }

  const lic = DevStore.get(k);
  if (!lic) return NextResponse.json({ ok: false, error: 'Invalid license' }, { status: 404 });

  if (new Date(lic.expiresAt).getTime() <= Date.now()) {
    return NextResponse.json({ ok: false, error: 'License expired' }, { status: 403 });
  }

  const fpHash = hash(fp);
  const already = lic.activations.find(a => a.fingerprintHash === fpHash);

  if (!already) {
    if (lic.activations.length >= lic.maxActivations) {
      return NextResponse.json({ ok: false, error: 'Activation limit reached' }, { status: 403 });
    }
    lic.activations.push({
      fingerprintHash: fpHash,
      activatedAt: new Date().toISOString(),
    });
    DevStore.put(lic); // persist updated license
  }

  return NextResponse.json({
    ok: true,
    license: { key: lic.key, plan: lic.plan, expiresAt: lic.expiresAt },
    activation: { fingerprintHash: fpHash },
  });
}