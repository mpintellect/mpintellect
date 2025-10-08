import { NextRequest, NextResponse } from "next/server";
import { checkTrialStatus } from "../../../lib/firebase/trials";

export async function POST(req: NextRequest) {
  try {
    const { userId } = await req.json();
    const result = await checkTrialStatus(userId);
    return NextResponse.json(result);
  } catch (error) {
    console.error("Trial status error:", error);
    return NextResponse.json({ available: false, remaining: 0 }, { status: 500 });
  }
}