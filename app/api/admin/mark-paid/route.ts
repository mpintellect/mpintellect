import { NextRequest, NextResponse } from "next/server";
import {
  ensureOrdersHydrated,
  getOrder,
  updateOrder,
  issueDownloadToken,
} from "../../../lib/orders";
import { sendOrderConfirmation } from "../../../lib/email";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  await ensureOrdersHydrated();

  const { orderId } = (await req.json()) as { orderId?: string };
  if (!orderId) return NextResponse.json({ ok: false, error: "orderId missing" }, { status: 400 });

  const order = getOrder(orderId);
  if (!order) return NextResponse.json({ ok: false, error: "order not found" }, { status: 404 });

  // Mark paid
  updateOrder(order.id, { status: "paid", txid: `admin-${Date.now()}` });

  // Decide bot vs subscription
  const isBot = Boolean(order.filePath && order.filePath.trim().length > 0);

  let token: string | undefined;
  let expiresAt: number | undefined;
  let licenseKey: string | undefined;

  if (isBot) {
    const t = issueDownloadToken(order.id, 24 * 3600);
    token = t.rawToken;
    expiresAt = t.expiresAt;
  } else {
    // fake a license in test; in prod call your real generator
    // or use /api/license/create like you already do in check-usdt
    licenseKey = `MZP-TEST-${Math.random().toString(36).slice(2, 10).toUpperCase()}`;
  }

  if (order.email) {
    await sendOrderConfirmation({
      to: order.email,
      orderId: order.id,
      productName: order.productName,
      amountPaid: Number(order.amountUsd),

      downloadToken: isBot ? token : undefined,
      licenseKey: !isBot ? licenseKey : undefined,
      assistantUrl: `${(process.env.NEXT_PUBLIC_SITE_URL || process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000").replace(/\/+$/,"")}/tools/ai-assistant`,

      paymentDetails: {
        wallet: process.env.USDT_WALLET || "",
        amount: Number(order.amountUsd),
        txid: `admin-${Date.now()}`,
        network: "TRC20",
      },
    });
  }

  return NextResponse.json(
    isBot
      ? { ok: true, mode: "bot", token, expiresAt }
      : { ok: true, mode: "subscription", licenseKey },
    { status: 200 }
  );
}