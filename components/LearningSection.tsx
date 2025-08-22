'use client';
import type React from 'react'; // <-- type-only; no runtime cost

export default function LearningSection() {
  const d = (s: string) => ({ '--delay': s } as React.CSSProperties);

  return (
    <section id="learning" className="w-full max-w-7xl mx-auto">
      <div className="section-header">
        <h2 className="section-title">Learn the Core Concepts of Trading</h2>
        <p className="section-description">
          Deepen your knowledge with simplified explanations of key trading principles.
        </p>
      </div>

      <div className="learning-card-grid">
        <div className="learning-card" style={d('0.1s')}>
          <h3 className="learning-title">Understanding Leverage</h3>
          <p className="learning-description">
            Leverage allows a trader to control a larger trade size with a smaller amount of capital.
            For example, with 1:100 leverage, a $100 margin can open a $10,000 position.
            While it enhances exposure, it also requires careful risk management.
          </p>
          <a
            href="https://www.litefinance.org/trading/forex-calculator/?uid=967798214&cid=325438&utm_source=mzprimer&utm_medium=web&utm_campaign=leverage_section"
            target="_blank" rel="noopener noreferrer" className="learning-button"
          >
            Explore Leverage Calculator →
          </a>
        </div>

        <div className="learning-card" style={d('0.2s')}>
          <h3 className="learning-title">What is a Spread?</h3>
          <p className="learning-description">
            A spread is the difference between the buying (ask) and selling (bid) price.
            It represents the cost of trading and can vary based on market conditions.
          </p>
          <a
            href="https://www.litefinance.org/trading/forex-calculator/?uid=967798214&cid=325438&utm_source=mzprimer&utm_medium=web&utm_campaign=spread_calculator"
            target="_blank" rel="noopener noreferrer" className="learning-button"
          >
            Explore Forex Calculator →
          </a>
        </div>

        <div className="learning-card" style={d('0.3s')}>
          <h3 className="learning-title">Margin and Position Sizing</h3>
          <p className="learning-description">
            Margin is the amount required in your account to open a position.
            It is usually expressed as a percentage of the full position size.
            Proper position sizing is crucial for effective risk management.
          </p>
          <a
            href="https://www.litefinance.org/trading/forex-calculator/?uid=967798214&cid=325438&utm_source=mzprimer&utm_medium=web&utm_campaign=margin_sizing"
            target="_blank" rel="noopener noreferrer" className="learning-button"
          >
            Margin Guide →
          </a>
        </div>

        <div className="learning-card" style={d('0.4s')}>
          <h3 className="learning-title">Reading the Market</h3>
          <p className="learning-description">
            Market analysis helps identify trends, patterns, and key events that can impact price movements.
            Technical and fundamental tools are used to make informed trading decisions.
          </p>
          <a
            href="https://www.litefinance.org/blog/analysts-opinions/?uid=967798214&cid=325438&utm_source=mzprimer&utm_medium=web&utm_campaign=reading_the_market"
            target="_blank" rel="noopener noreferrer" className="learning-button"
          >
            View Market Insights →
          </a>
        </div>
      </div>
    </section>
  );
}