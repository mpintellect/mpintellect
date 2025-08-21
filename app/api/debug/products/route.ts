import { NextResponse } from "next/server";
import { PRODUCTS } from "../../../lib/orders";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json({ scalperX1: PRODUCTS.scalperX1 });
}