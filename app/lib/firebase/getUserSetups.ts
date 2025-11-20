// /app/lib/firebase/getUserSetups.ts
import { db } from "@/app/lib/firebaseClient";
import { collection, query, where, getDocs, orderBy } from "firebase/firestore";

/**
 * Fetch all trade setups linked to a specific userId
 */
export async function getUserSetups(userId: string) {
  if (!userId) throw new Error("Missing userId for fetching setups.");

  const setupsRef = collection(db, "setups");
  const setupsQuery = query(
    setupsRef,
    where("userId", "==", userId),
    orderBy("generatedAt", "desc")
  );

  const querySnapshot = await getDocs(setupsQuery);

  const setups = querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data()
  }));

  return setups;
}