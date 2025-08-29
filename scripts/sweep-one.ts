// scripts/sweep-one.ts
import 'dotenv/config';
import TronWeb from 'tronweb';
import { getPrivateKeyHex } from '../app/lib/hdwallet';

async function main() {
  const arg = process.argv[2];
  if (!arg) {
    console.error('Usage: npx ts-node -r dotenv/config scripts/sweep-one.ts <depositIndex>');
    process.exit(1);
  }
  const index = Number(arg);
  if (!Number.isInteger(index) || index < 0) {
    console.error('depositIndex must be a non-negative integer');
    process.exit(1);
  }

  const MASTER = process.env.USDT_MASTER_WALLET || process.env.USDT_WALLET;
  const CONTRACT = process.env.USDT_TRC20_CONTRACT;
  const API_KEY  = process.env.TRONGRID_API_KEY;

  if (!MASTER || !CONTRACT || !API_KEY) {
    throw new Error('Missing env: USDT_MASTER_WALLET/USDT_WALLET, USDT_TRC20_CONTRACT, TRONGRID_API_KEY');
  }

  const tronWeb = new TronWeb({
    fullHost: 'https://api.trongrid.io',
    headers: { 'TRON-PRO-API-KEY': API_KEY },
  });

  // derive child key + address
  const pkHex = getPrivateKeyHex(index);
  tronWeb.setPrivateKey(pkHex);
  const from = tronWeb.address.fromPrivateKey(pkHex);

  console.log('From (child):', from);
  console.log('To (master):', MASTER);

  // get USDT balance (raw 6 decimals)
  const ctr = await tronWeb.contract().at(CONTRACT);
  const balRaw = await ctr.balanceOf(from).call(); // BigNumber-like
  const bal = BigInt(balRaw.toString());
  if (bal === 0n) {
    console.log('No USDT to sweep.');
    return;
  }

  // Optional: show human-readable
  const decimals = Number(process.env.USDT_DECIMALS || 6);
  const human = Number(bal) / 10 ** decimals;
  console.log(`USDT balance: ${human} (raw: ${bal})`);

  // Send all
  console.log('Sending full balance to master...');
  const txid = await ctr.transfer(MASTER, bal).send({
    feeLimit: 30_000_000, // 30 TRX in SUN (1 TRX = 1,000,000 SUN)
  });

  console.log('Sweep txid:', txid);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});