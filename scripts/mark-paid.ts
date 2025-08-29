// scripts/mark-paid.ts
import 'dotenv/config';
import { ensureOrdersHydrated, getOrder, updateOrder, issueDownloadToken } from '../app/lib/orders';

async function main() {
  const orderId = process.argv[2];
  if (!orderId) {
    console.error('Usage: npx ts-node -r dotenv/config scripts/mark-paid.ts <ORDER_ID>');
    process.exit(1);
  }

  await ensureOrdersHydrated();

  const o = getOrder(orderId);
  if (!o) {
    console.error('Order not found:', orderId);
    process.exit(1);
  }

  if (o.status !== 'paid') {
    updateOrder(orderId, { status: 'paid', txid: 'test-tx-'+Date.now() });
  }

  const { rawToken, expiresAt } = issueDownloadToken(orderId, 24 * 3600);
  console.log('✅ Marked PAID:', orderId);
  console.log('→ token:', rawToken);
  console.log('→ tokenExpiresAt:', new Date(expiresAt).toISOString());
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});