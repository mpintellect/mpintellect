// app/download/route.ts
import { NextResponse } from "next/server";
import path from "path";
import { stat } from "fs/promises";
import { createReadStream, ReadStream } from "fs";
import { verifyAndConsumeToken } from "../../lib/orders";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const SECURITY_HEADERS: Record<string, string> = {
  "X-Content-Type-Options": "nosniff",
  "Cache-Control": "no-store, max-age=0",
  "X-Robots-Tag": "noindex",
};

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const token = searchParams.get("token") || "";

  if (!token) {
    return NextResponse.json(
      { error: "Download token required" },
      { status: 400, headers: SECURITY_HEADERS }
    );
  }

  try {
    const order = await verifyAndConsumeToken(token);
    if (!order?.filePath) {
      return NextResponse.json(
        { error: "Invalid order or file not found" },
        { status: 400, headers: SECURITY_HEADERS }
      );
    }

    const safeName = path.basename(order.filePath);
    if (!/\.(ex5|mq5)$/i.test(safeName)) {
      return NextResponse.json(
        { error: "Only .ex5/.mq5 files are allowed" },
        { status: 400, headers: SECURITY_HEADERS }
      );
    }

    const absPath = path.join(process.cwd(), "private", "robots", safeName);
    const fileStat = await stat(absPath); // throws if not found
    const fileStream: ReadStream = createReadStream(absPath);

    return new NextResponse(fileStream as unknown as BodyInit, {
      status: 200,
      headers: {
        ...SECURITY_HEADERS,
        "Content-Type": "application/octet-stream",
        "Content-Disposition": `attachment; filename="${encodeURIComponent(safeName)}"`,
        "Content-Length": String(fileStat.size),
      },
    });
  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : "Unexpected download error";
    console.error("Download error:", message);
    return NextResponse.json(
      { error: message },
      { status: 400, headers: SECURITY_HEADERS }
    );
  }
}