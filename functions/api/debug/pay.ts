import { NextResponse } from "next/server";
import { getOrder, updateOrder, issueDownloadToken } from "../../../app/lib/orders";

export async function POST(req: Request) {
  const { orderId } = await req.json();

  const order = getOrder(orderId);
  if (!order) {
    return Response.json({ error: "Order not found" }, { status: 404 });
  }

  // Mark order as paid
  const paid = updateOrder(orderId, { status: "paid", txid: "SIMULATED-TXID" });

  // Issue token
  const { rawToken, expiresAt } = issueDownloadToken(orderId);

  return Response.json({
    status: "paid",
    order: paid,
    token: rawToken,
    expiresAt,
  });
}