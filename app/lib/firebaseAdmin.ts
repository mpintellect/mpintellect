import admin from 'firebase-admin';
import serviceAccount from '../../firebase-key.json'; // Adjust path if needed

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
  });
}

const adminDb = admin.firestore();

export { adminDb };