import Stripe from "stripe";

// MASTER PRICE MAPPING (Must match product IDs exactly)
const PRODUCT_PRICE_MAP: Record<string, string> = {
  // Tools (Subscriptions)
  "ai-assistant-monthly": "price_1S1bt8DoB4i1qeaL1PzseHYf",
  

  // Robots (One-Time)
  "scalper-x1": "price_1T0O51DoB4i1qeaLzAaAErAr", 
  "fibonacci-pro": "price_1SVWWXDoB4i1qeaL2dquhtfv",
  "trend-seeker-ai": "price_1SVbAXDoB4i1qeaLC32KJQ6L",
  "hedge-matrix": "price_1SSyUORmR6ESDQvo7dzPKmPt",

  // Legacy Setup Bundles
  "10": "price_1SVbAXDoB4i1qeaLC32KJQ6L",
  "20": "price_1SVWWXDoB4i1qeaL2dquhtfv",
  "30": "price_1SVWUlDoB4i1qeaLabDsRHo2",
};

export async function onRequestPost(context: any) {
  const { request, env } = context;
  const stripe = new Stripe(env.STRIPE_SECRET_KEY, { 
    // @ts-ignore
    apiVersion: "2024-06-20" 
  });

  try {
    const body = await request.json().catch(() => ({}));
    const { userId, plan, email, productId, buyerName } = body;
    
    // Use productId if provided, otherwise fallback to plan
    const lookupKey = productId || plan;
    
    // Get price ID from master mapping
    const priceId = PRODUCT_PRICE_MAP[lookupKey];

    if (!priceId) {
      console.error(`❌ Mapping Failed: No Stripe Price found for ID: ${lookupKey}`);
      return new Response(JSON.stringify({ 
        error: `The product '${lookupKey}' is not correctly linked to Stripe. Check your price mapping.` 
      }), { status: 400 });
    }

    const url = new URL(request.url);
    const origin = env.NEXT_PUBLIC_SITE_URL || url.origin;
    
    // Determine product types
    const isSub = lookupKey === "ai-assistant-monthly" || lookupKey === "ai-assistant-pro";
    const isRobot = lookupKey === "scalper-x1" || lookupKey === "fibonacci-pro" || 
                    lookupKey === "trend-seeker-ai" || lookupKey === "hedge-matrix";

    console.log(`💰 Creating ${isSub ? 'Subscription' : isRobot ? 'Robot One-time' : 'Setup Bundle'} for: ${lookupKey}`);

    // ✅ SUCCESS URL - conditional based on product type
    const successUrl = isSub || isRobot
      ? `${origin}/thank-you?session_id={CHECKOUT_SESSION_ID}`
      : `${origin}/thank-you?payment=success&session_id={CHECKOUT_SESSION_ID}`;

    // ✅ CANCEL URL - conditional based on product type
    const cancelUrl = isSub 
      ? `${origin}/checkout?status=canceled`  // AI Assistant subscriptions
      : `${origin}/client/dashboard?status=canceled`; // Robots & Setup bundles

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: isSub ? "subscription" : "payment",
      line_items: [{ price: priceId, quantity: 1 }],
      customer_email: email || undefined,
      success_url: successUrl,
      cancel_url: cancelUrl,
      metadata: { 
        userId: userId || email || "guest", 
        plan: lookupKey,
        productId: lookupKey,
        buyerName: buyerName || "Trader"
      },
    });

    console.log(`✅ Checkout session created successfully for ${lookupKey}`);
    
    return new Response(JSON.stringify({ ok: true, url: session.url }), { 
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error: any) {
    console.error("❌ Stripe Session Error:", error.message);
    return new Response(JSON.stringify({ error: error.message }), { 
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

export async function onRequestOptions() {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}