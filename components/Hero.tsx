"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import HeroMissionControl from "@/components/HeroMissionControl";

const ROTATING_WORDS = ["AI-Powered Insights", "Real-Time Signals", "Institutional Data"];
const WORD_INTERVAL_MS = 3200;

// Plain per-element initial/animate (no shared `variants` + `custom` on the
// ancestor motion.h1) deliberately - that pattern was propagating variant
// state down into the AnimatePresence-driven rotating word below and left
// it permanently stuck at opacity:0 (confirmed via getComputedStyle; not a
// timing fluke, it never recovered across repeated reloads).
const fadeUp = (delay: number) => ({
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] as const },
});

// Owns its own interval/state so the 3.2s tick only ever re-renders this
// leaf, not the whole Hero tree - when it lived in Hero's own state, every
// tick re-rendered the ancestor motion.h1/badge/etc mid-flight and froze
// their entrance animations at a torn opacity/transform snapshot (confirmed
// via getComputedStyle: opacity stuck at 0 while transform had partially
// progressed - a real Framer Motion re-render interaction, not a fluke).
function RotatingWord() {
  const [wordIndex, setWordIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setWordIndex((i) => (i + 1) % ROTATING_WORDS.length);
    }, WORD_INTERVAL_MS);
    return () => clearInterval(id);
  }, []);

  return (
    <span className="inline-block whitespace-nowrap text-[#3B82F6]">
      <AnimatePresence mode="wait">
        <motion.span
          key={ROTATING_WORDS[wordIndex]}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -16 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="inline-block"
        >
          {ROTATING_WORDS[wordIndex]}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}

export default function Hero() {
  const prefersReducedMotion = useReducedMotion();

  const scrollToAssistant = () => {
    document.getElementById("aiassistant")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <section className="hero-fade-bg relative isolate flex min-h-[90vh] items-center overflow-hidden px-6 pb-16 pt-12">
      {/* Floating blurred circles */}
      {!prefersReducedMotion && (
        <>
          <motion.div
            aria-hidden
            className="pointer-events-none absolute -left-24 top-10 h-72 w-72 rounded-full bg-[#60A5FA]/30 blur-3xl"
            animate={{ y: [0, 30, 0], x: [0, 20, 0] }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            aria-hidden
            className="pointer-events-none absolute right-[-6rem] top-1/3 h-96 w-96 rounded-full bg-[#3B82F6]/20 blur-3xl"
            animate={{ y: [0, -40, 0], x: [0, -15, 0] }}
            transition={{ duration: 13, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            aria-hidden
            className="pointer-events-none absolute bottom-[-4rem] left-1/3 h-64 w-64 rounded-full bg-[#60A5FA]/25 blur-3xl"
            animate={{ y: [0, 25, 0], rotate: [0, 15, 0] }}
            transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
          />
        </>
      )}

      <div className="hero-grid relative z-10 mx-auto w-full max-w-7xl items-center">
        {/* Left column: copy */}
        <div className="hero-copy">
          <motion.span
            {...fadeUp(0)}
            className="inline-flex items-center gap-2 rounded-full bg-[#3B82F6] px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-white"
          >
            AI-Powered Trading
          </motion.span>

          <motion.h1
            {...fadeUp(0.1)}
            className="hero-heading mt-6 font-extrabold leading-tight tracking-tight text-[#1E3A5F]"
          >
            Trade Smarter with <RotatingWord />
          </motion.h1>

          <motion.p
            {...fadeUp(0.2)}
            className="hero-subtitle mt-6 max-w-xl text-lg text-[#6B7280]"
          >
            Institutional-grade technical analysis, live signals, and AI-driven trade setups —
            built to help you cut through the noise and trade with an edge.
          </motion.p>

          <motion.div
            {...fadeUp(0.3)}
            className="hero-cta-row mt-8"
          >
            <button
              onClick={scrollToAssistant}
              className="rounded-full bg-[#3B82F6] px-8 py-3.5 text-sm font-semibold uppercase tracking-wide text-white shadow-[0_10px_30px_rgba(59,130,246,0.35)] transition hover:-translate-y-0.5 hover:bg-[#2563EB] hover:shadow-[0_14px_36px_rgba(59,130,246,0.45)]"
            >
              Get Started
            </button>
            <Link
              href="/#aitrading"
              className="rounded-full border border-[#3B82F6]/40 px-8 py-3.5 text-sm font-semibold uppercase tracking-wide text-[#1E3A5F] transition hover:border-[#3B82F6] hover:bg-[#3B82F6]/5"
            >
              Learn More
            </Link>
          </motion.div>
        </div>

        {/* Right column: live mission control panel */}
        <HeroMissionControl />
      </div>

      {/* Bouncing scroll indicator */}
      <motion.button
        type="button"
        onClick={scrollToAssistant}
        aria-label="Scroll to explore"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 0.6 }}
        className="absolute bottom-6 left-1/2 z-10 -translate-x-1/2 text-[#6B7280] transition hover:text-[#3B82F6]"
      >
        <motion.span
          animate={prefersReducedMotion ? undefined : { y: [0, 8, 0] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
          className="flex flex-col items-center gap-1"
        >
          <span className="text-[10px] font-medium uppercase tracking-widest">Scroll</span>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M6 9l6 6 6-6" />
          </svg>
        </motion.span>
      </motion.button>
    </section>
  );
}
