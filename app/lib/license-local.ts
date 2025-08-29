// lib/license-local.ts
export function isValidLicenseFormat(k: string) {
  return /^[A-Z0-9-]{10,}$/i.test(k.trim());
}

export function readLocalLicense(): string | null {
  try { return localStorage.getItem('mz_ai_license'); } catch { return null; }
}

export function writeLocalLicense(key: string) {
  try {
    localStorage.setItem('mz_ai_license', key);
    localStorage.setItem('mz_ai_subscribed', '1');
  } catch {}
}