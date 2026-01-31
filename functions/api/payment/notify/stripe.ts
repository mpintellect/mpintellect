// app/api/payment/notify/stripe/route.ts
import { NextResponse } from "next/server";
import { getOrder, updateOrder, issueDownloadToken } from "../../../../app/lib/orders";
import { sendOrderConfirmation } from "../../../../app/lib/email"; // optional if you already have it

export const dynamic = "force-dynamic";

/**
 * DEMO webhook:
 * POST { orderId: string }
 * In production: verify Stripe signature & amounts!
 */
export async function POST(req: Request) {
  try {
    const { orderId } = await req.json();

    if (!orderId) {
      return Response.json({ error: "orderId required" }, { status: 400 });
    }

    const order = getOrder(orderId);
    if (!order) return Response.json({ error: "Order not found" }, { status: 404 });

    // If already paid, just issue a fresh token
    if (order.status === "paid") {
      const { rawToken, expiresAt } = issueDownloadToken(order.id, 24 * 3600);
      return Response.json({ ok: true, token: rawToken, expiresAt }, { status: 200 });
    }

    // Mark paid
    updateOrder(order.id, { status: "paid" });

    // Issue one-time token
    const { rawToken, expiresAt } = issueDownloadToken(order.id, 24 * 3600);

    // (optional) email
    try {
      await sendOrderConfirmation({
        to: order.email ?? "",
        orderId: order.id,
        productName: order.productName,
        downloadToken: rawToken,
        amountPaid: order.amountUsd,
      });
    } catch {}

    return Response.json({ ok: true, token: rawToken, expiresAt }, { status: 200 });
  } catch (e: unknown) {
    return Response.json({ error: (e as Error).message || "Webhook error" }, { status: 500 });
  }
}