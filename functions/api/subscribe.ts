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
        await db.prepare(
          `UPDATE newsletter_subscribers 
           SET status = 'active', updated_at = ?, reactivated_at = ?, source = ?
           WHERE id = ?`
        ).bind(Date.now(), Date.now(), source || 'footer', existingSubscriber.id).run();
        
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
    const now = Date.now();
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

    // 6. Optional: Send welcome email (if you have email service configured)
    try {
      await sendWelcomeEmail(normalizedEmail, name, env);
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

// Welcome email function using your existing email system
async function sendWelcomeEmail(email: string, name: string | undefined, env: any) {
  // Option 1: Use your existing sendEmail function if available
  try {
    const { sendEmail } = await import('../../backend-lib/email');
    
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="color-scheme" content="dark">
      </head>
      <body style="margin:0; padding:0; font-family: sans-serif; background: #000000;">
        <div style="background: #050505; padding: 48px 20px;">
          <div style="max-width: 560px; margin: 0 auto; background: #0c0c0c; border: 1px solid rgba(212, 175, 55, 0.3); border-radius: 20px;">
            <div style="height: 4px; background: #d4af37;"></div>
            <div style="padding: 40px;">
              <h1 style="color: #ffffff; font-size: 28px; margin-bottom: 20px;">
                Welcome to MZPrimer! <span style="color: #d4af37;">🚀</span>
              </h1>
              <p style="color: #e5e7eb; margin-bottom: 20px;">
                Hi ${name || 'there'},
              </p>
              <p style="color: #cbd5e1; line-height: 1.6; margin-bottom: 30px;">
                Thank you for subscribing to our newsletter. You'll now receive institutional-grade trading intelligence directly in your inbox.
              </p>
              
              <div style="background: #0a0a0a; border: 1px solid #1a1a1a; border-radius: 12px; padding: 24px; margin-bottom: 30px;">
                <p style="color: #d4af37; font-size: 12px; font-weight: bold; text-transform: uppercase; letter-spacing: 2px; margin-bottom: 15px;">
                  What to expect:
                </p>
                <ul style="color: #cbd5e1; list-style: none; padding: 0;">
                  <li style="margin-bottom: 10px;">📈 <strong>Daily Signals</strong> - Professional trade setups</li>
                  <li style="margin-bottom: 10px;">🤖 <strong>AI Analysis</strong> - Machine learning insights</li>
                  <li style="margin-bottom: 10px;">⚡ <strong>Exclusive Updates</strong> - Product launches and features</li>
                </ul>
              </div>

              <div style="text-align: center; margin-top: 30px;">
                <a href="https://mzprimer.com/" 
                   style="display: inline-block; background: #d4af37; color: #000; text-decoration: none; padding: 12px 32px; border-radius: 5px; font-weight: bold; text-transform: uppercase; font-size: 12px; letter-spacing: 2px;">
                  EXPLORE ANALYSIS →
                </a>
              </div>

              <div style="margin-top: 30px; padding: 16px; background: rgba(212, 175, 55, 0.02); border: 1px solid rgba(212, 175, 55, 0.1); border-radius: 8px;">
                <p style="color: #6b7280; font-size: 12px; text-align: center;">
                  If you didn't subscribe, you can <a href="https://mzprimer.com/api/unsubscribe?email=${encodeURIComponent(email)}" style="color: #d4af37;">unsubscribe here</a>.
                </p>
              </div>
            </div>
            <div style="background: #080808; padding: 20px; text-align: center;">
              <p style="color: #444; font-size: 10px; letter-spacing: 2px;">
                MZPRIMER INTELLIGENCE LTD • INSTITUTIONAL TRADING SYSTEMS
              </p>
            </div>
          </div>
        </div>
      </body>
      </html>
    `;

    const text = `
Welcome to MZPrimer! 🚀

Hi ${name || 'there'},

Thank you for subscribing to our newsletter. You'll now receive institutional-grade trading intelligence directly in your inbox.

What to expect:
- Daily Signals - Professional trade setups
- AI Analysis - Machine learning insights
- Exclusive Updates - Product launches and features

Explore our analysis: https://mzprimer.com/

If you didn't subscribe, you can unsubscribe here: https://mzprimer.com/api/unsubscribe?email=${encodeURIComponent(email)}

MZPRIMER INTELLIGENCE LTD
    `;

    await sendEmail({
      to: email,
      subject: 'Welcome to MZPrimer Newsletter! 🚀',
      html,
      text
    }, env);

  } catch (error) {
    console.warn('Email service not available, skipping welcome email');
  }
}