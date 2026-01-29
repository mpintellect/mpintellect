// app/api/checkout/create-session/route.ts - SIMPLIFIED
import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { userId, plan, email } = body;

    if (!userId || !plan || !email) {
      return NextResponse.json(
        { error: 'Missing required fields: userId, plan, email' },
        { status: 400 }
      );
    }

    const stripeKey = process.env.STRIPE_SECRET_KEY;
    if (!stripeKey) {
      throw new Error('Stripe secret key not configured');
    }

    const stripe = new Stripe(stripeKey, {
      // @ts-ignore
      apiVersion: '2023-10-16',
    });

    // Map plan to price ID (one-time purchases only)
    const priceMap: Record<string, string> = {
      '10': 'price_1SSyQORmR6ESDQvobwheaXws', // €4.5 for 10 setups
      '20': 'price_1SSyRGRmR6ESDQvoKgAI9CAN', // €8 for 20 setups
      '30': 'price_1SSyUORmR6ESDQvo7dzPKmPt', // €12 for 30 setups
    };

    const priceId = priceMap[plan];
    if (!priceId) {
      return NextResponse.json(
        { error: 'Invalid plan selected. Choose 10, 20, or 30 setups.' },
        { status: 400 }
      );
    }

    // Create checkout session for one-time payment
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: 'payment', // One-time payment, not subscription
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/client/dashboard?payment=success&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/client/dashboard?payment=canceled`,
      customer_email: email,
      metadata: {
        userId: userId,
        plan: plan,
        email: email,
      },
      allow_promotion_codes: true,
    });

    console.log(`💰 Checkout session created: ${session.id} for user ${userId}`);

    return NextResponse.json({
      success: true,
      url: session.url,
      sessionId: session.id,
    });

  } catch (error: any) {
    console.error('❌ Checkout session creation error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create checkout session' },
      { status: 500 }
    );
  }
}