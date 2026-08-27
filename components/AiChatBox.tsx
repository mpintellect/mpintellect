// components/AiChatBox.tsx
"use client";

import { useEffect, useRef, useState } from "react";
import { fetchCurrentPrice } from "../app/lib/fetchPrice";
import { useUser } from "../app/hooks/useUser";
import { fetchSetup, hasValidPendingOrders, getPrimaryOrder, getAllPendingOrders, getOrderConfidence, getMarketContext, type ExtendedTradeSetupData } from "../app/lib/fetchSetup";
import { loadStripe } from "@stripe/stripe-js";
import { useRouter } from "next/navigation";
import { useOneSetup } from "../app/hooks/useOneSetup";
import SignalTicket from "./SignalTicket";
import { createPortal } from "react-dom";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useMarketSignals, type MarketSignal } from "@/app/hooks/useMarketSignals";
import { Search, ChevronDown } from "lucide-react";

// ==========================================
// 🚀 QUICK ACTION BUTTONS CONFIGURATION
// ==========================================
const QUICK_SYMBOLS = ["XAUUSD", "BTCUSD", "EURUSD", "USDJPY"];
const QUICK_SETUP_PROMPT = "⚡ Quick pick a popular asset, or search any symbol below:";

// ==========================================
// 📊 EMBEDDED SYMBOL CONFIGURATION
// ==========================================

const ALL_SYMBOLS = [
  "EURUSD", "GBPUSD", "USDJPY", "USDCAD", "AUDUSD",
  "NZDUSD", "USDCHF", "XAUUSD", "XAUEUR", "XAGUSD",
  "PLATINUM", "BRENT", "BTCUSD", "ETHUSD", "XRPUSD",
  "DOGEUSD", "LTCUSD", "US500", "USTEC", "US30",
  "HK50", "FRANCE40", "CHINA50", "UK100", "EURJPY",
  "EURGBP", "GBPJPY", "GBPCHF"
] as const;

type SymbolKey = typeof ALL_SYMBOLS[number];

// Grouped purely for the symbol picker's UI (categorized list) - doesn't
// change what's tradeable, ALL_SYMBOLS/SYMBOL_NAMES/SYMBOL_SPECS stay the
// single source of truth for everything else.
const SYMBOL_GROUPS: { label: string; symbols: SymbolKey[] }[] = [
  { label: "Forex", symbols: ["EURUSD", "GBPUSD", "USDJPY", "USDCAD", "AUDUSD", "NZDUSD", "USDCHF", "EURJPY", "EURGBP", "GBPJPY", "GBPCHF"] },
  { label: "Metals & Energy", symbols: ["XAUUSD", "XAUEUR", "XAGUSD", "PLATINUM", "BRENT"] },
  { label: "Crypto", symbols: ["BTCUSD", "ETHUSD", "XRPUSD", "LTCUSD", "DOGEUSD"] },
  { label: "Indices", symbols: ["US500", "USTEC", "US30", "HK50", "FRANCE40", "CHINA50", "UK100"] },
];

const CAPITAL_PRESETS = [500, 1000, 5000, 10000, 25000];

// A few varied, plain-language openers per decision so the verdict
// doesn't read like the exact same template every time - picked at
// random. Keeps trader jargon ("go long"/"go short") out in favor of
// buy/sell, which is easier for a non-expert client to follow.
const BUY_OPENERS = [
  (sym: string) => `🚀 I like this one — buy signal on <strong>${sym}</strong>.`,
  (sym: string) => `📈 <strong>${sym}</strong> is shaping up as a solid buy here.`,
  (sym: string) => `✅ Buy opportunity on <strong>${sym}</strong> — the setup looks clean.`,
  (sym: string) => `👍 <strong>${sym}</strong> looks good to buy right now.`,
];
const SELL_OPENERS = [
  (sym: string) => `🔻 <strong>${sym}</strong> is leaning down — I'd sell here.`,
  (sym: string) => `📉 Sell signal on <strong>${sym}</strong> — this one's turning bearish.`,
  (sym: string) => `⚠️ <strong>${sym}</strong> looks weak — good spot to sell.`,
  (sym: string) => `👎 <strong>${sym}</strong> looks good to sell right now.`,
];
const WAIT_OPENERS = [
  (sym: string) => `⏳ Nothing clean on <strong>${sym}</strong> right now — I'd wait.`,
  (sym: string) => `🤔 <strong>${sym}</strong> isn't convincing me yet — better to sit this one out.`,
  (sym: string) => `☕ I'd hold off on <strong>${sym}</strong> for now.`,
  (sym: string) => `🚦 <strong>${sym}</strong> is a no-go for me right now.`,
];

function pickOpener(pool: Array<(sym: string) => string>, sym: string): string {
  return pool[Math.floor(Math.random() * pool.length)](sym);
}

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
  HK50: "Hong Kong 50 stock index",
  FRANCE40: "FRANCE40",
  CHINA50: "CHINA50",
  UK100: "FTSE 100"
};

// ✅ EXACT MATCH WITH BACKEND PIP/CONTRACT SETTINGS
const SYMBOL_SPECS: Record<string, { pip: number; contract: number; decimals: number }> = {
  // Forex (Standard Lot = 100,000 units)
  "EURUSD": { pip: 0.0001, contract: 100000, decimals: 5 },
  "GBPUSD": { pip: 0.0001, contract: 100000, decimals: 5 },
  "USDJPY": { pip: 0.01, contract: 100000, decimals: 3 },
  "USDCAD": { pip: 0.0001, contract: 100000, decimals: 5 },
  "AUDUSD": { pip: 0.0001, contract: 100000, decimals: 5 },
  "NZDUSD": { pip: 0.0001, contract: 100000, decimals: 5 },
  "USDCHF": { pip: 0.0001, contract: 100000, decimals: 5 },
  "EURJPY": { pip: 0.01, contract: 100000, decimals: 3 },
  "EURGBP": { pip: 0.0001, contract: 100000, decimals: 5 },
  "GBPJPY": { pip: 0.01, contract: 100000, decimals: 3 },
  "GBPCHF": { pip: 0.0001, contract: 100000, decimals: 5 },

  // Metals
  "XAUUSD": { pip: 0.01, contract: 100, decimals: 2 }, 
  "XAUEUR": { pip: 0.01, contract: 100, decimals: 2 },
  "XAGUSD": { pip: 0.001, contract: 5000, decimals: 3 },
  "PLATINUM": { pip: 0.01, contract: 100, decimals: 2 },

  // Energy
  "BRENT": { pip: 0.01, contract: 1000, decimals: 2 },

  // Crypto - ADJUSTED FOR MT5 CONTRACT SIZES (Standard CFD lots)
  "BTCUSD": { pip: 1.0, contract: 1, decimals: 1 },
  "ETHUSD": { pip: 0.1, contract: 1, decimals: 2 },
  "XRPUSD": { pip: 0.0001, contract: 1000, decimals: 4 },
  "LTCUSD": { pip: 0.01, contract: 10, decimals: 2 },
  "DOGEUSD": { pip: 0.0001, contract: 1000, decimals: 4 },

  // Indices (Standard Lot = 1 Contract)
  "US500": { pip: 0.1, contract: 1, decimals: 2 },
  "USTEC": { pip: 0.1, contract: 1, decimals: 2 },
  "US30": { pip: 1.0, contract: 1, decimals: 1 },
  "HK50": { pip: 0.1, contract: 1, decimals: 2 },
  "FRANCE40": { pip: 0.1, contract: 1, decimals: 2 },
  "CHINA50": { pip: 0.1, contract: 1, decimals: 1 },
  "UK100": { pip: 0.1, contract: 1, decimals: 1 },
};

