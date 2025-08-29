// lib/hdwallet.ts
import * as ecc from 'tiny-secp256k1';
import BIP32Factory from 'bip32';
import * as bip39 from 'bip39';
import { getPublicKey } from '@noble/secp256k1';
import { keccak_256 } from '@noble/hashes/sha3';
import bs58check from 'bs58check';


const bip32 = BIP32Factory(ecc);

// Default TRON path (Ledger style)
const DEFAULT_PATH = `m/44'/195'/0'/0/`;

/** Normalize to 32-byte hex (no 0x). */
function toHex32(pk: Buffer | Uint8Array | string): string {
  if (typeof pk === 'string') {
    const hex = pk.startsWith('0x') ? pk.slice(2) : pk;
    if (hex.length !== 64) throw new Error(`Private key hex must be 64 chars, got ${hex.length}`);
    return hex;
  }
  const buf = Buffer.isBuffer(pk) ? pk : Buffer.from(pk);
  if (buf.length !== 32) throw new Error(`Private key must be 32 bytes, got ${buf.length}`);
  return buf.toString('hex');
}

/** Read mnemonic (preferred) or throw if missing. */
function getRootNode() {
  // prefer HD_WALLET_MNEMONIC; allow legacy MZ_MASTER_MNEMONIC
  const mnemonic =
    process.env.HD_WALLET_MNEMONIC?.trim() ||
    process.env.MZ_MASTER_MNEMONIC?.trim();

  if (!mnemonic) {
    throw new Error('Missing mnemonic. Set HD_WALLET_MNEMONIC in .env.local');
  }
  if (!bip39.validateMnemonic(mnemonic)) {
    throw new Error('HD_WALLET_MNEMONIC is not a valid BIP39 mnemonic');
  }
  const seed = bip39.mnemonicToSeedSync(mnemonic);
  return bip32.fromSeed(seed);
}

/** Optionally let env override the path prefix. */
function basePath(): string {
  const p = process.env.MZ_HD_PATH?.trim();
  return p ? (p.endsWith('/') ? p : p + '/') : DEFAULT_PATH;
}

/** Build TRON base58 address from a 32-byte private key hex. */
function tronAddressFromPrivHex(pkHex: string): string {
  // convert hex → Uint8Array for noble-secp256k1
  const privKeyBytes = Buffer.from(pkHex, 'hex');

  // 1) Uncompressed public key (65 bytes, 0x04 || X || Y)
  const pubUncompressed = getPublicKey(privKeyBytes, false); // Uint8Array (65)

  // 2) Keccak-256 of the last 64 bytes (drop the 0x04)
  const hash = keccak_256(pubUncompressed.slice(1)); // 32 bytes

  // 3) Take last 20 bytes
  const addr20 = hash.slice(12); // 20 bytes

  // 4) Prepend TRON network version 0x41
  const tronHex = Buffer.concat([Buffer.from([0x41]), Buffer.from(addr20)]);

  // 5) Base58Check encode
  return bs58check.encode(tronHex); // "T..."
}

/**
 * Derive a TRON (TRC-20) deposit address for an order index.
 * Returns Base58Check address (T...) and the derivation path.
 */
export function generateDepositAddress(orderIndex: number): { address: string; derivationPath: string } {
  if (!Number.isInteger(orderIndex) || orderIndex < 0) {
    throw new Error('orderIndex must be a non-negative integer');
  }

  const root = getRootNode();
  const path = basePath() + String(orderIndex);
  const child = root.derivePath(path);
  if (!child.privateKey) throw new Error('Derived node has no private key');

  const pkHex = toHex32(child.privateKey as Buffer | Uint8Array | string);
  const address = tronAddressFromPrivHex(pkHex); // "T..." base58
return { address, derivationPath: path };
}

/** Private key hex for server-side sweeping (never expose to clients). */
export function getPrivateKeyHex(orderIndex: number): string {
  const root = getRootNode();
  const child = root.derivePath(basePath() + String(orderIndex));
  if (!child.privateKey) throw new Error('No private key derived');
  return toHex32(child.privateKey as Buffer | Uint8Array | string);
}