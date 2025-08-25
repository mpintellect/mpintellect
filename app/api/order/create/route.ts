// app/api/order/create/route.ts
import { NextResponse } from "next/server";
// ✅ EXACT CHANGE #1: use absolute import so path never breaks
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
      method,
      email,
      buyerName,
      // optional hints from client; we’ll validate & fallback
      productId: productIdHint,
      productName: productNameHint,
      amountUsd: amountHint,
    } = body as {
      method?: "card" | "usdt";
      email?: string;
      buyerName?: string;   
      productId?: string;
      productName?: string;
      amountUsd?: number;
    };

    // ✅ EXACT CHANGE #2: normalize email early (non-breaking hygiene)
    const normEmail = (email || "").trim().toLowerCase();

    // 1) validate basics
    if (method !== "usdt" && method !== "card") {
      return NextResponse.json({ error: "Invalid payment method" }, { status: 400 });
    }
    if (!normEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(normEmail)) {
      return NextResponse.json({ error: "Valid email required" }, { status: 400 });
    }

    // 2) choose product from catalog (default Scalper X1)
    //    If a hint is provided and matches a key in PRODUCTS, use it.
    let catalogKey: keyof typeof PRODUCTS = "scalperX1"; // default

    // Handle frontend's simplified product IDs
    if (productIdHint === "scalper") catalogKey = "scalperX1";
    if (productIdHint === "fibonacci") catalogKey = "fibonacciPro";
    // 🚫 Remove unavailable bots:
    // if (productIdHint === 'hedge') catalogKey = "hedgeMatrix";
    // if (productIdHint === 'trendbot') catalogKey = "trendSeekerAi";

    // Fallback if product doesn't exist
    if (!PRODUCTS[catalogKey]) {
      console.error("Product not found:", productIdHint, "using default");
      catalogKey = "scalperX1";
      console.log("🎯 PRODUCT SELECTION:", {
        productIdHint,
        catalogKey,
        catalogProduct: PRODUCTS[catalogKey],
        allProducts: Object.keys(PRODUCTS),
      });
    }
    const catalog = PRODUCTS[catalogKey];
    if (!catalog) {
      return NextResponse.json({ error: "Product not available" }, { status: 404 });
    }

    // 3) price: default to catalog price; allow override in dev if env set
    const allowOverride =
      process.env.ALLOW_PRICE_OVERRIDE === "1" || process.env.NODE_ENV !== "production";
    const parsedAmount =
      typeof amountHint === "number" && isFinite(amountHint) && amountHint > 0
        ? Math.round(amountHint * 100) / 100
        : undefined;

    const amountUsd = allowOverride && parsedAmount ? parsedAmount : catalog.priceUsd;

    // 4) geo metadata
    const headers = req.headers;
    const ip = pickIP(headers);
    const { countryCode, countryName } = pickCountry(headers);

    // 5) create order (this now PERSISTS internally via lib/orders.ts)
    const order = createOrder({
      productId: catalog.id,
      productName: productNameHint || catalog.name,
      filePath: catalog.filePath,
      amountUsd,
      method,
      email: normEmail, // ← normalized
      buyerName,
      ip,
      countryCode,
      countryName,
    });

    // ✅ EXACT CHANGE #3: tiny debug to verify persistence flow on first runs
    console.log("✅ Order created & persisted:", {
      id: order.id,
      method: order.method,
      amountUsd: order.amountUsd,
      product: order.productName,
    });

    // 6) respond
    return NextResponse.json({
      orderId: order.id,
      method: order.method,
      amountUsd: order.amountUsd,
      createdAt: order.createdAt,
      createdAtISO: order.createdAtISO,
      countryCode: order.countryCode || null,
      countryName: order.countryName || null,
      ...(method === "usdt" && {
        usdt: {
          wallet: process.env.USDT_WALLET,
          network: "TRC20" as const,
          amount: order.amountUsd,
          memo: order.id, // client can put this in a memo if they want
        },
      }),
    });
  } catch (e: unknown) {
    console.error("Order creation failed:", (e as Error)?.message || e);
    return NextResponse.json(
      { error: (e as Error)?.message || "Order creation failed" },
      { status: 500 }
    );
  }
}