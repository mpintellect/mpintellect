import { NextRequest, NextResponse } from 'next/server';
import { verifyLicense } from '../../../lib/license';

export async function POST(req: NextRequest) {
  const { key, deviceId } = await req.json();
  if (!key) return NextResponse.json({ ok:false, error:'No key' }, { status:400 });

  const result = verifyLicense(key);
  if (!result.ok) return NextResponse.json(result, { status:200 });

  // (Optional) Anti-sharing: check registered devices count
  // Quick JSON store check:
  // Read /data/licenses.json -> map key -> set of devices; enforce maxDevices
  // For now, just return ok and payload:
  return NextResponse.json({ ok:true, payload: result.payload });
}