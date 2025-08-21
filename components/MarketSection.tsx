'use client';

import { useState } from 'react';

const assets = [
  { id: 'gold', label: 'Gold' },
  { id: 'btc', label: 'BTC' },
  { id: 'eurusd', label: 'EUR/USD' },
  { id: 'nasdaq', label: 'NASDAQ 100' },
];

const forecastData: Record<string, {
  supportResistance: string[],
  trendBias: string[],
  fibonacci: string[],
  events: { date: string, event: string, impact: string }[],
}> = {

gold: {
  supportResistance: [
    'Support: <strong>3320–3315</strong>, <strong>3300</strong>, <strong>3280</strong>',
    'Resistance: <strong>3350–3355</strong>, <strong>3370</strong>, <strong>3395–3400</strong>',
  ],
  trendBias: [
    'Trend: Neutral → Slightly Bullish ✅',
    'Price holding above <strong>3340</strong> short-term pivot',
    'Breakout watch above <strong>3355</strong> or below <strong>3320</strong>',
  ],
  fibonacci: [
    'Swing zone: <strong>3315 → 3355</strong>',
    '<strong>38.2%</strong> retracement near <strong>3340</strong>',
    '<strong>61.8%</strong> retracement near <strong>3330</strong>',
  ],
  events: [
    { date: 'Mon 25 Aug', event: 'US New Home Sales', impact: '⚠️ Medium' },
    { date: 'Tue 26 Aug', event: 'US Durable Goods Orders', impact: '⚠️ High' },
    { date: 'Wed 27 Aug', event: 'FOMC Member Speech', impact: '⚠️ Medium' },
    { date: 'Thu 28 Aug', event: 'US GDP (2nd Estimate)', impact: '🔥 High' },
  ],
},

btc: {
  supportResistance: [
    'Support: <strong>112,000</strong>, <strong>113,000</strong>',
    'Resistance: <strong>115,500</strong>, <strong>116,000</strong>, <strong>118,000</strong>',
  ],
  trendBias: [
    'Trend: Neutral ⚖️',
    'Short-term bounce from <strong>112,000</strong> base',
    'Momentum capped near <strong>116,000</strong> resistance',
  ],
  fibonacci: [
    'Swing zone: <strong>112,000 → 116,000</strong>',
    '<strong>38.2%</strong> retracement: ~113,500',
    '<strong>61.8%</strong> retracement: ~114,800',
  ],
  events: [
    { date: 'Mon 25 Aug', event: 'Crypto Market Sentiment (Fear & Greed Index)', impact: '⚠️ Medium' },
    { date: 'Tue 26 Aug', event: 'US Durable Goods Orders', impact: '⚠️ High' },
    { date: 'Thu 28 Aug', event: 'US GDP (2nd Estimate)', impact: '🔥 High' },
    { date: 'Fri 29 Aug', event: 'Bitcoin ETF Weekly Flows Report', impact: '⚠️ Medium' },
  ],
},

eurusd: {
  supportResistance: [
    'Support: <strong>1.1620</strong>, <strong>1.1600</strong>, <strong>1.1580</strong>',
    'Resistance: <strong>1.1675</strong>, <strong>1.1700</strong>, <strong>1.1720</strong>',
  ],
  trendBias: [
    'Trend: Neutral ⚖️',
    'Holding around <strong>1.1640–1.1660</strong> mid-zone',
    'Upside momentum fades near <strong>1.1700</strong>',
  ],
  fibonacci: [
    'Swing zone: <strong>1.1620 → 1.1700</strong>',
    '<strong>38.2%</strong> retracement: ~1.1650',
    '<strong>61.8%</strong> retracement: ~1.1675',
  ],
  events: [
    { date: 'Mon 25 Aug', event: 'Germany Ifo Business Climate', impact: '⚠️ Medium' },
    { date: 'Tue 26 Aug', event: 'US Durable Goods Orders', impact: '⚠️ High' },
    { date: 'Wed 27 Aug', event: 'ECB Economic Bulletin', impact: '⚠️ Medium' },
    { date: 'Thu 28 Aug', event: 'US GDP (2nd Estimate)', impact: '🔥 High' },
  ],
},

nasdaq: {
  supportResistance: [
    'Support: <strong>23,100</strong>, <strong>22,950</strong>, <strong>22,800</strong>',
    'Resistance: <strong>23,350</strong>, <strong>23,500</strong>, <strong>23,700</strong>',
  ],
  trendBias: [
    'Trend: Bearish ↘️',
    'Sharp drop from <strong>23,800+</strong> into <strong>23,200</strong> zone',
    'Rebound attempts capped below <strong>23,350</strong>',
  ],
  fibonacci: [
    'Swing zone: <strong>23,800 → 23,100</strong>',
    '<strong>38.2%</strong> retracement: ~23,370',
    '<strong>61.8%</strong> retracement: ~23,550',
  ],
  events: [
    { date: 'Mon 25 Aug', event: 'US New Home Sales', impact: '⚠️ Medium' },
    { date: 'Tue 26 Aug', event: 'US Durable Goods Orders', impact: '⚠️ High' },
    { date: 'Wed 27 Aug', event: 'Tech Earnings (Selected Companies)', impact: '⚠️ Medium' },
    { date: 'Thu 28 Aug', event: 'US GDP (2nd Estimate)', impact: '🔥 High' },
  ],
},
};

