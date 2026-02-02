// app/api/AIchat/save-analysis/route.ts - CLOUDFLARE VERSION
import { NextRequest, NextResponse } from "next/server";
import { getDb, execute } from "@/backend-lib/db-simple";

export async function POST(req: NextRequest) {
  try {
    const { userId, chatData, licenseKey } = await req.json();
    
    if (!userId || !chatData) {
      return Response.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      );
    }

    const now = Date.now();
    
    // Save to Cloudflare D1
    const result = await execute(
      `INSERT INTO ai_chat_analytics 
       (user_id, chat_data, license_key, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?)`,
      [
        userId,
        JSON.stringify(chatData),
        licenseKey || null,
        now,
        now
      ]
    );

    if (!result.success) {
      throw new Error("Failed to save analysis to database");
    }

    console.log(`✅ AI Analysis saved for user: ${userId}`);

    return Response.json({ 
      success: true, 
      analyticsId: result.id,
      timestamp: new Date(now).toISOString()
    });
    
  } catch (error) {
    console.error("Save analysis error:", error);
    return Response.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}