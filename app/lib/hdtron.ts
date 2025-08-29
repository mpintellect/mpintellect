// lib/hdtron.ts
import * as bip39 from 'bip39';
import * as ecc from 'tiny-secp256k1';
import { BIP32Factory } from 'bip32';

// Use CommonJS require to dodge ESM constructor typing issues
// eslint-disable-next-line @typescript-eslint/no-var-requires
const TronWeb = require('tronweb'); 
const tronWeb: any = new TronWeb({ fullHost: 'https://api.trongrid.io' });

const bip32 = BIP32Factory(ecc);

const COIN_PATH = process.env.MZ_HD_PATH || "m/44'/195'/0'/0"; // TRON coin type 195
const MNEMONIC  = process.env.MZ_MASTER_MNEMONIC || '';

if (!MNEMONIC) {
  console.warn('[hdtron] MZ_MASTER_MNEMONIC missing — address derivation will fail.');
}

/**
 * Derive a TRON (TRC-20 capable) address from master mnemonic.
 * Returns base58 address + hex private key for signing.
 * IMPORTANT: Secure the private key (vault/HSM) in production.
 */
export async function deriveTronAddress(index: number) {
  if (!MNEMONIC) throw new Error('Missing MZ_MASTER_MNEMONIC');

  const seed = await bip39.mnemonicToSeed(MNEMONIC);
  const root = bip32.fromSeed(seed);
  const child = root.derivePath(`${COIN_PATH}/${index}`);

  if (!child.privateKey) throw new Error('No private key at derived path');

  const pkHex = Buffer.from(child.privateKey).toString('hex');

  // TronWeb gives us the correct base58 address from the private key
  const address = tronWeb.address.fromPrivateKey(pkHex);

  return {
    index,
    address,     // base58 TRON address (starts with T…)
    privateKey: pkHex,
  };
}