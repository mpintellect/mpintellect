import { NextRequest, NextResponse } from "next/server";
import { getDB } from "@/app/lib/cloudflare/db-simple";

export async function POST(req: NextRequest) {
  try {
    const { userId } = await req.json();
    
    if (!userId) {
      return Response.json(
        { success: false, error: "User ID is required" },
        { status: 400 }
      );
    }

    const db = getDB();
    if (!db) {
      return Response.json(
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

    return Response.json({ 
      success: true,
      newCount: currentCount + 1
    });
  } catch (error) {
    console.error("Increment trial error:", error);
    return Response.json(
      { success: false, error: "Failed to increment trial count" },
      { status: 500 }
    );
  }
}