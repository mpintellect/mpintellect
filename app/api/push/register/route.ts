import { NextResponse } from "next/server";
// Import your safe admin
import { adminDb, adminAuth } from "../../../lib/pushAdminSafe"; 

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    console.log("1. Starting Registration...");
    
    // Safe Parse Body
    let body;
    try {
        body = await req.json();
    } catch (e) {
        return NextResponse.json({ error: "Invalid JSON in body" }, { status: 400 });
    }

    const { subscription, idToken } = body;

    if (!subscription || !idToken) {
      return NextResponse.json({ error: "Missing data in request" }, { status: 400 });
    }

    console.log("2. Data received. Verifying ID Token...");

    // Verify Token
    const decodedToken = await adminAuth.verifyIdToken(idToken);
    const uid = decodedToken.uid;
    const isAnonymous = decodedToken.firebase.sign_in_provider === 'anonymous';

    console.log(`3. Token Verified. User: ${uid}. Attempting DB Write...`);

    // Debug: Check if Admin DB is connected
    if (!adminDb) {
        throw new Error("Firebase Admin DB Instance is undefined. Check initialization.");
    }

    // CLEAN DATABASE SAVE
    await adminDb.collection("push_subscriptions").doc(uid).set({
      userId: uid,
      subscriptionData: subscription, 
      createdAt: new Date(),
      type: isAnonymous ? 'anonymous_lead' : 'registered_client', 
      source: 'desktop_welcome',
      deviceInfo: req.headers.get("user-agent") || "Unknown"
    }, { merge: true });

    console.log("4. DB Write Successful.");

    return NextResponse.json({ success: true });

  } catch (error: any) {
    console.error("CRITICAL BACKEND FAILURE:", error);
    
    // --- DETAILED ERROR RETURN ---
    // This allows the alert on your frontend to show exactly WHY it failed
    return NextResponse.json({ 
        error: `Server Failed: ${error.message}`, 
        details: error.code || "No Error Code"
    }, { status: 500 });
  }
}