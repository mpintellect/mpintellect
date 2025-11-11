// components/PerformanceTracker.tsx
"use client";

import { useEffect, useState } from "react";
import {
  fetchPerformanceSummary,
  PerformanceSummary,
} from "../app/lib/fetchPerformance";

export default function PerformanceTracker() {
  const [data, setData] = useState<PerformanceSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        console.log("🔄 PerformanceTracker: Starting fetch...");
        
        const summary = await fetchPerformanceSummary();
        console.log("✅ PerformanceTracker: Data received:", summary);
        setData(summary);
      } catch (err) {
        console.error("❌ PerformanceTracker: Fetch failed:", err);
        setError(err instanceof Error ? err.message : "Failed to load performance data");
        // Don't set any data - we want it to fail completely if fetch fails
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  // Show loading state
  if (loading) {
    return (
      <div className="performance-tracker-wrapper">
        <div className="scroll-section">
          <h3 className="scroll-title">📈 Loading Performance Data...</h3>
          <div className="scroll-track">
            <div className="scroll-loop">
              {[1, 2, 3].map(i => (
                <div key={i} className="scroll-card loading">
                  <div className="symbol-title">Loading...</div>
                  <div className="scroll-stats">Fetching live data...</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Show error state - no data will be shown
  if (error) {
    return (
      <div className="performance-tracker-wrapper">
        <div className="scroll-section">
          <h3 className="scroll-title text-red-500">❌ Failed to Load Live Data</h3>
          <div className="text-center text-gray-500 p-4">
            Error: {error}
            <br />
            <button 
              onClick={() => window.location.reload()} 
              className="mt-2 px-4 py-2 bg-blue-500 text-white rounded"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Only render if we have actual data from Google Storage
  if (!data) return null;

  const renderCard = (
    symbol: string,
    grade: string,
    winRate: number,
    tp: number,
    sl: number
  ) => (
    <div
      key={symbol + grade}
      className="scroll-card"
      onClick={(e) => {
        e.stopPropagation();
        const aiSection = document.getElementById("aiassistant");
        if (aiSection) {
          aiSection.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }}
    >
      <div className="symbol-title">
        {symbol} <span className="symbol-grade">({grade})</span>
      </div>
      <div className="scroll-stats">
        ✅ WIN RATE: {winRate.toFixed(1)}% | 🎯 TP: {tp} | ❌ SL: {sl}
      </div>
    </div>
  );

  return (
    <div className="performance-tracker-wrapper">
      <div className="scroll-section">
        <h3 className="scroll-title">📈 Top Performing Symbols</h3>
        <div className="scroll-track">
          <div className="scroll-loop">
            {[...data.topPerformers, ...data.topPerformers].map((s, i) =>
              renderCard(s.symbol, s.grade, s.winRate, s.tp, s.sl)
            )}
          </div>
        </div>
      </div>

      <div className="scroll-section">
        <h3 className="scroll-title">📉 Worst Performing Symbols</h3>
        <div className="scroll-track">
          <div className="scroll-loop">
            {[...data.worstPerformers, ...data.worstPerformers].map((s, i) =>
              renderCard(s.symbol, s.grade, s.winRate, s.tp, s.sl)
            )}
          </div>
        </div>
      </div>
    </div>
  );
}