// app/api/stripe/create-session/route.ts
import { NextResponse } from "next/server";
import Stripe from "stripe";
import { PRODUCTS, createOrder, ensureOrdersHydrated } from "../../../lib/orders";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-08-27.basil",
});

// env price resolver: supports PRICE_... and STRIPE_PRICE_...
function priceFromEnv(productId: string): string | null {
  const KEY = productId.toUpperCase().replace(/-/g, "_");
  const candidates = [`PRICE_${KEY}`, `STRIPE_PRICE_${KEY}`];
  for (const name of candidates) {
    const v = process.env[name];
    if (v && v.trim()) return v.trim();
  }
  return null;
}

function modeFor(productId: string): "subscription" | "payment" {
  return productId.includes("assistant") ? "subscription" : "payment";
}

function baseUrl() {
  const u =
    process.env.NEXT_PUBLIC_SITE_URL ||
    process.env.NEXT_PUBLIC_BASE_URL ||
    "http://localhost:3000";
  return u.replace(/\/+$/, "");
}

export async function POST(req: Request) {
  await ensureOrdersHydrated();

  try {
    const { productId, email, buyerName } = (await req.json()) as {
      productId?: string;
      email?: string;
      buyerName?: string;
    };

    if (!productId || !email) {
      return NextResponse.json(
        { ok: false, error: "Missing productId or email" },
        { status: 400 }
      );
    }

    // 1) Find product in your catalog (give it a concrete type)
type CatalogItem = {
  id: string;
  name: string;
  priceUsd: number;
  filePath?: string;
  available?: boolean;
};

const all = Object.values(PRODUCTS) as CatalogItem[];
const product = all.find(
  (p) => p.id === productId && p.available !== false
);

if (!product) {
  return NextResponse.json(
    { ok: false, error: `Unknown or unavailable product: ${productId}` },
    { status: 404 }
  );
}

// 2) Create a local order (card method)
const order = createOrder({
  productId: product.id,
  productName: product.name,
  filePath: product.filePath ?? "", // subscriptions have ""
  amountUsd: product.priceUsd,
  method: "card",
  email,
  buyerName,
});
    // 2) Resolve Stripe price id
    const priceId = priceFromEnv(productId);
    if (!priceId) {
      return NextResponse.json(
        { ok: false, error: `Missing Stripe price env for ${productId}` },
        { status: 500 }
      );
    }

    // 4) Create Stripe Checkout session and pass orderId in metadata
    const mode = modeFor(productId);
    const session = await stripe.checkout.sessions.create({
      mode,
      payment_method_types: ["card"],
      line_items: [{ price: priceId, quantity: 1 }],
      customer_email: email,
      success_url: `${baseUrl()}/thank-you?orderId=${order.id}&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl()}/checkout?canceled=true`,
      metadata: {
        orderId: order.id,
        productId,
        email,
      },
    });

    return NextResponse.json({ ok: true, url: session.url });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Stripe error";
    console.error("[stripe/create-session] ", err);
    return NextResponse.json({ ok: false, error: msg }, { status: 500 });
  }
}