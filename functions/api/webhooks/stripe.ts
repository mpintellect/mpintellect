// functions/api/webhooks/stripe.ts (Move from app/api/webhooks/stripe/route.ts)

import Stripe from "stripe";
import { getDb, execute, queryOne } from "../../../app/lib/cloudflare/db-simple";
import { sendOrderConfirmation } from "../../../app/lib/email";

// 🎁 Setup plans mapping
const SETUP_PLANS: Record<string, number> = {
  "price_1SSyQORmR6ESDQvobwheaXws": 10, 
  "price_1SSyRGRmR6ESDQvoKgAI9CAN": 20, 
  "price_1SSyUORmR6ESDQvo7dzPKmPt": 30, 
};

/**
 * Cloudflare Handler: onRequestPost
 */
export async function onRequestPost(context: any) {
  const { request, env } = context;

  // ✅ Initialize Stripe with keys from 'env'
  const stripeKey = env.STRIPE_SECRET_KEY;
  const webhookSecret = env.STRIPE_WEBHOOK_SECRET_CHATBOT;

  if (!stripeKey || !webhookSecret) {
    console.error("❌ Missing Stripe Configuration");
    return Response.json({ error: "Stripe configuration missing" }, { status: 500 });
  }

  const stripe = new Stripe(stripeKey, {
    // @ts-ignore
    apiVersion: "2023-10-16",
  });

  const sig = request.headers.get("stripe-signature") || "";
  const body = await request.text(); // Webhooks MUST use .text() for signature verification
  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
  } catch (err: any) {
    console.error("❌ Invalid webhook signature:", err.message);
    return Response.json({ error: err.message }, { status: 400 });
  }

  // Handle events
  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    // We pass 'env' to the helper so it can access the database
    await handleCheckoutCompleted(session, stripe, env);
  } 

  return Response.json({ received: true });
}

/**
 * Helper: Handle successful checkout
 */
async function handleCheckoutCompleted(session: Stripe.Checkout.Session, stripe: Stripe, env: any) {
  const userId = session.metadata?.userId || session.metadata?.uid;
  const customerEmail = session.customer_details?.email || session.customer_email;
  const sessionId = session.id;

  if (!userId || !customerEmail) return;

  try {
    const lineItems = await stripe.checkout.sessions.listLineItems(sessionId);
    const priceId = lineItems.data[0]?.price?.id;
    if (!priceId) return;

    const setupsToAdd = SETUP_PLANS[priceId];
    if (!setupsToAdd) return;

    const now = Date.now();
    
    // 1. Get current user
    const user = await queryOne<{ setup_count: number; email: string }>(
      'SELECT setup_count, email FROM users WHERE id = ?',
      [userId]
    );

    if (!user) return;

    const newCount = (user.setup_count || 0) + setupsToAdd;

    // 2. Update user (D1 SQL)
    await execute(
      `UPDATE users SET setup_count = ?, updated_at = ?, last_purchase_at = ? WHERE id = ?`,
      [newCount, now, now, userId]
    );

    // 3. Record purchase (D1 SQL)
    await execute(
      `INSERT INTO stripe_purchases 
       (user_id, stripe_session_id, price_id, setup_count, amount_paid, currency, customer_email, status, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, 'completed', ?, ?)`,
      [userId, sessionId, priceId, setupsToAdd, (session.amount_total ?? 0) / 100, session.currency?.toUpperCase() || 'EUR', customerEmail, now, now]
    );

    // 4. Record history
    await execute(
      `INSERT INTO setup_credits_history (user_id, change_amount, new_total, reason, stripe_session_id, created_at)
       VALUES (?, ?, ?, 'stripe_purchase', ?, ?)`,
      [userId, setupsToAdd, newCount, sessionId, now]
    );

    // 💌 Send Email
    await sendOrderConfirmation({
      to: customerEmail,
      orderId: session.id,
      productName: `${setupsToAdd} Setup Credits`,
      amountPaid: (session.amount_total ?? 0) / 100,
      paymentDetails: {
        wallet: "Stripe",
        amount: (session.amount_total ?? 0) / 100,
        network: "Card",
        txId: session.payment_intent as string,
      },
    });

    // 🔔 Send Internal Push (via internal fetch)
    const appUrl = env.NEXT_PUBLIC_APP_URL || "https://mzprimer.com";
    await fetch(`${appUrl}/api/push/send`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        targetUserId: userId,
        title: '✅ Purchase Complete!',
        message: `You've received ${setupsToAdd} setup credits.`,
        url: '/client/dashboard'
      })
    });

  } catch (err: any) {
    console.error("❌ Webhook error:", err);
    await execute(
      `INSERT INTO stripe_webhook_errors (event_type, stripe_session_id, user_id, error_message, created_at)
       VALUES (?, ?, ?, ?, ?)`,
      ['checkout.session.completed', session.id, userId, err.message, Date.now()]
    );
  }
}