// components/AiChatBox.tsx
"use client";

import { useEffect, useRef, useState } from "react";
import { fetchCurrentPrice } from "../app/lib/fetchPrice";
import { SYMBOLS, DISPLAY_NAMES, SymbolKey, CONTRACT_SIZES } from "@/data/symbols";
import { useUser } from "../app/hooks/useUser";
import { fetchSetup, TradeSetupData, hasValidPendingOrders, getPrimaryOrder, getAllPendingOrders, getOrderConfidence, getMarketContext, type ExtendedTradeSetupData } from "../app/lib/fetchSetup";
import SubscribeModal from "./SubscribeModal";
import { loadStripe } from "@stripe/stripe-js";
import LicenseModal from "./LicenseModalAI";
import { validateLicenseKey } from "@/app/lib/validateLicense";
import { v4 as uuidv4 } from 'uuid';

// === TYPES ===
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

export default function AiChatBox({ mode = "section", onClose, autoStart = true }: AiChatBoxProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [step, setStep] = useState(0);
  const [symbol, setSymbol] = useState<SymbolKey | null>(null);
  const [capital, setCapital] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const { userId } = useUser();
  const chatRef = useRef<HTMLDivElement>(null);
  const scrollLocked = useRef(false);
  const [showSubscribe, setShowSubscribe] = useState(false);
  const [showLicenseModal, setShowLicenseModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [trialCount, setTrialCount] = useState(0);
  const [trialUsed, setTrialUsed] = useState(false);

  // Stripe
  const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

  // ✅ LICENSE VALIDATION
  const [hasLicense, setHasLicense] = useState<boolean>(false);

  // Enhanced trial and license state management
  useEffect(() => {
    const initializeUserState = async () => {
      const licenseKey = localStorage.getItem("MZP_LICENSE_KEY");
      const licenseExpires = Number(localStorage.getItem("MZP_LICENSE_EXPIRES"));
      const isValid = !!licenseKey && !!licenseExpires && Date.now() < licenseExpires;
      setHasLicense(isValid);

      // Get trial count from backend if user is logged in
      if (userId) {
        try {
          const trialStatus = await checkTrialStatus(userId);
          setTrialCount(2 - trialStatus.remaining);
          setTrialUsed(!trialStatus.available);
        } catch (error) {
          console.error("Failed to fetch trial status:", error);
          // Fallback to localStorage
          const savedTrialCount = localStorage.getItem("MZP_TRIAL_COUNT");
          const count = savedTrialCount ? parseInt(savedTrialCount) : 0;
          setTrialCount(count);
          setTrialUsed(count >= 2);
        }
      } else {
        // Fallback for anonymous users
        const savedTrialCount = localStorage.getItem("MZP_TRIAL_COUNT");
        const count = savedTrialCount ? parseInt(savedTrialCount) : 0;
        setTrialCount(count);
        setTrialUsed(count >= 2);
      }
    };

    initializeUserState();
  }, [userId]);

  const handleLicenseSubmit = async (key: string) => {
    console.log("🎯 handleLicenseSubmit called with key:", key);
    const res = await validateLicenseKey(key);

    if (res.valid && res.expiresAt) {
      localStorage.setItem("MZP_LICENSE_KEY", key);
      localStorage.setItem("MZP_LICENSE_EXPIRES", res.expiresAt.toString());

      setHasLicense(true);
      setTrialUsed(false);
      setShowLicenseModal(false);
      setStep(1); // ✅ Move to chat

      if (userId) {
        await trackUsage({
          userId,
          licenseKey: key,
          action: 'license_activation'
        });
      }

      // ✅ Show only this clean message set
      setMessages([
        { sender: "ai", text: "🔓 License activated successfully. Welcome!" },
        { sender: "ai", text: "2️⃣ 🔍 Choose a Trading Symbol to begin:" },
      ]);
    } else {
      setMessages([
        { sender: "ai", text: "❌ Invalid or expired license key." },
      ]);
    }
  };

  const handleSubscribe = async (priceId: string) => {
    console.log("🔄 [1] handleSubscribe called with priceId:", priceId);
    setIsLoading(true);
    
    try {
      const orderId = uuidv4(); // ✅ generate orderId
      console.log("📤 [2] Making API request to /api/stripe/checkout...");
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ priceId, orderId }),
      });

      console.log("📥 [3] API response status:", res.status);
      console.log("📥 [4] API response ok:", res.ok);
      
      if (!res.ok) {
        const errorText = await res.text();
        console.error("❌ [5] API error response:", errorText);
        throw new Error(`Checkout failed with status: ${res.status}`);
      }
      
      const data = await res.json();
      console.log("✅ [6] API success data:", data);
      
      // Check what we received
      if (data.url) {
        console.log("🔗 [7] Redirecting to URL:", data.url);
        // Close modal first if it's open
        setShowSubscribe(false);
        // Force redirect
        window.location.href = data.url;
      } else if (data.sessionId) {
  console.log("🔗 [8] Using Stripe.js redirect with sessionId:", data.sessionId);
  const stripe = await stripePromise;
  if (stripe) {
    const { error } = await stripe.redirectToCheckout({ 
      sessionId: data.sessionId 
    });
    if (error) {
      console.error("❌ [9] Stripe redirect error:", error);
      throw new Error(error.message || "Stripe redirect failed");
    }
  }
      } else {
        console.error("❌ [10] No URL or sessionId in response");
        throw new Error("No checkout URL received");
      }
      
    } catch (error: any) {
      console.error("💥 [11] Checkout error:", error);
      setMessages((prev) => [
        ...prev,
        { sender: "ai", text: `❌ Payment failed: ${error.message || "Please try again"}` }
      ]);
    } finally {
      console.log("🏁 [12] handleSubscribe finished");
      setIsLoading(false);
    }
  };

  // Enhanced trial count management with backend tracking
  const incrementTrialCount = async () => {
    const newCount = trialCount + 1;
    setTrialCount(newCount);
    localStorage.setItem("MZP_TRIAL_COUNT", newCount.toString());
    
    // Track trial usage in backend
    if (userId) {
      try {
        await incrementTrialCountBackend(userId);
        await trackUsage({
          userId,
          action: 'trial_used',
          symbol: symbol || undefined,
          capital: capital ? parseFloat(capital) : undefined
        });
      } catch (error) {
        console.error("Failed to track trial usage:", error);
      }
    }
    
    if (newCount >= 2) {
      setTrialUsed(true);
    }
    
    return newCount;
  };

  // Welcome message - show chat directly if has license or trial available
