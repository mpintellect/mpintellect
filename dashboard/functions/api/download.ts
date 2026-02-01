// app/api/download/route.ts

import path from "path";
import { readFile, stat } from "fs/promises";
import { verifyDownloadToken, markDownloadUsed } from "@/landing/app/lib/orders";

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

  console.log("📥 Download request received, token:", token ? `${token.substring(0, 10)}...` : "MISSING");

  if (!token) {
    return Response.json({ error: "Download token required" }, { status: 400, headers: SECURITY_HEADERS });
  }

  try {
    // 1) Verify the token (non-consuming check)
    const order = await verifyDownloadToken(token);
    console.log("✅ Token verified for order:", order.id, "File:", order.filePath);

    // 2) Validate file
    const safeName = path.basename(order.filePath || "");
    if (!safeName || !/\.(ex5|mq5)$/i.test(safeName)) {
      console.error("❌ Invalid file type:", safeName);
      return Response.json({ error: "File not available" }, { status: 400, headers: SECURITY_HEADERS });
    }

    // 3) Check file exists
    const absPath = path.join(process.cwd(), "private", "robots", safeName);
    console.log("📁 Looking for file at:", absPath);
    
    const [buf, fileStats] = await Promise.all([
      readFile(absPath),
      stat(absPath)
    ]);
    
    console.log("✅ File found, size:", fileStats.size, "bytes");

    // 4) Mark token as used (now that we know we can serve the file)
    markDownloadUsed(order.id);
    console.log("✅ Token marked as used");

    // 5) Create proper ArrayBuffer for response
    const arrayBuffer = buf.buffer.slice(
      buf.byteOffset,
      buf.byteOffset + buf.byteLength
    ) as ArrayBuffer;

    return new Response(arrayBuffer, {
      status: 200,
      headers: {
        ...SECURITY_HEADERS,
        "Content-Type": "application/octet-stream",
        "Content-Disposition": `attachment; filename="${encodeURIComponent(safeName)}"`,
        "Content-Length": String(fileStats.size),
      },
    });

  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unexpected download error";
    console.error("❌ Download error:", message, "Token:", token ? `${token.substring(0, 10)}...` : "MISSING");
    return Response.json({ error: message }, { status: 400, headers: SECURITY_HEADERS });
  }
}