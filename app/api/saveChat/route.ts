import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "../../lib/firebaseAdmin";

export async function POST(req: NextRequest) {
  const { userId, chatData } = await req.json();

  if (!userId || !chatData) {
    return NextResponse.json({ success: false, error: "Missing data" }, { status: 400 });
  }

  try {
    await adminDb
      .collection("chatlogs")
      .doc(userId)
      .collection("entries")
      .add(chatData);

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("❌ Firebase save error:", err);
    return NextResponse.json({ success: false, error: "Failed to save" }, { status: 500 });
  }
}