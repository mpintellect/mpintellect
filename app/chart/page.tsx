// components/InstantChart.tsx
"use client";

import { useEffect, useState, useRef } from "react";
import { useUser } from "@/app/hooks/useUser";
import { useOneSetup } from "@/app/hooks/useOneSetup";
import {
  createChart,
  IChartApi,
  CandlestickSeries,
  LineSeries,
  Time,
} from "lightweight-charts";

// ==========================================
// SYMBOL CONFIGURATION
// ==========================================
const ALL_SYMBOLS = [
  "EURUSD", "GBPUSD", "USDJPY", "USDCAD", "AUDUSD",
  "NZDUSD", "USDCHF", "XAUUSD", "XAUEUR", "XAGUSD",
  "PLATINUM", "BRENT", "BTCUSD", "ETHUSD", "XRPUSD",
  "DOGEUSD", "LTCUSD", "US500", "USTEC", "US30",
  "HK50", "FRANCE40", "CHINA50", "UK100", "EURJPY",
  "EURGBP", "GBPJPY", "GBPCHF",
];

const SYMBOL_NAMES: Record<string, string> = {
  EURUSD: "Euro / US Dollar",
  GBPUSD: "British Pound / US Dollar",
  USDJPY: "US Dollar / Japanese Yen",
  USDCAD: "US Dollar / Canadian Dollar",
  AUDUSD: "Australian Dollar / US Dollar",
  NZDUSD: "New Zealand Dollar / US Dollar",
  USDCHF: "US Dollar / Swiss Franc",
  EURJPY: "Euro / Japanese Yen",
  EURGBP: "Euro / British Pound",
  GBPJPY: "British Pound / Japanese Yen",
  GBPCHF: "British Pound / Swiss Franc",
  XAUUSD: "Gold / US Dollar",
  XAUEUR: "Gold / Euro",
  XAGUSD: "Silver / US Dollar",
  PLATINUM: "Platinum / US Dollar",
  BRENT: "Brent Crude Oil",
  BTCUSD: "Bitcoin / US Dollar",
  ETHUSD: "Ethereum / US Dollar",
  XRPUSD: "Ripple / US Dollar",
  LTCUSD: "Litecoin / US Dollar",
  DOGEUSD: "Dogecoin / US Dollar",
  US500: "S&P 500",
  USTEC: "Nasdaq 100",
  US30: "Dow Jones 30",
  HK50: "Hong Kong 50",
  FRANCE40: "France 40",
  CHINA50: "China 50",
  UK100: "FTSE 100",
};

// ==========================================
// SYMBOL SPECS FOR LOT CALCULATION
// ==========================================
const SYMBOL_SPECS: Record<
  string,
  { pip: number; contract: number; decimals: number }
> = {
  EURUSD: { pip: 0.0001, contract: 100000, decimals: 5 },
  GBPUSD: { pip: 0.0001, contract: 100000, decimals: 5 },
  USDJPY: { pip: 0.01, contract: 100000, decimals: 3 },
  USDCAD: { pip: 0.0001, contract: 100000, decimals: 5 },
  AUDUSD: { pip: 0.0001, contract: 100000, decimals: 5 },
  NZDUSD: { pip: 0.0001, contract: 100000, decimals: 5 },
  USDCHF: { pip: 0.0001, contract: 100000, decimals: 5 },
  EURJPY: { pip: 0.01, contract: 100000, decimals: 3 },
  EURGBP: { pip: 0.0001, contract: 100000, decimals: 5 },
  GBPJPY: { pip: 0.01, contract: 100000, decimals: 3 },
  GBPCHF: { pip: 0.0001, contract: 100000, decimals: 5 },
  XAUUSD: { pip: 0.01, contract: 100, decimals: 2 },
  XAUEUR: { pip: 0.01, contract: 100, decimals: 2 },
  XAGUSD: { pip: 0.001, contract: 5000, decimals: 3 },
  PLATINUM: { pip: 0.01, contract: 100, decimals: 2 },
  BRENT: { pip: 0.01, contract: 1000, decimals: 2 },
  BTCUSD: { pip: 1.0, contract: 1, decimals: 1 },
  ETHUSD: { pip: 0.1, contract: 1, decimals: 2 },
  XRPUSD: { pip: 0.0001, contract: 1000, decimals: 4 },
  LTCUSD: { pip: 0.01, contract: 10, decimals: 2 },
  DOGEUSD: { pip: 0.0001, contract: 1000, decimals: 4 },
  US500: { pip: 0.1, contract: 1, decimals: 2 },
  USTEC: { pip: 0.1, contract: 1, decimals: 2 },
  US30: { pip: 1.0, contract: 1, decimals: 1 },
  HK50: { pip: 0.1, contract: 1, decimals: 2 },
  FRANCE40: { pip: 0.1, contract: 1, decimals: 2 },
  CHINA50: { pip: 0.1, contract: 1, decimals: 1 },
  UK100: { pip: 0.1, contract: 1, decimals: 1 },
};

