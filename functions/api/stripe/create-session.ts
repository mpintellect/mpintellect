import Stripe from "stripe";

const SETUP_PRICE_MAP: Record<string, string> = {
  "10": "price_1SVbAXDoB4i1qeaLC32KJQ6L",
  "20": "price_1SVWWXDoB4i1qeaL2dquhtfv",
  "30": "price_1SVWUlDoB4i1qeaLabDsRHo2",
};

export async function onRequestPost(context: any) {
  const { request, env } = context;

  // 1. Initialize Stripe safely
  const stripeKey = env.STRIPE_SECRET_KEY;
  if (!stripeKey) {
    return new Response(JSON.stringify({ error: "Stripe Secret Key missing in Cloudflare Functions settings" }), { 
      status: 500, 
      headers: { 'Content-Type': 'application/json' } 
    });
  }

  const stripe = new Stripe(stripeKey, { 
    // @ts-ignore
    apiVersion: "2024-06-20" 
  });

  try {
    // 2. Safe JSON parsing
    const body = await request.json().catch(() => ({}));
    const { userId, plan, email } = body;
    const priceId = SETUP_PRICE_MAP[plan];

    if (!priceId || !userId) {
      return new Response(JSON.stringify({ error: "Missing plan or userId" }), { status: 400 });
    }

    // 3. THE CRITICAL FIX: Ensure Absolute URLs for Stripe
    // If NEXT_PUBLIC_SITE_URL is missing, we use the current request's origin
    const url = new URL(request.url);
    const origin = env.NEXT_PUBLIC_SITE_URL || url.origin;

    console.log(`💰 Creating Stripe session for User: ${userId}, Plan: ${plan}`);

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: [{ price: priceId, quantity: 1 }],
      customer_email: email || undefined,
      success_url: `${origin}/client/dashboard?payment=success&session_id={CHECKOUT_SESSION_ID}&plan=${plan}&action=checkout`,
      cancel_url: `${origin}/client/dashboard?payment=canceled`,
      metadata: { 
        userId: userId, 
        plan: plan 
      },
    });

    // 4. Return with CORS headers to ensure the browser allows the redirect
    return new Response(JSON.stringify({ success: true, url: session.url }), {
      status: 200,
      headers: { 
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type'
      }
    });

  } catch (error: any) {
    console.error("❌ Stripe Production Error:", error.message);
    return new Response(JSON.stringify({ 
      error: "Stripe API Failure", 
      details: error.message 
    }), { status: 500 });
  }
}

// Handle pre-flight OPTIONS request for CORS
export async function onRequestOptions() {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Max-Age': '86400',
    },
  });
}