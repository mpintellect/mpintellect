// app/api/products/route.ts
import { NextResponse } from "next/server";
import { PRODUCTS, ensureOrdersHydrated } from "../../lib/orders";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const hasFilePath = (x: any): x is { filePath: string } =>
  typeof x?.filePath === "string" && x.filePath.length > 0;

export async function GET() {
  // make sure products/orders are hydrated (safe no-op if already done)
  await ensureOrdersHydrated();

  const list = Object.values(PRODUCTS)
    .filter((p: any) => p.available)
    .map((p: any) => ({
      id: p.id,
      name: p.name,
      priceUsd: p.priceUsd,
      type: hasFilePath(p) ? "one_time" : "subscription",
    }));

  return NextResponse.json({ ok: true, products: list });
}