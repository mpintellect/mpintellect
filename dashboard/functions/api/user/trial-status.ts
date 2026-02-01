import { NextRequest, NextResponse } from "@/landing/node_modules/next/server";
import { getDB, queryOne } from "@/landing/backend-lib/db-simple";

export async function POST(req: NextRequest) {
  try {
    const { userId } = await req.json();
    
    if (!userId) {
      return Response.json(
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
      return Response.json(
        { available: false, remaining: 0, error: "User not found" },
        { status: 404 }
      );
    }

    const trialCount = user.trial_count || 0;
    const maxTrials = 2; // Free trial limit
    const remaining = Math.max(0, maxTrials - trialCount);
    const available = remaining > 0;

    return Response.json({
      available,
      remaining,
      used: trialCount,
      maxTrials,
      licenseType: user.license_type
    });
  } catch (error) {
    console.error("Trial status error:", error);
    return Response.json(
      { available: false, remaining: 0, error: "Failed to check trial status" },
      { status: 500 }
    );
  }
}