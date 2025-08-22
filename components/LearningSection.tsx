'use client';
import type React from 'react';

export default function LearningSection() {
  // optional: keep the staggered animation delay var
  const d = (s: string) => ({ '--delay': s } as React.CSSProperties);

  return (
    <section id="learning" className="learning-section">
      <h2 className="section-title">Learn the Core Concepts of Trading</h2>
      <p className="section-subtitle">
        Deepen your knowledge with simplified explanations of key trading principles.
      </p>

      <div className="learning-grid">
        {/* Leverage */}
        <div className="learning-card" style={d('0.1s')}>
          <h3>Understanding Leverage</h3>
          <p>
            Leverage lets you control a larger position with less capital. With 1:100 leverage,
            a $100 margin can open a $10,000 position. Use with strict risk management.
          </p>
          <a
            href="https://www.litefinance.org/trading/forex-calculator/?uid=967798214&cid=325438&utm_source=mzprimer&utm_medium=web&utm_campaign=leverage_section"
            target="_blank"
            rel="noopener noreferrer"
            className="learn-btn"
          >
            Explore Leverage Calculator →
          </a>
        </div>

        {/* Spread */}
        <div className="learning-card" style={d('0.2s')}>
          <h3>What is a Spread?</h3>
          <p>
            The spread is the difference between bid and ask. Lower spreads generally reduce your
            trading cost and improve fills.
          </p>
          <a
            href="https://www.litefinance.org/trading/forex-calculator/?uid=967798214&cid=325438&utm_source=mzprimer&utm_medium=web&utm_campaign=spread_calculator"
            target="_blank"
            rel="noopener noreferrer"
            className="learn-btn"
          >
            Explore Forex Calculator →
          </a>
        </div>

        {/* Margin */}
        <div className="learning-card" style={d('0.3s')}>
          <h3>Margin & Position Sizing</h3>
          <p>
            Margin is the capital required to open/hold a trade. Proper position sizing is key to
            avoiding margin calls and large drawdowns.
          </p>
          <a
            href="https://www.litefinance.org/trading/forex-calculator/?uid=967798214&cid=325438&utm_source=mzprimer&utm_medium=web&utm_campaign=margin_sizing"
            target="_blank"
            rel="noopener noreferrer"
            className="learn-btn"
          >
            Margin Guide →
          </a>
        </div>

        {/* Market Reading */}
        <div className="learning-card" style={d('0.4s')}>
          <h3>Reading the Market</h3>
          <p>
            Combine technical structure with fundamentals and key events to identify trend, momentum,
            and inflection points.
          </p>
          <a
            href="https://www.litefinance.org/blog/analysts-opinions/?uid=967798214&cid=325438&utm_source=mzprimer&utm_medium=web&utm_campaign=reading_the_market"
            target="_blank"
            rel="noopener noreferrer"
            className="learn-btn"
          >
            View Market Insights →
          </a>
        </div>
      </div>
    </section>
  );
}