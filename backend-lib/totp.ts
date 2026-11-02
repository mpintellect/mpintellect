// backend-lib/totp.ts
//
// Minimal TOTP (RFC 6238) / HOTP (RFC 4226) implementation for Cloudflare
// Workers - no npm TOTP library needed, just Web Crypto's HMAC-SHA1. Despite
// the common name "Google Authenticator code", TOTP is an open standard -
// this works with Google Authenticator, Authy, 1Password, etc., and
// involves no Google API or account linkage.
//
// Used to gate /admin behind a second factor on top of the existing
// ADMIN_PASSWORD check - see functions/api/admin/validate.ts for the full
// setup/confirm/verify state machine.

const BASE32_ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';

export function generateSecret(byteLength = 20): string {
  const bytes = new Uint8Array(byteLength);
  crypto.getRandomValues(bytes);
  return base32Encode(bytes);
}

function base32Encode(bytes: Uint8Array): string {
  let bits = 0;
  let value = 0;
  let output = '';
  for (const byte of bytes) {
    value = (value << 8) | byte;
    bits += 8;
    while (bits >= 5) {
      output += BASE32_ALPHABET[(value >>> (bits - 5)) & 31];
      bits -= 5;
    }
  }
  if (bits > 0) {
    output += BASE32_ALPHABET[(value << (5 - bits)) & 31];
  }
  return output;
}

function base32Decode(secret: string): Uint8Array {
  const clean = secret.toUpperCase().replace(/[^A-Z2-7]/g, '');
  let bits = 0;
  let value = 0;
  const bytes: number[] = [];
  for (const char of clean) {
    const idx = BASE32_ALPHABET.indexOf(char);
    if (idx === -1) continue;
    value = (value << 5) | idx;
    bits += 5;
    if (bits >= 8) {
      bytes.push((value >>> (bits - 8)) & 0xff);
      bits -= 8;
    }
  }
  return new Uint8Array(bytes);
}

async function hotp(secretBytes: Uint8Array, counter: number, digits: number): Promise<string> {
  // RFC 4226's 8-byte big-endian counter - counter (unix time / 30) stays
  // well within the low 32 bits for the next few thousand years, so only
  // the low word is set and the high word stays zero.
  const counterBuffer = new ArrayBuffer(8);
  new DataView(counterBuffer).setUint32(4, counter, false);

  // TS's DOM lib types importKey's key material as BufferSource with a
  // concrete ArrayBuffer generic; Uint8Array's inferred buffer type is
  // looser (ArrayBufferLike), so pass the underlying bytes through a plain
  // ArrayBuffer copy rather than the typed array itself.
  const keyMaterial = secretBytes.slice().buffer as ArrayBuffer;
  const key = await crypto.subtle.importKey('raw', keyMaterial, { name: 'HMAC', hash: 'SHA-1' }, false, ['sign']);
  const digest = new Uint8Array(await crypto.subtle.sign('HMAC', key, counterBuffer));

  const offset = digest[digest.length - 1] & 0x0f;
  const binary =
    ((digest[offset] & 0x7f) << 24) |
    ((digest[offset + 1] & 0xff) << 16) |
    ((digest[offset + 2] & 0xff) << 8) |
    (digest[offset + 3] & 0xff);

  return (binary % 10 ** digits).toString().padStart(digits, '0');
}

export async function totp(secretBase32: string, forTimeMs = Date.now(), period = 30, digits = 6): Promise<string> {
  const counter = Math.floor(forTimeMs / 1000 / period);
  return hotp(base32Decode(secretBase32), counter, digits);
}

// Accepts a code from the current 30s step or one step on either side, to
// tolerate normal clock drift between the server and the admin's phone.
export async function verifyTotp(
  secretBase32: string,
  token: string,
  forTimeMs = Date.now(),
  period = 30,
  digits = 6,
  window = 1
): Promise<boolean> {
  const cleanToken = (token || '').trim();
  if (!/^\d{6}$/.test(cleanToken)) return false;
  const secretBytes = base32Decode(secretBase32);
  const counter = Math.floor(forTimeMs / 1000 / period);
  for (let step = -window; step <= window; step++) {
    const candidate = await hotp(secretBytes, counter + step, digits);
    if (candidate === cleanToken) return true;
  }
  return false;
}

// Standard otpauth:// URI any authenticator app recognizes when scanned as
// a QR code (app/admin/AdminGate.tsx renders it via qrcode.react).
export function otpauthUrl(secretBase32: string, accountLabel: string, issuer: string): string {
  const label = encodeURIComponent(`${issuer}:${accountLabel}`);
  const params = new URLSearchParams({
    secret: secretBase32,
    issuer,
    algorithm: 'SHA1',
    digits: '6',
    period: '30',
  });
  return `otpauth://totp/${label}?${params.toString()}`;
}
