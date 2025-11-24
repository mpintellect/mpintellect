import { NextResponse } from "next/server";

// !!! CRITICAL CHANGE HERE: !!!
// Do NOT import from "../../lib/firebaseAdmin"
// Import from "@/lib/pushAdminSafe"
import { adminDb, adminAuth } from "../../../lib/pushAdminSafe"; 

export async function POST(req: Request) {
  try {
    const { subscription, idToken } = await req.json();

    if (!subscription || !idToken) {
      console.error("Register Error: Missing Body Data");
      return NextResponse.json({ error: "Missing data" }, { status: 400 });
    }

    // 1. Verify User Token
    const decodedToken = await adminAuth.verifyIdToken(idToken);
    const uid = decodedToken.uid;
    const isAnonymous = decodedToken.firebase.sign_in_provider === 'anonymous';

    console.log(`Creating Subscription DB Entry for: ${uid} (Anon: ${isAnonymous})`);

    // 2. CLEAN DATABASE: Save to 'push_subscriptions' only
    await adminDb.collection("push_subscriptions").doc(uid).set({
      userId: uid,
      subscriptionData: subscription,
      createdAt: new Date(),
      type: isAnonymous ? 'anonymous_lead' : 'registered_client', 
      source: 'welcome_popup',
      deviceInfo: req.headers.get("user-agent") || "Unknown"
    }, { merge: true });

    return NextResponse.json({ success: true, createdId: uid });

  } catch (error: any) {
    // 3. Detailed Logging for Debugging
    console.error("CRITICAL REGISTER BACKEND ERROR:", error);
    
    // Check if it's a key issue
    if (error.code === 'app/invalid-credential') {
        console.error("The Private Key in Vercel Env Vars is invalid.");
    }
    
    return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
  }
}