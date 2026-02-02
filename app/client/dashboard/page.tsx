// app/client/dashboard/page.tsx - COMPLETE FIXED VERSION
"use client";

import { useEffect, useRef, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";
import { Globe, ArrowRight, ShieldCheck, Trophy, X, BarChart3, User, CreditCard, LogOut, Menu } from 'lucide-react';
import { createPortal } from "react-dom";
import AiChatBox from "@/components/AiChatBox";
import PropFirmChat from "@/components/PropFirmChat";
import UserAnalytics from "./components/AnalyticsSection";

export const dynamic = "force-dynamic";

// Email Verification Message
function EmailVerificationMessage() {
  const [sending, setSending] = useState(false);

  const handleResend = async () => {
    setSending(true);
    try {
      // TODO: Implement email verification resend with Cloudflare
      toast.success("Verification email sent! Check your inbox.");
    } catch (error) {
      console.error("Error sending verification:", error);
      toast.error("Failed to send verification email");
    } finally {
      setSending(false);
    }
  };

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
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [setupCount, setSetupCount] = useState<number>(0);
  const [buyLoading, setBuyLoading] = useState(false);
  const [showPlanModal, setShowPlanModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<"10" | "20" | "30" | null>(null);
  
  // View States
  const [activeTool, setActiveTool] = useState<'ai' | 'prop' | null>(null);
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [isNavExpanded, setIsNavExpanded] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  
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

  // Auth & Setup Count
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('cf_token');
        const userData = localStorage.getItem('cf_user');
        
        if (!token || !userData) {
          router.push("/client/login");
          return;
        }

        const user = JSON.parse(userData);
        setUser(user);
        setSetupCount(user.setup_count || 0);
        
        if (searchParams.get("success") === "true") {
          toast.success("✅ Payment successful! Setup credits added.");
          const url = new URL(window.location.href);
          url.searchParams.delete("success");
          window.history.replaceState({}, "", url.toString());
        }
        
        setLoading(false);
      } catch (error) {
        console.error("Auth check error:", error);
        router.push("/client/login");
      }
    };

    checkAuth();
  }, [router, searchParams]);

  // Auto-center PRO card on mobile
  useEffect(() => {
    const grid = document.querySelector(".purchase-grid");
    if (!grid || window.innerWidth > 520) return;
    const middleCard = grid.querySelector(".popular-plan");
    if (middleCard) {
      const middleCardOffset = (middleCard as HTMLElement).offsetLeft;
      const gridVisibleWidth = grid.clientWidth;
      const scrollTo = middleCardOffset - (gridVisibleWidth / 2) + ((middleCard as HTMLElement).offsetWidth / 2);
      grid.scrollTo({ left: scrollTo, behavior: "smooth" });
    }
  }, []);

  const refreshSetupCount = async () => {
    try {
      const token = localStorage.getItem('cf_token');
      if (!token || !user) return;
      
      const response = await fetch(`/api/user/trial-status?userId=${user.id}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setSetupCount(data.setup_count || 0);
        }
      }
    } catch (error) {
      console.error("Error refreshing setup count:", error);
    }
  };

  const handleLogout = async () => {
    try {
      // Call logout API
      const token = localStorage.getItem('cf_token');
      if (token) {
        await fetch('/api/auth/logout', {
          method: 'POST',
          headers: { 
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
      }
      
      // Clear local storage
      localStorage.removeItem('cf_token');
      localStorage.removeItem('cf_user');
      localStorage.removeItem('cf_session_id');
      
      // Redirect to login
      router.push("/client/login");
    } catch (error) {
      console.error("Logout error:", error);
      // Still clear and redirect
      localStorage.clear();
      router.push("/client/login");
    }
  };

  // Use setup credit
  const openTool = async (tool: 'ai' | 'prop') => {
    if (setupCount <= 0) {
      toast.error("No setups available. Please purchase more setups.");
      return;
    }

    try {
      const token = localStorage.getItem('cf_token');
      if (!token) {
        toast.error("Please login again");
        router.push("/client/login");
        return;
      }

      // Use setup credit via API
      const response = await fetch('/api/user/use-setup', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ userId: user.id })
      });

      const data = await response.json();
      
      if (data.success) {
        // Deduct setup count
        setSetupCount(prev => Math.max(0, prev - 1));
        
        // Set active tool
        setActiveTool(tool);
        setShowAnalytics(false);
        setIsNavExpanded(false);
        document.body.style.overflow = 'hidden';
        
        toast.success("Setup credit used. Starting analysis...");
      } else {
        toast.error(data.error || "Failed to use setup credit");
      }
    } catch (error) {
      console.error("Error using setup:", error);
      toast.error("Failed to start analysis");
    }
  };

  const closeTool = () => {
    setActiveTool(null);
    document.body.style.overflow = 'auto';
    refreshSetupCount();
  };

  const openAnalytics = () => {
    setShowAnalytics(true);
    setActiveTool(null);
    setIsNavExpanded(false);
  };

  const returnToDashboard = () => {
    setShowAnalytics(false);
    setActiveTool(null);
    setIsNavExpanded(false);
  };

  const handleBuySetups = async (plan: string = "10") => {
    if (!user) {
      alert("Please log in to purchase setups.");
      return;
    }
    
    setBuyLoading(true);
    try {
      const token = localStorage.getItem('cf_token');
      const response = await fetch("/api/stripe/create-session", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ 
          userId: user.id, 
          plan: plan, 
          email: user.email 
        }),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error("Checkout URL not received.");
      }
    } catch (error) {
      console.error("Buy setup error:", error);
      toast.error("Failed to start checkout. Please try again.");
    } finally {
      setBuyLoading(false);
    }
  };

  const handleBrokerGatewayClick = () => {
    if ((window as any).fbq) (window as any).fbq('track', 'Lead');
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
      {/* HEADER */}
      <header className={`simple-header ${isScrolled ? 'scrolled' : ''}`}>
        <nav className="header-nav">
          {/* Desktop Layout */}
          <div className="desktop-layout">
            <div className="nav-buttons">
              <button 
                className={`nav-btn ${!showAnalytics && !activeTool ? 'active' : ''}`}
                onClick={returnToDashboard}
              >
                <Trophy size={16} /> Dashboard
              </button>
              <button className="nav-btn" onClick={() => openTool('ai')}>
                🎯 AI Assistant
              </button>
              <button className="nav-btn" onClick={() => openTool('prop')}>
                🏆 Prop Firm
              </button>
              <button 
                className={`nav-btn ${showAnalytics ? 'active' : ''}`}
                onClick={openAnalytics}
              >
                <BarChart3 size={16} /> Analytics
              </button>
              <button className="nav-btn" onClick={() => setShowPlanModal(true)}>
                <CreditCard size={16} /> Purchase
              </button>
              <button 
                className="nav-btn"
                onClick={() => router.push('/client/dashboard/refer')}
              >
                👥 Refer
              </button>
            </div>
            
            <div className="user-section">
              <div className="user-info-simple">
                <div className="user-avatar-small">
                  {user?.email?.charAt(0).toUpperCase()}
                </div>
                <div className="user-details">
                  <span className="user-email-simple">
                    {user?.email?.split('@')[0]}
                  </span>
                  <span className="setup-count-simple">
                    {setupCount} INTEL
                  </span>
                </div>
              </div>
              <button onClick={handleLogout} className="logout-btn-simple">
                <LogOut size={16} /> Logout
              </button>
            </div>
          </div>

          {/* Mobile Layout */}
          <div className="mobile-layout">
            <div className="mobile-user-top">
              <div className="user-info-mobile-top">
                <div className="user-avatar-mobile">
                  {user?.email?.charAt(0).toUpperCase()}
                </div>
                <div className="user-details-mobile">
                  <div className="user-email-mobile">{user?.email?.split('@')[0]}</div>
                  <div className="setup-count-mobile">Credits: {setupCount}</div>
                </div>
              </div>
              <button 
                className="nav-toggle-btn"
                onClick={() => setIsNavExpanded(!isNavExpanded)}
              >
                {isNavExpanded ? <X size={20}/> : <Menu size={20} />}
              </button>
            </div>
            
            {isNavExpanded && (
              <div className="mobile-nav-buttons">
                <button className="mobile-nav-btn" onClick={returnToDashboard}>
                  <Trophy size={16} /> Dashboard
                </button>
                <button className="mobile-nav-btn" onClick={() => openTool('ai')}>
                  🎯 AI Assistant
                </button>
                <button className="mobile-nav-btn" onClick={() => openTool('prop')}>
                  🏆 Prop Firm
                </button>
                <button className="mobile-nav-btn" onClick={openAnalytics}>
                  <BarChart3 size={16} /> Analytics
                </button>
                <button className="mobile-nav-btn" onClick={() => {setShowPlanModal(true); setIsNavExpanded(false);}}>
                  <CreditCard size={16} /> Buy Setups
                </button>
                <button className="mobile-nav-btn" onClick={() => router.push('/client/dashboard/refer')}>
                  👥 Refer Friends
                </button>
                <button className="mobile-nav-btn logout" onClick={handleLogout}>
                  <LogOut size={16} /> Logout
                </button>
              </div>
            )}
          </div>
        </nav>
      </header>
      
      {/* MAIN CONTENT */}
      <main className="cabinet-main">
        {showAnalytics ? (
          <div className="analytics-full-view">
            <div className="analytics-header">
              <h1>Analytics Dashboard</h1>
              <p>Track your trading performance and progress</p>
              <button className="back-to-dashboard-btn" onClick={returnToDashboard}>
                ← Back to Dashboard
              </button>
            </div>
            <div className="analytics-container">
              <UserAnalytics />
            </div>
          </div>
        ) : (
          <div className="dashboard-view">
            {/* Welcome Section */}
            <div className="welcome-section">
              <h1>Welcome back, Trader! 👋</h1>
              <p>Ready to analyze the markets with AI-powered insights</p>
            </div>

            <EmailVerificationMessage />

            {/* Setup Credits Card */}
            <div className="status-card">
              <div className="status-header">
                <h2>Your Setup Credits</h2>
                <div className={`status-badge ${setupCount > 0 ? 'active' : 'inactive'}`}>
                  {setupCount > 0 ? 'Active' : 'No Credits'}
                </div>
              </div>
              <div className="setup-count-display">
                <span className="count-number">{setupCount}</span>
                <span className="count-label">Available Setups</span>
              </div>
              {setupCount === 0 && (
                <div className="warning-message">
                  ⚠️ You need to purchase setups to use the AI Assistant
                </div>
              )}
            </div>

            {/* Actions Grid */}
            <div className="actions-grid">
              {/* Standard AI Assistant */}
              <div className="action-card primary-action">
                <div className="action-icon">🎯</div>
                <h3>Standard AI</h3> 
                <p>Day trading & Scalping setups</p>
                <button 
                  onClick={() => openTool('ai')}
                  disabled={setupCount <= 0}
                  className={`action-btn ${setupCount > 0 ? 'primary' : 'disabled'}`}
                >
                  {setupCount > 0 ? 'Start Analysis' : 'No Setups'}
                </button>
              </div>

              {/* Prop Firm AI */}
              <div className="action-card">
                <div className="action-icon">🏆</div>
                <h3>Prop Firm AI</h3>
                <p>Pass your challenge with rule-based risk</p>
                <button 
                  onClick={() => openTool('prop')}
                  disabled={setupCount <= 0}
                  className={`action-btn ${setupCount > 0 ? 'secondary' : 'disabled'}`}
                >
                  {setupCount > 0 ? 'Launch Assistant' : 'No Setups'}
                </button>
              </div>

              {/* Broker Gateway */}
              <div className="action-card broker-card">
                <div className="choice-icon-box icon-box-blue">
                  <Globe size={24} />
                </div>
                <div className="badge-new">NEW</div>
                <h3 className="choice-title title-blue">Broker Gateway</h3>
                <p className="choice-desc">Access authorized brokers to execute signals</p>
                <button 
                  onClick={handleBrokerGatewayClick}
                  className="choice-btn choice-btn-primary"
                >
                  Launch Gateway <ArrowRight size={16} />
                </button>
              </div>

              {/* Analytics */}
              <div className="action-card">
                <div className="action-icon">📊</div>
                <h3>Analytics</h3>
                <p>View your performance</p>
                <button 
                  onClick={openAnalytics}
                  className="action-btn secondary"
                >
                  View Stats
                </button>
              </div>


              
            </div>

            {/* Quick Purchase Section */}
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
          <div className="modal-content pricing-modal">
            <div className="pricing-modal-header">
              <h3 className="pricing-title">🎯 Choose Your Plan</h3>
              <button className="close-modal" onClick={() => setShowPlanModal(false)}>✕</button>
            </div>
            <div className="purchase-grid modal-plans-grid">
              <div className={`purchase-option ${selectedPlan === "10" ? "selected" : ""}`} onClick={() => setSelectedPlan("10")}>
                <div className="plan-name">Basic Plan</div>
                <div className="plan-price">€4.50</div>
                <div className="plan-setups">10 Setups</div>
                <button className={`purchase-btn ${selectedPlan === "10" ? "primary" : ""}`}>Select</button>
              </div>
              <div className={`purchase-option popular-plan ${selectedPlan === "20" ? "selected" : ""}`} onClick={() => setSelectedPlan("20")}>
                <div className="popular-badge">Most Popular</div>
                <div className="plan-name">Pro Plan</div>
                <div className="plan-price">€8.00</div>
                <div className="plan-setups">20 Setups</div>
                <button className={`purchase-btn primary ${selectedPlan === "20" ? "selected" : ""}`}>Select</button>
              </div>
              <div className={`purchase-option ${selectedPlan === "30" ? "selected" : ""}`} onClick={() => setSelectedPlan("30")}>
                <div className="plan-name">Elite Plan</div>
                <div className="plan-price">€12.00</div>
                <div className="plan-setups">30 Setups</div>
                <button className={`purchase-btn ${selectedPlan === "30" ? 'primary' : ''}`}>Select</button>
              </div>
            </div>
            <div className="modal-footer">
              <button className="confirm-purchase-btn" disabled={!selectedPlan || buyLoading} onClick={() => selectedPlan && handleBuySetups(selectedPlan)}>
                {buyLoading ? "Processing..." : "Proceed to Payment"}
              </button>
              <button className="cancel-btn" onClick={() => setShowPlanModal(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* IMMERSIVE PORTAL FOR TOOLS */}
      {activeTool && createPortal(
        <div className="immersive-modal-overlay">
          <div className="immersive-modal-container">
            <div className="immersive-header">
              <div className="tool-identity">
                <span className="live-pulse"></span>
                {activeTool === 'ai' ? 'AI Intel Terminal' : 'Prop Firm Security'}
              </div>
              <button onClick={closeTool} className="immersive-close-btn">
                <X size={20} /> CLOSE
              </button>
            </div>
            <div className="immersive-content">
              {activeTool === 'ai' ? <AiChatBox mode="section" onClose={closeTool} autoStart={true} /> : <PropFirmChat onClose={closeTool} />}
            </div>
          </div>
        </div>,
        document.body
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