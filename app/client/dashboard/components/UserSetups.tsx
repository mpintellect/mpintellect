// /app/client/Dashboard/components/UserSetups.tsx

"use client";

import { useEffect, useState } from "react";
import { useUser } from "../../../hooks/useUser";

// ✅ Firestore imports
import {
  collection,
  query,
  where,
  orderBy,
  limit,
  getDocs,
} from "firebase/firestore";
import { db } from "@/app/lib/firebaseClient";

interface Setup {
  id: string;
  symbol: string;
  entryPrice: number;
  takeProfit: number;
  stopLoss: number;
  generatedAt: string;
  status: string;
}

export default function UserSetups() {
  const { user } = useUser();
  const [setups, setSetups] = useState<Setup[]>([]);
  const [loading, setLoading] = useState(true);

  // =============================
  //   FETCH USER SETUPS
  // =============================
  useEffect(() => {
    async function fetchSetups() {
      if (!user?.uid) {
        setLoading(false);
        return;
      }

      try {
        const q = query(
          collection(db, "setups"),
          where("userId", "==", user.uid),
          orderBy("createdAt", "desc"),
          limit(20)
        );

        const querySnapshot = await getDocs(q);

        const fetchedSetups: Setup[] = querySnapshot.docs.map((docSnap) => {
          const data = docSnap.data() as Omit<Setup, "id">;

          return {
            id: docSnap.id,
            ...data,
          };
        });

        setSetups(fetchedSetups);
      } catch (error) {
        console.error("🔥 Error fetching setups:", error);
      }

      setLoading(false);
    }

    fetchSetups();
  }, [user?.uid]);

  // =============================
  //   UI SECTION
  // =============================
  if (loading)
    return <p className="text-center text-sm text-gray-400">Loading setups...</p>;

  if (setups.length === 0)
    return (
      <p className="text-center text-sm text-gray-400">
        No setups found yet.
      </p>
    );

  return (
    <div className="setup-history mt-6 p-4 rounded-lg bg-[#1b1b1b]">
      <h3 className="text-lg font-semibold text-white mb-4">
        📈 My Trade Setups
      </h3>

      <div className="overflow-x-auto">
        <table className="min-w-full text-sm text-left">
          <thead className="border-b border-gray-600 text-gray-300">
            <tr>
              <th className="px-2 py-1">Symbol</th>
              <th className="px-2 py-1">Entry</th>
              <th className="px-2 py-1">TP</th>
              <th className="px-2 py-1">SL</th>
              <th className="px-2 py-1">Date</th>
              <th className="px-2 py-1">Status</th>
            </tr>
          </thead>

          <tbody>
            {setups.map((s) => (
              <tr key={s.id} className="border-b border-gray-800 text-white">
                <td className="px-2 py-1 font-medium">{s.symbol}</td>
                <td className="px-2 py-1">{s.entryPrice}</td>
                <td className="px-2 py-1">{s.takeProfit}</td>
                <td className="px-2 py-1">{s.stopLoss}</td>
                <td className="px-2 py-1">
                  {new Date(s.generatedAt).toLocaleString()}
                </td>
                <td className="px-2 py-1 text-xs">
                  {s.status === "pending" && (
                    <span className="bg-yellow-700 px-2 py-1 rounded">
                      Pending
                    </span>
                  )}
                  {s.status === "hit_tp" && (
                    <span className="bg-green-700 px-2 py-1 rounded">
                      Hit TP
                    </span>
                  )}
                  {s.status === "hit_sl" && (
                    <span className="bg-red-700 px-2 py-1 rounded">Hit SL</span>
                  )}
                  {s.status !== "pending" &&
                    s.status !== "hit_tp" &&
                    s.status !== "hit_sl" && <span>—</span>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}