// ==========================================
// 💾 LOCAL STORAGE TRIAL FUNCTIONS
// ==========================================
// Temporary dev-testing bump (2 -> 500) so the paywall doesn't interrupt
// every other test run. Only active outside a production build - revert
// to a flat `2` when asked.
const FREE_TRIAL_LIMIT = process.env.NODE_ENV === "production" ? 2 : 500;

const getTrialCount = (): number => {
  if (typeof window === 'undefined') return 0;
  const saved = localStorage.getItem("MZP_TRIAL_COUNT");
  return saved ? parseInt(saved) : 0;
};

const incrementTrialCount = (): number => {
  if (typeof window === 'undefined') return 0;
  const current = getTrialCount();
  const newCount = current + 1;
  localStorage.setItem("MZP_TRIAL_COUNT", newCount.toString());
  return newCount;
};

// ==========================================
// 🧩 TYPES & INTERFACES
// ==========================================
type AiChatBoxProps = {
  mode?: "full" | "section";
  onClose?: () => void;
  autoStart?: boolean;
  preselectedSymbol?: string | null;
};

type ChatMessage = {
  sender: "ai" | "user";
  text: string | Array<{ title: string; content: string }>;
  // Optional color accent for the verdict bubble - buy/sell/wait, set
  // once we know the AI's decision. Anything else stays neutral.
  tone?: "buy" | "sell" | "wait";
};

type SummaryBlock = {
  title: string;
  content: string;
};

// ==========================================
// 🖼️ MODAL COMPONENTS
// ==========================================

// Quick Registration Modal
function QuickRegisterModal({ 
  onClose,
  onSuccess, 
  selectedPlan 
}: { 
  onClose: () => void; 
  onSuccess: (user: any, plan: string) => void;
  selectedPlan: string;
}) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleQuickRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    console.log("📝 QuickRegister started");
    console.log("  - email:", email);
    console.log("  - selectedPlan:", selectedPlan);

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
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          email, 
          password,
          displayName: email.split('@')[0]
        })
      });

      const data = await response.json();
      console.log("📝 Registration API response:", data);

      if (data.success) {
        console.log("✅ Quick registration success:", data);
        console.log("✅ Registration SUCCESS!");
        console.log("  - data.token:", data.token);
        console.log("  - data.user:", data.user);
        console.log("  - data.user.setup_count:", data.user?.setup_count);
        
        // 🔥 SAVE TO LOCALSTORAGE
        localStorage.setItem('cf_token', data.token);
        localStorage.setItem('cf_user', JSON.stringify(data.user));
        localStorage.setItem('cf_session_id', data.token);
        console.log("📝 After saving to localStorage:");
        console.log("  - cf_token saved:", localStorage.getItem('cf_token') ? 'YES' : 'NO');
        console.log("  - cf_user saved:", localStorage.getItem('cf_user') ? 'YES' : 'NO');
        
        // 🔥 CLEAR TRIAL COUNT
        localStorage.removeItem("MZP_TRIAL_COUNT");
        
        // 🔥 CALL THE PARENT CALLBACK with data and selectedPlan
        onSuccess(data, selectedPlan);
        
        // 🔥 CLOSE MODAL
        onClose();
      } else {
        if (data.error.includes('already exists')) {
          setError("This email is already registered. Please login instead.");
        } else if (data.error.includes('Invalid email')) {
          setError("Invalid email address format.");
        } else if (data.error.includes('weak password')) {
          setError("Password is too weak. Please use a stronger password.");
        } else {
          setError(data.error || "Registration failed. Please try again.");
        }
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

        <form onSubmit={handleQuickRegister} className="quick-register-form">
          <div className="form-group">
            <label>Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
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
              placeholder="Enter your password"
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
              placeholder="Confirm your password"
              required
              disabled={loading}
            />
          </div>

          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

          <div className="modal-actions">
            <button 
              type="submit" 
              disabled={loading}
              className="primary-btn"
            >
              {loading ? "Creating Account..." : `Register & Continue to Payment`}
            </button>
            <button 
              type="button" 
              onClick={onClose}
              className="secondary-btn"
              disabled={loading}
            >
              Cancel
            </button>
          </div>

          <div className="registration-note">
            <p>📧 We'll send a verification email. You can verify later and start using your setups immediately.</p>
          </div>
        </form>
      </div>
    </div>
  );

  return typeof document !== "undefined" 
    ? createPortal(modalContent, document.body) 
    : null;
}

