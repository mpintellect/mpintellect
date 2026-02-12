import Stripe from "stripe";

const HEADERS = { "Content-Type": "application/json" };

export async function onRequestPost(context: any) {
  const { request, env } = context;

  const stripeKey = env.STRIPE_SECRET_KEY;
  const webhookSecret = env.STRIPE_WEBHOOK_SECRET;
  
  if (!stripeKey || !webhookSecret) {
    console.error("❌ Webhook missing Secret Keys");
    return new Response(JSON.stringify({ error: "Config error" }), { status: 500, headers: HEADERS });
  }

  const stripe = new Stripe(stripeKey, { 
    // @ts-ignore
    apiVersion: "2024-06-20",
    httpClient: Stripe.createFetchHttpClient(),
  });

  const body = await request.text();
  const sig = request.headers.get("stripe-signature") || "";

  try {
    // 1. Verify the signature asynchronously
    const event = await stripe.webhooks.constructEventAsync(body, sig, webhookSecret);
    
    console.log(`🔔 Stripe Event Received: ${event.type}`);

    // 2. Handle successful checkout
    if (event.type === "checkout.session.completed") {
        const session = event.data.object as any;
        const { userId, plan } = session.metadata || {};

        if (!userId || !plan) {
            console.warn("⚠️ Webhook: Session completed but metadata missing.");
            return new Response(JSON.stringify({ ok: true, note: "No metadata" }), { status: 200 });
        }

        console.log(`💰 Processing Payment | User: ${userId} | Plan: ${plan}`);

        // --- Logic A: Upgrade to PRO ---
        if (plan === "ai-assistant-monthly" || plan === "ai-assistant-pro") {
            await env.DB.prepare("UPDATE users SET license_type = 'pro', updated_at = datetime('now') WHERE id = ? OR email = ?")
              .bind(userId, session.customer_details?.email)
              .run();
        } 
        
        // --- Logic B: Credit Purchase ---
        else {
            const creditAmount = parseInt(plan);
            if (!isNaN(creditAmount)) {
                await env.DB.prepare("UPDATE users SET setup_count = setup_count + ?, updated_at = datetime('now') WHERE id = ?")
                  .bind(creditAmount, userId)
                  .run();
            }
        }

        // --- Logic C: Record Purchase ---
        await env.DB.prepare(`
            INSERT INTO stripe_purchases (user_id, stripe_session_id, price_id, setup_count, amount_paid, customer_email, status, created_at, updated_at)
            VALUES (?, ?, ?, ?, ?, ?, 'completed', ?, ?)
        `).bind(
            userId, 
            session.id, 
            plan, 
            plan.includes('ai-assistant') ? 999 : (parseInt(plan) || 0),
            session.amount_total / 100,
            session.customer_details?.email,
            Math.floor(Date.now() / 1000),
            Math.floor(Date.now() / 1000)
        ).run();
        
        console.log("✅ Database updated successfully");
    }

    // 3. ALWAYS return 200 for events we verified but don't need to process
    return new Response(JSON.stringify({ ok: true }), { status: 200, headers: HEADERS });

  } catch (err: any) {
    console.error("⚠️ Webhook Signature Error:", err.message);
    // Returning 400 tells Stripe the signature was invalid
    return new Response(JSON.stringify({ error: err.message }), { status: 400, headers: HEADERS });
  }
}