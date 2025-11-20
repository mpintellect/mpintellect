// hooks/useUser.ts
import { useEffect, useState } from "react";
import { onAuthStateChanged, User } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../../app/lib/firebaseClient";

interface UserData {
  userId: string;
  setupCount: number;
  user: User | null;
  isLoading: boolean;
}

export function useUser(): UserData {
  const [userId, setUserId] = useState<string>("");
  const [setupCount, setSetupCount] = useState<number>(0);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setIsLoading(true);
      
      if (firebaseUser) {
        // ✅ Firebase authenticated user
        setUser(firebaseUser);
        setUserId(firebaseUser.uid);
        
        try {
          // Fetch setupCount from Firestore
          const userDoc = await getDoc(doc(db, "users", firebaseUser.uid));
          if (userDoc.exists()) {
            const userData = userDoc.data();
            setSetupCount(userData.setupCount || 0);
          } else {
            setSetupCount(0);
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
          setSetupCount(0);
        }
      } else {
        // ✅ Guest user - use localStorage UUID
        setUser(null);
        let guestId = localStorage.getItem("mz_user_id");
        if (!guestId) {
          guestId = `guest_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
          localStorage.setItem("mz_user_id", guestId);
        }
        setUserId(guestId);
        setSetupCount(0); // Guest users have 0 setupCount
      }
      
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return { userId, setupCount, user, isLoading };
}