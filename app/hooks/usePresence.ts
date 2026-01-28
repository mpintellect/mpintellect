"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { ref, onValue, set, onDisconnect, serverTimestamp } from "firebase/database";
import { onAuthStateChanged } from "firebase/auth";
import { getAuthInstance, getRTDBInstance } from "@/app/lib/firebaseClient";

export default function usePresence() {
  const pathname = usePathname();

  useEffect(() => {
    try {
      // Use the getter functions that guarantee non-null instances
      const authInstance = getAuthInstance();
      const rtdbInstance = getRTDBInstance();

      const unsubscribe = onAuthStateChanged(authInstance, (user) => {
        if (!user) return;

        // References in Realtime DB
        const userStatusRef = ref(rtdbInstance, `/status/${user.uid}`);
        const connectedRef = ref(rtdbInstance, ".info/connected");

        onValue(connectedRef, (snapshot) => {
          if (snapshot.val() === false) {
            return;
          }

          // If connected, set status to ONLINE
          // onDisconnect().set() ensures that if they close the tab, it turns to OFFLINE automatically
          onDisconnect(userStatusRef)
            .set({
              state: "offline",
              last_changed: serverTimestamp(),
              email: user.email,
            })
            .then(() => {
              set(userStatusRef, {
                state: "online",
                current_page: pathname, // 🕵️‍♂️ TRACKS WHAT TOOL THEY USE
                email: user.email,
                last_changed: serverTimestamp(),
              });
            });
        });
      });

      return () => unsubscribe();
    } catch (error) {
      console.error("Firebase initialization error in usePresence:", error);
      // Don't crash the app, just log the error
      // This might happen during development if Firebase config is missing
    }
  }, [pathname]); // Re-run when they change pages
}