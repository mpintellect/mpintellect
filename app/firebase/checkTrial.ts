// ✅ STEP 1: Creating firebase/checkTrial.ts
// Purpose: Check if user already used the free trial (based on localStorage UID)

import { doc, getDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';

export const checkTrialStatus = async (uid: string): Promise<boolean> => {
  try {
    const docRef = doc(db, 'chatbot_trials', uid);
    const docSnap = await getDoc(docRef);

    // ✅ If document exists, user already used their trial
    return !docSnap.exists();
  } catch (error) {
    console.error('Trial check failed:', error);
    return false;
  }
};