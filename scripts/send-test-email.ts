import 'dotenv/config'; // loads .env / .env.local
import { sendOrderConfirmation } from '../app/lib/email'; // note the .ts suffix

const to = process.argv[2];
if (!to) {
  console.error('Usage: npx ts-node --esm scripts/send-test-email.ts you@example.com');
  process.exit(1);
}

(async () => {
  try {
    await sendOrderConfirmation({
      to,
      orderId: 'test-123',
      productName: 'AI Assistant – Monthly',
      amountPaid: 10,
      // include a licenseKey to trigger the Subscription template
      licenseKey: 'TEST-LICENSE-1234',
      assistantUrl: 'http://localhost:3000/tools/ai-assistant?activate=1',
      paymentDetails: { wallet: 'Stripe', amount: 10, txId: 'manual-test', network: 'Card' },
    });
    console.log('✅ Test email sent (check your inbox / SMTP logs)');
  } catch (e) {
    console.error('💥 send test failed:', e);
    process.exit(1);
  }
})();