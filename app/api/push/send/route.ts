import { NextResponse } from "next/server";
import webpush from "web-push";
import { adminDb } from "../../../lib/firebaseAdmin"; // Use @ alias if possible

export async function POST(req: Request) {
  try {
    // 1. Init WebPush INSIDE the function to prevent Vercel Build Errors
    if (!process.env.VAPID_PRIVATE_KEY || !process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY) {
      throw new Error("VAPID Keys are missing in Environment Variables");
    }

    webpush.setVapidDetails(
      process.env.VAPID_SUBJECT || "mailto:support@mzprimer.com",
      process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY,
      process.env.VAPID_PRIVATE_KEY
    );

    const { targetUserId, title, message, url } = await req.json();

    if(!targetUserId) {
        return NextResponse.json({ error: "User ID required" }, { status: 400 });
    }

    // 2. Get User's Subscription from DB
    const userDoc = await adminDb.collection("push_subscriptions").doc(targetUserId).get();
    const userData = userDoc.data();
    
    // FIX: Your register route saves it as 'subscriptionData', so we must read that field.
    const subscription = userData?.subscriptionData;

    if (!subscription) {
      console.log("User document found, but no subscriptionData field.");
      return NextResponse.json({ error: "User has no subscription" }, { status: 404 });
    }

    // 3. Send Notification
    const payload = JSON.stringify({
      title: title || "Notification",
      body: message || "You have a new update.",
      url: url || "/dashboard",
      icon: "/logos/mzlogo.webp" // FIX: Removed '/public'. In browser, /public is root /
    });

    await webpush.sendNotification(subscription, payload);

    return NextResponse.json({ success: true });

  } catch (error: any) {
    console.error("Send Notification Error:", error);
    
    if (error.statusCode === 410) {
       console.log("Subscription expired (User probably reset permission).");
    }

    return NextResponse.json({ error: "Failed to send" }, { status: 500 });
  }
}