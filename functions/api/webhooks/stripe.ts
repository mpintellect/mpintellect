// functions/api/webhooks/stripe.ts
import Stripe from "stripe";

// ===========================================
// SELF-CONTAINED WEBHOOK - NO EXTERNAL IMPORTS
// All email code is included directly
// ===========================================

export async function onRequestPost(context: any) {
  const { request, env } = context;
  
  // DEBUG: Check environment variables at start
  console.log("🔍 DEBUG - Environment check:");
  console.log("🔍 STRIPE_SECRET_KEY exists:", !!env.STRIPE_SECRET_KEY);
  console.log("🔍 STRIPE_WEBHOOK_SECRET_CHATBOT exists:", !!env.STRIPE_WEBHOOK_SECRET_CHATBOT);
  console.log("🔍 RESEND_API_KEY exists:", !!env.RESEND_API_KEY);
  console.log("🔍 EMAIL_FROM exists:", !!env.EMAIL_FROM);
  console.log("🔍 DB binding exists:", !!env.DB);
  
  const stripe = new Stripe(env.STRIPE_SECRET_KEY, { 
    // @ts-ignore
    apiVersion: "2024-06-20",
    httpClient: Stripe.createFetchHttpClient() 
  });
  
  const sig = request.headers.get("stripe-signature") || "";
  const body = await request.text();

  console.log("🔔 Webhook received - signature present:", !!sig);
  console.log("🔔 Body length:", body.length);

  try {
    console.log("🔐 Attempting to verify webhook signature...");
    const event = await stripe.webhooks.constructEventAsync(body, sig, env.STRIPE_WEBHOOK_SECRET_CHATBOT);
    console.log("✅ Event verified successfully:", event.type);
    console.log("🔍 Event ID:", event.id);
    console.log("🔍 Event created:", new Date(event.created * 1000).toISOString());

    if (event.type === "checkout.session.completed") {
      const session = event.data.object as any;
      console.log("💰 Checkout completed - Full session data:", JSON.stringify({
        id: session.id,
        email: session.customer_email || session.customer_details?.email,
        metadata: session.metadata,
        amount: session.amount_total,
        payment_status: session.payment_status,
        status: session.status,
        customer_details: session.customer_details
      }, null, 2));
      
      // ✅ Call the fulfillment function
      console.log("⏱️ Calling handleCheckoutCompleted...");
      await handleCheckoutCompleted(session, env);
      console.log("✅ handleCheckoutCompleted finished");
      
    } else {
      console.log("⚠️ Ignoring non-checkout event:", event.type);
    }
    
    console.log("✅ Returning 200 response to Stripe");
    return new Response(JSON.stringify({ received: true }), { status: 200 });
    
  } catch (err: any) {
    console.error("❌ Webhook Signature Error:", err.message);
    console.error("❌ Error stack:", err.stack);
    return new Response(JSON.stringify({ error: err.message }), { status: 400 });
  }
}

// ===========================================
// FULFILLMENT FUNCTION - ALL IN ONE PLACE
// ===========================================

