// functions/api/referral/redeem.ts (Move from app/api/referral/redeem/route.ts)

import { getDB } from "../../../app/lib/cloudflare/db-simple";

/**
 * FIXED: 
 * 1. Removed Next.js imports (NextRequest, NextResponse).
 * 2. Added ': any' type to context.
 * 3. Destructured 'request' from context.
 * 4. Changed path to db-simple (Functions are in /root, not /app).
 */
export async function onRequestPost(context: any) {
  const { request } = context;

  try {
    const body = await request.json();
    const { userId, code } = body;
    
    if (!userId || !code) {
      return Response.json(
        { success: false, error: "Missing userId or code" },
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

    // Check if referral code exists and is valid
    // Note: Bind current time to check expiration
    const referral: any = await db.prepare(
      `SELECT * FROM referral_codes 
       WHERE code = ? AND is_active = 1 
       AND (expires_at IS NULL OR expires_at > ?)`
    ).bind(code, new Date().toISOString()).first();

    if (!referral) {
      return Response.json(
        { success: false, error: "Invalid or expired referral code" },
        { status: 400 }
      );
    }

    // Check if user already redeemed this code
    const existingRedemption = await db.prepare(
      `SELECT id FROM referral_redemptions 
       WHERE user_id = ? AND referral_code = ?`
    ).bind(userId, code).first();

    if (existingRedemption) {
      return Response.json(
        { success: false, error: "You have already redeemed this code" },
        { status: 400 }
      );
    }

    // Record redemption
    const redemptionId = crypto.randomUUID();
    await db.prepare(
      `INSERT INTO referral_redemptions (
        id, user_id, referral_code, redeemed_at
      ) VALUES (?, ?, ?, ?)`
    ).bind(redemptionId, userId, code, new Date().toISOString()).run();

    // Give user setup credits (e.g., 5 extra setups)
    await db.prepare(
      `UPDATE users 
       SET setup_count = setup_count + 5,
           updated_at = ?
       WHERE id = ?`
    ).bind(new Date().toISOString(), userId).run();

    return Response.json({
      success: true,
      message: "Referral code redeemed successfully! You received 5 setup credits.",
      creditsAdded: 5
    });
    
  } catch (error: any) {
    console.error("Referral redemption error:", error);
    return Response.json(
      { success: false, error: "Failed to redeem referral code" },
      { status: 500 }
    );
  }
}