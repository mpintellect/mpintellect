// app/lib/fingerprint.ts
// Safe fingerprint helper with fallbacks — will never throw on missing crypto.subtle.

export async function getDeviceFingerprint(): Promise<string> {
  try {
    const raw =
      [
        navigator.userAgent,
        navigator.language,
        screen?.width,
        screen?.height,
        Intl.DateTimeFormat().resolvedOptions().timeZone,
      ]
        .filter(Boolean)
        .join("|");

    // Prefer Web Crypto if available
    // (localhost is a secure origin, but some engines still lack subtle)
    const hasSubtle =
      typeof globalThis !== "undefined" &&
      (globalThis as any).crypto &&
      (globalThis as any).crypto.subtle &&
      typeof (globalThis as any).crypto.subtle.digest === "function";

    if (hasSubtle) {
      const enc = new TextEncoder();
      const buf = await (globalThis as any).crypto.subtle.digest(
        "SHA-256",
        enc.encode(raw)
      );
      return [...new Uint8Array(buf)]
        .map((b) => b.toString(16).padStart(2, "0"))
        .join("");
    }

    // Fallback: tiny sync hash (no crypto)
    let hash = 2166136261;
    for (let i = 0; i < raw.length; i++) {
      hash ^= raw.charCodeAt(i);
      hash = (hash * 16777619) >>> 0;
    }
    return `fnv1a-${hash.toString(16)}`;
  } catch {
    return "fp-unknown";
  }
}