// /app/lib/firebase/saveSetup.ts
import { getDbInstance } from "@/app/lib/firebaseClient";
import { collection, doc, setDoc, Timestamp } from "firebase/firestore";

/**
 * Save a complete trade setup to Firestore for analytics.
 * Linked directly to the authenticated user's UID.
 */
export async function saveSetup({
  userId,
  symbol,
  entryPrice,
  takeProfit,
  stopLoss,
  capital,        // ✅ New
  lotSize,        // ✅ New
  riskReward      // ✅ New
}: {
  userId: string;
  symbol: string;
  entryPrice: number;
  takeProfit: number;
  stopLoss: number;
  capital?: number;    // ✅ New
  lotSize?: number;    // ✅ New
  riskReward?: number; // ✅ New
}) {
  console.log("🔄 saveSetup called with:", { 
    userId, symbol, entryPrice, takeProfit, stopLoss, capital, lotSize, riskReward 
  });
  
  if (!userId) {
    console.error("❌ Missing userId for saving setup.");
    throw new Error("Missing userId for saving setup.");
  }

  if (!symbol || !entryPrice || !takeProfit || !stopLoss) {
    console.error("❌ Missing required fields:", { symbol, entryPrice, takeProfit, stopLoss });
    throw new Error("Missing required fields for setup.");
  }

  try {
    // Get the Firestore instance using the getter function
    const dbInstance = getDbInstance();
    
    // Create a new doc in Firestore > setups
    const ref = doc(collection(dbInstance, "setups"));
    console.log("📝 Creating Firestore document with ID:", ref.id);

    const data = {
      userId,
      symbol,
      entryPrice,
      takeProfit,
      stopLoss,
      capital: capital || 0,           // ✅ New - default to 0 if not provided
      lotSize: lotSize || 0,           // ✅ New - default to 0 if not provided
      riskReward: riskReward || 1,     // ✅ New - default to 1 if not provided
      status: "pending",               // pending | hit_tp | hit_sl | expired
      generatedAt: Timestamp.now(),
    };

    console.log("💾 Saving data to Firestore:", data);
    
    await setDoc(ref, data);
    console.log("✅ Setup saved successfully with ID:", ref.id);

    return { id: ref.id, ...data };
  } catch (error) {
    console.error("❌ Firestore save error:", error);
    throw new Error(`Failed to save setup: ${error instanceof Error ? error.message : String(error)}`);
  }
}