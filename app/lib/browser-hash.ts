// app/lib/browser-hash.ts
export async function browserSHA256(input: string): Promise<string> {
  const enc = new TextEncoder().encode(input);
  const subtle = (typeof window !== "undefined" ? window.crypto?.subtle : undefined);

  if (subtle?.digest) {
    const buf = await subtle.digest("SHA-256", enc);
    return [...new Uint8Array(buf)].map(b => b.toString(16).padStart(2, "0")).join("");
  }

  // Fallback: simple (non-crypto) hash to keep UX working
  let h = 0;
  for (let i = 0; i < input.length; i++) {
    h = (h << 5) - h + input.charCodeAt(i);
    h |= 0;
  }
  return ("00000000" + (h >>> 0).toString(16)).slice(-8);
}