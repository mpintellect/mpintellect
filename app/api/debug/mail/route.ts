import { NextResponse } from "next/server";
import { sendOrderConfirmation } from "../../../lib/email";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Quick test:
 * curl -X POST http://localhost:3000/api/debug/mail \
 *   -H "Content-Type: application/json" \
 *   -d '{"to":"you@yourdomain.com"}'
 */
export async function POST(req: Request) {
  try {
    const { to } = await req.json();
    if (!to) return NextResponse.json({ error: "to required" }, { status: 400 });

    await sendOrderConfirmation({
      to,
      orderId: "TEST-ORDER",
      productName: "Scalper X1",
      downloadToken: "TEST-TOKEN-ONLY-FOR-EMAIL",
      amountPaid: 10,
      paymentDetails: {
        wallet: process.env.USDT_WALLET || "",
        amount: 10,
        txid: "SIMULATED-TXID",
        network: "TRC20",
      },
    });

    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "send fail" }, { status: 500 });
  }
}