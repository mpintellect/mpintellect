// app/download/route.ts
import { NextResponse } from "next/server";
import path from "path";
import { stat } from "fs/promises";
import { createReadStream } from "fs";
import { verifyAndConsumeToken } from "../../lib/orders";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const SECURITY_HEADERS = {
  "X-Content-Type-Options": "nosniff",
  "Cache-Control": "no-store, max-age=0",
  "X-Robots-Tag": "noindex",
};

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const token = searchParams.get("token") || "";

  if (!token) {
    return NextResponse.json({ error: "Download token required" }, { status: 400, headers: SECURITY_HEADERS });
  }

  try {
    const order = await verifyAndConsumeToken(token);
    const safeName = path.basename(order.filePath || "");
    if (!/\.(ex5|mq5)$/i.test(safeName)) throw new Error("Only .ex5/.mq5 files are allowed");

    const abs = path.join(process.cwd(), "private", "robots", safeName);
    const st = await stat(abs); // throws if not found

    const stream = createReadStream(abs);
    return new NextResponse(stream as any, {
      status: 200,
      headers: {
        ...SECURITY_HEADERS,
        "Content-Type": "application/octet-stream",
        "Content-Disposition": `attachment; filename="${encodeURIComponent(safeName)}"`,
        "Content-Length": String(st.size),
      },
    });
  } catch (e: any) {
    console.error("Download error:", e?.message || e);
    return NextResponse.json({ error: e?.message || "Download failed" }, { status: 400, headers: SECURITY_HEADERS });
  }
}