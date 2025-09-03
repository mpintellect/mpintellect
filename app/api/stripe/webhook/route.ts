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
import { createLicense } from "../../../lib/licenses";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: "2025-08-27.basil",
});

export async function POST(req: Request) {
  const sig = req.headers.get("stripe-signature") || "";
  const secret = process.env.STRIPE_WEBHOOK_SECRET || "";
  if (!secret) {
    return NextResponse.json({ error: "Missing STRIPE_WEBHOOK_SECRET" }, { status: 500 });
  }

  const body = await req.text();
  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, secret);
  } catch (err: any) {
    return NextResponse.json({ error: `Webhook Error: ${err?.message || "Invalid signature"}` }, { status: 400 });
  }

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

        console.log("🔄 Processing Stripe webhook:", {
          orderId,
          eventType: event.type,
          hasEmail: !!email
        });

        if (!orderId) {
          console.error("❌ No orderId in metadata");
          return NextResponse.json({ ok: true, note: "No orderId in metadata" });
        }

        const order = getOrder(orderId);
        if (!order) {
          console.error("❌ Order not found:", orderId);
          return NextResponse.json({ ok: true, note: "Order not found; skipping" });
        }

        // Update order status FIRST
        if (order.status !== "paid") {
          updateOrder(order.id, { 
            status: "paid", 
            txid: `stripe-${session.id}`,
            email: email || order.email
          });
          console.log("✅ Order marked as paid:", orderId);
        }

        const isSubscription = session.mode === "subscription" || !!session.subscription;

        let licenseKey: string | undefined;
        let rawToken: string | undefined;
        let expiresAt: number | undefined;

        if (isSubscription) {
          console.log("📋 Processing subscription order");
          
          if (email) {
            try {
              const lic = await createLicense(email, productId || "mz-ai-assistant");
              licenseKey = lic.key;
              
              await sendOrderConfirmation({
                to: email,
                orderId: order.id,
                productName: order.productName ?? "AI Assistant Subscription",
                amountPaid: Number(order.amountUsd),
                licenseKey,
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
              console.log("✅ Subscription email sent to:", email);
            } catch (emailError) {
              console.error("❌ Failed to send subscription email:", emailError);
            }
          }
        } else {
          console.log("🤖 Processing bot purchase order");
          
          try {
            // Generate download token for bot purchases
            const t = issueDownloadToken(order.id, 24 * 3600);
            rawToken = t.rawToken;
            expiresAt = t.expiresAt;

            console.log("🪙 Generated download token:", {
              orderId,
              tokenLength: rawToken?.length,
              tokenPreview: rawToken ? `${rawToken.substring(0, 10)}...` : 'NONE'
            });

            if (email && rawToken) {
              await sendOrderConfirmation({
                to: email,
                orderId: order.id,
                productName: order.productName,
                amountPaid: Number(order.amountUsd),
                downloadToken: rawToken,
                paymentDetails: {
                  wallet: "Stripe",
                  amount: Number(order.amountUsd),
                  txId: session.id,
                  network: "Card",
                },
              });
              console.log("✅ Bot purchase email sent to:", email);
            } else {
              console.error("❌ Missing email or token for bot purchase:", {
                hasEmail: !!email,
                hasToken: !!rawToken
              });
            }
          } catch (tokenError) {
            console.error("❌ Failed to process bot purchase:", tokenError);
          }
        }

        return NextResponse.json({
          ok: true,
          handled: "checkout.session.completed",
          orderId,
          isSubscription,
          emailSent: !!email,
          licenseKey: licenseKey ? `${licenseKey.substring(0, 8)}...` : null,
          token: rawToken ? `${rawToken.substring(0, 10)}...` : null,
        });
      }

      case "invoice.payment_succeeded": {
        console.log("💵 Invoice payment succeeded event");
        return NextResponse.json({ ok: true, handled: "invoice.payment_succeeded" });
      }

      default:
        console.log("⚪ Ignored event type:", event.type);
        return NextResponse.json({ ok: true, ignored: event.type });
    }
  } catch (err: any) {
    console.error("[webhook] handler error:", event.type, err);
    return NextResponse.json({ error: err?.message || "Webhook handler failed" }, { status: 500 });
  }
}