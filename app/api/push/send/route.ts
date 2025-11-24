import { NextResponse } from "next/server";
import webpush from "web-push";
import { adminDb } from "../../../lib/pushAdminSafe"; 

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    // 1. SECURITY
    if (!process.env.VAPID_PRIVATE_KEY || !process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY) {
      throw new Error("VAPID Keys are missing in Server Environment Variables");
    }

    webpush.setVapidDetails(
      process.env.VAPID_SUBJECT || "mailto:admin@mzprimer.com",
      process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY,
      process.env.VAPID_PRIVATE_KEY
    );

    const body = await req.json();
    // TRIM WHITESPACE: This is the #1 cause of "User not found" errors
    const targetUserId = body.targetUserId ? body.targetUserId.trim() : null;
    const sendToAll = body.sendToAll;
    
    const payload = JSON.stringify({
      title: body.title || "Signal",
      body: body.message || "Update",
      url: body.url || "https://mzprimer.com",
      icon: "/logos/mzlogo.webp"
    });

    // =========================================
    // SCENARIO A: SINGLE TARGET (Deep Search)
    // =========================================
    if (targetUserId) {
        console.log(`🔍 Searching for ID: [${targetUserId}]`);

        // ATTEMPT 1: Check 'push_subscriptions' collection (New Method)
        let userDoc = await adminDb.collection("push_subscriptions").doc(targetUserId).get();
        let foundCollection = "push_subscriptions";

        // ATTEMPT 2: Check 'users' collection (Old/Legacy Method)
        if (!userDoc.exists) {
            console.log(`❌ Not found in 'push_subscriptions'. Checking 'users'...`);
            userDoc = await adminDb.collection("users").doc(targetUserId).get();
            foundCollection = "users";
        }

        // FINAL CHECK
        if (!userDoc.exists) {
            console.log(`❌ CRITICAL: ID [${targetUserId}] does not exist in ANY collection.`);
            return NextResponse.json({ 
                error: `ID [${targetUserId}] not found in DB. Copy the ID exactly from Firebase > Firestore.` 
            }, { status: 404 });
        }

        console.log(`✅ Found Document in '${foundCollection}'. Checking keys...`);

        const userData = userDoc.data();
        
        // Check all naming variations
        const subscription = userData?.subscriptionData || userData?.pushSubscription || userData?.subscription;

        if (!subscription) {
            console.log("❌ Doc found, but fields are empty. Data:", JSON.stringify(userData));
            return NextResponse.json({ error: `User Found in '${foundCollection}', but 'subscriptionData' field is missing.` }, { status: 404 });
        }

        // Send
        await webpush.sendNotification(subscription, payload);
        console.log(`🚀 Success! Sent to ${targetUserId}`);
        
        return NextResponse.json({ success: true, count: 1, mode: `single (${foundCollection})` });
    }

    // =========================================
    // SCENARIO B: BROADCAST
    // =========================================
    if (sendToAll) {
        // Note: Broadcast currently only targets the NEW collection to be safe/fast.
        const snapshot = await adminDb.collection('push_subscriptions').get();
        
        if (snapshot.empty) return NextResponse.json({ success: true, count: 0, message: "No subscribers found" });

        const promises = snapshot.docs.map(async (doc) => {
            const data = doc.data();
            const sub = data.subscriptionData || data.pushSubscription; 
            if (sub) {
                return webpush.sendNotification(sub, payload)
                   .catch(err => {
                       if (err.statusCode === 410 || err.statusCode === 404) {
                           return doc.ref.delete(); // Clean up
                       }
                       return null;
                   });
            }
        });

        await Promise.all(promises);
        return NextResponse.json({ success: true, count: snapshot.size });
    }

    return NextResponse.json({ error: "Invalid Payload" }, { status: 400 });

  } catch (error: any) {
    console.error("SERVER ERROR:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}