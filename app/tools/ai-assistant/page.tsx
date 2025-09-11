// app/tools/ai-assistant/page.tsx
import { Suspense } from "react";
import type { Metadata } from "next";
import TraderAssistantLite from "../../../components/TraderAssistantLite";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata: Metadata = {
  title: "AI Trader Assistant – MZPrimer",
  description:
    "Beginner-friendly assistant: choose symbol, lot, leverage & style. Get SL/TP, margin and a simulated M5 candle path.",
};

export default function Page() {
  return (
    <main className="ta-page">
      <div className="ta-container">

        {/* Wrap client component that uses useSearchParams */}
        <Suspense fallback={<div className="ta-loading">Loading…</div>}>
          <TraderAssistantLite />
        </Suspense>
      </div>
    </main>
  );
}