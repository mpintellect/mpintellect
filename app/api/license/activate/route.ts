// app/api/license/activate/route.ts
import { NextResponse } from "next/server";
import { activateLicenseForDevice, findLicenseByKey, isLicenseValid } from "@/app/lib/licenses";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const { key, fingerprint } = await req.json();
    if (!key || typeof key !== "string") {
      return NextResponse.json({ ok: false, error: "Missing license key" }, { status: 400 });
    }

    const lic = await findLicenseByKey(key);
    if (!lic) return NextResponse.json({ ok: false, error: "Invalid license" }, { status: 400 });
    if (!isLicenseValid(lic)) return NextResponse.json({ ok: false, error: "License expired or inactive" }, { status: 400 });

    const r = await activateLicenseForDevice(key, fingerprint);
    if (!r.ok) return NextResponse.json({ ok: false, error: r.error }, { status: 400 });

    return NextResponse.json({
      ok: true,
      license: { key: r.license.key, expiresAt: r.license.expiresAt }
    });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e?.message || "Activation failed" }, { status: 500 });
  }
}