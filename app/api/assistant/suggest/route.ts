// app/api/assistant/suggest/route.ts
import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// very simple heuristic "AI" you can later swap with a real model
export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const {
    symbol = "EURUSD",
    balance = 1000,
    riskR = 2.0,            // risk:reward ratio user picked
    style = "balanced",     // conservative | balanced | aggressive
    direction = "buy",      // buy | sell
    price = 1.085,
    lot = 0.1,
    leverage = 100
  } = body;

  // suggest SL pips by style
  const slByStyle = style === "conservative" ? 30 : style === "aggressive" ? 15 : 20;
  const rr = Math.max(1.2, Math.min(3.0, Number(riskR) || 2.0)); // clamp 1.2–3.0
  const tpPips = slByStyle * rr;

  // short rationale
  const rationale =
    style === "conservative"
      ? "Lower SL distance to protect capital; moderate TP for steady growth."
      : style === "aggressive"
      ? "Tighter SL for faster invalidation; stretch TP for higher R:R."
      : "Balanced SL/TP to keep win rate reasonable with ~2R targets.";

  // two simple scenario tracks (time 0..1)
  const makeTrack = (toward: "tp" | "sl") =>
    Array.from({ length: 21 }, (_, i) => {
      const t = i / 20; // 0..1
      const drift = toward === "tp" ? (0.6 * t) : (-0.6 * t);
      return { t, drift }; // UI turns this into price with entry +/-
    });

  return NextResponse.json({
    ok: true,
    suggested: {
      slPips: slByStyle,
      rr,
      tpPips,
    },
    rationale,
    scenarios: {
      withTrend:  { probability: style === "aggressive" ? 0.45 : 0.55, track: makeTrack("tp") },
      againstYou: { probability: style === "aggressive" ? 0.55 : 0.45, track: makeTrack("sl") },
    },
  });
}