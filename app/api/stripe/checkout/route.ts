import { NextResponse } from "next/server";
import Stripe from "stripe";
import { PRODUCT_PRICES } from "../../../lib/product-prices"; // ← Import from central file

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {});

export async function POST(req: Request) {
  const { priceId, orderId } = await req.json();

  // ✅ Validate priceId against known products
  const product = PRODUCT_PRICES[priceId as keyof typeof PRODUCT_PRICES]; // ← Use imported prices

  if (!product) {
    console.error("❌ Invalid priceId:", priceId);
    return NextResponse.json({ error: "Invalid product selected" }, { status: 400 });
  }

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/success?order=${orderId}`,
      cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/cancel`,
      metadata: {
        orderId,
        productName: product.name,
        duration: product.duration,
        productType: product.type,
      },
    });

    return NextResponse.json({ sessionId: session.id });
  } catch (error: any) {
    console.error("❌ Stripe session creation error:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}