// app/api/order/create/route.ts
import { NextResponse } from "next/server";
// If you have a tsconfig path alias, prefer: import { createOrder, PRODUCTS } from "@/app/lib/orders";
import { createOrder, PRODUCTS } from "../../../lib/orders";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/* ---------------- helpers ---------------- */
function pickIP(headers: Headers) {
  const xff = headers.get("x-forwarded-for");
  if (xff) return xff.split(",")[0]?.trim() || null;
  return (
    headers.get("x-real-ip") ||
    headers.get("x-client-ip") ||
    headers.get("cf-connecting-ip") ||
    null
  );
}

function pickCountry(headers: Headers) {
  const code =
    headers.get("x-vercel-ip-country") ||
    headers.get("cf-ipcountry") ||
    headers.get("x-client-country") ||
    headers.get("x-country") ||
    null;

  const cc = code ? code.toUpperCase() : null;
  const names: Record<string, string> = {
    US: "United States",
    GB: "United Kingdom",
    ES: "Spain",
    FR: "France",
    DE: "Germany",
    IT: "Italy",
    MA: "Morocco",
    AE: "United Arab Emirates",
  };
  return { countryCode: cc, countryName: cc && names[cc] ? names[cc] : null };
}

/* ---------------- route ---------------- */
export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));

    const {
      email,
      buyerName,
      // optional hints from client; we’ll validate & fallback
      productId: productIdHint,
      productName: productNameHint,
      amountUsd: amountHint,
    } = body as {
      email?: string;
      buyerName?: string;
      productId?: string;
      productName?: string;
      amountUsd?: number;
    };

    // Normalize + validate email
    const normEmail = (email || "").trim().toLowerCase();
    if (!normEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(normEmail)) {
      return NextResponse.json({ error: "Valid email required" }, { status: 400 });
    }

    // Choose product from catalog (default: Scalper X1)
    let catalogKey: keyof typeof PRODUCTS = "scalperX1";
    if (productIdHint === "scalper" || productIdHint === "scalper-x1") catalogKey = "scalperX1";
    if (productIdHint === "fibonacci" || productIdHint === "fibonacci-pro") catalogKey = "fibonacciPro";
    if (productIdHint === "ai-assistant-monthly") catalogKey = "aiAssistantMonthly";
    if (productIdHint === "ai-assistant-pro") catalogKey = "aiAssistantPro";

    if (!PRODUCTS[catalogKey]) {
      console.warn("Product not found, falling back to Scalper X1:", productIdHint);
      catalogKey = "scalperX1";
    }
    const catalog = PRODUCTS[catalogKey];
    if (!catalog) {
      return NextResponse.json({ error: "Product not available" }, { status: 404 });
    }

    // Price: default to catalog price; allow override in dev if env set
    const allowOverride =
      process.env.ALLOW_PRICE_OVERRIDE === "1" || process.env.NODE_ENV !== "production";
    const parsedAmount =
      typeof amountHint === "number" && isFinite(amountHint) && amountHint > 0
        ? Math.round(amountHint * 100) / 100
        : undefined;
    const amountUsd = allowOverride && parsedAmount ? parsedAmount : catalog.priceUsd;

    // Geo metadata
    const headers = req.headers;
    const ip = pickIP(headers);
    const { countryCode, countryName } = pickCountry(headers);
    
function getFilePath(p: (typeof PRODUCTS)[keyof typeof PRODUCTS]): string {
  return "filePath" in p && typeof (p as any).filePath === "string" ? (p as any).filePath : "";
}
    // Create order (CARD-ONLY) — safely pick filePath only for bot SKUs
const filePath =
  "filePath" in catalog && typeof (catalog as any).filePath === "string"
    ? (catalog as any).filePath
    : "";

const order = createOrder({
  productId: catalog.id,
  productName: productNameHint || catalog.name,
  filePath,                 // <-- now typed safely for both cases
  amountUsd,
  method: "card",
  email: normEmail,
  buyerName,
  ip,
  countryCode,
  countryName,
});

    console.log("✅ Order created & persisted:", {
      id: order.id,
      method: order.method,
      amountUsd: order.amountUsd,
      product: order.productName,
    });

    // Respond (no USDT/crypto block)
    return NextResponse.json({
      orderId: order.id,
      method: order.method, // "card"
      amountUsd: order.amountUsd,
      createdAt: order.createdAt,
      createdAtISO: order.createdAtISO,
      countryCode: order.countryCode || null,
      countryName: order.countryName || null,
    });
  } catch (e: unknown) {
    console.error("Order creation failed:", (e as Error)?.message || e);
    return NextResponse.json(
      { error: (e as Error)?.message || "Order creation failed" },
      { status: 500 }
    );
  }
}