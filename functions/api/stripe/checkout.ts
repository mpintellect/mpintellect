// functions/api/stripe/checkout.ts (Move from app/api/stripe/checkout/route.ts)

import Stripe from "stripe";
// FIXED: Path updated for /functions folder structure
import { PRODUCT_PRICES } from "../../../app/lib/product-prices"; 

/**
 * FIXED:
 * 1. Changed to onRequestPost(context: any)
 * 2. Destructured { request, env } to define variables
 * 3. Removed Next.js specific 'NextResponse', 'runtime', and 'dynamic'
 */
export async function onRequestPost(context: any) {
  const { request, env } = context;

  // Access keys from Cloudflare 'env'
  const stripeKey = env.STRIPE_SECRET_KEY;
  const siteUrl = env.NEXT_PUBLIC_SITE_URL || "https://mpintellect.com";

  if (!stripeKey) {
    return Response.json({ error: "Stripe Config error" }, { status: 500 });
  }

  // Initialize Stripe inside the handler
  const stripe = new Stripe(stripeKey, { 
    // @ts-ignore
    apiVersion: "2024-06-20" 
  });

  try {
    const { priceId, orderId } = await request.json();
    const product = PRODUCT_PRICES[priceId as keyof typeof PRODUCT_PRICES];

    if (!product) {
      return Response.json({ error: "Invalid product" }, { status: 400 });
    }

    // Create Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${siteUrl}/success?order=${orderId}`,
      cancel_url: `${siteUrl}/cancel`,
      metadata: { orderId, productName: product.name },
    });

    return Response.json({ sessionId: session.id, url: session.url });
  } catch (error: any) {
    console.error("Stripe Checkout Error:", error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}