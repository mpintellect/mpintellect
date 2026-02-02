import { NextResponse } from "next/server";
import { getOrder, updateOrder } from "../../../app/lib/orders";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const orderId = searchParams.get("orderId");

    if (!orderId) {
      return Response.json({ error: "orderId required" }, { status: 400 });
    }

    const order = getOrder(orderId);
    if (!order) {
      return Response.json({ error: "Order not found" }, { status: 404 });
    }

    // Only expire if still pending
    if (order.status === "pending") {
      const updatedOrder = updateOrder(orderId, {
        status: "expired",
        downloadExpiresAt: Date.now() // Expire immediately
      });
      
      console.log(`✅ Order ${orderId} expired due to timeout`);
      return Response.json({ status: "expired", order: updatedOrder });
    }

    return Response.json({ status: "unchanged", currentStatus: order.status });

  } catch (e: unknown) {
    console.error("Order expiration failed:", (e as Error)?.message || e);
    return Response.json({ error: (e as Error)?.message || "Expiration failed" }, { status: 500 });
  }
}