async function handleCheckoutCompleted(session: any, env: any) {
  console.log("🚀 ENTERING handleCheckoutCompleted");
  console.log("🚀 Time:", new Date().toISOString());
  
  const customerEmail = (session.customer_details?.email || session.customer_email || "").toLowerCase();
  const sessionId = session.id;

  // ✅ USE METADATA - This is 100% reliable
  const productId = session.metadata?.productId || session.metadata?.plan;
  const userId = session.metadata?.userId || customerEmail;

  console.log(`📡 Fulfilling: productId=${productId} for customerEmail=${customerEmail}`);
  console.log(`📡 Session ID: ${sessionId}`);
  console.log(`📡 User ID from metadata: ${userId}`);

  try {
    let generatedKey: string | undefined;
    let expiryDate: string | undefined;
    let secureDownloadLink: string | undefined;
    let prodName = "MZ Intelligence Asset";
    let setupsToLog = 0;

    // 1. Ensure User exists
    console.log("📡 Step 1: Ensuring user exists...");
    
    try {
      const userResult = await env.DB.prepare(
        "INSERT OR IGNORE INTO users (id, email, created_at, updated_at, setup_count) VALUES (?, ?, datetime('now'), datetime('now'), 0)"
      ).bind(userId, customerEmail).run();
      console.log("✅ User ensure result:", userResult);
    } catch (dbError: any) {
      console.error("❌ Database error in user insert:", dbError.message);
      throw dbError;
    }
    console.log("✅ User ensured");

    // 2. LOGIC: SCALPER ROBOT
    if (productId === "scalper-x1") {
      prodName = "MZPrimer Scalper X1 (V.1)";
      secureDownloadLink = `https://mzprimer.com/api/download-robot?session_id=${sessionId}`;
      
      console.log("📡 Step 2: Updating user with robot flag...");
      
      try {
        const updateResult = await env.DB.prepare("UPDATE users SET has_scalper_x1 = 1, updated_at = datetime('now') WHERE id = ? OR email = ?")
          .bind(userId, customerEmail).run();
        console.log("✅ Robot update result:", updateResult);
      } catch (dbError: any) {
        console.error("❌ Database error in robot update:", dbError.message);
        throw dbError;
      }
      console.log("✅ Robot ownership updated in DB");
    } 

    // 3. LOGIC: MONTHLY PRO
    else if (productId === "ai-assistant-monthly") {
      prodName = "AI Assistant Pro (1 Month)";
      generatedKey = `MZ-PRO-${Math.random().toString(36).toUpperCase().substring(2, 10)}`;
      setupsToLog = 999;
      const d = new Date(); d.setDate(d.getDate() + 30);
      expiryDate = d.toISOString();
      
      console.log("📡 Step 2: Updating user with pro license...");
      
      try {
        const updateResult = await env.DB.prepare(
          "UPDATE users SET license_type = 'pro', license_key = ?, license_expires_at = ?, updated_at = datetime('now') WHERE id = ? OR email = ?"
        ).bind(generatedKey, expiryDate, userId, customerEmail).run();
        console.log("✅ Pro license update result:", updateResult);
      } catch (dbError: any) {
        console.error("❌ Database error in pro update:", dbError.message);
        throw dbError;
      }
      console.log("✅ Pro License updated in DB");
    }

    // 4. LOGIC: SETUP BUNDLES (10, 20, 30 credits)
    else if (["10", "20", "30"].includes(productId)) {
      const setups = parseInt(productId);
      setupsToLog = setups;
      prodName = `${setups} AI Setup Bundle`;
      
      console.log("📡 Step 2: Updating user with setup credits...");
      console.log(`📡 Adding ${setups} credits to user`);
      
      try {
        const updateResult = await env.DB.prepare("UPDATE users SET setup_count = setup_count + ?, updated_at = datetime('now') WHERE id = ? OR email = ?")
          .bind(setups, userId, customerEmail).run();
        console.log("✅ Setup credits update result:", updateResult);
      } catch (dbError: any) {
        console.error("❌ Database error in setup credits update:", dbError.message);
        throw dbError;
      }
      console.log(`✅ Added ${setups} credits in DB`);
    } 
    
    // 5. LOGIC: UNKNOWN PRODUCT
    else {
      console.log("⚠️ Unknown productId:", productId);
      prodName = productId || "MZ Intelligence Product";
    }

    // 6. AUDIT LOG
    console.log("📡 Step 3: Creating audit log...");
    const nowTs = new Date().toISOString().replace('T', ' ').substring(0, 19);
    
    try {
      const auditResult = await env.DB.prepare(
        `INSERT INTO stripe_purchases (user_id, stripe_session_id, price_id, setup_count, amount_paid, customer_email, status, created_at, updated_at, license_key) 
         VALUES (?, ?, ?, ?, ?, ?, 'completed', ?, ?, ?)`
      ).bind(userId, sessionId, productId, setupsToLog, (session.amount_total || 0) / 100, customerEmail, nowTs, nowTs, generatedKey || null).run();
      console.log("✅ Audit log result:", auditResult);
    } catch (dbError: any) {
      console.error("❌ Database error in audit log:", dbError.message);
      throw dbError;
    }
    console.log("✅ Audit log created");

    // 7. ✅ DISPATCH EMAIL - FOR ALL PURCHASE TYPES (FIXED)
    console.log("📧 Step 4: Preparing to dispatch email...");
    console.log("📧 Product type:", productId);
    console.log("📧 secureDownloadLink exists:", !!secureDownloadLink);
    console.log("📧 generatedKey exists:", !!generatedKey);
    
    // Send email for ALL successful purchases (robots, subscriptions, AND setup bundles)
    console.log(`📧 Calling sendOrderConfirmationEmbedded to ${customerEmail}...`);
    console.log(`📧 Email details:`, {
      to: customerEmail,
      orderId: sessionId,
      productName: prodName,
      amountPaid: (session.amount_total || 0) / 100,
      hasLicenseKey: !!generatedKey,
      hasDownloadUrl: !!secureDownloadLink,
      isSetupBundle: !secureDownloadLink && !generatedKey && productId.match(/^\d+$/) // Numbers only = setup bundle
    });
    
    try {
      await sendOrderConfirmationEmbedded({
        to: customerEmail,
        orderId: sessionId,
        productName: prodName,
        amountPaid: (session.amount_total || 0) / 100,
        licenseKey: generatedKey,
        licenseExpiry: expiryDate,
        downloadUrl: secureDownloadLink,
        customerName: session.metadata?.buyerName
      }, env);
      console.log("✅ Email dispatch completed");
    } catch (emailError: any) {
      console.error("❌ Email dispatch error:", emailError.message);
      console.error("❌ Email error stack:", emailError.stack);
    }

    console.log(`✨ FULFILLMENT COMPLETE for ${customerEmail}`);

  } catch (err: any) {
    console.error("💥 handleCheckoutCompleted Fatal Error:", err.message);
    console.error("💥 Error stack:", err.stack);
    console.error("💥 Error name:", err.name);
    console.error("💥 Error code:", err.code);
  }
  console.log("🚀 EXITING handleCheckoutCompleted");
}

