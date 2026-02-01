// app/api/push/register/route.ts - CLOUDFLARE VERSION
import { NextResponse } from "next/server";
import { getDb, queryOne, execute } from "@/landing/backend-lib/db-simple";
import { verifyCloudflareToken } from "../../../landing/app/lib/cloudflare/auth";

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    console.log("1. Starting Push Registration...");
    
    // Safe Parse Body
    let body;
    try {
        body = await req.json();
    } catch (e) {
        return Response.json({ error: "Invalid JSON in body" }, { status: 400 });
    }

    const { subscription, token } = body;

    if (!subscription || !token) {
      return Response.json({ error: "Missing data in request" }, { status: 400 });
    }

    console.log("2. Data received. Verifying Cloudflare Token...");

    // Verify Cloudflare Token
    const user = await verifyCloudflareToken(token);
    if (!user) {
      return Response.json({ error: "Invalid authentication token" }, { status: 401 });
    }

    const userId = user.id;
    const isRegistered = !!(user.email && user.email_verified);
    
    console.log(`3. Token Verified. User: ${userId}. Attempting DB Write...`);

    const db = getDb();
    if (!db) {
        throw new Error("Cloudflare D1 database not available");
    }

    const endpoint = subscription.endpoint;
    const now = Date.now();
    const userAgent = req.headers.get("user-agent") || "Unknown";

    // Check if subscription already exists
    const existing = await queryOne(
      'SELECT id FROM push_subscriptions WHERE endpoint = ?',
      [endpoint]
    );

    if (existing) {
      // Update existing subscription
      await execute(`
        UPDATE push_subscriptions 
        SET subscription_data = ?, user_id = ?, email = ?, 
            display_name = ?, device_info = ?, updated_at = ?,
            status = 'active', type = ?
        WHERE endpoint = ?
      `, [
        JSON.stringify(subscription),
        userId,
        user.email || null,
        user.displayName || null,
        userAgent,
        now,
        isRegistered ? 'registered_client' : 'trial_user',
        endpoint
      ]);
    } else {
      // Insert new subscription
      await execute(`
        INSERT INTO push_subscriptions 
        (endpoint, subscription_data, user_id, email, display_name, 
         device_info, status, type, source, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?, ?, 'active', ?, ?, ?, ?)
      `, [
        endpoint,
        JSON.stringify(subscription),
        userId,
        user.email || null,
        user.displayName || null,
        userAgent,
        isRegistered ? 'registered_client' : 'trial_user',
        'desktop_welcome',
        now,
        now
      ]);
    }

    console.log("4. DB Write Successful.");

    return Response.json({ 
      success: true,
      message: 'Push subscription registered successfully',
      userId,
      isRegistered
    });

  } catch (error: any) {
    console.error("CRITICAL BACKEND FAILURE:", error);
    
    return Response.json({ 
        error: `Server Failed: ${error.message}`,
        details: error.code || "No Error Code"
    }, { status: 500 });
  }
}