"use client";

import { useMemo, useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { useMarketSignals, type MarketSignal } from "@/app/hooks/useMarketSignals";
import { useSession } from "@/app/hooks/useSession";

function formatSymbol(symbol: string) {
  return symbol.length === 6 ? `${symbol.slice(0, 3)}/${symbol.slice(3)}` : symbol;
}

function priceDecimals(symbol: string) {
  return symbol === "XAUUSD" || symbol === "BRENT" ? 2 : 4;
}

const SPARK_W = 100;
const SPARK_H = 40;

// Decorative sparkline shape only, not literal tick data - a stylized
// preview, not a live feed. Direction-consistent with the real signal so it
// never visually contradicts the real price/action shown next to it.
function buildSparklinePath(seed: number, trendUp: boolean) {
  const points = 16;
  const raw: number[] = [];
  for (let i = 0; i < points; i++) {
    const noise = Math.sin(seed + i * 1.7) * 5 + Math.sin(seed * 3 + i) * 3;
    const drift = (trendUp ? 1 : -1) * (i / (points - 1)) * 20;
    raw.push(50 + drift + noise);
  }
  const max = Math.max(...raw);
  const min = Math.min(...raw);
  const range = max - min || 1;
  const stepX = SPARK_W / (points - 1);
  const coords = raw.map((v, i) => [i * stepX, SPARK_H - ((v - min) / range) * SPARK_H]);

  let line = `M ${coords[0][0]},${coords[0][1]}`;
  for (let i = 1; i < coords.length; i++) {
    const [x0, y0] = coords[i - 1];
    const [x1, y1] = coords[i];
    line += ` Q ${x0},${y0} ${(x0 + x1) / 2},${(y0 + y1) / 2}`;
  }
  return line;
}

function FeedRow({ signal }: { signal: MarketSignal }) {
  const isBuy = signal.action === "BUY";
  return (
    <div className="flex items-center justify-between gap-3 py-2">
      <span className="w-16 shrink-0 text-xs font-semibold text-[#1E3A5F]">
        {formatSymbol(signal.symbol)}
      </span>
      <span className={`shrink-0 text-xs font-bold ${isBuy ? "text-emerald-600" : "text-red-500"}`}>
        {isBuy ? "▲ BUY" : "▼ SELL"}
      </span>
      <span className="flex-1 text-right text-xs font-medium text-[#1E3A5F]">
        {signal.current_price.toFixed(priceDecimals(signal.symbol))}
      </span>
      <span className="w-12 shrink-0 text-right text-[11px] text-[#6B7280]">
        {signal.confidence}%
      </span>
    </div>
  );
}

function SignalFeed({ signals }: { signals: MarketSignal[] }) {
  if (signals.length === 0) {
    return (
      <div className="space-y-2 px-4 py-2">
        <div className="h-7 w-full animate-pulse rounded bg-slate-100" />
        <div className="h-7 w-full animate-pulse rounded bg-slate-100" />
        <div className="h-7 w-full animate-pulse rounded bg-slate-100" />
      </div>
    );
  }

  // Pure-CSS vertical marquee (same translate-loop technique as
  // LiveMarketFeed's ticker) rather than a JS interval swapping which rows
  // are visible - no re-render of this panel needed to keep it "live".
  const duplicated = [...signals, ...signals];
  const duration = Math.max(signals.length * 2.6, 6);

  return (
    <div className="hero-mc-feed-viewport px-4">
      <div
        className="hero-mc-feed-track divide-y divide-slate-100"
        style={{ animationDuration: `${duration}s` }}
      >
        {duplicated.map((s, i) => (
          <FeedRow key={`${s.symbol}-${i}`} signal={s} />
        ))}
      </div>
    </div>
  );
}

export default function HeroMissionControl() {
  const signals = useMarketSignals();
  const { sessionName, isWeekend } = useSession();
  const containerRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });
  const parallaxY = useTransform(scrollYProgress, [0, 1], [30, -50]);
  const parallaxScale = useTransform(scrollYProgress, [0, 0.5, 1], [0.96, 1, 0.92]);

  const avgConfidence = useMemo(() => {
    if (!signals.length) return null;
    return Math.round(signals.reduce((sum, s) => sum + s.confidence, 0) / signals.length);
  }, [signals]);

  const topSignal = useMemo(() => {
    if (!signals.length) return null;
    return signals.reduce((best, s) => (s.confidence > best.confidence ? s : best), signals[0]);
  }, [signals]);

  const topSparkline = useMemo(() => {
    if (!topSignal) return null;
    return buildSparklinePath(7, topSignal.action === "BUY");
  }, [topSignal]);

  return (
    <motion.div
      ref={containerRef}
      style={prefersReducedMotion ? undefined : { y: parallaxY, scale: parallaxScale }}
      initial={{ opacity: 0, scale: 0.94 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.8, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -4 }}
      className="mx-auto w-full max-w-md overflow-hidden rounded-3xl border border-white/60 bg-white/90 shadow-[0_20px_60px_rgba(30,58,95,0.18)] backdrop-blur-xl"
    >
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-100 bg-[#EFF6FF]/60 px-4 py-3">
        <div className="flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            {!prefersReducedMotion && (
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#10B981] opacity-75" />
            )}
            <span className="relative inline-flex h-2 w-2 rounded-full bg-[#10B981]" />
          </span>
          <span className="text-xs font-bold uppercase tracking-wider text-[#1E3A5F]">
            AI Mission Control
          </span>
        </div>
        <span className="text-[11px] font-semibold uppercase tracking-wide text-[#6B7280]">
          {isWeekend ? "Markets Closed" : `${sessionName} Session`}
        </span>
      </div>

      {/* Live signal feed */}
      <SignalFeed signals={signals} />

      {/* Stat tiles */}
      <div className="grid grid-cols-3 gap-px border-y border-slate-100 bg-slate-100">
        <div className="bg-white/95 px-3 py-3 text-center">
          <div className="text-xl font-bold text-[#1E3A5F]">
            {signals.length || "—"}
          </div>
          <div className="mt-0.5 text-[10px] font-medium uppercase tracking-wide text-[#6B7280]">
            Live Pairs
          </div>
        </div>
        <div className="bg-white/95 px-3 py-3 text-center">
          <div className="text-xl font-bold text-[#3B82F6]">
            {avgConfidence !== null ? `${avgConfidence}%` : "—"}
          </div>
          <div className="mt-0.5 text-[10px] font-medium uppercase tracking-wide text-[#6B7280]">
            Avg Confidence
          </div>
        </div>
        <div className="flex flex-col items-center justify-center bg-white/95 px-2 py-2">
          {topSignal && topSparkline ? (
            <>
              <svg viewBox={`0 0 ${SPARK_W} ${SPARK_H}`} width="56" height="24" preserveAspectRatio="none" aria-hidden>
                <path
                  d={topSparkline}
                  fill="none"
                  stroke={topSignal.action === "BUY" ? "#10B981" : "#EF4444"}
                  strokeWidth={2.5}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <div className="mt-0.5 text-[10px] font-medium uppercase tracking-wide text-[#6B7280]">
                Top: {formatSymbol(topSignal.symbol)}
              </div>
            </>
          ) : (
            <div className="h-6 w-14 animate-pulse rounded bg-slate-100" />
          )}
        </div>
      </div>

      {/* Scanning indicator */}
      <div className="flex items-center gap-2 px-4 py-2.5">
        <div className="hero-mc-scan-bar relative h-1 flex-1 overflow-hidden rounded-full bg-slate-100">
          <div className="absolute inset-y-0 left-0 w-1/3 rounded-full bg-[#3B82F6]/40" />
        </div>
        <span className="shrink-0 text-[10px] font-medium text-[#6B7280]">Scanning markets…</span>
      </div>
    </motion.div>
  );
}