// Pricing Plans Modal
function PricingPlansModal({ 
  onClose, 
  onPlanSelect,
  onRegisterClick 
}: { 
  onClose: () => void; 
  onPlanSelect: (plan: string) => void;
  onRegisterClick: () => void;
}) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      const container = scrollRef.current;
      const scrollAmount = (container.scrollWidth - container.offsetWidth) / 2;
      container.scrollLeft = scrollAmount;
    }
  }, []);

  const plans = [
    { id: "10", name: "Basic Plan", setups: "10 Setups", price: "$5.00", popular: false },
    { id: "20", name: "Pro Plan", setups: "20 Setups", price: "$9.50", popular: true },
    { id: "30", name: "Elite Plan", setups: "30 Setups", price: "$15.00", popular: false }
  ];

  const modalContent = (
    <div className="modal-overlay">
      <div className="modal-content pricing-modal">
        <div className="modal-header">
          <h3>🎯 Choose Your Setup Plan</h3>
          <p>Select a plan that fits your trading needs</p>
          <button onClick={onClose} className="close-modal">✕</button>
        </div>

        <div className="pricing-options" ref={scrollRef}>
          {plans.map((plan) => (
            <div 
              key={plan.id} 
              className={`pricing-card ${plan.popular ? 'popular' : ''}`}
            >
              {plan.popular && <div className="popular-badge">MOST POPULAR</div>}
              
              <div className="plan-header">
                <h4>{plan.name}</h4>
                <div className="setups-count">{plan.setups}</div>
              </div>
              
              <div className="plan-price">
                {plan.price}
              </div>
              
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
            <p>Register to get 1 free setup and manage your credits</p>
            <button 
              onClick={onRegisterClick}
              className="register-first-btn"
            >
              Register Now (Get 1 Free Setup)
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return typeof document !== "undefined" 
    ? createPortal(modalContent, document.body) 
    : null;
}

// ==========================================
// 🔍 SYMBOL PICKER
// Replaces a plain native <select> with a searchable, categorized,
// live-price-aware dropdown - matches the visual language of the rest of
// the redesigned chat rather than sitting there as an unstyled browser
// control. Keeps the same contract as the old <select>: calling
// onSelect(sym) is exactly equivalent to the old onChange(selected).
// ==========================================
function priceDecimals(symbol: string) {
  return symbol === "XAUUSD" || symbol === "XAUEUR" || symbol === "BRENT" ? 2 : 4;
}

function SymbolPicker({
  onSelect,
  signals,
  disabled,
  selected,
}: {
  onSelect: (sym: SymbolKey) => void;
  signals: MarketSignal[];
  disabled?: boolean;
  selected?: SymbolKey | null;
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    if (!open) return;
    const onClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, [open]);

  const q = query.trim().toLowerCase();
  const groups = SYMBOL_GROUPS
    .map((g) => ({
      ...g,
      symbols: g.symbols.filter(
        (sym) => !q || sym.toLowerCase().includes(q) || SYMBOL_NAMES[sym]?.toLowerCase().includes(q)
      ),
    }))
    .filter((g) => g.symbols.length > 0);

  const pick = (sym: SymbolKey) => {
    onSelect(sym);
    setOpen(false);
    setQuery("");
  };

  return (
    <div className="aichat-symbol-picker" ref={containerRef}>
      <button
        type="button"
        className={`aichat-symbol-picker-trigger ${selected ? "has-value" : ""}`}
        onClick={() => setOpen((o) => !o)}
        disabled={disabled}
      >
        <span className="aichat-symbol-picker-trigger-icon"><Search size={14} /></span>
        <span className="aichat-symbol-picker-trigger-text">
          {selected ? (
            <>
              <strong>{selected}</strong>
              <span className="aichat-symbol-picker-trigger-change">· change</span>
            </>
          ) : (
            "Select a symbol…"
          )}
        </span>
        <motion.span
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="aichat-symbol-picker-chevron"
        >
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
            <input
              autoFocus
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search symbol or name…"
              className="aichat-symbol-picker-search"
            />
            <div className="aichat-symbol-picker-list">
              {groups.length === 0 && (
                <div className="aichat-symbol-picker-empty">No matches</div>
              )}
              {groups.map((g) => (
                <div key={g.label}>
                  <div className="aichat-symbol-picker-group-label">{g.label}</div>
                  {g.symbols.map((sym) => {
                    const live = signals.find((s) => s.symbol === sym);
                    const isBuy = live?.action === "BUY";
                    return (
                      <button
                        type="button"
                        key={sym}
                        onClick={() => pick(sym)}
                        className={`aichat-symbol-picker-row ${sym === selected ? "active" : ""}`}
                      >
                        <span className="aichat-symbol-picker-row-text">
                          <span className="aichat-symbol-picker-row-sym">{sym}</span>
                          <span className="aichat-symbol-picker-row-name">{SYMBOL_NAMES[sym]}</span>
                        </span>
                        {live && (
                          <span className={`aichat-live-chip ${isBuy ? "buy" : "sell"}`}>
                            {isBuy ? "▲" : "▼"} {live.confidence}%
                          </span>
                        )}
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
// 📊 ANALYSIS DETAILS — collapsible "full breakdown" panel
// The conversational verdict message carries the headline call; this
// holds the supporting cards (risk sizing, session, institutional
// context, etc.) collapsed by default so a result reads as one natural
// reply instead of 6-7 stacked report cards.
// ==========================================
function AnalysisDetails({ blocks }: { blocks: { title: string; content: string }[] }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="ai-details">
      <button
        type="button"
        className="ai-details-toggle"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
      >
        <span>📊 {open ? "Hide" : "Show"} full breakdown</span>
        <motion.span animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2 }}>
          <ChevronDown size={15} />
        </motion.span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="ai-details-body"
          >
            {blocks.map((block, i) => (
              <div className="ai-card" key={i}>
                <div className="ai-card-title">{block.title}</div>
                <div
                  className="ai-card-content"
                  dangerouslySetInnerHTML={{ __html: block.content.replace(/\n/g, "<br/>") }}
                />
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ==========================================
// 🚀 MAIN COMPONENT
// ==========================================

export default function AiChatBox({
  mode = "section",
  onClose, 
  autoStart = true,
  preselectedSymbol = null
}: AiChatBoxProps & { preselectedSymbol?: string | null }) {
  console.log("🚀 AiChatBox MOUNTING - Current state:");
  console.log("  - localStorage cf_token:", localStorage.getItem('cf_token'));
  console.log("  - localStorage cf_user:", localStorage.getItem('cf_user'));
  console.log("  - localStorage MZP_TRIAL_COUNT:", localStorage.getItem('MZP_TRIAL_COUNT'));
  
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [step, setStep] = useState(0);
  const [symbol, setSymbol] = useState<SymbolKey | null>(null);
  const [capital, setCapital] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  
  const { user, setupCount, loading: userLoading, userId, refreshUser } = useUser();
  
  useEffect(() => {
    console.log("🔄 AiChatBox user state changed:");
    console.log("  - user:", user);
    console.log("  - userLoading:", userLoading);
    console.log("  - setupCount:", setupCount);
  }, [user, userLoading, setupCount]);
  
  const { deductSetup } = useOneSetup();
  const router = useRouter();
  const prefersReducedMotion = useReducedMotion();
  const signals = useMarketSignals();

  const chatRef = useRef<HTMLDivElement>(null);
  const scrollLocked = useRef(false);
  const [isLoading, setIsLoading] = useState(false);
  const [trialCount, setTrialCount] = useState(0);

  // Modal states
  const [showPricingModal, setShowPricingModal] = useState(false);
  const [showQuickRegister, setShowQuickRegister] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<string>("");

  // Signal Ticket State
    const [ticketData, setTicketData] = useState<{
    symbol: string;
    action: string;
    entry: string;
    sl: string;
    tp: string;
    lot: string;
    slDistanceUSD: number;
    tpDistanceUSD: number;
  } | null>(null);

  // 🆕 Strategy state for Scalper vs Day Trader
  const [strategy, setStrategy] = useState<"scalper" | "daytrader">("daytrader");
  const [showStrategyMenu, setShowStrategyMenu] = useState(false);
  const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

  useEffect(() => {
    const count = getTrialCount();
    setTrialCount(count);
  }, [userId]);

  // ==========================================
  // ⚡ PRESELECTED SYMBOL EFFECT — arriving here from a landing-page
  // asset card. Feeds straight into the same selectSymbol() everything
  // else uses, so it still stops at the budget question like every
  // other path - no shortcut skips it.
  // ==========================================
  useEffect(() => {
    if (preselectedSymbol && ALL_SYMBOLS.includes(preselectedSymbol as SymbolKey)) {
      const timer = setTimeout(() => {
        selectSymbol(preselectedSymbol as SymbolKey);
      }, 600);
      return () => clearTimeout(timer);
    }
  }, [preselectedSymbol]);

  // ==========================================
  // 🔎 SYMBOL SELECTION — the one entry point for choosing a symbol,
  // whichever way the user got there (search picker, a quick-pick
  // button, or the preselected-symbol effect above). Always ends by
  // asking for a budget next; there is no path that skips straight to
  // an analysis - one linear flow (style -> symbol -> budget -> result)
  // for everyone.
  // ==========================================
  const selectSymbol = async (selectedSymbol: SymbolKey) => {
    if (!user && trialCount >= FREE_TRIAL_LIMIT) {
      setShowPricingModal(true);
      return;
    }

    setMessages((prev) => [...prev, { sender: "user", text: selectedSymbol }]);
    setIsTyping(true);
    setSymbol(selectedSymbol);

    const price = await fetchCurrentPrice(selectedSymbol);
    if (!price) {
      setMessages((prev) => [
        ...prev,
        { sender: "ai", text: "⚠️ Could not fetch price. Try again." },
      ]);
      setIsTyping(false);
      return;
    }

    setMessages((prev) => [
      ...prev,
      { sender: "ai", text: `📊 ${SYMBOL_NAMES[selectedSymbol] || selectedSymbol}\nLive Price: ${price}` },
      { sender: "ai", text: "💰 What's your trading capital in USD?" },
    ]);

    setStep(2);
    setIsTyping(false);
  };

  // ==========================================
  // ⚡ ANALYSIS RUNNER — shared by every path now that symbol selection
  // always leads here through the budget step. This used to be
  // duplicated between a "quick" $1000-only path and the step-by-step
  // path - exactly the two-different-behaviors inconsistency this whole
  // flow was rebuilt to remove, so now there's just one copy.
  // ==========================================
  const runAnalysis = async (targetSymbol: SymbolKey, capitalAmount: number) => {
    if (!user && trialCount >= FREE_TRIAL_LIMIT) {
      setShowPricingModal(true);
      return;
    }

    if (localStorage.getItem('just_registered')) {
      window.location.href = '/client/dashboard?showPlans=true';
      return;
    }

    if (user) {
      if (setupCount <= 0) {
        setMessages((prev) => [
          ...prev,
          {
            sender: "ai",
            text: [
              {
                title: "❌ No Setups Left",
                content: "You've used all your setup credits. Please buy more to continue.",
              },
            ],
          },
          {
            sender: "ai",
            text: [
              {
                title: "🛒 Buy More Setups",
                content: `<button onclick="window.location.href='/client/dashboard?showPlans=true'" style="background: #22c55e; color: white; border: none; padding: 10px 20px; border-radius: 8px; cursor: pointer; font-weight: bold;">
                  View Pricing Plans
                </button>`,
              },
            ],
          },
        ]);
        return;
      }
    } else {
      const hasJustRegistered = trialCount === 0 && localStorage.getItem('cf_token');
      if (hasJustRegistered) {
        setMessages((prev) => [
          ...prev,
          { sender: "ai", text: "🔄 Loading your account, please wait..." },
        ]);
        return;
      }
    }

    setMessages((prev) => [
      ...prev,
      { sender: "ai", text: "⏳ Fetching strategic setup..." },
    ]);
    setIsTyping(true);
    setStep(3);

    try {
      const setup = await fetchSetup(targetSymbol, strategy) as ExtendedTradeSetupData;

      if (!setup) {
        setMessages((prev) => [
          ...prev,
          { sender: "ai", text: "⚠️ Setup not available. Try again later." },
        ]);
        setIsTyping(false);
        return;
      }

      const confidenceScore = setup.risk_score?.confidence_score ?? (setup as any).confidence?.confidence_score ?? 50;
      const symbolSpec = SYMBOL_SPECS[targetSymbol] || { pip: 0.0001, contract: 100000, decimals: 5 };
      const contract = symbolSpec.contract;
      const decimalPlaces = symbolSpec.decimals;

      const hasValidOrders = hasValidPendingOrders(setup);
      const primaryOrder = setup.trade_parameters?.primary_validated_order?.original_order || getPrimaryOrder(setup);
      const allOrders = getAllPendingOrders(setup);
      const orderConfidence = getOrderConfidence(setup);
      const marketContext = getMarketContext(setup);

      const trendDirection = setup.trend?.trend || "neutral";
      const trendStrength = setup.trend?.trend_strength || "weak";
      const momentumBias = setup.momentum?.momentum_bias || "neutral";

      const strengths = setup.risk_score?.strengths || [];
      const weaknesses = setup.risk_score?.weaknesses || [];
      const riskCategory = setup.risk_score?.risk_category || "MEDIUM_RISK";

      let entryPrice = 0;
      let slPrice = 0;
      let tpPrice = 0;
      let rrRatio = 1.0;
      let orderType = "MARKET";
      let orderRationale = "No specific order generated";

      if (hasValidOrders && primaryOrder) {
        entryPrice = Number(primaryOrder.entry_price) || 0;
        slPrice = Number(primaryOrder.sl_price) || 0;
        tpPrice = Number(primaryOrder.tp_price) || 0;
        rrRatio = Number(primaryOrder.rr_ratio) || 1.0;
        orderType = primaryOrder.type || "LIMIT";
        orderRationale = primaryOrder.rationale || "Algorithm generated";
      } else {
        const currentPrice = setup.pending_orders?.current_price || 0;
        entryPrice = currentPrice;
        slPrice = entryPrice * 0.99;
        tpPrice = entryPrice * 1.01;
        orderRationale = "Fallback estimation";
      }

      const priceDifference = Math.abs(entryPrice - slPrice);
      const riskPerTradePerLot = priceDifference * contract;
      const maxRiskAmount = capitalAmount * 0.02;

      let lotSize = 0;
      if (riskPerTradePerLot > 0.00000001) {
        const rawLots = maxRiskAmount / riskPerTradePerLot;
        lotSize = parseFloat(rawLots.toFixed(2));
        if (lotSize < 0.01) lotSize = 0.01;
      } else {
        lotSize = 0.0;
      }

      const actualRiskAmount = riskPerTradePerLot * lotSize;
      const riskPercentage = capitalAmount > 0 ? (actualRiskAmount / capitalAmount) * 100 : 0;
      const slDistanceUSD = Math.abs(slPrice - entryPrice) * contract * lotSize;
      const tpDistanceUSD = Math.abs(tpPrice - entryPrice) * contract * lotSize;

      const starRating = Math.min(5, Math.max(1, Math.floor(confidenceScore / 20)));
      const stars = "⭐".repeat(starRating) + "☆".repeat(5 - starRating);
      const signalStrength = confidenceScore < 60 ? "WEAK" : confidenceScore < 80 ? "MODERATE" : "STRONG";
      const signalWarning = confidenceScore < 60
        ? "⚠️ **LOW CONFIDENCE** – Consider waiting for better setup."
        : "✅ **CONFIRMED SETUP** – Trade looks promising.";

      const decision = setup.final_decision || "WAIT";

      const volumeData = (setup.volume || {}) as {
        position_vs_poc?: string;
        volume_bias?: string;
        poc_price?: number;
        value_area_high?: number;
        value_area_low?: number;
        imbalance_detected?: boolean;
      };

      const volumePosition = volumeData.position_vs_poc || "unknown";
      const volumeBias = volumeData.volume_bias || "neutral";
      const pocPrice = volumeData.poc_price ? volumeData.poc_price.toFixed(decimalPlaces) : "N/A";
      const valueAreaHigh = volumeData.value_area_high ? volumeData.value_area_high.toFixed(decimalPlaces) : "N/A";
      const valueAreaLow = volumeData.value_area_low ? volumeData.value_area_low.toFixed(decimalPlaces) : "N/A";
      const imbalanceDetected = volumeData.imbalance_detected || false;

      const sessionsData = (setup.sessions || {}) as {
        session_name?: string;
        liquidity_rating?: number;
        is_high_volume_window?: boolean;
        trading_regime_bias?: string;
        session_note?: string;
      };

      const sessionName = sessionsData.session_name || "Unknown";
      const liquidityRating = sessionsData.liquidity_rating || 0;
      const isHighVolumeWindow = sessionsData.is_high_volume_window || false;
      const tradingRegimeBias = sessionsData.trading_regime_bias || "neutral";
      const sessionNote = sessionsData.session_note || "Normal trading conditions";

      const isOverextended = volumePosition === "above_poc" || volumePosition === "below_poc";
      const overextensionType = volumePosition === "above_poc" ? "premium" : volumePosition === "below_poc" ? "discount" : "";

      if (user) {
        const result = await deductSetup();
        if (result !== "ok") {
          console.error("Failed to deduct setup after analysis");

          setMessages((prev) => [
            ...prev,
            {
              sender: "ai",
              text: [
                {
                  title: "❌ No Setups Left",
                  content: "You've used all your setup credits. Please buy more to continue using MPIntellect AI.",
                },
              ],
            },
            {
              sender: "ai",
              text: [
                {
                  title: "🛒 Purchase Setups",
                  content: `<div class="cta-button-container">
                    <button onclick="window.location.href='/client/dashboard?showPlans=true'" class="cta-button-primary">
                      View Pricing Plans
                    </button>
                    <button onclick="window.location.href='/client/dashboard/billing'" class="cta-button-secondary">
                      Manage Billing
                    </button>
                  </div>`,
                },
              ],
            },
          ]);

          setIsTyping(false);
          return;
        }
      } else {
        incrementTrialCount();
        setTrialCount(prev => prev + 1);
      }

      setTicketData({
        symbol: targetSymbol,
        action: decision,
        entry: entryPrice.toFixed(decimalPlaces),
        sl: slPrice.toFixed(decimalPlaces),
        tp: tpPrice.toFixed(decimalPlaces),
        lot: lotSize.toFixed(2),
        slDistanceUSD,
        tpDistanceUSD
      });

      // ✅ CONVERSATIONAL VERDICT + one collapsible "Full Analysis" panel
      // instead of 7 stacked cards - same underlying numbers, just not
      // force-splayed into 7 separate bubbles. See AnalysisDetails below.
      // Opener is randomized (BUY/SELL/WAIT_OPENERS) and the trade stats
      // are laid out one-per-line instead of a dense paragraph - easier
      // to scan at a glance for a non-trader client.
      const verdictText = decision === 'WAIT'
        ? `${pickOpener(WAIT_OPENERS, targetSymbol)} Confidence's only <strong>${confidenceScore}%</strong> ${stars} - not enough edge right now.\n${setup.risk_score?.recommendation || 'Worth checking back later for a cleaner setup.'}`
        : `${pickOpener(decision === 'BUY' ? BUY_OPENERS : SELL_OPENERS, targetSymbol)} <strong>${confidenceScore}%</strong> confidence ${stars} - based on ${orderRationale.toLowerCase()}.\n\n` +
          `🎯 Entry: <strong>${entryPrice.toFixed(decimalPlaces)}</strong>\n` +
          `🛑 Stop: <strong>${slPrice.toFixed(decimalPlaces)}</strong> <span style="color:red;">(-$${slDistanceUSD.toFixed(2)})</span>\n` +
          `🏁 Target: <strong>${tpPrice.toFixed(decimalPlaces)}</strong> <span style="color:green;">(+$${tpDistanceUSD.toFixed(2)})</span>\n` +
          `⚖️ Reward: <strong>${rrRatio.toFixed(2)}:1</strong>\n` +
          `📦 Size: <strong>${lotSize.toFixed(2)} lots</strong> on $${capitalAmount}`;

      const detailBlocks: SummaryBlock[] = [
        {
          title: "💰 RISK ARCHITECTURE",
          content:
            `• Precision Lot Size: <strong>${lotSize.toFixed(2)} Lots</strong>\n` +
            `• Account Exposure: $${actualRiskAmount.toFixed(2)} (<strong>${riskPercentage.toFixed(1)}% of Capital</strong>)\n` +
            `• Risk Category: <strong>${riskCategory.replace(/_/g, ' ').toUpperCase()}</strong>\n` +
            `• Safety Audit: ${setup.trade_parameters?.trade_validation?.is_valid ? '✅ VERIFIED' : '⚠️ CAUTION REQUIRED'}`
        },
        {
          title: "⚖️ VALUE ANALYSIS",
          content:
            `• Fair Value (POC): <strong>${pocPrice}</strong>\n` +
            `• Value Area: ${valueAreaLow} - ${valueAreaHigh}\n` +
            `• Price Position: <strong>${volumePosition.replace(/_/g, ' ').toUpperCase()}</strong>\n` +
            `• Strategic State: ${isOverextended ? `Institutional <strong>${overextensionType?.toUpperCase()}</strong> detected (Premium Pricing)` : 'Price trading within fair value area.'}\n` +
            `${imbalanceDetected ? '• 🔥 <strong>IMBALANCE DETECTED</strong>: High-velocity institutional buying.' : ''}`
        },
        {
          title: "⏰ SESSION ",
          content:
            `• Current Session: <strong>${sessionName}</strong>\n` +
            `• Liquidity Rating: <strong>${"⭐".repeat(Math.min(5, liquidityRating))}${"☆".repeat(Math.max(0, 5 - liquidityRating))}</strong> (${liquidityRating}/10)\n` +
            `• High Volume Window: <strong>${isHighVolumeWindow ? 'YES ✅' : 'NO 🌙'}</strong>\n` +
            `• Trading Regime: <strong>${tradingRegimeBias.replace(/_/g, ' ').toUpperCase()}</strong>\n` +
            `• Session Note: ${sessionNote}`
        },
        {
          title: "🏛️ INSTITUTIONAL CONTEXT",
          content:
            `• Structural Bias: ${trendDirection.replace(/_/g, ' ').toUpperCase()} (${trendStrength})\n` +
            `• Market Context: <strong>${marketContext.replace(/_/g, ' ').toUpperCase()}</strong>\n` +
            `• Momentum Bias: <strong>${momentumBias.replace(/_/g, ' ').toUpperCase()}</strong>\n` +
            `• Institutional Flow: ${volumeBias === 'bullish_accumulation' ? 'Smart Money ACCUMULATING' : volumeBias === 'bearish_distribution' ? 'Smart Money DISTRIBUTING' : 'Balanced Distribution'}`
        },
        {
          title: "🛡️ STRATEGIC AUDIT",
          content:
            (strengths.length > 0 ? `✅ STRENGTHS:\n${strengths.slice(0, 3).map((s: string) => `  └ ${s}`).join('\n')}\n` : '') +
            (weaknesses.length > 0 ? `⚠️ RISK FACTORS:\n${weaknesses.slice(0, 2).map((w: string) => `  └ ${w}`).join('\n')}` : '✅ No significant structural risks detected.')
        },
        {
          title: signalStrength === "WEAK" ? "⚠️ STRATEGIC CAUTION" : "✅ EXECUTIVE VERDICT",
          content:
            `<strong>${signalWarning}</strong>\n` +
            `• Recommendation: ${setup.risk_score?.recommendation || 'Proceed with standard risk rules.'}`
        }
      ];

      if (hasValidOrders && allOrders.length > 1) {
        detailBlocks.push({
          title: "📋 ORDER DETAILS",
          content: `• Total Pending Orders: <strong>${allOrders.length}</strong>\n` +
                  `• Order Confidence: <strong>${orderConfidence}%</strong>`
        });
      }

      scrollLocked.current = true;
      const verdictTone: "buy" | "sell" | "wait" = decision === "BUY" ? "buy" : decision === "SELL" ? "sell" : "wait";
      setMessages((prev) => [
        ...prev,
        { sender: "ai", text: verdictText, tone: verdictTone },
        { sender: "ai", text: detailBlocks.map((b) => ({ title: b.title, content: b.content })) },
      ]);

      if (!user && trialCount >= 1) {
        setMessages((prev) => [
          ...prev,
          {
            sender: "ai",
            text: [
              {
                title: "🚫 Trial Limit Reached",
                content: `You've used all ${FREE_TRIAL_LIMIT} free trials. Register and buy setups to continue using MPIntellect AI.`,
              },
            ],
          },
        ]);
      }

      if (userId) {
        try {
          console.log("🔄 Saving setup for user:", userId);

          const finalRR = (tpPrice && slPrice && entryPrice) ?
            Math.abs(tpPrice - entryPrice) / Math.abs(entryPrice - slPrice) : 1.0;
          const token = localStorage.getItem('cf_token');

          const saveResponse = await fetch('/api/setups', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              symbol: targetSymbol,
              entry_price: entryPrice,
              take_profit: tpPrice,
              stop_loss: slPrice,
              capital: capitalAmount,
              lot_size: lotSize,
              risk_reward: finalRR
            })
          });

          if (!saveResponse.ok) {
            throw new Error('Failed to save setup');
          }

          console.log("✅ Setup saved successfully");
        } catch (err) {
          console.error("❌ Failed to save setup:", err);
          setMessages((prev) => [
            ...prev,
            { sender: "ai", text: "⚠️ Analysis complete, but failed to save to history." },
          ]);
        }
      }

    } catch (error: any) {
      console.error("❌ Error processing trade setup:", error?.message || error);
      setMessages((prev) => [
        ...prev,
        { sender: "ai", text: "❌ Error processing trade setup. Please try again." },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleBuySetups = async (plan: string, userEmail?: string) => {
    if (!user) {
      console.error("No user found for purchase");
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch("/api/checkout/create-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          userId: user.id, 
          plan: plan,
          email: user.email || userEmail
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || `HTTP error! status: ${res.status}`);
      }

      const data = await res.json();

      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error("Checkout URL not received.");
      }
    } catch (error: any) {
      console.error("Buy setup error:", error);
      alert(`Failed to start checkout: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const showPlans = urlParams.get('showPlans');
    const isNewUser = urlParams.get('status') === 'new_user';
    
    if (user && (showPlans || isNewUser)) {
      setShowPricingModal(true);
      window.history.replaceState({}, '', '/client/dashboard');
    }
  }, [user]);

  const handleQuickRegisterSuccess = async (data: any, plan: string) => {
    console.log("🎯 [AiChatBox] Registration Successful");
    console.log("📦 Registration data:", data);
    console.log("🔑 Token received:", data.token?.substring(0, 20) + '...');
    console.log("👤 User received:", data.user);
    
    if (!data.token || !data.user) {
      console.error("❌ Missing token or user in registration response");
      return;
    }
    
    localStorage.setItem('cf_token', data.token);
    localStorage.setItem('cf_user', JSON.stringify(data.user));
    localStorage.removeItem("MZP_TRIAL_COUNT");
    setTrialCount(0);
    setShowQuickRegister(false);
    setShowPricingModal(false);
    
    console.log("🔀 Redirecting to dashboard with plan:", plan);
    const redirectUrl = `${window.location.origin}/client/dashboard?showPlans=true&plan=${plan}&new_user=true`;
    console.log("📍 Redirect URL:", redirectUrl);
    
    setTimeout(() => {
      window.location.href = redirectUrl;
    }, 100);
  };

  const handlePlanSelect = (plan: string) => {
    setSelectedPlan(plan);
    if (user) {
      handleBuySetups(plan, user.email);
    } else {
      setShowPricingModal(false);
      setShowQuickRegister(true);
    }
  };

  const handleRegisterFirst = () => {
    setShowPricingModal(false);
    setShowQuickRegister(true);
    setSelectedPlan("10");
  };

  const incrementTrial = async () => {
    const newCount = incrementTrialCount();
    setTrialCount(newCount);
    return newCount;
  };

  
                    // 🆕 Handle strategy selection from inline buttons (raw HTML)
  useEffect(() => {
    const handleStrategyClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const button = target.closest('.strategy-inline-btn');
      if (button) {
        e.preventDefault();
        e.stopPropagation();
        
        const strategyType = button.getAttribute('data-strategy');
        console.log('🔘 Strategy button clicked:', strategyType);
        
        if (strategyType === 'scalper') {
          setStrategy('scalper');
        } else if (strategyType === 'daytrader') {
          setStrategy('daytrader');
        }
        
        // Update the strategy display message
        setMessages(prev => {
          const newMessages = [...prev];
          // Find and update the current strategy message
          for (let i = 0; i < newMessages.length; i++) {
            const msg = newMessages[i];
            if (msg.sender === 'ai' && typeof msg.text === 'string' && msg.text.includes('strategy-buttons-inline')) {
              // Update the buttons HTML
              newMessages[i] = {
                sender: "ai" as const,
                text: `<div class="strategy-buttons-inline" style="margin: 4px 0 0 0; padding: 0;">
                  <button class="strategy-inline-btn ${strategyType === 'scalper' ? 'active' : ''}" data-strategy="scalper">
                    <span class="btn-icon">⚡</span>
                    <span class="btn-text">Scalper</span>
                    <span class="btn-badge">5min</span>
                  </button>
                  <button class="strategy-inline-btn ${strategyType === 'daytrader' ? 'active' : ''}" data-strategy="daytrader">
                    <span class="btn-icon">🏛️</span>
                    <span class="btn-text">Day Trader</span>
                    <span class="btn-badge">H1</span>
                  </button>
                </div>`
              };
              break;
            }
          }
          return newMessages;
        });
      }
    };

    // Use capture phase to ensure we catch clicks
    document.addEventListener('click', handleStrategyClick, true);
    return () => document.removeEventListener('click', handleStrategyClick, true);
  }, [strategy]);

  useEffect(() => {
    const hasAccess = user || trialCount < FREE_TRIAL_LIMIT;
    
    if (hasAccess && messages.length === 0 && autoStart && !userLoading) {
      setTimeout(() => {
        // One conversational greeting instead of a "welcome" bubble + a
        // separate "you have N trials" bubble + a separate "pick your
        // style" label bubble - fewer, friendlier messages up front.
        const greetingText = user
          ? `👋 Hey! I'm your AI trading assistant — you've got <strong>${setupCount}</strong> setup credit${setupCount === 1 ? '' : 's'} ready. Pick a style, then an asset, and I'll walk you through the rest.`
          : `👋 Hey! I'm your AI trading assistant — you've got <strong>${FREE_TRIAL_LIMIT - trialCount}</strong> free trial${FREE_TRIAL_LIMIT - trialCount === 1 ? '' : 's'} to try me out. Pick a style, then an asset, and I'll walk you through the rest.`;

        const welcomeMessages: ChatMessage[] = [
          { sender: "ai" as const, text: greetingText },
          {
            sender: "ai" as const,
            text: `<div class="strategy-buttons-inline" style="margin: 4px 0 0 0; padding: 0;">
              <button class="strategy-inline-btn ${strategy === 'scalper' ? 'active' : ''}" data-strategy="scalper">
                <span class="btn-icon">⚡</span>
                <span class="btn-text">Scalper</span>
                <span class="btn-badge">5min</span>
              </button>
              <button class="strategy-inline-btn ${strategy === 'daytrader' ? 'active' : ''}" data-strategy="daytrader">
                <span class="btn-icon">🏛️</span>
                <span class="btn-text">Day Trader</span>
                <span class="btn-badge">H1</span>
              </button>
            </div>`
          },
          { sender: "ai" as const, text: QUICK_SETUP_PROMPT },
        ];

        setMessages(welcomeMessages);
        setStep(1);
      }, 300);
    }
  }, [messages.length, autoStart, user, setupCount, userLoading, trialCount]);

  useEffect(() => {
    if (chatRef.current && !scrollLocked.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [messages]);

  // The final step in the flow: the budget question. Symbol selection
  // now always happens through selectSymbol() before this can even
  // render (see the step === 2 gate in the JSX below), so this only
  // ever has to validate the amount and hand off to runAnalysis().
  const handleUserInput = async (input: string) => {
    if (!user && trialCount >= FREE_TRIAL_LIMIT) {
      setShowPricingModal(true);
      return;
    }

    if (step !== 2 || !symbol) return;

    setMessages((prev) => [...prev, { sender: "user", text: input }]);

    const capitalNumber = parseFloat(input);
    if (isNaN(capitalNumber) || capitalNumber <= 0 || capitalNumber > 10000000) {
      setMessages((prev) => [
        ...prev,
        { sender: "ai", text: "⚠️ Please enter a valid capital amount (1 - 10,000,000 USD)." },
      ]);
      return;
    }

    setCapital(input);
    await runAnalysis(symbol, capitalNumber);
  };

  const showPaywall = !userLoading && ((!user && trialCount >= FREE_TRIAL_LIMIT) || (user && setupCount <= 0));
  console.log("🔍 showPaywall calculation:");
  console.log("  - userLoading:", userLoading);
  console.log("  - !user:", !user);
  console.log("  - trialCount:", trialCount);
  console.log("  - trialCount >= FREE_TRIAL_LIMIT:", trialCount >= FREE_TRIAL_LIMIT);
  console.log("  - !user && trialCount >= FREE_TRIAL_LIMIT:", !user && trialCount >= FREE_TRIAL_LIMIT);
  console.log("  - user && setupCount <= 0:", user && setupCount <= 0);
  console.log("  - showPaywall result:", showPaywall);

  if (showPaywall && !userLoading) {
    return (
      <div className="chatbox-wrapper section">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="license-header"
        >
          <h3>🔐 EXECUTIVE ACCESS REQUIRED</h3>
          <p>
            {user
              ? "You've used all your setup credits. Buy more setups to continue using advanced trading analysis."
              : `You've used all ${FREE_TRIAL_LIMIT} free trials. Register or buy setups to continue using advanced trading analysis.`
            }
          </p>
        </motion.div>

        <div className="license-options">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
            whileHover={prefersReducedMotion ? undefined : { y: -3 }}
            className="license-option"
          >
            <div className="option-icon">🎯</div>
            <h4>Buy Setups</h4>
            <p>Institutional AI analysis & precise lot sizing</p>
            <button
              type="button"
              onClick={(e) => { e.preventDefault(); setShowPricingModal(true); }}
              className="btn-gold"
              disabled={isLoading}
            >
              {isLoading ? "Loading..." : "View Plans"}
            </button>
          </motion.div>

          {!user && (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.14, ease: [0.22, 1, 0.36, 1] }}
              whileHover={prefersReducedMotion ? undefined : { y: -3 }}
              className="license-option"
            >
              <div className="option-icon">🔑</div>
              <h4>Register</h4>
              <p>Create account to get 1 free setup instantly</p>
              <button
                type="button"
                onClick={(e) => { e.preventDefault(); handleRegisterFirst(); }}
                className="btn-ghost-gold"
              >
                Register Now
              </button>
            </motion.div>
          )}
        </div>

        {showPricingModal && (
          <PricingPlansModal
            onClose={() => setShowPricingModal(false)}
            onPlanSelect={handlePlanSelect}
            onRegisterClick={handleRegisterFirst}
          />
        )}

        {showQuickRegister && (
          <QuickRegisterModal
            onClose={() => setShowQuickRegister(false)}
            onSuccess={handleQuickRegisterSuccess}
            selectedPlan={selectedPlan || "10"}
          />
        )}
      </div>
    );
  }

  if (userLoading) {
    return (
      <div className={mode === "full" ? "chatbox-wrapper full" : "chatbox-wrapper section"}>
        <div className="chatbot-loading">
          <span className="aichat-loading-spinner" aria-hidden />
          Loading AI Assistant...
        </div>
      </div>
    );
  }

  return (
    <div className={mode === "full" ? "chatbox-wrapper full" : "chatbox-wrapper section"}>
      {showPricingModal && (
        <PricingPlansModal
          onClose={() => setShowPricingModal(false)}
          onPlanSelect={handlePlanSelect}
          onRegisterClick={handleRegisterFirst}
        />
      )}

      {showQuickRegister && (
        <QuickRegisterModal
          onClose={() => setShowQuickRegister(false)}
          onSuccess={handleQuickRegisterSuccess}
          selectedPlan={selectedPlan || "10"}
        />
      )}

      {ticketData && (
        <SignalTicket 
          data={ticketData} 
          onClose={() => setTicketData(null)} 
        />
      )}

      {mode === "full" && onClose && (
        <div className="chatbox-header">
          <div>MPIntellect AI Assistant</div>
          <button onClick={onClose} className="chatbox-close">
            ✕
          </button>
        </div>
      )}

      <div className="chatbox-body" ref={chatRef}>
        {messages.map((msg, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: (idx % 6) * 0.05, ease: [0.22, 1, 0.36, 1] }}
            className={`chat-msg ${msg.sender === "ai" ? "ai" : "user"}`}
          >
            {Array.isArray(msg.text) ? (
              msg.text.length > 1 ? (
                <AnalysisDetails blocks={msg.text} />
              ) : (
                msg.text.map((block: any, i: number) => (
                  <div className="ai-card" key={i}>
                    <div className="ai-card-title">{block.title}</div>
                    <div
                      className="ai-card-content"
                      dangerouslySetInnerHTML={{
                        __html: block.content.replace(/\n/g, "<br/>"),
                      }}
                    />
                  </div>
                ))
              )
            ) : (
              // 🆕 SPECIAL CASE: Strategy buttons - NO BUBBLE/CONTAINER
              typeof msg.text === 'string' && msg.text.includes('strategy-buttons-inline') ? (
                <div
                  dangerouslySetInnerHTML={{
                    __html: msg.text,
                  }}
                />
              ) : (
                <div className={msg.sender === "user" ? "user-bubble" : `ai-bubble ${msg.tone ? `ai-bubble-${msg.tone}` : ""}`}>
                  <div
                    dangerouslySetInnerHTML={{
                      __html: msg.text.replace(/\n/g, "<br/>"),
                    }}
                  />
                </div>
              )
            )}

            {msg.text === QUICK_SETUP_PROMPT && (
              <div className="quick-action-buttons">
                {QUICK_SYMBOLS.map((sym, i) => (
                  <motion.button
                    key={sym}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.1 + i * 0.05 }}
                    whileHover={prefersReducedMotion ? undefined : { y: -2 }}
                    whileTap={{ scale: 0.96 }}
                    onClick={() => selectSymbol(sym as SymbolKey)}
                    className="quick-action-btn"
                    disabled={isTyping}
                  >
                    {sym}
                  </motion.button>
                ))}
              </div>
            )}
          </motion.div>
        ))}
        <AnimatePresence>
          {isTyping && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="chat-msg ai"
            >
              <div className="ai-bubble aichat-typing-bubble">
                <span className="aichat-typing-dots">
                  <span /><span /><span />
                </span>
                Analyzing market data…
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {step >= 1 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="chatbox-input-group aichat-symbol-row"
        >
          {/* Always available, even after a symbol is picked - clicking
              it again lets you swap symbols without losing your style
              pick or starting the whole conversation over. */}
          <SymbolPicker
            signals={signals}
            disabled={isTyping}
            selected={symbol}
            onSelect={(sym) => selectSymbol(sym)}
          />
        </motion.div>
      )}

      {step === 2 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="aichat-capital-step"
        >
          <div className="aichat-capital-presets">
            {CAPITAL_PRESETS.map((amt, i) => (
              <motion.button
                key={amt}
                type="button"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25, delay: i * 0.04 }}
                whileHover={prefersReducedMotion ? undefined : { y: -2 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setCapital(String(amt))}
                className={`aichat-capital-chip ${capital === String(amt) ? "active" : ""}`}
              >
                ${amt.toLocaleString()}
              </motion.button>
            ))}
          </div>
          <form
            className="chatbox-input-group"
            onSubmit={(e) => {
              e.preventDefault();
              if (!capital.trim()) return;
              handleUserInput(capital.trim());
            }}
          >
            <input
              type="number"
              name="capital"
              value={capital}
              onChange={(e) => setCapital(e.target.value)}
              placeholder="Enter capital in USD…"
              autoComplete="off"
              inputMode="decimal"
              step="0.01"
              min="1"
              className="chatbox-input"
            />
            <button type="submit" className="chatbox-submit">
              Analyze
            </button>
          </form>
        </motion.div>
      )}

      {step === 3 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="chatbot-input"
        >
          <motion.button
            whileHover={prefersReducedMotion ? undefined : { y: -1 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => {
              setStep(1);
              setSymbol(null);
              setCapital("");
              setMessages([]);
              scrollLocked.current = false;
              setTicketData(null);
            }}
            className="chatbox-reset"
          >
            {showPaywall ? "Buy More Setups" : "Start New Analysis"}
          </motion.button>
        </motion.div>
      )}
    </div>
  );
}