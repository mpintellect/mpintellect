// backend-lib/email.ts

export interface OrderEmailDetails {
  to: string;
  orderId: string;
  productName: string;
  amountPaid: number;
  licenseKey?: string;
  licenseExpiry?: string;
  customerName?: string;
  downloadUrl?: string; // ✅ New field for Robot file
}
export async function sendEmail(
  details: { to: string; subject: string; html: string; text?: string },
  env: any
): Promise<void> {
  const apiKey = env.RESEND_API_KEY;
  if (!apiKey) {
    console.error("❌ RESEND_API_KEY is missing");
    return;
  }

  try {
    console.log(`📧 Sending email via Resend to: ${details.to}`);
    
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: env.EMAIL_FROM || 'MZPrimer <intelligence@mzprimer.com>',
        to: [details.to],
        subject: details.subject,
        html: details.html,
        text: details.text || '', // Add text fallback
      }),
    });

    const responseData = await response.json();
    
    if (response.ok) {
      console.log(`✅ Email sent successfully to ${details.to}`, responseData);
    } else {
      console.error("❌ Resend API Error:", responseData);
    }
  } catch (e: any) {
    console.error("❌ Email System Failure:", e.message);
  }
}
export async function sendOrderConfirmation(order: OrderEmailDetails, env: any): Promise<void> {
  const apiKey = env.RESEND_API_KEY;
  const fromEmail = env.EMAIL_FROM || 'MZPrimer Intelligence Team <contact@mzprimer.com>';

  if (!apiKey) {
    console.error("❌ RESEND_API_KEY is missing");
    return;
  }

  const isSubscription = !!order.licenseKey;
  const isRobot = !!order.downloadUrl; // ✅ Detects if it's a bot purchase
  
  // CTA Link Logic
  let ctaLink = "https://mzprimer.com/client/dashboard";
  let ctaText = "ACCESS DASHBOARD";

  if (isSubscription) {
    ctaLink = "https://mzprimer.com/tools/ai-assistant?active";
    ctaText = "ACTIVATE AI ASSISTANT";
  } else if (isRobot) {
    ctaLink = order.downloadUrl!; // Points directly to the secure download link
    ctaText = "DOWNLOAD EX5 ROBOT";
  }

  const subject = isRobot 
    ? `Software Delivery: ${order.productName} is ready` 
    : isSubscription 
      ? `AI Pro Activated: Your License Key Inside` 
      : `Order Confirmed: ${order.productName}`;

  const expiryDate = order.licenseExpiry
    ? new Date(order.licenseExpiry).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
    : null;

  const customerName = order.customerName || order.to.split('@')[0] || 'Trader';

  try {
    console.log(`📧 Sending email via Resend to: ${order.to}`);
    
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: fromEmail,
        to: [order.to],
        subject: subject,
        html: generateEmailHTML(order, isSubscription, isRobot, expiryDate, customerName, ctaLink, ctaText),
        text: generatePlainText(order, isSubscription, isRobot, expiryDate, ctaLink),
        headers: {
          "X-Entity-ID": `MZP-${order.orderId.substring(0, 8)}`,
        }
      }),
    });

    const responseData = await response.json();
    
    if (response.ok) {
      console.log(`✅ Professional email dispatched to ${order.to}`, responseData);
    } else {
      console.error("❌ Resend API Error:", responseData);
      
      // FALLBACK for license keys
      if (order.licenseKey) {
        console.log(`🔑 FALLBACK - License key for ${order.to}: ${order.licenseKey}`);
      }
    }
  } catch (e: any) {
    console.error("❌ Email System Failure:", e.message);
    
    // FALLBACK for license keys
    if (order.licenseKey) {
      console.log(`🔑 FALLBACK - License key for ${order.to}: ${order.licenseKey}`);
    }
  }
}

