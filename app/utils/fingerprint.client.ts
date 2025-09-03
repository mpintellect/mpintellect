'use client';

// Fully safe on browsers; never throws on SSR
export async function getDeviceFingerprint(): Promise<string> {
  try {
    const hasWindow =
      typeof window !== 'undefined' && typeof document !== 'undefined';

    const ua   = hasWindow ? (navigator.userAgent || '') : '';
    const lang = hasWindow ? (navigator.language || '') : '';
    const plat = hasWindow ? (navigator.platform || '') : '';
    const cores = hasWindow ? String((navigator as any).hardwareConcurrency || '') : '';
    const mem   = hasWindow ? String((navigator as any).deviceMemory || '') : '';

    const scrWidth  = hasWindow && typeof window.screen !== 'undefined' ? String(window.screen.width  || '') : '';
    const scrHeight = hasWindow && typeof window.screen !== 'undefined' ? String(window.screen.height || '') : '';
    const colorDepth = hasWindow && typeof window.screen !== 'undefined' ? String(window.screen.colorDepth || '') : '';

    let tz = '';
    try { tz = Intl.DateTimeFormat().resolvedOptions().timeZone || ''; } catch {}

    const parts = [ua, lang, plat, cores, mem, scrWidth, scrHeight, colorDepth, tz].join('|');

    // Stable per-browser salt
    const SALT_KEY = 'mz_fp_salt';
    let salt = 'nosalt';
    if (hasWindow) {
      try {
        salt = localStorage.getItem(SALT_KEY) || '';
        if (!salt) {
          salt = Math.random().toString(36).slice(2);
          localStorage.setItem(SALT_KEY, salt);
        }
      } catch {}
    }

    const raw = parts + '|' + salt;

    // Use WebCrypto only if truly available in secure context
    const subtle =
      hasWindow &&
      (window as any).isSecureContext &&
      window.crypto?.subtle &&
      typeof window.crypto.subtle.digest === 'function'
        ? window.crypto.subtle
        : null;

    if (subtle) {
      try {
        const data = new TextEncoder().encode(raw);
        const buf = await subtle.digest('SHA-256', data);
        return Array.from(new Uint8Array(buf))
          .map(b => b.toString(16).padStart(2, '0'))
          .join('');
      } catch {
        // fall through
      }
    }

    // Fallback: FNV-1a
    let h = 0x811c9dc5;
    for (let i = 0; i < raw.length; i++) {
      h ^= raw.charCodeAt(i);
      h = (h * 0x01000193) >>> 0;
    }
    return `fnv1a-${h.toString(16).padStart(8, '0')}`;
  } catch {
    return 'fp-unknown';
  }
}