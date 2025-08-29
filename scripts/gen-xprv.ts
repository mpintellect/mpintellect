import * as bip39 from 'bip39';
import BIP32Factory from 'bip32';
import * as ecc from 'tiny-secp256k1';

const bip32 = BIP32Factory(ecc);

(async () => {
  // 128 bits = 12 words. Use 256 for 24 words if you want stronger.
  const mnemonic = bip39.generateMnemonic(128);
  const seed = await bip39.mnemonicToSeed(mnemonic);
  const root = bip32.fromSeed(seed);

  const xprv = root.toBase58(); // <-- this is the master XPRV

  console.log('\n============================');
  console.log('   HD Wallet Seed (mnemonic)');
  console.log('============================\n');
  console.log(mnemonic, '\n');

  console.log('============================');
  console.log('   Master XPRV (keep secret!)');
  console.log('============================\n');
  console.log(xprv, '\n');

  console.log('Store XPRV in .env.local as:');
  console.log('HD_WALLET_XPRV="' + xprv + '"\n');
})();