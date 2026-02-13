import Stripe from "stripe";
import { execute } from '../../../backend-lib/db-simple';
import { sendOrderConfirmation } from '../../../backend-lib/email';

const SETUP_CREDITS: Record<string, number> = {
  "price_1SVbAXDoB4i1qeaLC32KJQ6L": 10,
  "price_1SVWWXDoB4i1qeaL2dquhtfv": 20,
  "price_1SSyUORmR6ESDQvo7dzPKmPt": 30,
};
const SCALPER_PRICE_ID = "price_1S2fSQRmR6ESDQvoNeQ2sFdD";
// Check this matches your create-session.ts
const MONTHLY_PLAN_ID = "price_1S1bt8DoB4i1qeaL1PzseHYf"; 

export async function onRequestPost(context: any) {
  const { request, env } = context;
  const stripe = new Stripe(env.STRIPE_SECRET_KEY, { 
    // @ts-ignore
    apiVersion: "2024-06-20",
    httpClient: Stripe.createFetchHttpClient(),
  });
  
  const sig = request.headers.get("stripe-signature") || "";
  const body = await request.text();

  try {
    const event = await stripe.webhooks.constructEventAsync(body, sig, env.STRIPE_WEBHOOK_SECRET);

    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;
      await handleCheckoutCompleted(session, stripe, env);
    }
    return new Response(JSON.stringify({ received: true }), { status: 200 });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), { status: 400 });
  }
}

async function handleCheckoutCompleted(session: Stripe.Checkout.Session, stripe: Stripe, env: any) {
  const userId = session.metadata?.userId || 'guest';
  const customerEmail = session.customer_details?.email || session.customer_email;
  const sessionId = session.id;

  if (!customerEmail) return;

  try {
    const lineItems = await stripe.checkout.sessions.listLineItems(sessionId);
    const priceId = lineItems.data[0]?.price?.id || "";
    
    let generatedKey: string | undefined = undefined;
    let expiryDate: string | undefined = undefined;
    let prodName = "Setup Plan";

    // 1. ENSURE USER ROW EXISTS (Upsert for Guests)
    // This creates the row if it's a new email, otherwise does nothing
    await execute(
      `INSERT OR IGNORE INTO users (id, email, created_at, updated_at, setup_count) VALUES (?, ?, datetime('now'), datetime('now'), 0)`,
      [userId === 'guest' ? crypto.randomUUID() : userId, customerEmail]
    );

    // === LOGIC A: MONTHLY SUBSCRIPTION (License Key) ===
    if (priceId === MONTHLY_PLAN_ID) {
      prodName = "AI Assistant Pro (1 Month)";
      generatedKey = `MZ-PRO-${Math.random().toString(36).toUpperCase().substring(2, 10)}`;
      
      const d = new Date();
      d.setDate(d.getDate() + 30);
      expiryDate = d.toISOString();

      console.log(`🔑 GUEST LICENSE ACTIVATED: ${generatedKey} for ${customerEmail}`);

      await execute(
        `UPDATE users SET license_type = 'pro', license_key = ?, license_expires_at = ?, updated_at = datetime('now') WHERE email = ?`,
        [generatedKey, expiryDate, customerEmail]
      );
    } 

    // === LOGIC B: SETUP CREDITS (Stays working) ===
    else {
      const setupsToAdd = SETUP_CREDITS[priceId] || 10;
      await execute(
        "UPDATE users SET setup_count = setup_count + ?, updated_at = datetime('now') WHERE email = ?",
        [setupsToAdd, customerEmail]
      );
    }

    // AUDIT LOG
    await execute(
      `INSERT INTO stripe_purchases (user_id, stripe_session_id, price_id, setup_count, amount_paid, customer_email, status, created_at, updated_at) 
       VALUES (?, ?, ?, ?, ?, ?, 'completed', datetime('now'), datetime('now'))`,
      [userId, sessionId, priceId, (priceId === MONTHLY_PLAN_ID ? 999 : 10), (session.amount_total || 0) / 100, customerEmail]
    );
if (priceId === SCALPER_PRICE_ID) {
    prodName = "MZPrimer Scalper X1 (V.1)";
    
    // Mark ownership in DB
    await execute("UPDATE users SET has_scalper_x1 = 1 WHERE email = ?", [customerEmail]);

    // ✅ Generate the SECURE link for the email
    // This link only works if the session_id exists in the stripe_purchases table
    const secureDownloadLink = `https://mzprimer.com/api/download-robot?session_id=${sessionId}`;

    await sendOrderConfirmation({
      to: customerEmail,
      orderId: sessionId,
      productName: prodName,
      amountPaid: (session.amount_total || 0) / 100,
      downloadUrl: secureDownloadLink // Passed to the Gold email template
    }, env);
}
    // DISPATCH PROFESSIONAL EMAIL (Resend)
    await sendOrderConfirmation({
      to: customerEmail,
      orderId: sessionId,
      productName: prodName,
      amountPaid: (session.amount_total || 0) / 100,
      licenseKey: generatedKey,
      licenseExpiry: expiryDate
    }, env);

  } catch (err: any) {
    console.error("💥 Webhook Error:", err.message);
  }
}