// app/api/license/create/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { createLicense } from '../../../lib/license';
import { DevStore, type LicenseRecord } from '../../../lib/dev-store';
import { mkdir, readFile, writeFile } from 'fs/promises';
import path from 'path';

const DATA_DIR = path.join(process.cwd(), 'data');
const LICENSES_FILE = path.join(DATA_DIR, 'licenses.json');

function planFromProduct(productId?: string): { plan: 'basic'|'pro'; months: number; maxDevices: number } {
  switch (productId) {
    case 'ai-assistant-pro':
      return { plan: 'pro', months: 1, maxDevices: 5 };
    case 'ai-assistant-monthly':
    default:
      return { plan: 'basic', months: 1, maxDevices: 3 };
  }
}

async function saveToDisk(records: LicenseRecord[]) {
  await mkdir(DATA_DIR, { recursive: true });
  await writeFile(LICENSES_FILE, JSON.stringify(records, null, 2), 'utf8');
}

async function loadFromDisk(): Promise<LicenseRecord[]> {
  try {
    const raw = await readFile(LICENSES_FILE, 'utf8');
    const arr = JSON.parse(raw);
    return Array.isArray(arr) ? arr as LicenseRecord[] : [];
  } catch {
    return [];
  }
}

export async function POST(req: NextRequest) {
  try {
    const { email, productId } = await req.json() as { email?: string; productId?: string };
    if (!email) {
      return NextResponse.json({ ok: false, error: 'Missing email' }, { status: 400 });
    }

    // derive plan/term from product id
    const cfg = planFromProduct(productId);
    const now = Date.now();
    const expiresAt = new Date(now + cfg.months * 30 * 24 * 3600 * 1000).getTime();

    // build signed license key
    const key = createLicense({
      email,
      plan: cfg.plan,
      expiresAt,
      maxDevices: cfg.maxDevices,
    });

    // in-memory record for quick lookups
    const rec: LicenseRecord = {
      key,
      plan: cfg.plan,
      email,
      issuedAt: new Date(now).toISOString(),
      expiresAt: new Date(expiresAt).toISOString(),
      activations: [],
      maxActivations: cfg.maxDevices,
    };

    // store in memory
    DevStore.put(rec);

    // also persist to /data/licenses.json for visibility/restarts
    const existing = await loadFromDisk();
    // replace if same key exists
    const idx = existing.findIndex(r => r.key === key);
    if (idx >= 0) existing[idx] = rec; else existing.push(rec);
    await saveToDisk(existing);

    console.log('🔑 License created', { email, productId, key: key.slice(0, 12) + '…' });

    return NextResponse.json({ ok: true, key, plan: rec.plan, expiresAt: rec.expiresAt });
  } catch (e: any) {
    const msg = e?.message || 'License create error';
    console.error('💥 /api/license/create failed:', msg);
    return NextResponse.json({ ok: false, error: msg }, { status: 500 });
  }
}