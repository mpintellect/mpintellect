// components/PropFirmChat.tsx
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
// 🏆 PROP FIRM CONFIGURATION
// ==========================================
const PROP_COMPANIES = [
  { id: "ftmo", name: "FTMO" },
  { id: "fundednext", name: "FundedNext" },
  { id: "mff", name: "MyForexFunds" },
  { id: "fivepercenters", name: "The 5%ers" }
];

const PROP_STAGES = [
  { id: "step1", name: "Step 1: Challenge Phase", target: 0.10, dailyLoss: 0.05, maxLoss: 0.10, description: "Reach 10% profit target within 30 days" },
  { id: "step2", name: "Step 2: Verification Phase", target: 0.05, dailyLoss: 0.05, maxLoss: 0.10, description: "Reach 5% profit target within 60 days" },
  { id: "funded", name: "Funded Account", target: 0, dailyLoss: 0.05, maxLoss: 0.10, description: "No target - focus on consistent profits" },
];

const QUICK_SYMBOLS = ["XAUUSD", "BTCUSD", "US30", "USTEC", "EURUSD", "GBPUSD"];

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
  const saved = localStorage.getItem("MZP_PROP_TRIAL_COUNT");
  return saved ? parseInt(saved) : 0;
};

const incrementTrialCount = (): number => {
  if (typeof window === 'undefined') return 0;
  const current = getTrialCount();
  const newCount = current + 1;
  localStorage.setItem("MZP_PROP_TRIAL_COUNT", newCount.toString());
  return newCount;
};

// ==========================================
// 🧩 TYPES & INTERFACES
// ==========================================
type PropFirmChatProps = {
  onClose?: () => void;
  preselectedSymbol?: string | null;
};

