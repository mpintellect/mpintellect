// hooks/useUser.ts

import { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";

export function useUser() {
  const [userId, setUserId] = useState<string>("");

  useEffect(() => {
    // Try to get user ID from localStorage
    let id = localStorage.getItem("mz_user_id");

    // If not found, create a new one
    if (!id) {
      id = uuidv4();
      localStorage.setItem("mz_user_id", id);
    }

    setUserId(id);
  }, []);

  return { userId };
}