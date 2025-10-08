import { NextRequest, NextResponse } from "next/server";
import { saveAIAnalysis } from "../../../lib/firebase/analytics";

export async function POST(req: NextRequest) {
  try {
    const { userId, chatData, licenseKey } = await req.json();
    await saveAIAnalysis(userId, chatData, licenseKey);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Save analysis error:", error);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}