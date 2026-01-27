export const runtime = 'edge'; // ✅ Must be edge for Cloudflare
export const dynamic = 'force-dynamic';

import { NextResponse } from "next/server";
import Stripe from "stripe";
import { PRODUCTS, createOrder } from "@/app/lib/orders"; // ✅ Use the @ alias

export async function POST(req: Request) {
  const stripeKey = process.env.STRIPE_SECRET_KEY;
  if (!stripeKey) return NextResponse.json({ error: "Config error" }, { status: 500 });
  const stripe = new Stripe(stripeKey, { apiVersion: "2025-08-27.basil" });

  try {
    const { productId, email, buyerName } = await req.json();
    if (!productId || !email) return NextResponse.json({ error: "Missing data" }, { status: 400 });

    const product = (Object.values(PRODUCTS) as any[]).find(p => p.id === productId);
    if (!product) return NextResponse.json({ error: "Unknown product" }, { status: 404 });

    const orderId = `ord_${Date.now()}`; // Simplified for build

    const session = await stripe.checkout.sessions.create({
      mode: product.id.includes("assistant") ? "subscription" : "payment",
      payment_method_types: ["card"],
      line_items: [{ price: process.env[`PRICE_${productId.toUpperCase().replace(/-/g, "_")}`] || "", quantity: 1 }],
      customer_email: email,
      success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/thank-you?orderId=${orderId}`,
      cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/checkout?canceled=true`,
      metadata: { orderId, productId, email },
    });

    return NextResponse.json({ ok: true, url: session.url });
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: err.message }, { status: 500 });
  }
}