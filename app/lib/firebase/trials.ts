import { adminDb } from '../firebaseAdmin';
import * as admin from 'firebase-admin'; // ✅ add this

const TRIALS_COLLECTION = 'ai_assistant_trials';

export interface TrialData {
  userId: string;
  email?: string;
  trialCount: number;
  lastTrialAt: admin.firestore.Timestamp; // ✅
  createdAt: admin.firestore.Timestamp;   // ✅
}

export async function checkTrialStatus(userId: string): Promise<{ available: boolean; remaining: number }> {
  try {
    const trialRef = adminDb.collection(TRIALS_COLLECTION).doc(userId);
    const trialSnap = await trialRef.get();
    
    if (!trialSnap.exists) {
      // First time user - create trial record
      await trialRef.set({
        userId,
        trialCount: 0,
        lastTrialAt: admin.firestore.Timestamp.now(), // ✅
        createdAt: admin.firestore.Timestamp.now()    // ✅
      });
      return { available: true, remaining: 2 };
    }
    
    const trialData = trialSnap.data() as TrialData;
    const remaining = Math.max(0, 2 - trialData.trialCount);
    
    return {
      available: remaining > 0,
      remaining
    };
    
  } catch (error) {
    console.error('Trial check failed:', error);
    return { available: false, remaining: 0 };
  }
}

export async function incrementTrialCount(userId: string) {
  const trialRef = adminDb.collection(TRIALS_COLLECTION).doc(userId);
  
  await trialRef.set({
    trialCount: admin.firestore.FieldValue.increment(1), // ✅
    lastTrialAt: admin.firestore.Timestamp.now(),        // ✅
    updatedAt: admin.firestore.Timestamp.now()           // ✅
  }, { merge: true });
  
  console.log("📊 Trial count incremented for:", userId);
}