import { NextResponse } from "next/server";
import { ensureOrdersHydrated, getAllOrders } from "@/app/lib/orders";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const sid = searchParams.get("session_id") || "";
  if (!sid) return NextResponse.json({ ok: false, error: "Missing session_id" }, { status: 400 });

  await ensureOrdersHydrated();

  // Your webhook updates orders like: txid: `stripe-${session.id}`
  const tx = `stripe-${sid}`;
  const orders = await getAllOrders();
  const order = orders.find(o => o.txid === tx);

  if (!order) return NextResponse.json({ ok: false, error: "Order not found" }, { status: 404 });

  // If you stored license/download data on the order (e.g. via the webhook),
  // you can include it here. For now we just return what we have.
  return NextResponse.json({
    ok: true,
    order: {
      id: order.id,
      status: order.status,
      productId: order.productId,
      productName: order.productName,
      amountUsd: order.amountUsd,
      // If your license endpoint saved it into order (optional):
      // licenseKey: order.licenseKey,
      // If one-time bot:
      // downloadReady: Boolean(order.downloadTokenHash && order.downloadExpiresAt && !order.downloadUsed)
    }
  });
}