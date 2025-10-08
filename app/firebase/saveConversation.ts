import { adminDb } from "../lib/firebaseAdmin";

interface ChatLog {
  symbol: string;
  capital: number;
  tp: number;
  sl: number;
  risk: string;
  lotSize: number;
  resultUSD: number;
  timestamp: number;
}

export async function saveChatLog(userId: string, chatData: ChatLog) {
  if (!userId || !chatData) return;

  try {
    await adminDb
      .collection("chatlogs")
      .doc(userId)
      .collection("entries")
      .add(chatData);

    console.log(`✅ Chat log saved for user: ${userId}`);
  } catch (err) {
    console.error("❌ Error saving chat log:", err);
  }
}