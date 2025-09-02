// app/api/stripe/webhook/route.ts
import { NextResponse } from "next/server";
import Stripe from "stripe";
import {
  ensureOrdersHydrated,
  getOrder,
  updateOrder,
  issueDownloadToken,
} from "../../../lib/orders";
import { sendOrderConfirmation } from "../../../lib/email";

// App Router: keep Node runtime and read the raw text body
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: "2025-08-27.basil", // ✅ matches your SDK types
});

/**
 * We expect you already set metadata when creating the Stripe Checkout Session:
 *   metadata: { orderId, productId, email }
 * mode==="subscription" => subscription product
 * mode==="payment"      => one-time bot (downloadable)
 */
export async function POST(req: Request) {
  const sig = req.headers.get("stripe-signature") || "";
  const secret = process.env.STRIPE_WEBHOOK_SECRET || "";
  if (!secret) {
    return NextResponse.json({ error: "Missing STRIPE_WEBHOOK_SECRET" }, { status: 500 });
  }

  let event: Stripe.Event;
  const body = await req.text(); // IMPORTANT: raw body for signature verification

  try {
    event = stripe.webhooks.constructEvent(body, sig, secret);
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Invalid signature";
    return NextResponse.json({ error: `Webhook Error: ${msg}` }, { status: 400 });
  }

  // Ensure our in-memory store is hydrated before we touch orders
  await ensureOrdersHydrated();

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;

        const orderId = session.metadata?.orderId || "";
        const productId = session.metadata?.productId || "";
        const email =
          session.customer_details?.email ||
          session.metadata?.email ||
          "";

        // Guard: we only act if we have an orderId (your create-session should set it)
        if (!orderId) {
          // Nothing to do — we don’t invent orders in webhook
          return NextResponse.json({ ok: true, note: "No orderId in metadata" });
        }

        const order = getOrder(orderId);
        if (!order) {
          // Don’t fail the webhook: maybe create-session didn’t create a local order
          return NextResponse.json({ ok: true, note: "Order not found; skipping" });
        }

        // Mark order paid (idempotent)
        if (order.status !== "paid") {
          updateOrder(order.id, {
            status: "paid",
            txid: `stripe-${session.id}`,
          });
        }

        // Decide: subscription vs one-time bot
        const isSubscription =
          session.mode === "subscription" || !!session.subscription;

        // Prepare optional values
        let licenseKey: string | undefined;
        let rawToken: string | undefined;
        let expiresAt: number | undefined;

        if (isSubscription) {
          // Create license via your existing endpoint
          try {
            const base =
              process.env.NEXT_PUBLIC_BASE_URL ||
              process.env.NEXT_PUBLIC_SITE_URL ||
              "";
            if (base && email) {
              const r = await fetch(`${base.replace(/\/+$/, "")}/api/license/create`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  email,
                  productId: "mz-ai-assistant",
                }),
              });
              const j = await r.json().catch(() => ({}));
              if (r.ok && j?.key) licenseKey = String(j.key);
            }
          } catch {
            /* ignore - payment is the source of truth */
          }

          // Send subscription email (license + Open Assistant link)
          if (email) {
await sendOrderConfirmation({
  to: email,
  orderId: order.id,
  productName: order.productName ?? "AI Assistant Subscription",
  amountPaid: Number(order.amountUsd),
  // Always force subscription template, even if minting lagged:
  licenseKey: licenseKey ?? "(issued)",
  assistantUrl: `${
    (process.env.NEXT_PUBLIC_SITE_URL ||
      process.env.NEXT_PUBLIC_BASE_URL ||
      "https://mzprimer.com").replace(/\/+$/, "")
  }/tools/ai-assistant?activate=1`,
  paymentDetails: {
    wallet: "Stripe",
    amount: Number(order.amountUsd),
    txId: session.id,
    network: "Card",
  },
});
          }
        } else {
          // One-time bot download
          const t = issueDownloadToken(order.id, 24 * 3600);
          rawToken = t.rawToken;
          expiresAt = t.expiresAt;

          if (email) {
            await sendOrderConfirmation({
              to: email,
              orderId: order.id,
              productName: order.productName,
              amountPaid: Number(order.amountUsd),
              downloadToken: rawToken, // <- switches template to bot download
              paymentDetails: {
                wallet: "Stripe",
                amount: Number(order.amountUsd),
                txId: session.id,
                network: "Card",
              },
            });
          }
        }

        return NextResponse.json({
          ok: true,
          handled: "checkout.session.completed",
          orderId,
          isSubscription,
          licenseKey,
          token: rawToken,
          expiresAt,
        });
      }

      case "invoice.payment_succeeded": {
        // Optional: handle recurring subscription renewals (send “renewal” email, etc.)
        // We won’t change orders here to avoid confusion.
        return NextResponse.json({ ok: true, handled: "invoice.payment_succeeded" });
      }

      default:
        // Acknowledge others to keep Stripe happy
        return NextResponse.json({ ok: true, ignored: event.type });
    }
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}