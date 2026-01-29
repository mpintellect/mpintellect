// app/api/newsletter/subscribe/route.ts - CLOUDFLARE VERSION
import { NextResponse } from 'next/server';
import { getDb, queryOne, execute } from '@/app/lib/cloudflare/db-simple';

export async function POST(request: Request) {
  try {
    // 1. Parse the incoming JSON body
    const { email, source = 'footer', name, referralCode } = await request.json();

    // 2. Basic Validation
    if (!email || !email.includes('@')) {
      return NextResponse.json(
        { error: 'Please provide a valid email address' },
        { status: 400 }
      );
    }

    // Normalize email
    const normalizedEmail = email.toLowerCase().trim();

    // 3. Check if email already exists
    const existingSubscriber = await queryOne(
      'SELECT id, status FROM newsletter_subscribers WHERE email = ? LIMIT 1',
      [normalizedEmail]
    );

    if (existingSubscriber) {
      // If subscriber exists and is active, return success without revealing they exist
      if (existingSubscriber.status === 'active') {
        return NextResponse.json(
          { 
            success: true, 
            message: 'Subscription successful',
            isNew: false 
          }, 
          { status: 200 }
        );
      }
      
      // If subscriber was previously unsubscribed, reactivate
      if (existingSubscriber.status === 'unsubscribed') {
        await execute(
          `UPDATE newsletter_subscribers 
           SET status = 'active', updated_at = ?, reactivated_at = ?, source = ?
           WHERE id = ?`,
          [Date.now(), Date.now(), source || 'footer', existingSubscriber.id]
        );
        
        console.log(`✅ Subscriber reactivated: ${normalizedEmail}`);
        
        return NextResponse.json(
          { 
            success: true, 
            message: 'Welcome back! Your subscription has been reactivated.',
            isNew: false,
            reactivated: true
          }, 
          { status: 200 }
        );
      }
    }

    // 4. Save to Cloudflare D1 database
    const now = Date.now();
    const subscriberId = crypto.randomUUID();
    
    const result = await execute(
      `INSERT INTO newsletter_subscribers 
       (id, email, name, source, referral_code, status, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, 'active', ?, ?)`,
      [
        subscriberId,
        normalizedEmail,
        name || null,
        source || 'footer',
        referralCode || null,
        now,
        now
      ]
    );

    if (!result.success) {
      throw new Error('Failed to save subscriber to database');
    }

    console.log(`✅ New subscriber added: ${normalizedEmail} (ID: ${subscriberId})`);

    // 5. Optional: Send welcome email (if you have email service configured)
    try {
      await sendWelcomeEmail(normalizedEmail, name);
    } catch (emailError) {
      console.warn('Failed to send welcome email:', emailError);
      // Don't fail the subscription if email fails
    }

    return NextResponse.json(
      { 
        success: true, 
        message: 'Successfully subscribed! Please check your email for confirmation.',
        subscriberId,
        isNew: true
      },
      { status: 200 }
    );

  } catch (error: any) {
    console.error('❌ Newsletter API Error:', error);
    
    return NextResponse.json(
      { 
        error: 'Unable to process subscription. Please try again later.',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: 500 }
    );
  }
}

// Optional: Welcome email function
async function sendWelcomeEmail(email: string, name?: string) {
  // This is a placeholder. Implement with your email service (Resend, SendGrid, etc.)
  const welcomeTemplate = {
    to: email,
    subject: 'Welcome to MZPrimer Newsletter! 🚀',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #22c55e;">Welcome to MZPrimer! 👋</h1>
        <p>Hi ${name || 'there'},</p>
        <p>Thank you for subscribing to our newsletter. You'll now receive:</p>
        <ul>
          <li>📈 Daily trading signals and market analysis</li>
          <li>🎯 AI-powered trade setups</li>
          <li>💡 Expert insights and strategies</li>
          <li>⚡ Exclusive tips and updates</li>
        </ul>
        <p>Stay tuned for valuable content delivered straight to your inbox!</p>
        <div style="margin-top: 30px; padding: 20px; background-color: #f8fafc; border-radius: 8px;">
          <p><strong>Next Step:</strong> Check out our <a href="https://mzprimer.com/blog" style="color: #3b82f6;">blog</a> for the latest articles.</p>
        </div>
        <p style="margin-top: 30px; color: #64748b; font-size: 14px;">
          If you didn't subscribe, you can <a href="https://mzprimer.com/api/newsletter/unsubscribe?email=${encodeURIComponent(email)}" style="color: #ef4444;">unsubscribe here</a>.
        </p>
      </div>
    `,
    text: `
      Welcome to MZPrimer!
      
      Hi ${name || 'there'},
      
      Thank you for subscribing to our newsletter. You'll now receive:
      - Daily trading signals and market analysis
      - AI-powered trade setups
      - Expert insights and strategies
      - Exclusive tips and updates
      
      Stay tuned for valuable content delivered straight to your inbox!
      
      Next Step: Check out our blog at https://mzprimer.com/blog for the latest articles.
      
      If you didn't subscribe, you can unsubscribe here: https://mzprimer.com/api/newsletter/unsubscribe?email=${encodeURIComponent(email)}
    `
  };
  
  // Example using Resend (install: npm install resend)
  // const { Resend } = require('resend');
  // const resend = new Resend(process.env.RESEND_API_KEY);
  // await resend.emails.send(welcomeTemplate);
  
  console.log(`📧 Welcome email would be sent to: ${email}`);
  return Promise.resolve();
}