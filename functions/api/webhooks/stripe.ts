import Stripe from "stripe";
import { execute } from '../../../backend-lib/db-simple';
import { sendOrderConfirmation } from '../../../backend-lib/email';

const SETUP_CREDITS: Record<string, number> = {
  "price_1T2EeZDoB4i1qeaLoOlPHUNU": 10,
  "price_1T2EfODoB4i1qeaLiNO8SKeZ": 20,
  "price_1T2EgUDoB4i1qeaLQz2d00qE": 30,
};

const SCALPER_PRICE_ID = "price_1S3JU6DoB4i1qeaLMYVILAMD";
const MONTHLY_PLAN_ID = "price_1T2EiJDoB4i1qeaLFXPjBoCY"; 

export async function onRequestPost(context: any) {
  const { request, env } = context;
  const stripe = new Stripe(env.STRIPE_SECRET_KEY, { 
    // @ts-ignore
    apiVersion: "2024-06-20",
    httpClient: Stripe.createFetchHttpClient(),
  });
  
  const sig = request.headers.get("stripe-signature") || "";
  const body = await request.text();

  try {
    // ✅ SYNCED: Uses your specified variable name
    const event = await stripe.webhooks.constructEventAsync(body, sig, env.STRIPE_WEBHOOK_SECRET_CHATBOT);

    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;
      await handleCheckoutCompleted(session, stripe, env);
    }
    return new Response(JSON.stringify({ received: true }), { status: 200 });
  } catch (err: any) {
    console.error("❌ Webhook Error:", err.message);
    return new Response(JSON.stringify({ error: err.message }), { status: 400 });
  }
}

async function handleCheckoutCompleted(session: Stripe.Checkout.Session, stripe: Stripe, env: any) {
  const userId = session.metadata?.userId || 'guest';
  const customerEmail = (session.customer_details?.email || session.customer_email || "").toLowerCase();
  const sessionId = session.id;

  if (!customerEmail) return;

  try {
    const lineItems = await stripe.checkout.sessions.listLineItems(sessionId);
    const priceId = lineItems.data[0]?.price?.id || "";
    
    // 1. ENSURE USER RECORD EXISTS (Sync by ID or Email)
    await env.DB.prepare(
      "INSERT OR IGNORE INTO users (id, email, created_at, updated_at, setup_count, license_type) VALUES (?, ?, datetime('now'), datetime('now'), 0, 'free')"
    ).bind(userId === 'guest' ? crypto.randomUUID() : userId, customerEmail).run();

    // Get fresh user record
    const targetUser: any = await env.DB.prepare(
      "SELECT id, setup_count FROM users WHERE id = ? OR LOWER(email) = LOWER(?)"
    ).bind(userId, customerEmail).first();

    let generatedKey: string | undefined;
    let expiryDate: string | undefined;
    let secureDownloadLink: string | undefined;
    let prodName = "Digital Asset";
    let setupsToLog = 0;

    // === LOGIC A: MONTHLY PRO SUBSCRIPTION ===
    if (priceId === MONTHLY_PLAN_ID) {
      prodName = "AI Assistant Pro (1 Month)";
      generatedKey = `MZ-PRO-${Math.random().toString(36).toUpperCase().substring(2, 10)}`;
      setupsToLog = 999;
      
      const d = new Date(); d.setDate(d.getDate() + 30);
      expiryDate = d.toISOString();

      await env.DB.prepare(
        "UPDATE users SET license_type = 'pro', license_key = ?, license_expires_at = ?, updated_at = datetime('now') WHERE id = ?"
      ).bind(generatedKey, expiryDate, targetUser.id).run();
    } 

    // === LOGIC B: SCALPER ROBOT ===
    else if (priceId === SCALPER_PRICE_ID) {
        prodName = "MZPrimer Scalper X1 (V.1)";
        secureDownloadLink = `https://mzprimer.com/api/download-robot?session_id=${sessionId}`;
        
        await env.DB.prepare(
            "UPDATE users SET has_scalper_x1 = 1, updated_at = datetime('now') WHERE id = ?"
        ).bind(targetUser.id).run();
    }

    // === LOGIC C: SETUP CREDITS (10, 20, 30) ===
    else if (SETUP_CREDITS[priceId]) {
      const setupsToAdd = SETUP_CREDITS[priceId];
      setupsToLog = setupsToAdd;
      prodName = `${setupsToAdd} AI Setup Bundle`;

      await env.DB.prepare(
        "UPDATE users SET setup_count = setup_count + ?, updated_at = datetime('now') WHERE id = ?"
      ).bind(setupsToAdd, targetUser.id).run();
    }

    // 2. AUDIT LOG (Consistent with your Schema)
    await env.DB.prepare(
      `INSERT INTO stripe_purchases (user_id, stripe_session_id, price_id, setup_count, amount_paid, customer_email, status, created_at, updated_at, license_key) 
       VALUES (?, ?, ?, ?, ?, ?, 'completed', datetime('now'), datetime('now'), ?)`
    ).bind(targetUser.id, sessionId, priceId, setupsToLog, (session.amount_total || 0) / 100, customerEmail, generatedKey || null).run();

    // 3. DISPATCH ONE UNIFIED EMAIL (Using Gold & Black Template)
    await sendOrderConfirmation({
      to: customerEmail,
      orderId: sessionId,
      productName: prodName,
      amountPaid: (session.amount_total || 0) / 100,
      licenseKey: generatedKey,
      licenseExpiry: expiryDate,
      downloadUrl: secureDownloadLink
    }, env);

    console.log(`✅ FULFILLMENT SUCCESSFUL for ${customerEmail}`);

  } catch (err: any) {
    console.error("💥 handleCheckoutCompleted Fatal Error:", err.message);
  }
}