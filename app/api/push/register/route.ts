import { NextResponse } from "next/server";
// Import from your safe file
import { adminDb, adminAuth } from "../../../lib/pushAdminSafe"; 

// This forces Next.js to run this as an API, not a static page
export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    // 1. Safe parsing
    let body;
    try {
        body = await req.json();
    } catch (e) {
        return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
    }

    const { subscription, idToken } = body;

    if (!subscription || !idToken) {
      console.error("Register Error: Missing subscription or idToken");
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // 2. Verify User
    let uid, isAnonymous;
    try {
        const decodedToken = await adminAuth.verifyIdToken(idToken);
        uid = decodedToken.uid;
        isAnonymous = decodedToken.firebase.sign_in_provider === 'anonymous';
    } catch (e) {
        console.error("Token Verification Failed:", e);
        return NextResponse.json({ error: "Invalid Auth Token" }, { status: 401 });
    }

    console.log(`Saving DB Record for: ${uid}`);

    // 3. Save to Firestore
    try {
        await adminDb.collection("push_subscriptions").doc(uid).set({
            userId: uid,
            subscriptionData: subscription,
            createdAt: new Date(),
            type: isAnonymous ? 'anonymous_lead' : 'registered_client',
            source: 'welcome_popup',
            deviceInfo: req.headers.get("user-agent") || "Unknown"
        }, { merge: true });
        
        console.log(`Success: DB Record Created for ${uid}`);
        
        return NextResponse.json({ success: true, createdId: uid });

    } catch (dbError: any) {
        console.error("Firestore Write Error:", dbError);
        // This catches 'Missing Key' errors from pushAdminSafe
        return NextResponse.json({ error: "Database Write Failed" }, { status: 500 });
    }

  } catch (error: any) {
    console.error("GLOBAL REGISTER ERROR:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}