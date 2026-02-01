import { NextResponse } from "@/landing/node_modules/next/server";
import { PRODUCTS } from "../../../../landing/app/lib/orders";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  return Response.json({ scalperX1: PRODUCTS.scalperX1 });
}