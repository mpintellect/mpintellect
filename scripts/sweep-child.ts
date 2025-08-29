/* scripts/sweep-child.ts  (TypeScript, runs like your JS)
 *
 * Usage:
 *   DOTENV_CONFIG_PATH=.env.local npx ts-node -r dotenv/config scripts/sweep-child.ts <ORDER_INDEX>
 *
 * Env required:
 *   HD_WALLET_MNEMONIC= "your 12/24 words"   (or HD_WALLET_XPRV= xprv...)
 *   USDT_TRC20_CONTRACT= TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t
 *   USDT_MASTER_WALLET=  Txxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
 *   TRONGRID_API_KEY=    ...
 *   TRON_NODE=           https://api.trongrid.io   (optional)
 */

/* eslint-disable @typescript-eslint/no-var-requires */
const bip39 = require('bip39');
const ecc = require('tiny-secp256k1');
const BIP32pkg = require('bip32');

// bip32 factory (handles both modern and older builds)
const BIP32Factory = BIP32pkg.BIP32Factory ? BIP32pkg.BIP32Factory : BIP32pkg;
const bip32 = BIP32Factory(ecc);

// robust TronWeb constructor detection (works with CJS/ESM builds)
const tronwebMod = require('tronweb');
const TronWeb: any = tronwebMod.TronWeb || tronwebMod.default || tronwebMod;

// ---- config ----
const DEFAULT_PATH = "m/44'/195'/0'/0/"; // TRON coin-type 195

function getRootNode() {
  const xprv = (process.env.HD_WALLET_XPRV || '').trim();
  const mnemonic = (process.env.HD_WALLET_MNEMONIC || '').trim();
  if (xprv) {
    try {
      return bip32.fromBase58(xprv);
    } catch {
      throw new Error('Invalid HD_WALLET_XPRV');
    }
  }
  if (mnemonic) {
    if (!bip39.validateMnemonic(mnemonic)) {
      throw new Error('HD_WALLET_MNEMONIC is not a valid BIP39 mnemonic');
    }
    const seed = bip39.mnemonicToSeedSync(mnemonic);
    return bip32.fromSeed(seed);
  }
  throw new Error('Set HD_WALLET_XPRV or HD_WALLET_MNEMONIC in .env.local');
}

function getPrivateKeyHex(index: number): string {
  if (!Number.isInteger(index) || index < 0) {
    throw new Error('Index must be a non-negative integer');
  }
  const root = getRootNode();
  const child = root.derivePath(DEFAULT_PATH + String(index));
  const pkBuf: Buffer =
    Buffer.isBuffer(child.privateKey) ? (child.privateKey as Buffer)
                                      : Buffer.from(child.privateKey as Uint8Array);
  if (!pkBuf || pkBuf.length !== 32) throw new Error('Derived key is not 32 bytes');
  return pkBuf.toString('hex'); // 64-char hex
}

async function run(): Promise<void> {
  const idxStr = process.argv[2];
  const index = Number(idxStr);
  if (!Number.isInteger(index)) {
    console.error('Usage: DOTENV_CONFIG_PATH=.env.local npx ts-node -r dotenv/config scripts/sweep-child.ts <ORDER_INDEX>');
    process.exit(1);
  }

  const CONTRACT = process.env.USDT_TRC20_CONTRACT || 'TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t';
  const TO = (process.env.USDT_MASTER_WALLET || process.env.USDT_WALLET || '').trim();
  const APIKEY = process.env.TRONGRID_API_KEY || '';
  const FULL_HOST = process.env.TRON_NODE || 'https://api.trongrid.io';

  if (!TO) throw new Error('Set USDT_MASTER_WALLET (or USDT_WALLET) in env');
  if (!APIKEY) console.warn('⚠️  TRONGRID_API_KEY not set; calls may be rate-limited');

  const pkHex = getPrivateKeyHex(index);

  // TronWeb client with child key (to sign)
  const tronWeb = new TronWeb({
    fullHost: FULL_HOST,
    headers: { 'TRON-PRO-API-KEY': APIKEY },
    privateKey: pkHex,
  });

  // Derive base58 "T..." address from the private key using instance util
  const from: string = tronWeb.address.fromPrivateKey(pkHex);

  console.log('Child index :', index);
  console.log('From (child):', from);
  console.log('To (master) :', TO);
  console.log('USDT ctrct  :', CONTRACT);

  // USDT contract
  const usdt = await tronWeb.contract().at(CONTRACT);

  // Read balance (raw 6 decimals)
  const balRaw = await usdt.balanceOf(from).call();
  const balStr = balRaw && balRaw.toString ? balRaw.toString() : String(balRaw || '0');
  const bal = BigInt(balStr);
  console.log('USDT balance (raw):', bal.toString(), '(decimals=6)');

  if (bal === 0n) {
    console.log('No USDT to sweep.');
    return;
  }

  // Ensure gas (TRX) present
  const trxBal: number = await tronWeb.trx.getBalance(from); // in SUN (1e6 = 1 TRX)
  console.log('TRX balance :', (trxBal / 1e6).toFixed(6), 'TRX');
  if (trxBal < 5e6) {
    console.log('❌ Not enough TRX for fee. Send ~10 TRX to', from, 'then re-run.');
    return;
  }

  console.log('➡️  Sweeping full USDT to master…');
  const txid: string = await usdt.transfer(TO, bal).send({
    feeLimit: 50_000_000,   // 50 TRX cap (you’ll pay only what’s used)
    shouldPollResponse: true,
  });
  console.log('✅ Sweep TXID:', txid);
}

run().catch((e: any) => {
  console.error('💥 Sweep error:', e?.message || e);
  process.exit(1);
});