// helpers/licenseClient.ts
/**
 * Deterministic browser fingerprint (no PII).
 * Stable per-browser unless storage is cleared.
 */
export async function browserFingerprint(): Promise<string> {
  const parts = [
    navigator.userAgent,
    navigator.language,
    navigator.platform,
    String((navigator as any).hardwareConcurrency || ''),
    String((navigator as any).deviceMemory || ''),
    String(screen.width), String(screen.height), String(screen.colorDepth),
    String(new Date().getTimezoneOffset()),
  ].join('|');

  // persist a salt so the hash is stable for this browser
  const SALT_KEY = 'mz_fp_salt';
  let salt = localStorage.getItem(SALT_KEY);
  if (!salt) {
    salt = Math.random().toString(36).slice(2);
    localStorage.setItem(SALT_KEY, salt);
  }

  const data = new TextEncoder().encode(parts + '|' + salt);
  const digest = await crypto.subtle.digest('SHA-256', data);
  return [...new Uint8Array(digest)].map(b => b.toString(16).padStart(2, '0')).join('');
}