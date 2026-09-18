'use client';
import React, { useState } from 'react';
import { createPortal } from "react-dom";
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { ShieldCheck, Trophy, X, TrendingUp, TrendingDown, Award } from 'lucide-react';
import PropFirmChat from "@/components/PropFirmChat";
import { useMarketSignals } from "@/app/hooks/useMarketSignals";
import { useSession } from "@/app/hooks/useSession";
import { getDecimals } from "@/app/lib/fetchData";

const fadeUp = (delay: number) => ({
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-80px" },
  transition: { duration: 0.55, delay, ease: [0.22, 1, 0.36, 1] as const },
});

const PROP_FIRMS = [
  { name: "FTMO", note: "Up to $400K" },
  { name: "FundedNext", note: "Up to $300K" },
  { name: "5%ers", note: "Up to $4M" },
  { name: "MFF", note: "Up to $600K" },
];

const PropFirmChatSection = ({ onLaunch }: { onLaunch?: (val: string) => void }) => {
  // Internal state for modal (same as main page)
  const [showModal, setShowModal] = useState(false);
  const [selectedSymbol, setSelectedSymbol] = useState<string | null>(null);
  const prefersReducedMotion = useReducedMotion();
  const signals = useMarketSignals();
  const { sessionName, isWeekend } = useSession();

  // Internal modal handlers
  const openModal = (symbol: string | null = null) => {
    setSelectedSymbol(symbol);
    setShowModal(true);
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedSymbol(null);
    document.body.style.overflow = 'auto';
  };

  const handleLaunch = (symbol: string) => {
    if (onLaunch && typeof onLaunch === 'function') {
      onLaunch(symbol);
    } else {
      openModal(symbol || null);
    }
  };

  // Quick assets array
  const quickAssets = ["XAUUSD", "BTCUSD", "US30", "EURUSD"];

  return (
    <>
      <section id="propfirm" className="ai-chat-section propfirm-section">
        <div className="ai-chat-container propfirm-container">
          <motion.span {...fadeUp(0)} className="aichat-badge propfirm-badge">
            <Award size={13} strokeWidth={2.2} />
            Prop Firm Compliant
          </motion.span>

          <motion.h2 {...fadeUp(0.08)} className="ai-chat-title propfirm-title">
            🏆 Prop Firm Challenge Assistant
          </motion.h2>
          <motion.p {...fadeUp(0.14)} className="ai-chat-subtitle propfirm-subtitle">
            Institutional compliance for challenge phases. Select an asset or a ruleset to initialize.
          </motion.p>

          {/* ASSET CTAs */}
          <motion.div {...fadeUp(0.18)} className="propfirm-grid-label">Assets</motion.div>
          <div className="propfirm-asset-grid">
            {quickAssets.map((sym, i) => {
              const live = signals.find((s) => s.symbol === sym);
              const isBuy = live?.action === "BUY";
              return (
                <motion.button
                  key={sym}
                  {...fadeUp(0.22 + i * 0.05)}
                  whileHover={prefersReducedMotion ? undefined : { y: -4 }}
                  whileTap={{ scale: 0.97 }}
                  className="propfirm-asset-card"
                  onClick={() => handleLaunch(sym)}
                  type="button"
                  aria-label={`Launch prop firm analysis for ${sym}`}
                >
                  <div className="propfirm-asset-top">
                    <span className="propfirm-asset-icon">
                      <ShieldCheck size={16} strokeWidth={2} />
                    </span>
                    {live && (
                      <span className={`aichat-live-chip ${isBuy ? "buy" : "sell"}`}>
                        {isBuy ? <TrendingUp size={11} /> : <TrendingDown size={11} />}
                        {live.confidence}%
                      </span>
                    )}
                  </div>
                  <span className="aichat-symbol-name">{sym}</span>
                  {live ? (
                    <span className={`aichat-symbol-price ${isBuy ? "buy" : "sell"}`}>
                      {live.current_price.toFixed(getDecimals(sym))}
                    </span>
                  ) : (
                    <span className="aichat-symbol-status">Verify Setup</span>
                  )}
                </motion.button>
              );
            })}
          </div>

          {/* RULESET CTAs */}
          <motion.div {...fadeUp(0.42)} className="propfirm-grid-label">Strategic Rulesets</motion.div>
          <div className="propfirm-firm-grid">
            {PROP_FIRMS.map((firm, i) => (
              <motion.button
                key={firm.name}
                {...fadeUp(0.46 + i * 0.05)}
                whileHover={prefersReducedMotion ? undefined : { y: -4 }}
                whileTap={{ scale: 0.97 }}
                className="propfirm-firm-card"
                onClick={() => handleLaunch("")}
                type="button"
                aria-label={`Apply ${firm.name} rules`}
              >
                <span className="propfirm-firm-icon">
                  <Trophy size={16} strokeWidth={2} />
                </span>
                <span className="propfirm-firm-name">{firm.name}</span>
                <span className="propfirm-firm-note">{firm.note}</span>
                <span className="propfirm-firm-status">Apply Rules</span>
              </motion.button>
            ))}
          </div>

          {/* Terminal Launch Card */}
          <motion.div
            {...fadeUp(0.7)}
            whileHover={prefersReducedMotion ? undefined : { y: -3 }}
            className="aichat-terminal-card propfirm-terminal-card"
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
            <div className="aichat-terminal-glow" aria-hidden />

            <div className="aichat-terminal-header">
              <span className="aichat-terminal-status">
                <span className="navbar-live-dot">
                  {!prefersReducedMotion && <span className="navbar-live-dot-ping" />}
                  <span className="navbar-live-dot-core" />
                </span>
                Risk Protocol: Calibrated
              </span>
              <span className="aichat-terminal-session">
                {isWeekend ? "Markets Closed" : `${sessionName} Session`}
              </span>
            </div>

            <motion.div
              className="aichat-terminal-icon"
              animate={prefersReducedMotion ? undefined : { y: [0, -6, 0] }}
              transition={{ duration: 3.4, repeat: Infinity, ease: "easeInOut" }}
            >
              <Trophy size={36} strokeWidth={1.6} />
            </motion.div>

            <button
              className="aichat-terminal-btn"
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleLaunch("");
              }}
            >
              Launch Challenge Assistant
            </button>

            <div className="aichat-terminal-footer">
              <ShieldCheck size={12} /> FTMO / MyForexFunds / FundedNext Compatible
            </div>

            <div className="aichat-scan-bar">
              <div className="aichat-scan-bar-fill" />
            </div>
          </motion.div>
        </div>
      </section>

      {/* INTERNAL MODAL - Only shows when onLaunch is NOT provided */}
      {typeof document !== "undefined" && createPortal(
        <AnimatePresence>
          {showModal && !onLaunch && (
            <motion.div
              className="aichat-modal-overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <motion.div
                className="aichat-modal-container"
                initial={{ opacity: 0, y: 24, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 16, scale: 0.98 }}
                transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              >
                <div className="aichat-modal-header">
                  <div className="aichat-modal-identity">
                    <span className="navbar-live-dot">
                      {!prefersReducedMotion && <span className="navbar-live-dot-ping" />}
                      <span className="navbar-live-dot-core" />
                    </span>
                    Prop Firm Security Protocol
                  </div>
                  <button onClick={closeModal} className="aichat-modal-close" aria-label="Close Prop Firm Assistant">
                    <X size={18} />
                  </button>
                </div>

                <div className="aichat-modal-content">
                  <PropFirmChat
                    onClose={closeModal}
                    preselectedSymbol={selectedSymbol}
                  />
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </>
  );
};

export default PropFirmChatSection;