useEffect(() => {
  if ((hasLicense || !trialUsed) && messages.length === 0 && autoStart) {
    setTimeout(() => {
      const welcomeMessages: ChatMessage[] = [
        {
          sender: "ai" as const,
          text: "🤖 MZPrimer AI:\nWelcome! I'm your personal AI Trading Assistant. Let's analyze a strategic setup.",
        },
      ];

      // Only show trial message if user doesn't have a license
      if (!hasLicense) {
        welcomeMessages.push({
          sender: "ai" as const, 
          text: trialCount === 0 
            ? "🎉 You have 2 free trials remaining. Let's get started!" 
            : `🔄 You have ${2 - trialCount} free trial${2 - trialCount === 1 ? '' : 's'} remaining.`
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
}, [hasLicense, trialUsed, messages.length, trialCount, autoStart]);
  // Scroll to bottom when new messages arrive
  useEffect(() => {
    if (chatRef.current && !scrollLocked.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [messages]);

  // Enhanced chat log saving with usage tracking
  async function saveChatLogClient(userId: string, chatData: any) {
    try {
      // Save to your existing chatlogs collection
      await fetch("/api/saveChat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, chatData }),
      });

      // Enhanced: Track usage analytics
      if (userId) {
        const licenseKey = localStorage.getItem("MZP_LICENSE_KEY") || undefined;
        await saveAIAnalysis(userId, chatData, licenseKey);
      }
    } catch (err) {
      console.error("❌ Error saving chat:", err);
    }
  }

  // Main handler for user input
  const handleUserInput = async (input: string) => {
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
        { sender: "ai", text: `📊 ${DISPLAY_NAMES[selectedSymbol]}\nLive Price: ${price}` },
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

      // Increment trial count before processing
      const newTrialCount = await incrementTrialCount();

      setCapital(input);
      setMessages((prev) => [
        ...prev,
        { sender: "ai", text: "⏳ Fetching strategic setup..." },
      ]);
      setStep(3);

      let setup: ExtendedTradeSetupData | null = null;
      let price: number | null = null;

      try {
        setup = await fetchSetup(symbol) as ExtendedTradeSetupData;
        price = await fetchCurrentPrice(symbol);

        if (!setup) {
          setMessages((prev) => [
            ...prev,
            { sender: "ai", text: "⚠️ Setup not available. Try again later." },
          ]);
          setIsTyping(false);
          return;
        }

        const confidenceScore = setup.risk_score?.confidence_score ?? setup.confidence?.confidence_score ?? 50;
        const pip = CONTRACT_SIZES[symbol].pip;
        const contract = CONTRACT_SIZES[symbol].contract;

        // ✅ ENHANCED: Use PENDING ORDERS system with helper functions
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
          // ✅ USE PENDING ORDER DATA
          entryPrice = primaryOrder.entry_price;
          slPrice = primaryOrder.sl_price;
          tpPrice = primaryOrder.tp_price;
          rrRatio = primaryOrder.rr_ratio;
          orderType = primaryOrder.type;
          orderRationale = primaryOrder.rationale;
        } else {
          // Fallback to old entry_zone system if pending orders not available
          const entryZone = setup.entry_zone?.entry_zone || [0, 0];
          entryPrice = (entryZone[0] + entryZone[1]) / 2;
          slPrice = setup.tp_sl?.sl_level || entryPrice * 0.99;
          tpPrice = setup.tp_sl?.tp_level || entryPrice * 1.01;
          rrRatio = setup.tp_sl?.rr_ratio || 1.0;
          orderRationale = "Fallback to entry zone system";
        }

        const priceDifference = Math.abs(entryPrice - slPrice);
        const riskPerTradePerLot = priceDifference * contract;
        const maxRiskAmount = capitalNumber * 0.02;
        const lotSize = maxRiskAmount / (riskPerTradePerLot || 1);
        const actualRiskAmount = riskPerTradePerLot * lotSize;
        const riskPercentage = (actualRiskAmount / capitalNumber) * 100;
        const slDistanceUSD = Math.abs(slPrice - entryPrice) * contract * lotSize;
        const tpDistanceUSD = Math.abs(tpPrice - entryPrice) * contract * lotSize;

        const starRating = Math.min(5, Math.max(1, Math.floor(confidenceScore / 20)));
        const stars = "⭐".repeat(starRating) + "☆".repeat(5 - starRating);
        const signalStrength = confidenceScore < 60 ? "WEAK" : confidenceScore < 80 ? "MODERATE" : "STRONG";
        const signalWarning = confidenceScore < 60
          ? "⚠️ **LOW CONFIDENCE** – Consider waiting for better setup."
          : "✅ **CONFIRMED SETUP** – Trade looks promising.";

        // ✅ FIXED: Use centralized decimal mapping (MUST MATCH BACKEND)
        const getDecimalPlaces = (symbol: SymbolKey): number => {
          const decimalMap: Record<SymbolKey, number> = {
            // Forex
            "EURUSD": 5, "GBPUSD": 5, "USDJPY": 3, "USDCAD": 5, "AUDUSD": 5,
            "NZDUSD": 5, "USDCHF": 5, "EURJPY": 3, "EURGBP": 5, "GBPJPY": 3, "GBPCHF": 5,
            // Commodities
            "XAUUSD": 2, "XAUEUR": 2, "XAGUSD": 3, "XPTUSD": 2, "USCRUDE": 2,
            // Crypto
            "BTCUSD": 1, "ETHUSD": 2, "XRPUSD": 4, "DGEUSD": 4, "LTCUSD": 2,
            // Indices
            "SPX": 2, "NQ": 2, "YM": 2, "SX5E": 2, "CAC": 2, "FDAX": 1, "FTSE": 1,
          };
          return decimalMap[symbol] || 5; // Default to 5 decimals
        };

        const decimalPlaces = getDecimalPlaces(symbol);

        // ✅ ENHANCED: Dynamic summary with PENDING ORDERS info
        const summary: SummaryBlock[] = [
          {
            title: "🎯 Trade Signal",
            content:
              `• Symbol: <strong>${symbol} (${DISPLAY_NAMES[symbol]})</strong>\n` +
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

        // ✅ ENHANCED: Pending Orders Information Section
        if (hasValidOrders) {
          const ordersCount = allOrders.length;
          
          // Add Pending Orders section at the top
          summary.splice(1, 0, {
            title: "📋 Pending Orders Available",
            content:
              `• Total Orders: <strong>${ordersCount}</strong>\n` +
              `• Market Context: <strong>${marketContext}</strong>\n` +
              `• Order Confidence: <strong>${orderConfidence}%</strong>\n` +
              `• Primary Order: <strong>${orderType}</strong>\n` +
              `• Order Rationale: ${orderRationale}`
          });

          // ✅ OPTIONAL: Add additional orders details if you want to show all available orders
      
        } else {
          // Show that no pending orders are available
          summary.splice(1, 0, {
            title: "📋 Order Status",
            content: "• <strong>No pending orders available</strong>\n• Using fallback entry zone system"
          });
        }

        const summaryCards: ChatMessage[] = summary.map((block) => ({ 
          sender: "ai" as const, 
          text: [block] 
        }));

        const riskWarnings: SummaryBlock[] = [];
        if (lotSize > 100) {
          riskWarnings.push({
            title: "⚠️ Risk Warning",
            content: `Lot size ${lotSize.toFixed(2)} exceeds maximum. Reduce position.`,
          });
        }
        if (riskPercentage > 2.5) {
          riskWarnings.push({
            title: "⚠️ Risk Warning",
            content: `You're risking ${riskPercentage.toFixed(1)}% - Max recommended is 2%.`,
          });
        }

        if (riskWarnings.length > 0) {
          const warningCards: ChatMessage[] = riskWarnings.map((warning) => ({
            sender: "ai" as const,
            text: [warning],
          }));
          setMessages((prev) => [...prev, ...warningCards, ...summaryCards]);
        } else {
          scrollLocked.current = true;
          setMessages((prev) => [...prev, ...summaryCards]);
        }

        // ✅ ENHANCED: Add execution timing based on order type
        if (hasValidOrders) {
          let timingAdvice = "";
          if (orderType.includes("STOP")) {
            timingAdvice = "⏰ Wait for price to reach entry level for breakout confirmation";
          } else if (orderType.includes("LIMIT")) {
            timingAdvice = "⏰ Order will execute when price pulls back to entry level";
          }

          if (timingAdvice) {
            setMessages((prev) => [
              ...prev,
              {
                sender: "ai" as const,
                text: [{
                  title: "⏰ Execution Timing",
                  content: timingAdvice
                }]
              }
            ]);
          }
        }

        // Show trial limit message if this was the last trial
if (newTrialCount >= 2 && !hasLicense) {
  setMessages((prev) => [
    ...prev,
    {
      sender: "ai",
      text: [
        {
          title: "🚫 Trial Limit Reached",
          content: "You've used all 2 free trials. Subscribe or activate your license to continue using MZPrimer AI.",
        },
      ],
    },
  ]);
}

        if (userId && setup) {
          try {
            await saveChatLogClient(userId, {
              symbol,
              capital: capitalNumber,
              price,
              setup,
              lotSize,
              riskPercentage,
              orderType,
              hasPendingOrders: hasValidOrders,
              timestamp: Date.now(),
            });
          } catch (err) {
            console.error("❌ Failed to save chat log:", err);
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

  // === PAYWALL UI - Only show after 2 trials ===
  if (trialUsed && !hasLicense) {
    return (
      <div className="chatbot-locked">
        <div className="license-header">
          <h3>🔐 MZPrimer AI Assistant</h3>
          <p>You've used all 2 free trials. Upgrade to continue using advanced trading analysis.</p>
        </div>
        
        <div className="license-options">
          <div className="license-option">
            <h4>🎯 Subscribe Now</h4>
            <p>Get unlimited access to AI trading analysis</p>
            <button 
              onClick={() => setShowSubscribe(true)} 
              className="subscribe-button primary"
              disabled={isLoading}
            >
              {isLoading ? "Loading..." : "Subscribe Now"}
            </button>
          </div>
          
          <div className="license-option">
            <h4>🔑 Activate License</h4>
            <p>Already have a license key?</p>
            <button 
              onClick={() => setShowLicenseModal(true)} 
              className="license-button secondary"
            >
              Activate License
            </button>
          </div>
        </div>

        {showSubscribe && (
          <SubscribeModal
            onClose={() => setShowSubscribe(false)}
            onSubscribe={handleSubscribe}
          />
        )}

        {showLicenseModal && (
          <LicenseModal
            onSubmit={handleLicenseSubmit}
            onClose={() => setShowLicenseModal(false)}
          />
        )}
      </div>
    );
  }

  // === Main Chat UI - Show when has license OR trials available ===
  return (
    <div className={mode === "popup" ? "chatbot-popup" : "chatbot-section"}>
      {mode === "popup" && (
        <div className="chatbot-header">
          <div>MZPrimer AI Assistant</div>
          <button onClick={onClose} className="close-button">
            ✕
          </button>
        </div>
      )}

      <div className="chatbot-body" ref={chatRef}>
        {messages.map((msg, idx) => (
          <div key={idx} className={`chat-msg ${msg.sender === "ai" ? "ai" : "user"}`}>
            {Array.isArray(msg.text) ? (
              msg.text.map((block: any, i: number) => (
                <div className="ai-card" key={i}>
                  <div className="section-title">{block.title}</div>
                  <div
                    className="section-content"
                    dangerouslySetInnerHTML={{
                      __html: block.content.replace(/\n/g, "<br/>"),
                    }}
                  />
                </div>
              ))
            ) : (
              <div className={msg.sender === "user" ? "user-card" : "chat-text"}>
                <div
                  dangerouslySetInnerHTML={{
                    __html: msg.text.replace(/\n/g, "<br/>"),
                  }}
                />
              </div>
            )}
          </div>
        ))}
        {isTyping && <div className="chat-msg ai">⏳ Analyzing market data...</div>}
      </div>

      {/* Inputs */}
      {step === 1 && (
        <div className="chatbot-input">
          <select
            value={symbol || ""}
            onChange={(e) => {
              const selected = e.target.value as SymbolKey;
              if (selected) handleUserInput(selected);
            }}
            className="symbol-select"
          >
            <option value="">Select a symbol…</option>
            {SYMBOLS.map((sym) => (
              <option key={sym} value={sym}>
                {DISPLAY_NAMES[sym]} ({sym})
              </option>
            ))}
          </select>
        </div>
      )}

      {step === 2 && (
        <form
          className="chatbot-input"
          onSubmit={(e) => {
            e.preventDefault();
            if (!capital.trim()) return;
            handleUserInput(capital.trim());
          }}
        >
          <input
            type="number"
            name="input"
            value={capital}
            onChange={(e) => setCapital(e.target.value)}
            placeholder="Enter capital in USD…"
            autoComplete="off"
            min="1"
            step="0.01"
            className="capital-input"
          />
          <button type="submit" className="submit-button">
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
            className="reset-button"
          >
            {trialUsed && !hasLicense ? "Upgrade to Continue" : "Start New Analysis"}
          </button>
        </div>
      )}

      {showSubscribe && (
        <SubscribeModal
          onClose={() => setShowSubscribe(false)}
          onSubscribe={handleSubscribe}
        />
      )}
    </div>
  );
}

// Firebase analytics and trial management functions
// ✅ Check Trial Status
async function checkTrialStatus(userId: string): Promise<{ available: boolean; remaining: number }> {
  try {
    const response = await fetch("/api/AIchat/trial-status", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId }),
    });

    if (response.ok) return await response.json();

    throw new Error("Trial check failed");
  } catch (error) {
    console.error("Trial check fallback:", error);
    const savedTrialCount = localStorage.getItem("MZP_TRIAL_COUNT");
    const count = savedTrialCount ? parseInt(savedTrialCount) : 0;
    const remaining = Math.max(0, 2 - count);
    return { available: remaining > 0, remaining };
  }
}

// ✅ Increment Trial Count
async function incrementTrialCountBackend(userId: string) {
  try {
    await fetch("/api/AIchat/increment-trial", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId }),
    });
  } catch (error) {
    console.error("Failed to increment trial count:", error);
  }
}

// ✅ Track Usage
async function trackUsage(usageData: any) {
  try {
    await fetch("/api/AIchat/track-usage", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(usageData),
    });
  } catch (error) {
    console.error("Failed to track usage:", error);
  }
}

// ✅ Save AI Analysis
async function saveAIAnalysis(userId: string, chatData: any, licenseKey?: string) {
  try {
    await fetch("/api/AIchat/save-analysis", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, chatData, licenseKey }),
    });
  } catch (error) {
    console.error("Failed to save AI analysis:", error);
  }
}