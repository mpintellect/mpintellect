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

// ==========================================
// 🚀 QUICK ACTION BUTTONS CONFIGURATION
// ==========================================
const QUICK_SYMBOLS = ["XAUUSD", "BTCUSD", "EURUSD", "USDJPY"];

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
  "BTCUSD": { pip: 1.0, contract: 1, decimals: 1 },      // 1 Lot = 1 Bitcoin
  "ETHUSD": { pip: 0.1, contract: 1, decimals: 2 },      // 1 Lot = 1 Ether
  "XRPUSD": { pip: 0.0001, contract: 1000, decimals: 4 }, // ✅ 1 Lot = 1000 XRP (Standard CFD)
  "LTCUSD": { pip: 0.01, contract: 10, decimals: 2 },    // ✅ 1 Lot = 10 LTC
  "DOGEUSD": { pip: 0.0001, contract: 1000, decimals: 4 }, // ✅ 1 Lot = 1000 DOGE

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
  // This will trigger handleQuickRegisterSuccess which sets trialCount to 0
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

  // This sends the modal to the bottom of <body>
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
      // Scrolls the container to the middle on mount
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

  // This sends the modal to the bottom of <body>
  return typeof document !== "undefined" 
    ? createPortal(modalContent, document.body) 
    : null;
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
  
  // Use 'loading' (the name in the hook) and rename it to 'userLoading'