export default function MarketSection() {
  const [selectedAsset, setSelectedAsset] = useState('gold');
// 📆 Show an 8-day window: today → +7 days (local time)
const start = new Date();
start.setHours(0, 0, 0, 0);

const end = new Date(start);
end.setDate(start.getDate() + 7);

const fmt: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric' };
const formattedRange = `${start.toLocaleDateString('en-US', fmt)}–${end.toLocaleDateString('en-US', fmt)}`;
  return (
    <section id="market" className="market-section">
      <h2 className="market-title">
  📈 Weekly Market Forecast <span className="forecast-date">· {formattedRange}</span>
</h2>
      {/* Asset Tabs */}
      <div className="market-tabs">
        {assets.map((asset) => (
          <button
            key={asset.id}
            className={`market-tab ${selectedAsset === asset.id ? 'active' : ''}`}
            onClick={() => setSelectedAsset(asset.id)}
          >
            {asset.label}
          </button>
        ))}
      </div>

      {/* Chart */}
      <div className="market-chart-container">
        <iframe
          className="market-chart"
          src={getChartUrl(selectedAsset)}
          frameBorder="0"
          scrolling="no"
          allowTransparency={true}
          allowFullScreen={false}
        ></iframe>
      </div>

      {/* Forecast Boxes */}
      <div className="forecast-grid">
        <div className="forecast-box">
          <h4>🧱 Support & Resistance</h4>
          <ul>
            {forecastData[selectedAsset].supportResistance.map((item, idx) => (
              <li key={idx} dangerouslySetInnerHTML={{ __html: item }} />
            ))}
          </ul>
        </div>

        <div className="forecast-box">
          <h4>📈 Price Action & Bias</h4>
          <ul>
            {forecastData[selectedAsset].trendBias.map((item, idx) => (
              <li key={idx} dangerouslySetInnerHTML={{ __html: item }} />
            ))}
          </ul>
        </div>

        <div className="forecast-box">
          <h4>📐 Fibonacci Levels</h4>
          <ul>
            {forecastData[selectedAsset].fibonacci.map((item, idx) => (
              <li key={idx} dangerouslySetInnerHTML={{ __html: item }} />
            ))}
          </ul>
        </div>

        <div className="forecast-box">
          <h4>📅 High-Impact Events</h4>
          <table className="forecast-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Event</th>
                <th>Impact</th>
              </tr>
            </thead>
            <tbody>
              {forecastData[selectedAsset].events.map((event, idx) => (
                <tr key={idx}>
                  <td>{event.date}</td>
                  <td>{event.event}</td>
                  <td>{event.impact}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* CTA */}
      <div className="market-cta">
        <a 
  href="https://www.litefinance.org/fr/?uid=967798214&cid=325436&utm_source=mzprimer&utm_medium=web&utm_campaign=weekly_forecast_cta"
  className="market-cta-button" 
  target="_blank" 
  rel="noopener noreferrer"
>
  See Full Weekly Forecast
</a>
      </div>
    </section>
  );
}

// Chart URL map
function getChartUrl(assetId: string): string {
  const urls: Record<string, string> = {
    gold: 'https://s.tradingview.com/widgetembed/?symbol=OANDA%3AXAUUSD&interval=60&theme=dark&style=1&hide_top_toolbar=true&hide_legend=true',
    btc: 'https://s.tradingview.com/widgetembed/?symbol=BINANCE%3ABTCUSDT&interval=60&theme=dark&style=1&hide_top_toolbar=true&hide_legend=true',
    eurusd: 'https://s.tradingview.com/widgetembed/?symbol=OANDA%3AEURUSD&interval=60&theme=dark&style=1&hide_top_toolbar=true&hide_legend=true',
    nasdaq: 'https://s.tradingview.com/widgetembed/?symbol=NASDAQ%3ANDX&interval=60&theme=dark&style=1&hide_top_toolbar=true&hide_legend=true',
  };
  return urls[assetId] || urls['gold'];
}