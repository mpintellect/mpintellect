import { NextResponse } from "next/server";
import { findLicenseByKey, isLicenseValid } from "@/app/lib/licenses";
import { hmac256 } from "@/app/lib/crypto-util";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const { key, nonce } = await req.json();
    if (!key) return NextResponse.json({ ok: false, error: "Missing license key" }, { status: 400 });

    const lic = await findLicenseByKey(key);
    if (!lic) return NextResponse.json({ ok: false, error: "Invalid license" }, { status: 400 });
    if (!isLicenseValid(lic)) return NextResponse.json({ ok: false, error: "License expired or inactive" }, { status: 400 });

    // Optional: signed proof (remove if you don’t need it)
    const secret = process.env.LICENSE_SIGNING_SECRET;
    const proof = hmac256(`${key}:${nonce ?? ""}`, secret);

    return NextResponse.json({
      ok: true,
      license: { key: lic.key, plan: lic.plan, expiresAt: lic.expiresAt ?? null },
      proof, // client can validate if desired
    });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e?.message || "Verify failed" }, { status: 500 });
  }
}