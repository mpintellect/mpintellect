// lib/firebase.ts
import { initializeApp, getApps } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCzDwXsMJUgyu1z1VPgViBKwZga0chpHgU",
  authDomain: "mzprimer-livefeed.firebaseapp.com",
  projectId: "mzprimer-livefeed",
  storageBucket: "mzprimer-livefeed.firebasestorage.app",
  messagingSenderId: "195204575766",
  appId: "1:195204575766:web:a5ffcbb29c0336bda6bb37",
  measurementId: "G-Y27R5QMCLZ"
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

const db = getFirestore(app);

export { db };