function generateEmailHTML(
  order: OrderEmailDetails,
  isSubscription: boolean,
  isRobot: boolean,
  expiryDate: string | null,
  customerName: string,
  ctaLink: string,
  ctaText: string
): string {
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
      
      <!-- DARK LUXURY BACKGROUND WITH GOLD ACCENTS -->
      <div style="background: radial-gradient(125% 125% at 50% 10%, #0a0c0e, #000000); padding: 48px 24px;">
        
        <!-- MAIN CARD - CARBON BLACK WITH GOLD BORDER -->
        <div style="max-width: 560px; margin: 0 auto; background: #0c0c0c; border: 1px solid rgba(212, 175, 55, 0.25); border-radius: 24px; box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.8), 0 0 0 1px rgba(212, 175, 55, 0.1) inset;">
          
          <!-- GOLD ACCENT HEADER BAR -->
          <div style="height: 4px; background: linear-gradient(90deg, #d4af37, #f9e076, #b49450); border-radius: 24px 24px 0 0;"></div>
          
          <!-- CONTENT CONTAINER -->
          <div style="padding: 40px 32px;">
            
            <!-- STATUS BADGE - GOLD -->
            <div style="display: inline-block; background: rgba(212, 175, 55, 0.08); border: 1px solid rgba(212, 175, 55, 0.3); border-radius: 100px; padding: 8px 20px; margin-bottom: 24px;">
              <span style="color: #d4af37; font-size: 13px; font-weight: 700; letter-spacing: 1.5px; text-transform: uppercase;">
                ${isRobot ? '⚡ ROBOT DEPLOYMENT' : isSubscription ? '⚡ PRO LICENSE' : '✓ ORDER CONFIRMED'}
              </span>
            </div>
            
            <!-- HEADLINE -->
            <h1 style="margin: 0 0 16px; font-size: 32px; font-weight: 700; letter-spacing: -0.02em; line-height: 1.2; color: #ffffff;">
              ${isRobot ? 'Scalper X1 Ready' : isSubscription ? 'AI Trader Assistant' : 'Payment Successful'}
              <span style="display: block; font-size: 18px; font-weight: 400; color: #a1a1aa; margin-top: 8px;">
                ${isRobot ? 'Institutional Grade Robot' : isSubscription ? 'Professional License Activated' : order.productName}
              </span>
            </h1>
            
            <!-- GREETING -->
            <p style="margin: 0 0 8px; font-size: 16px; color: #e5e7eb;">
              Dear <span style="color: #d4af37; font-weight: 600;">${customerName}</span>,
            </p>
            
            <!-- MESSAGE -->
            <p style="margin: 0 0 32px; font-size: 16px; color: #cbd5e1; line-height: 1.6;">
              ${isRobot 
                ? `Your institutional grade robot <b style="color: #d4af37;">${order.productName}</b> has been provisioned. You can download the protected .ex5 file below.`
                : isSubscription 
                  ? `Your institutional-grade trading intelligence subscription is now active. You have <strong style="color: #d4af37;">unlimited access</strong> to AI-powered market analysis.`
                  : `Thank you for your purchase. Your trading setups have been credited to your account and are ready for immediate use.`
              }
            </p>

            ${isRobot ? `
            <!-- ROBOT DOWNLOAD CARD - PREMIUM GOLD -->
            <div style="background: linear-gradient(165deg, #0f0f0f, #080808); border-radius: 20px; padding: 28px; border: 1px solid rgba(212, 175, 55, 0.35); margin-bottom: 32px; box-shadow: 0 8px 24px rgba(0,0,0,0.5);">
              
              <!-- DECORATIVE GOLD DOT -->
              <div style="display: flex; align-items: center; margin-bottom: 20px;">
                <div style="width: 8px; height: 8px; background: #d4af37; border-radius: 50%; margin-right: 12px; box-shadow: 0 0 12px #d4af37;"></div>
                <span style="font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 3px; color: #d4af37;">Secure Download</span>
              </div>
              
              <!-- FILE DETAILS -->
              <div style="background: #000000; border-radius: 14px; padding: 20px; border: 1px solid #2a2a2a; margin-bottom: 20px;">
                <p style="margin: 0 0 10px 0; color: #9ca3af; font-size: 14px;">File:</p>
                <p style="margin: 0; color: #ffffff; font-size: 18px; font-weight: 600; word-break: break-all;">
                  MZPrimer_${order.productName.replace(/\s+/g, '_')}_V.1.ex5
                </p>
              </div>
              
              <!-- DOWNLOAD BUTTON -->
              <div style="text-align: center;">
                <a href="${ctaLink}" 
                   style="display: inline-block; background: #d4af37; color: #000000; text-decoration: none; padding: 16px 40px; border-radius: 100px; font-weight: 800; font-size: 15px; letter-spacing: 2px; text-transform: uppercase; border: 1px solid #f9e076; box-shadow: 0 12px 30px -8px rgba(212, 175, 55, 0.3);">
                  DOWNLOAD SOFTWARE →
                </a>
              </div>
              
              <!-- SECURITY NOTE -->
              <div style="margin-top: 20px; padding-top: 20px; border-top: 1px solid #1e1e1e;">
                <p style="margin: 0; color: #9ca3af; font-size: 12px; text-align: center;">
                  <span style="color: #d4af37;">🔒</span> Secure, encrypted download • Link expires in 24 hours
                </p>
              </div>
            </div>
            ` : ''}

            ${isSubscription && order.licenseKey ? `
            <!-- LICENSE KEY CARD - PREMIUM GOLD -->
            <div style="background: linear-gradient(165deg, #0f0f0f, #080808); border-radius: 20px; padding: 28px; border: 1px solid rgba(212, 175, 55, 0.35); margin-bottom: 32px; box-shadow: 0 8px 24px rgba(0,0,0,0.5);">
              
              <!-- DECORATIVE GOLD DOT -->
              <div style="display: flex; align-items: center; margin-bottom: 20px;">
                <div style="width: 8px; height: 8px; background: #d4af37; border-radius: 50%; margin-right: 12px; box-shadow: 0 0 12px #d4af37;"></div>
                <span style="font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 3px; color: #d4af37;">License Credentials</span>
              </div>
              
              <!-- LICENSE KEY - GOLD ON BLACK -->
              <div style="background: #000000; border-radius: 14px; padding: 20px; border: 1px solid #2a2a2a;">
                <span style="font-family: 'SF Mono', 'Monaco', 'Courier New', monospace; font-size: 24px; font-weight: 600; letter-spacing: 6px; color: #d4af37; word-break: break-all; display: block; text-align: center; text-shadow: 0 0 10px rgba(212, 175, 55, 0.3);">
                  ${order.licenseKey}
                </span>
              </div>
              
              <!-- EXPIRY DATE - GOLD ACCENT -->
              ${expiryDate ? `
              <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 20px; padding-top: 20px; border-top: 1px solid #1e1e1e;">
                <span style="color: #9ca3af; font-size: 14px;">⏱️ Validity period</span>
                <span style="background: rgba(212, 175, 55, 0.1); color: #d4af37; font-weight: 700; font-size: 14px; padding: 6px 18px; border-radius: 100px; border: 1px solid rgba(212, 175, 55, 0.2);">
                  ${expiryDate}
                </span>
              </div>
              ` : ''}
            </div>
            ` : ''}
            
            ${!isSubscription && !isRobot ? `
            <!-- SETUP CREDITS CARD - DARK ELEGANT -->
            <div style="background: #0a0a0a; border-radius: 20px; padding: 24px; border: 1px solid #2a2a2a; margin-bottom: 32px;">
              <div style="display: flex; align-items: center; justify-content: space-between;">
                <div>
                  <span style="color: #e5e7eb; font-size: 16px; font-weight: 600;">📊 Setups added</span>
                  <p style="margin: 4px 0 0; color: #9ca3af; font-size: 13px;">Credited to your account</p>
                </div>
                <span style="background: #d4af37; color: #000000; font-weight: 800; font-size: 22px; padding: 8px 20px; border-radius: 12px;">
                  +${order.productName.match(/\d+/)?.[0] || '10'}
                </span>
              </div>
            </div>
            ` : ''}
            
            <!-- ORDER SUMMARY - MINIMALIST -->
            <div style="background: #080808; border-radius: 16px; padding: 24px; border: 1px solid #1e1e1e; margin-bottom: 32px;">
              <div style="display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 16px;">
                <span style="color: #9ca3af; font-size: 14px; text-transform: uppercase; letter-spacing: 1px;">Order reference</span>
                <span style="color: #d4af37; font-family: monospace; font-size: 14px; font-weight: 600;">${order.orderId.substring(0, 16).toUpperCase()}</span>
              </div>
              <div style="display: flex; justify-content: space-between; align-items: baseline; padding-top: 16px; border-top: 1px solid #1e1e1e;">
                <span style="color: #9ca3af; font-size: 16px;">Total amount</span>
                <span style="color: #ffffff; font-size: 28px; font-weight: 700;">$${order.amountPaid.toFixed(2)}</span>
              </div>
            </div>
            
            ${!isRobot ? `
            <!-- CTA BUTTON - GOLD / BLACK (for non-robot purchases) -->
            <div style="text-align: center;">
              <a href="${ctaLink}" 
                 style="display: inline-block; background: #d4af37; color: #000000; text-decoration: none; padding: 18px 48px; border-radius: 100px; font-weight: 800; font-size: 16px; letter-spacing: 3px; text-transform: uppercase; border: 1px solid #f9e076; box-shadow: 0 12px 30px -8px rgba(212, 175, 55, 0.3);">
                ${ctaText} →
              </a>
              <p style="margin: 16px 0 0; color: #6b7280; font-size: 12px;">
                Secure • Instant access
              </p>
            </div>
            ` : ''}
            
            <!-- SECURITY NOTE -->
            <div style="margin-top: 32px; padding: 16px; background: rgba(212, 175, 55, 0.02); border-radius: 12px; border: 1px solid rgba(212, 175, 55, 0.1);">
              <p style="margin: 0; color: #9ca3af; font-size: 13px; text-align: center;">
                <span style="color: #d4af37; font-size: 14px;">🔒</span> 
                ${isRobot 
                  ? 'This download link is uniquely generated for your account and will expire in 24 hours.'
                  : isSubscription 
                    ? 'This license key is uniquely generated for your account. Please keep it confidential.'
                    : 'Your purchase is securely recorded on our institutional infrastructure.'}
              </p>
            </div>
            
          </div>
          
          <!-- FOOTER - DARK WITH GOLD TEXT -->
          <div style="padding: 24px 32px; background: #050505; border-top: 1px solid #1a1a1a; border-radius: 0 0 24px 24px;">
            <div style="display: flex; justify-content: center; gap: 32px; margin-bottom: 20px;">
              <a href="https://mzprimer.com/terms" style="color: #6b7280; font-size: 13px; text-decoration: none;">Terms</a>
              <span style="color: #3a3f44;">•</span>
              <a href="https://mzprimer.com/privacy" style="color: #6b7280; font-size: 13px; text-decoration: none;">Privacy</a>
              <span style="color: #3a3f44;">•</span>
              <a href="https://mzprimer.com/contact" style="color: #6b7280; font-size: 13px; text-decoration: none;">Support</a>
            </div>
            <p style="margin: 0; color: #4b5563; font-size: 12px; text-align: center; letter-spacing: 0.3px;">
              © ${new Date().getFullYear()} MZPrimer LTD · All rights reserved
            </p>
            ${isSubscription ? `
            <p style="margin: 16px 0 0; color: #d4af37; font-size: 10px; text-align: center; text-transform: uppercase; letter-spacing: 4px; opacity: 0.7;">
              INSTITUTIONAL GRADE · PROFESSIONAL LICENSE
            </p>
            ` : ''}
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
`;
  }

  text += `

Thank you for choosing MZPrimer!
Questions? Contact contact@mzprimer.com`;

  return text;
}
