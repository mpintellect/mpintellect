import { NextResponse } from "next/server";
import { findLicenseByKey, isLicenseValid } from "@/app/lib/licenses";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const { key } = await req.json();
    if (!key) return NextResponse.json({ ok: false, error: "Missing license key" }, { status: 400 });

    const lic = await findLicenseByKey(key);
    if (!lic) return NextResponse.json({ ok: false, error: "Invalid license" }, { status: 400 });

    return NextResponse.json({
      ok: isLicenseValid(lic),
      license: { key: lic.key, plan: lic.plan, expiresAt: lic.expiresAt ?? null },
    });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e?.message || "Validation failed" }, { status: 500 });
  }
}