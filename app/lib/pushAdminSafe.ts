import admin from 'firebase-admin';

if (!admin.apps.length) {
    // 1. Get Private Key from Vercel Env Var
    const privateKey = process.env.FIREBASE_PRIVATE_KEY
      ? process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n') // Fix newlines
      : undefined;

    // 2. Validate Critical Keys (Debugging help)
    if (!privateKey) console.error("CRITICAL: FIREBASE_PRIVATE_KEY missing.");
    if (!process.env.FIREBASE_CLIENT_EMAIL) console.error("CRITICAL: CLIENT_EMAIL missing.");

    // 3. Initialize
    admin.initializeApp({
        credential: admin.credential.cert({
            projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
            clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
            privateKey: privateKey,
        }),
    });
}

// 4. Export the specific instances
const adminDb = admin.firestore();
const adminAuth = admin.auth();

export { adminDb, adminAuth };