import { NextRequest, NextResponse } from "next/server";
import { getDB, queryOne } from "@/app/lib/cloudflare/db-simple";

export async function POST(req: NextRequest) {
  try {
    const { userId } = await req.json();
    
    if (!userId) {
      return NextResponse.json(
        { available: false, remaining: 0, error: "User ID is required" },
        { status: 400 }
      );
    }

    // Get user trial count from D1
    const user = await queryOne(
      "SELECT trial_count, license_type FROM users WHERE id = ?",
      [userId]
    );

    if (!user) {
      return NextResponse.json(
        { available: false, remaining: 0, error: "User not found" },
        { status: 404 }
      );
    }

    const trialCount = user.trial_count || 0;
    const maxTrials = 2; // Free trial limit
    const remaining = Math.max(0, maxTrials - trialCount);
    const available = remaining > 0;

    return NextResponse.json({
      available,
      remaining,
      used: trialCount,
      maxTrials,
      licenseType: user.license_type
    });
  } catch (error) {
    console.error("Trial status error:", error);
    return NextResponse.json(
      { available: false, remaining: 0, error: "Failed to check trial status" },
      { status: 500 }
    );
  }
}