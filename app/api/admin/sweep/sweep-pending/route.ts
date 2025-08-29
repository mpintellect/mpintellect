// app/api/admin/sweep-pending/route.ts
import { NextResponse } from "next/server";
import { getAllOrdersAsync } from "../../../../lib/orders";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const key = req.headers.get("x-admin-key") || "";
  if (key !== (process.env.ADMIN_API_KEY || "")) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  const { sweepChildToMaster } = await import("../../../../lib/sweep");
  const all = await getAllOrdersAsync();

  const paid = all.filter(o => o.status === "paid" && typeof (o as any).depositIndex === "number");
  const report: Array<{ orderId: string; depositIndex: number; result: string }> = [];

  for (const o of paid) {
    const idx = (o as any).depositIndex as number;
    try {
      const r = await sweepChildToMaster(idx);
      report.push({ orderId: o.id, depositIndex: idx, result: r.txid ? `txid:${r.txid}` : "nothing-to-sweep" });
    } catch (e) {
      report.push({ orderId: o.id, depositIndex: idx, result: `error:${(e as Error).message}` });
    }
  }

  return NextResponse.json({ ok: true, count: report.length, report });
}