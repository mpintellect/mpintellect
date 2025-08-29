// app/api/checkout/route.ts
import { NextResponse } from "next/server";
import {
  createOrder,
  setOrderDepositAddress,
  PRODUCTS,
  ensureOrdersHydrated,
} from "../../lib/orders";
import { generateDepositAddress } from "../../lib/hdwallet";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** Body shape from client */
type Body = {
  productId: string;   // e.g. "ai-assistant-monthly" or "scalper-x1"
  email?: string;
  buyerName?: string;
  method?: "usdt";     // only USDT for now
  amountUsd?: number;  // optional override (else product price)
};

/** Derive a 31-bit non-hardened index from orderId safely (module-scope) */
function indexFromOrderId(id: string): number {
  let h = 0 >>> 0;
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) >>> 0;
  return (h & 0x7fffffff) >>> 0; // ≤ 2,147,483,647
}

export async function POST(req: Request) {
  await ensureOrdersHydrated();

  try {
    const body = (await req.json()) as Body;

    // 1) Resolve product & price
    type CatItem = {
      id: string;
      name: string;
      priceUsd: number;
      filePath?: string;
    };
    const catalog: Record<string, CatItem> = {};

    // pull one-time products from PRODUCTS (honors available flag)
    Object.values(PRODUCTS).forEach((p: any) => {
      if (p?.available === false) return;
      catalog[p.id] = {
        id: p.id,
        name: p.name,
        priceUsd: p.priceUsd,
        filePath: p.filePath,
      };
    });

    // add subscriptions (no filePath)
    catalog["ai-assistant-monthly"] = {
      id: "ai-assistant-monthly",
      name: "AI Assistant – Monthly",
      priceUsd: 10,
    };
    catalog["ai-assistant-pro"] = {
      id: "ai-assistant-pro",
      name: "AI Assistant – Pro Monthly",
      priceUsd: 30,
    };

    const p = catalog[body.productId];
    if (!p) {
      return NextResponse.json(
        { ok: false, error: "Unknown productId" },
        { status: 400 }
      );
    }

    const amountUsd = body.amountUsd ?? p.priceUsd;

    // 2) Create order (unified)
    const order = createOrder({
      productId: p.id,
      productName: p.name,
      filePath: p.filePath ?? "", // empty for subscriptions
      amountUsd,
      method: "usdt",
      email: body.email,
      buyerName: body.buyerName,
    });

    // 3) Generate a unique USDT deposit address (HD wallet)
    const index = indexFromOrderId(order.id);
    const { address, derivationPath } = generateDepositAddress(index); // { address, derivationPath }
    setOrderDepositAddress(order.id, address, index);

    // 4) Return to client (30 min expiry based on stored order)
    const expiresAt =
      order.paymentExpiresAt ?? order.createdAt + 30 * 60 * 1000;

    return NextResponse.json({
      ok: true,
      orderId: order.id,
      amountUsd,
      productName: p.name,
      depositAddress: address,
      derivationPath,
      network: process.env.USDT_NETWORK || "TRC20",
      expiresAt,
    });
  } catch (e: any) {
    return NextResponse.json(
      { ok: false, error: e?.message || "Checkout error" },
      { status: 500 }
    );
  }
}