// ===========================================
// EMBEDDED EMAIL FUNCTIONS - NO IMPORTS
// ===========================================

interface OrderEmailDetails {
  to: string;
  orderId: string;
  productName: string;
  amountPaid: number;
  licenseKey?: string;
  licenseExpiry?: string;
  customerName?: string;
  downloadUrl?: string;
}

async function sendOrderConfirmationEmbedded(order: OrderEmailDetails, env: any): Promise<void> {
  console.log("📧 ENTERING sendOrderConfirmationEmbedded");
  
  const apiKey = env.RESEND_API_KEY;
  const fromEmail = env.EMAIL_FROM || 'MZPrimer Intelligence Team <contact@mzprimer.com>';

  console.log("📧 apiKey exists:", !!apiKey);
  console.log("📧 order.to:", order.to);
  console.log("📧 order.productName:", order.productName);

  if (!apiKey) {
    console.error("❌ RESEND_API_KEY is missing - cannot send email");
    return;
  }

  const isSubscription = !!order.licenseKey;
  const isRobot = !!order.downloadUrl;
  const isSetupBundle = !isSubscription && !isRobot;
  
  console.log("📧 isSubscription:", isSubscription);
  console.log("📧 isRobot:", isRobot);
  console.log("📧 isSetupBundle:", isSetupBundle);
  
  // CTA Link Logic
  let ctaLink = "https://mzprimer.com/client/dashboard";
  let ctaText = "ACCESS DASHBOARD";

  if (isSubscription) {
    ctaLink = "https://mzprimer.com/tools/ai-assistant?active";
    ctaText = "ACTIVATE AI ASSISTANT";
  } else if (isRobot) {
    ctaLink = order.downloadUrl!;
    ctaText = "DOWNLOAD EX5 ROBOT";
  } // else isSetupBundle - keep default dashboard link

  const subject = isRobot 
    ? `⚡ Software Delivery: ${order.productName} is ready` 
    : isSubscription 
      ? `🔑 AI Pro Activated: Your License Key Inside` 
      : `✅ Order Confirmed: ${order.productName}`;

  const expiryDate = order.licenseExpiry
    ? new Date(order.licenseExpiry).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
    : null;

  const customerName = order.customerName || order.to.split('@')[0] || 'Trader';

  try {
    console.log("📧 Making fetch request to Resend API...");
    
    const emailBody = {
      from: fromEmail,
      to: [order.to],
      subject: subject,
      html: generateEmailHTML(order, isSubscription, isRobot, isSetupBundle, expiryDate, customerName, ctaLink, ctaText),
      text: generatePlainText(order, isSubscription, isRobot, isSetupBundle, expiryDate, ctaLink),
      headers: {
        "X-Entity-ID": `MZP-${order.orderId.substring(0, 8)}`,
      }
    };
    
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(emailBody),
    });

    console.log("📧 Resend response status:", response.status);
    
    const responseData = await response.json();
    
    if (response.ok) {
      console.log(`✅ Email sent successfully to ${order.to}`, responseData);
    } else {
      console.error("❌ Resend API Error:", responseData);
      
      // FALLBACK for license keys
      if (order.licenseKey) {
        console.log(`🔑 FALLBACK - License key for ${order.to}: ${order.licenseKey}`);
      }
      // FALLBACK for download links
      if (order.downloadUrl) {
        console.log(`📥 FALLBACK - Download link for ${order.to}: ${order.downloadUrl}`);
      }
    }
  } catch (e: any) {
    console.error("❌ Email System Failure:", e.message);
    
    // FALLBACK for all purchase types
    if (order.licenseKey) {
      console.log(`🔑 FALLBACK - License key: ${order.licenseKey}`);
    }
    if (order.downloadUrl) {
      console.log(`📥 FALLBACK - Download link: ${order.downloadUrl}`);
    }
    if (isSetupBundle) {
      console.log(`📊 FALLBACK - Setup bundle purchased: ${order.productName}`);
    }
  }
  
  console.log("📧 EXITING sendOrderConfirmationEmbedded");
}

