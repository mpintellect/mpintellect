export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

import { NextResponse } from "next/server";
import Stripe from "stripe";
// Note: If firebaseAdmin causes a build error later, we will need to 
// swap it for the Web SDK, but for now, the Stripe fix is the priority.
import { adminDb } from "@/app/lib/firebaseAdmin";
import { sendOrderConfirmation } from "@/app/lib/email";

// 🎁 Setup plans delivered after payment
const SETUP_PLANS: Record<string, number> = {
  "price_1SSyQORmR6ESDQvobwheaXws": 10, // €4.5 → 10 setups
  "price_1SSyRGRmR6ESDQvoKgAI9CAN": 20, // €8 → 20 setups
  "price_1SSyUORmR6ESDQvo7dzPKmPt": 30, // €12 → 30 setups
};

export async function POST(req: Request) {
  // ✅ 1. Initialize Stripe INSIDE the function
  const stripeKey = process.env.STRIPE_SECRET_KEY;
  const secret = process.env.STRIPE_WEBHOOK_SECRET_CHATBOT;

  if (!stripeKey || !secret) {
    console.error("❌ Missing Stripe Configuration");
    return NextResponse.json({ error: "Config missing" }, { status: 500 });
  }

  const stripe = new Stripe(stripeKey, {
    // @ts-ignore
    apiVersion: "2023-10-16", // Use a standard stable version
  });

  const sig = req.headers.get("stripe-signature") || "";
  const body = await req.text();
  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, sig, secret);
  } catch (err: any) {
    console.error("❌ Invalid webhook signature:", err.message);
    return NextResponse.json({ error: err.message }, { status: 400 });
  }

  console.log(`⚡ Stripe webhook event: ${event.type}`);

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    // ✅ 2. Pass the 'stripe' instance to the handler
    await handleCheckoutCompleted(session, stripe);
  }

  return NextResponse.json({ received: true });
}

// 🔥 CHECKOUT SUCCESS HANDLER
async function handleCheckoutCompleted(session: Stripe.Checkout.Session, stripe: Stripe) {
  console.log("🔄 Processing: checkout.session.completed");

  const uid = session.metadata?.uid;
  const customerEmail = session.customer_details?.email;

  if (!uid || !customerEmail) {
    console.error("❌ Missing uid or customerEmail in metadata");
    return;
  }

  try {
    // Fetch line items to get the priceId
    const lineItems = await stripe.checkout.sessions.listLineItems(session.id);
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

    // 🔥 Update Firestore setupCount
    const userRef = adminDb.collection("users").doc(uid);

    await adminDb.runTransaction(async (tx) => {
      const userDoc = await tx.get(userRef);
      const currentCount = userDoc.exists ? userDoc.data()?.setupCount || 0 : 0;

      tx.set(
        userRef,
        {
          setupCount: currentCount + setupsToAdd,
          updatedAt: new Date().toISOString(),
          lastPurchase: {
            amount: setupsToAdd,
            stripeSessionId: session.id,
          },
        },
        { merge: true }
      );
    });

    console.log(`🎉 Updated setupCount for UID ${uid}: +${setupsToAdd}`);

    // 💌 Send Order Confirmation Email
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
  } catch (err) {
    console.error("❌ Webhook processing error:", err);
  }

  console.log("✅ Checkout processing complete!");
}