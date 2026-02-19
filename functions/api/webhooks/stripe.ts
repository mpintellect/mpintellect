import Stripe from "stripe";
import { execute } from '../../../backend-lib/db-simple';
import { sendOrderConfirmation } from '../../../backend-lib/email';

// We now use the Product Slugs from your Metadata for 100% accuracy
const SETUP_CREDITS: Record<string, number> = {
  "10": 10,
  "20": 20,
  "30": 30,
};

export async function onRequestPost(context: any) {
  const { request, env, waitUntil } = context;
  const stripe = new Stripe(env.STRIPE_SECRET_KEY, { 
    // @ts-ignore
    apiVersion: "2024-06-20",
    httpClient: Stripe.createFetchHttpClient(),
  });
  
  const sig = request.headers.get("stripe-signature") || "";
  const body = await request.text();

  try {
    const event = await stripe.webhooks.constructEventAsync(body, sig, env.STRIPE_WEBHOOK_SECRET_CHATBOT);

    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;
      
      // ✅ We fire and forget the fulfillment, letting the worker stay alive via waitUntil
      waitUntil(handleCheckoutCompleted(session, env));
    }
    
    // ✅ Return IMMEDIATELY to Stripe so they don't timeout
    return new Response(JSON.stringify({ received: true }), { status: 200 });
  } catch (err: any) {
    console.error("❌ Webhook Signature Error:", err.message);
    return new Response(JSON.stringify({ error: err.message }), { status: 400 });
  }
}

async function handleCheckoutCompleted(session: any, env: any) {
  const customerEmail = (session.customer_details?.email || session.customer_email || "").toLowerCase();
  const sessionId = session.id;

  // ✅ THE CRITICAL FIX: Use metadata (which says 'scalper-x1' in your DB)
  const productId = session.metadata?.productId || session.metadata?.plan;
  const userId = session.metadata?.userId || customerEmail;

  try {
    console.log(`📡 Processing Fulfillment: ${productId} for ${customerEmail}`);

    let generatedKey: string | undefined;
    let expiryDate: string | undefined;
    let secureDownloadLink: string | undefined;
    let prodName = "MZ Intelligence Asset";
    let setupsToLog = 0;

    // 1. ENSURE USER ROW EXISTS
    await env.DB.prepare(
      "INSERT OR IGNORE INTO users (id, email, created_at, updated_at, setup_count) VALUES (?, ?, datetime('now'), datetime('now'), 0)"
    ).bind(userId, customerEmail).run();

    // === LOGIC A: ROBOT (Matched by Metadata ID) ===
    if (productId === "scalper-x1") {
      prodName = "MZPrimer Scalper X1 (V.1)";
      secureDownloadLink = `https://mzprimer.com/api/download-robot?session_id=${sessionId}`;
      
      await env.DB.prepare("UPDATE users SET has_scalper_x1 = 1, updated_at = datetime('now') WHERE id = ? OR email = ?")
        .bind(userId, customerEmail).run();
      
      console.log("✅ Robot ownership updated in DB");
    } 

    // === LOGIC B: MONTHLY PRO (Matched by Metadata ID) ===
    else if (productId === "ai-assistant-monthly") {
      prodName = "AI Assistant Pro (1 Month)";
      generatedKey = `MZ-PRO-${Math.random().toString(36).toUpperCase().substring(2, 10)}`;
      setupsToLog = 999;
      
      const d = new Date(); d.setDate(d.getDate() + 30);
      expiryDate = d.toISOString();

      await env.DB.prepare(
        "UPDATE users SET license_type = 'pro', license_key = ?, license_expires_at = ?, updated_at = datetime('now') WHERE id = ? OR email = ?"
      ).bind(generatedKey, expiryDate, userId, customerEmail).run();
      
      console.log("✅ Pro License updated in DB");
    }

    // === LOGIC C: SETUP CREDITS (10, 20, 30) ===
    else if (SETUP_CREDITS[productId]) {
      const setupsToAdd = SETUP_CREDITS[productId];
      setupsToLog = setupsToAdd;
      prodName = `${setupsToAdd} AI Setup Bundle`;

      await env.DB.prepare(
        "UPDATE users SET setup_count = setup_count + ?, updated_at = datetime('now') WHERE id = ? OR email = ?"
      ).bind(setupsToAdd, userId, customerEmail).run();
      
      console.log(`✅ Added ${setupsToAdd} credits in DB`);
    }

    // 2. AUDIT LOG (Consistent with your Schema)
    const nowTs = Math.floor(Date.now() / 1000);
    await env.DB.prepare(
      `INSERT INTO stripe_purchases (user_id, stripe_session_id, price_id, setup_count, amount_paid, customer_email, status, created_at, updated_at, license_key) 
       VALUES (?, ?, ?, ?, ?, ?, 'completed', ?, ?, ?)`
    ).bind(userId, sessionId, productId, setupsToLog, session.amount_total / 100, customerEmail, nowTs, nowTs, generatedKey || null).run();

    // 3. DISPATCH EMAIL (Using your Gold & Black Template)
    console.log("📧 Dispatching Fulfillment Email...");
    await sendOrderConfirmation({
      to: customerEmail,
      orderId: sessionId,
      productName: prodName,
      amountPaid: (session.amount_total || 0) / 100,
      licenseKey: generatedKey,
      licenseExpiry: expiryDate,
      downloadUrl: secureDownloadLink
    }, env);

    console.log(`✨ FULFILLMENT SUCCESSFUL: ${customerEmail}`);

  } catch (err: any) {
    console.error("💥 handleCheckoutCompleted Fatal Error:", err.message);
  }
}