import { NextRequest, NextResponse } from "next/server";
import { trackUsage } from "../../../lib/firebase/analytics";

export async function POST(req: NextRequest) {
  try {
    const usageData = await req.json();
    await trackUsage(usageData);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Track usage error:", error);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}