// lib/fingerprint.ts
export async function getDeviceFingerprint(): Promise<string> {
  const data = [
    navigator.userAgent || '',
    navigator.platform || '',
    String(screen?.width || 0),
    String(screen?.height || 0),
    String(screen?.colorDepth || 0),
    Intl.DateTimeFormat().resolvedOptions().timeZone || '',
    (navigator as any).language || '',
    ((navigator as any).languages || []).join(','),
  ].join('||');

  const enc = new TextEncoder().encode(data);
  const digest = await crypto.subtle.digest('SHA-256', enc);
  return Array.from(new Uint8Array(digest))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}