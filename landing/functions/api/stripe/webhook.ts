import Stripe from "stripe";

export async function onRequestPost(context: any) {
  const { request, env } = context;

  const stripeKey = env.STRIPE_SECRET_KEY;
  const webhookSecret = env.STRIPE_WEBHOOK_SECRET;
  
  if (!stripeKey || !webhookSecret) {
    return Response.json({ error: "Webhook Config error" }, { status: 500 });
  }

  const stripe = new Stripe(stripeKey, { 
    // @ts-ignore
    apiVersion: "2024-06-20" 
  });

  // FIXED: Read raw body as text for signature verification
  const body = await request.text();
  const sig = request.headers.get("stripe-signature") || "";

  try {
    const event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
    
    if (event.type === "checkout.session.completed") {
        const session = event.data.object as Stripe.Checkout.Session;
        
        // ✅ ADD YOUR DATABASE LOGIC HERE
        // Example: Update your Cloudflare D1 SQL database
        // await env.DB.prepare("UPDATE users SET isPaid = 1 WHERE email = ?")
        //   .bind(session.metadata?.email).run();
        
        console.log("💰 Payment Success recorded for:", session.id);
    }

    return Response.json({ ok: true });
  } catch (err: any) {
    console.error("Webhook Signature Error:", err.message);
    return Response.json({ error: err.message }, { status: 400 });
  }
}