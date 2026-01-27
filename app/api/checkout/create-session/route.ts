export const runtime = 'edge';
export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

// 🔐 Stripe Price IDs → Setup Credits
const PRICE_MAP: Record<string, string> = {
  "10": "price_1SVbAXDoB4i1qeaLC32KJQ6L",   // €4.5 → 10 setups
  "20": "price_1SVWWXDoB4i1qeaL2dquhtfv",   // €8 → 20 setups
  "30": "price_1SVWUlDoB4i1qeaLabDsRHo2",   // €12 → 30 setups
};

export async function POST(req: NextRequest) {
  // ✅ 1. Initialize Stripe INSIDE the request handler
  // This prevents the build from crashing if the key is missing at compile time
  const stripeKey = process.env.STRIPE_SECRET_KEY;
  
  if (!stripeKey) {
    console.error("❌ STRIPE_SECRET_KEY is missing");
    return NextResponse.json({ error: "Server configuration error" }, { status: 500 });
  }

  const stripe = new Stripe(stripeKey, {
    // @ts-ignore - basil versioning might need ignore for strict types
    apiVersion: "2025-08-27.basil",
  });

  try {
    const body = await req.json();
    const { uid, email, plan } = body;

    if (!uid || !email || !PRICE_MAP[plan]) {
      return NextResponse.json({ error: "Missing uid/email/plan" }, { status: 400 });
    }

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      line_items: [
        {
          price: PRICE_MAP[plan],
          quantity: 1,
        },
      ],
      metadata: {
        uid,
        email,
        plan,
      },
      success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/client/dashboard?success=true`,
      cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/client/dashboard?canceled=true`,
    });

    return NextResponse.json({ url: session.url });
  } catch (err: any) {
    console.error("❌ Stripe session error:", err);
    return NextResponse.json({ error: "Failed to create Stripe session" }, { status: 500 });
  }
}