'use client';
import Link from "next/link";
import { useState } from 'react';

type TabKey = 'basics' | 'strategies' | 'risk';

const TABS: Record<TabKey, { title: string; bullets: string[]; ctaText: string; ctaHref: string }> = {
  basics: {
    title: 'Trading Basics 👣',
    bullets: [
      'What are pips, lots & leverage?',
      'Bid/Ask & spread explained in 60s',
      'Margin vs. free margin',
    ],
    ctaText: 'Start with the Forex Calculator →',
    ctaHref:
      'https://www.litefinance.org/trading/forex-calculator/?uid=967798214&cid=325438&utm_source=mzprimer&utm_medium=web&utm_campaign=learn_hub_basics',
  },
  strategies: {
    title: 'Simple Strategies ⚙️',
    bullets: [
      'Breakout vs. Pullback — when to use',
      'Support/Resistance the right way',
      'How to map confluence fast',
    ],
    ctaText: 'See Analysts’ Insights →',
    ctaHref:
      'https://www.litefinance.org/blog/analysts-opinions/?uid=967798214&cid=325438&utm_source=mzprimer&utm_medium=web&utm_campaign=learn_hub_strats',
  },
  risk: {
    title: 'Risk & Money Management 🛡️',
    bullets: [
      '2% rule, position sizing in 1 min',
      'Set SL/TP with structure, not hope',
      'Win-rate vs. R:R — what actually matters',
    ],
    ctaText: 'Position Size Helper →',
    ctaHref:
      'https://www.litefinance.org/trading/forex-calculator/?uid=967798214&cid=325438&utm_source=mzprimer&utm_medium=web&utm_campaign=learn_hub_risk',
  },
};

export default function LearningHub() {
  const [active, setActive] = useState<TabKey>('basics');
  const tab = TABS[active];

  return (
    <section id="learning" className="learn-hub">
      <div className="learn-wrap">
        <header className="learn-head">
          <h2 className="learn-title">Learn Faster, Trade Smarter</h2>
          <p className="learn-sub">Three mini tracks. Zero fluff. Pick one to begin.</p>
        </header>

        {/* Tabs */}
        <div className="learn-tabs" role="tablist" aria-label="Learning tracks">
          {(['basics', 'strategies', 'risk'] as TabKey[]).map((k) => (
            <button
              key={k}
              role="tab"
              aria-selected={active === k}
              className={`learn-tab ${active === k ? 'is-active' : ''}`}
              onClick={() => setActive(k)}
            >
              {TABS[k].title}
            </button>
          ))}
        </div>

        {/* Card */}
        <div className="learn-card" role="tabpanel">
          <ul className="learn-points">
            {tab.bullets.map((b, i) => (
              <li key={i} className="learn-point">• {b}</li>
            ))}
          </ul>

          <a
            href={tab.ctaHref}
            target="_blank"
            rel="noopener noreferrer"
            className="learn-cta"
          >
            {tab.ctaText}
          </a>

          {/* micro-notes */}
          <div className="learn-notes">
            <div className="mini">
              <span className="mini-k">Tip</span>
              <span className="mini-v">Use demo first; move to real after 20 consistent trades.</span>
            </div>
            <div className="mini">
              <span className="mini-k">Reminder</span>
              <span className="mini-v">One setup, one timeframe, one risk model — keep it boring.</span>
            </div>
          </div>
        </div>

        {/* Quick shortcuts */}
        <div className="learn-shortcuts">
          <a href="#market" className="chip">Weekly Levels</a>
          <a href="/blog" className="chip">Blog Guides</a>
          <a href="#accounts" className="chip">Open Account</a>
          <a href="#contacts" className="chip">Ask a Question</a>
        </div>
      </div>
    </section>
  );
}