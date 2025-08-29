// scripts/verify-mnemonic.ts
import * as bip39 from 'bip39';

const m = process.env.HD_WALLET_MNEMONIC?.trim() || '';
console.log('Mnemonic set?', !!m);
console.log('Valid?', bip39.validateMnemonic(m));