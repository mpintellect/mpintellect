import { NextResponse } from "next/server";
import webpush from "web-push";
import { adminDb } from "../../../lib/firebaseAdmin";

// Init WebPush
webpush.setVapidDetails(
  process.env.VAPID_SUBJECT!, // e.g., "mailto:admin@yoursite.com"
  process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
  process.env.VAPID_PRIVATE_KEY!
);

export async function POST(req: Request) {
  try {
    const { targetUserId, title, message, url } = await req.json();

    if(!targetUserId) {
        return NextResponse.json({ error: "User ID required" }, { status: 400 });
    }

    // 1. Get User's Subscription from DB
    const userDoc = await adminDb.collection("push_subscriptions").doc(targetUserId).get();
    const userData = userDoc.data();
    
    if (!userData?.pushSubscription) {
      return NextResponse.json({ error: "User has no subscription" }, { status: 404 });
    }

    const subscription = userData.pushSubscription;

    // 2. Send Notification via WebPush Library
    const payload = JSON.stringify({
      title: title || "Notification",
      body: message || "You have a new update.",
      url: url || "/dashboard",
      icon: "/public/logos/mzlogo.webp"
    });

    await webpush.sendNotification(subscription, payload);

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error("Send Notification Error:", error);
    
    // Check for expired/invalid subscriptions (Status 410)
    if ((error as any).statusCode === 410) {
       // TODO: Optional - delete invalid subscription from DB here
       console.log("Subscription is no longer valid");
    }

    return NextResponse.json({ error: "Failed to send" }, { status: 500 });
  }
}