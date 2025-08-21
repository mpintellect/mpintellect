// app/api/admin/orders/route.ts
import { NextResponse } from "next/server";
import { getAllOrders } from "../../../lib/orders"; // alias: listOrders

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const adminKey = process.env.ADMIN_API_KEY || "";
  const sentKey =
    req.headers.get("x-admin-key") ||
    req.headers.get("x-admin-key".toLowerCase()) ||
    "";

  if (!adminKey || sentKey !== adminKey) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const orders = getAllOrders();
  return NextResponse.json({ orders }, { status: 200 });
}