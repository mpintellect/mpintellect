// functions/api/checkout/create-session.ts

import Stripe from 'stripe';

/**
 * FIXED: 
 * 1. Changed to onRequestPost(context: any)
 * 2. Destructured { request, env } to define variables and environment keys
 */
export async function onRequestPost(context: any) {
  const { request, env } = context;

  try {
    const body = await request.json();
    const { userId, plan, email } = body;

    if (!userId || !plan || !email) {
      return Response.json(
        { error: 'Missing required fields: userId, plan, email' },
        { status: 400 }
      );
    }

    // Access key from 'env' (passed via context)
    const stripeKey = env.STRIPE_SECRET_KEY;
    if (!stripeKey) {
      throw new Error('Stripe secret key not configured in Cloudflare Dashboard');
    }

    const stripe = new Stripe(stripeKey, {
      // @ts-ignore
      apiVersion: '2023-10-16',
    });

    // Map plan to price ID
    const priceMap: Record<string, string> = {
      '10': 'price_1SSyQORmR6ESDQvobwheaXws', // €4.5 for 10 setups
      '20': 'price_1SSyRGRmR6ESDQvoKgAI9CAN', // €8 for 20 setups
      '30': 'price_1SSyUORmR6ESDQvo7dzPKmPt', // €12 for 30 setups
    };

    const priceId = priceMap[plan];
    if (!priceId) {
      return Response.json(
        { error: 'Invalid plan selected. Choose 10, 20, or 30 setups.' },
        { status: 400 }
      );
    }

    // Use env.NEXT_PUBLIC_APP_URL instead of process.env
    const appUrl = env.NEXT_PUBLIC_APP_URL || 'https://mzprimer.com';

    // Create checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${appUrl}/client/dashboard?payment=success&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${appUrl}/client/dashboard?payment=canceled`,
      customer_email: email,
      metadata: {
        userId: userId,
        plan: plan,
        email: email,
      },
      allow_promotion_codes: true,
    });

    return Response.json({
      success: true,
      url: session.url,
      sessionId: session.id,
    });

  } catch (error: any) {
    console.error('❌ Checkout session creation error:', error);
    return Response.json(
      { error: error.message || 'Failed to create checkout session' },
      { status: 500 }
    );
  }
}