function generateEmailHTML(
  order: OrderEmailDetails,
  isSubscription: boolean,
  isRobot: boolean,
  isSetupBundle: boolean,
  expiryDate: string | null,
  customerName: string,
  ctaLink: string,
  ctaText: string
): string {
  const badgeText = isRobot ? '⚡ ROBOT DEPLOYMENT' : isSubscription ? '🔑 PRO LICENSE' : '✓ ORDER CONFIRMED';
  const headline = isRobot ? 'Scalper X1 Ready' : isSubscription ? 'AI Trader Assistant' : 'Payment Successful';
  const subheadline = isRobot ? 'Institutional Grade Robot' : isSubscription ? 'Professional License Activated' : order.productName;
  
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <meta name="color-scheme" content="dark">
      <meta name="supported-color-schemes" content="dark">
    </head>
    <body style="margin:0; padding:0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', sans-serif; background: #000000;">
      <div style="background: radial-gradient(125% 125% at 50% 10%, #0a0c0e, #000000); padding: 48px 24px;">
        <div style="max-width: 560px; margin: 0 auto; background: #0c0c0c; border: 1px solid rgba(212, 175, 55, 0.25); border-radius: 24px;">
          <div style="height: 4px; background: linear-gradient(90deg, #d4af37, #f9e076, #b49450); border-radius: 24px 24px 0 0;"></div>
          <div style="padding: 40px 32px;">
            <div style="display: inline-block; background: rgba(212, 175, 55, 0.08); border: 1px solid rgba(212, 175, 55, 0.3); border-radius: 100px; padding: 8px 20px; margin-bottom: 24px;">
              <span style="color: #d4af37; font-size: 13px; font-weight: 700; letter-spacing: 1.5px; text-transform: uppercase;">
                ${badgeText}
              </span>
            </div>
            
            <h1 style="margin: 0 0 16px; font-size: 32px; font-weight: 700; letter-spacing: -0.02em; line-height: 1.2; color: #ffffff;">
              ${headline}
              <span style="display: block; font-size: 18px; font-weight: 400; color: #a1a1aa; margin-top: 8px;">
                ${subheadline}
              </span>
            </h1>
            
            <p style="margin: 0 0 8px; font-size: 16px; color: #e5e7eb;">
              Dear <span style="color: #d4af37; font-weight: 600;">${customerName}</span>,
            </p>
            
            <p style="margin: 0 0 32px; font-size: 16px; color: #cbd5e1; line-height: 1.6;">
              ${isRobot 
                ? `Your institutional grade robot <b style="color: #d4af37;">${order.productName}</b> has been provisioned. You can download the protected .ex5 file below.`
                : isSubscription 
                  ? `Your institutional-grade trading intelligence subscription is now active. You have <strong style="color: #d4af37;">unlimited access</strong> to AI-powered market analysis.`
                  : `Thank you for your purchase. Your ${order.productName} has been credited to your account and is ready for immediate use.`
              }
            </p>

            ${isRobot ? `
            <div style="background: linear-gradient(165deg, #0f0f0f, #080808); border-radius: 20px; padding: 28px; border: 1px solid rgba(212, 175, 55, 0.35); margin-bottom: 32px;">
              <div style="display: flex; align-items: center; margin-bottom: 20px;">
                <div style="width: 8px; height: 8px; background: #d4af37; border-radius: 50%; margin-right: 12px;"></div>
                <span style="font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 3px; color: #d4af37;">Secure Download</span>
              </div>
              <div style="background: #000000; border-radius: 14px; padding: 20px; margin-bottom: 20px;">
                <p style="margin: 0 0 10px 0; color: #9ca3af; font-size: 14px;">File:</p>
                <p style="margin: 0; color: #ffffff; font-size: 18px; font-weight: 600;">
                  MZPrimer_${order.productName.replace(/\s+/g, '_')}_V.1.ex5
                </p>
              </div>
              <div style="text-align: center;">
                <a href="${ctaLink}" 
                   style="display: inline-block; background: #d4af37; color: #000000; text-decoration: none; padding: 16px 40px; border-radius: 100px; font-weight: 800; font-size: 15px; letter-spacing: 2px; text-transform: uppercase;">
                  DOWNLOAD SOFTWARE →
                </a>
              </div>
            </div>
            ` : ''}

            ${isSubscription && order.licenseKey ? `
            <div style="background: linear-gradient(165deg, #0f0f0f, #080808); border-radius: 20px; padding: 28px; border: 1px solid rgba(212, 175, 55, 0.35); margin-bottom: 32px;">
              <div style="display: flex; align-items: center; margin-bottom: 20px;">
                <div style="width: 8px; height: 8px; background: #d4af37; border-radius: 50%; margin-right: 12px;"></div>
                <span style="font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 3px; color: #d4af37;">License Credentials</span>
              </div>
              <div style="background: #000000; border-radius: 14px; padding: 20px;">
                <span style="font-family: monospace; font-size: 24px; font-weight: 600; letter-spacing: 6px; color: #d4af37; display: block; text-align: center;">
                  ${order.licenseKey}
                </span>
              </div>
              ${expiryDate ? `
              <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 20px; padding-top: 20px; border-top: 1px solid #1e1e1e;">
                <span style="color: #9ca3af;">⏱️ Validity period</span>
                <span style="background: rgba(212, 175, 55, 0.1); color: #d4af37; padding: 6px 18px; border-radius: 100px;">
                  ${expiryDate}
                </span>
              </div>
              ` : ''}
            </div>
            ` : ''}
            
            <div style="background: #080808; border-radius: 16px; padding: 24px; margin-bottom: 32px;">
              <div style="display: flex; justify-content: space-between; margin-bottom: 16px;">
                <span style="color: #9ca3af;">Order reference</span>
                <span style="color: #d4af37; font-family: monospace;">${order.orderId.substring(0, 16).toUpperCase()}</span>
              </div>
              <div style="display: flex; justify-content: space-between; padding-top: 16px; border-top: 1px solid #1e1e1e;">
                <span style="color: #9ca3af;">Total amount</span>
                <span style="color: #ffffff; font-size: 28px; font-weight: 700;">$${order.amountPaid.toFixed(2)}</span>
              </div>
            </div>
            
            <div style="text-align: center;">
              <a href="${ctaLink}" 
                 style="display: inline-block; background: #d4af37; color: #000000; text-decoration: none; padding: 18px 48px; border-radius: 100px; font-weight: 800; font-size: 16px; letter-spacing: 3px; text-transform: uppercase; border: 1px solid #f9e076;">
                ${ctaText} →
              </a>
            </div>
            
          </div>
          
          <div style="padding: 24px 32px; background: #050505; border-top: 1px solid #1a1a1a; border-radius: 0 0 24px 24px;">
            <p style="margin: 0; color: #4b5563; font-size: 12px; text-align: center;">
              © ${new Date().getFullYear()} MZPrimer Intelligence · All rights reserved
            </p>
          </div>
        </div>
      </div>
    </body>
    </html>
  `;
}

function generatePlainText(
  order: OrderEmailDetails, 
  isSubscription: boolean, 
  isRobot: boolean,
  isSetupBundle: boolean,
  expiryDate: string | null,
  ctaLink: string
): string {
  let text = `
MZPRIMER - ${isRobot ? 'ROBOT DELIVERY' : isSubscription ? 'PRO LICENSE ACTIVATED' : 'ORDER CONFIRMATION'}
========================================
Order ID: ${order.orderId}
Amount: $${order.amountPaid.toFixed(2)}
Date: ${new Date().toLocaleDateString()}
`;

  if (isRobot && order.downloadUrl) {
    text += `
    
YOUR DOWNLOAD LINK: ${ctaLink}

This link will expire in 24 hours for security reasons.
`;
  } else if (isSubscription && order.licenseKey) {
    text += `
    
YOUR LICENSE KEY: ${order.licenseKey}
${expiryDate ? `Valid until: ${expiryDate}` : ''}

Activate here: ${ctaLink}
`;
  } else {
    text += `
    
Access your dashboard: ${ctaLink}
Your ${order.productName} has been credited to your account.
`;
  }

  text += `

Thank you for choosing MZPrimer!
Questions? Contact contact@mzprimer.com`;

  return text;
}