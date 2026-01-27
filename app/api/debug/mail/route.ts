import { NextResponse } from "next/server";
import { sendOrderConfirmation } from "../../../lib/email";

export const runtime = "edge"; // ✅ Changed from nodejs
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const { to } = await req.json();
    if (!to) return NextResponse.json({ error: "to required" }, { status: 400 });

    await sendOrderConfirmation({
      to,
      orderId: "TEST-ORDER",
      productName: "Scalper X1",
      downloadToken: "TEST-TOKEN",
      amountPaid: 10,
    });

    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}