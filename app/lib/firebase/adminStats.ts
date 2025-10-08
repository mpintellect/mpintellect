// lib/firebase/adminStats.ts
import { adminDb } from '../firebaseAdmin';

export async function getAIAssistantStats() {
  const now = new Date();
  const thirtyDaysAgo = new Date(now.setDate(now.getDate() - 30));
  
  // Get licenses created in last 30 days
  const licensesSnapshot = await adminDb
    .collection('ai_assistant_licenses')
    .where('createdAt', '>=', FirebaseFirestore.Timestamp.fromDate(thirtyDaysAgo))
    .get();
  
  // Get usage stats
  const usageSnapshot = await adminDb
    .collection('ai_assistant_usage')
    .where('timestamp', '>=', FirebaseFirestore.Timestamp.fromDate(thirtyDaysAgo))
    .get();
  
  // Get trial stats
  const trialsSnapshot = await adminDb
    .collection('ai_assistant_trials')
    .get();
  
  const licenses = licensesSnapshot.docs.map(doc => doc.data());
  const usage = usageSnapshot.docs.map(doc => doc.data());
  
  const stats = {
    totalSales: licenses.length,
    revenue: licenses.reduce((sum, license) => {
      const amount = license.productName.includes('24 Hours') ? 5 : 19.99;
      return sum + amount;
    }, 0),
    activeUsers: trialsSnapshot.size,
    totalAnalyses: usage.filter(u => u.action === 'analysis').length,
    licenseActivations: usage.filter(u => u.action === 'license_activation').length,
    popularSymbol: usage.reduce((acc, record) => {
      if (record.symbol) {
        acc[record.symbol] = (acc[record.symbol] || 0) + 1;
      }
      return acc;
    }, {})
  };
  
  return stats;
}