// ==========================================
// STRATEGY OPTIONS
// ==========================================
type Strategy = "scalper" | "daytrader";
const STRATEGY_OPTIONS = [
  { id: "scalper", name: "Scalper", icon: "⚡", timeframe: "5min" },
  { id: "daytrader", name: "Day Trader", icon: "🏛️", timeframe: "H1" },
];

// ==========================================
// RISK PRESETS
// ==========================================
const RISK_PRESETS = [0.5, 1, 2, 3, 5];

// ==========================================
// PRICING PLANS
// ==========================================
const PRICING_PLANS = [
  {
    id: "10",
    name: "Basic Plan",
    setups: "10 Setups",
    price: "$5.00",
    popular: false,
  },
  {
    id: "20",
    name: "Pro Plan",
    setups: "20 Setups",
    price: "$9.50",
    popular: true,
  },
  {
    id: "30",
    name: "Elite Plan",
    setups: "30 Setups",
    price: "$15.00",
    popular: false,
  },
];

// ==========================================
// LOCAL STORAGE KEYS
// ==========================================
const STORAGE_KEYS = {
  CAPITAL: "instant_chart_capital",
  RISK: "instant_chart_risk",
  SYMBOL: "instant_chart_symbol",
  STRATEGY: "instant_chart_strategy",
};

