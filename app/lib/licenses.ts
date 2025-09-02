// app/lib/licenses.ts
import { mkdir, readFile, writeFile } from "fs/promises";
import path from "path";

const HAS_KV = !!process.env.KV_REST_API_URL && !!process.env.KV_REST_API_TOKEN;
const DATA_DIR = path.join(process.cwd(), "data");
const LICENSES_FILE = path.join(DATA_DIR, "licenses.json");
const KV_KEY = "licenses:dump:v1";

export type LicenseStatus = "active" | "revoked" | "expired";

export interface License {
  key: string;            // e.g. MZP-ABCD-EFGH-1234
  email: string;
  productId: string;      // e.g. 'mz-ai-assistant'
  plan: "monthly" | "pro";
  status: LicenseStatus;
  issuedAt: number;       // epoch ms
  expiresAt?: number;     // epoch ms (optional for evergreen)
  maxDevices: number;     // 2 is common
  devices: string[];      // device fingerprints bound to this license
}

let STORE: Map<string, License> = new Map();
let hydrated = false;

async function ensureDir() {
  await mkdir(DATA_DIR, { recursive: true });
}

async function loadFromDisk(): Promise<License[]> {
  try {
    await ensureDir();
    const raw = await readFile(LICENSES_FILE, "utf8");
    return JSON.parse(raw) as License[];
  } catch {
    return [];
  }
}

async function saveToDisk(all: License[]) {
  await ensureDir();
  await writeFile(LICENSES_FILE, JSON.stringify(all, null, 2), "utf8");
}

async function kvGet<T>(k: string): Promise<T | null> {
  if (!HAS_KV) return null;
  const { kv } = await import("@vercel/kv");
  return (await kv.get<T>(k)) ?? null;
}
async function kvSet(k: string, v: unknown) {
  if (!HAS_KV) return;
  const { kv } = await import("@vercel/kv");
  await kv.set(k, v);
}

export async function hydrateLicenses() {
  if (hydrated) return;
  const fromDisk = await loadFromDisk();
  for (const l of fromDisk) STORE.set(l.key, l);
  const fromKV = (await kvGet<License[]>(KV_KEY)) || [];
  for (const l of fromKV) STORE.set(l.key, l);
  hydrated = true;
}

async function persist() {
  const arr = Array.from(STORE.values());
  await saveToDisk(arr).catch(() => {});
  await kvSet(KV_KEY, arr).catch(() => {});
}

function genKey(): string {
  // Simple readable key with checksum-like last block
  const blocks = Array.from({ length: 3 }, () =>
    Math.random().toString(36).slice(2, 6).toUpperCase()
  );
  const last = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `MZP-${blocks[0]}-${blocks[1]}-${blocks[2]}-${last}`;
}

export function formatPlanFromProduct(productId: string): "monthly" | "pro" {
  return productId.includes("pro") ? "pro" : "monthly";
}

export async function createLicense(
  email: string,
  productId: string,
  ttlDays = 365 // a year by default; set 0/null for evergreen
): Promise<License> {
  await hydrateLicenses();
  const now = Date.now();
  const lic: License = {
    key: genKey(),
    email: email.toLowerCase(),
    productId,
    plan: formatPlanFromProduct(productId),
    status: "active",
    issuedAt: now,
    expiresAt: ttlDays ? now + ttlDays * 86400_000 : undefined,
    maxDevices: 2,
    devices: [],
  };
  STORE.set(lic.key, lic);
  await persist();
  return lic;
}

export async function findLicenseByKey(key: string): Promise<License | null> {
  await hydrateLicenses();
  return STORE.get(key.trim()) ?? null;
}

export function isLicenseValid(lic: License): boolean {
  if (lic.status !== "active") return false;
  if (lic.expiresAt && Date.now() > lic.expiresAt) return false;
  return true;
}

export async function activateLicenseForDevice(
  key: string,
  fingerprint?: string
): Promise<{ ok: true; license: License } | { ok: false; error: string }> {
  await hydrateLicenses();
  const lic = STORE.get(key.trim());
  if (!lic) return { ok: false, error: "License not found" };
  if (!isLicenseValid(lic)) return { ok: false, error: "License expired or inactive" };

  if (!fingerprint) {
    // allow activation without binding if you want
    return { ok: true, license: lic };
  }

  const set = new Set(lic.devices);
  if (!set.has(fingerprint)) {
    if (set.size >= lic.maxDevices) {
      return { ok: false, error: "Device limit reached for this license" };
    }
    set.add(fingerprint);
    lic.devices = Array.from(set);
    STORE.set(lic.key, lic);
    await persist();
  }

  return { ok: true, license: lic };
}