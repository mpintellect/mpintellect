'use client';
import React, { useState } from 'react';
import { createPortal } from "react-dom";
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { Bot, Zap, X, TrendingUp, TrendingDown, Sparkles } from 'lucide-react';
import AiChatBox from "@/components/AiChatBox";
import { useMarketSignals } from "@/app/hooks/useMarketSignals";
import { useSession } from "@/app/hooks/useSession";
import { getDecimals } from "@/app/lib/fetchData";

const fadeUp = (delay: number) => ({
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-80px" },
  transition: { duration: 0.55, delay, ease: [0.22, 1, 0.36, 1] as const },
});

const AiChatSection = ({ onLaunch }: { onLaunch?: (sym: string) => void }) => {
  // Internal state for modal
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

  const handleSymbolClick = (symbol: string) => {
    if (onLaunch && typeof onLaunch === 'function') {
      onLaunch(symbol);
    } else {
      openModal(symbol);
    }
  };

  const handleTerminalLaunch = () => {
    if (onLaunch && typeof onLaunch === 'function') {
      onLaunch(""); // Empty string for full terminal launch
    } else {
      openModal(null);
    }
  };

  // Quick symbols array
  const quickSymbols = ["XAUUSD", "BTCUSD", "EURUSD", "USDJPY"];

  return (
    <>
      <section id="aiassistant" className="ai-chat-section aichat-section">
        <div className="ai-chat-container aichat-container">
          <motion.span
            {...fadeUp(0)}
            className="aichat-badge"
          >
            <Sparkles size={13} strokeWidth={2.2} />
            AI-Powered Analysis
          </motion.span>

          <motion.h2 {...fadeUp(0.08)} className="ai-chat-title aichat-title">
            AI Intel Terminal
          </motion.h2>
          <motion.p {...fadeUp(0.14)} className="ai-chat-subtitle aichat-subtitle">
            Direct access to institutional technical analysis. Select an asset to begin.
          </motion.p>

          {/* Quick Symbol Grid */}
          <div className="aichat-symbol-grid">
            {quickSymbols.map((sym, i) => {
              const live = signals.find((s) => s.symbol === sym);
              const isBuy = live?.action === "BUY";
              return (
                <motion.button
                  key={sym}
                  {...fadeUp(0.18 + i * 0.06)}
                  whileHover={prefersReducedMotion ? undefined : { y: -4 }}
                  whileTap={{ scale: 0.97 }}
                  className="aichat-symbol-card"
                  onClick={() => handleSymbolClick(sym)}
                  type="button"
                  aria-label={`Launch AI analysis for ${sym}`}
                >
                  <div className="aichat-symbol-top">
                    <span className="aichat-symbol-icon">
                      <Zap size={16} strokeWidth={2} />
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
                    <span className="aichat-symbol-status">Analyze</span>
                  )}
                </motion.button>
              );
            })}
          </div>

          {/* Terminal Launch Card */}
          <motion.div
            {...fadeUp(0.42)}
            whileHover={prefersReducedMotion ? undefined : { y: -3 }}
            className="aichat-terminal-card"
            onClick={handleTerminalLaunch}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                handleTerminalLaunch();
                e.preventDefault();
              }
            }}
            aria-label="Launch full AI Intel Terminal"
          >
            <div className="aichat-terminal-glow" aria-hidden />

            <div className="aichat-terminal-header">
              <span className="aichat-terminal-status">
                <span className="navbar-live-dot">
                  {!prefersReducedMotion && <span className="navbar-live-dot-ping" />}
                  <span className="navbar-live-dot-core" />
                </span>
                System Status: Online
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
              <Bot size={40} strokeWidth={1.6} />
            </motion.div>

            <button
              className="aichat-terminal-btn"
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleTerminalLaunch();
              }}
            >
              Launch AI Intel Terminal
            </button>

            <div className="aichat-terminal-footer">
              <Zap size={12} /> Instant technical analysis available
            </div>

            <div className="aichat-scan-bar">
              <div className="aichat-scan-bar-fill" />
            </div>
          </motion.div>
        </div>
      </section>

      {/* INTERNAL AI MODAL - Only shows when onLaunch is NOT provided */}
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
                    AI Intel Terminal
                  </div>
                  <button onClick={closeModal} className="aichat-modal-close" aria-label="Close AI Terminal">
                    <X size={18} />
                  </button>
                </div>

                <div className="aichat-modal-content">
                  <AiChatBox
                    mode="section"
                    onClose={closeModal}
                    autoStart={true}
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

export default AiChatSection;
