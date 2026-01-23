'use client';
import React, { useState } from 'react';
import { createPortal } from "react-dom";
import { ShieldCheck, Trophy, X } from 'lucide-react';
import PropFirmChat from "@/components/PropFirmChat";

const PropFirmChatSection = ({ onLaunch }: { onLaunch?: (val: string) => void }) => {
  // Internal state for modal (same as main page)
  const [showModal, setShowModal] = useState(false);
  const [selectedSymbol, setSelectedSymbol] = useState<string | null>(null);

  // Internal modal handlers
  const openModal = (symbol: string | null = null) => {
    console.log('🔵 Opening modal with symbol:', symbol);
    setSelectedSymbol(symbol);
    setShowModal(true);
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedSymbol(null);
    document.body.style.overflow = 'auto';
  };

  // ✅ FIXED: This function wraps the click handler
  const handleLaunch = (symbol: string) => {
    if (onLaunch && typeof onLaunch === 'function') {
      // Use the provided onLaunch function from parent (for main page)
      onLaunch(symbol);
    } else {
      // Use internal modal logic (for PropFirmPage)
      console.log('Using internal modal logic for symbol:', symbol);
      openModal(symbol);
    }
  };

  return (
    <>
      <section id="propfirm" className="ai-chat-section">
        <div className="ai-chat-container">
          <h2 className="ai-chat-title">🏆 Prop Firm Challenge Assistant</h2>
          <p className="ai-chat-subtitle">Institutional compliance for challenge phases. Select an asset or a ruleset to initialize.</p>
          
          {/* ASSET CTAs */}
          <div className="launch-grid-label">Intelligence Assets</div>
          <div className="symbol-launch-grid mb-6">
            {["XAUUSD", "BTCUSD", "US30", "EURUSD"].map(sym => (
              <button 
                key={sym} 
                className="symbol-launch-btn prop-style" 
                // ✅ CRITICAL FIX: Call handleLaunch NOT onLaunch directly
                onClick={() => handleLaunch(sym)}
                type="button"
                aria-label={`Launch prop firm analysis for ${sym}`}
              >
                <span className="sym-name">{sym}</span>
                <span className="sym-status">Verify Setup</span>
              </button>
            ))}
          </div>

          {/* COMPANY CTAs */}
          <div className="launch-grid-label">Strategic Rulesets</div>
          <div className="symbol-launch-grid mb-10">
            {["FTMO", "FundedNext", "5%ers", "MFF"].map(firm => (
              <button 
                key={firm} 
                className="symbol-launch-btn firm-style" 
                // ✅ CRITICAL FIX: Call handleLaunch NOT onLaunch directly
                onClick={() => handleLaunch("")}
                type="button"
                aria-label={`Apply ${firm} rules`}
              >
                <span className="sym-name">{firm}</span>
                <span className="sym-status">Apply Rules</span>
              </button>
            ))}
          </div>

          {/* Original Terminal Card */}
          <div 
            className="launch-terminal-card gold-accent" 
            // ✅ CRITICAL FIX: Call handleLaunch NOT onLaunch directly
            onClick={() => handleLaunch("")}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                handleLaunch("");
                e.preventDefault();
              }
            }}
            aria-label="Launch Prop Firm Challenge Assistant"
          >
            <div className="launch-header">
              <div className="pulse-indicator gold"></div>
              <span>Risk Protocol: Calibrated</span>
            </div>
            <div className="launch-icon-box text-amber-500">
              <Trophy size={32} strokeWidth={1.5} />
            </div>
            <button 
              className="launch-terminal-btn gold"
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleLaunch("");
              }}
            >
              Launch Challenge Assistant
            </button>
            <div className="launch-footer-text">
              <ShieldCheck size={12} /> FTMO / MyForexFunds / FundedNext Compatible
            </div>
          </div>
        </div>
      </section>

      {/* INTERNAL MODAL - Only shows when onLaunch is NOT provided */}
      {showModal && !onLaunch && typeof document !== "undefined" && createPortal(
        <div className="immersive-modal-overlay">
          <div className="immersive-modal-container">
            <div className="immersive-header">
              <div className="tool-identity">
                <span className="live-pulse"></span>
                Prop Firm Security Protocol
              </div>
              <button onClick={closeModal} className="immersive-close-btn">
                <X size={24} /> <span>CLOSE</span>
              </button>
            </div>

            <div className="immersive-content">
              <PropFirmChat 
                onClose={closeModal} 
                preselectedSymbol={selectedSymbol}
              />
            </div>
          </div>
        </div>,
        document.body
      )}
    </>
  );
};

export default PropFirmChatSection;