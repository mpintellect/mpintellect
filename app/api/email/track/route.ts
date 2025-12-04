import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/pushAdminSafe"; // Reuse your existing Admin setup
import * as admin from 'firebase-admin';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const email = searchParams.get('email');
  const type = searchParams.get('type') || 'daily_signal';

  if (email) {
    try {
      // Log the "Open" event to Firestore
      // Using a subcollection or a dedicated analytics collection
      await adminDb.collection("email_opens").add({
        email: email,
        type: type,
        openedAt: admin.firestore.Timestamp.now(),
        userAgent: req.headers.get("user-agent") || "unknown"
      });
      console.log(`📧 Email Opened by: ${email}`);
    } catch (e) {
      console.error("Tracking error", e);
    }
  }

  // Return a 1x1 transparent GIF (The "Pixel")
  // This binary string is a standard transparent GIF
  const pixel = Buffer.from(
    "R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7",
    "base64"
  );

  return new NextResponse(pixel, {
    headers: {
      "Content-Type": "image/gif",
      "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
      "Pragma": "no-cache",
      "Expires": "0",
    },
  });
}