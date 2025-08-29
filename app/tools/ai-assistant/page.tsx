// app/tools/ai-assistant/page.tsx
import type { Metadata } from "next";
import TraderAssistantLite from "../../../components/TraderAssistantLite";

export const metadata: Metadata = {
  title: "AI Trader Assistant – MZPrimer",
  description:
    "Beginner-friendly assistant: choose symbol, lot, leverage & style. Get SL/TP, margin and a simulated M5 candle path.",
};

export default function Page() {
  return (
    <main className="ta-page">
      <div className="ta-container">
        <header className="ta-header">
          <h1 className="ta-title">AI Trader Assistant MZ</h1>
          <p className="ta-subtitle">
  "AI-powered trading assistant: set your balance, symbol, leverage, and style to instantly calculate SL/TP levels, margin requirements, risk metrics, and view a simulated M5 price path — all in one clean, beginner-friendly tool."
          </p>
        </header>

        <TraderAssistantLite />
      </div>
    </main>
  );
}