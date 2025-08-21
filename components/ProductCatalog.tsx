'use client';

import { useState, useMemo } from 'react';

type Product = {
  id: string;
  name: string;
  priceUsd: number;
  short?: string;               // short tagline
  description?: string;         // long description for modal
  stats?: {
    riskReward?: string;        // e.g. "1:1.5"
    winRate?: string;           // e.g. "58%"
    avgMonthlyReturn?: string;  // e.g. "4–10%"
    timeframe?: string;         // e.g. "M5/M15"
    accountMin?: string;        // e.g. "$100"
  };
};

const PRODUCTS: Product[] = [
  {
    id: 'scalper',
    name: 'Scalper X1',
    priceUsd: 129,
    short: 'Ultra-fast scalping logic built for tight spreads.',
    description:
      'Scalper X1 is designed to capture quick, frequent moves on liquid pairs. It uses volatility filters, spread checks and time-of-day rules to avoid dead sessions. Works best on low-spread brokers (ECN), M5–M15 charts.',
    stats: {
      riskReward: '1:1.2 – 1:1.8',
      winRate: '55–62%',
      avgMonthlyReturn: '3–8% (typical with sensible risk)',
      timeframe: 'M5 / M15',
      accountMin: '$100',
    },
  },
  {
    id: 'fibonacci',
    name: 'Fibonacci Pro',
    priceUsd: 149,
    short: 'Retracement & extension confluence trader.',
    description:
      'Fibonacci Pro looks for swing structure and confluence zones to enter with confirmation. Suits swing–intra trades with moderate risk and clear targets.',
    stats: {
      riskReward: '1:1.5 – 1:2.5',
      winRate: '48–58%',
      avgMonthlyReturn: '2–6%',
      timeframe: 'M15 / H1',
      accountMin: '$150',
    },
  },
  {
    id: 'hedge',
    name: 'Hedge Matrix',
    priceUsd: 119,
    short: 'Market-neutral hedge logic to smooth equity curves.',
    description:
      'Hedge Matrix uses paired entries to reduce directional exposure, aiming for smoother equity growth during choppy sessions.',
    stats: {
      riskReward: 'Variable',
      winRate: '60–70%',
      avgMonthlyReturn: '2–5%',
      timeframe: 'M15 / H1',
      accountMin: '$200',
    },
  },
  {
    id: 'trendbot',
    name: 'Trend Seeker AI',
    priceUsd: 139,
    short: 'Adaptive trend-following with dynamic filters.',
    description:
      'Trend Seeker AI rides medium-term trends with trailing logic and volatility gates to avoid whipsaws.',
    stats: {
      riskReward: '1:2 – 1:3',
      winRate: '40–52%',
      avgMonthlyReturn: '3–7%',
      timeframe: 'M30 / H1',
      accountMin: '$150',
    },
  },
];

export default function ProductCatalog() {
  const [selected, setSelected] = useState<Product | null>(null);

  const items = useMemo(() => PRODUCTS, []);

  return (
    <>
      {/* Grid of products */}
      <div className="pc-grid">
        {items.map((p) => (
          <div key={p.id} className="pc-card">
            <div className="pc-card-head">
              <h3 className="pc-title">{p.name}</h3>
              <div className="pc-price">${p.priceUsd}</div>
            </div>
            {p.short && <p className="pc-short">{p.short}</p>}

            <div className="pc-actions">
              <a href={`/checkout?bot=${p.id}`} className="pc-btn pc-primary">
                Buy Now
              </a>
              <button
                type="button"
                className="pc-btn"
                onClick={() => setSelected(p)}
                aria-haspopup="dialog"
                aria-controls="product-modal"
              >
                Read More
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {selected && (
        <div
          id="product-modal"
          className="modal-backdrop"
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
          onClick={(e) => {
            if (e.target === e.currentTarget) setSelected(null);
          }}
        >
          <div className="modal">
            <div className="modal-header">
              <h3 id="modal-title" className="modal-title">
                {selected.name}
              </h3>
              <button
                className="modal-close"
                aria-label="Close"
                onClick={() => setSelected(null)}
              >
                ×
              </button>
            </div>

            <div className="modal-body">
              {selected.description ? (
                <p className="modal-desc">{selected.description}</p>
              ) : (
                <p className="modal-desc">No extra description available.</p>
              )}

              {/* Stats */}
              <div className="modal-stats">
                <Stat label="Risk/Reward" value={selected.stats?.riskReward} />
                <Stat label="Win Rate" value={selected.stats?.winRate} />
                <Stat label="Avg Monthly Return" value={selected.stats?.avgMonthlyReturn} />
                <Stat label="Timeframe" value={selected.stats?.timeframe} />
                <Stat label="Min Account" value={selected.stats?.accountMin} />
              </div>

              <div className="modal-note">
                Past performance does not guarantee future results. Use appropriate risk management.
              </div>
            </div>

            <div className="modal-footer">
              <a href={`/checkout?bot=${selected.id}`} className="pc-btn pc-primary">
                Get {selected.name}
              </a>
              <button className="pc-btn" onClick={() => setSelected(null)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function Stat({ label, value }: { label: string; value?: string }) {
  return (
    <div className="stat-item">
      <div className="stat-label">{label}</div>
      <div className="stat-value">{value || '-'}</div>
    </div>
  );
}