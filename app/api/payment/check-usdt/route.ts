// app/api/payment/check-usdt/route.ts
import { NextResponse } from "next/server";
import {
  getOrder,
  updateOrder,
  issueDownloadToken,
  isTransactionAlreadyUsed,
} from "../../../lib/orders";
import { sendOrderConfirmation } from "../../../lib/email";
import { ensureOrdersHydrated } from "../../../lib/orders"; // adjust path
import { sweepChildToMaster } from "../../../lib/sweep";
const TRONGRID_BASE = "https://api.trongrid.io";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const USDT_DECIMALS = Number(process.env.USDT_DECIMALS || 6);

/** TronGrid types (minimal) */
interface TronTx {
  transaction_id?: string;
  txID?: string;
  to?: string;
  from?: string;
  value?: string | number;
  block_timestamp?: number;
  token_info?: { symbol?: string; address?: string };
}
interface TronApiResponse {
  data?: TronTx[];
}

/**
 * GET /api/payment/check-usdt?orderId=...&txid=OPTIONAL
 */
export async function GET(req: Request) {
  await ensureOrdersHydrated();
  const { searchParams } = new URL(req.url);
  const orderId = searchParams.get("orderId") || "";
  const txidHint = searchParams.get("txid") || "";

  if (!orderId) {
    return NextResponse.json(
      { status: "pending", error: "orderId missing" },
      { status: 200 }
    );
  }

  const order = getOrder(orderId);
  if (!order) {
    return NextResponse.json(
      { status: "pending", error: "Order not found" },
      { status: 200 }
    );
  }

  // Hard stop if order expired (30 minutes from creation unless overridden)
  const payExpiresAt =
    order.paymentExpiresAt ?? order.createdAt + 30 * 60 * 1000;
  if (Date.now() > payExpiresAt && order.status !== "paid") {
    // Optionally persist the expired state:
    updateOrder(order.id, { status: "expired" });
    return NextResponse.json(
      { status: "expired", error: "Order expired" },
      { status: 200 }
    );
  }

  // If already paid → issue fresh download token (idempotent)
  if (order.status === "paid") {
    const { rawToken, expiresAt: tokenExpiresAt } = issueDownloadToken(
      order.id,
      24 * 3600
    );
    return NextResponse.json(
      { status: "paid", token: rawToken, expiresAt: tokenExpiresAt },
      { status: 200 }
    );
  }

  const TARGET = ((order as any).depositAddress || process.env.USDT_WALLET || "").toLowerCase();
  const TRON_API_KEY = process.env.TRONGRID_API_KEY || "";
  const USDT_CONTRACT =
    process.env.USDT_TRC20_CONTRACT ||
    "TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t";

  if (!TARGET || !TRON_API_KEY) {
  return NextResponse.json(
    { status: "pending", error: "Server USDT env missing" },
    { status: 200 }
  );
}

  const url = `https://api.trongrid.io/v1/accounts/${TARGET}/transactions/trc20?limit=50&contract_address=${USDT_CONTRACT}`;
  console.log('[check-usdt] order', order.id, 'target', TARGET, 'amount', order.amountUsd);
  const res = await fetch(url, {
    headers: { "TRON-PRO-API-KEY": TRON_API_KEY },
  });

  if (!res.ok) {
    return NextResponse.json(
      { status: "pending", error: `TronGrid ${res.status}` },
      { status: 200 }
    );
  }

  const data: TronApiResponse = await res.json();
  const txs: TronTx[] = Array.isArray(data?.data) ? data.data! : [];

  // Match incoming transfer TO our wallet with exact amount (order.amountUsd)
  const match = txs.find((tx) => {
    const to = (tx.to || "").toLowerCase();
    const raw = tx.value;
    const amount =
      raw != null ? (typeof raw === "string" ? Number(raw) : Number(raw)) : 0;
    const val = amount / 10 ** USDT_DECIMALS;

    const okTo = to === TARGET;
    const okAmt = Math.abs(val - Number(order.amountUsd)) < 1e-4;
    const okTxid = txidHint
      ? tx.transaction_id === txidHint || tx.txID === txidHint
      : true;

    return okTo && okAmt && okTxid;
  });

  if (!match) {
    return NextResponse.json({ status: "pending" }, { status: 200 });
  }

  const txid = match.transaction_id || match.txID || "";
  if (!txid) {
    return NextResponse.json(
      { status: "pending", error: "Missing txid" },
      { status: 200 }
    );
  }

  if (isTransactionAlreadyUsed(txid)) {
    return NextResponse.json({ status: "pending" }, { status: 200 });
  }

  // Mark paid and keep the returned order (we use it below)
  const paid = updateOrder(order.id, { status: "paid", txid });
  // ---- Auto-sweep funds from the child address to the master wallet (with confirmations gate) ----
let sweepTx: string | undefined;
try {
  const idx =
    (paid as any)?.depositIndex !== undefined
      ? (paid as any).depositIndex
      : (order as any).depositIndex;

  if (typeof idx === "number" && process.env.USDT_MASTER_WALLET) {
    const minConfs = Number(process.env.USDT_MIN_CONFIRMATIONS || 10);
    const waitMs   = Number(process.env.USDT_SWEEP_CONFIRM_DELAY_MS || 10 * 60 * 1000);

    // Check age first (fallback if API doesn’t return confirmations)
    const txTimeMs = match.block_timestamp ? Number(match.block_timestamp) : 0;
    const isOldEnough = txTimeMs > 0 ? (Date.now() - txTimeMs) >= waitMs : false;

    // Try to fetch confirmations from TronGrid (best effort)
    let hasEnoughConfs = false;
    try {
      const txDetailRes = await fetch(`${TRONGRID_BASE}/v1/transactions/${txid}`, {
        headers: { "TRON-PRO-API-KEY": process.env.TRONGRID_API_KEY || "" },
        cache: "no-store",
      });
      if (txDetailRes.ok) {
        const txDetail = await txDetailRes.json().catch(() => ({} as any));
        const items = Array.isArray(txDetail?.data) ? txDetail.data : [];
        const first  = items[0] || {};
        // TronGrid doesn’t always expose a numeric "confirmations"; use a few hints:
        // - confirmed flag
        // - block_timestamp distance
        // If your plan exposes a numeric confirmations, add it here:
        const confirmedFlag = first?.confirmed === true;
        hasEnoughConfs = confirmedFlag;
      }
    } catch { /* ignore */ }

    if (hasEnoughConfs || isOldEnough) {
      const r = await sweepChildToMaster(idx); // sweep full USDT balance
      sweepTx = r.txid;
      console.log("[sweep] moved USDT to master wallet:", r, { hasEnoughConfs, isOldEnough });
    } else {
      console.log("[sweep] delayed; waiting for confirmations/age", {
        txid,
        minConfs,
        waitMs,
        txTimeMs,
        now: Date.now(),
      });
    }
  } else {
    console.log("[sweep] skipped (no depositIndex or no USDT_MASTER_WALLET)");
  }
} catch (e) {
  console.warn("[sweep] failed:", (e as Error).message);
}

// Determine if this order is a bot (has filePath) or a subscription (no filePath)
const isBot = Boolean(order.filePath && order.filePath.trim());

// Bots: issue one-time token
let rawToken: string | undefined;
let tokenExpiresAt: number | undefined;
if (isBot) {
  const t = issueDownloadToken(order.id, 24 * 3600);
  rawToken = t.rawToken;
  tokenExpiresAt = t.expiresAt;
}

// Subscriptions: mint license
let licenseKey: string | undefined;
if (!isBot) {
  try {
    const base =
      process.env.NEXT_PUBLIC_BASE_URL ||
      process.env.NEXT_PUBLIC_SITE_URL ||
      "";
    if (base) {
      const r = await fetch(`${base}/api/license/create`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: order.email, productId: "mz-ai-assistant" }),
      });
      const j = await r.json().catch(() => ({}));
      if (r.ok && j?.key) licenseKey = String(j.key);
    }
  } catch {}
}

// Send email
if (order.email) {
  try {
    await sendOrderConfirmation({
      to: order.email,
      orderId: order.id,
      productName: order.productName ?? "Order",
      amountPaid: Number(order.amountUsd),

      downloadToken: isBot ? rawToken : undefined,      // bots only
      licenseKey: !isBot ? (licenseKey || "(issued)") : undefined,  // subs only
      assistantUrl:
        (process.env.NEXT_PUBLIC_SITE_URL ||
         process.env.NEXT_PUBLIC_BASE_URL ||
         "http://localhost:3000").replace(/\/+$/,"") + "/tools/ai-assistant",

      paymentDetails: {
        wallet: process.env.USDT_WALLET || "",
        amount: Number(order.amountUsd),
        txid,
        network: "TRC20",
      },
    });
  } catch (e) {
    console.error("[check-usdt] email send error:", e);
  }
}

// API response (no download token for subs)
return NextResponse.json(
  isBot
    ? { status: "paid", token: rawToken, expiresAt: tokenExpiresAt, sweepTx }
    : { status: "paid", licenseKey, sweepTx },
  { status: 200 }
);
}
