// functions/api/newsletter/subscribe.ts

// Helper function for CORS
const HEADERS = {
  'Content-Type': 'application/json',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

// Handle OPTIONS request for CORS preflight
export async function onRequestOptions() {
  return new Response(null, {
    status: 204,
    headers: HEADERS
  });
}

// Main POST handler
export async function onRequestPost(context: any) {
  const { request, env } = context;

  try {
    // 1. Parse the incoming JSON body
    const { email, source = 'footer', name, referralCode } = await request.json();

    // 2. Basic Validation
    if (!email || !email.includes('@')) {
      return new Response(
        JSON.stringify({ error: 'Please provide a valid email address' }),
        { status: 400, headers: HEADERS }
      );
    }

    // Normalize email
    const normalizedEmail = email.toLowerCase().trim();

    // 3. Initialize DB connection
    const db = env.DB; // D1 binding from Cloudflare

    // 4. Check if email already exists
    const existingSubscriber = await db.prepare(
      'SELECT id, status FROM newsletter_subscribers WHERE email = ? LIMIT 1'
    ).bind(normalizedEmail).first();

    if (existingSubscriber) {
      // If subscriber exists and is active, return success
      if (existingSubscriber.status === 'active') {
        return new Response(
          JSON.stringify({ 
            success: true, 
            message: 'Subscription successful',
            isNew: false 
          }),
          { status: 200, headers: HEADERS }
        );
      }
      
      // If subscriber was previously unsubscribed, reactivate
      if (existingSubscriber.status === 'unsubscribed') {
        const now = new Date().toISOString();
        await db.prepare(
          `UPDATE newsletter_subscribers 
           SET status = 'active', updated_at = ?, reactivated_at = ?, source = ?
           WHERE id = ?`
        ).bind(now, now, source || 'footer', existingSubscriber.id).run();
        
        console.log(`✅ Subscriber reactivated: ${normalizedEmail}`);
        
        return new Response(
          JSON.stringify({ 
            success: true, 
            message: 'Welcome back! Your subscription has been reactivated.',
            isNew: false,
            reactivated: true
          }),
          { status: 200, headers: HEADERS }
        );
      }
    }

    // 5. Save to Cloudflare D1 database
    const now = new Date().toISOString();
    const subscriberId = crypto.randomUUID();
    
    const result = await db.prepare(
      `INSERT INTO newsletter_subscribers 
       (id, email, name, source, referral_code, status, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, 'active', ?, ?)`
    ).bind(
      subscriberId,
      normalizedEmail,
      name || null,
      source || 'footer',
      referralCode || null,
      now,
      now
    ).run();

    if (!result.success) {
      throw new Error('Failed to save subscriber to database');
    }

    console.log(`✅ New subscriber added: ${normalizedEmail} (ID: ${subscriberId})`);

    // 6. Send welcome email using direct fetch to Resend (no imports)
    try {
      await sendWelcomeEmailDirect(normalizedEmail, name, env);
    } catch (emailError) {
      console.warn('Failed to send welcome email:', emailError);
      // Don't fail the subscription if email fails
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Successfully subscribed! Please check your email for confirmation.',
        subscriberId,
        isNew: true
      }),
      { status: 200, headers: HEADERS }
    );

  } catch (error: any) {
    console.error('❌ Newsletter API Error:', error);
    
    return new Response(
      JSON.stringify({ 
        error: 'Unable to process subscription. Please try again later.',
        details: env.NODE_ENV === 'development' ? error.message : undefined
      }),
      { status: 500, headers: HEADERS }
    );
  }
}

