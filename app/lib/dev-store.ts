// lib/dev-store.ts
type Plan = 'basic' | 'pro';
export type LicenseRecord = {
  key: string;
  plan: Plan;
  email: string;
  issuedAt: string;       // ISO
  expiresAt: string;      // ISO
  activations: Array<{ fingerprintHash: string; activatedAt: string }>;
  maxActivations: number; // e.g. 3 devices
};

const store = new Map<string, LicenseRecord>();
export const DevStore = {
  put: (lic: LicenseRecord) => store.set(lic.key, lic),
  get: (k: string) => store.get(k),
  all: () => Array.from(store.values()),
};