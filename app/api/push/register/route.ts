import { NextResponse } from "next/server";
import { adminAuth, adminDb } from "../../../lib/firebaseAdmin"; // Your Admin SDK Setup

export async function POST(req: Request) {
  try {
    const { subscription, idToken } = await req.json();

    if (!subscription || !idToken) {
      return NextResponse.json({ error: "Missing data" }, { status: 400 });
    }

    // 1. Verify the User
    const decodedToken = await adminAuth.verifyIdToken(idToken);
    const uid = decodedToken.uid;

    // 2. Save to Firestore Collection named 'push_subscriptions'
    // We use the User UID as the document ID so it's easy to find later
    await adminDb.collection("push_subscriptions").doc(uid).set({
      userId: uid,
      subscriptionData: subscription, // This object has endpoint, p256dh, auth keys
      createdAt: new Date(),
      deviceInfo: req.headers.get("user-agent") || "Unknown Device"
    });

    return NextResponse.json({ success: true });

  } catch (error: any) {
    console.error("Registration Error:", error);
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}