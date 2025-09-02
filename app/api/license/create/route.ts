// app/api/license/create/route.ts
import { NextResponse } from "next/server";
import { createLicense } from "@/app/lib/licenses";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const { email, productId, ttlDays } = await req.json();
    if (!email || !productId) {
      return NextResponse.json({ ok: false, error: "Missing email or productId" }, { status: 400 });
    }

    const lic = await createLicense(String(email), String(productId), Number(ttlDays ?? 365));
    return NextResponse.json({ ok: true, key: lic.key, license: lic });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e?.message || "failed" }, { status: 500 });
  }
}