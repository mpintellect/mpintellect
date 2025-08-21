import { NextResponse } from "next/server";
import { getOrder, updateOrder } from "../../../lib/orders";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// tiny helper so we don’t repeat the header name
const ADMIN_HEADER = "x-admin-key";

function isAuthorized(req: Request) {
  const key = req.headers.get(ADMIN_HEADER) || "";
  return key && key === (process.env.ADMIN_API_KEY || "");
}

// PATCH /api/admin/orders/:id
export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    if (!isAuthorized(req)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const id = params.id;
    const patch = (await req.json().catch(() => ({}))) as Partial<{
      status: "pending" | "paid" | "expired";
      txid: string | null;
      email: string | null;
    }>;

    const cur = getOrder(id);
    if (!cur) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    // Minimal sanitization
    const safePatch: any = {};
    if (patch.status && ["pending", "paid", "expired"].includes(patch.status)) {
      safePatch.status = patch.status;
    }
    if (typeof patch.txid !== "undefined") safePatch.txid = patch.txid;
    if (typeof patch.email !== "undefined") safePatch.email = patch.email;

    const updated = updateOrder(id, safePatch);
    return NextResponse.json({ ok: true, order: updated });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "Update failed" }, { status: 500 });
  }
}