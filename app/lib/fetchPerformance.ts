// lib/fetchPerformance.ts
import { doc, getDoc } from "firebase/firestore";
import { db } from "./firebase";

export type SymbolPerformance = {
  symbol: string;
  winRate: number;
  tp: number;
  sl: number;
  grade: string;
};

export type PerformanceSummary = {
  generatedAt: string;
  period: string;
  topPerformers: SymbolPerformance[];
  worstPerformers: SymbolPerformance[];
};

export async function fetchPerformanceSummary(): Promise<PerformanceSummary | null> {
  try {
    const docRef = doc(db, "performance_summary", "latest");
    const snapshot = await getDoc(docRef);

    if (!snapshot.exists()) {
      console.warn("⚠️ No performance summary found.");
      return null;
    }

    const data = snapshot.data();
    return {
      generatedAt: data.generatedAt,
      period: data.period,
      topPerformers: data.topPerformers,
      worstPerformers: data.worstPerformers,
    };
  } catch (error) {
    console.error("❌ Error fetching performance summary:", error);
    return null;
  }
}