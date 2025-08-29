'use client';
import Link from "next/link";
import { useState } from 'react';

type TabKey = 'basics' | 'strategies' | 'risk';

const TABS: Record<
  TabKey,
  { title: string; bullets: string[]; ctaText: string; ctaHref: string; ctaName: string; adsSendTo?: string }
> = {
  basics: {
    title: 'Trading Basics 👣',
    bullets: [
      'What are pips, lots & leverage?',
      'Bid/Ask & spread explained in 60s',
      'Margin vs. free margin',
    ],
    ctaText: 'Start with the Forex Calculator →',
    ctaHref: '#mzcalc',
    ctaName: 'Start with the Forex Calculator',
    adsSendTo: 'AW-16927724463/n3hlCNmcy6oaEK-n4oc_',
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
      '-',
    ctaName: 'See Analysts Insights',
    adsSendTo: 'AW-16927724463/n3hlCNmcy6oaEK-n4oc_',
  },
  risk: {
    title: 'Risk & Money Management 🛡️',
    bullets: [
      '2% rule, position sizing in 1 min',
      'Set SL/TP with structure, not hope',
      'Win-rate vs. R:R — what actually matters',
    ],
    ctaText: 'Position Size Helper →',
    ctaHref: '#mzcalc',
    ctaName: 'Position Size Helper',
    adsSendTo: 'AW-16927724463/n3hlCNmcy6oaEK-n4oc_',
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

  {tab.ctaHref.startsWith('#') ? (
    <button
      type="button"
      className="learn-cta"
      onClick={() => {
        document.getElementById(tab.ctaHref.slice(1))?.scrollIntoView({ behavior: 'smooth' });
      }}
      // tracking hooks
      data-cta="true"
      data-cta-name={tab.ctaName || tab.ctaText}
      data-ads-send-to="AW-16927724463/n3hlCNmcy6oaEK-n4oc_"
      data-value="1.0"
      data-currency="MAD"
    >
      {tab.ctaText}
    </button>
  ) : (
    <a
      href={tab.ctaHref}
      target="_blank"
      rel="noopener noreferrer"
      className="learn-cta"
      // tracking hooks
      data-cta="true"
      data-cta-name={tab.ctaName || tab.ctaText}
      data-ads-send-to="AW-16927724463/n3hlCNmcy6oaEK-n4oc_"
      data-value="1.0"
      data-currency="MAD"
    >
      {tab.ctaText}
    </a>
  )}

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
          <a href="#aitrading" className="chip">AI Trading</a>
          <a href="#accounts" className="chip">Open Account</a>
          <Link href="/ai-robot" className="chip">Buy Trading Robot</Link>
        </div>
      </div>
    </section>
  );
}