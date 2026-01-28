// /app/lib/firebase/getUserSetups.ts
import { getDbInstance } from "@/app/lib/firebaseClient";
import { collection, query, where, getDocs, orderBy } from "firebase/firestore";

/**
 * Fetch all trade setups linked to a specific userId
 */
export async function getUserSetups(userId: string) {
  if (!userId) throw new Error("Missing userId for fetching setups.");

  try {
    // Use getter function to get guaranteed non-null database instance
    const dbInstance = getDbInstance();
    
    const setupsRef = collection(dbInstance, "setups");
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
  } catch (error) {
    console.error("Error fetching user setups:", error);
    throw new Error("Failed to fetch user setups. Firebase might not be initialized.");
  }
}