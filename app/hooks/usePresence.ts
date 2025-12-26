"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { ref, onValue, set, onDisconnect, serverTimestamp } from "firebase/database";
import { auth, rtdb } from "@/app/lib/firebaseClient";
import { onAuthStateChanged } from "firebase/auth";

export default function usePresence() {
  const pathname = usePathname();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) return;

      // References in Realtime DB
      const userStatusRef = ref(rtdb, `/status/${user.uid}`);
      const connectedRef = ref(rtdb, ".info/connected");

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
  }, [pathname]); // Re-run when they change pages
}