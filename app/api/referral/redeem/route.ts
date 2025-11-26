import { NextResponse } from "next/server";
import { adminAuth, adminDb } from "../../../lib/pushAdminSafe"; // Use your existing Safe Admin file
import * as admin from 'firebase-admin';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    const { currentUserId, referralCode } = await req.json();

    if (!currentUserId || !referralCode) {
      return NextResponse.json({ error: "Missing data" }, { status: 400 });
    }

    // 1. VALIDATION
    if (currentUserId === referralCode) {
      return NextResponse.json({ error: "You cannot refer yourself." }, { status: 400 });
    }

    // Get the User performing the action (Referee)
    const userRef = adminDb.collection("users").doc(currentUserId);
    const userSnap = await userRef.get();

    if (!userSnap.exists) {
      return NextResponse.json({ error: "User profile not found." }, { status: 404 });
    }

    // Check if they were already referred
    if (userSnap.data()?.referredBy) {
      return NextResponse.json({ error: "You have already redeemed a referral code." }, { status: 400 });
    }

    // 2. FIND THE REFERRER (The person who gets the credits)
    const referrerRef = adminDb.collection("users").doc(referralCode);
    const referrerSnap = await referrerRef.get();

    if (!referrerSnap.exists) {
      return NextResponse.json({ error: "Invalid Referral Code." }, { status: 404 });
    }

    // 3. EXECUTE TRANSACTION (Atomic update)
    const BATCH_BONUS = 5; // How many setups to give

    const batch = adminDb.batch();

    // Update Current User (Mark as referred)
    batch.set(userRef, { 
      referredBy: referralCode,
      referredAt: admin.firestore.Timestamp.now()
    }, { merge: true });

    // Update Referrer (Give credits)
    batch.update(referrerRef, {
      setupCount: admin.firestore.FieldValue.increment(BATCH_BONUS),
      referralsCount: admin.firestore.FieldValue.increment(1)
    });

    // Log the transaction for analytics (Optional)
    const logRef = adminDb.collection("referral_logs").doc();
    batch.set(logRef, {
        referrer: referralCode,
        referee: currentUserId,
        amount: BATCH_BONUS,
        timestamp: admin.firestore.Timestamp.now()
    });

    await batch.commit();

    return NextResponse.json({ success: true, message: "Referral redeemed!" });

  } catch (error: any) {
    console.error("Referral API Error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}