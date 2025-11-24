// components/AiChatBox.tsx
"use client";

import { useEffect, useRef, useState } from "react";
import { fetchCurrentPrice } from "../app/lib/fetchPrice";
import { useUser } from "../app/hooks/useUser";
import { fetchSetup, hasValidPendingOrders, getPrimaryOrder, getAllPendingOrders, getOrderConfidence, getMarketContext, type ExtendedTradeSetupData } from "../app/lib/fetchSetup";
import { loadStripe } from "@stripe/stripe-js";
import { createUserWithEmailAndPassword, sendEmailVerification } from "firebase/auth";
import { auth, db } from "../app/lib/firebaseClient";
import { setDoc, doc } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { saveSetup } from "@/app/lib/firebase/saveSetup";
import { useOneSetup } from "../app/lib/firebase/useSetup";

// ==========================================
// 📊 EMBEDDED SYMBOL CONFIGURATION
// ==========================================

const ALL_SYMBOLS = [
  "EURUSD", "GBPUSD", "USDJPY", "USDCAD", "AUDUSD",
  "NZDUSD", "USDCHF", "XAUUSD", "XAUEUR", "XAGUSD",
  "PLATINUM", "BRENT", "BTCUSD", "ETHUSD", "XRPUSD",
  "DOGEUSD", "LTCUSD", "US500", "USTEC", "US30",
  "HK50", "FRANCE40", "DE40", "UK100", "EURJPY",
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
  DE40: "DAX 40",
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
  "DE40": { pip: 0.1, contract: 1, decimals: 1 },
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
  mode?: "popup" | "section";
  onClose?: () => void;
  autoStart?: boolean;
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
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      await sendEmailVerification(user);

      await setDoc(doc(db, "users", user.uid), {
        email: email.toLowerCase().trim(),
        setupCount: 1, // 🎁 1 free setup for registration
        referredBy: null,
        emailVerified: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });

      onSuccess(user, selectedPlan);
      
    } catch (err: any) {
      if (err.code === 'auth/email-already-in-use') {
        setError("This email is already registered. Please login instead.");
      } else if (err.code === 'auth/invalid-email') {
        setError("Invalid email address format.");
      } else if (err.code === 'auth/weak-password') {
        setError("Password is too weak. Please use a stronger password.");
      } else {
        setError(err.message || "Registration failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h3>🎯 Quick Registration</h3>
          <p>Create your account to purchase the {selectedPlan} Setup Plan</p>
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
  const plans = [
    { id: "10", name: "Basic Plan", setups: "10 Setups", price: "€4.50", popular: false },
    { id: "20", name: "Pro Plan", setups: "20 Setups", price: "€8.00", popular: true },
    { id: "30", name: "Elite Plan", setups: "30 Setups", price: "€12.00", popular: false }
  ];

  return (
    <div className="modal-overlay">
      <div className="modal-content pricing-modal">
        <div className="modal-header">
          <h3>🎯 Choose Your Setup Plan</h3>
          <p>Select a plan that fits your trading needs</p>
          <button onClick={onClose} className="close-modal">✕</button>
        </div>

        <div className="pricing-options">
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
}

// ==========================================
// 🚀 MAIN COMPONENT
// ==========================================

export default function AiChatBox({ mode = "section", onClose, autoStart = true }: AiChatBoxProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [step, setStep] = useState(0);
  const [symbol, setSymbol] = useState<SymbolKey | null>(null);
  const [capital, setCapital] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  
  const { userId, setupCount, user, isLoading: userLoading } = useUser();
  const router = useRouter();
  
  const chatRef = useRef<HTMLDivElement>(null);
  const scrollLocked = useRef(false);
  const [isLoading, setIsLoading] = useState(false);
  const [trialCount, setTrialCount] = useState(0);

  // Modal states
  const [showPricingModal, setShowPricingModal] = useState(false);
  const [showQuickRegister, setShowQuickRegister] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<string>("");

  const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

  useEffect(() => {
    const count = getTrialCount();
    setTrialCount(count);
  }, [userId]);

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
          uid: user.uid, 
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

  const handlePlanSelect = (plan: string) => {
    setSelectedPlan(plan);
    if (user) {
      handleBuySetups(plan);
      setShowPricingModal(false);
    } else {
      setShowPricingModal(false);
      setShowQuickRegister(true);
    }
  };

  const handleQuickRegisterSuccess = (newUser: any, plan: string) => {
    setShowQuickRegister(false);
    handleBuySetups(plan, newUser.email);
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

  // Welcome message
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
      let newTrialCount = trialCount;

      // Access Control Logic
      if (user) {
        const result = await useOneSetup(); 
        if (result === "ok") {
          proceed = true;
        } else if (result === "no-credits") {
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
          setIsTyping(false);
          return;
        } else {
          setMessages((prev) => [
            ...prev,
            { sender: "ai", text: "⚠️ Error verifying account. Try again." },
          ]);
          setIsTyping(false);
          return;
        }
      } else {
        if (trialCount < 2) {
          newTrialCount = await incrementTrial();
          proceed = true;
        } else {
          setShowPricingModal(true);
          setIsTyping(false);
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

        // Build Summary
        const summary: SummaryBlock[] = [
          {
            title: "🎯 Trade Signal",
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
              `• Signal: <strong>${signalStrength}</strong>`,
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

        if (hasValidOrders) {
          const ordersCount = allOrders.length;
          summary.splice(1, 0, {
            title: "📋 Pending Orders Available",
            content:
              `• Total Orders: <strong>${ordersCount}</strong>\n` +
              `• Market Context: <strong>${marketContext}</strong>\n` +
              `• Order Confidence: <strong>${orderConfidence}%</strong>\n` +
              `• Primary Order: <strong>${orderType}</strong>\n` +
              `• Order Rationale: ${orderRationale}`
          });
        } else {
          summary.splice(1, 0, {
            title: "📋 Order Status",
            content: "• <strong>No valid pending orders</strong>\n• Consider waiting or manual entry"
          });
        }

        const summaryCards: ChatMessage[] = summary.map((block) => ({ 
          sender: "ai" as const, 
          text: [block] 
        }));

        scrollLocked.current = true;
        setMessages((prev) => [...prev, ...summaryCards]);

        if (!user && newTrialCount >= 2) {
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
            
            await saveSetup({
              userId,
              symbol,
              entryPrice,
              takeProfit: tpPrice,
              stopLoss: slPrice,
              capital: capitalNumber,      
              lotSize: lotSize,            
              riskReward: finalRR  
            });
            
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

  const showPaywall = (!user && trialCount >= 2) || (user && setupCount <= 0);

  if (showPaywall && !userLoading) {
    return (
      <div className="chatbox-wrapper">
        <div className="license-header">
          <h3>🔐 MZPrimer AI Assistant</h3>
          <p>
            {user 
              ? "You've used all your setup credits. Buy more setups to continue using advanced trading analysis."
              : "You've used all 2 free trials. Register or buy setups to continue using advanced trading analysis."
            }
          </p>
        </div>
        
        <div className="license-options">
          <div className="license-option">
            <h4>🎯 Buy Setups</h4>
            <p>Get more setup credits to continue using AI analysis</p>
            <button 
              onClick={() => setShowPricingModal(true)} 
              className="subscribe-button primary"
              disabled={isLoading}
            >
              {isLoading ? "Loading..." : "Buy Setups"}
            </button>
          </div>
          
          {!user && (
            <div className="license-option">
              <h4>🔑 Create Account</h4>
              <p>Register to get 1 free setup and manage your credits</p>
              <button 
                onClick={handleRegisterFirst}
                className="register-button secondary"
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
      <div className={mode === "popup" ? "chatbox-wrapper popup" : "chatbox-wrapper section"}>
        <div className="chatbot-loading">Loading AI Assistant...</div>
      </div>
    );
  }

  return (
    <div className={mode === "popup" ? "chatbox-wrapper popup" : "chatbox-wrapper section"}>
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

      {mode === "popup" && (
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