import { NextResponse } from "next/server";
import { getOrder, updateOrder, issueDownloadToken } from "../../../lib/orders";

export async function POST(req: Request) {
  const { orderId } = await req.json();

  const order = getOrder(orderId);
  if (!order) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }

  // Mark order as paid
  const paid = updateOrder(orderId, { status: "paid", txid: "SIMULATED-TXID" });

  // Issue token
  const { rawToken, expiresAt } = issueDownloadToken(orderId);

  return NextResponse.json({
    status: "paid",
    order: paid,
    token: rawToken,
    expiresAt,
  });
}