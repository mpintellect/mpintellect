// components/LiveChartsTerminal.tsx
// A new, standalone product — separate from AiChatBox/PropFirmChat, not
// touching either. Consumes the same raw signal data (via the existing
// functions/api/setup.ts proxy to data.mpintellect.com) but presents it as
// a live annotated chart instead of a conversation: candlestick + pivot/
// entry/SL/TP lines + a forward prediction path for Day Trader (H1), and a
// structured factor/strengths/weaknesses signal panel for both strategies
// (Scalper's output_*.json has no candle history, so it gets the panel only).
"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { Search, ChevronDown, RefreshCw } from "lucide-react";
import {
  createChart,
  IChartApi,
  CandlestickSeries,
  Time,
} from "lightweight-charts";
import { useUser } from "@/app/hooks/useUser";
import { useOneSetup } from "@/app/hooks/useOneSetup";
import { useMarketSignals, type MarketSignal } from "@/app/hooks/useMarketSignals";

// ==========================================
// SYMBOL CONFIGURATION — kept local/duplicated on purpose (not imported
// from AiChatBox.tsx) so this product can evolve independently.
// ==========================================
const ALL_SYMBOLS = [
  "EURUSD", "GBPUSD", "USDJPY", "USDCAD", "AUDUSD",
  "NZDUSD", "USDCHF", "XAUUSD", "XAUEUR", "XAGUSD",
  "PLATINUM", "BRENT", "BTCUSD", "ETHUSD", "XRPUSD",
  "DOGEUSD", "LTCUSD", "US500", "USTEC", "US30",
  "HK50", "FRANCE40", "CHINA50", "UK100", "EURJPY",
  "EURGBP", "GBPJPY", "GBPCHF",
] as const;
type SymbolKey = typeof ALL_SYMBOLS[number];

const SYMBOL_GROUPS: { label: string; symbols: SymbolKey[] }[] = [
  { label: "Forex", symbols: ["EURUSD", "GBPUSD", "USDJPY", "USDCAD", "AUDUSD", "NZDUSD", "USDCHF", "EURJPY", "EURGBP", "GBPJPY", "GBPCHF"] },
  { label: "Metals & Energy", symbols: ["XAUUSD", "XAUEUR", "XAGUSD", "PLATINUM", "BRENT"] },
  { label: "Crypto", symbols: ["BTCUSD", "ETHUSD", "XRPUSD", "LTCUSD", "DOGEUSD"] },
  { label: "Indices", symbols: ["US500", "USTEC", "US30", "HK50", "FRANCE40", "CHINA50", "UK100"] },
];

const SYMBOL_NAMES: Record<string, string> = {
  EURUSD: "Euro / US Dollar", GBPUSD: "British Pound / US Dollar", USDJPY: "US Dollar / Japanese Yen",
  USDCAD: "US Dollar / Canadian Dollar", AUDUSD: "Australian Dollar / US Dollar", NZDUSD: "New Zealand Dollar / US Dollar",
  USDCHF: "US Dollar / Swiss Franc", EURJPY: "Euro / Japanese Yen", EURGBP: "Euro / British Pound",
  GBPJPY: "British Pound / Japanese Yen", GBPCHF: "British Pound / Swiss Franc", XAUUSD: "Gold / US Dollar",
  XAUEUR: "Gold / Euro", XAGUSD: "Silver / US Dollar", PLATINUM: "Platinum / US Dollar", BRENT: "Brent Crude Oil",
  BTCUSD: "Bitcoin / US Dollar", ETHUSD: "Ethereum / US Dollar", XRPUSD: "Ripple / US Dollar",
  LTCUSD: "Litecoin / US Dollar", DOGEUSD: "Dogecoin / US Dollar", US500: "S&P 500", USTEC: "Nasdaq 100",
  US30: "Dow Jones 30", HK50: "Hong Kong 50", FRANCE40: "France 40", CHINA50: "China 50", UK100: "FTSE 100",
};

