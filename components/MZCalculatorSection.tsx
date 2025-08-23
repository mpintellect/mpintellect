// components/MZCalculatorSection.tsx
'use client';
import { useMemo, useState } from 'react';

type AccountType = 'ECN' | 'Standard' | 'Pro';
type Currency = 'USD' | 'EUR' | 'GBP';
type Leverage =
  | '1:1' | '1:10' | '1:20' | '1:30' | '1:50' | '1:100' | '1:200' | '1:500';

type AssetClass = 'Forex - Major Currency Pairs' | 'Metals' | 'Crypto' | 'Indices';
type Side = 'buy/long' | 'sell/short';

type SymbolMeta = {
  pipSize: number;          // minimal price increment used for "pips"
  contractPerLot: number;   // contract size per 1.0 lot (e.g., 100,000 for FX)
  quoteInUSD: boolean;      // whether quote currency is directly USD
};

const SYMBOLS: Record<string, { asset: AssetClass; meta: SymbolMeta }> = {
  // ===== FX Majors =====
  EURUSD: { asset: 'Forex - Major Currency Pairs', meta: { pipSize: 0.0001, contractPerLot: 100_000, quoteInUSD: true  } },
  GBPUSD: { asset: 'Forex - Major Currency Pairs', meta: { pipSize: 0.0001, contractPerLot: 100_000, quoteInUSD: true  } },
  AUDUSD: { asset: 'Forex - Major Currency Pairs', meta: { pipSize: 0.0001, contractPerLot: 100_000, quoteInUSD: true  } },
  NZDUSD: { asset: 'Forex - Major Currency Pairs', meta: { pipSize: 0.0001, contractPerLot: 100_000, quoteInUSD: true  } },
  USDJPY: { asset: 'Forex - Major Currency Pairs', meta: { pipSize: 0.01,   contractPerLot: 100_000, quoteInUSD: false } },
  USDCHF: { asset: 'Forex - Major Currency Pairs', meta: { pipSize: 0.0001, contractPerLot: 100_000, quoteInUSD: false } },
  USDCAD: { asset: 'Forex - Major Currency Pairs', meta: { pipSize: 0.0001, contractPerLot: 100_000, quoteInUSD: false } },

  // ===== Popular FX Crosses =====
  EURJPY: { asset: 'Forex - Major Currency Pairs', meta: { pipSize: 0.01,   contractPerLot: 100_000, quoteInUSD: false } },
  GBPJPY: { asset: 'Forex - Major Currency Pairs', meta: { pipSize: 0.01,   contractPerLot: 100_000, quoteInUSD: false } },
  EURGBP: { asset: 'Forex - Major Currency Pairs', meta: { pipSize: 0.0001, contractPerLot: 100_000, quoteInUSD: false } },
  AUDJPY: { asset: 'Forex - Major Currency Pairs', meta: { pipSize: 0.01,   contractPerLot: 100_000, quoteInUSD: false } },
  CADJPY: { asset: 'Forex - Major Currency Pairs', meta: { pipSize: 0.01,   contractPerLot: 100_000, quoteInUSD: false } },
  CHFJPY: { asset: 'Forex - Major Currency Pairs', meta: { pipSize: 0.01,   contractPerLot: 100_000, quoteInUSD: false } },
  NZDJPY: { asset: 'Forex - Major Currency Pairs', meta: { pipSize: 0.01,   contractPerLot: 100_000, quoteInUSD: false } },

  // ===== Metals =====
  XAUUSD: { asset: 'Metals', meta: { pipSize: 0.1,  contractPerLot: 100,   quoteInUSD: true } },
  XAGUSD: { asset: 'Metals', meta: { pipSize: 0.01, contractPerLot: 5_000, quoteInUSD: true } },

  // ===== Indices (CFD-style) =====
  US30:  { asset: 'Indices', meta: { pipSize: 1, contractPerLot: 1, quoteInUSD: true } },
  US100: { asset: 'Indices', meta: { pipSize: 1, contractPerLot: 1, quoteInUSD: true } },
  US500: { asset: 'Indices', meta: { pipSize: 1, contractPerLot: 1, quoteInUSD: true } },
  GER40: { asset: 'Indices', meta: { pipSize: 1, contractPerLot: 1, quoteInUSD: true } },
  UK100: { asset: 'Indices', meta: { pipSize: 1, contractPerLot: 1, quoteInUSD: true } },
  JP225: { asset: 'Indices', meta: { pipSize: 1, contractPerLot: 1, quoteInUSD: true } },

  // ===== Crypto =====
  BTCUSDT: { asset: 'Crypto', meta: { pipSize: 1,   contractPerLot: 1, quoteInUSD: true } },
  ETHUSDT: { asset: 'Crypto', meta: { pipSize: 0.1, contractPerLot: 1, quoteInUSD: true } },
};

