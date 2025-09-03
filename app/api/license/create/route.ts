// app/api/license/create/route.ts
import { NextResponse } from "next/server";
import { createLicense, formatPlanFromProduct } from "@/app/lib/licenses";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// optional tiny in-memory throttle (resets on boot)
const hits = new Map<string, { n: number; t: number }>();
function rateLimit(ip: string | null, max = 10, windowMs = 60_000) {
  if (!ip) return true;
  const now = Date.now();
  const slot = hits.get(ip);
  if (!slot || now - slot.t > windowMs) {
    hits.set(ip, { n: 1, t: now });
    return true;
  }
  if (slot.n >= max) return false;
  slot.n++;
  return true;
}

export async function POST(req: Request) {
  try {
    const ip =
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      req.headers.get("x-real-ip") ||
      null;
    if (!rateLimit(ip)) {
      return NextResponse.json({ ok: false, error: "Too many requests" }, { status: 429 });
    }

    const body = await req.json().catch(() => ({}));
    const emailRaw = String(body?.email || "").trim().toLowerCase();
    const productId = String(body?.productId || "").trim();

    if (!emailRaw || !productId) {
      return NextResponse.json(
        { ok: false, error: "Missing email or productId" },
        { status: 400 }
      );
    }
    // very light email sanity check
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(emailRaw)) {
      return NextResponse.json({ ok: false, error: "Invalid email" }, { status: 400 });
    }

    // whitelist known products
    const ALLOWED = new Set([
      "ai-assistant-monthly",
      "ai-assistant-pro",
      // add others if you issue licenses for one-time bots
    ]);
    if (!ALLOWED.has(productId)) {
      return NextResponse.json({ ok: false, error: "Unknown productId" }, { status: 400 });
    }

    // pick TTL by plan (override only from server logic)
    const plan = formatPlanFromProduct(productId); // "monthly" | "pro"
    const ttlDays = plan === "monthly" ? 31 : 365;

    const lic = await createLicense(emailRaw, productId, ttlDays);

    // Return only what the client needs
    return NextResponse.json({
      ok: true,
      key: lic.key,
      expiresAt: lic.expiresAt ?? null,
      plan,
    });
  } catch (e: any) {
    return NextResponse.json(
      { ok: false, error: e?.message || "failed" },
      { status: 500 }
    );
  }
}