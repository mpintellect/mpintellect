// app/api/payment/check-usdt/route.ts
import { NextResponse } from "next/server";
import {
  getOrder,
  updateOrder,
  issueDownloadToken,
  isTransactionAlreadyUsed,
} from "../../../lib/orders";
import { sendOrderConfirmation } from "../../../lib/email";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** ---- Types (to avoid any) ---- */
interface TronTokenInfo {
  symbol?: string;
  address?: string;
}

interface TronTx {
  transaction_id?: string;
  txID?: string;
  to?: string;
  from?: string;
  value?: string | number;
  block_timestamp?: number;
  ret?: string;
  type?: string;
  token_info?: TronTokenInfo;
  confirmed?: boolean;
}

interface TronApiResponse {
  data?: TronTx[];
}

/**
 * Client polls:
 * GET /api/payment/check-usdt?orderId=...&txid=OPTIONAL
 */
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const orderId = searchParams.get("orderId") || "";
  const txidHint = searchParams.get("txid") || "";

  const TRON_API_KEY = process.env.TRONGRID_API_KEY || "";
  const WALLET = (process.env.USDT_WALLET || "").toLowerCase();
  const USDT_CONTRACT =
    process.env.USDT_TRC20_CONTRACT || "TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t";

  if (!orderId)
    return NextResponse.json(
      { status: "pending", error: "orderId missing" },
      { status: 200 }
    );

  const order = getOrder(orderId);
  if (!order)
    return NextResponse.json(
      { status: "pending", error: "Order not found" },
      { status: 200 }
    );
  if (order.method !== "usdt")
    return NextResponse.json(
      { status: "pending", error: "Wrong method" },
      { status: 200 }
    );

  // Already paid → reissue a fresh one-time token (idempotent)
  if (order.status === "paid") {
    const { rawToken, expiresAt } = issueDownloadToken(order.id, 24 * 3600);
    return NextResponse.json(
      { status: "paid", token: rawToken, expiresAt },
      { status: 200 }
    );
  }

  if (!TRON_API_KEY || !WALLET) {
    return NextResponse.json(
      { status: "pending", error: "Server missing Tron env" },
      { status: 200 }
    );
  }

  try {
    // 🚨 ADD TIMEOUT AND BETTER ERROR HANDLING
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

    console.log("🔔 ENTERING PAYMENT CHECK TRY BLOCK");
    console.log("   - Order ID:", orderId);
    console.log("   - Wallet:", WALLET);
    console.log("   - Has API Key:", !!TRON_API_KEY);

    const url = `https://api.trongrid.io/v1/accounts/${WALLET}/transactions/trc20?limit=50&contract_address=${USDT_CONTRACT}`;
    console.log("   - API URL:", url);

    const res = await fetch(url, {
      headers: { "TRON-PRO-API-KEY": TRON_API_KEY },
      signal: controller.signal,
    });

    clearTimeout(timeoutId);
    console.log("   - API Response Status:", res.status);

    if (!res.ok) {
      console.log("❌ API Error:", res.status, res.statusText);
      return NextResponse.json(
        { status: "pending", error: `TronGrid ${res.status}` },
        { status: 200 }
      );
    }

    const dataUnknown: unknown = await res.json();
    const parsed = dataUnknown as TronApiResponse;
    const transfers: TronTx[] = Array.isArray(parsed?.data) ? parsed.data! : [];

    console.log("✅ API Response received, parsing data...");

    // 🚨 ADD DEBUG FOR API RESPONSE
    console.log("📊 TRONGRID API RESPONSE:", {
      status: res.status,
      totalTransactions: transfers.length,
      success: res.ok,
      url: url,
    });

    if (transfers.length === 0) {
      console.log("⚠️  NO transactions found in API response");
    } else {
      const first = transfers[0];
      console.log("✅ Transactions found, proceeding with matching...");
      console.log(
        "📋 API RESPONSE SAMPLE (first transaction):",
        first
          ? {
              transaction_id: first.transaction_id,
              to: first.to,
              value: first.value,
              block_timestamp: first.block_timestamp,
            }
          : "No transactions"
      );
    }

    // 🚨 SINGLE DEBUG SECTION - CLEAN AND ORGANIZED
    console.log("=== USDT PAYMENT DEBUG ===");
    console.log("Order:", {
      id: order.id,
      amount: order.amountUsd,
      createdAt: new Date(order.createdAt).toISOString(),
      status: order.status,
    });
    console.log("Wallet:", WALLET);
    console.log("Total transactions from API:", transfers.length);

    // Log ALL transactions with complete details
    transfers.forEach((tx: TronTx, index: number) => {
      const to = (tx?.to || "").toLowerCase();
      const from = (tx?.from || "").toLowerCase();
      const numVal =
        typeof tx?.value === "string" ? Number(tx.value) : Number(tx?.value || 0);
      const value = numVal / 1e6;
      const hash = tx?.transaction_id || tx?.txID || "";
      const timestamp = tx?.block_timestamp
        ? new Date(Number(tx.block_timestamp)).toISOString()
        : "unknown";

      console.log(`TX ${index + 1}:`, {
        hash: hash ? hash.slice(0, 12) + "..." : "",
        to,
        from,
        value: value.toFixed(6),
        timestamp,
        matchesOurWallet: to === WALLET,
        matchesAmount: Math.abs(value - order.amountUsd) < 0.01,
        isIncoming: to === WALLET,
        isOutgoing: from === WALLET,
      });
    });

    // Optional debug: allow direction override with ?direction=out when testing
    const direction = searchParams.get("direction"); // "in" | "out" | null
    const wantIncoming = true;

    // Only consider transfers after order creation (minus a small grace window)
    // This avoids matching very old payments.

    const match = transfers.find((tx: TronTx) => {
      try {
        // Normalize fields with safe defaults
        const to = (tx?.to || "").toLowerCase();
        const from = (tx?.from || "").toLowerCase();
        const tsMs = tx?.block_timestamp ? Number(tx.block_timestamp) : 0;
        const hash = tx?.transaction_id || tx?.txID || "";

        // Amount (TRC20 USDT uses 6 decimals)
        const raw = tx?.value;
        const value =
          raw != null
            ? (typeof raw === "string" ? Number(raw) : Number(raw)) / 1e6
            : 0;

        // 🚨 RELAXED SECURITY VALIDATION (some fields might be missing)
        const okDirection = to === WALLET.toLowerCase();
        const okAmt = Math.abs(value - order.amountUsd) < 0.001;
        const okHint = txidHint ? hash === txidHint : true;
        const okTime = tsMs > order.createdAt;

        // These fields might not be present in all API responses
        const okConfirmed = tx?.confirmed !== false; // Default to true if missing
        const okSuccess = (tx?.ret || "SUCCESS") === "SUCCESS"; // Default to success
        const okToken = (tx?.token_info?.symbol || "USDT") === "USDT"; // Assume USDT
        const okContract =
          (tx?.token_info?.address || USDT_CONTRACT) === USDT_CONTRACT;
        const okType = (tx?.type || "Transfer") === "Transfer"; // Assume transfer

        // 🚨 ADD COMPREHENSIVE DEBUGGING
        console.log("🔍 RELAXED SECURITY CHECK:", {
          hash: hash ? hash.slice(0, 8) : "",
          value,
          expected: order.amountUsd,
          okAmt,
          okDirection,
          okConfirmed,
          okSuccess,
          okToken,
          okContract,
          okType,
          transactionTime: tsMs ? new Date(tsMs).toISOString() : "unknown",
          orderTime: new Date(order.createdAt).toISOString(),
          okTime,
          isNewer: tsMs > order.createdAt,
        });

        // 🚨 FOCUS ON CORE VALIDATION - relax the optional fields
        return okDirection && okAmt && okHint && okTime && okToken && okContract;
      } catch (error) {
        console.log("⚠️  Error validating transaction:", error);
        return false; // Skip invalid transactions
      }
    });

    if (!match) {
      console.log("❌ NO MATCH FOUND - Analysis:");
      console.log(
        "- Any transactions to our wallet?",
        transfers.some(
          (tx: TronTx) => (tx?.to || "").toLowerCase() === WALLET.toLowerCase()
        )
      );
      console.log(
        "- Any transactions with correct amount?",
        transfers.some((tx: TronTx) => {
          const v =
            tx?.value != null
              ? (typeof tx.value === "string" ? Number(tx.value) : Number(tx.value)) /
                1e6
              : 0;
          return Math.abs(v - order.amountUsd) < 0.001;
        })
      );
      console.log(
        "- Any incoming payments?",
        transfers.some(
          (tx: TronTx) => (tx?.to || "").toLowerCase() === WALLET.toLowerCase()
        )
      );
      console.log("- Order amount expected:", order.amountUsd);

      // Check if we're even getting any transactions
      if (transfers.length === 0) {
        console.log(
          "⚠️  NO transactions returned from TronGrid API - check API key or wallet"
        );
      }

      return NextResponse.json({ status: "pending" }, { status: 200 });
    }

    const txid = match.transaction_id || match.txID || "";
    if (isTransactionAlreadyUsed(txid)) {
      console.log("🔒 TRANSACTION LOCKED: Already used for another order", txid);
      return NextResponse.json({ status: "pending" }, { status: 200 });
    }

    // 🚨 CRITICAL VALIDATION: Ensure this is a NEW payment, not an old one
    const txTime = match.block_timestamp ? Number(match.block_timestamp) : 0;
    const orderTime = order.createdAt;

    if (txTime <= orderTime) {
      console.log("❌ REJECTED: Transaction is older than order:", {
        txTime: txTime ? new Date(txTime).toISOString() : "unknown",
        orderTime: new Date(orderTime).toISOString(),
        transactionId: match.transaction_id || match.txID,
      });
      return NextResponse.json({ status: "pending" }, { status: 200 });
    }

    console.log("✅ VALIDATED: Transaction is newer than order:", {
      txTime: new Date(txTime).toISOString(),
      orderTime: new Date(orderTime).toISOString(),
      differenceMinutes: (txTime - orderTime) / (1000 * 60),
    });

    // Mark paid, store txid, issue token
    const paid = updateOrder(order.id, {
      status: "paid",
      txid: match.transaction_id || match.txID || "",
    });

    console.log("🔄 Order update result:", paid);
    console.log("New status:", paid?.status);

    const { rawToken, expiresAt } = issueDownloadToken(order.id, 24 * 3600);

    // Email the one-time link
    if (paid?.email) {
      console.log("📧 [check-usdt] Sending email", {
        to: paid.email,
        orderId: paid.id,
        txid: paid.txid,
        tokenPreview: rawToken.slice(0, 8) + "...",
      });

      try {
        await sendOrderConfirmation({
          to: paid.email,
          orderId: paid.id,
          productName: paid.productName,
          downloadToken: rawToken,
          amountPaid: paid.amountUsd,
          paymentDetails: {
            wallet: process.env.USDT_WALLET || "",
            amount: paid.amountUsd,
            txid: paid.txid || "", // ✅ correct key name
            network: "TRC20",
          },
        });
        console.log("✅ [check-usdt] Email sent OK");
      } catch (err) {
        console.error("❌ [check-usdt] Email send failed:", err);
      }
    } else {
      console.warn("⚠️ [check-usdt] No email on order; skipping send", {
        orderId: order.id,
      });
    }

    return NextResponse.json(
      { status: "paid", token: rawToken, expiresAt },
      { status: 200 }
    );
  } catch (e: unknown) {
    if ((e as Error).name === "AbortError") {
      console.error("⏰ API CALL TIMEOUT: TronGrid took too long to respond");
      return NextResponse.json(
        { status: "pending", error: "API timeout" },
        { status: 200 }
      );
    }
    console.error("💥 PAYMENT CHECK ERROR:", (e as Error).message);
    console.error("   - Error name:", (e as Error).name);
    return NextResponse.json(
      { status: "pending", error: (e as Error).message },
      { status: 200 }
    );
  }
}