const SYMBOL_SPECS: Record<string, { pip: number; contract: number; decimals: number }> = {
  EURUSD: { pip: 0.0001, contract: 100000, decimals: 5 }, GBPUSD: { pip: 0.0001, contract: 100000, decimals: 5 },
  USDJPY: { pip: 0.01, contract: 100000, decimals: 3 }, USDCAD: { pip: 0.0001, contract: 100000, decimals: 5 },
  AUDUSD: { pip: 0.0001, contract: 100000, decimals: 5 }, NZDUSD: { pip: 0.0001, contract: 100000, decimals: 5 },
  USDCHF: { pip: 0.0001, contract: 100000, decimals: 5 }, EURJPY: { pip: 0.01, contract: 100000, decimals: 3 },
  EURGBP: { pip: 0.0001, contract: 100000, decimals: 5 }, GBPJPY: { pip: 0.01, contract: 100000, decimals: 3 },
  GBPCHF: { pip: 0.0001, contract: 100000, decimals: 5 }, XAUUSD: { pip: 0.01, contract: 100, decimals: 2 },
  XAUEUR: { pip: 0.01, contract: 100, decimals: 2 }, XAGUSD: { pip: 0.001, contract: 5000, decimals: 3 },
  PLATINUM: { pip: 0.01, contract: 100, decimals: 2 }, BRENT: { pip: 0.01, contract: 1000, decimals: 2 },
  BTCUSD: { pip: 1.0, contract: 1, decimals: 1 }, ETHUSD: { pip: 0.1, contract: 1, decimals: 2 },
  XRPUSD: { pip: 0.0001, contract: 1000, decimals: 4 }, LTCUSD: { pip: 0.01, contract: 10, decimals: 2 },
  DOGEUSD: { pip: 0.0001, contract: 1000, decimals: 4 }, US500: { pip: 0.1, contract: 1, decimals: 2 },
  USTEC: { pip: 0.1, contract: 1, decimals: 2 }, US30: { pip: 1.0, contract: 1, decimals: 1 },
  HK50: { pip: 0.1, contract: 1, decimals: 2 }, FRANCE40: { pip: 0.1, contract: 1, decimals: 2 },
  CHINA50: { pip: 0.1, contract: 1, decimals: 1 }, UK100: { pip: 0.1, contract: 1, decimals: 1 },
};

type Strategy = "scalper" | "daytrader";
const STRATEGIES: { id: Strategy; label: string; badge: string; icon: string }[] = [
  { id: "scalper", label: "Scalper", badge: "5min", icon: "⚡" },
  { id: "daytrader", label: "Day Trader", badge: "H1", icon: "🏛️" },
];
const RISK_PRESETS = [0.5, 1, 2, 3, 5];
const CAPITAL_PRESETS = [500, 1000, 5000, 10000, 25000];

// Own dedicated trial counter — separate product, separate pool, same
// pattern PropFirmChat already established for its own counter.
const FREE_TRIAL_LIMIT = process.env.NODE_ENV === "production" ? 2 : 500;
const TRIAL_KEY = "MZP_CHART_TRIAL_COUNT";
const getTrialCount = (): number => {
  if (typeof window === "undefined") return 0;
  return parseInt(localStorage.getItem(TRIAL_KEY) || "0");
};
const incrementTrialCount = (): number => {
  const next = getTrialCount() + 1;
  localStorage.setItem(TRIAL_KEY, next.toString());
  return next;
};

function priceDecimals(symbol: string) {
  return SYMBOL_SPECS[symbol]?.decimals ?? 5;
}
function fmt(num: number | undefined | null, decimals = 4) {
  if (num === undefined || num === null || Number.isNaN(num)) return "—";
  return num.toFixed(decimals);
}

