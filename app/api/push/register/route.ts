import { NextResponse } from "next/server";
import { adminAuth, adminDb } from "../../../lib/firebaseAdmin"; 

export async function POST(req: Request) {
  try {
    const { subscription, idToken } = await req.json();

    if (!subscription || !idToken) {
      return NextResponse.json({ error: "Missing data" }, { status: 400 });
    }

    const decodedToken = await adminAuth.verifyIdToken(idToken);
    const uid = decodedToken.uid;

    // We are saving it as 'subscriptionData'. The SEND file now matches this.
    await adminDb.collection("push_subscriptions").doc(uid).set({
      userId: uid,
      subscriptionData: subscription, 
      createdAt: new Date(),
      deviceInfo: req.headers.get("user-agent") || "Unknown Device"
    }, { merge: true }); // Merge protects against overwriting other fields if you add them later

    return NextResponse.json({ success: true });

  } catch (error: any) {
    console.error("Registration Error:", error);
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}