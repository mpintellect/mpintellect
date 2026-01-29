import { NextRequest, NextResponse } from "next/server";
import { getDB } from "@/app/lib/cloudflare/db-simple";

// Check trial status
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    
    if (!userId) {
      return NextResponse.json(
        { success: false, error: "User ID is required" },
        { status: 400 }
      );
    }

    const db = getDB();
    if (!db) {
      return NextResponse.json(
        { success: false, error: "Database not available" },
        { status: 500 }
      );
    }

    const userQuery = await db.prepare(
      "SELECT trial_count, license_type, created_at FROM users WHERE id = ?"
    ).bind(userId).first();

    if (!userQuery) {
      return NextResponse.json(
        { success: false, error: "User not found" },
        { status: 404 }
      );
    }

    const trialCount = userQuery.trial_count || 0;
    const maxTrials = 2;
    const remaining = Math.max(0, maxTrials - trialCount);
    const available = remaining > 0;

    return NextResponse.json({
      success: true,
      available,
      remaining,
      used: trialCount,
      maxTrials,
      licenseType: userQuery.license_type,
      createdAt: userQuery.created_at
    });
  } catch (error) {
    console.error("Trial status error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to check trial status" },
      { status: 500 }
    );
  }
}

// Increment trial count
export async function POST(request: NextRequest) {
  try {
    const { userId } = await request.json();
    
    if (!userId) {
      return NextResponse.json(
        { success: false, error: "User ID is required" },
        { status: 400 }
      );
    }

    const db = getDB();
    if (!db) {
      return NextResponse.json(
        { success: false, error: "Database not available" },
        { status: 500 }
      );
    }

    // Get current trial count
    const userQuery = await db.prepare(
      "SELECT trial_count FROM users WHERE id = ?"
    ).bind(userId).first();

    const currentCount = userQuery?.trial_count || 0;
    
    // Increment trial count
    await db.prepare(
      "UPDATE users SET trial_count = ?, updated_at = ? WHERE id = ?"
    ).bind(currentCount + 1, new Date().toISOString(), userId).run();

    return NextResponse.json({ 
      success: true,
      newCount: currentCount + 1,
      message: "Trial count incremented"
    });
  } catch (error) {
    console.error("Increment trial error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to increment trial count" },
      { status: 500 }
    );
  }
}

// Reset trial count (admin only)
export async function PUT(request: NextRequest) {
  try {
    const { userId, newCount = 0 } = await request.json();
    
    if (!userId) {
      return NextResponse.json(
        { success: false, error: "User ID is required" },
        { status: 400 }
      );
    }

    const db = getDB();
    if (!db) {
      return NextResponse.json(
        { success: false, error: "Database not available" },
        { status: 500 }
      );
    }

    // Update trial count
    await db.prepare(
      "UPDATE users SET trial_count = ?, updated_at = ? WHERE id = ?"
    ).bind(newCount, new Date().toISOString(), userId).run();

    return NextResponse.json({ 
      success: true,
      newCount,
      message: "Trial count reset"
    });
  } catch (error) {
    console.error("Reset trial error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to reset trial count" },
      { status: 500 }
    );
  }
}