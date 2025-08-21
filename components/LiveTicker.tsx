'use client';

import { useEffect } from 'react';

export default function LiveTicker() {
  useEffect(() => {
    const timeout = setTimeout(() => {
      const container = document.getElementById('ticker-container');
      if (container) {
        container.innerHTML = `
          <iframe
            src="https://s.tradingview.com/embed-widget/ticker-tape/?locale=en#%7B%22symbols%22%3A%5B
            %7B%22proName%22%3A%22FX%3AEURUSD%22%2C%22title%22%3A%22EUR%2FUSD%22%7D%2C
            %7B%22proName%22%3A%22FX%3AGBPUSD%22%2C%22title%22%3A%22GBP%2FUSD%22%7D%2C
            %7B%22proName%22%3A%22FX%3AUSDJPY%22%2C%22title%22%3A%22USD%2FJPY%22%7D%2C
            %7B%22proName%22%3A%22OANDA%3AXAUUSD%22%2C%22title%22%3A%22Gold%20(XAU%2FUSD)%22%7D%2C
            %7B%22proName%22%3A%22BINANCE%3ABTCUSDT%22%2C%22title%22%3A%22Bitcoin%22%7D%2C
            %7B%22proName%22%3A%22OANDA%3AUS30USD%22%2C%22title%22%3A%22Dow%20Jones%22%7D%2C
            %7B%22proName%22%3A%22NASDAQ%3ANDX%22%2C%22title%22%3A%22Nasdaq%20100%22%7D%5D%2C
            %22colorTheme%22%3A%22dark%22%2C%22isTransparent%22%3Afalse%2C%22displayMode%22%3A%22regular%22%2C
            %22fontSize%22%3A%22large%22%7D"
            width="100%" height="42"
            frameborder="0" allowtransparency="true" scrolling="no"
            style="border: none; pointer-events: none; position: relative; z-index: 2;"
          ></iframe>`;
      }
    }, 300);

    return () => clearTimeout(timeout);
  }, []);

  return (
    <div className="live-ticker-wrapper">
      <div
        id="ticker-container"
        style={{
          position: 'relative',
          width: '100%',
          overflow: 'hidden',
          background: '#0e0e0e',
          boxShadow: '0 0 12px rgba(0,0,0,0.2)',
          height: '42px',
        }}
      >
        <div className="ticker-placeholder">Loading live market data...</div>
      </div>
    </div>
  );
}