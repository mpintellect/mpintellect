'use client';
import ScrollAnimation from "@/components/ScrollAnimation";
export default function LearningSection() {
  return (
    <section id="learning" className="w-full max-w-7xl mx-auto">
      <div className="section-header">
        <h2 className="section-title">Learn the Core Concepts of Trading</h2>
        <p className="section-description">
          Deepen your knowledge with simplified explanations of key trading principles.
        </p>
      </div>

      <div className="learning-card-grid">

        {/* Leverage Card */}
        <div className="learning-card" style={{ '--delay': '0.2s' } as React.CSSProperties}>
          <h3 className="learning-title">Understanding Leverage</h3>
          <p className="learning-description">
            Leverage allows a trader to control a larger trade size with a smaller amount of capital.
            For example, with 1:100 leverage, a $100 margin can open a $10,000 position.
            While it enhances exposure, it also requires careful risk management.
          </p>
          <a
  href="https://www.litefinance.org/trading/forex-calculator/?uid=967798214&cid=325438&utm_source=mzprimer&utm_medium=web&utm_campaign=leverage_section"
  target="_blank"
  rel="noopener noreferrer"
  className="learning-button"
>
  Explore Leverage Calculator→
</a>
        </div>

        {/* Spread Card */}
        <div className="learning-card" style={{ '--delay': '0.2s' } as React.CSSProperties}>
          <h3 className="learning-title">What is a Spread?</h3>
          <p className="learning-description">
            A spread is the difference between the buying (ask) and selling (bid) price.
            For example, if EUR/USD has a bid of 1.1000 and ask of 1.1002, the spread is 2 pips.
            Lower spreads can improve trade efficiency.
          </p>
          <a
  href="https://www.litefinance.org/trading/forex-calculator/?uid=967798214&cid=325438&utm_source=mzprimer&utm_medium=web&utm_campaign=spread_calculator"
  target="_blank"
  rel="noopener noreferrer"
  className="learning-button"
>
  Explore Forex Calculator→
</a>
        </div>

        {/* Margin Card */}
        <div className="learning-card" style={{ '--delay': '0.2s' } as React.CSSProperties}>
          <h3 className="learning-title">Margin and Position Sizing</h3>
          <p className="learning-description">
            Margin is the amount required in your account to open a position.
            For example, with 1:100 leverage, a 1 lot EUR/USD trade might need ~$1,000 margin.
            Proper sizing helps avoid forced closures.
          </p>
          <a
  href="https://www.litefinance.org/trading/forex-calculator/?uid=967798214&cid=325438&utm_source=mzprimer&utm_medium=web&utm_campaign=margin_sizing"
  target="_blank"
  rel="noopener noreferrer"
  className="learning-button"
>
  Margin Guide→
</a>
        </div>

        {/* Market Reading Card */}
        <div className="learning-card" style={{ '--delay': '0.2s' } as React.CSSProperties}>
          <h3 className="learning-title">Reading the Market</h3>
          <p className="learning-description">
            Market analysis helps identify trends, patterns, and key events.
            Technical and fundamental tools are used to make informed trading decisions.
          </p>
          <a
  href="https://www.litefinance.org/blog/analysts-opinions/?uid=967798214&cid=325438&utm_source=mzprimer&utm_medium=web&utm_campaign=reading_the_market"
  target="_blank"
  rel="noopener noreferrer"
  className="learning-button"
>
  View Market Insights→
</a>
        </div>

      </div>
    </section>
  );
}