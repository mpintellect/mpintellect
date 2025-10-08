import { adminDb } from '../firebaseAdmin';
import * as admin from 'firebase-admin'; // ✅ add this

const USAGE_COLLECTION = 'ai_assistant_usage';

export interface UsageRecord {
  userId: string;
  licenseKey?: string;
  action: 'analysis' | 'license_activation' | 'trial_used' | 'payment_success';
  symbol?: string;
  capital?: number;
  productName?: string;
  amount?: number;
  orderId?: string | null; 
  timestamp: admin.firestore.Timestamp; // ✅
  userAgent?: string;
}

export async function trackUsage(usageData: Omit<UsageRecord, 'timestamp'>) {
  try {
    await adminDb.collection(USAGE_COLLECTION).add({
      ...usageData,
      timestamp: admin.firestore.Timestamp.now() // ✅
    });
    console.log("📊 Usage tracked:", usageData.action);
  } catch (error) {
    console.error("❌ Failed to track usage:", error);
  }
}

// Enhanced chat log saving with usage tracking
export async function saveAIAnalysis(userId: string, chatData: any, licenseKey?: string) {
  try {
    // Save to your existing chatlogs collection
    await adminDb
      .collection("chatlogs")
      .doc(userId)
      .collection("ai_analyses")
      .add({
        ...chatData,
        licenseKey: licenseKey || 'trial',
        timestamp: admin.firestore.Timestamp.now() // ✅
      });
    
    // Track usage
    await trackUsage({
      userId,
      licenseKey,
      action: 'analysis',
      symbol: chatData.symbol,
      capital: chatData.capital
    });
    
    console.log("✅ AI analysis saved for user:", userId);
  } catch (error) {
    console.error("❌ Failed to save AI analysis:", error);
  }
}