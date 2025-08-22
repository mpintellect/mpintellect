import { NextResponse } from "next/server";
import { getAllOrders } from "../../../lib/orders";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const ADMIN_HEADER = "x-admin-key";

function isAuthorized(req: Request) {
  const key = req.headers.get(ADMIN_HEADER) || "";
  return key && key === (process.env.ADMIN_API_KEY || "");
}

/**
 * GET /api/admin/orders
 * Requires: header "x-admin-key: <ADMIN_API_KEY>"
 * Returns: { orders, summary }
 */
export async function GET(req: Request) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Fetch all orders from in-memory store (hydrated from disk)
  const orders = getAllOrders();

  // Simple summary (useful in the UI)
  const summary = {
    total: orders.length,
    paid: orders.filter((o) => o.status === "paid").length,
    pending: orders.filter((o) => o.status === "pending").length,
    expired: orders.filter((o) => o.status === "expired").length,
    revenueUsd: orders
      .filter((o) => o.status === "paid")
      .reduce((s, o) => s + (Number(o.amountUsd) || 0), 0),
  };

  return NextResponse.json({ orders, summary }, { status: 200 });
}