type ChatMessage = {
  sender: "ai" | "user";
  text: string | Array<{ title: string; content: string }>;
  actions?: Array<{ label: string; value: string }>;
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
      // Register with Cloudflare API
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

      if (data.success) {
        const user = data.user;
        // Store session
        localStorage.setItem('cf_token', data.token);
        localStorage.setItem('cf_user', JSON.stringify(user));
        localStorage.setItem('cf_session_id', data.token);
        
        // Clear trial count
        localStorage.removeItem("MZP_PROP_TRIAL_COUNT");
        
        // Trigger success callback
        onSuccess(user, selectedPlan);
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
    { id: "10", name: "Basic Plan", setups: "10 Setups", price: "€4.50", popular: false },
    { id: "20", name: "Pro Plan", setups: "20 Setups", price: "€8.00", popular: true },
    { id: "30", name: "Elite Plan", setups: "30 Setups", price: "€12.00", popular: false }
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

export default function PropFirmChat({ onClose, preselectedSymbol }: PropFirmChatProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [step, setStep] = useState(0); // 0=Firm, 1=Stage, 2=Balance, 3=Symbol, 4=Result
  const [selectedFirm, setSelectedFirm] = useState("");
  const [stage, setStage] = useState<typeof PROP_STAGES[0] | null>(null);
  const [capital, setCapital] = useState("");
  const [symbol, setSymbol] = useState<SymbolKey | null>(null);
  const [isTyping, setIsTyping] = useState(false);
  
  const { user, setupCount, loading: userLoading, userId, refreshUser } = useUser();
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
      const timer = setTimeout(() => {
        startPropWorkflow(preselectedSymbol);
      }, 600);
      return () => clearTimeout(timer);
    }
  }, [preselectedSymbol]);

  const startPropWorkflow = (sym: string) => {
    if (ALL_SYMBOLS.includes(sym as SymbolKey)) {
      setSymbol(sym as SymbolKey);
      setMessages([{
        sender: "ai",
        text: `🚀 **Prop Firm Analysis: ${sym}**\n\nTo calculate your compliant lot size, please select your Prop Firm:`,
        actions: PROP_COMPANIES.map(c => ({ label: c.name, value: c.id }))
      }]);
      setStep(0);
    }
  };

  // ==========================================
  // 💳 PAYMENT & REGISTRATION HANDLERS
  // ==========================================
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

  // ✅ CORRECTED: Handle plan selection like AiChatBox
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

  // ✅ CORRECTED: Handle quick registration success like AiChatBox
  const handleQuickRegisterSuccess = async (userData: any, plan: string) => {
    console.log("🎯 [PropFirmChat] Registration Successful");
    
    // Debug: Show what we received
    console.log("📦 Registration data:", userData);
    console.log("🔑 Token received:", userData.token?.substring(0, 20) + '...');
    console.log("👤 User received:", userData.user);
    
    if (!userData.token || !userData.user) {
      console.error("❌ Missing token or user in registration response");
      return;
    }
    
    // 1. Save credentials IMMEDIATELY
    localStorage.setItem('cf_token', userData.token);
    localStorage.setItem('cf_user', JSON.stringify(userData.user));
    
    // 2. CRITICAL: Clear trial count to prevent paywall
    localStorage.removeItem("MZP_PROP_TRIAL_COUNT");
    
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

  // ==========================================
  // 🎯 STEP 0: FIRM SELECTION
  // ==========================================
  const handleFirmSelect = (firmId: string) => {
    const firmName = PROP_COMPANIES.find(f => f.id === firmId)?.name;
    setSelectedFirm(firmId);
    setMessages(prev => [
      ...prev,
      { sender: "user", text: firmName || firmId },
      { 
        sender: "ai", 
        text: `🏢 Targeting **${firmName}** rules.\n\nWhich stage are you currently in?`,
        actions: PROP_STAGES.map(s => ({ label: s.name, value: s.id }))
      }
    ]);
    setStep(1);
  };

  // ==========================================
  // 🎯 STEP 1: STAGE SELECTION
  // ==========================================
  const handleStageSelect = (stageId: string) => {
    const selected = PROP_STAGES.find(s => s.id === stageId);
    if (!selected) return;
    
    setStage(selected);
    setMessages(prev => [
      ...prev,
      { sender: "user", text: selected.name },
      { 
        sender: "ai", 
        text: `✅ **${selectedFirm.toUpperCase()}: ${selected.name} Rules Loaded**\n\n🎯 Profit Target: ${selected.target > 0 ? `${(selected.target * 100).toFixed(0)}%` : 'No target (Consistency Focus)'}\n⚠️ Max Daily Loss: ${(selected.dailyLoss * 100).toFixed(1)}%\n⛔ Max Overall Loss: ${(selected.maxLoss * 100).toFixed(1)}%\n\n${selected.description}\n\n💰 **What is your account balance?**`
      }
    ]);
    setStep(2);
  };

  // ==========================================
  // 💰 STEP 2: CAPITAL INPUT
  // ==========================================
  const handleCapitalInput = (val: string) => {
    const balance = parseFloat(val);
    if (isNaN(balance) || balance <= 0 || balance > 10000000) {
      setMessages(prev => [
        ...prev,
        { sender: "ai", text: "⚠️ Please enter a valid account balance (1 - 10,000,000 USD)." }
      ]);
      return;
    }

    setCapital(val);
    
    const displaySymbol = symbol || "selected asset";
    setMessages(prev => [
      ...prev,
      { sender: "user", text: `$${balance.toLocaleString()}` },
      { 
        sender: "ai", 
        text: `📊 Account: $${balance.toLocaleString()}\n🏢 Firm: ${selectedFirm.toUpperCase()}\n💵 Daily Loss Limit: **$${(balance * (stage?.dailyLoss || 0.05)).toLocaleString()}**\n\nSelect an asset to analyze. I will calculate lot sizes that keep you safe from drawdown violations:`,
        actions: QUICK_SYMBOLS.map(s => ({ label: s, value: s }))
      }
    ]);
    setStep(3);
  };

  // ==========================================
  // ⚡ WELCOME MESSAGE (when no preselected symbol)
  // ==========================================
  useEffect(() => {
    const hasAccess = user || trialCount < 2;
    
    if (!preselectedSymbol && messages.length === 0 && !userLoading && hasAccess) {
      setTimeout(() => {
        const welcomeMsg: ChatMessage = {
          sender: "ai",
          text: "🏆 **Prop Firm AI Assistant**\n\nI'm calibrated for FTMO, FundedNext, MyForexFunds & The5%ers rules.\n\nPlease select your Prop Firm:",
          actions: PROP_COMPANIES.map(c => ({ label: c.name, value: c.id }))
        };

        if (user) {
          setMessages([
            welcomeMsg,
            { 
              sender: "ai", 
              text: `🎯 You have ${setupCount} setup credit${setupCount === 1 ? '' : 's'} available.`
            }
          ]);
        } else {
          setMessages([
            welcomeMsg,
            { 
              sender: "ai", 
              text: `🎉 You have ${2 - trialCount} free trial${2 - trialCount === 1 ? '' : 's'} remaining.`
            }
          ]);
        }
        setStep(0);
      }, 500);
    }
  }, [messages.length, userLoading, preselectedSymbol, user, setupCount, trialCount]);

  // ==========================================
  // 🔄 SCROLL HANDLING
  // ==========================================
  useEffect(() => {
    if (chatRef.current && !scrollLocked.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [messages]);

  // ==========================================
  // 📈 STEP 3: SYMBOL ANALYSIS (Prop Firm Version)
  // ==========================================
  const executePropAnalysis = async (targetSymbol: SymbolKey) => {
    if (!stage || !capital || !selectedFirm) return;
    
    const balance = parseFloat(capital);
    const dailyLimit = balance * stage.dailyLoss;
    const maxRiskPerTrade = dailyLimit * 0.25; // Only risk 25% of daily limit per trade

    // Check access first
    console.log("🔍 executePropAnalysis called with symbol:", targetSymbol);
    console.log("  - user:", user);
    console.log("  - trialCount:", trialCount);
    console.log("  - !user && trialCount >= 2:", !user && trialCount >= 2);
    
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
    let newTrialCount = trialCount;

    // Access Control Logic
    if (user) {
      const result = await deductSetup(); 
      if (result === "ok") {
        proceed = true;
      } else if (result === "no-credits") {
        setMessages(prev => [
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
        
        // Add buy more setups button
        setMessages(prev => [
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
      } else {
        setMessages(prev => [
          ...prev,
          { sender: "ai", text: "⚠️ Error verifying account. Try again." },
        ]);
        return;
      }
    } else {
      // 🔥 CHECK: Did user just register? (trial count cleared but user not yet loaded)
      const hasJustRegistered = trialCount === 0 && localStorage.getItem('cf_token');
      
      if (hasJustRegistered) {
        // User just registered but hook hasn't updated yet
        // Show loading message or wait for user state
        setMessages(prev => [
          ...prev,
          { sender: "ai", text: "🔄 Loading your account, please wait..." },
        ]);
        return; // Don't proceed yet
      }
      
      if (trialCount < 2) {
        newTrialCount = incrementTrialCount();
        setTrialCount(newTrialCount);
        proceed = true;
      } else {
        setShowPricingModal(true);
        return;
      }
    }

    setSymbol(targetSymbol);
    setMessages(prev => [
      ...prev,
      { sender: "user", text: `Analyze ${targetSymbol}` }
    ]);
    setIsTyping(true);
    setStep(4); // Move to result state

    try {
      const setup = await fetchSetup(targetSymbol) as ExtendedTradeSetupData;
      
      if (!setup) {
        setMessages(prev => [
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

      // ✅ PROP FIRM RISK CALCULATION
      const priceDifference = Math.abs(entryPrice - slPrice);
      const riskPerTradePerLot = priceDifference * contract;

      // Use maxRiskPerTrade (25% of daily limit) instead of 2% of balance
      const maxRiskAmount = Math.min(maxRiskPerTrade, balance * 0.02); // Cap at 2% of balance

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
      const riskPercentageOfBalance = balance > 0 ? (actualRiskAmount / balance) * 100 : 0;
      const riskPercentageOfDailyLimit = dailyLimit > 0 ? (actualRiskAmount / dailyLimit) * 100 : 0;
      
      // Calculate distances for display
      const slDistanceUSD = Math.abs(slPrice - entryPrice) * contract * lotSize;
      const tpDistanceUSD = Math.abs(tpPrice - entryPrice) * contract * lotSize;

      const starRating = Math.min(5, Math.max(1, Math.floor(confidenceScore / 20)));
      const stars = "⭐".repeat(starRating) + "☆".repeat(5 - starRating);
      const signalStrength = confidenceScore < 60 ? "WEAK" : confidenceScore < 80 ? "MODERATE" : "STRONG";
      const signalWarning = confidenceScore < 60
        ? "⚠️ **LOW CONFIDENCE** – Consider waiting for better setup to protect your challenge."
        : "✅ **PROP-FRIENDLY SETUP** – Trade aligns with challenge rules.";

      const decision = setup.final_decision || "WAIT";

      // Calculate progress towards target
      const targetProfitUSD = stage.target > 0 ? balance * stage.target : 0;
      const tradeProfitRatio = tpDistanceUSD / targetProfitUSD;
      const tradesNeeded = stage.target > 0 ? Math.ceil(targetProfitUSD / tpDistanceUSD) : 0;

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

      // Create PROP FIRM specific summary blocks
      const summary: SummaryBlock[] = [
        {
          title: "🏢 FIRM COMPLIANCE",
          content:
            `• Prop Firm: <strong>${selectedFirm.toUpperCase()}</strong>\n` +
            `• Stage: <strong>${stage.name}</strong>\n` +
            `• Daily Cap: <strong>$${dailyLimit.toFixed(0)}</strong>\n` +
            `• Trade Risk: <span style="color:#3b82f6;"><strong>$${actualRiskAmount.toFixed(2)} (${riskPercentageOfDailyLimit.toFixed(1)}% of limit)</strong></span>\n` +
            `• Status: <span style="color:${riskPercentageOfDailyLimit <= 25 ? '#10b981' : '#f59e0b'}"><strong>${riskPercentageOfDailyLimit <= 25 ? '✓ SAFE' : '⚠ WARNING'}</strong></span> • Uses ${riskPercentageOfDailyLimit.toFixed(1)}% of daily allowance`,
        },
        {
          title: "🎯 TRADE SIGNAL",
          content:
            `• Symbol: <strong>${targetSymbol} (${SYMBOL_NAMES[targetSymbol] || targetSymbol})</strong>\n` +
            `• Decision: ${
              decision === "BUY"
                ? '<span class="buy"><strong>BUY</strong></span> 📈'
                : decision === "SELL"
                ? '<span class="sell"><strong>SELL</strong></span> 📉'
                : '<span class="wait"><strong>WAIT</strong></span> ⏳'
            }\n` +
            `• Order Type: <strong>${orderType}</strong>\n` +
            `• Confidence: <strong>${confidenceScore}%</strong> ${stars}\n` +
            `• Signal: <strong>${signalStrength}</strong>\n` +
            `• Market Context: <strong>${marketContext}</strong>`,
        },
        {
          title: "⚡ TRADE PARAMETERS",
          content:
            `• Entry Price: <strong>${entryPrice.toFixed(decimalPlaces)}</strong>\n` +
            `• Stop Loss: <strong>${slPrice.toFixed(decimalPlaces)}</strong> (<span style="color:red;">-$${slDistanceUSD.toFixed(2)}</span>)\n` +
            `• Take Profit: <strong>${tpPrice.toFixed(decimalPlaces)}</strong> (<span style="color:green;">$${tpDistanceUSD.toFixed(2)}</span>)\n` +
            `• Risk/Reward: <strong>${rrRatio.toFixed(2)}:1</strong>\n` +
            `• Strategy: ${orderRationale}`,
        },
        {
          title: stage.target > 0 ? "📊 TARGET PROGRESS" : "💰 PROFIT POTENTIAL",
          content: stage.target > 0
            ? `• Target Profit: <strong>$${targetProfitUSD.toFixed(2)}</strong> (${(stage.target * 100).toFixed(1)}%)\n` +
              `• This Trade: <strong>$${tpDistanceUSD.toFixed(2)}</strong> (${(tradeProfitRatio * 100).toFixed(1)}% of target)\n` +
              `• Trades Needed: <strong>${tradesNeeded}</strong> to complete challenge\n` +
              `• Completion Time: <strong>${Math.ceil(tradesNeeded / 2)} days</strong> (at 2 trades/day)`
            : `• Trade Profit: <strong>$${tpDistanceUSD.toFixed(2)}</strong>\n` +
              `• Monthly Potential: <strong>$${(tpDistanceUSD * 20).toFixed(2)}</strong> (20 trades/month)\n` +
              `• Risk/Reward: <strong>${rrRatio.toFixed(2)}:1</strong> (Prop Firm Approved)`,
        },
      ];

      // Add order details if available
      if (hasValidOrders) {
        summary.push({
          title: "📋 ORDER DETAILS",
          content: `• Total Pending Orders: <strong>${allOrders.length}</strong>\n` +
                  `• Order Confidence: <strong>${orderConfidence}%</strong>\n` +
                  `• Primary Order Rationale: ${orderRationale}`
        });
      }

      // Convert summary blocks to chat messages
      const summaryCards: ChatMessage[] = summary.map(block => ({
        sender: "ai" as const,
        text: [{ title: block.title, content: block.content }]
      }));

      scrollLocked.current = true;
      setMessages((prev) => [...prev, ...summaryCards]);

      // ✅ Saving logic
      if (userId) {
        try {
          console.log("🔄 Saving prop firm setup for user:", userId);
          
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
              symbol: targetSymbol,
              entry_price: entryPrice,
              take_profit: tpPrice,
              stop_loss: slPrice,
              capital: balance,
              lot_size: lotSize,
              risk_reward: finalRR
            })
          });

          if (!saveResponse.ok) {
            throw new Error('Failed to save setup');
          }
          
          console.log("✅ Prop firm setup saved successfully");
        } catch (err) {
          console.error("❌ Failed to save prop firm setup:", err);
          setMessages(prev => [
            ...prev,
            { sender: "ai", text: "⚠️ Analysis complete, but failed to save to history." },
          ]);
        }
      }

      if (!user && newTrialCount >= 2) {
        setMessages(prev => [
          ...prev,
          {
            sender: "ai",
            text: [
              {
                title: "🚫 TRIAL LIMIT REACHED",
                content: "You've used all 2 free trials. Register and buy setups to continue using Prop Firm AI Assistant.",
              },
            ],
          },
        ]);
      }

    } catch (error: any) {
      console.error("❌ Error processing prop firm setup:", error?.message || error);
      setMessages(prev => [
        ...prev,
        { sender: "ai", text: "❌ Error processing trade setup. Please try again." },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  // ==========================================
  // 🎨 RENDER - WITH PAYWALL SUPPORT
  // ==========================================
  const showPaywall = !userLoading && ((!user && trialCount >= 2) || (user && setupCount <= 0));
  console.log("🔍 PropFirmChat showPaywall calculation:");
  console.log("  - userLoading:", userLoading);
  console.log("  - !user:", !user);
  console.log("  - trialCount:", trialCount);
  console.log("  - trialCount >= 2:", trialCount >= 2);
  console.log("  - !user && trialCount >= 2:", !user && trialCount >= 2);
  console.log("  - user && setupCount <= 0:", user && setupCount <= 0);
  console.log("  - showPaywall result:", showPaywall);

  if (showPaywall && !userLoading) {
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
            <p>Get more setup credits to continue using prop firm AI analysis</p>
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
      <div className="chatbox-wrapper section">
        <div className="chatbot-loading">Loading Prop Firm Assistant...</div>
      </div>
    );
  }

    return (
    <div className="chatbox-wrapper section">
      {/* MODALS */}
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
                    __html: typeof msg.text === 'string' ? msg.text.replace(/\n/g, "<br/>") : '',
                  }}
                />
                
                {/* Render action buttons */}
                {msg.actions && (
                  <div className="chat-actions-grid">
                    {msg.actions.map(action => (
                      <button
                        key={action.value}
                        onClick={() => {
                          if (step === 0) {
                            handleFirmSelect(action.value);
                          } else if (step === 1) {
                            handleStageSelect(action.value);
                          } else if (step === 3 && (action.value)) {
                            executePropAnalysis(action.value as SymbolKey);
                          }
                        }}
                        className="chat-action-btn"
                        disabled={isTyping}
                      >
                        {action.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
        
        {isTyping && (
          <div className="chat-msg ai-msg">
            <div className="ai-bubble">
              ⏳ Calculating prop firm compliant lot sizes...
            </div>
          </div>
        )}
      </div>

      {/* STEP 2: CAPITAL INPUT */}
      {step === 2 && (
        <form
          className="chatbox-input-group"
          onSubmit={(e) => {
            e.preventDefault();
            handleCapitalInput(capital.trim());
          }}
        >
          <input
            type="number"
            value={capital}
            onChange={(e) => setCapital(e.target.value)}
            placeholder="Enter account balance in USD…"
            autoComplete="off"
            inputMode="decimal"
            step="0.01"
            min="1"
            max="10000000"
            className="chatbox-input"
            autoFocus
          />
          <button type="submit" className="chatbox-submit">
            Next
          </button>
        </form>
      )}

      {/* STEP 3: SYMBOL SELECTION (Full List) */}
      {step === 3 && !isTyping && (
        <div className="chatbox-input-group">
          <select
            value={symbol || ""}
            onChange={(e) => {
              const selected = e.target.value;
               {
                executePropAnalysis(selected as SymbolKey);
              }
            }}
            className="chatbox-select"
          >
            <option value="">Or select any symbol…</option>
            {ALL_SYMBOLS.map((sym) => (
              <option key={sym} value={sym}>
                {SYMBOL_NAMES[sym]} ({sym})
              </option>
            ))}
          </select>
        </div>
      )}

      {/* STEP 4: RESET BUTTON */}
      {step === 4 && (
        <div className="chatbot-input">
          <button 
            onClick={() => {
              setStep(0);
              setSelectedFirm("");
              setStage(null);
              setCapital("");
              setSymbol(preselectedSymbol && (preselectedSymbol) ? preselectedSymbol as SymbolKey : null);
              setMessages([]);
              setTicketData(null);
            }} 
            className="chatbox-reset"
          >
            {showPaywall ? "Buy More Setups" : "Start New Prop Firm Analysis"}
          </button>
        </div>
      )}
    </div>
  );
}