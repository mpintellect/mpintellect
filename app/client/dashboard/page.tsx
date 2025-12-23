"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { onAuthStateChanged, signOut, User, sendEmailVerification } from "firebase/auth";
import { auth, db } from "@/app/lib/firebaseClient";
import { doc, getDoc } from "firebase/firestore";
import toast from "react-hot-toast";
import AiChatBox from "@/components/AiChatBox";
import { useOneSetup } from "@/app/lib/firebase/useSetup";
import UserAnalytics from "./components/AnalyticsSection";
import { Globe, ArrowRight, ShieldCheck } from 'lucide-react';

export const dynamic = "force-dynamic";

// SIMPLE Email Verification Message (inline component)
function EmailVerificationMessage() {
  const [sending, setSending] = useState(false);

  const handleResend = async () => {
    if (!auth.currentUser) return;
    
    setSending(true);
    try {
      await sendEmailVerification(auth.currentUser);
      toast.success("Verification email sent! Check your inbox.");
    } catch (error) {
      console.error("Error sending verification:", error);
      toast.error("Failed to send verification email");
    } finally {
      setSending(false);
    }
  };

  // Don't show if email is already verified
  if (auth.currentUser?.emailVerified) {
    return null;
  }

  return (
    <div className="verify-message">
      <div className="verify-content">
        <span>📧</span>
        <div>
          <strong>Verify your email</strong> - Check your inbox for the verification link.
        </div>
        <button 
          onClick={handleResend}
          disabled={sending}
          className="verify-resend-btn"
        >
          {sending ? "Sending..." : "Resend"}
        </button>
      </div>
    </div>
  );
}

