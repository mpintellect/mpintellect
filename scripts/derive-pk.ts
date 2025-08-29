// scripts/derive-pk.ts
import 'dotenv/config';
import { getPrivateKeyHex } from '../app/lib/hdwallet';

// Usage: npx ts-node -r dotenv/config scripts/derive-pk.ts <depositIndex>
(async () => {
  const arg = process.argv[2];
  if (!arg) {
    console.error('Usage: npx ts-node -r dotenv/config scripts/derive-pk.ts <depositIndex>');
    process.exit(1);
  }
  const index = Number(arg);
  if (!Number.isInteger(index) || index < 0) {
    console.error('depositIndex must be a non-negative integer');
    process.exit(1);
  }

  const pkHex = getPrivateKeyHex(index);
  console.log(pkHex); // 64-hex chars (DO NOT SHARE)
})();