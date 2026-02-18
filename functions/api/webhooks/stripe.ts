import Stripe from "stripe";
import { execute } from '../../../backend-lib/db-simple';
import { sendOrderConfirmation } from '../../../backend-lib/email';

const SETUP_CREDITS: Record<string, number> = {
  "price_1SSyQORmR6ESDQvobwheaXws": 10,
  "price_1SVWWXDoB4i1qeaL2dquhtfv": 20,
  "price_1SSyUORmR6ESDQvo7dzPKmPt": 30,
};

const SCALPER_PRICE_ID = "price_1T0O51DoB4i1qeaLzAaAErAr";
const MONTHLY_PLAN_ID = "price_1S1bt8DoB4i1qeaL1PzseHYf"; 

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
    const event = await stripe.webhooks.constructEventAsync(body, sig, env.STRIPE_WEBHOOK_SECRET);

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

// ... (keep constants at top)

async function handleCheckoutCompleted(session: Stripe.Checkout.Session, stripe: Stripe, env: any) {
  // Use lowercase for everything to avoid SQLite case-sensitivity bugs
  const userId = session.metadata?.userId || 'guest';
  const customerEmail = (session.customer_details?.email || session.customer_email || "").toLowerCase();
  const sessionId = session.id;

  if (!customerEmail) return;

  try {
    const lineItems = await stripe.checkout.sessions.listLineItems(sessionId);
    const priceId = lineItems.data[0]?.price?.id || "";
    
    // 1. DIRECT DATABASE LOOKUP (Bypass wrappers)
    // We search for the user record using the live D1 binding 'env.DB'
    const userRecord: any = await env.DB.prepare(
      "SELECT id, setup_count, email FROM users WHERE id = ? OR LOWER(email) = LOWER(?)"
    ).bind(userId, customerEmail).first();

    if (!userRecord) {
      console.log(`⚠️ User ${customerEmail} not found. Creating a guest record...`);
      const newId = userId !== 'guest' ? userId : crypto.randomUUID();
      await env.DB.prepare(
        "INSERT INTO users (id, email, setup_count, created_at, updated_at) VALUES (?, ?, 0, datetime('now'), datetime('now'))"
      ).bind(newId, customerEmail).run();
    }

    // Refresh user data after potential insert
    const targetUser: any = await env.DB.prepare(
      "SELECT id, setup_count FROM users WHERE id = ? OR LOWER(email) = LOWER(?)"
    ).bind(userId, customerEmail).first();

    let generatedKey, expiryDate, secureDownloadLink, prodName = "Asset";
    let newSetupCount = targetUser.setup_count || 0;

    // === LOGIC A: MONTHLY ===
    if (priceId === MONTHLY_PLAN_ID) {
      prodName = "AI Assistant Pro";
      generatedKey = `MZ-PRO-${Math.random().toString(36).toUpperCase().substring(2, 10)}`;
      const d = new Date(); d.setDate(d.getDate() + 30); expiryDate = d.toISOString();
      
      await env.DB.prepare(
        "UPDATE users SET license_type = 'pro', license_key = ?, license_expires_at = ?, updated_at = datetime('now') WHERE id = ?"
      ).bind(generatedKey, expiryDate, targetUser.id).run();
    } 
    // === LOGIC B: ROBOT ===
    else if (priceId === SCALPER_PRICE_ID) {
      prodName = "Scalper X1";
      secureDownloadLink = `https://mzprimer.com/api/download-robot?session_id=${sessionId}`;
      await env.DB.prepare("UPDATE users SET has_scalper_x1 = 1 WHERE id = ?").bind(targetUser.id).run();
    }
    // === LOGIC C: SETUPS (The Fix) ===
    else if (SETUP_CREDITS[priceId]) {
      const setupsToAdd = SETUP_CREDITS[priceId];
      newSetupCount += setupsToAdd;
      prodName = `${setupsToAdd} AI Setup Bundle`;

      console.log(`📊 FULFILLMENT: Updating User ${targetUser.id} (${customerEmail})`);
      console.log(`📈 Credits: ${targetUser.setup_count} -> ${newSetupCount}`);

      // Perform direct update
      const updateResult = await env.DB.prepare(
        "UPDATE users SET setup_count = ?, updated_at = datetime('now') WHERE id = ?"
      ).bind(newSetupCount, targetUser.id).run();

      console.log(`📡 D1 Result: ${updateResult.success ? '✅ Success' : '❌ Failed'}`);
    }

    // 2. AUDIT LOG (Always use targetUser.id for consistency)
    await env.DB.prepare(
      `INSERT INTO stripe_purchases (user_id, stripe_session_id, price_id, setup_count, amount_paid, customer_email, status, created_at, updated_at) 
       VALUES (?, ?, ?, ?, ?, ?, 'completed', datetime('now'), datetime('now'))`
    ).bind(targetUser.id, sessionId, priceId, (SETUP_CREDITS[priceId] || 0), (session.amount_total || 0) / 100, customerEmail).run();

    // 3. DISPATCH EMAIL
    await sendOrderConfirmation({
      to: customerEmail,
      orderId: sessionId,
      productName: prodName,
      amountPaid: (session.amount_total || 0) / 100,
      licenseKey: generatedKey,
      licenseExpiry: expiryDate,
      downloadUrl: secureDownloadLink
    }, env);

  } catch (err: any) {
    console.error("💥 WEBHOOK CRITICAL ERROR:", err.message);
  }
}