const { user, setupCount, loading: userLoading, userId, refreshUser } = useUser();
useEffect(() => {
    console.log("🔄 AiChatBox user state changed:");
    console.log("  - user:", user);
    console.log("  - userLoading:", userLoading);
    console.log("  - setupCount:", setupCount);
  }, [user, userLoading, setupCount]);
  const { deductSetup } = useOneSetup();
  const router = useRouter();
  
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

  const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

  useEffect(() => {
    const count = getTrialCount();
    setTrialCount(count);
  }, [userId]);

  // ==========================================
  // ⚡ NEW: PRESELECTED SYMBOL EFFECT
  // ==========================================
  useEffect(() => {
    if (preselectedSymbol && ALL_SYMBOLS.includes(preselectedSymbol as SymbolKey)) {
      // Small timeout ensures the modal animation finishes before analysis starts
      const timer = setTimeout(() => {
        executeQuickAnalysis(preselectedSymbol as SymbolKey);
      }, 600);
      return () => clearTimeout(timer);
    }
  }, [preselectedSymbol]);

  // ==========================================
  // ⚡ QUICK ANALYSIS FUNCTION
  // ==========================================
  const executeQuickAnalysis = async (targetSymbol: SymbolKey) => {
    console.log("🔍 executeQuickAnalysis called with symbol:", targetSymbol);
    console.log("  - user:", user);
    console.log("  - trialCount:", trialCount);
    console.log("  - !user && trialCount >= 2:", !user && trialCount >= 2);
    // Check access first
    if (!user && trialCount >= 2) {
      console.log("❌ Blocked: !user && trialCount >= 2 is TRUE");
      console.log("  - Showing pricing modal");
      setShowPricingModal(true);
      return;
    }
    
    console.log("✅ Access granted or user has trials left");
    // 🔥 CHECK: If user just registered, redirect to dashboard
    if (localStorage.getItem('just_registered')) {
        window.location.href = '/client/dashboard?showPlans=true';
        return;
    }

    let proceed = false;
    

 // Access Control Logic - CHECK only, don't deduct yet
if (user) {
  // Just check if user has credits, don't deduct yet
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
    ]);
    setMessages((prev) => [
      ...prev,
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
  proceed = true;
} else {
  // 🔥 CHECK: Did user just register? (trial count cleared but user not yet loaded)
  const hasJustRegistered = trialCount === 0 && localStorage.getItem('cf_token');
  
  if (hasJustRegistered) {
    setMessages((prev) => [
      ...prev,
      { sender: "ai", text: "🔄 Loading your account, please wait..." },
    ]);
    return;
  }
  
  if (trialCount < 2) {
    proceed = true;
  } else {
    setShowPricingModal(true);
    return;
  }
}

    // Set $1,000 as default capital for quick analysis
    const quickCapital = 1000;
    
    // Show user message
    setMessages((prev) => [
      ...prev,
      { sender: "user", text: `Quick Setup: ${targetSymbol} ($${quickCapital})` }
    ]);
    
    setIsTyping(true);
    setStep(3); // Skip to result state

    try {
      const setup = await fetchSetup(targetSymbol) as ExtendedTradeSetupData;
      
      if (!setup) {
        setMessages((prev) => [
          ...prev,
          { sender: "ai", text: "⚠️ Setup not available. Try again later." },
        ]);
        setIsTyping(false);
        return;
      }

      // ✅ SAFE confidence access
      const confidenceScore = setup.risk_score?.confidence_score ?? (setup as any).confidence?.confidence_score ?? 50;
      
      // ✅ SAFE EMBEDDED SYMBOL SPECS
      const symbolSpec = SYMBOL_SPECS[targetSymbol] || { pip: 0.0001, contract: 100000, decimals: 5 };
      const contract = symbolSpec.contract;
      const decimalPlaces = symbolSpec.decimals;

      // ✅ EXTRACT ORDER DATA
      const hasValidOrders = hasValidPendingOrders(setup);
      const primaryOrder = getPrimaryOrder(setup);
      const allOrders = getAllPendingOrders(setup);
      const orderConfidence = getOrderConfidence(setup);
      const marketContext = getMarketContext(setup);
      
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
        // Fallback
        const currentPrice = setup.pending_orders?.current_price || 0;
        entryPrice = currentPrice;
        slPrice = entryPrice * 0.99;
        tpPrice = entryPrice * 1.01;
        orderRationale = "Fallback estimation";
      }

      // ✅ CORRECTED RISK CALCULATION
      const priceDifference = Math.abs(entryPrice - slPrice);
      
      // Calculate Dollar Risk per 1 Lot traded
      const riskPerTradePerLot = priceDifference * contract;

      const maxRiskAmount = quickCapital * 0.02; // 2% Risk Rule

      // ✅ FIX: Prevent division by zero & enforce min 0.01 lot
      let lotSize = 0;
      if (riskPerTradePerLot > 0.00000001) {
        const rawLots = maxRiskAmount / riskPerTradePerLot;
        lotSize = parseFloat(rawLots.toFixed(2)); // Round to 2 decimals
        
        // Enforce minimum 0.01 lot if valid trade
        if (lotSize < 0.01) lotSize = 0.01;
      } else {
          lotSize = 0.0; // Invalid trade parameters
      }

      const actualRiskAmount = riskPerTradePerLot * lotSize;
      const riskPercentage = quickCapital > 0 ? (actualRiskAmount / quickCapital) * 100 : 0;
      
      // Calculate distances for display
      const slDistanceUSD = Math.abs(slPrice - entryPrice) * contract * lotSize;
      const tpDistanceUSD = Math.abs(tpPrice - entryPrice) * contract * lotSize;

      const starRating = Math.min(5, Math.max(1, Math.floor(confidenceScore / 20)));
      const stars = "⭐".repeat(starRating) + "☆".repeat(5 - starRating);
      const signalStrength = confidenceScore < 60 ? "WEAK" : confidenceScore < 80 ? "MODERATE" : "STRONG";
      const signalWarning = confidenceScore < 60
        ? "⚠️ **LOW CONFIDENCE** – Consider waiting for better setup."
        : "✅ **CONFIRMED SETUP** – Trade looks promising.";

      const decision = setup.final_decision || "WAIT";
// ✅ DEDUCT SETUP ONLY AFTER SUCCESSFUL ANALYSIS
if (user) {
  const result = await deductSetup(); 
  if (result !== "ok") {
    console.error("Failed to deduct setup after analysis");
    
    // Show error message with CTA button to buy setups
    setMessages((prev) => [
      ...prev,
      {
        sender: "ai",
        text: [
          {
            title: "❌ No Setups Left",
            content: "You've used all your setup credits. Please buy more to continue using MZPrimer AI.",
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
    
    // STOP EXECUTION - don't show ticket or summary
    setIsTyping(false);
    return;
  }
} else {
  // Increment trial count for guest
  incrementTrialCount();
  setTrialCount(prev => prev + 1);
}
      // 🚀 SHOW SIGNAL TICKET POPUP
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

      // Create summary blocks in the format you requested
      const summary: SummaryBlock[] = [
        {
          title: "🎯 Trade Parameters",
          content:
            `• Symbol: <strong>${targetSymbol} (${SYMBOL_NAMES[targetSymbol] || targetSymbol})</strong>\n` +
            `• Decision: ${
              setup.final_decision === "BUY"
                ? '<span class="buy"><strong>BUY</strong></span> 📈'
                : setup.final_decision === "SELL"
                ? '<span class="sell"><strong>SELL</strong></span> 📉'
                : '<span class="wait"><strong>WAIT</strong></span> ⏳'
            }\n` +
            `• Order Type: <strong>${orderType}</strong>\n` +
            `• Confidence: <strong>${confidenceScore}%</strong> ${stars}\n` +
            `• Signal: <strong>${signalStrength}</strong>\n` +
            `• Market Context: <strong>${marketContext}</strong>`,
        },
        {
          title: "⚡ Trade Parameters",
          content:
            `• Entry Price: <strong>${entryPrice.toFixed(decimalPlaces)}</strong>\n` +
            `• Stop Loss: <strong>${slPrice.toFixed(decimalPlaces)}</strong> (<span style="color:red;">-$${slDistanceUSD.toFixed(2)}</span>)\n` +
            `• Take Profit: <strong>${tpPrice.toFixed(decimalPlaces)}</strong> (<span style="color:green;">$${tpDistanceUSD.toFixed(2)}</span>)\n` +
            `• Risk/Reward: <strong>${rrRatio.toFixed(2)}:1</strong>\n` +
            `• Strategy: ${orderRationale}`,
        },
        {
          title: "💰 Risk Management",
          content:
            `• Capital: <strong>$${quickCapital.toLocaleString()}</strong>\n` +
            `• Risk/Trade: <strong>$${actualRiskAmount.toFixed(2)}</strong> (${riskPercentage.toFixed(1)}%)\n` +
            `• Lot Size: <strong>${lotSize.toFixed(2)}</strong>\n` +
            `• Position: ${setup.risk_score?.position_size_multiplier ?? 0.5}x`,
        },
        {
          title: signalStrength === "WEAK" ? "⚠️ Caution" : "✅ Final Signal",
          content: `<strong>${signalWarning}</strong>`,
        },
      ];

      // Convert summary blocks to chat messages
      const summaryCards: ChatMessage[] = summary.map(block => ({
        sender: "ai" as const,
        text: [{ title: block.title, content: block.content }]
      }));

      // Add additional order information card if available
      if (hasValidOrders) {
        summaryCards.push({
          sender: "ai" as const,
          text: [{ 
            title: "📋 ORDER DETAILS", 
            content: `• Total Pending Orders: <strong>${allOrders.length}</strong>\n` +
                    `• Order Confidence: <strong>${orderConfidence}%</strong>\n` +
                    `• Primary Order Rationale: ${orderRationale}` 
          }]
        });
      }

      scrollLocked.current = true;
      setMessages((prev) => [...prev, ...summaryCards]);

    if (!user && trialCount >= 1) { // Check trialCount state instead
  setMessages((prev) => [
    ...prev,
    {
      sender: "ai",
      text: [
        {
          title: "🚫 Trial Limit Reached",
          content: "You've used all 2 free trials. Register and buy setups to continue using MZPrimer AI.",
        },
      ],
    },
  ]);
}

      // ✅ Saving logic
      if (userId) {
        try {
          console.log("🔄 Saving quick setup for user:", userId);
          
          const finalRR = (tpPrice && slPrice && entryPrice) ? 
            Math.abs(tpPrice - entryPrice) / Math.abs(entryPrice - slPrice) : 1.0;
          const token = localStorage.getItem('cf_token'); 

          // Save setup via Cloudflare API
          const saveResponse = await fetch('/api/setups', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`, // This will now work with Step 1
    'Content-Type': 'application/json'
  },
            body: JSON.stringify({
              symbol: targetSymbol,
              entry_price: entryPrice,
              take_profit: tpPrice,
              stop_loss: slPrice,
              capital: quickCapital,
              lot_size: lotSize,
              risk_reward: finalRR
            })
          });

          if (!saveResponse.ok) {
            throw new Error('Failed to save setup');
          }
          
          console.log("✅ Quick setup saved successfully");
        } catch (err) {
          console.error("❌ Failed to save quick setup:", err);
          setMessages((prev) => [
            ...prev,
            { sender: "ai", text: "⚠️ Analysis complete, but failed to save to history." },
          ]);
        }
      }

    } catch (error: any) {
      console.error("❌ Error processing quick setup:", error?.message || error);
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
    // Check if user just registered and needs to select a plan
    const urlParams = new URLSearchParams(window.location.search);
    const showPlans = urlParams.get('showPlans');
    const isNewUser = urlParams.get('status') === 'new_user';
    
    if (user && (showPlans || isNewUser)) {
        // User is registered, show plan selection immediately
        setShowPricingModal(true);
        // Clean up URL
        window.history.replaceState({}, '', '/client/dashboard');
    }
}, [user]);
const handleQuickRegisterSuccess = async (data: any, plan: string) => {
    console.log("🎯 [AiChatBox] Registration Successful");
    
    // Debug: Show what we received
    console.log("📦 Registration data:", data);
    console.log("🔑 Token received:", data.token?.substring(0, 20) + '...');
    console.log("👤 User received:", data.user);
    
    if (!data.token || !data.user) {
      console.error("❌ Missing token or user in registration response");
      return;
    }
    
    // 1. Save credentials IMMEDIATELY
    localStorage.setItem('cf_token', data.token);
    localStorage.setItem('cf_user', JSON.stringify(data.user));
    
    // 2. CRITICAL: Clear trial count to prevent paywall
    localStorage.removeItem("MZP_TRIAL_COUNT");
   
    
    // 3. Update local state
    setTrialCount(0);
    
    // 4. Close all modals
    setShowQuickRegister(false);
    setShowPricingModal(false);
    
    // 5. FORCE REDIRECT - don't wait for anything
    console.log("🔀 Redirecting to dashboard with plan:", plan);
    
    // Use full URL to avoid any routing issues
    const redirectUrl = `${window.location.origin}/client/dashboard?showPlans=true&plan=${plan}&new_user=true`;
    console.log("📍 Redirect URL:", redirectUrl);
    
    // Hard redirect with timeout to ensure it happens
    setTimeout(() => {
      window.location.href = redirectUrl;
    }, 100);
};


// ✅ Only one handlePlanSelect function
const handlePlanSelect = (plan: string) => {
  setSelectedPlan(plan);
  if (user) {
    // If logged in, go to Stripe
    handleBuySetups(plan, user.email);
  } else {
    // If guest, show registration modal
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

  // Welcome message with QUICK ACTION BUTTONS
  useEffect(() => {
    const hasAccess = user || trialCount < 2;
    
    if (hasAccess && messages.length === 0 && autoStart && !userLoading) {
      setTimeout(() => {
        const welcomeMessages: ChatMessage[] = [
          {
            sender: "ai" as const,
            text: "🤖 MZPrimer AI:\nWelcome! I'm your personal AI Trading Assistant. Let's analyze a strategic setup.",
          },
        ];

        if (user) {
          welcomeMessages.push({
            sender: "ai" as const,
            text: `🎯 You have ${setupCount} setup credit${setupCount === 1 ? '' : 's'} available.`
          });
        } else {
          welcomeMessages.push({
            sender: "ai" as const, 
            text: `🎉 You have ${2 - trialCount} free trial${2 - trialCount === 1 ? '' : 's'} remaining.`
          });
        }

        welcomeMessages.push({
          sender: "ai" as const, 
          text: "2️⃣ 🔍 Choose a Trading Symbol to begin:"
        });

        // Add Quick Action Buttons as a separate message
        welcomeMessages.push({
          sender: "ai" as const, 
          text: "🚀 **Quick Setup:** Click any asset below for instant $1,000 analysis:"
        });

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

  const handleUserInput = async (input: string) => {
    if (!user && trialCount >= 2) {
      setShowPricingModal(true);
      return;
    }

    setMessages((prev) => [...prev, { sender: "user", text: input }]);
    setIsTyping(true);

    // === STEP 1: SELECT SYMBOL ===
    if (step === 1) {
      const selectedSymbol = input.trim() as SymbolKey;
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
      return;
    }

    // === STEP 2: ENTER CAPITAL & FETCH SETUP ===
    if (step === 2) {
      const capitalNumber = parseFloat(input);
      if (isNaN(capitalNumber) || capitalNumber <= 0 || capitalNumber > 10000000) {
        setMessages((prev) => [
          ...prev,
          { sender: "ai", text: "⚠️ Please enter a valid capital amount (1 - 10,000,000 USD)." },
        ]);
        setIsTyping(false);
        return;
      }

      if (!symbol) {
        setMessages((prev) => [
          ...prev,
          { sender: "ai", text: "⚠️ Please select a symbol first." },
        ]);
        setIsTyping(false);
        return;
      }

      let proceed = false;
      
      

      
// Access Control Logic - CHECK only, don't deduct yet
if (user) {
  // Just check if user has credits, don't deduct yet
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
    ]);
    setMessages((prev) => [
      ...prev,
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
  proceed = true;
} else {
  // 🔥 CHECK: Did user just register? (trial count cleared but user not yet loaded)
  const hasJustRegistered = trialCount === 0 && localStorage.getItem('cf_token');
  
  if (hasJustRegistered) {
    // User just registered but hook hasn't updated yet
    // Show loading message or wait for user state
    setMessages((prev) => [
      ...prev,
      { sender: "ai", text: "🔄 Loading your account, please wait..." },
    ]);
    return; // Don't proceed yet
  }
  
  if (trialCount < 2) {
    proceed = true;
  } else {
    setShowPricingModal(true);
    return;
  }
}

      setCapital(input);
      setMessages((prev) => [
        ...prev,
        { sender: "ai", text: "⏳ Fetching strategic setup..." },
      ]);
      setStep(3);

      try {
        const setup = await fetchSetup(symbol) as ExtendedTradeSetupData;
        
        if (!setup) {
          setMessages((prev) => [
            ...prev,
            { sender: "ai", text: "⚠️ Setup not available. Try again later." },
          ]);
          setIsTyping(false);
          return;
        }

        // ✅ SAFE confidence access
        const confidenceScore = setup.risk_score?.confidence_score ?? (setup as any).confidence?.confidence_score ?? 50;
        
        // ✅ SAFE EMBEDDED SYMBOL SPECS
        const symbolSpec = SYMBOL_SPECS[symbol] || { pip: 0.0001, contract: 100000, decimals: 5 };
        const contract = symbolSpec.contract;
        const decimalPlaces = symbolSpec.decimals;

        // ✅ EXTRACT ORDER DATA
        const hasValidOrders = hasValidPendingOrders(setup);
        const primaryOrder = getPrimaryOrder(setup);
        const allOrders = getAllPendingOrders(setup);
        const orderConfidence = getOrderConfidence(setup);
        const marketContext = getMarketContext(setup);
        
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
          // Fallback
          const currentPrice = setup.pending_orders?.current_price || 0;
          entryPrice = currentPrice;
          slPrice = entryPrice * 0.99;
          tpPrice = entryPrice * 1.01;
          orderRationale = "Fallback estimation";
        }

        // ✅ CORRECTED RISK CALCULATION
        const priceDifference = Math.abs(entryPrice - slPrice);
        
        // Calculate Dollar Risk per 1 Lot traded
        const riskPerTradePerLot = priceDifference * contract;

        const maxRiskAmount = capitalNumber * 0.02; // 2% Risk Rule

        // ✅ FIX: Prevent division by zero & enforce min 0.01 lot
        let lotSize = 0;
        if (riskPerTradePerLot > 0.00000001) {
          const rawLots = maxRiskAmount / riskPerTradePerLot;
          lotSize = parseFloat(rawLots.toFixed(2)); // Round to 2 decimals
          
          // Enforce minimum 0.01 lot if valid trade
          if (lotSize < 0.01) lotSize = 0.01;
        } else {
            lotSize = 0.0; // Invalid trade parameters
        }

        const actualRiskAmount = riskPerTradePerLot * lotSize;
        const riskPercentage = capitalNumber > 0 ? (actualRiskAmount / capitalNumber) * 100 : 0;
        
        // Calculate distances for display
        const slDistanceUSD = Math.abs(slPrice - entryPrice) * contract * lotSize;
        const tpDistanceUSD = Math.abs(tpPrice - entryPrice) * contract * lotSize;

        const starRating = Math.min(5, Math.max(1, Math.floor(confidenceScore / 20)));
        const stars = "⭐".repeat(starRating) + "☆".repeat(5 - starRating);
        const signalStrength = confidenceScore < 60 ? "WEAK" : confidenceScore < 80 ? "MODERATE" : "STRONG";
        const signalWarning = confidenceScore < 60
          ? "⚠️ **LOW CONFIDENCE** – Consider waiting for better setup."
          : "✅ **CONFIRMED SETUP** – Trade looks promising.";

        const decision = setup.final_decision || "WAIT";
// ✅ DEDUCT SETUP ONLY AFTER SUCCESSFUL ANALYSIS
if (user) {
  const result = await deductSetup(); 
  if (result !== "ok") {
    console.error("Failed to deduct setup after analysis");
    
    // Show error message with CTA button to buy setups
    setMessages((prev) => [
      ...prev,
      {
        sender: "ai",
        text: [
          {
            title: "❌ No Setups Left",
            content: "You've used all your setup credits. Please buy more to continue using MZPrimer AI.",
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
    
    // STOP EXECUTION - don't show ticket or summary
    setIsTyping(false);
    return;
  }
} else {
  // Increment trial count for guest
  incrementTrialCount();
  setTrialCount(prev => prev + 1);
}
        // 🚀 SHOW SIGNAL TICKET POPUP
        setTicketData({
          symbol: symbol,
          action: decision,
          entry: entryPrice.toFixed(decimalPlaces),
          sl: slPrice.toFixed(decimalPlaces),
          tp: tpPrice.toFixed(decimalPlaces),
          lot: lotSize.toFixed(2),
          slDistanceUSD,
          tpDistanceUSD
        });

        // Create summary blocks in the format you requested
        const summary: SummaryBlock[] = [
          {
            title: "🎯 Trade Parameters",
            content:
              `• Symbol: <strong>${symbol} (${SYMBOL_NAMES[symbol] || symbol})</strong>\n` +
              `• Decision: ${
                setup.final_decision === "BUY"
                  ? '<span class="buy"><strong>BUY</strong></span> 📈'
                  : setup.final_decision === "SELL"
                  ? '<span class="sell"><strong>SELL</strong></span> 📉'
                  : '<span class="wait"><strong>WAIT</strong></span> ⏳'
              }\n` +
              `• Order Type: <strong>${orderType}</strong>\n` +
              `• Confidence: <strong>${confidenceScore}%</strong> ${stars}\n` +
              `• Signal: <strong>${signalStrength}</strong>\n` +
              `• Market Context: <strong>${marketContext}</strong>`,
          },
          {
            title: "⚡ Trade Parameters",
            content:
              `• Entry Price: <strong>${entryPrice.toFixed(decimalPlaces)}</strong>\n` +
              `• Stop Loss: <strong>${slPrice.toFixed(decimalPlaces)}</strong> (<span style="color:red;">-$${slDistanceUSD.toFixed(2)}</span>)\n` +
              `• Take Profit: <strong>${tpPrice.toFixed(decimalPlaces)}</strong> (<span style="color:green;">$${tpDistanceUSD.toFixed(2)}</span>)\n` +
              `• Risk/Reward: <strong>${rrRatio.toFixed(2)}:1</strong>\n` +
              `• Strategy: ${orderRationale}`,
          },
          {
            title: "💰 Risk Management",
            content:
              `• Capital: <strong>$${capitalNumber.toLocaleString()}</strong>\n` +
              `• Risk/Trade: <strong>$${actualRiskAmount.toFixed(2)}</strong> (${riskPercentage.toFixed(1)}%)\n` +
              `• Lot Size: <strong>${lotSize.toFixed(2)}</strong>\n` +
              `• Position: ${setup.risk_score?.position_size_multiplier ?? 0.5}x`,
          },
          {
            title: signalStrength === "WEAK" ? "⚠️ Caution" : "✅ Final Signal",
            content: `<strong>${signalWarning}</strong>`,
          },
        ];

        // Convert summary blocks to chat messages
        const summaryCards: ChatMessage[] = summary.map(block => ({
          sender: "ai" as const,
          text: [{ title: block.title, content: block.content }]
        }));

        // Add additional order information card if available
        if (hasValidOrders) {
          summaryCards.push({
            sender: "ai" as const,
            text: [{ 
              title: "📋 ORDER DETAILS", 
              content: `• Total Pending Orders: <strong>${allOrders.length}</strong>\n` +
                      `• Order Confidence: <strong>${orderConfidence}%</strong>\n` +
                      `• Primary Order Rationale: ${orderRationale}` 
            }]
          });
        }

        scrollLocked.current = true;
        setMessages((prev) => [...prev, ...summaryCards]);

       if (!user && trialCount >= 1) { // Check trialCount state instead
  setMessages((prev) => [
    ...prev,
    {
      sender: "ai",
      text: [
        {
          title: "🚫 Trial Limit Reached",
          content: "You've used all 2 free trials. Register and buy setups to continue using MZPrimer AI.",
        },
      ],
    },
  ]);
}

        // ✅ Saving logic
        if (userId) {
          try {
            console.log("🔄 Saving setup for user:", userId);
            
            const finalRR = (tpPrice && slPrice && entryPrice) ? 
              Math.abs(tpPrice - entryPrice) / Math.abs(entryPrice - slPrice) : 1.0;
            
            // Save setup via Cloudflare API
            const saveResponse = await fetch('/api/setups', {
              method: 'POST',
              headers: {
                'Authorization': `Bearer ${localStorage.getItem('cf_token')}`,
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({
                symbol: symbol,
                entry_price: entryPrice,
                take_profit: tpPrice,
                stop_loss: slPrice,
                capital: capitalNumber,
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
        console.error("❌ Error processing setup:", error?.message || error);
        setMessages((prev) => [
          ...prev,
          { sender: "ai", text: "❌ Error processing trade setup. Please try again." },
        ]);
      }

      setIsTyping(false);
    }
  };

  const showPaywall = !userLoading && ((!user && trialCount >= 2) || (user && setupCount <= 0));
  console.log("🔍 showPaywall calculation:");
console.log("  - userLoading:", userLoading);
console.log("  - !user:", !user);
console.log("  - trialCount:", trialCount);
console.log("  - trialCount >= 2:", trialCount >= 2);
console.log("  - !user && trialCount >= 2:", !user && trialCount >= 2);
console.log("  - user && setupCount <= 0:", user && setupCount <= 0);
console.log("  - showPaywall result:", showPaywall);

if (showPaywall && !userLoading) {
   console.log("🚨 SHOWING PAYWALL!");
    return (
      <div className="chatbox-wrapper section">
        <div className="license-header">
          <h3>🔐 EXECUTIVE ACCESS REQUIRED</h3>
          <p>
            {user 
              ? "You've used all your setup credits. Buy more setups to continue using advanced trading analysis."
              : "You've used all 2 free trials. Register or buy setups to continue using advanced trading analysis."
            }
          </p>
        </div>
        
        <div className="license-options">
          <div className="license-option">
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
          </div>
          
          {!user && (
            <div className="license-option">
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
            </div>
          )}
        </div>

        {/* ⚡ THE CRITICAL FIX: The modals MUST be here too! ⚡ */}
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
        <div className="chatbot-loading">Loading AI Assistant...</div>
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

      {/* 🚀 SIGNAL TICKET POPUP */}
      {ticketData && (
        <SignalTicket 
          data={ticketData} 
          onClose={() => setTicketData(null)} 
        />
      )}

      {mode === "full" && onClose && (
        <div className="chatbox-header">
          <div>MZPrimer AI Assistant</div>
          <button onClick={onClose} className="chatbox-close">
            ✕
          </button>
        </div>
      )}

      <div className="chatbox-body" ref={chatRef}>
        {messages.map((msg, idx) => (
          <div key={idx} className={`chat-msg ${msg.sender === "ai" ? "ai" : "user"}`}>
            {Array.isArray(msg.text) ? (
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
            ) : (
              <div className={msg.sender === "user" ? "user-bubble" : "ai-bubble"}>
                <div
                  dangerouslySetInnerHTML={{
                    __html: msg.text.replace(/\n/g, "<br/>"),
                  }}
                />
              </div>
            )}
            
            {/* Quick Action Buttons for Popular Symbols */}
            {msg.text === "🚀 **Quick Setup:** Click any asset below for instant $1,000 analysis:" && (
              <div className="quick-action-buttons">
                {QUICK_SYMBOLS.map((sym) => (
                  <button
                    key={sym}
                    onClick={() => executeQuickAnalysis(sym as SymbolKey)}
                    className="quick-action-btn"
                    disabled={isTyping}
                  >
                    {sym}
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}
        {isTyping && <div className="chat-msg ai-msg">⏳ Analyzing market data...</div>}
      </div>

      {step === 1 && (
        <div className="chatbox-input-group">
          <select
            value={symbol || ""}
            onChange={(e) => {
              const selected = e.target.value as SymbolKey;
              if (selected) handleUserInput(selected);
            }}
            className="chatbox-select"
          >
            <option value="">Select a symbol…</option>
            {ALL_SYMBOLS.map((sym) => (
              <option key={sym} value={sym}>
                {SYMBOL_NAMES[sym]} ({sym})
              </option>
            ))}
          </select>
        </div>
      )}

      {step === 2 && (
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
      )}

      {step === 3 && (
        <div className="chatbot-input">
          <button 
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
          </button>
        </div>
      )}
    </div>
  );
}