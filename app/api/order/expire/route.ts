import { NextResponse } from "next/server";
import { getOrder, updateOrder } from "../../../lib/orders";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const orderId = searchParams.get("orderId");

    if (!orderId) {
      return NextResponse.json({ error: "orderId required" }, { status: 400 });
    }

    const order = getOrder(orderId);
    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    // Only expire if still pending
    if (order.status === "pending") {
      const updatedOrder = updateOrder(orderId, {
        status: "expired",
        downloadExpiresAt: Date.now() // Expire immediately
      });
      
      console.log(`✅ Order ${orderId} expired due to timeout`);
      return NextResponse.json({ status: "expired", order: updatedOrder });
    }

    return NextResponse.json({ status: "unchanged", currentStatus: order.status });

  } catch (e: any) {
    console.error("Order expiration failed:", e);
    return NextResponse.json({ error: e?.message || "Expiration failed" }, { status: 500 });
  }
}