import { NextResponse } from "next/server";
import { getOrder, updateOrder } from "../../../../lib/orders";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const ADMIN_HEADER = "x-admin-key";

function isAuthorized(req: Request) {
  const key = req.headers.get(ADMIN_HEADER) || "";
  return key && key === (process.env.ADMIN_API_KEY || "");
}

// Small helper to read [id] from the URL path safely
function extractIdFromUrl(url: string): string | null {
  try {
    const { pathname } = new URL(url);
    // /api/admin/orders/<id>
    const parts = pathname.split("/").filter(Boolean);
    const id = parts[parts.length - 1] || null;
    return id;
  } catch {
    return null;
  }
}

/**
 * PATCH /api/admin/orders/[id]
 * Headers: x-admin-key: <ADMIN_API_KEY>
 * Body (any subset):
 *  {
 *    "status": "pending" | "paid" | "expired",
 *    "txid": string | null,
 *    "email": string | null
 *  }
 */
export async function PATCH(req: Request) {
  try {
    if (!isAuthorized(req)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const id = extractIdFromUrl(req.url);
    if (!id) {
      return NextResponse.json({ error: "Missing order id in URL" }, { status: 400 });
    }

    const cur = getOrder(id);
    if (!cur) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    const body = (await req.json().catch(() => ({}))) as Partial<{
      status: "pending" | "paid" | "expired";
      txid: string | null;
      email: string | null;
    }>;

    const patch: Record<string, unknown> = {};

    if (body.status && ["pending", "paid", "expired"].includes(body.status)) {
      patch.status = body.status;
    }
    if (typeof body.txid !== "undefined") {
      // normalize empty string → null
      patch.txid = body.txid && body.txid.trim().length > 0 ? body.txid.trim() : null;
    }
    if (typeof body.email !== "undefined") {
      const e = (body.email || "").trim();
      if (e === "") {
        patch.email = null;
      } else if (/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(e)) {
        patch.email = e;
      } else {
        return NextResponse.json({ error: "Invalid email" }, { status: 400 });
      }
    }

    const updated = updateOrder(id, patch as any);
    return NextResponse.json({ ok: true, order: updated }, { status: 200 });
  } catch (e: unknown) {
    const msg = (e as Error)?.message || "Update failed";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}