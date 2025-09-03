// app/lib/crypto-util.ts
import { createHmac, createHash } from "crypto";

/** Plain SHA-256 (hex) */
export function sha256(data: string): string {
  return createHash("sha256").update(data, "utf8").digest("hex");
}

/** HMAC-SHA256 (hex). Throws if secret is missing. */
export function hmac256(data: string, secret?: string): string {
  if (!secret) throw new Error("Missing LICENSE_SIGNING_SECRET");
  return createHmac("sha256", secret).update(data, "utf8").digest("hex");
}