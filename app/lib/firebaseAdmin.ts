import admin from 'firebase-admin';
// Assuming you have "resolveJsonModule": true in tsconfig.json
import serviceAccount from '../../firebase-key.json'; 

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
  });
}

// 1. Firestore (for saving the subscriptions)
const adminDb = admin.firestore();

// 2. Auth (for verifying the user who is asking to subscribe) -> ADD THIS
const adminAuth = admin.auth();

export { adminDb, adminAuth };