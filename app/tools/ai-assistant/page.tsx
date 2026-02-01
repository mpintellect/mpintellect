import { Suspense } from "react";
import type { Metadata } from "next";
import TraderAssistantLite from "../../../components/TraderAssistantLite";

// CHANGE: Remove dynamic, make it static
// export const dynamic = "force-dynamic"; // ❌ REMOVE THIS
// export const revalidate = 0; // ❌ REMOVE THIS

// ADD: Make it static
export const dynamic = "force-static";

export const metadata: Metadata = {
  title: "AI Trader Assistant – MZPrimer",
  description:
    "Beginner-friendly assistant: choose symbol, lot, leverage & style. Get SL/TP, margin and a simulated M5 candle path.",
};

export default function Page() {
  return (
    <main className="ta-page">
      <div className="ta-container">
        <Suspense fallback={<div className="ta-loading">Loading…</div>}>
          <TraderAssistantLite />
        </Suspense>
      </div>
    </main>
  );
}