import { NextResponse } from "next/server";
import Stripe from "stripe";
import { sendOrderConfirmation } from "@/app/lib/email";
import { adminDb } from "../../../lib/firebaseAdmin";
import { Timestamp } from "firebase-admin/firestore";
import { createLicense } from "@/app/lib/firebase/licenses";
import { trackUsage } from "@/app/lib/firebase/analytics";
import { PRODUCT_PRICES } from "../../../lib/product-prices";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {});

export async function POST(req: Request) {
  const sig = req.headers.get("stripe-signature") || "";
  const secret = process.env.STRIPE_WEBHOOK_SECRET_CHATBOT || "";

  if (!secret) {
    console.error("❌ Missing STRIPE_WEBHOOK_SECRET_CHATBOT");
    return NextResponse.json({ error: "Webhook secret not configured" }, { status: 500 });
  }

  const body = await req.text();
  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, sig, secret);
  } catch (err: any) {
    console.error("❌ Webhook signature verification failed:", err.message);
    return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 });
  }

  console.log(`✅ Webhook received: ${event.type}`);

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        await handleCheckoutSessionCompleted(session);
        return NextResponse.json({ received: true, handled: event.type });
      }

      case "payment_intent.succeeded":
      case "charge.succeeded":
      case "payment_intent.created":
      case "charge.updated": {
        console.log(`ℹ️ Event: ${event.type}`);
        return NextResponse.json({ received: true, handled: event.type });
      }

      default:
        console.log(`⚪ Unhandled event type: ${event.type}`);
        return NextResponse.json({ received: true, ignored: event.type });
    }
  } catch (error: any) {
    console.error("❌ Webhook handler error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

async function handleCheckoutSessionCompleted(session: Stripe.Checkout.Session) {
  console.log("🔄 Processing checkout.session.completed");

  const orderId = session.metadata?.orderId || null;
  const customerEmail = session.customer_details?.email;
  const amountTotal = session.amount_total ? session.amount_total / 100 : 0;

  if (!customerEmail) {
    console.error("❌ No customer email found in session");
    return;
  }

  try {
    // Get product info from line items
    const lineItems = await stripe.checkout.sessions.listLineItems(session.id);
    const priceId = lineItems.data[0]?.price?.id;

    if (!priceId) {
      console.error("❌ No price ID found in line items");
      return;
    }

    const productConfig = PRODUCT_PRICES[priceId as keyof typeof PRODUCT_PRICES];

    if (!productConfig) {
      console.log(`⚪ Ignoring non-AI Assistant product: ${priceId}`);
      return;
    }

    console.log("🎯 Processing AI Assistant purchase:", {
      email: customerEmail,
      product: productConfig.name,
      priceId,
      amount: amountTotal,
      orderId,
    });

    // Generate license key
    const licenseKey = generateLicenseKey();

    // Calculate expiration date
    const expiresAt = calculateExpirationDate(productConfig.duration);

    // ✅ Store license in Firebase
    await createLicense({
      email: customerEmail,
      licenseKey,
      productName: productConfig.name,
      expiresAt: Timestamp.fromDate(expiresAt),
      stripeSessionId: session.id,
      priceId,
      orderId,
    });

    // ✅ Track analytics
    await trackUsage({
      userId: customerEmail,
      licenseKey,
      action: "payment_success",
      productName: productConfig.name,
      amount: amountTotal,
      orderId,
    });

    console.log("📝 License saved to Firebase:", licenseKey);

    // ✅ Send confirmation email
    const emailDetails = {
      to: customerEmail,
      orderId: orderId || session.id,
      productName: productConfig.name,
      amountPaid: amountTotal,
      licenseKey,
      paymentDetails: {
        wallet: "Stripe Payment",
        amount: amountTotal,
        network: "Card Payment",
        txId: session.payment_intent as string,
      },
    };

    try {
      await sendOrderConfirmation(emailDetails);
      console.log(`✅ Confirmation email sent to ${customerEmail}`);
    } catch (emailError) {
      console.error("❌ Failed to send confirmation email:", emailError);
    }
  } catch (error: any) {
    console.error("❌ Error processing checkout session:", error);
  }
}

function generateLicenseKey(): string {
  const prefix = "MZP-AI-";
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let result = "";
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return prefix + result;
}

function calculateExpirationDate(duration: string): Date {
  const expiresAt = new Date();

  switch (duration) {
    case "5d":
      expiresAt.setDate(expiresAt.getDate() + 5);
      break;
    case "24h":
    default:
      expiresAt.setHours(expiresAt.getHours() + 24);
      break;
  }

  return expiresAt;
}