// Direct email function using Resend (no imports)
// Direct email function using Resend (no imports)
async function sendWelcomeEmailDirect(email: string, name: string | undefined, env: any) {
  const apiKey = env.RESEND_API_KEY;
  
  if (!apiKey) {
    console.warn('RESEND_API_KEY not configured, skipping welcome email');
    return;
  }

  const customerName = name || email.split('@')[0] || 'Trader';

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="color-scheme" content="dark">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="margin:0; padding:0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', sans-serif; background: #000000;">
      <div style="background: radial-gradient(125% 125% at 50% 10%, #0a0c0e, #000000); padding: 48px 24px;">
        <div style="max-width: 560px; margin: 0 auto; background: #0c0c0c; border: 1px solid rgba(212, 175, 55, 0.25); border-radius: 24px;">
          <div style="height: 4px; background: linear-gradient(90deg, #d4af37, #f9e076, #b49450); border-radius: 24px 24px 0 0;"></div>
          <div style="padding: 40px 32px;">
            <div style="display: inline-block; background: rgba(212, 175, 55, 0.08); border: 1px solid rgba(212, 175, 55, 0.3); border-radius: 100px; padding: 8px 20px; margin-bottom: 24px;">
              <span style="color: #d4af37; font-size: 13px; font-weight: 700; letter-spacing: 1.5px; text-transform: uppercase;">
                ✓ NEWSLETTER CONFIRMATION
              </span>
            </div>
            
            <h1 style="margin: 0 0 16px; font-size: 32px; font-weight: 700; letter-spacing: -0.02em; line-height: 1.2; color: #ffffff;">
              Welcome to MZPrimer! <span style="color: #d4af37;">📚</span>
            </h1>
            
            <p style="margin: 0 0 8px; font-size: 16px; color: #e5e7eb;">
              Dear <span style="color: #d4af37; font-weight: 600;">${customerName}</span>,
            </p>
            
            <p style="margin: 0 0 32px; font-size: 16px; color: #cbd5e1; line-height: 1.6;">
              Thank you for joining our educational community. You'll now receive institutional-grade market insights and trading education directly in your inbox.
            </p>

            <div style="background: linear-gradient(165deg, #0f0f0f, #080808); border-radius: 20px; padding: 28px; border: 1px solid rgba(212, 175, 55, 0.35); margin-bottom: 32px;">
              <p style="color: #d4af37; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 2px; margin-bottom: 20px;">
                📚 Educational Content You'll Receive:
              </p>
              <ul style="list-style: none; padding: 0; margin: 0;">
                <li style="display: flex; align-items: center; margin-bottom: 16px; color: #e5e7eb;">
                  <span style="margin-right: 12px; font-size: 20px;">📊</span>
                  <span><strong style="color: #d4af37;">Market Analysis</strong> - Professional breakdown of forex, crypto & indices</span>
                </li>
                <li style="display: flex; align-items: center; margin-bottom: 16px; color: #e5e7eb;">
                  <span style="margin-right: 12px; font-size: 20px;">🎓</span>
                  <span><strong style="color: #d4af37;">Trading Education</strong> - Strategies, risk management & psychology tips</span>
                </li>
                <li style="display: flex; align-items: center; margin-bottom: 16px; color: #e5e7eb;">
                  <span style="margin-right: 12px; font-size: 20px;">📰</span>
                  <span><strong style="color: #d4af37;">Economic News</strong> - Key events and their market impact</span>
                </li>
                <li style="display: flex; align-items: center; color: #e5e7eb;">
                  <span style="margin-right: 12px; font-size: 20px;">⚡</span>
                  <span><strong style="color: #d4af37;">Weekly Insights</strong> - Curated trading intelligence and market outlook</span>
                </li>
              </ul>
            </div>

            <div style="text-align: center; margin-top: 32px;">
              <a href="https://mzprimer.com/markets" 
                 style="display: inline-block; background: #d4af37; color: #000000; text-decoration: none; padding: 16px 40px; border-radius: 100px; font-weight: 800; font-size: 15px; letter-spacing: 2px; text-transform: uppercase; border: 1px solid #f9e076;">
                EXPLORE MARKETS →
              </a>
            </div>

            <div style="margin-top: 32px; padding: 16px; background: rgba(212, 175, 55, 0.02); border: 1px solid rgba(212, 175, 55, 0.1); border-radius: 12px;">
              <p style="color: #6b7280; font-size: 12px; text-align: center;">
                If you didn't subscribe, you can 
                <a href="https://mzprimer.com/api/unsubscribe?email=${encodeURIComponent(email)}" style="color: #d4af37; text-decoration: none;">
                  unsubscribe here
                </a>.
              </p>
            </div>
          </div>
          
          <div style="padding: 24px 32px; background: #050505; border-top: 1px solid #1a1a1a; border-radius: 0 0 24px 24px;">
            <p style="margin: 0; color: #4b5563; font-size: 12px; text-align: center;">
              MZPRIMER INTELLIGENCE LTD • EDUCATIONAL TRADING RESOURCES
            </p>
          </div>
        </div>
      </div>
    </body>
    </html>
  `;

  const text = `
MZPRIMER - NEWSLETTER CONFIRMATION
========================================

Dear ${customerName},

Thank you for joining our educational community. You'll now receive institutional-grade market insights and trading education directly in your inbox.

📚 Educational Content You'll Receive:

- Market Analysis - Professional breakdown of forex, crypto & indices
- Trading Education - Strategies, risk management & psychology tips
- Economic News - Key events and their market impact
- Weekly Insights - Curated trading intelligence and market outlook

Explore our markets: https://mzprimer.com/markets

If you didn't subscribe, you can unsubscribe here:
https://mzprimer.com/api/unsubscribe?email=${encodeURIComponent(email)}

MZPRIMER INTELLIGENCE LTD
  `;

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: env.EMAIL_FROM || 'MZPrimer Education <education@mzprimer.com>',
        to: [email],
        subject: 'Welcome to MZPrimer Education! 📚',
        html,
        text
      }),
    });

    const data = await response.json();
    
    if (response.ok) {
      console.log(`✅ Welcome email sent to ${email}`, data);
    } else {
      console.error('❌ Failed to send welcome email:', data);
    }
  } catch (error) {
    console.error('❌ Error sending welcome email:', error);
    throw error;
  }
}