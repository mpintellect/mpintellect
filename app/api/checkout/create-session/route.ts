// app/api/checkout/create-session/route.ts
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-08-27.basil",
});

// 🔐 Stripe Price IDs → Setup Credits
const PRICE_MAP: Record<string, string> = {
  "10": "price_1SVWXPDoB4i1qeaLkhaI09nB",   // €4.5 → 10 setups
  "20": "price_1SVWWXDoB4i1qeaL2dquhtfv",   // €8 → 20 setups
  "30": "price_1SVWUlDoB4i1qeaLabDsRHo2",   // €12 → 30 setups
};

export async function POST(req: NextRequest) {
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