'use client';

import { useState } from 'react';
import StickyLogo from './StickyLogo';

interface Stats {
  riskReward?: string;
  winRate?: string;
  avgMonthlyReturn?: string;
  timeframe?: string;
  accountMin?: string;
}

interface Bot { 
  id: string; 
  name: string; 
  price: string;            // e.g. "$10/mo" or "$50"
  available: boolean;
  short: string;
  description: string;
  features: string[];
  /** where the Buy button goes (use ?product=… for subscriptions) */
  href: string;
  /** small badge text like "Subscription" (optional) */
  badge?: string;
  stats?: Stats;
  originalPrice?: string;
}

export default function AIRobotCards() {
  const [selected, setSelected] = useState<Bot | null>(null);

  const robots: Bot[] = [
    {
      id: 'scalper',
      name: 'Scalper X1',
      short: 'Ultra-fast scalping built for tight spreads.',
      description:
        'Scalper X1 is designed to capture quick, frequent moves on liquid pairs. It uses volatility filters, spread checks, and time-of-day rules to avoid dead sessions. Works best on low-spread brokers (ECN), M5–M15 charts. Use sensible risk per trade and avoid news spikes.',
      price: '$50',
      available: true,
      href: '/checkout?bot=scalper', 
      features: ['MT5 Ready', '0.01–1.0 Lot Supported', 'Auto TP/SL', 'Backtested'],
      stats: {
        riskReward: '1:1.2 – 1:1.8',
        winRate: '55–62%',
        avgMonthlyReturn: '3–8% (typical with sensible risk)',
        timeframe: 'M5 / M15',
        accountMin: '$100'
      }
    },
    {
      id: 'ai-assistant-monthly',
      name: 'AI Assistant — Monthly',
      short: 'Unlimited Assistant scenarios & updates.',
      description:
        'Get full access to the AI Assistant with all features, regular updates, and priority improvements every month.',
      price: '$10/mo',
      available: true,
      href: '/checkout?product=ai-assistant-monthly',
      badge: 'Subscription',
      features: ['Unlimited scenarios', 'Priority improvements', 'Works across web app'],
    },
    {
      id: 'fibonacci',
      name: 'Fibonacci Pro',
      short: 'Retracement & extension confluence entries.',
      description:
        'Fibonacci Pro looks for swing structure and confluence zones, with confirmation logic to reduce false starts. Suits swing–intra trades with moderate risk and clear targets.',
      price: '$149',
      available: false,
      href: '/checkout?bot=fibonacci', // ← add this line
      features: ['Fibonacci-Based Logic', 'Auto Risk Management', 'Breakout Detection', 'Multi-Pair Compatible'],
      stats: {
        riskReward: '1:1.5 – 1:2.5',
        winRate: '48–58%',
        avgMonthlyReturn: '2–6%',
        timeframe: 'M15 / H1',
        accountMin: '$150'
      }
    },
    {
      id: 'hedge',
      name: 'Hedge Matrix',
      short: 'Paired entries to smooth equity in chop.',
      description:
        'Hedge Matrix uses balanced Buy/Sell logic across correlated behavior to reduce pure directional exposure and smooth equity during choppy sessions.',
      price: '$119',
      available: false,
      href: '/checkout?bot=hedge-matrix',
      features: ['Hedge Detection', 'Low Risk', 'Drawdown Control', 'Multiple Asset Use'],
      stats: {
        riskReward: 'Variable',
        winRate: '60–70%',
        avgMonthlyReturn: '2–5%',
        timeframe: 'M15 / H1',
        accountMin: '$200'
      }
    },
    {
      id: 'trendbot',
      name: 'Trend Seeker AI',
      short: 'Adaptive trend-following with filters.',
      description:
        'Trend Seeker AI rides medium-term trends with trailing logic and volatility gates to avoid whipsaws. Works best on trending pairs and higher timeframes.',
      price: '$139',
      available: false,
      href: '/checkout?bot=trend-seeker-ai',
      features: ['Trend Logic', 'Dynamic Trailing Stop', 'AI Signal Filters', 'Risk/Reward Balanced'],
      stats: {
        riskReward: '1:2 – 1:3',
        winRate: '40–52%',
        avgMonthlyReturn: '3–7%',
        timeframe: 'M30 / H1',
        accountMin: '$150'
      }
    },
    {
      id: 'ai-assistant-pro',
      name: 'AI Assistant — Pro Monthly',
      short: 'Pro tier for power users.',
      description:
        'Everything in Monthly plus higher limits and extras designed for power users.',
      price: '$30/mo',
      available: false,
      href: '/checkout?product=ai-assistant-pro',
      badge: 'Subscription',
      features: ['Higher limits', 'Priority support', 'All Monthly features'],
    },
  ];

  return (
    <section id="ai-robots" className="ai-robot-section">
      <div className="section-header">
        <StickyLogo />
        <h1 className="section-title">🤖 AI Robots Marketplace</h1>
        <p className="section-description">
          Choose your trading assistant and receive it instantly via email after payment.
        </p>
      </div>

      <div className="robot-card-grid">
        {robots.map((bot) => (
          <div key={bot.id} className="robot-card">
            <h3 className="robot-name">{bot.name}</h3>
            {bot.badge && (
  <div className="mt-2 inline-flex items-center rounded-full border border-emerald-800 bg-emerald-900/40 px-2 py-0.5 text-xs text-emerald-200">
    {bot.badge}
  </div>
)}
            <p className="robot-short">{bot.short}</p>
            <ul className="robot-features">
              {bot.features.map((f, i) => (
                <li key={i}>✅ {f}</li>
              ))}
            </ul>
            <div className="robot-card-footer">
  <div className="robot-price">{bot.price}</div>
  <div className="robot-actions">
    {bot.available ? (
  <a
    href={bot.href}
    className="robot-buy-button"
    data-cta="true"
    data-cta-name={`Buy Now – ${bot.name}`}
    data-ads-send-to="AW-16927724463/n3hlCNmcy6oaEK-n4oc_"
    data-value={bot.price?.replace(/[^0-9.]/g, '') || '0'}
    data-currency="USD"
  >
    Buy Now
  </a>
) : (
  <button className="robot-buy-button coming-soon" disabled>
    Coming Soon
  </button>
)}

    {bot.id.startsWith('ai-assistant') ? (
  <a
    href="/tools/ai-assistant"
    className="robot-readmore-button"
    data-cta="true"
    data-cta-name={`Read More – ${bot.name}`}
  >
    Read More
  </a>
) : (
  <button
    type="button"
    className="robot-readmore-button"
    data-cta="true"
    data-cta-name={`Read More – ${bot.name}`}
    onClick={() => setSelected(bot)}
    aria-haspopup="dialog"
    aria-controls="robot-modal"
  >
    Read More
  </button>
)}
  </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {selected && (
        <div
          id="robot-modal"
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
              <p className="modal-desc">{selected.description}</p>

              {/* Stats grid */}
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
              {selected.available ? (
                <a href={`/checkout?bot=${selected.id}`} className="pc-btn pc-primary">
                  Get {selected.name}
                </a>
              ) : (
                <button className="pc-btn" disabled>Unavailable</button>
              )}
              <button className="pc-btn" onClick={() => setSelected(null)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
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