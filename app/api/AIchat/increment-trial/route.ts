import { NextRequest, NextResponse } from "next/server";
import { incrementTrialCount } from "../../../lib/firebase/trials";

export async function POST(req: NextRequest) {
  try {
    const { userId } = await req.json();
    await incrementTrialCount(userId);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Increment trial error:", error);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}