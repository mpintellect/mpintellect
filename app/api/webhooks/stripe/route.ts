
// app/api/webhooks/stripe/route.ts - SIMPLIFIED CLOUDFLARE VERSION
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

import { NextResponse } from "next/server";
import Stripe from "stripe";
import { getDb, execute, queryOne } from "@/app/lib/cloudflare/db-simple";
import { sendOrderConfirmation } from "@/app/lib/email";

// 🎁 Setup plans for one-time purchases only
const SETUP_PLANS: Record<string, number> = {
  "price_1SSyQORmR6ESDQvobwheaXws": 10, // €4.5 → 10 setups
  "price_1SSyRGRmR6ESDQvoKgAI9CAN": 20, // €8 → 20 setups
  "price_1SSyUORmR6ESDQvo7dzPKmPt": 30, // €12 → 30 setups
};

export async function POST(req: Request) {
  // ✅ Initialize Stripe
  const stripeKey = process.env.STRIPE_SECRET_KEY;
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET_CHATBOT;

  if (!stripeKey || !webhookSecret) {
    console.error("❌ Missing Stripe Configuration");
    return NextResponse.json({ error: "Stripe configuration missing" }, { status: 500 });
  }

  const stripe = new Stripe(stripeKey, {
    // @ts-ignore
    apiVersion: "2023-10-16",
  });

  const sig = req.headers.get("stripe-signature") || "";
  const body = await req.text();
  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
  } catch (err: any) {
    console.error("❌ Invalid webhook signature:", err.message);
    return NextResponse.json({ error: err.message }, { status: 400 });
  }

  console.log(`⚡ Stripe webhook event: ${event.type}`);

  // Handle ONLY checkout.session.completed for one-time purchases
  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    await handleCheckoutCompleted(session, stripe);
  } else if (event.type === "payment_intent.succeeded") {
    const paymentIntent = event.data.object as Stripe.PaymentIntent;
    console.log(`✅ Payment succeeded: ${paymentIntent.id}`);
  } else if (event.type === "payment_intent.payment_failed") {
    const paymentIntent = event.data.object as Stripe.PaymentIntent;
    console.error(`❌ Payment failed: ${paymentIntent.id}`);
  } else {
    console.log(`ℹ️ Ignoring unhandled event type: ${event.type}`);
  }

  return NextResponse.json({ received: true });
}

// 🔥 CHECKOUT SUCCESS HANDLER - One-time purchases only
async function handleCheckoutCompleted(session: Stripe.Checkout.Session, stripe: Stripe) {
  console.log("🔄 Processing one-time purchase: checkout.session.completed");

  const userId = session.metadata?.userId || session.metadata?.uid;
  const customerEmail = session.customer_details?.email || session.customer_email;
  const sessionId = session.id;

  if (!userId || !customerEmail) {
    console.error("❌ Missing userId or customerEmail in metadata:", { userId, customerEmail });
    return;
  }

  try {
    // Fetch line items to get the priceId
    const lineItems = await stripe.checkout.sessions.listLineItems(sessionId);
    const priceId = lineItems.data[0]?.price?.id;

    if (!priceId) {
      console.error("❌ Missing Stripe Price ID");
      return;
    }

    const setupsToAdd = SETUP_PLANS[priceId];

    if (!setupsToAdd) {
      console.log("⚪ Non-setup product purchased → Ignored");
      return;
    }

    // Update user's setup count in Cloudflare D1
    const db = getDb();
    if (!db) {
      throw new Error("Database not available");
    }

    const now = Date.now();
    
    // 1. Get current setup count
    const user = await queryOne<{ setup_count: number; email: string }>(
      'SELECT setup_count, email FROM users WHERE id = ?',
      [userId]
    );

    if (!user) {
      console.error(`❌ User not found: ${userId}`);
      return;
    }

    const currentCount = user.setup_count || 0;
    const newCount = currentCount + setupsToAdd;

    // 2. Update user's setup count
    const updateResult = await execute(
      `UPDATE users 
       SET setup_count = ?, updated_at = ?, last_purchase_at = ?
       WHERE id = ?`,
      [newCount, now, now, userId]
    );

    if (!updateResult.success) {
      throw new Error("Failed to update user setup count");
    }

    // 3. Record the purchase in stripe_purchases table
    const purchaseResult = await execute(
      `INSERT INTO stripe_purchases 
       (user_id, stripe_session_id, price_id, setup_count, amount_paid, currency, 
        customer_email, status, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, 'completed', ?, ?)`,
      [
        userId,
        sessionId,
        priceId,
        setupsToAdd,
        (session.amount_total ?? 0) / 100,
        session.currency?.toUpperCase() || 'EUR',
        customerEmail,
        now,
        now
      ]
    );

    if (!purchaseResult.success) {
      throw new Error("Failed to record purchase");
    }

    // 4. Record setup credits addition for audit trail
    await execute(
      `INSERT INTO setup_credits_history 
       (user_id, change_amount, new_total, reason, stripe_session_id, created_at)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [
        userId,
        setupsToAdd,
        newCount,
        'stripe_purchase',
        sessionId,
        now
      ]
    );

    console.log(`🎉 Updated setupCount for user ${userId}: ${currentCount} → ${newCount} (+${setupsToAdd})`);

    // 💌 Send Order Confirmation Email
    try {
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

      console.log(`📧 Receipt sent to: ${customerEmail}`);
    } catch (emailError) {
      console.error("❌ Failed to send confirmation email:", emailError);
      // Don't fail the webhook if email fails
    }

    // Optional: Send real-time update to user if they're online
    try {
      await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/push/send`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          targetUserId: userId,
          title: '✅ Purchase Complete!',
          message: `You've received ${setupsToAdd} setup credits. Start using them now!`,
          url: '/client/dashboard'
        })
      });
    } catch (pushError) {
      console.warn("Failed to send push notification:", pushError);
    }

  } catch (err) {
    console.error("❌ Webhook processing error:", err);
    
    // Log the error
    try {
      await execute(
        `INSERT INTO stripe_webhook_errors 
         (event_type, stripe_session_id, user_id, error_message, created_at)
         VALUES (?, ?, ?, ?, ?)`,
        [
          'checkout.session.completed',
          session.id,
          userId,
          err instanceof Error ? err.message : 'Unknown error',
          Date.now()
        ]
      );
    } catch (logError) {
      console.error("Failed to log webhook error:", logError);
    }
  }

  console.log("✅ Checkout processing complete!");
}