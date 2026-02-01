// app/api/AIchat/track-usage/route.ts - CLOUDFLARE VERSION
import { NextRequest, NextResponse } from "next/server";
import { getDb, execute } from "@/backend-lib/db-simple";

export async function POST(req: NextRequest) {
  try {
    const usageData = await req.json();
    
    if (!usageData || !usageData.userId || !usageData.action) {
      return Response.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      );
    }

    const now = Date.now();
    
    // Save usage tracking to Cloudflare D1
    const result = await execute(
      `INSERT INTO ai_usage_tracking 
       (user_id, action, metadata, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?)`,
      [
        usageData.userId,
        usageData.action,
        JSON.stringify(usageData.metadata || {}),
        now,
        now
      ]
    );

    if (!result.success) {
      throw new Error("Failed to track usage in database");
    }

    console.log(`📊 Usage tracked: ${usageData.userId} - ${usageData.action}`);

    return Response.json({ 
      success: true, 
      trackingId: result.id,
      timestamp: new Date(now).toISOString()
    });
    
  } catch (error) {
    console.error("Track usage error:", error);
    return Response.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}