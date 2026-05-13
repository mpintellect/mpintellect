// app/client/dashboard/page.tsx
"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useUser } from "@/app/hooks/useUser";
import { Globe, ArrowRight, Trophy, X, BarChart3, CreditCard, LogOut, Menu, Star, Zap, Shield, TrendingUp, LineChart } from 'lucide-react';
import { createPortal } from "react-dom";
import InstantChart from "@/components/InstantChart";
import AiChatBox from "@/components/AiChatBox";
import PropFirmChat from "@/components/PropFirmChat";
import UserAnalytics from "./components/AnalyticsSection";
import toast from "react-hot-toast";

export const dynamic = "force-dynamic";

function DashboardContent() {
  const { user, loading, setupCount, refreshUser, logout: logoutFromHook } = useUser();
  const [buyLoading, setBuyLoading] = useState(false);
  const [showPlanModal, setShowPlanModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<"10" | "20" | "30" | null>(null);
  const [activeTool, setActiveTool] = useState<'ai' | 'prop' | 'chart' | null>(null);
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [isNavExpanded, setIsNavExpanded] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  // Chart state
  const [chartData, setChartData] = useState<any>(null);
  const [selectedSymbol, setSelectedSymbol] = useState<string>("XAUUSD");
  const [chartCapital, setChartCapital] = useState<number>(10000);
  const [chartRiskPercent, setChartRiskPercent] = useState<number>(2);
  const [chartStrategy, setChartStrategy] = useState<"scalper" | "daytrader">("daytrader");
  const [chartLoading, setChartLoading] = useState(false);
  
  const router = useRouter();
  const searchParams = useSearchParams();

  // Handle query params
  useEffect(() => {
    if (searchParams.get("showPlans") === "true") {
      setShowPlanModal(true);
    }
    
    if (searchParams.get("status") === "new_user" || searchParams.get("new_user") === "true") {
      setShowPlanModal(true);
      const newUrl = window.location.pathname;
      window.history.replaceState({}, '', newUrl);
    }
  }, [searchParams]);

  // Redirect if not authenticated
  useEffect(() => {
    if (!loading && !user) {
      router.push("/client/login");
    }
  }, [user, loading, router]);

  const handleLogout = async () => {
    try {
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
      logoutFromHook();
      router.push("/client/login");
    } catch (error) {
      console.error("Logout error:", error);
      logoutFromHook();
      router.push("/client/login");
    }
  };
  // Fetch chart data when opening chart tool
  const fetchChartData = async (symbol: string, strategy: "scalper" | "daytrader") => {
    setChartLoading(true);
    try {
      const response = await fetch(`/api/setup?symbol=${symbol}&strategy=${strategy}`);
      if (!response.ok) throw new Error(`Failed to fetch: ${response.status}`);
      const data = await response.json();
      setChartData(data);
      return data;
    } catch (err) {
      console.error("Error fetching chart data:", err);
      toast.error("Failed to load chart data");
      return null;
    } finally {
      setChartLoading(false);
    }
  };
  const openTool = (tool: 'ai' | 'prop' | 'chart') => {
    if (!user) {
      toast.error("Please login to use this feature");
      return;
    }
    
    // Chart tool uses same credit system
    if (setupCount <= 0) {
      toast.error("No setups available. Please purchase more setups.");
      return;
    }

    // Just open the terminal. 
    // The credit is deducted inside the component ONLY when analysis is successful.
    setActiveTool(tool);
    setShowAnalytics(false);
    setIsNavExpanded(false);
    document.body.style.overflow = 'hidden';
  };

  // ✅ 2. Closes the tool and refreshes the data to show the new credit count
  const closeTool = () => {
    setActiveTool(null);
    document.body.style.overflow = 'auto';
    refreshUser(); // This ensures the dashboard sees the deduction made by the tool
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

  // ✅ 3. Fixed handleBuySetups - streamlined
  const handleBuySetups = async (plan: string = "10") => {
    if (!user) {
      toast.error("Please log in to purchase setups.");
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
      
      const data = await response.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error("Checkout session failed.");
      }
    } catch (error) {
      console.error("Stripe Redirect Error:", error);
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
      <div className="premium-loading">
        <div className="premium-spinner"></div>
        <p>Loading your dashboard...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="premium-loading">
        <div className="premium-spinner"></div>
        <p>Redirecting to login...</p>
      </div>
    );
  }

  return (
    <div className="premium-dashboard">
      {/* DESKTOP SIDEBAR - Now scrolls with page */}
      <aside className="premium-sidebar">
        <div className="premium-brand">
          INTEL <span className="premium-brand-gold">TRADER</span>
        </div>

        <nav className="premium-nav-menu desktop">
          <button 
            className={`premium-nav-item ${!showAnalytics && !activeTool ? 'active' : ''}`}
            onClick={returnToDashboard}
          >
            <Trophy size={18} className="premium-nav-icon" /> 
            <span>Portfolio</span>
          </button>
          
                    <button 
            className="premium-nav-item" 
            onClick={() => openTool('ai')}
            disabled={setupCount <= 0}
          >
            <Zap size={18} className="premium-nav-icon" /> 
            <span>AI </span>
            {setupCount <= 0 && <span className="premium-nav-badge">No Credits</span>}
          </button>
          
          <button 
            className="premium-nav-item" 
            onClick={() => openTool('chart')}
            disabled={setupCount <= 0}
          >
            <BarChart3 size={18} className="premium-nav-icon" /> 
            <span>Chart</span>
            {setupCount <= 0 && <span className="premium-nav-badge">No Credits</span>}
          </button>
          
          <button 
            className="premium-nav-item" 
            onClick={() => openTool('prop')}
            disabled={setupCount <= 0}
          >
            <Shield size={18} className="premium-nav-icon" /> 
            <span>Prop Firm</span>
            {setupCount <= 0 && <span className="premium-nav-badge">No Credits</span>}
          </button>
          
          <button 
            className={`premium-nav-item ${showAnalytics ? 'active' : ''}`}
            onClick={openAnalytics}
          >
            <TrendingUp size={18} className="premium-nav-icon" /> 
            <span>Performance</span>
          </button>
          
          <button className="premium-nav-item" onClick={() => setShowPlanModal(true)}>
            <CreditCard size={18} className="premium-nav-icon" /> 
            <span>Acquire Credits</span>
          </button>
          <button className="premium-nav-item" onClick={() => router.push('/client/dashboard/billing')}>
            <CreditCard size={18} className="premium-nav-icon" /> 
            <span>Billing</span>
          </button>
          <button className="premium-nav-item" onClick={() => router.push('/client/dashboard/refer')}>
            <Star size={18} className="premium-nav-icon" /> 
            <span>Refer</span>
          </button>
        </nav>

        <div className="premium-user-section">
          <div className="premium-user-info">
            <p className="premium-username">{user?.email}</p>
            <p className="premium-credits">{setupCount} CREDITS</p>
          </div>
          <button onClick={handleLogout} className="premium-nav-item" style={{ width: '100%', paddingLeft: 0 }}>
            <LogOut size={16} /> <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* MOBILE NAVIGATION - Burger Menu */}
      <nav className="premium-mobile-nav">
        
        
        <button 
          className={`premium-mobile-burger ${isMobileMenuOpen ? 'open' : ''}`}
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </nav>

      {/* MOBILE MENU */}
      <div className={`premium-mobile-menu ${isMobileMenuOpen ? 'open' : ''}`}>
        <div className="premium-mobile-items"style={{ paddingTop: '20px' }}>
          <button 
            className={`premium-mobile-item ${!showAnalytics && !activeTool ? 'active' : ''}`}
            onClick={() => {
              returnToDashboard();
              setIsMobileMenuOpen(false);
            }}
          >
            <Trophy size={18} className="premium-nav-icon" />
            <span>Portfolio</span>
          </button>
          
                    <button 
            className="premium-mobile-item"
            onClick={() => {
              openTool('ai');
              setIsMobileMenuOpen(false);
            }}
            disabled={setupCount <= 0}
          >
            <Zap size={18} className="premium-nav-icon" />
            <span>AI </span>
            {setupCount <= 0 && <span className="premium-mobile-badge">No Credits</span>}
          </button>
          
          <button 
            className="premium-mobile-item"
            onClick={() => {
              openTool('chart');
              setIsMobileMenuOpen(false);
            }}
            disabled={setupCount <= 0}
          >
            <BarChart3 size={18} className="premium-nav-icon" />
            <span>Chart</span>
            {setupCount <= 0 && <span className="premium-mobile-badge">No Credits</span>}
          </button>
          
          <button 
            className="premium-mobile-item"
            onClick={() => {
              openTool('prop');
              setIsMobileMenuOpen(false);
            }}
            disabled={setupCount <= 0}
          >
            <Shield size={18} className="premium-nav-icon" />
            <span>Prop Firm</span>
            {setupCount <= 0 && <span className="premium-mobile-badge">No Credits</span>}
          </button>
          
          <button 
            className={`premium-mobile-item ${showAnalytics ? 'active' : ''}`}
            onClick={() => {
              openAnalytics();
              setIsMobileMenuOpen(false);
            }}
          >
            <TrendingUp size={18} className="premium-nav-icon" />
            <span>Performance</span>
          </button>
          
          <button 
            className="premium-mobile-item"
            onClick={() => {
              setShowPlanModal(true);
              setIsMobileMenuOpen(false);
            }}
          >
            <CreditCard size={18} className="premium-nav-icon" />
            <span>Acquire Credits</span>
          </button>
          <button 
            className="premium-mobile-item"
            onClick={() => {
              router.push('/client/dashboard/billing');
              setIsMobileMenuOpen(false);
            }}
          >
            <CreditCard size={18} className="premium-nav-icon" />
            <span>Billing</span>
          </button>
          <button 
            className="premium-mobile-item"
            onClick={() => {
              router.push('/client/dashboard/refer');
              setIsMobileMenuOpen(false);
            }}
          >
            <Star size={18} className="premium-nav-icon" />
            <span>Refer</span>
          </button>
        </div>
        
        <div className="premium-mobile-user">
          <div className="premium-mobile-username">{user?.email}</div>
          <div className="premium-mobile-credits">{setupCount} CREDITS</div>
          <button 
            className="premium-mobile-logout"
            onClick={() => {
              handleLogout();
              setIsMobileMenuOpen(false);
            }}
          >
            <LogOut size={16} /> Sign Out
          </button>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <main className="premium-main">
        {showAnalytics ? (
          <div className="premium-analytics-view">
            <header style={{ marginBottom: '3rem' }}>
              <h1 style={{ fontWeight: 300 }}>Analytics Overview</h1>
              <button className="premium-action-btn" onClick={returnToDashboard}>Back</button>
            </header>
            <UserAnalytics />
          </div>
        ) : (
          <div className="premium-content">
            <div className="premium-welcome">
              <h1>Welcome, <span>{user?.email?.split('@')[0]}</span></h1>
            </div>
<p>The markets are waiting for your next move. Each candle represents an opportunity to trade.</p>
            <div className="premium-credits-card">
              <span>AVAILABLE SETUPS</span>
              <div className="premium-credits-number">{setupCount}</div>
            </div>

            <div className="premium-actions-grid">
              <div className="premium-action-card">
                <h3>STANDARD AI</h3>
                <p>Precision scalp setups based on institutional liquidity levels.</p>
                <div className="premium-action-footer">
                  <span className="premium-action-cost">1 credit/use</span>
                  <button 
                    onClick={() => openTool('ai')} 
                    className={`premium-action-btn ${setupCount > 0 ? '' : 'disabled'}`}
                    disabled={setupCount <= 0}
                  >
                    {setupCount > 0 ? 'Initialize' : 'No Credits'}
                  </button>
                </div>
              </div>

                            <div className="premium-action-card">
                <h3>PROP FIRM</h3>
                <p>Specialized risk-management AI designed for funding challenges.</p>
                <div className="premium-action-footer">
                  <span className="premium-action-cost">1 credit/use</span>
                  <button 
                    onClick={() => openTool('prop')} 
                    className={`premium-action-btn ${setupCount > 0 ? '' : 'disabled'}`}
                    disabled={setupCount <= 0}
                  >
                    {setupCount > 0 ? 'Initialize' : 'No Credits'}
                  </button>
                </div>
              </div>

              <div className="premium-action-card">
                <h3>INSTANT CHART</h3>
                <p>Institutional-grade technical charts with precise lot sizing and risk management.</p>
                <div className="premium-action-footer">
                  <span className="premium-action-cost">1 credit/use</span>
                  <button 
                    onClick={() => openTool('chart')} 
                    className={`premium-action-btn ${setupCount > 0 ? '' : 'disabled'}`}
                    disabled={setupCount <= 0}
                  >
                    {setupCount > 0 ? 'Initialize' : 'No Credits'}
                  </button>
                </div>
              </div>

              <div className="premium-action-card premium-broker-card">
                <div className="premium-badge-new">NEW</div>
                <h3>BROKER GATEWAY</h3>
                <p>Access authorized brokers to execute signals instantly.</p>
                <div className="premium-action-footer">
                  <span className="premium-action-cost">Free Access</span>
                  <button onClick={handleBrokerGatewayClick} className="premium-broker-btn">
                    Launch <ArrowRight size={14} />
                  </button>
                </div>
              </div>

              <div className="premium-action-card">
                <h3>ANALYTICS</h3>
                <p>Track your performance metrics and trading history.</p>
                <div className="premium-action-footer">
                  <span className="premium-action-cost">Free</span>
                  <button onClick={openAnalytics} className="premium-action-btn secondary">
                    View Stats
                  </button>
                </div>
              </div>
            </div>

            {/* Quick Purchase Section */}
            <div className="premium-purchase-section">
              <h2>Purchase Credits</h2>
              <p className="premium-section-subtitle">Choose the plan that fits your trading needs</p>
              
              <div className="premium-purchase-grid">
                {/* Basic Plan */}
                <div className="premium-plan-card">
                  <h3 className="premium-plan-name">BASIC</h3>
                  <p className="premium-plan-description">For occasional traders</p>
                  <div className="premium-plan-price">$5.00</div>
                  <div className="premium-plan-setups">10 Setups</div>
                  <ul className="premium-plan-features">
                    <li>✓ 10 setups </li>
                    <li>✓ Advanced Analytics</li>
                    <li>✓ 24/7 Support</li>
                  </ul>
                  <button
                    onClick={() => handleBuySetups("10")}
                    disabled={buyLoading}
                    className="premium-plan-btn"
                  >
                    {buyLoading ? "Processing..." : "Buy Now"}
                  </button>
                </div>

                {/* Pro Plan - Popular */}
                <div className="premium-plan-card popular">
                  <div className="premium-popular-badge">MOST POPULAR</div>
                  <h3 className="premium-plan-name">PRO</h3>
                  <p className="premium-plan-description">For active traders</p>
                  <div className="premium-plan-price">$9.50</div>
                  <div className="premium-plan-setups">20 Setups</div>
                  <ul className="premium-plan-features">
                    <li>✓ 20 setups </li>
                    <li>✓ Advanced Analytics</li>
                    <li>✓ 24/7 Support</li>
                  </ul>
                  <button
                    onClick={() => handleBuySetups("20")}
                    disabled={buyLoading}
                    className="premium-plan-btn primary"
                  >
                    {buyLoading ? "Processing..." : "Buy Now"}
                  </button>
                </div>

                {/* Elite Plan */}
                <div className="premium-plan-card">
                  <h3 className="premium-plan-name">ELITE</h3>
                  <p className="premium-plan-description">For professional traders</p>
                  <div className="premium-plan-price">$15.00</div>
                  <div className="premium-plan-setups">30 Setups</div>
                  <ul className="premium-plan-features">
                    <li>✓ 30 setups </li>
                    <li>✓ Advanced Analytics</li>
                    <li>✓ 24/7 Support</li>
                  </ul>
                  <button
                    onClick={() => handleBuySetups("30")}
                    disabled={buyLoading}
                    className="premium-plan-btn"
                  >
                    {buyLoading ? "Processing..." : "Buy Now"}
                  </button>
                </div>
              </div>
            </div>

            
          </div>
        )}
      </main>

      {/* Pricing Modal */}
      {showPlanModal && (
        <div className="premium-modal-overlay" onClick={() => setShowPlanModal(false)}>
          <div className="premium-modal" onClick={e => e.stopPropagation()}>
            <div className="premium-modal-header">
              <h3>Choose Your Plan</h3>
              <button className="premium-modal-close" onClick={() => setShowPlanModal(false)}>
                <X size={20} />
              </button>
            </div>
            
            <div className="premium-modal-plans">
              <div 
                className={`premium-modal-plan ${selectedPlan === "10" ? "selected" : ""}`}
                onClick={() => setSelectedPlan("10")}
              >
                <h4>Basic</h4>
                <div className="premium-modal-price">$5.00</div>
                <p>10 Setups</p>
                <button className={`premium-modal-select ${selectedPlan === "10" ? "selected" : ""}`}>
                  Select
                </button>
              </div>
              
              <div 
                className={`premium-modal-plan popular ${selectedPlan === "20" ? "selected" : ""}`}
                onClick={() => setSelectedPlan("20")}
              >
                <div className="premium-popular-tag">Best Value</div>
                <h4>Pro</h4>
                <div className="premium-modal-price">$9.50</div>
                <p>20 Setups</p>
                <button className={`premium-modal-select ${selectedPlan === "20" ? "selected" : ""}`}>
                  Select
                </button>
              </div>
              
              <div 
                className={`premium-modal-plan ${selectedPlan === "30" ? "selected" : ""}`}
                onClick={() => setSelectedPlan("30")}
              >
                <h4>Elite</h4>
                <div className="premium-modal-price">$15.00</div>
                <p>30 Setups</p>
                <button className={`premium-modal-select ${selectedPlan === "30" ? "selected" : ""}`}>
                  Select
                </button>
              </div>
            </div>
            
            <div className="premium-modal-footer">
              <button 
                className="premium-modal-btn secondary"
                onClick={() => setShowPlanModal(false)}
              >
                Cancel
              </button>
              <button 
                className="premium-modal-btn primary"
                disabled={!selectedPlan || buyLoading}
                onClick={() => selectedPlan && handleBuySetups(selectedPlan)}
              >
                {buyLoading ? "Processing..." : "Proceed to Payment"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Immersive Tool Portal */}
      {activeTool && createPortal(
        <div className="premium-tool-overlay">
          <div className="premium-tool-container">
            <div className="premium-tool-header">
              <div className="premium-tool-identity">
                <span className="premium-tool-pulse"></span>
                {activeTool === 'ai' ? 'AI Intel Terminal' : 'Prop Firm Security Mode'}
              </div>
              <button onClick={closeTool} className="premium-tool-close">
                <X size={20} /> CLOSE TERMINAL
              </button>
            </div>
            <div className="premium-tool-content">
                            {activeTool === 'chart' ? (
  <InstantChart onClose={closeTool} />
) : activeTool === 'ai' ? (
  <AiChatBox mode="section" onClose={closeTool} autoStart={true} />
) : (
  <PropFirmChat onClose={closeTool} />
)}
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
      <div className="premium-loading">
        <div className="premium-spinner"></div>
        <p>Loading dashboard...</p>
      </div>
    }>
      <DashboardContent />
    </Suspense>
  );
}