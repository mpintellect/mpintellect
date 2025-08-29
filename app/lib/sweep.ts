// app/lib/sweep.ts
import TronWebMod from 'tronweb';
import { getPrivateKeyHex } from '../lib/hdwallet';

const TronWeb: any = (TronWebMod as any).TronWeb || (TronWebMod as any).default || (TronWebMod as any);

const FULL_HOST = process.env.TRON_NODE || 'https://api.trongrid.io';
const APIKEY    = process.env.TRONGRID_API_KEY || '';
const CONTRACT  = process.env.USDT_TRC20_CONTRACT || 'TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t';
const MASTER    = (process.env.USDT_MASTER_WALLET || process.env.USDT_WALLET || '').trim();

if (!MASTER) {
  console.warn('[sweep] Missing USDT_MASTER_WALLET (or USDT_WALLET) in env.');
}

/** Sweep full USDT from child index to MASTER. Returns { txid } or throws. */
export async function sweepChildToMaster(index: number): Promise<{ txid: string }> {
  if (!Number.isInteger(index) || index < 0) {
    throw new Error('sweepChildToMaster: index must be a non-negative integer');
  }
  if (!MASTER) throw new Error('USDT master wallet not set');

  const pkHex = getPrivateKeyHex(index);

  const tronWeb = new TronWeb({
    fullHost: FULL_HOST,
    headers: { 'TRON-PRO-API-KEY': APIKEY },
    privateKey: pkHex,
  });

  const from = tronWeb.address.fromPrivateKey(pkHex);
  const usdt = await tronWeb.contract().at(CONTRACT);

  // read USDT balance
  const balRaw = await usdt.balanceOf(from).call();
  const balStr = balRaw && balRaw.toString ? balRaw.toString() : String(balRaw || '0');
  const bal = BigInt(balStr);

  if (bal === 0n) {
    return { txid: '' }; // nothing to sweep
  }

  // ensure some TRX is present (manual top-up for now)
  const trxBal = await tronWeb.trx.getBalance(from);
  if (trxBal < 5e6) { // < 5 TRX
    throw new Error(`Not enough TRX on child ${from}. Send ~10 TRX then retry sweep.`);
  }

  const txid = await usdt.transfer(MASTER, balStr).send({
    feeLimit: 50_000_000, // 50 TRX cap (you’ll pay only what’s used)
    shouldPollResponse: true,
  });

  return { txid: String(txid) };
}