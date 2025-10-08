// lib/firebase/licenses.ts
import { adminDb } from '../firebaseAdmin';
import * as admin from 'firebase-admin';

const LICENSES_COLLECTION = 'ai_assistant_licenses';

export interface LicenseData {
  email: string;
  licenseKey: string;
  productName: string;
  expiresAt: admin.firestore.Timestamp;
  createdAt: admin.firestore.Timestamp;
  activated: boolean;
  activatedAt?: admin.firestore.Timestamp;
  stripeSessionId: string;
  priceId: string;
  orderId?: string | null; // ✅ Add this line
  status: 'active' | 'expired' | 'revoked';
}

// ✅ Create a new interface that includes the document ID
export interface LicenseWithId extends LicenseData {
  id: string;
}

export async function createLicense(licenseData: Omit<LicenseData, 'createdAt' | 'activated' | 'status'>) {
  const licenseRef = adminDb.collection(LICENSES_COLLECTION).doc(licenseData.licenseKey);
  
  const data: LicenseData = {
    ...licenseData,
    createdAt: admin.firestore.Timestamp.now(),
    activated: false,
    status: 'active'
  };
  
  await licenseRef.set(data);
  console.log("📝 License saved to Firebase:", licenseData.licenseKey);
  return licenseData.licenseKey;
}

export async function validateLicense(licenseKey: string) {
  const licenseRef = adminDb.collection(LICENSES_COLLECTION).doc(licenseKey);
  const licenseSnap = await licenseRef.get();
  
  if (!licenseSnap.exists) {
    return { valid: false, error: "Invalid license key" };
  }
  
  const licenseData = licenseSnap.data() as LicenseData;
  
  // Check if expired
  if (admin.firestore.Timestamp.now().toMillis() > licenseData.expiresAt.toMillis()) {
    await licenseRef.update({ status: 'expired' });
    return { valid: false, error: "License has expired" };
  }
  
  // Check if revoked
  if (licenseData.status === 'revoked') {
    return { valid: false, error: "License has been revoked" };
  }
  
  // Activate license if not already activated
  if (!licenseData.activated) {
    await licenseRef.update({
      activated: true,
      activatedAt: admin.firestore.Timestamp.now()
    });
  }
  
  return {
    valid: true,
    expiresAt: licenseData.expiresAt.toMillis(),
    email: licenseData.email,
    productName: licenseData.productName,
    activated: licenseData.activated
  };
}

export async function getUserLicenses(email: string): Promise<LicenseWithId[]> {
  const snapshot = await adminDb
    .collection(LICENSES_COLLECTION)
    .where('email', '==', email)
    .get();
  
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  })) as LicenseWithId[];
}