const LEVERAGE_TO_NUM: Record<Leverage, number> = {
  '1:1':1, '1:10':10, '1:20':20, '1:30':30, '1:50':50, '1:100':100, '1:200':200, '1:500':500
};

// Very rough pip-value estimator for demo
function estimatePipValueUSD(symbol: string, price: number, meta: SymbolMeta) {
  if (meta.contractPerLot === 100_000) {
    if (meta.quoteInUSD) return 10; // e.g. EURUSD ~ $10/pip/lot
    return (meta.pipSize / price) * meta.contractPerLot;
  }
  return meta.pipSize * meta.contractPerLot;
}

export default function MZCalculatorSection() {
  // Account
  const [accountType, setAccountType] = useState<AccountType>('ECN');
  const [currency, setCurrency] = useState<Currency>('USD');
  const [leverage, setLeverage] = useState<Leverage>('1:1');

  // Order
  const [asset, setAsset] = useState<AssetClass>('Forex - Major Currency Pairs');
  const [symbol, setSymbol] = useState<string>('AUDUSD');
  const [volume, setVolume] = useState<number>(0.01);
  const [side, setSide] = useState<Side>('buy/long');
  const [open, setOpen] = useState<number>(0);
  const [close, setClose] = useState<number>(0);

  const meta = SYMBOLS[symbol]?.meta;

  const results = useMemo(() => {
    if (!meta || !Number.isFinite(open) || !Number.isFinite(close) || !Number.isFinite(volume)) {
      return null;
    }
    const lev = LEVERAGE_TO_NUM[leverage] || 1;

    const notionalUSD = open * meta.contractPerLot * volume;
    const marginUSD   = lev > 0 ? notionalUSD / lev : notionalUSD;

    const pts  = (close - open) / meta.pipSize;
    const pips = side === 'buy/long' ? pts : -pts;

    const pipValPerLotUSD = estimatePipValueUSD(symbol, open, meta);
    const pipValUSD       = pipValPerLotUSD * volume;

    const pnlUSD          = pips * pipValUSD;

    return { notionalUSD, marginUSD, pips, pipValUSD, pnlUSD };
  }, [meta, symbol, side, open, close, volume, leverage]);

  const reset = () => {
    setAccountType('ECN');
    setCurrency('USD');
    setLeverage('1:1');
    setAsset('Forex - Major Currency Pairs');
    setSymbol('AUDUSD');
    setVolume(0.01);
    setSide('buy/long');
    setOpen(0);
    setClose(0);
  };

  const calc = () => {
    // results are computed by useMemo; this button just fits the UX
  };

  const availableSymbols = Object.keys(SYMBOLS).filter(s => SYMBOLS[s].asset === asset);

  return (
    <section id="mzcalc" className="mzcalc-section">
      <div className="mzcalc-wrap">
        <header className="mzcalc-head">
          <h2 className="mzcalc-title">MZ Calculator</h2>
          <p className="mzcalc-sub">Position size, pip value, margin & PnL — quick simulation.</p>
        </header>

        {/* Account Settings */}
        <div className="mzcalc-block">
          <div className="mzcalc-row">
            <div className="mzcalc-field">
              <label>Account type</label>
              <select value={accountType} onChange={e => setAccountType(e.target.value as AccountType)}>
                <option>ECN</option>
                <option>Standard</option>
                <option>Pro</option>
              </select>
            </div>
            <div className="mzcalc-field">
              <label>Account currency</label>
              <select value={currency} onChange={e => setCurrency(e.target.value as Currency)}>
                <option>USD</option><option>EUR</option><option>GBP</option>
              </select>
            </div>
            <div className="mzcalc-field">
              <label>Leverage</label>
              <select value={leverage} onChange={e => setLeverage(e.target.value as Leverage)}>
                {Object.keys(LEVERAGE_TO_NUM).map(l => <option key={l}>{l}</option>)}
              </select>
            </div>
          </div>
        </div>

        {/* Order Settings */}
        <div className="mzcalc-block">
          <div className="mzcalc-row">
            <div className="mzcalc-field mzcalc-field--wide">
              <label>Trading asset</label>
              <select value={asset} onChange={e => setAsset(e.target.value as AssetClass)}>
                <option>Forex - Major Currency Pairs</option>
                <option>Metals</option>
                <option>Crypto</option>
                <option>Indices</option>
              </select>
            </div>
            <div className="mzcalc-field">
              <label>Symbol</label>
              <select value={symbol} onChange={e => setSymbol(e.target.value)}>
                {availableSymbols.map(s => <option key={s}>{s}</option>)}
              </select>
            </div>
          </div>

          <div className="mzcalc-row">
            <div className="mzcalc-field">
              <label>Volume (lots)</label>
              <input
                type="number"
                step="0.01"
                min={0.01}
                value={volume}
                onChange={e => setVolume(Number(e.target.value))}
              />
            </div>
            <div className="mzcalc-field">
              <label>Trade type</label>
              <div className="mzcalc-seg">
                <button
                  type="button"
                  className={`seg-btn ${side === 'sell/short' ? '' : 'is-active'}`}
                  onClick={() => setSide('buy/long')}
                >
                  buy/long
                </button>
                <button
                  type="button"
                  className={`seg-btn ${side === 'sell/short' ? 'is-active' : ''}`}
                  onClick={() => setSide('sell/short')}
                >
                  sell/short
                </button>
              </div>
            </div>
            <div className="mzcalc-field">
              <label>Opening</label>
              <input type="number" step="0.00001" value={open} onChange={e => setOpen(Number(e.target.value))} />
            </div>
            <div className="mzcalc-field">
              <label>Closing</label>
              <input type="number" step="0.00001" value={close} onChange={e => setClose(Number(e.target.value))} />
            </div>
          </div>
        </div>

        {/* Actions */}
<div className="mzcalc-actions">
  <button
    className="mzcalc-btn"
    onClick={calc}
    data-cta="true"
    data-cta-name="Calculate Trade"
  >
    Calculate
  </button>

  <button
    className="mzcalc-btn mzcalc-btn--ghost"
    onClick={reset}
    data-cta="true"
    data-cta-name="Reset Calculator"
  >
    Reset
  </button>

  <a
    href="https://my.litefinance.org/registration?uid=967798214&cid=325438&utm_source=mzprimer&utm_medium=web&utm_campaign=calculator_cta"
    target="_blank"
    rel="noopener noreferrer"
    className="btn-register"
    data-cta="true"
    data-cta-name="Test on Real Account"
    data-ads-send-to="AW-16927724463/n3hlCNmcy6oaEK-n4oc_"
    data-value="1.0"
    data-currency="MAD"
  >
    Test on Real Account
  </a>
</div>

        {/* Results */}
        {results && (
          <div className="mzcalc-results">
            <div className="res-item">
              <div className="res-k">Notional</div>
              <div className="res-v">${results.notionalUSD.toFixed(2)}</div>
            </div>
            <div className="res-item">
              <div className="res-k">Margin (≈)</div>
              <div className="res-v">${results.marginUSD.toFixed(2)}</div>
            </div>
            <div className="res-item">
              <div className="res-k">Pips</div>
              <div className="res-v">{results.pips.toFixed(1)}</div>
            </div>
            <div className="res-item">
              <div className="res-k">Pip value / current vol</div>
              <div className="res-v">${results.pipValUSD.toFixed(2)}</div>
            </div>
            <div className="res-item">
              <div className="res-k">PnL (≈)</div>
              <div className={`res-v ${results.pnlUSD >= 0 ? 'pos' : 'neg'}`}>
                {results.pnlUSD >= 0 ? '▲' : '▼'} ${Math.abs(results.pnlUSD).toFixed(2)}
              </div>
            </div>
          </div>
        )}

        <p className="mzcalc-disclaimer">
          * Educational estimates. Contract sizes & pip rules simplified. For live trading, confirm with your broker spec sheet.
        </p>
      </div>
    </section>
  );
}