// ==========================================
// QUICK REGISTER MODAL
// ==========================================
function QuickRegisterModal({ onClose, onSuccess, selectedPlan }: any) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (!email || !password || !confirmPassword) {
      setError("Please fill in all fields");
      setLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          password,
          displayName: email.split("@")[0],
        }),
      });

      const data = await response.json();

      if (data.success) {
        localStorage.setItem("cf_token", data.token);
        localStorage.setItem("cf_user", JSON.stringify(data.user));
        onSuccess(data.user, selectedPlan);
        onClose();
      } else {
        setError(data.error || "Registration failed");
      }
    } catch (err: any) {
      setError(err.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>🎯 Quick Registration</h3>
          <button onClick={onClose} className="close-modal">
            ✕
          </button>
        </div>
        <form onSubmit={handleRegister} className="quick-register-form">
          <div className="form-group">
            <label>Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
            />
          </div>
          <div className="form-group">
            <label>Password (min 6 characters)</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={loading}
            />
          </div>
          <div className="form-group">
            <label>Confirm Password</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              disabled={loading}
            />
          </div>
          {error && <div className="error-message">{error}</div>}
          <div className="modal-actions">
            <button type="submit" disabled={loading} className="primary-btn">
              {loading ? "Creating Account..." : "Register & Get 1 Free Chart"}
            </button>
            <button type="button" onClick={onClose} className="secondary-btn">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ==========================================
// PRICING MODAL
// ==========================================
function PricingPlansModal({ onClose, onPlanSelect, onRegisterClick }: any) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content pricing-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>🎯 Choose Your Chart Plan</h3>
          <p>Select a plan that fits your trading needs</p>
          <button onClick={onClose} className="close-modal">
            ✕
          </button>
        </div>

        <div className="pricing-options">
          {PRICING_PLANS.map((plan) => (
            <div
              key={plan.id}
              className={`pricing-card ${plan.popular ? "popular" : ""}`}
            >
              {plan.popular && <div className="popular-badge">MOST POPULAR</div>}
              <div className="plan-header">
                <h4>{plan.name}</h4>
                <div className="setups-count">{plan.setups}</div>
              </div>
              <div className="plan-price">{plan.price}</div>
              <button
                onClick={() => onPlanSelect(plan.id)}
                className="select-plan-btn"
              >
                Select Plan
              </button>
            </div>
          ))}
        </div>

        <div className="pricing-footer">
          <div className="register-option">
            <h4>🔑 Create Account First</h4>
            <p>Register to get 1 free chart instantly</p>
            <button onClick={onRegisterClick} className="register-first-btn">
              Register Now (Get 1 Free)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ==========================================
// MAIN COMPONENT
// ==========================================
export default function InstantChart() {
  const [symbol, setSymbol] = useState<string>("XAUUSD");
  const [strategy, setStrategy] = useState<Strategy>("daytrader");
  const [capital, setCapital] = useState<number>(10000);
  const [riskPercent, setRiskPercent] = useState<number>(2);
  const [chartData, setChartData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lotSize, setLotSize] = useState<number>(0);
  const [riskAmount, setRiskAmount] = useState<number>(0);
  const [rewardAmount, setRewardAmount] = useState<number>(0);
  const [rrRatio, setRrRatio] = useState<number>(0);
  const [trialCount, setTrialCount] = useState<number>(0);
  const [showPricingModal, setShowPricingModal] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<string>("");

  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);

  const { user, setupCount, loading: userLoading, refreshUser } = useUser();
  const { deductSetup } = useOneSetup();

  // Load saved preferences
  useEffect(() => {
    const savedCapital = localStorage.getItem(STORAGE_KEYS.CAPITAL);
    const savedRisk = localStorage.getItem(STORAGE_KEYS.RISK);
    const savedSymbol = localStorage.getItem(STORAGE_KEYS.SYMBOL);
    const savedStrategy = localStorage.getItem(
      STORAGE_KEYS.STRATEGY
    ) as Strategy;

    if (savedCapital) setCapital(parseFloat(savedCapital));
    if (savedRisk) setRiskPercent(parseFloat(savedRisk));
    if (savedSymbol) setSymbol(savedSymbol);
    if (savedStrategy) setStrategy(savedStrategy);
  }, []);

  // Save preferences
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CAPITAL, capital.toString());
    localStorage.setItem(STORAGE_KEYS.RISK, riskPercent.toString());
    localStorage.setItem(STORAGE_KEYS.SYMBOL, symbol);
    localStorage.setItem(STORAGE_KEYS.STRATEGY, strategy);
  }, [capital, riskPercent, symbol, strategy]);

  // Load trial count
  useEffect(() => {
    const count = parseInt(localStorage.getItem("MZP_TRIAL_COUNT") || "0");
    setTrialCount(count);
  }, []);

  const creditsRemaining = user ? setupCount : Math.max(0, 2 - trialCount);

  const formatNumber = (num: number | undefined | null) => {
    if (num === undefined || num === null) return "N/A";
    const decimals = num > 100 ? 2 : 5;
    return num.toFixed(decimals);
  };

  const fetchChartData = async () => {
    if (creditsRemaining <= 0 && !userLoading) {
      setShowPricingModal(true);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Deduct credit for registered users
      if (user) {
        const result = await deductSetup();
        if (result !== "ok") {
          setShowPricingModal(true);
          setLoading(false);
          return;
        }
        await refreshUser();
      } else {
        // Guest trial logic
        if (trialCount >= 2) {
          setShowPricingModal(true);
          setLoading(false);
          return;
        }
        const newCount = trialCount + 1;
        localStorage.setItem("MZP_TRIAL_COUNT", newCount.toString());
        setTrialCount(newCount);
      }

      // Fetch chart data
      const response = await fetch(
        `/api/setup?symbol=${symbol}&strategy=${strategy}`
      );
      if (!response.ok) throw new Error(`Failed to fetch: ${response.status}`);
      const data = await response.json();
      setChartData(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Calculate lot size when chart data changes
  useEffect(() => {
    if (!chartData) return;

    const symbolSpec = SYMBOL_SPECS[symbol] || {
      pip: 0.0001,
      contract: 100000,
      decimals: 5,
    };
    const contract = symbolSpec.contract;
    const pendingOrder =
      chartData.pending_orders?.primary_order ||
      chartData.trade_parameters?.primary_validated_order?.original_order ||
      {};
    const entryPrice =
      pendingOrder.entry_price || chartData.chart?.current_price || 0;
    const stopLoss = pendingOrder.stop_loss || chartData.tp_sl?.sl_level || 0;
    const takeProfit =
      pendingOrder.take_profit || chartData.tp_sl?.tp_level || 0;

    if (entryPrice && stopLoss) {
      const priceDifference = Math.abs(entryPrice - stopLoss);
      const riskPerLot = priceDifference * contract;
      const maxRisk = capital * (riskPercent / 100);
      const rawLotSize = maxRisk / riskPerLot;
      const calculatedLotSize = Math.max(
        0.01,
        Math.min(50, parseFloat(rawLotSize.toFixed(2)))
      );
      setLotSize(calculatedLotSize);
      setRiskAmount(riskPerLot * calculatedLotSize);

      if (takeProfit) {
        const rewardPerLot = Math.abs(takeProfit - entryPrice) * contract;
        setRewardAmount(rewardPerLot * calculatedLotSize);
        setRrRatio(rewardPerLot / riskPerLot);
      }
    }
  }, [chartData, symbol, capital, riskPercent]);

  // Render chart when data changes
  useEffect(() => {
    if (
      !chartContainerRef.current ||
      !chartData?.candles?.data ||
      chartData.candles.data.length === 0
    ) {
      return;
    }

    // Safe cleanup
    if (chartRef.current) {
      try {
        chartRef.current.remove();
      } catch (e) {}
      chartRef.current = null;
    }

    // Clear container
    while (chartContainerRef.current.firstChild) {
      chartContainerRef.current.removeChild(chartContainerRef.current.firstChild);
    }

    // Format candles
    const candles = chartData.candles.data.map((candle: any) => ({
      time: new Date(candle.time).getTime() / 1000 as Time,
      open: candle.open,
      high: candle.high,
      low: candle.low,
      close: candle.close,
    }));

    if (candles.length === 0) return;

    // Create chart
    const chart = createChart(chartContainerRef.current, {
      width: chartContainerRef.current.clientWidth,
      height: 450,
      layout: {
        background: { color: "#0a0a0a" },
        textColor: "#94a3b8",
      },
      grid: {
        vertLines: { color: "#1f3a4a", style: 2 },
        horzLines: { color: "#1f3a4a", style: 2 },
      },
      crosshair: { mode: 0 },
      rightPriceScale: { borderColor: "#1f3a4a" },
      timeScale: { borderColor: "#1f3a4a", timeVisible: true },
    });

    // Add candlestick series
    const candlestickSeries = chart.addSeries(CandlestickSeries, {
      upColor: "#10B981",
      downColor: "#EF4444",
      borderVisible: false,
      wickUpColor: "#10B981",
      wickDownColor: "#EF4444",
    });
    candlestickSeries.setData(candles);

    const firstTime = candles[0].time;
    const lastTime = candles[candles.length - 1].time;

    // Add Pivot Line (Gold)
    if (chartData.pivot?.level) {
      const pivotLine = chart.addSeries(LineSeries, {
        color: "#D4AF37",
        lineWidth: 2,
        lineStyle: 2,
      });
      pivotLine.setData([
        { time: firstTime, value: chartData.pivot.level },
        { time: lastTime, value: chartData.pivot.level },
      ]);
    }

    // Add R1 Line (Red)
    if (chartData.pivot?.resistance_1) {
      const r1Line = chart.addSeries(LineSeries, {
        color: "#EF4444",
        lineWidth: 2,
        lineStyle: 2,
      });
      r1Line.setData([
        { time: firstTime, value: chartData.pivot.resistance_1 },
        { time: lastTime, value: chartData.pivot.resistance_1 },
      ]);
    }

    // Add S1 Line (Green)
    if (chartData.pivot?.support_1) {
      const s1Line = chart.addSeries(LineSeries, {
        color: "#10B981",
        lineWidth: 2,
        lineStyle: 2,
      });
      s1Line.setData([
        { time: firstTime, value: chartData.pivot.support_1 },
        { time: lastTime, value: chartData.pivot.support_1 },
      ]);
    }

    // Add Current Price Line (Gold)
    const currentPrice =
      chartData.chart?.current_price || chartData.pending_orders?.current_price;
    if (currentPrice) {
      const currentLine = chart.addSeries(LineSeries, {
        color: "#D4AF37",
        lineWidth: 2,
        lineStyle: 2,
      });
      currentLine.setData([
        { time: firstTime, value: currentPrice },
        { time: lastTime, value: currentPrice },
      ]);
    }

    // Add TP Line (Green)
    const tp = chartData.pending_orders?.primary_order?.take_profit;
    if (tp) {
      const tpLine = chart.addSeries(LineSeries, {
        color: "#10B981",
        lineWidth: 1,
        lineStyle: 2,
      });
      tpLine.setData([
        { time: firstTime, value: tp },
        { time: lastTime, value: tp },
      ]);
    }

    // Add SL Line (Red)
    const sl = chartData.pending_orders?.primary_order?.stop_loss;
    if (sl) {
      const slLine = chart.addSeries(LineSeries, {
        color: "#EF4444",
        lineWidth: 1,
        lineStyle: 2,
      });
      slLine.setData([
        { time: firstTime, value: sl },
        { time: lastTime, value: sl },
      ]);
    }

    chart.timeScale().fitContent();
    chartRef.current = chart;

    // Handle resize
    const handleResize = () => {
      if (chartContainerRef.current && chartRef.current) {
        try {
          chartRef.current.applyOptions({
            width: chartContainerRef.current.clientWidth,
          });
        } catch (e) {}
      }
    };
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      if (chartRef.current) {
        try {
          chartRef.current.remove();
        } catch (e) {}
        chartRef.current = null;
      }
    };
  }, [chartData]);

  const handlePlanSelect = async (planId: string) => {
    setSelectedPlan(planId);
    if (user) {
      const response = await fetch("/api/checkout/create-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user.id,
          plan: planId,
          email: user.email,
        }),
      });
      const data = await response.json();
      if (data.url) window.location.href = data.url;
    } else {
      setShowPricingModal(false);
      setShowRegisterModal(true);
    }
  };

  const handleRegisterSuccess = async (newUser: any, plan: string) => {
    await refreshUser();
    setShowRegisterModal(false);
    const response = await fetch("/api/checkout/create-session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: newUser.id, plan: plan, email: newUser.email }),
    });
    const data = await response.json();
    if (data.url) window.location.href = data.url;
  };

  const prediction = chartData?.prediction || {};
  const pivot = chartData?.pivot || {};
  const pendingOrder = chartData?.pending_orders?.primary_order || {};
  const takeProfit = pendingOrder.take_profit;
  const stopLoss = pendingOrder.stop_loss;
  const pivotLevel = pivot.level;
  const isShort = prediction.direction === "DOWN";
  const confidence = prediction.confidence || 50;

  // Paywall screen
  if (!userLoading && creditsRemaining <= 0 && !loading && !chartData) {
    return (
      <div className="chatbox-wrapper section">
        <div className="license-header">
          <h3>🔐 INSTANT ACCESS REQUIRED</h3>
          <p>
            {user
              ? "You've used all your chart credits. Buy more to continue using Instant Technical Analysis."
              : "You've used all 2 free trials. Register or buy charts to continue."}
          </p>
        </div>

        <div className="license-options">
          <div className="license-option">
            <div className="option-icon">🎯</div>
            <h4>Buy Charts</h4>
            <p>Institutional-grade technical analysis & precise lot sizing</p>
            <button
              type="button"
              onClick={() => setShowPricingModal(true)}
              className="btn-gold"
            >
              View Plans
            </button>
          </div>

          {!user && (
            <div className="license-option">
              <div className="option-icon">🔑</div>
              <h4>Register</h4>
              <p>Create account to get 1 free chart instantly</p>
              <button
                type="button"
                onClick={() => {
                  setShowPricingModal(false);
                  setShowRegisterModal(true);
                }}
                className="btn-ghost-gold"
              >
                Register Now
              </button>
            </div>
          )}
        </div>

        {showPricingModal && (
          <PricingPlansModal
            onClose={() => setShowPricingModal(false)}
            onPlanSelect={handlePlanSelect}
            onRegisterClick={() => {
              setShowPricingModal(false);
              setShowRegisterModal(true);
            }}
          />
        )}
        {showRegisterModal && (
          <QuickRegisterModal
            onClose={() => setShowRegisterModal(false)}
            onSuccess={handleRegisterSuccess}
            selectedPlan={selectedPlan}
          />
        )}
      </div>
    );
  }

  return (
    <div className="chatbox-wrapper section">
      {/* Header */}
      <div className="chatbox-header">
        <div>📊 INSTANT TECHNICAL ANALYSIS</div>
      </div>

      <div className="chatbox-body">
        {/* Credits bar */}
        <div className="ai-card" style={{ marginBottom: "16px", padding: "12px 16px" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: "10px",
            }}
          >
            <span style={{ color: "#D4AF37", fontWeight: "bold" }}>
              💳 Credits remaining: {creditsRemaining}
            </span>
            <button
              onClick={() => setShowPricingModal(true)}
              className="btn-ghost-gold"
              style={{ padding: "6px 16px", fontSize: "10px" }}
            >
              Buy More
            </button>
          </div>
        </div>

        {/* Controls */}
        <div className="ai-card" style={{ marginBottom: "16px" }}>
          <div className="ai-card-title">📊 CHART CONTROLS</div>
          <div className="ai-card-content">
            <div
              style={{
                display: "flex",
                gap: "16px",
                flexWrap: "wrap",
                marginBottom: "16px",
              }}
            >
              <div style={{ flex: 1, minWidth: "150px" }}>
                <label
                  style={{
                    display: "block",
                    color: "#94a3b8",
                    fontSize: "11px",
                    marginBottom: "6px",
                  }}
                >
                  Symbol
                </label>
                <select
                  value={symbol}
                  onChange={(e) => setSymbol(e.target.value)}
                  className="chatbox-select"
                  style={{ width: "100%" }}
                >
                  {ALL_SYMBOLS.map((s) => (
                    <option key={s} value={s}>
                      {SYMBOL_NAMES[s] || s} ({s})
                    </option>
                  ))}
                </select>
              </div>

              <div style={{ flex: 1, minWidth: "150px" }}>
                <label
                  style={{
                    display: "block",
                    color: "#94a3b8",
                    fontSize: "11px",
                    marginBottom: "6px",
                  }}
                >
                  Strategy
                </label>
                <div style={{ display: "flex", gap: "10px" }}>
                  {STRATEGY_OPTIONS.map((opt) => (
                    <button
                      key={opt.id}
                      onClick={() => setStrategy(opt.id as Strategy)}
                      className={`btn-ghost-gold ${
                        strategy === opt.id ? "active" : ""
                      }`}
                      style={{ flex: 1, padding: "8px", fontSize: "11px" }}
                    >
                      {opt.icon} {opt.name}
                    </button>
                  ))}
                </div>
              </div>

              <div style={{ flex: 1, minWidth: "150px" }}>
                <label
                  style={{
                    display: "block",
                    color: "#94a3b8",
                    fontSize: "11px",
                    marginBottom: "6px",
                  }}
                >
                  Capital ($)
                </label>
                <input
                  type="number"
                  value={capital}
                  onChange={(e) => setCapital(parseFloat(e.target.value) || 0)}
                  className="chatbox-input"
                  style={{ width: "100%" }}
                />
              </div>

              <div style={{ flex: 1, minWidth: "150px" }}>
                <label
                  style={{
                    display: "block",
                    color: "#94a3b8",
                    fontSize: "11px",
                    marginBottom: "6px",
                  }}
                >
                  Risk %
                </label>
                <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                  {RISK_PRESETS.map((risk) => (
                    <button
                      key={risk}
                      onClick={() => setRiskPercent(risk)}
                      className={`btn-ghost-gold ${
                        riskPercent === risk ? "active" : ""
                      }`}
                      style={{ padding: "6px 12px", fontSize: "11px" }}
                    >
                      {risk}%
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <button
              onClick={fetchChartData}
              disabled={loading}
              className="btn-gold"
              style={{ width: "100%", padding: "12px" }}
            >
              {loading ? "Loading..." : "🔍 ANALYZE NOW"}
            </button>
          </div>
        </div>

        {/* Loading state */}
        {loading && !chartData && (
          <div className="ai-card" style={{ textAlign: "center", padding: "40px" }}>
            <div
              className="loading-spinner"
              style={{ margin: "0 auto 16px auto" }}
            ></div>
            <div className="ai-card-content">Loading chart data...</div>
          </div>
        )}

        {/* Error state */}
        {error && (
          <div
            className="ai-card"
            style={{ textAlign: "center", borderLeft: "3px solid #EF4444" }}
          >
            <div className="ai-card-content">
              <p style={{ color: "#EF4444", marginBottom: "16px" }}>❌ {error}</p>
              <button onClick={fetchChartData} className="btn-gold">
                Try Again
              </button>
            </div>
          </div>
        )}

        {/* Chart and results */}
        {chartData && (
          <>
            {/* Chart Container */}
            <div className="chart-container">
              <div ref={chartContainerRef} style={{ width: "100%", height: "450px" }} />
            </div>

            {/* Position Sizing */}
            <div className="ai-card">
              <div className="ai-card-title">📊 POSITION SIZING</div>
              <div className="position-sizing-grid">
                <div className="position-card">
                  <span className="label">📊 LOT SIZE</span>
                  <div className="value">{lotSize.toFixed(2)} lots</div>
                </div>
                <div className="position-card">
                  <span className="label">💵 RISK AMOUNT</span>
                  <div className="value" style={{ color: "#EF4444" }}>
                    ${riskAmount.toFixed(2)}
                  </div>
                  <div style={{ fontSize: "10px", color: "#71717A" }}>
                    ({riskPercent}%)
                  </div>
                </div>
                <div className="position-card">
                  <span className="label">🎯 REWARD AMOUNT</span>
                  <div className="value" style={{ color: "#10B981" }}>
                    ${rewardAmount.toFixed(2)}
                  </div>
                </div>
                <div className="position-card">
                  <span className="label">📈 R/R RATIO</span>
                  <div className="value">{rrRatio.toFixed(2)}:1</div>
                </div>
              </div>
            </div>

            {/* Scenario Cards */}
            <div className="scenario-cards">
              <div className={`scenario-card preferred ${isShort ? "short" : "long"}`}>
                <div className="card-header">
                  <div className="dot"></div>
                  <div className="title">PREFERRED SCENARIO</div>
                </div>
                <div className="card-content">
                  Price moves {isShort ? "BELOW" : "ABOVE"} pivot {formatNumber(pivotLevel)} toward TP
                </div>
                <div className="card-footer">
                  <div className="price">{formatNumber(takeProfit)}</div>
                  <div className="direction">{isShort ? "▼ DOWN" : "▲ UP"}</div>
                  <div className="confidence">{confidence}%</div>
                </div>
              </div>

              <div className={`scenario-card alternative ${isShort ? "short" : "long"}`}>
                <div className="card-header">
                  <div className="dot"></div>
                  <div className="title">ALTERNATIVE SCENARIO</div>
                </div>
                <div className="card-content">
                  Price rebounds {isShort ? "ABOVE" : "BELOW"} pivot {formatNumber(pivotLevel)} toward SL
                </div>
                <div className="card-footer">
                  <div className="price">{formatNumber(stopLoss)}</div>
                  <div className="direction">{isShort ? "▲ UP" : "▼ DOWN"}</div>
                  <div className="confidence">{100 - confidence}%</div>
                </div>
              </div>
            </div>

            {/* Indicators */}
            <div className="indicators">
              <div>
                <span>EMA20</span>
                <strong>{formatNumber(chartData?.chart?.indicators?.ema_20)}</strong>
              </div>
              <div>
                <span>EMA50</span>
                <strong>{formatNumber(chartData?.chart?.indicators?.ema_50)}</strong>
              </div>
              <div>
                <span>RSI</span>
                <strong
                  style={{
                    color:
                      chartData?.chart?.indicators?.rsi > 70
                        ? "#EF4444"
                        : chartData?.chart?.indicators?.rsi < 30
                        ? "#10B981"
                        : "#FFFFFF",
                  }}
                >
                  {chartData?.chart?.indicators?.rsi?.toFixed(1)}
                </strong>
              </div>
              <div>
                <span>ATR</span>
                <strong>{formatNumber(chartData?.chart?.indicators?.atr)}</strong>
              </div>
            </div>
          </>
        )}

        {!chartData && !loading && !error && (
          <div className="ai-card" style={{ textAlign: "center", padding: "60px 20px" }}>
            <div className="ai-card-content">
              <p>📊 Click "ANALYZE NOW" to view the chart</p>
            </div>
          </div>
        )}
      </div>

      {/* Modals */}
      {showPricingModal && (
        <PricingPlansModal
          onClose={() => setShowPricingModal(false)}
          onPlanSelect={handlePlanSelect}
          onRegisterClick={() => {
            setShowPricingModal(false);
            setShowRegisterModal(true);
          }}
        />
      )}
      {showRegisterModal && (
        <QuickRegisterModal
          onClose={() => setShowRegisterModal(false)}
          onSuccess={handleRegisterSuccess}
          selectedPlan={selectedPlan}
        />
      )}
    </div>
  );
}