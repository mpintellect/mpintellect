// lib/firebaseClient.ts
import { initializeApp, getApps, FirebaseApp } from "firebase/app";
import { getAuth, Auth } from "firebase/auth";
import { getFirestore, Firestore } from "firebase/firestore";
import { getDatabase, Database } from "firebase/database";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Initialize only in browser with valid config
let app: FirebaseApp | null = null;
let auth: Auth | null = null;
let db: Firestore | null = null;
let rtdb: Database | null = null;

if (typeof window !== 'undefined') {
  const hasValidConfig = firebaseConfig.apiKey && 
                        firebaseConfig.authDomain && 
                        firebaseConfig.projectId;

  if (hasValidConfig) {
    try {
      if (getApps().length === 0) {
        app = initializeApp(firebaseConfig);
      } else {
        app = getApps()[0];
      }

      auth = getAuth(app);
      db = getFirestore(app);
      rtdb = getDatabase(app);
    } catch (error) {
      console.error('Firebase initialization error:', error);
    }
  } else {
    console.warn('Firebase config missing - skipping initialization');
  }
}

// Helper functions to ensure Firebase is initialized
function getAuthInstance(): Auth {
  if (!auth) {
    throw new Error('Firebase Auth not initialized. Check your environment variables.');
  }
  return auth;
}

function getDbInstance(): Firestore {
  if (!db) {
    throw new Error('Firestore not initialized. Check your environment variables.');
  }
  return db;
}

export { auth, db, rtdb, getAuthInstance, getDbInstance };