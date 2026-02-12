import Stripe from "stripe";

const SETUP_PRICE_MAP: Record<string, string> = {
  "10": "price_1SVbAXDoB4i1qeaLC32KJQ6L",
  "20": "price_1SVWWXDoB4i1qeaL2dquhtfv",
  "30": "price_1SSyUORmR6ESDQvo7dzPKmPt",
  "ai-assistant-monthly": "price_1S1bt8DoB4i1qeaL1PzseHYf", 
};

export async function onRequestPost(context: any) {
  const { request, env } = context;
  const stripe = new Stripe(env.STRIPE_SECRET_KEY, { 
    // @ts-ignore
    apiVersion: "2024-06-20" 
  });

  try {
    const body = await request.json().catch(() => ({}));
    const { userId, plan, email, productId } = body;
    const lookupKey = plan || productId; 
    const priceId = SETUP_PRICE_MAP[lookupKey];

    const url = new URL(request.url);
    const origin = env.NEXT_PUBLIC_SITE_URL || url.origin;
    const isSub = lookupKey === "ai-assistant-monthly";

    // ✅ FIXED SUCCESS URL
    const successUrl = isSub 
      ? `${origin}/tools/ai-assistant?active&session_id={CHECKOUT_SESSION_ID}`
      : `${origin}/client/dashboard?payment=success&session_id={CHECKOUT_SESSION_ID}`;

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: isSub ? "subscription" : "payment",
      line_items: [{ price: priceId, quantity: 1 }],
      customer_email: email || undefined,
      success_url: successUrl,
      cancel_url: `${origin}/checkout?status=canceled`,
      metadata: { userId: userId || email || "guest", plan: lookupKey },
    });

    return new Response(JSON.stringify({ ok: true, url: session.url }), { status: 200 });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}