// ==========================================
// MODALS — same visual language/flow as AiChatBox's, kept as local copies
// (this file's own product, deliberately not sharing state with it).
// ==========================================
function QuickRegisterModal({
  onClose, onSuccess, selectedPlan,
}: { onClose: () => void; onSuccess: (data: any, plan: string) => void; selectedPlan: string }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!email || !password || !confirmPassword) { setError("Please fill in all fields"); return; }
    if (password !== confirmPassword) { setError("Passwords do not match"); return; }
    if (password.length < 6) { setError("Password must be at least 6 characters"); return; }
    setLoading(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, displayName: email.split("@")[0] }),
      });
      const data = await res.json();
      if (data.success) {
        localStorage.setItem("cf_token", data.token);
        localStorage.setItem("cf_user", JSON.stringify(data.user));
        localStorage.removeItem(TRIAL_KEY);
        onSuccess(data, selectedPlan);
        onClose();
      } else {
        setError(data.error || "Registration failed. Please try again.");
      }
    } catch (err: any) {
      setError(err.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const modalContent = (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h3>🎯 Quick Registration</h3>
          <button onClick={onClose} className="close-modal">✕</button>
        </div>
        <form onSubmit={handleRegister} className="quick-register-form">
          <div className="form-group">
            <label>Email Address</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required disabled={loading} placeholder="your@email.com" />
          </div>
          <div className="form-group">
            <label>Password (min 6 characters)</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required disabled={loading} />
          </div>
          <div className="form-group">
            <label>Confirm Password</label>
            <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required disabled={loading} />
          </div>
          {error && <div className="error-message">{error}</div>}
          <div className="modal-actions">
            <button type="submit" disabled={loading} className="primary-btn">
              {loading ? "Creating Account..." : "Register & Continue to Payment"}
            </button>
            <button type="button" onClick={onClose} className="secondary-btn" disabled={loading}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
  return typeof document !== "undefined" ? createPortal(modalContent, document.body) : null;
}

function PricingPlansModal({
  onClose, onPlanSelect, onRegisterClick,
}: { onClose: () => void; onPlanSelect: (plan: string) => void; onRegisterClick: () => void }) {
  const plans = [
    { id: "10", name: "Basic Plan", setups: "10 Charts", price: "$5.00", popular: false },
    { id: "20", name: "Pro Plan", setups: "20 Charts", price: "$9.50", popular: true },
    { id: "30", name: "Elite Plan", setups: "30 Charts", price: "$15.00", popular: false },
  ];
  const modalContent = (
    <div className="modal-overlay">
      <div className="modal-content pricing-modal">
        <div className="modal-header">
          <h3>📊 Choose Your Chart Plan</h3>
          <p>Select a plan that fits your trading needs</p>
          <button onClick={onClose} className="close-modal">✕</button>
        </div>
        <div className="pricing-options">
          {plans.map((plan) => (
            <div key={plan.id} className={`pricing-card ${plan.popular ? "popular" : ""}`}>
              {plan.popular && <div className="popular-badge">MOST POPULAR</div>}
              <div className="plan-header"><h4>{plan.name}</h4><div className="setups-count">{plan.setups}</div></div>
              <div className="plan-price">{plan.price}</div>
              <button onClick={() => onPlanSelect(plan.id)} className="select-plan-btn">Select Plan</button>
            </div>
          ))}
        </div>
        <div className="pricing-footer">
          <div className="register-option">
            <h4>🔑 Create Account First</h4>
            <p>Register to get 1 free chart instantly</p>
            <button onClick={onRegisterClick} className="register-first-btn">Register Now (Get 1 Free)</button>
          </div>
        </div>
      </div>
    </div>
  );
  return typeof document !== "undefined" ? createPortal(modalContent, document.body) : null;
}

// ==========================================
// SYMBOL PICKER — same searchable/categorized/live-badge pattern as
// AiChatBox's, reimplemented locally (not exported there, and this file
// intentionally doesn't import from AiChatBox.tsx).
// ==========================================
function SymbolPicker({
  selected, onSelect, signals,
}: { selected: SymbolKey; onSelect: (s: SymbolKey) => void; signals: MarketSignal[] }) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const ref = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    if (!open) return;
    const onClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, [open]);

  const q = query.trim().toLowerCase();
  const groups = SYMBOL_GROUPS
    .map((g) => ({ ...g, symbols: g.symbols.filter((s) => !q || s.toLowerCase().includes(q) || SYMBOL_NAMES[s]?.toLowerCase().includes(q)) }))
    .filter((g) => g.symbols.length > 0);

  const pick = (s: SymbolKey) => { onSelect(s); setOpen(false); setQuery(""); };

  return (
    <div className="aichat-symbol-picker" ref={ref}>
      <button type="button" className="aichat-symbol-picker-trigger has-value" onClick={() => setOpen((o) => !o)}>
        <span className="aichat-symbol-picker-trigger-icon"><Search size={14} /></span>
        <span className="aichat-symbol-picker-trigger-text">
          <strong>{selected}</strong>
          <span className="aichat-symbol-picker-trigger-change">· change</span>
        </span>
        <motion.span animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2 }} className="aichat-symbol-picker-chevron">
          <ChevronDown size={16} />
        </motion.span>
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.98 }}
            transition={{ duration: prefersReducedMotion ? 0 : 0.16, ease: [0.22, 1, 0.36, 1] }}
            className="aichat-symbol-picker-panel"
          >
            <input autoFocus type="text" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search symbol or name…" className="aichat-symbol-picker-search" />
            <div className="aichat-symbol-picker-list">
              {groups.length === 0 && <div className="aichat-symbol-picker-empty">No matches</div>}
              {groups.map((g) => (
                <div key={g.label}>
                  <div className="aichat-symbol-picker-group-label">{g.label}</div>
                  {g.symbols.map((sym) => {
                    const live = signals.find((s) => s.symbol === sym);
                    const isBuy = live?.action === "BUY";
                    return (
                      <button type="button" key={sym} onClick={() => pick(sym)} className={`aichat-symbol-picker-row ${sym === selected ? "active" : ""}`}>
                        <span className="aichat-symbol-picker-row-text">
                          <span className="aichat-symbol-picker-row-sym">{sym}</span>
                          <span className="aichat-symbol-picker-row-name">{SYMBOL_NAMES[sym]}</span>
                        </span>
                        {live && <span className={`aichat-live-chip ${isBuy ? "buy" : "sell"}`}>{isBuy ? "▲" : "▼"} {live.confidence}%</span>}
                      </button>
                    );
                  })}
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ==========================================
// SIGNAL PANEL PIECES — factor score bars + strength/weakness tags, shared
// by both strategies since component_scores/risk_score/pending_orders are
// present in both output_*.json (scalper) and D1_output_*.json (day trader).
// ==========================================
function decisionColor(decision: string | undefined) {
  if (decision === "BUY") return "#10B981";
  if (decision === "SELL") return "#EF4444";
  return "#9CA3AF";
}

function FactorBars({ scores }: { scores: Record<string, number> }) {
  const labels: Record<string, string> = {
    trend: "Trend", volume: "Volume", zones: "Zones", volatility: "Volatility", momentum: "Momentum", sessions: "Session",
  };
  return (
    <div className="livechart-factor-grid">
      {Object.entries(scores).map(([key, val]) => (
        <div key={key} className="livechart-factor">
          <div className="livechart-factor-label">
            <span>{labels[key] || key}</span>
            <span>{Math.round(val)}%</span>
          </div>
          <div className="livechart-factor-track">
            <div
              className="livechart-factor-fill"
              style={{ width: `${Math.max(0, Math.min(100, val))}%`, background: val >= 70 ? "#10B981" : val >= 40 ? "#3B82F6" : "#9CA3AF" }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

function Tags({ items, kind }: { items: string[]; kind: "pos" | "neg" }) {
  if (!items?.length) return null;
  return (
    <div className="livechart-tag-row">
      {items.map((t, i) => (
        <span key={i} className={`livechart-tag ${kind}`}>{kind === "pos" ? "✓" : "!"} {t}</span>
      ))}
    </div>
  );
}

// ==========================================
// MAIN COMPONENT
// ==========================================
export default function LiveChartsTerminal() {
  const [symbol, setSymbol] = useState<SymbolKey>("XAUUSD");
  const [strategy, setStrategy] = useState<Strategy>("daytrader");
  const [capital, setCapital] = useState<number>(1000);
  const [riskPercent, setRiskPercent] = useState<number>(2);
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showSummary, setShowSummary] = useState(false);
  const [zoneRect, setZoneRect] = useState<{ top: number; left: number; width: number; height: number; direction: "up" | "down"; tp: number } | null>(null);

  const [trialCount, setTrialCount] = useState(0);
  const [showPricingModal, setShowPricingModal] = useState(false);
  const [showQuickRegister, setShowQuickRegister] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState("10");

  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);

  const { user, setupCount, loading: userLoading, refreshUser } = useUser();
  const { deductSetup } = useOneSetup();
  const signals = useMarketSignals();
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => setTrialCount(getTrialCount()), []);

  const creditsRemaining = user ? setupCount : Math.max(0, FREE_TRIAL_LIMIT - trialCount);

  const fetchData = async () => {
    if (!userLoading && creditsRemaining <= 0) {
      setShowPricingModal(true);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      if (user) {
        const result = await deductSetup();
        if (result !== "ok") { setShowPricingModal(true); setLoading(false); return; }
        await refreshUser();
      } else {
        setTrialCount(incrementTrialCount());
      }
      const res = await fetch(`/api/setup?symbol=${symbol}&strategy=${strategy}`);
      if (!res.ok) throw new Error(`Failed to fetch chart data (${res.status})`);
      const json = await res.json();
      setData(json);
    } catch (err: any) {
      setError(err.message || "Something went wrong fetching this chart.");
    } finally {
      setLoading(false);
    }
  };

  const handlePlanSelect = async (plan: string) => {
    setSelectedPlan(plan);
    if (user) {
      const res = await fetch("/api/checkout/create-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user.id, plan, email: user.email }),
      });
      const json = await res.json();
      if (json.url) window.location.href = json.url;
    } else {
      setShowPricingModal(false);
      setShowQuickRegister(true);
    }
  };

  const handleRegisterSuccess = async (regData: any, plan: string) => {
    setShowQuickRegister(false);
    setTrialCount(0);
    await refreshUser();
    const res = await fetch("/api/checkout/create-session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: regData.user.id, plan, email: regData.user.email }),
    });
    const json = await res.json();
    if (json.url) window.location.href = json.url;
  };

  // ---- Position sizing (client-side, mirrors backend pip/contract specs)
  const order = data?.pending_orders?.primary_order || data?.trade_parameters?.primary_validated_order?.original_order || null;
  const spec = SYMBOL_SPECS[symbol] || { pip: 0.0001, contract: 100000, decimals: 5 };
  let lotSize = 0, riskAmount = 0, rewardAmount = 0, rrRatio = 0;
  if (order?.entry_price && order?.sl_price) {
    const riskPerLot = Math.abs(order.entry_price - order.sl_price) * spec.contract;
    const maxRisk = capital * (riskPercent / 100);
    lotSize = Math.max(0.01, Math.min(50, parseFloat((maxRisk / riskPerLot).toFixed(2))));
    riskAmount = riskPerLot * lotSize;
    if (order.tp_price) {
      const rewardPerLot = Math.abs(order.tp_price - order.entry_price) * spec.contract;
      rewardAmount = rewardPerLot * lotSize;
      rrRatio = rewardPerLot / riskPerLot;
    }
  }

  // ---- Candlestick chart (Day Trader only — Scalper's payload has no candle history)
  useEffect(() => {
    if (!chartContainerRef.current || strategy !== "daytrader" || !data?.candles?.data?.length) {
      if (chartRef.current) { try { chartRef.current.remove(); } catch {} chartRef.current = null; }
      setZoneRect(null);
      return;
    }

    if (chartRef.current) { try { chartRef.current.remove(); } catch {} chartRef.current = null; }
    while (chartContainerRef.current.firstChild) chartContainerRef.current.removeChild(chartContainerRef.current.firstChild);

    // Only the most recent window is shown - the full ~120-candle H1
    // history made every candle a sliver once the forecast zone/prediction
    // path pushed the visible range out further. Fewer, wider candles read
    // like an actual trading-terminal chart instead of a compressed thumbnail.
    const VISIBLE_CANDLES = 55;
    const RIGHT_OFFSET_BARS = 12;
    const allCandles = data.candles.data.map((c: any) => ({ time: c.timestamp as Time, open: c.open, high: c.high, low: c.low, close: c.close }));
    const candles = allCandles.slice(-VISIBLE_CANDLES);
    if (!candles.length) return;

    const CHART_HEIGHT = 520;
    // barSpacing is what actually controls how many bars fit on screen -
    // confirmed via debug dump that setVisibleLogicalRange({from,to}) gets
    // silently overwritten (from drifted to -71..-83 instead of the
    // requested 0, repeatedly, even re-applied on every retry) while
    // rightOffset reliably pins the right edge. Deriving barSpacing from
    // the container width to fit exactly VISIBLE_CANDLES + the reserved
    // offset achieves the same "zoomed in" result through the option the
    // library actually respects, instead of fighting its own auto-fit.
    const plotWidth = Math.max(200, chartContainerRef.current.clientWidth - 80);
    const barSpacing = Math.max(4, plotWidth / (VISIBLE_CANDLES + RIGHT_OFFSET_BARS));
    const chart = createChart(chartContainerRef.current, {
      width: chartContainerRef.current.clientWidth,
      height: CHART_HEIGHT,
      layout: { background: { color: "#ffffff" }, textColor: "#475569", fontSize: 12 },
      grid: { vertLines: { color: "#F1F5F9", style: 0 }, horzLines: { color: "#F1F5F9", style: 0 } },
      crosshair: { mode: 0 },
      rightPriceScale: { borderColor: "#E5E7EB" },
      timeScale: { borderColor: "#E5E7EB", timeVisible: true, rightOffset: RIGHT_OFFSET_BARS, barSpacing },
      // Pan/zoom disabled - the forecast-zone overlay below is positioned
      // with computed pixel coordinates that only get recalculated on
      // resize, not on pan/scroll/pinch, so it would drift out of place
      // under free interaction. This chart is a fixed analytical snapshot
      // (refreshed via the button), not meant to be dragged around.
      handleScroll: false,
      handleScale: false,
    });

    const candleSeries = chart.addSeries(CandlestickSeries, {
      upColor: "#10B981", downColor: "#EF4444", borderVisible: false, wickUpColor: "#10B981", wickDownColor: "#EF4444",
    });
    candleSeries.setData(candles);

    const lastTime = candles[candles.length - 1].time as number;

    // Key levels drawn as native price lines (title + price both rendered
    // on the axis) instead of full-width line series - a real trading
    // platform look, and it avoids stacking multiple numeric axis tags on
    // top of each other when levels sit close together.
    const level = (value: number | undefined, color: string, title: string, width: 1 | 2 | 3 = 1, style = 2) => {
      if (!value) return;
      candleSeries.createPriceLine({ price: value, color, lineWidth: width, lineStyle: style, axisLabelVisible: true, title });
    };

    level(data.pivot?.level, "#D4AF37", "PIVOT", 2, 2);
    level(data.pivot?.resistance_1, "#EF4444", "R1", 1, 2);
    level(data.pivot?.support_1, "#10B981", "S1", 1, 2);
    level(data.chart?.zones?.poc, "#8B5CF6", "POC", 1, 3);
    level(data.chart?.current_price, "#3B82F6", "PRICE", 1, 2);
    if (order?.entry_price) level(order.entry_price, "#3B82F6", "ENTRY", 2, 0);
    if (order?.sl_price) level(order.sl_price, "#EF4444", "SL", 2, 0);
    if (order?.tp_price) level(order.tp_price, "#10B981", "TP", 2, 0);

    const stepSeconds = (data.candles.interval_minutes || 60) * 60;
    chartRef.current = chart;

    // Forecast zone (pivot -> TP) — same concept the Telegram chart uses
    // (functions/api/ads/render-chart.ts): the region price is expected to
    // move into, from the pivot level to the take-profit level. Previously
    // drawn as chart series (a filled band + a line crossing through it) -
    // that read as cluttered/"random dots" once the prediction line's
    // dotted style crossed the fill. Replaced entirely: nothing is drawn
    // inside the chart itself for this anymore. Instead it's a plain HTML/
    // CSS overlay positioned with the chart's own price/time->pixel
    // conversion, animated with a breathing glow + a floating price badge -
    // effects no canvas series can do, and it can't visually collide with
    // anything drawn on the chart since it's a separate layer on top.
    const tpForZone = order?.tp_price;
    const pivotLevel = data.pivot?.level;
    const lastBarIndex = candles.length - 1;

    // logicalToCoordinate (not timeToCoordinate) is required here -
    // timeToCoordinate only resolves times that belong to an actual data
    // point on some series, and nothing has a data point out at zoneEnd
    // any more now that the zone/prediction are no longer drawn as chart
    // series. Logical index math works purely off bar position, so it
    // resolves correctly into the blank space beyond the last real bar.
    // Retries a few times since the chart's width/scale can still settle
    // on the first frame after creation.
    const computeZoneRect = (attempt = 0) => {
      if (chartRef.current !== chart) return;
      if (!tpForZone || !pivotLevel || tpForZone === pivotLevel) { setZoneRect(null); return; }
      try {
        const yPivot = candleSeries.priceToCoordinate(pivotLevel);
        const yTp = candleSeries.priceToCoordinate(tpForZone);
        const xStart = chart.timeScale().logicalToCoordinate((lastBarIndex + 1) as any);
        const xEnd = chart.timeScale().logicalToCoordinate((lastBarIndex + (RIGHT_OFFSET_BARS - 2)) as any);
        if (yPivot == null || yTp == null || xStart == null || xEnd == null || xEnd <= xStart) {
          if (attempt < 20) setTimeout(() => computeZoneRect(attempt + 1), 50);
          else setZoneRect(null);
          return;
        }
        setZoneRect({
          top: Math.min(yPivot, yTp),
          height: Math.max(18, Math.abs(yTp - yPivot)),
          left: xStart,
          width: Math.max(30, xEnd - xStart),
          direction: tpForZone > pivotLevel ? "up" : "down",
          tp: tpForZone,
        });
      } catch {
        // Chart was disposed between the check above and this call - ignore.
      }
    };
    computeZoneRect();

    const onResize = () => {
      if (chartContainerRef.current && chartRef.current) {
        try { chartRef.current.applyOptions({ width: chartContainerRef.current.clientWidth }); } catch {}
      }
      if (chartRef.current) computeZoneRect();
    };
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("resize", onResize);
      if (chartRef.current) { try { chartRef.current.remove(); } catch {} chartRef.current = null; }
      setZoneRect(null);
    };
  }, [data, strategy]);

  const decision: string | undefined = data?.final_decision;
  const isDaytrader = strategy === "daytrader";
  const mtf = data?.mtf;
  const prediction = data?.prediction;
  const riskScore = data?.risk_score;

  // ---- Paywall
  if (!userLoading && creditsRemaining <= 0 && !data) {
    return (
      <div className="chatbox-wrapper section">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="license-header">
          <h3>🔐 LIVE CHARTS ACCESS</h3>
          <p>{user ? "You've used all your chart credits. Buy more to keep going." : `You've used all ${FREE_TRIAL_LIMIT} free trials. Register or buy charts to continue.`}</p>
        </motion.div>
        <div className="license-options">
          <div className="license-option">
            <div className="option-icon">📊</div>
            <h4>Buy Charts</h4>
            <p>Live annotated technical analysis, updated 24/7</p>
            <button type="button" onClick={() => setShowPricingModal(true)} className="btn-gold">View Plans</button>
          </div>
          {!user && (
            <div className="license-option">
              <div className="option-icon">🔑</div>
              <h4>Register</h4>
              <p>Create an account to get 1 free chart instantly</p>
              <button type="button" onClick={() => setShowQuickRegister(true)} className="btn-ghost-gold">Register Now</button>
            </div>
          )}
        </div>
        {showPricingModal && <PricingPlansModal onClose={() => setShowPricingModal(false)} onPlanSelect={handlePlanSelect} onRegisterClick={() => { setShowPricingModal(false); setShowQuickRegister(true); }} />}
        {showQuickRegister && <QuickRegisterModal onClose={() => setShowQuickRegister(false)} onSuccess={handleRegisterSuccess} selectedPlan={selectedPlan} />}
      </div>
    );
  }

  return (
    <div className="chatbox-wrapper section">
      <div className="chatbox-header">📊 LIVE CHARTS — AI INTEL TERMINAL</div>
      <div className="chatbox-body">
        {/* Credits */}
        <div className="ai-card" style={{ marginBottom: 16, padding: "12px 16px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 10 }}>
            <span style={{ color: "#3B82F6", fontWeight: 700, fontSize: 13 }}>💳 Credits remaining: {creditsRemaining}</span>
            <button onClick={() => setShowPricingModal(true)} className="btn-ghost-gold" style={{ padding: "6px 16px", fontSize: 11 }}>Buy More</button>
          </div>
        </div>

        {/* Controls */}
        <div className="ai-card" style={{ marginBottom: 16 }}>
          <div className="ai-card-title">CONTROLS</div>
          <div className="ai-card-content" style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap", alignItems: "center" }}>
              <SymbolPicker selected={symbol} onSelect={setSymbol} signals={signals} />
              <div className="livechart-strategy-toggle">
                {STRATEGIES.map((s) => (
                  <button key={s.id} type="button" onClick={() => setStrategy(s.id)} className={`livechart-strategy-btn ${strategy === s.id ? "active" : ""}`}>
                    <span>{s.icon}</span> {s.label} <span className="livechart-strategy-badge">{s.badge}</span>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <div style={{ fontSize: 11, color: "#6b7280", fontWeight: 700, marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.06em" }}>Capital (USD)</div>
              <div className="aichat-capital-presets" style={{ padding: 0 }}>
                {CAPITAL_PRESETS.map((amt) => (
                  <button key={amt} type="button" onClick={() => setCapital(amt)} className={`aichat-capital-chip ${capital === amt ? "active" : ""}`}>${amt.toLocaleString()}</button>
                ))}
              </div>
            </div>

            <div>
              <div style={{ fontSize: 11, color: "#6b7280", fontWeight: 700, marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.06em" }}>Risk per trade</div>
              <div className="aichat-capital-presets" style={{ padding: 0 }}>
                {RISK_PRESETS.map((r) => (
                  <button key={r} type="button" onClick={() => setRiskPercent(r)} className={`aichat-capital-chip ${riskPercent === r ? "active" : ""}`}>{r}%</button>
                ))}
              </div>
            </div>

            <button onClick={fetchData} disabled={loading} className="btn-gold" style={{ width: "100%", padding: 12 }}>
              {loading ? "Loading…" : data ? (<><RefreshCw size={14} style={{ display: "inline", marginRight: 6, verticalAlign: -2 }} />Refresh Chart</>) : "Load Chart"}
            </button>
          </div>
        </div>

        {loading && !data && (
          <div className="ai-card" style={{ textAlign: "center", padding: 40 }}>
            <span className="aichat-loading-spinner" aria-hidden />
            <div className="ai-card-content" style={{ marginTop: 10 }}>Fetching live signal data…</div>
          </div>
        )}

        {error && (
          <div className="ai-card" style={{ textAlign: "center", borderLeft: "3px solid #EF4444" }}>
            <div className="ai-card-content">
              <p style={{ color: "#EF4444", marginBottom: 12 }}>⚠️ {error}</p>
              <button onClick={fetchData} className="btn-gold">Try Again</button>
            </div>
          </div>
        )}

        {data && (
          <>
            {/* Decision + confluence + prediction badges */}
            <div className="livechart-badge-row">
              {decision && (
                <span className={`livechart-badge ${decision === "BUY" ? "buy" : decision === "SELL" ? "sell" : "neutral"}`}>
                  {decision === "BUY" ? "▲" : decision === "SELL" ? "▼" : "•"} {decision}
                  {typeof riskScore?.confidence_score === "number" && <> · {riskScore.confidence_score}%</>}
                </span>
              )}
              {data.quality_indicator && <span className="livechart-badge neutral">{data.quality_indicator}</span>}
              {isDaytrader && mtf && (
                <span className={`livechart-badge ${mtf.h4_alignment === "aligned" && mtf.d1_alignment === "aligned" ? "buy" : "neutral"}`}>
                  MTF: H4 {mtf.h4_alignment === "aligned" ? "✓" : "✗"} · D1 {mtf.d1_alignment === "aligned" ? "✓" : "✗"} · {mtf.confluence_score}% confluence
                </span>
              )}
              {isDaytrader && prediction && (
                <span className={`livechart-badge ${prediction.direction === "UP" ? "buy" : prediction.direction === "DOWN" ? "sell" : "neutral"}`}>
                  {prediction.timeframe_hours}h forecast: {prediction.direction} ({prediction.confidence}%)
                </span>
              )}
            </div>

            {/* Chart — Day Trader only */}
            {isDaytrader ? (
              data.candles?.data?.length ? (
                <div className="livechart-canvas-wrap">
                  <div ref={chartContainerRef} style={{ width: "100%", height: 520 }} />
                  {zoneRect && (
                    <div
                      className={`livechart-zone livechart-zone-${zoneRect.direction}`}
                      style={{ top: zoneRect.top, left: zoneRect.left, width: zoneRect.width, height: zoneRect.height }}
                    >
                      <span className="livechart-zone-badge">
                        {zoneRect.direction === "up" ? "▲" : "▼"} {zoneRect.tp.toFixed(priceDecimals(symbol))}
                      </span>
                    </div>
                  )}
                </div>
              ) : (
                <div className="ai-card" style={{ textAlign: "center", padding: 24 }}>
                  <div className="ai-card-content">No candle history returned for {symbol} — showing the signal panel below instead.</div>
                </div>
              )
            ) : (
              <div className="ai-card" style={{ textAlign: "center", padding: 20, marginBottom: 4 }}>
                <div className="ai-card-content" style={{ color: "#6b7280", fontSize: 12 }}>
                  ⚡ Scalper mode is a live 5-min snapshot (no chart history in this feed) — switch to Day Trader for the annotated candlestick chart.
                </div>
              </div>
            )}

            {/* Position sizing */}
            {order && (
              <div className="ai-card">
                <div className="ai-card-title">POSITION SIZING</div>
                <div className="position-sizing-grid">
                  <div className="position-card"><span className="label">Lot Size</span><div className="value">{lotSize.toFixed(2)}</div></div>
                  <div className="position-card"><span className="label">Risk Amount</span><div className="value" style={{ color: "#EF4444" }}>${riskAmount.toFixed(2)}</div></div>
                  <div className="position-card"><span className="label">Reward Amount</span><div className="value" style={{ color: "#10B981" }}>${rewardAmount.toFixed(2)}</div></div>
                  <div className="position-card"><span className="label">R/R Ratio</span><div className="value">{rrRatio.toFixed(2)}:1</div></div>
                </div>
              </div>
            )}

            {/* Pending order */}
            {order && (
              <div className="ai-card">
                <div className="ai-card-title">
                  {order.type} <span style={{ color: decisionColor(decision), fontWeight: 700 }}>· {order.rationale}</span>
                </div>
                <div className="ai-card-content" style={{ display: "flex", gap: 20, flexWrap: "wrap" }}>
                  <div>🎯 Entry <strong>{fmt(order.entry_price, priceDecimals(symbol))}</strong></div>
                  <div style={{ color: "#EF4444" }}>🛑 Stop <strong>{fmt(order.sl_price, priceDecimals(symbol))}</strong></div>
                  <div style={{ color: "#10B981" }}>🏁 Target <strong>{fmt(order.tp_price, priceDecimals(symbol))}</strong></div>
                  <div>⚖️ R:R <strong>{order.rr_ratio?.toFixed(2)}:1</strong></div>
                </div>
              </div>
            )}

            {/* Factor breakdown */}
            {data.component_scores && (
              <div className="ai-card">
                <div className="ai-card-title">FACTOR BREAKDOWN <span style={{ fontWeight: 400, color: "#6b7280", fontSize: 11 }}>· accuracy {data.analysis_accuracy?.toFixed?.(0)}%</span></div>
                <FactorBars scores={data.component_scores} />
              </div>
            )}

            {/* Risk score / strengths / weaknesses */}
            {riskScore && (
              <div className="ai-card">
                <div className="ai-card-title">{riskScore.recommendation}</div>
                <div className="ai-card-content" style={{ fontSize: 12, color: "#6b7280", marginBottom: 8 }}>
                  {riskScore.risk_category?.replace(/_/g, " ")} · max risk {riskScore.max_capital_risk_percent}% of capital
                </div>
                <Tags items={riskScore.strengths || []} kind="pos" />
                <Tags items={riskScore.weaknesses || []} kind="neg" />
              </div>
            )}

            {/* EMA / RSI / ATR — Day Trader only */}
            {isDaytrader && data.chart?.indicators && (
              <div className="indicators-grid">
                <div className="indicator-item"><span>EMA20</span><strong>{fmt(data.chart.indicators.ema_20, priceDecimals(symbol))}</strong></div>
                <div className="indicator-item"><span>EMA50</span><strong>{fmt(data.chart.indicators.ema_50, priceDecimals(symbol))}</strong></div>
                <div className="indicator-item"><span>EMA200</span><strong>{fmt(data.chart.indicators.ema_200, priceDecimals(symbol))}</strong></div>
                <div className="indicator-item"><span>RSI</span><strong style={{ color: data.chart.indicators.rsi > 70 ? "#EF4444" : data.chart.indicators.rsi < 30 ? "#10B981" : "#111827" }}>{data.chart.indicators.rsi?.toFixed(1)}</strong></div>
                <div className="indicator-item"><span>ATR</span><strong>{fmt(data.chart.indicators.atr, priceDecimals(symbol))}</strong></div>
              </div>
            )}

            {/* Full AI summary — collapsed by default */}
            {data.summary && (
              <div className="ai-details">
                <button type="button" className="ai-details-toggle" onClick={() => setShowSummary((o) => !o)} aria-expanded={showSummary}>
                  <span>📄 {showSummary ? "Hide" : "Show"} full AI summary</span>
                  <motion.span animate={{ rotate: showSummary ? 180 : 0 }} transition={{ duration: 0.2 }}><ChevronDown size={15} /></motion.span>
                </button>
                <AnimatePresence initial={false}>
                  {showSummary && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.25 }} className="ai-details-body">
                      <div className="ai-card" style={{ whiteSpace: "pre-wrap", fontSize: 12, lineHeight: 1.6 }}>{data.summary}</div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}
          </>
        )}

        {!data && !loading && !error && (
          <div className="ai-card" style={{ textAlign: "center", padding: "50px 20px" }}>
            <div className="ai-card-content">📊 Pick a symbol and strategy, then tap "Load Chart"</div>
          </div>
        )}
      </div>

      {showPricingModal && <PricingPlansModal onClose={() => setShowPricingModal(false)} onPlanSelect={handlePlanSelect} onRegisterClick={() => { setShowPricingModal(false); setShowQuickRegister(true); }} />}
      {showQuickRegister && <QuickRegisterModal onClose={() => setShowQuickRegister(false)} onSuccess={handleRegisterSuccess} selectedPlan={selectedPlan} />}
    </div>
  );
}
