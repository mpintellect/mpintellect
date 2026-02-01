// functions/api/user/trial-status.ts (Move from app/api/user/trial-status/route.ts)

import { getDB } from "../../../landing/backend-lib/db-simple";

/**
 * GET: Check trial status
 */
export async function onRequestGet(context: any) {
  const { request } = context;

  try {
    const url = new URL(request.url);
    const userId = url.searchParams.get('userId');
    
    if (!userId) {
      return Response.json({ success: false, error: "User ID is required" }, { status: 400 });
    }

    const db = getDB();
    if (!db) {
      return Response.json({ success: false, error: "Database not available" }, { status: 500 });
    }

    const userQuery: any = await db.prepare(
      "SELECT trial_count, license_type, created_at FROM users WHERE id = ?"
    ).bind(userId).first();

    if (!userQuery) {
      return Response.json({ success: false, error: "User not found" }, { status: 404 });
    }

    const trialCount = userQuery.trial_count || 0;
    const maxTrials = 2;
    const remaining = Math.max(0, maxTrials - trialCount);
    const available = remaining > 0;

    return Response.json({
      success: true,
      available,
      remaining,
      used: trialCount,
      maxTrials,
      licenseType: userQuery.license_type,
      createdAt: userQuery.created_at
    });
  } catch (error: any) {
    return Response.json({ success: false, error: error.message }, { status: 500 });
  }
}

/**
 * POST: Increment trial count
 */
export async function onRequestPost(context: any) {
  const { request } = context;

  try {
    const { userId } = await request.json();
    
    if (!userId) {
      return Response.json({ success: false, error: "User ID is required" }, { status: 400 });
    }

    const db = getDB();
    const userQuery: any = await db.prepare(
      "SELECT trial_count FROM users WHERE id = ?"
    ).bind(userId).first();

    const currentCount = userQuery?.trial_count || 0;
    
    await db.prepare(
      "UPDATE users SET trial_count = ?, updated_at = ? WHERE id = ?"
    ).bind(currentCount + 1, new Date().toISOString(), userId).run();

    return Response.json({ 
      success: true,
      newCount: currentCount + 1,
      message: "Trial count incremented"
    });
  } catch (error: any) {
    return Response.json({ success: false, error: error.message }, { status: 500 });
  }
}

/**
 * PUT: Reset trial count (admin only)
 */
export async function onRequestPut(context: any) {
  const { request } = context;

  try {
    const { userId, newCount = 0 } = await request.json();
    
    if (!userId) {
      return Response.json({ success: false, error: "User ID is required" }, { status: 400 });
    }

    const db = getDB();
    await db.prepare(
      "UPDATE users SET trial_count = ?, updated_at = ? WHERE id = ?"
    ).bind(newCount, new Date().toISOString(), userId).run();

    return Response.json({ 
      success: true,
      newCount,
      message: "Trial count reset"
    });
  } catch (error: any) {
    return Response.json({ success: false, error: error.message }, { status: 500 });
  }
}