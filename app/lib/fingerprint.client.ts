'use client';

// Fully safe on browsers; never runs on the server.
export async function getDeviceFingerprint(): Promise<string> {
  try {
    const ua = typeof navigator !== 'undefined' ? navigator.userAgent : '';
    const lang = typeof navigator !== 'undefined' ? navigator.language : '';
    const sw = typeof screen !== 'undefined' ? screen.width : 0;
    const sh = typeof screen !== 'undefined' ? screen.height : 0;
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || '';

    const raw = [ua, lang, sw, sh, tz].join('|');

    // Use WebCrypto only if truly available
    const subtle =
      typeof window !== 'undefined' &&
      window.isSecureContext &&
      window.crypto?.subtle &&
      typeof window.crypto.subtle.digest === 'function'
        ? window.crypto.subtle
        : null;

    if (subtle) {
      try {
        const data = new TextEncoder().encode(raw);
        // Some engines need the algorithm as string, others accept object
        const buf =
          (await subtle.digest('SHA-256', data).catch(() =>
            subtle.digest({ name: 'SHA-256' } as AlgorithmIdentifier, data),
          )) as ArrayBuffer;

        return Array.from(new Uint8Array(buf))
          .map((b) => b.toString(16).padStart(2, '0'))
          .join('');
      } catch {
        // fall through to simple hash
      }
    }

    // Fallback: tiny non-crypto hash (stable enough for a soft fingerprint)
    let h = 2166136261;
    for (let i = 0; i < raw.length; i++) {
      h ^= raw.charCodeAt(i);
      h = (h * 16777619) >>> 0;
    }
    return `fnv1a-${h.toString(16)}`;
  } catch {
    return 'fp-unknown';
  }
}