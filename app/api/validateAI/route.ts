// app/api/validateAI/route.ts
import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/app/lib/firebaseAdmin";

export async function POST(request: NextRequest) {
  try {
    const { licenseKey } = await request.json();

    if (!licenseKey) {
      return NextResponse.json(
        { valid: false, error: "License key is required" },
        { status: 400 }
      );
    }

    // Query Firestore for license
    const snapshot = await adminDb
      .collection("ai_assistant_licenses")
      .where("licenseKey", "==", licenseKey)
      .limit(1)
      .get();

    if (snapshot.empty) {
      return NextResponse.json({ valid: false, error: "License not found" });
    }

    const doc = snapshot.docs[0];
    const data = doc.data();
    const now = Date.now();
    const expiresAt = data.expiresAt.toMillis?.() || data.expiresAt;

    if (expiresAt < now) {
      return NextResponse.json({ valid: false, error: "License expired" });
    }

    return NextResponse.json({
      valid: true,
      expiresAt,
      plan: data.plan || "",
      email: data.email || "",
    });
  } catch (error: any) {
    console.error("❌ License validation error:", error);
    return NextResponse.json(
      { valid: false, error: error.message || "Server error" },
      { status: 500 }
    );
  }
}