import Stripe from "stripe";

const SETUP_PRICE_MAP: Record<string, string> = {
  "10": "price_1SSyQORmR6ESDQvobwheaXws",
  "20": "price_1SSyRGRmR6ESDQvoKgAI9CAN",
  "30": "price_1SSyUORmR6ESDQvo7dzPKmPt",
};

export async function onRequestPost(context: any) {
  const { request, env } = context;
// 🕵️ DEBUG LOG: List all keys found in env (not values, just names)
  console.log("🔑 Available Env Keys:", Object.keys(env));
  console.log("💳 Checking Stripe Key:", env.STRIPE_SECRET_KEY ? "EXISTS" : "MISSING");
  // FIXED: Ensure key exists before creating Stripe instance
  const stripeKey = env.STRIPE_SECRET_KEY;
  if (!stripeKey) {
    console.error("❌ ERROR: STRIPE_SECRET_KEY is missing from .dev.vars or Dashboard");
    return new Response(JSON.stringify({ error: "Payment system not configured" }), { status: 500 });
  }

  const stripe = new Stripe(stripeKey, { 
    // @ts-ignore
    apiVersion: "2023-10-16" 
  });

  try {
    const { userId, plan, email } = await request.json();
    const priceId = SETUP_PRICE_MAP[plan];

    if (!priceId) {
      return new Response(JSON.stringify({ error: "Invalid plan" }), { status: 400 });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: [{ price: priceId, quantity: 1 }],
      customer_email: email,
      success_url: `${env.NEXT_PUBLIC_SITE_URL}/client/dashboard?payment=success`,
      cancel_url: `${env.NEXT_PUBLIC_SITE_URL}/client/dashboard?payment=canceled`,
      metadata: { userId, plan },
    });

    return new Response(JSON.stringify({ success: true, url: session.url }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error: any) {
    console.error("Stripe Session Error:", error.message);
    return new Response(JSON.stringify({ error: "Stripe error" }), { status: 500 });
  }
}