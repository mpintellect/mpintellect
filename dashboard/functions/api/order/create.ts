// functions/api/order/create.ts

// No Next.js imports needed
import { createOrder, PRODUCTS } from "../../../../landing/app/lib/orders";

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
    headers.get("cf-ipcountry") || // Standard Cloudflare country header
    headers.get("x-vercel-ip-country") ||
    headers.get("x-client-country") ||
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

/* ---------------- Cloudflare Handler ---------------- */
export async function onRequestPost(context: any) {
  const { request, env } = context;

  try {
    const body = await request.json().catch(() => ({}));

    const {
      email,
      buyerName,
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
      return Response.json({ error: "Valid email required" }, { status: 400 });
    }

    // FIXED: Use 'any' type for catalogKey to resolve the "not assignable" TypeScript error
    let catalogKey: any = "scalperX1";
    
    if (productIdHint === "scalper" || productIdHint === "scalper-x1") catalogKey = "scalperX1";
    else if (productIdHint === "fibonacci" || productIdHint === "fibonacci-pro") catalogKey = "fibonacciPro";
    else if (productIdHint === "ai-assistant-monthly") catalogKey = "aiAssistantMonthly";
    else if (productIdHint === "ai-assistant-pro") catalogKey = "aiAssistantPro";

    const catalog = (PRODUCTS as any)[catalogKey];
    
    if (!catalog) {
      console.warn("Product not found, falling back to Scalper X1:", productIdHint);
      catalogKey = "scalperX1";
    }
    
    const finalCatalog = (PRODUCTS as any)[catalogKey];
    if (!finalCatalog) {
      return Response.json({ error: "Product not available" }, { status: 404 });
    }

    // FIXED: Pull keys from 'env' instead of global 'context'
    const allowOverride =
      env.ALLOW_PRICE_OVERRIDE === "1" || env.NODE_ENV !== "production";
    
    const parsedAmount =
      typeof amountHint === "number" && isFinite(amountHint) && amountHint > 0
        ? Math.round(amountHint * 100) / 100
        : undefined;
    
    const amountUsd = allowOverride && parsedAmount ? parsedAmount : finalCatalog.priceUsd;

    // Geo metadata
    const headers = request.headers;
    const ip = pickIP(headers);
    const { countryCode, countryName } = pickCountry(headers);
    
    // Create order logic
    const filePath = "filePath" in finalCatalog ? (finalCatalog as any).filePath : "";

    // ⚠️ WARNING: If createOrder tries to write a FILE to disk, it will crash.
    // It should be updated to write to env.DB (Cloudflare D1 SQL)
    const order = createOrder({
      productId: finalCatalog.id,
      productName: productNameHint || finalCatalog.name,
      filePath,                 
      amountUsd,
      method: "card",
      email: normEmail,
      buyerName,
      ip,
      countryCode,
      countryName,
    });

    return Response.json({
      orderId: order.id,
      method: order.method,
      amountUsd: order.amountUsd,
      createdAt: order.createdAt,
      createdAtISO: order.createdAtISO,
      countryCode: order.countryCode || null,
      countryName: order.countryName || null,
    });

  } catch (e: unknown) {
    console.error("Order creation failed:", (e as Error)?.message || e);
    return Response.json(
      { error: (e as Error)?.message || "Order creation failed" },
      { status: 500 }
    );
  }
}