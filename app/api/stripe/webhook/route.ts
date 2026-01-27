export const runtime = 'nodejs'; // ← Change from 'edge' to 'nodejs'
export const dynamic = 'force-dynamic';

import { NextResponse } from "next/server";
import Stripe from "stripe";

export async function POST(req: Request) {
  const stripeKey = process.env.STRIPE_SECRET_KEY;
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  
  if (!stripeKey || !secret) return NextResponse.json({ error: "Config error" }, { status: 500 });
  const stripe = new Stripe(stripeKey, { apiVersion: "2025-08-27.basil" });

  const body = await req.text();
  const sig = req.headers.get("stripe-signature") || "";

  try {
    const event = stripe.webhooks.constructEvent(body, sig, secret);
    
    if (event.type === "checkout.session.completed") {
        const session = event.data.object as Stripe.Checkout.Session;
        // ✅ Logic to update Firebase/Database goes here
        console.log("💰 Payment Success:", session.id);
    }

    return NextResponse.json({ ok: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}