function DashboardContent() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [setupCount, setSetupCount] = useState<number>(0);
  const [buyLoading, setBuyLoading] = useState(false);
  const [showPlanModal, setShowPlanModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<"10" | "20" | "30" | null>(null);
  const [showAiChat, setShowAiChat] = useState(false);
  const [isNavExpanded, setIsNavExpanded] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [showAnalytics, setShowAnalytics] = useState(false);
  
  const router = useRouter();
  const searchParams = useSearchParams();  

  // Detect query param showPlans=true
  useEffect(() => {
    if (searchParams.get("showPlans") === "true") {
      setShowPlanModal(true);
    }
  }, [searchParams]);

  // Handle scroll
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      if (scrollTop > 50 && !isScrolled) setIsScrolled(true);
      else if (scrollTop <= 50 && isScrolled) setIsScrolled(false);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isScrolled]);

  // Auto-center PRO card on mobile
  useEffect(() => {
    const grid = document.querySelector(".purchase-grid");
    if (!grid || window.innerWidth > 520) return;
    const middleCard = grid.querySelector(".popular-plan");
    if (middleCard) {
      const gridWidth = grid.scrollWidth;
      const middleCardOffset = (middleCard as HTMLElement).offsetLeft;
      const gridVisibleWidth = grid.clientWidth;
      const scrollTo = middleCardOffset - (gridVisibleWidth / 2) + ((middleCard as HTMLElement).offsetWidth / 2);
      grid.scrollTo({ left: scrollTo, behavior: "smooth" });
    }
  }, []);

  const handleNavClick = (action: () => void) => {
    setIsNavExpanded(false);
    action();
  };

  const toggleNav = () => {
    setIsNavExpanded(!isNavExpanded);
  };

  // Auth & Setup Count
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (!firebaseUser) {
        router.push("/client/login");
      } else {
        setUser(firebaseUser);
        try {
          const userDocRef = doc(db, "users", firebaseUser.uid);
          const userSnap = await getDoc(userDocRef);
          if (userSnap.exists()) {
            const data = userSnap.data();
            setSetupCount(data.setupCount ?? 0);
          }
          if (searchParams.get("success") === "true") {
            toast.success("✅ Payment successful! Setup credits added.");
            const updatedSnap = await getDoc(userDocRef);
            if (updatedSnap.exists()) {
              setSetupCount(updatedSnap.data().setupCount ?? 0);
            }
            const url = new URL(window.location.href);
            url.searchParams.delete("success");
            window.history.replaceState({}, "", url.toString());
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
        setLoading(false);
      }
    });
    return () => unsubscribe();
  }, [router, searchParams]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.push("/client/login");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const handleBuySetups = async (plan: string = "10") => {
    if (!user) {
      alert("Please log in to purchase setups.");
      return;
    }
    setBuyLoading(true);
    try {
      const res = await fetch("/api/checkout/create-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ uid: user.uid, plan: plan, email: user.email }),
      });
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      const data = await res.json();
      if (data.url) window.location.href = data.url;
      else throw new Error("Checkout URL not received.");
    } catch (error) {
      console.error("Buy setup error:", error);
      alert("Failed to start checkout session. Please try again.");
    } finally {
      setBuyLoading(false);
    }
  };

  const handleUseSetup = async () => {
    if (setupCount <= 0) {
      alert("No setups available. Please purchase more setups.");
      return;
    }
    try {
      const result = await useOneSetup();
      if (result === "ok") {
        setSetupCount(prev => prev - 1);
        setShowAiChat(true);
        toast.success("🎯 Setup used! AI Assistant is ready for analysis.");
      } else if (result === "no-credits") {
        toast.error("❌ No setups available. Please purchase more.");
      } else {
        toast.error("⚠️ Error using setup. Please try again.");
      }
    } catch (error) {
      console.error("Error using setup:", error);
      toast.error("❌ Failed to use setup. Please try again.");
    }
  };

  const refreshSetupCount = async () => {
    if (user) {
      try {
        const userDocRef = doc(db, "users", user.uid);
        const userSnap = await getDoc(userDocRef);
        if (userSnap.exists()) {
          const data = userSnap.data();
          setSetupCount(data.setupCount ?? 0);
        }
      } catch (error) {
        console.error("Error refreshing setup count:", error);
      }
    }
  };

  const handleAiChatClose = () => {
    setShowAiChat(false);
    refreshSetupCount();
  };

  // Track broker gateway click for analytics
  const handleBrokerGatewayClick = () => {
  // Track event if needed
  if ((window as any).fbq) (window as any).fbq('track', 'Lead');
  
  // Redirect directly to the broker link in new tab
  window.open('https://www.litefinance.org/fr/?uid=967798214', '_blank', 'noopener,noreferrer');
};

  if (loading) {
    return (
      <div className="client-cabinet">
        <div className="cabinet-loading">
          <div className="loading-spinner"></div>
          <p>Loading your cabinet...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="client-cabinet">
      {/* Clean Header - No Logo, Just Buttons */}
      <header className="simple-header">
        <nav className="header-nav">
          {/* Desktop Layout - User section on the right */}
          <div className="desktop-layout">
            <div className="nav-buttons">
              <button 
                className={`nav-btn ${!showAiChat ? 'active' : ''}`}
                onClick={() => setShowAiChat(false)}
              >
                Dashboard
              </button>
              <button 
                className={`nav-btn ${showAiChat ? 'active' : ''}`}
                onClick={() => setupCount > 0 && setShowAiChat(true)}
                disabled={setupCount <= 0}
              >
                AI Assistant
              </button>
              <button 
                className={`nav-btn ${showAnalytics ? 'active' : ''}`}
                onClick={() => {
                  setShowAiChat(false);
                  setShowAnalytics(prev => !prev);
                }}
              >
                Analytics
              </button>
              <button 
                className="nav-btn"
                onClick={() => router.push('/client/dashboard/refer')}
              >
                Refer Friends
              </button>
            </div>
            
            <div className="user-section">
              <div className="user-info-simple">
                <div className="user-avatar-small">
                  {user?.email?.charAt(0).toUpperCase()}
                </div>
                <span className="user-email-simple">{user?.email}</span>
                <span className="setup-count-simple">
                  ({setupCount} setup{setupCount !== 1 ? 's' : ''})
                </span>
              </div>
              <button 
                onClick={handleLogout}
                className="logout-btn-simple"
              >
                Logout
              </button>
            </div>
          </div>

          {/* Mobile Layout - User section on top */}
          <div className="mobile-layout">
            <div className="mobile-user-top">
              <div className="user-info-mobile-top">
                <div className="user-avatar-mobile">
                  {user?.email?.charAt(0).toUpperCase()}
                </div>
                <div className="user-details-mobile">
                  <div className="user-email-mobile">{user?.email}</div>
                  <div className="setup-count-mobile">
                    {setupCount} setup{setupCount !== 1 ? 's' : ''} available
                  </div>
                </div>
              </div>
              <button 
                onClick={handleLogout}
                className="logout-btn-mobile"
              >
                Logout
              </button>
            </div>
            
            {/* Collapsible Navigation Section - Starts collapsed */}
            <div className={`mobile-nav-section ${isNavExpanded ? 'expanded' : 'collapsed'}`}>
              <button 
                className="nav-toggle-btn"
                onClick={toggleNav}
              >
                {isNavExpanded ? '−' : '☰'}
              </button>
              
              {isNavExpanded && (
                <div className="mobile-nav-buttons">
                  <button 
                    className={`mobile-nav-btn ${!showAiChat ? 'active' : ''}`}
                    onClick={() => handleNavClick(() => setShowAiChat(false))}
                  >
                    Dashboard
                  </button>
                  <button 
                    className={`mobile-nav-btn ${showAiChat ? 'active' : ''}`}
                    onClick={() => handleNavClick(() => {
                      if (setupCount > 0) setShowAiChat(true);
                    })}
                    disabled={setupCount <= 0}
                  >
                    AI Assistant
                  </button>
                  <button 
                    className={`mobile-nav-btn ${showAnalytics ? 'active' : ''}`}
                    onClick={() => handleNavClick(() => {
                      setShowAiChat(false);
                      setShowAnalytics(prev => !prev);
                    })}
                  >
                    Analytics
                  </button>
                  <button 
                    className="mobile-nav-btn"
                    onClick={() => handleNavClick(() => router.push('/client/dashboard/refer'))}
                  >
                    Refer Friends
                  </button>
                </div>
              )}
            </div>
          </div>
        </nav>
      </header>
      
      <main className="cabinet-main">
        {showAiChat ? (
          <div className="chat-view">
            <div className="chat-header">
              <h1>AI Trading Assistant</h1>
              <p>Analyze markets and get trading setups</p>
            </div>
            <div className="chat-container">
              <AiChatBox 
                mode="section" 
                onClose={handleAiChatClose}
                autoStart={true}
              />
            </div>
          </div>
        ) : (
          <div className="dashboard-view">
            <div className="welcome-section">
              <h1>Welcome back, Trader! 👋</h1>
              <p>Ready to analyze the markets with AI-powered insights</p>
            </div>

            {/* SIMPLE Email Verification Message */}
            <EmailVerificationMessage />

            {/* Setup Credits */}
            <div className="status-card">
              <div className="status-header">
                <h2>Your Setup Credits</h2>
                <div className={`status-badge ${setupCount > 0 ? 'active' : 'inactive'}`}>
                  {setupCount > 0 ? 'Active' : 'No Credits'}
                </div>
              </div>
              <div className="setup-count-display">
                <span className="count-number">{setupCount}</span>
                <span className="count-label">Setups Available</span>
              </div>
              {setupCount === 0 && (
                <div className="warning-message">
                  ⚠️ You need to purchase setups to use the AI Assistant
                </div>
              )}
            </div>

            {/* Actions Grid - Now with Broker Card */}
            <div className="actions-grid">
              {/* 1. Use Setup */}
              <div className="action-card primary-action">
                <div className="action-icon">🎯</div>
                <h3>Use Setup</h3> 
                <p>Analyze markets with AI Assistant</p>
                <button 
                  onClick={handleUseSetup}
                  disabled={setupCount <= 0}
                  className={`action-btn ${setupCount > 0 ? 'primary' : 'disabled'}`}
                >
                  {setupCount > 0 ? 'Start Analysis' : 'No Setups'}
                </button>
              </div>

              {/* 2. Buy Setups */}
              <div className="action-card">
                <div className="action-icon">💳</div>
                <h3>Buy Setups</h3>
                <p>Purchase more setup credits</p>
                <button 
                  onClick={() => {
                    document.getElementById('purchase-section')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="action-btn secondary"
                >
                  View Plans
                </button>
              </div>

              {/* Broker Gateway Card */}
              <div className="action-card broker-card">
                <div className="choice-icon-box icon-box-blue">
                  <Globe size={24} />
                </div>
                <div className="badge-new">NEW</div>
                
                <h3 className="choice-title title-blue">Broker Gateway</h3>
                <p className="choice-desc">
                  Access authorized brokers to execute your AI trading signals
                </p>
                
                <ul className="feature-list">
                  <li className="feature-item">
                    <ShieldCheck size={16} /> Regulated Partners
                  </li>
                  <li className="feature-item">
                    <ShieldCheck size={16} /> Fast Execution
                  </li>
                  <li className="feature-item">
                    <ShieldCheck size={16} /> Secure Integration
                  </li>
                </ul>
                
                <button 
                  onClick={handleBrokerGatewayClick}
                  className="choice-btn choice-btn-primary"
                >
                  Launch Gateway <ArrowRight size={16} />
                </button>
              </div>

              {/* 3. Refer Friends */}
              <div className="action-card">
                <div className="action-icon">👥</div>
                <h3>Refer Friends</h3>
                <p>Get 5 free setups per referral</p>
                <button 
                  className="action-btn secondary"
                  onClick={() => router.push('/client/dashboard/refer')}
                >
                  Refer Friends
                </button>
              </div>

              {/* 4. Analytics */}
              <div className="action-card">
                <div className="action-icon">📊</div>
                <h3>Analytics</h3>
                <p>View your trading history</p>
                <button 
                  onClick={() => {
                    setShowAiChat(false);
                    setShowAnalytics(prev => !prev);
                  }}
                  className="action-btn secondary"
                >
                  View Stats
                </button>
              </div>
            </div>

            {showAnalytics && (
              <div className="analytics-section mt-8">
                <UserAnalytics />
              </div>
            )}

            {/* Purchase Plans */}
            <div className="purchase-section" id="purchase-section">
              <h2>Quick Purchase</h2>
              <div className="purchase-grid">
                <div className="purchase-option">
                  <div className="plan-name">Basic</div>
                  <div className="plan-price">€4.50</div>
                  <div className="plan-setups">10 Setups</div>
                  <button
                    onClick={() => handleBuySetups("10")}
                    disabled={buyLoading}
                    className="purchase-btn"
                  >
                    {buyLoading ? "Processing..." : "Buy Now"}
                  </button>
                </div>

                <div className="purchase-option popular-plan">
                  <div className="popular-badge">Most Popular</div>
                  <div className="plan-name">Pro</div>
                  <div className="plan-price">€8.00</div>
                  <div className="plan-setups">20 Setups</div>
                  <button
                    onClick={() => handleBuySetups("20")}
                    disabled={buyLoading}
                    className="purchase-btn primary"
                  >
                    {buyLoading ? "Processing..." : "Buy Now"}
                  </button>
                </div>

                <div className="purchase-option">
                  <div className="plan-name">Elite</div>
                  <div className="plan-price">€12.00</div>
                  <div className="plan-setups">30 Setups</div>
                  <button
                    onClick={() => handleBuySetups("30")}
                    disabled={buyLoading}
                    className="purchase-btn"
                  >
                    {buyLoading ? "Processing..." : "Buy Now"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* PRICING MODAL */}
      {showPlanModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="pricing-modal-header">
              <h3 className="pricing-title">🎯 Choose Your Plan</h3>
              <button 
                className="close-modal"
                onClick={() => {
                  setShowPlanModal(false);
                  setSelectedPlan(null);
                }}
              >
                ✕
              </button>
            </div>

            <div className="purchase-grid modal-plans-grid">
              <div className={`purchase-option ${selectedPlan === "10" ? "selected" : ""}`}>
                <div className="plan-name">Basic Plan</div>
                <div className="plan-price">€4.50</div>
                <div className="plan-setups">10 Setups</div>
                <button 
                  className={`purchase-btn ${selectedPlan === "10" ? "primary" : ""}`}
                  onClick={() => setSelectedPlan("10")}
                >
                  {selectedPlan === "10" ? "Selected" : "Select"}
                </button>
              </div>

              <div className={`purchase-option popular-plan ${selectedPlan === "20" ? "selected" : ""}`}>
                <div className="popular-badge">Most Popular</div>
                <div className="plan-name">Pro Plan</div>
                <div className="plan-price">€8.00</div>
                <div className="plan-setups">20 Setups</div>
                <button 
                  className={`purchase-btn primary ${selectedPlan === "20" ? "selected" : ""}`}
                  onClick={() => setSelectedPlan("20")}
                >
                  {selectedPlan === "20" ? "Selected" : "Select"}
                </button>
              </div>

              <div className={`purchase-option ${selectedPlan === "30" ? "selected" : ""}`}>
                <div className="plan-name">Elite Plan</div>
                <div className="plan-price">€12.00</div>
                <div className="plan-setups">30 Setups</div>
                <button 
                  className={`purchase-btn ${selectedPlan === "30" ? "primary" : ""}`}
                  onClick={() => setSelectedPlan("30")}
                >
                  {selectedPlan === "30" ? "Selected" : "Select"}
                </button>
              </div>
            </div>

            <div className="modal-footer">
              <button
                className="confirm-purchase-btn"
                disabled={!selectedPlan || buyLoading}
                onClick={() => {
                  if (selectedPlan) handleBuySetups(selectedPlan);
                  setShowPlanModal(false);
                }}
              >
                {buyLoading ? "Processing..." : "Proceed to Payment"}
              </button>
              <button
                className="cancel-btn"
                onClick={() => {
                  setShowPlanModal(false);
                  setSelectedPlan(null);
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      
    </div>
  );
}

export default function DashboardPage() {
  return (
    <Suspense fallback={
      <div className="client-cabinet">
        <div className="cabinet-loading">
          <div className="loading-spinner"></div>
          <p>Loading dashboard...</p>
        </div>
      </div>
    }>
      <DashboardContent />
    </Suspense>
  );
}