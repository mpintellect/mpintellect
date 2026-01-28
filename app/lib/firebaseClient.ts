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
let _auth: Auth | null = null;
let _db: Firestore | null = null;
let _rtdb: Database | null = null;

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

      _auth = getAuth(app);
      _db = getFirestore(app);
      _rtdb = getDatabase(app);
    } catch (error) {
      console.error('Firebase initialization error:', error);
    }
  } else {
    console.warn('Firebase config missing - skipping initialization');
  }
}

// Helper functions that throw if not initialized (for build-time safety)
function getAuthInstance(): Auth {
  if (!_auth) {
    throw new Error('Firebase Auth not initialized. Check your environment variables.');
  }
  return _auth;
}

function getDbInstance(): Firestore {
  if (!_db) {
    throw new Error('Firestore not initialized. Check your environment variables.');
  }
  return _db;
}

// ADDED: Helper function for Realtime Database
function getRTDBInstance(): Database {
  if (!_rtdb) {
    throw new Error('Firebase Realtime Database not initialized. Check your environment variables.');
  }
  return _rtdb;
}

// Safe exports that can be null (for runtime use)
const auth = _auth;
const db = _db;
const rtdb = _rtdb;

export { auth, db, rtdb, getAuthInstance, getDbInstance, getRTDBInstance };