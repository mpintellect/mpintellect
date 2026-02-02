import Stripe from "stripe";
// FIXED: Relative path for Functions folder
import { PRODUCTS } from "../../../app/lib/orders"; 

export async function onRequestPost(context: any) {
  const { request, env } = context;

  const stripeKey = env.STRIPE_SECRET_KEY;
  if (!stripeKey) return Response.json({ error: "Config error" }, { status: 500 });
  
  // Initialize Stripe
  const stripe = new Stripe(stripeKey, { 
    // @ts-ignore
    apiVersion: "2024-06-20" 
  });

  try {
    const { productId, email, buyerName } = await request.json();
    if (!productId || !email) return Response.json({ error: "Missing data" }, { status: 400 });

    const product = (Object.values(PRODUCTS) as any[]).find(p => p.id === productId);
    if (!product) return Response.json({ error: "Unknown product" }, { status: 404 });

    const orderId = `ord_${Date.now()}`;

    // FIXED: Dynamic price key lookup from env
    const priceEnvKey = `PRICE_${productId.toUpperCase().replace(/-/g, "_")}`;
    const priceId = env[priceEnvKey] || "";

    const session = await stripe.checkout.sessions.create({
      mode: product.id.includes("assistant") ? "subscription" : "payment",
      payment_method_types: ["card"],
      line_items: [{ price: priceId, quantity: 1 }],
      customer_email: email,
      success_url: `${env.NEXT_PUBLIC_SITE_URL}/thank-you?orderId=${orderId}`,
      cancel_url: `${env.NEXT_PUBLIC_SITE_URL}/checkout?canceled=true`,
      metadata: { orderId, productId, email, buyerName },
    });

    return Response.json({ ok: true, url: session.url });
  } catch (err: any) {
    console.error("Stripe Session Error:", err);
    return Response.json({ ok: false, error: err.message }, { status: 500 });
  }
}