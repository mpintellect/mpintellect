// functions/api/webhooks/stripe.ts

import Stripe from "stripe";
import { execute, queryOne } from "../../../backend-lib/db-simple";
import { sendOrderConfirmation } from "../../../backend-lib/email";

// Ensure these match your Stripe Dashboard exactly
const SETUP_CREDITS: Record<string, number> = {
  "price_1SSyQORmR6ESDQvobwheaXws": 10,
  "price_1SSyRGRmR6ESDQvoKgAI9CAN": 20,
  "price_1SSyUORmR6ESDQvo7dzPKmPt": 30,
};

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
    // 1. Verify Signature (Async for Cloudflare)
    const event = await stripe.webhooks.constructEventAsync(
      body, 
      sig, 
      env.STRIPE_WEBHOOK_SECRET_CHATBOT
    );

    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;
      
      // 2. Await the database and email process
      await handleCheckoutCompleted(session, stripe, env);
    }

    return new Response(JSON.stringify({ received: true }), { status: 200 });
  } catch (err: any) {
    console.error("❌ Webhook Signature Error:", err.message);
    return new Response(JSON.stringify({ error: err.message }), { status: 400 });
  }
}

async function handleCheckoutCompleted(session: Stripe.Checkout.Session, stripe: Stripe, env: any) {
  const userId = session.metadata?.userId;
  const customerEmail = session.customer_details?.email || session.customer_email;
  const sessionId = session.id;

  if (!userId || !customerEmail) {
    console.error("❌ Metadata missing in Stripe session");
    return;
  }

  try {
    // 1. Get Product Details from Stripe
    const lineItems = await stripe.checkout.sessions.listLineItems(sessionId);
    const priceId = lineItems.data[0]?.price?.id || "";
    const setupsToAdd = SETUP_CREDITS[priceId] || 10;
    const now = Date.now();

    console.log(`📡 D1: crediting ${setupsToAdd} setups to ${userId}`);

    // 2. Update User Credits
    await execute(
      "UPDATE users SET setup_count = setup_count + ?, updated_at = datetime('now'), last_purchase_at = ? WHERE id = ?",
      [setupsToAdd, now, userId]
    );

    // 3. Record Purchase (FIXED: Fills all NOT NULL columns from your schema)
    await execute(
      `INSERT INTO stripe_purchases (
        user_id, stripe_session_id, price_id, setup_count, amount_paid, 
        currency, customer_email, status, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, 'completed', ?, ?)`,
      [
        userId,
        sessionId,
        priceId,
        setupsToAdd,
        (session.amount_total || 0) / 100,
        session.currency?.toUpperCase() || 'EUR',
        customerEmail,
        now,
        now
      ]
    );

    // 4. Send Confirmation Email (Awaited)
    console.log(`📧 Sending receipt to: ${customerEmail}`);
    await sendOrderConfirmation({
      to: customerEmail,
      orderId: sessionId,
      productName: `${setupsToAdd} Setup Plan`,
      amountPaid: (session.amount_total || 0) / 100,
    }, env);

    console.log("✅ Webhook Handled Successfully");

  } catch (err: any) {
    console.error("💥 handleCheckoutCompleted Fatal Error:", err.message);
  }
}