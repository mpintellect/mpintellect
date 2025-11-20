// app/lib/firebase/useSetup.ts
import { auth, db } from "../firebaseClient";
import { doc, runTransaction } from "firebase/firestore";

/**
 * Deducts 1 setup count from the current user in Firestore.
 * Returns "ok" if successful, "no-credits" if none available, "error" if unknown failure.
 */
export async function useOneSetup(): Promise<"ok" | "no-credits" | "error"> {
  const user = auth.currentUser;
  if (!user) return "error";

  const userRef = doc(db, "users", user.uid);

  try {
    let success = "error" as "ok" | "no-credits" | "error";

    await runTransaction(db, async (transaction) => {
      const userDoc = await transaction.get(userRef);
      const current = userDoc.data()?.setupCount || 0;

      if (current < 1) {
        success = "no-credits";
        return;
      }

      transaction.update(userRef, { setupCount: current - 1 });
      success = "ok";
    });

    return success;
  } catch (err) {
    console.error("🔥 Setup use failed:", err);
    return "error";
  }
}