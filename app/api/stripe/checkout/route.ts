export const runtime = 'edge';
export const dynamic = 'force-dynamic';

import { NextResponse } from "next/server";
import Stripe from "stripe";
import { PRODUCT_PRICES } from "@/app/lib/product-prices"; 

export async function POST(req: Request) {
  // ✅ Move initialization inside
  const stripeKey = process.env.STRIPE_SECRET_KEY;
  if (!stripeKey) return NextResponse.json({ error: "Config error" }, { status: 500 });
  const stripe = new Stripe(stripeKey, { apiVersion: "2025-08-27.basil" });

  try {
    const { priceId, orderId } = await req.json();
    const product = PRODUCT_PRICES[priceId as keyof typeof PRODUCT_PRICES];

    if (!product) return NextResponse.json({ error: "Invalid product" }, { status: 400 });

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/success?order=${orderId}`,
      cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/cancel`,
      metadata: { orderId, productName: product.name },
    });

    return NextResponse.json({ sessionId: session.id });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}