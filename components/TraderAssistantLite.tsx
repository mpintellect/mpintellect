'use client';
import { useSearchParams } from 'next/navigation';
import { useEffect, useMemo, useRef, useState } from 'react';
import LicenseModal from '../components/LicenseModal';
import { readLocalLicense } from '../app/lib/license-local';
import { getDeviceFingerprint } from '../app/utils/fingerprint.client';
import { fetchCurrentPrice } from '../app/lib/fetchPrice'; // adjust path as needed


// === Shared storage keys (global across pages) ===
const USAGE_KEY = 'mz_ai_uses_global_v1';
const SUB_KEY   = 'mz_ai_subscribed_global_v1';
const LIC_KEY   = 'mz_ai_license_global_v1';

const LEGACY_USAGE_KEYS = ['mz_ai_uses', 'mz_ai_uses_lite', 'ai_uses'];
const LEGACY_SUB_KEYS   = ['mz_ai_subscribed'];
const LEGACY_LIC_KEYS   = ['mz_ai_license'];

/* =========================
   Types & symbol contracts
========================= */

type SymbolKey =
  | 'select' | 'EURUSD' | 'GBPUSD' | 'USDJPY' | 'USDCAD' | 'AUDUSD'
  | 'NZDUSD' | 'USDCHF' | 'XAUUSD' | 'XAUEUR' | 'XAGUSD'
  | 'BTCUSD' | 'ETHUSD' | 'AAPL'  | 'TSLA'   | 'AMZN';

type StyleKey = 'scalper' | 'balanced' | 'aggressive' | 'swing';
type AssetGroupKey = 'fx' | 'metals' | 'crypto' | 'stocks';
type NormalizedLicense = { key: string; expiresAt?: number };

// Accepts string | {key, expiresAt} | null/undefined and normalizes it
function normalizeLicense(input: unknown): NormalizedLicense {
  if (!input) return { key: '' };
  if (typeof input === 'string') return { key: input.trim() };
  if (typeof input === 'object') {
    const maybe = input as { key?: unknown; expiresAt?: unknown };
    const key = (typeof maybe.key === 'string' ? maybe.key : '').trim();
    const expiresAt = typeof maybe.expiresAt === 'number' ? maybe.expiresAt : undefined;
    return { key, expiresAt };
  }
  return { key: '' };
}
const CONTRACT: Record<SymbolKey, { contract: number; pip: number }> = {
  select: { contract: 100000, pip: 0.0001 }, // default to EURUSD
  EURUSD: { contract: 100000, pip: 0.0001 },
  GBPUSD: { contract: 100000, pip: 0.0001 },
  USDJPY: { contract: 100000, pip: 0.01 },
  USDCAD: { contract: 100000, pip: 0.0001 },
  AUDUSD: { contract: 100000, pip: 0.0001 },
  NZDUSD: { contract: 100000, pip: 0.0001 },
  USDCHF: { contract: 100000, pip: 0.0001 },
  XAUUSD: { contract: 100,     pip: 0.1     },
  XAUEUR: { contract: 100,     pip: 0.1     },
  XAGUSD: { contract: 5000,    pip: 0.01    },
  BTCUSD: { contract: 1,       pip: 0.5     },
  ETHUSD: { contract: 1,       pip: 0.1     },
  AAPL:   { contract: 1,       pip: 0.1     },
  TSLA:   { contract: 1,       pip: 0.1     },
  AMZN:   { contract: 1,       pip: 0.1     },
};

const DECIMALS: Record<SymbolKey, number> = {
  select: 4, EURUSD: 4, GBPUSD: 4, USDJPY: 2, USDCAD: 4, AUDUSD: 4,
  NZDUSD: 4, USDCHF: 4, XAUUSD: 2, XAUEUR: 2, XAGUSD: 2,
  BTCUSD: 1, ETHUSD: 1, AAPL: 2, TSLA: 2, AMZN: 2,
};

const LEVERAGES = [25, 50, 100, 200, 500, 1000] as const;
const ACCOUNT_TYPES = ['Standard', 'ECN', 'Classic'] as const;
const ACCOUNT_CCY   = ['USD', 'EUR', 'GBP'] as const;

const ASSET_GROUPS: Array<{ key: AssetGroupKey; label: string; symbols: SymbolKey[] }> = [
  { key: 'fx',      label: 'Forex - Major Currency Pairs', symbols: ['select','EURUSD','GBPUSD','USDJPY','USDCAD','AUDUSD','NZDUSD','USDCHF'] },
  { key: 'metals',  label: 'Metals',                       symbols: ['XAUUSD','XAUEUR','XAGUSD'] },
  { key: 'crypto',  label: 'Crypto',                       symbols: ['BTCUSD','ETHUSD'] },
  { key: 'stocks', label: 'US Stocks',                      symbols: ['AAPL','TSLA','AMZN'] },
];

function styleParams(style: StyleKey) {
  if (style === 'scalper')     return { name: 'Scalper',     slPips: 10, rr: 1.5 };
  if (style === 'aggressive')  return { name: 'Aggressive',  slPips: 15, rr: 2.5 };
  if (style === 'swing')       return { name: 'Swing',       slPips: 60, rr: 2.0 };
  return                         { name: 'Balanced',         slPips: 20, rr: 2.0 };
}

function fmt(sym: SymbolKey, v: number) {
  return v.toFixed(DECIMALS[sym] ?? 2);
}

/* =========================
   Component
========================= */

export default function TraderAssistantLite() {
  const FREE_USES = 3; // two free tries before paywall
  // License modal state
  const [licenseOpen, setLicenseOpen] = useState(false);
  const [licenseKey, setLicenseKey] = useState('');
  /* ---------- Subscription / usage (NEW) ---------- */
const [usageCount, setUsageCount] = useState(0);
const [isSubscribed, setIsSubscribed] = useState(false);

// load counters & subscription on mount
useEffect(() => {
  // 1) sync bits (counter)
  try {
    const raw = localStorage.getItem('mz_ai_uses');
    let u = Number.parseInt(raw ?? '0', 10);
    if (!Number.isFinite(u) || u < 0 || u > 1000) u = 0; // clamp
    setUsageCount(u);
  } catch {}

  let mounted = true;
  // 2) async bits (license + fingerprint)
  (async () => {
    try {
      const subFlag = localStorage.getItem('mz_ai_subscribed') === '1';

      // license from localStorage (string)
      const stored = (localStorage.getItem('mz_ai_license') || '').trim();
      const storedValid = stored.length >= 10;

      // license from helper (could be string or {key, expiresAt})
      let helper: any = null;
      try {
        helper = await (typeof readLocalLicense === 'function' ? readLocalLicense() : null);
      } catch {}
      const helperKey   = typeof helper === 'string' ? helper : helper?.key;
      const helperExp   = typeof helper === 'object' ? helper?.expiresAt : undefined;
      const now         = Date.now();
      const helperValid = !!helperKey && (!helperExp || Number(helperExp) > now);

      if (mounted) setIsSubscribed(Boolean(subFlag || storedValid || helperValid));

      // optional soft device fingerprint
      try {
        const fp = await (typeof getDeviceFingerprint === 'function' ? getDeviceFingerprint() : Promise.resolve(''));
        if (fp) localStorage.setItem('mz_ai_device', fp);
      } catch {}
    } catch {}
  })();

  return () => { mounted = false; };
}, []);

  // persist usage counter
  useEffect(() => {
  try {
    localStorage.setItem(USAGE_KEY, String(usageCount));
    for (const k of LEGACY_USAGE_KEYS) localStorage.setItem(k, String(usageCount));
  } catch {}
}, [usageCount]);

  // persist subscription flag
  useEffect(() => {
  try {
    const v = isSubscribed ? '1' : '0';
    localStorage.setItem(SUB_KEY, v);
    for (const k of LEGACY_SUB_KEYS) localStorage.setItem(k, v);
  } catch {}
}, [isSubscribed]);

// Auto-open license modal if coming from email with ?activate=1
const sp = useSearchParams();
useEffect(() => {
  if (sp.get('activate') === '1') {
    setLicenseOpen(true);

    // Optional: prefill from ?key=... if you ever include it in emails
    const keyFromUrl = sp.get('key');
    if (keyFromUrl) setLicenseKey(keyFromUrl.trim());
  }
}, [sp]);

const [symbol, setSymbol] = useState<SymbolKey>('select' as SymbolKey);
  const [price, setPrice] = useState(1.0850);
const [autoPriceLoading, setAutoPriceLoading] = useState(false);
 const [style, setStyle] = useState<StyleKey>('balanced');
const [isPriceLoading, setIsPriceLoading] = useState(false);

useEffect(() => {
  if (symbol === 'select') return;
  console.log("🔁 useEffect triggered for symbol:", symbol);

  const updatePrice = async () => {
    setIsPriceLoading(true);
    try {
      const newPrice = await fetchCurrentPrice(symbol);
      console.log("📈 newPrice fetched:", newPrice);
      if (newPrice !== null && !isNaN(newPrice)) {
        setPrice(Number(newPrice.toFixed(DECIMALS[symbol] ?? 2)));
      }
    } catch (err) {
      console.error('Error fetching price:', err);
    }
    setIsPriceLoading(false);
  };

  updatePrice();
}, [symbol]);
  // quick activation via prompt (keeps UI unchanged)
  const activateLicense = () => {
    const key = window.prompt('Enter your license key to unlock the AI Assistant:')?.trim();
    if (!key) return;
    // simple client-side check; you’ll replace with server validation later
    if (!/^[A-Z0-9-]{10,}$/i.test(key)) {
      alert('Please enter a valid license key.');
      return;
    }
    try {
      localStorage.setItem('mz_ai_license', key);
      localStorage.setItem('mz_ai_subscribed', '1');
    } catch {}
    setIsSubscribed(true);
    alert('License activated. Enjoy unlimited access!');
  };
  /* ---------- Inputs ---------- */
  const [balance, setBalance]   = useState(1000);
  const [accountType, setAccountType] = useState<typeof ACCOUNT_TYPES[number]>('ECN');
  const [accountCcy, setAccountCcy]   = useState<typeof ACCOUNT_CCY[number]>('USD');
  const [leverage, setLeverage] = useState<number>(100);

  const [assetGroup, setAssetGroup] = useState<AssetGroupKey>('fx');
  const [dir, setDir] = useState<'buy'|'sell'>('buy');
  const [lot, setLot] = useState(0.10);
  const [scenario, setScenario] = useState<'tp'|'sl'>('tp');
  const [showResults, setShowResults] = useState(false);

  /* ---------- Derived ---------- */
  const spec = CONTRACT[symbol];
  const { name: styleName, slPips, rr } = styleParams(style);
  const tpPips = slPips * rr;

  const slPrice = dir === 'buy' ? price - slPips * spec.pip : price + slPips * spec.pip;
  const tpPrice = dir === 'buy' ? price + tpPips * spec.pip : price - tpPips * spec.pip;

  const pipValuePerLot =
    symbol.startsWith('XAU') || symbol.startsWith('XAG') || symbol.startsWith('BTC') || symbol.startsWith('ETH')
      ? (spec.pip * spec.contract)
      : (spec.contract * spec.pip);

  const estLoss = slPips * pipValuePerLot * lot;
  const estWin  = tpPips * pipValuePerLot * lot;

  const positionUnits = lot * spec.contract;
  const marginReq = (positionUnits * price) / leverage;
  const marginPctOfBal = balance > 0 ? (marginReq / balance) * 100 : 0;

  const riskPctAuto = balance > 0 ? (estLoss / balance) * 100 : 0;

  const targetMarginPct = style === 'scalper' ? 5 : style === 'balanced' ? 8 : style === 'aggressive' ? 12 : 6;
  const suggestedLot = useMemo(() => {
    if (balance <= 0 || price <= 0) return lot;
    const targetMargin = (targetMarginPct / 100) * balance;
    const units = (targetMargin * leverage) / price;
    const lots = units / spec.contract;
    return Math.max(0.01, Math.round(lots * 100) / 100);
  }, [balance, price, leverage, spec.contract, targetMarginPct, lot]);

  /* ---------- Actions ---------- */
  const onGetAssistant = () => {
  setShowResults(true);
  if (isSubscribed) return;
  // increment AFTER showing, so current click is never blurred
  setUsageCount(prev => {
    const next = prev + 1;
    try { localStorage.setItem('mz_ai_uses', String(next)); } catch {}
    return next;
  });
};

// derive paywall from current state
const needsPaywall = !isSubscribed && usageCount >= FREE_USES;
 async function handleActivateLicense() {
    try {
      // optional: device fingerprint if you have it
      let fingerprint: string | undefined;
      try {
        const maybeFp = (window as any).getDeviceFingerprint?.() || null;
        fingerprint = typeof maybeFp === 'string' ? maybeFp : undefined;
      } catch {}

      const res = await fetch('/api/license/activate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key: licenseKey.trim(), fingerprint }),
      });
      const json = await res.json().catch(() => ({}));

      if (!res.ok || !json?.ok) {
        alert(json?.error || 'Activation failed. Please check your key and try again.');
        return;
      }

      // persist locally so user stays unlocked
      try {
        localStorage.setItem('mz_ai_license', json.license?.key || licenseKey.trim());
        localStorage.setItem('mz_ai_subscribed', '1');
      } catch {}

      setIsSubscribed(true);
      setLicenseOpen(false);
      setLicenseKey('');
    } catch (e) {
      alert((e as Error)?.message || 'Network error while activating license');
    }
  }
  /* ---------- Render ---------- */
  return (
    <section id="ai-assistant" className="ta-anchor-offset ta-home-block ai-assistant-section">
      <div className="ta-header">
        <h2 className="ta-title">AI Trader Assistant</h2>
        <p className="ta-subtitle">
          AI-powered trading assistant: set your balance, symbol, leverage, and style to instantly calculate SL/TP levels, margin requirements, risk metrics, and view a simulated M5 price path — all in one clean, beginner-friendly tool.
        </p>
      </div>
 <div className="ta-wrap scroll-fade-up">
      {/* === Inputs – three cards === */}
      <div className="ta-deck">
        {/* Card 1: Account */}
        <div className="ta-card ta-card--account">
          <h3 className="ta-card-title">Account</h3>

          <div className="ta-bar">
            <div className="ta-field">
              <label>Account type</label>
              <select className="ta-input" value={accountType}
                onChange={(e)=>setAccountType(e.target.value as typeof ACCOUNT_TYPES[number])}>
                {ACCOUNT_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>

            <div className="ta-field">
              <label>Account currency</label>
              <select className="ta-input" value={accountCcy}
                onChange={(e)=>setAccountCcy(e.target.value as typeof ACCOUNT_CCY[number])}>
                {ACCOUNT_CCY.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>

            <div className="ta-field">
              <label>Leverage</label>
              <select className="ta-input" value={leverage}
                onChange={(e)=>setLeverage(Number(e.target.value))}>
                {LEVERAGES.map(lv => <option key={lv} value={lv}>1:{lv}</option>)}
              </select>
            </div>
          </div>

          <div className="ta-field">
            <label>Balance ($)</label>
            <input className="ta-input" type="number" value={balance}
              onChange={(e)=>setBalance(Number(e.target.value || 0))} min={0}/>
          </div>
        </div>

        {/* Card 2: Trading Asset */}
        <div className="ta-card ta-card--asset">
          <h3 className="ta-card-title">Trading Asset</h3>

          <div className="ta-field ta-span-2">
            <label>Asset group</label>
            <select
              className="ta-input"
              value={assetGroup}
              onChange={e => {
                const g = e.target.value as AssetGroupKey;
                setAssetGroup(g);
                const group = ASSET_GROUPS.find(x => x.key === g)!;
                if (!group.symbols.includes(symbol)) setSymbol(group.symbols[0]);
              }}>
              {ASSET_GROUPS.map(g => (
                <option key={g.key} value={g.key}>{g.label}</option>
              ))}
            </select>
          </div>

          <div className="ta-field">
            <label>Symbol</label>
            <select className="ta-input" value={symbol}
              onChange={(e)=>setSymbol(e.target.value as SymbolKey)}>
              {ASSET_GROUPS.find(g => g.key === assetGroup)!.symbols.map(k => (
                <option key={k} value={k}>{k}</option>
              ))}
            </select>
          </div>

          <div className="ta-field">
            <label>Position</label>
            <select className="ta-input" value={dir}
              onChange={(e)=>setDir(e.target.value as 'buy'|'sell')}>
              <option value="buy">Buy</option>
              <option value="sell">Sell</option>
            </select>
          </div>

          <div className="ta-field">
            <label>Lot Size</label>
            <input className="ta-input" type="number" value={lot}
              onChange={(e)=>setLot(Number(e.target.value || 0))} min={0.01} step={0.01}/>
            <div className="ta-hint">Suggested: {suggestedLot.toFixed(2)}</div>
          </div>
        </div>

        {/* Card 3: Execution */}
        <div className="ta-card ta-card--exec">
          <h3 className="ta-card-title ta-center">Execution Settings</h3>

          <div className="ta-field ta-span-2">
            <label>Current Price</label>
            <input
  className="ta-input"
  type="number"
  value={price}
  onChange={(e) => setPrice(Number(e.target.value || 0))}
  step={spec.pip}
  disabled={autoPriceLoading}
/>
{autoPriceLoading && (
  <div className="text-xs text-gray-400 mt-1">Fetching live price…</div>
)}
          </div>

          <div className="ta-field ta-span-2">
            <label>Trading Style</label>
            <select className="ta-input" value={style}
              onChange={(e)=>setStyle(e.target.value as StyleKey)}>
              <option value="scalper">Scalper (very tight)</option>
              <option value="balanced">Balanced</option>
              <option value="aggressive">Aggressive (wider TP)</option>
              <option value="swing">Swing (wider SL)</option>
            </select>
            <div className="ta-hint">RR ≈ {rr}:1 • SL ≈ {slPips} pips</div>
          </div>

          <div className="ta-actions">
            <button type="button" className="ta-btn" onClick={onGetAssistant}>Get AI Assistant</button>
          </div>
        </div>
      </div>

      {/* === Results (with paywall wrapper) === */}
      {showResults && (
  <div className="ta-results-wrap">
    <div className={`ta-results ${needsPaywall ? 'blurred' : ''}`}>
      <div className="ta-panels">
        <div className="ta-card">
          <div className="ta-card-title">Levels</div>
          <div className="ta-row"><span>Entry</span><b>{fmt(symbol, price)}</b></div>
          <div className="ta-row"><span>Stop Loss</span><b>{fmt(symbol, slPrice)}</b></div>
          <div className="ta-row"><span>Take Profit</span><b>{fmt(symbol, tpPrice)}</b></div>
          <div className="ta-tip">Style: {styleName} • RR ≈ {rr}:1 • SL ≈ {slPips} pips</div>
        </div>

        <div className="ta-card">
          <div className="ta-card-title">Outcome (Lot {lot.toFixed(2)})</div>
          <div className="ta-row"><span>Est. Loss @ SL</span><b>${estLoss.toFixed(2)}</b></div>
          <div className="ta-row"><span>Est. Win @ TP</span><b>${estWin.toFixed(2)}</b></div>
          <div className="ta-row">
            <span>Margin (1:{leverage})</span>
            <b>${marginReq.toFixed(2)} <span className="ta-sub">({marginPctOfBal.toFixed(1)}% of balance)</span></b>
          </div>
          <div className="ta-row">
            <span>Risk on Trade</span>
            <b>{riskPctAuto.toFixed(2)}% <span className="ta-sub">(${estLoss.toFixed(2)})</span></b>
          </div>
        </div>
      </div>

      <div className="ta-chart-wrap">
        <div className="ta-chart-controls">
          <button
            type="button"
            className={`ta-chip ${scenario === 'tp' ? 'active' : ''}`}
            onClick={() => setScenario('tp')}
          >
            Scenario 1 (TP)
          </button>
          <button
            type="button"
            className={`ta-chip ${scenario === 'sl' ? 'active' : ''}`}
            onClick={() => setScenario('sl')}
          >
            Scenario 2 (SL)
          </button>
        </div>
        <div className="ta-chart-title">Scenario paths (time 0 → 1)</div>
        <ScenarioChart
          symbol={symbol}
          entry={price}
          sl={slPrice}
          tp={tpPrice}
          direction={dir}
          scenario={scenario}
        />
      </div>

      <Suggestions
        balance={balance}
        lot={lot}
        rr={rr}
        marginPct={marginPctOfBal}
        style={style}
        estWin={estWin}
        riskPct={riskPctAuto}
      />
    </div>

    {needsPaywall && (
      <div className="ta-overlay">
        <div className="ta-overlay-box">
          <h3 className="ta-overlay-title">Unlock AI Assistant</h3>
          <p className="ta-overlay-text">
            You’ve reached the free limit. Get unlimited scenarios & full access.
          </p>
          <div className="ta-overlay-actions">
            <button
              className="ta-btn"
              onClick={() => (window.location.href = '/checkout')}
            >
              Subscribe – $6 / month
            </button>
            <button
              className="ta-link-btn"
              onClick={() => setLicenseOpen(true)}
            >
              I have a license
            </button>
            <button
              className="ta-link-btn"
              onClick={() => (window.location.href = '/checkout?plan=pro')}
            >
              Go Pro – $30 / month
            </button>
          </div>
        </div>
      </div>
    )}
  </div>
)}

{/* Mount the modal once at the bottom */}
<LicenseModal
  open={licenseOpen}
  value={licenseKey}
  onChange={setLicenseKey}
  onClose={() => setLicenseOpen(false)}
  onSave={handleActivateLicense}
/>
  </div>
   </section>
);
}

/* =========================
   Suggestions
========================= */

function Suggestions({
  balance, lot, rr, marginPct, style, estWin, riskPct
}: {
  balance: number;
  lot: number;
  rr: number;
  marginPct: number;
  style: StyleKey;
  estWin: number;
  riskPct: number;
}) {
  const tips: string[] = [];

  if (riskPct > 2.0) {
    const target = 1.0;
    const scale = target / Math.max(0.01, riskPct);
    const suggestedLotAt1 = Math.max(0.01, (lot * scale));
    tips.push(`⚠️ Risk is ${riskPct.toFixed(2)}% of balance. Reduce lot to ~${suggestedLotAt1.toFixed(2)} to keep risk near 1%.`);
  } else if (riskPct < 0.3 && estWin > 0) {
    const target = 1.0;
    const scale = target / Math.max(0.01, riskPct);
    const suggestedLotNear1 = Math.max(0.01, (lot * Math.min(scale, 2)));
    tips.push(`ℹ️ Risk is only ${riskPct.toFixed(2)}%. You can increase lot up to ~${suggestedLotNear1.toFixed(2)} if comfortable with ~1% risk.`);
  } else {
    tips.push(`✅ Risk ~${riskPct.toFixed(2)}% is reasonable for consistent growth.`);
  }

  if (marginPct > 30) {
    tips.push(`⚠️ Margin use is ${marginPct.toFixed(1)}%. Consider smaller lot (e.g. ${(lot * 0.6).toFixed(2)}) or higher leverage to avoid margin stress.`);
  } else if (marginPct < 5) {
    tips.push(`ℹ️ Margin use is ${marginPct.toFixed(1)}%. Sizing is conservative; OK to scale slightly if needed.`);
  }

  if (rr < 2) tips.push(`⚠️ R:R = ${rr}:1. Aim ≥ 2:1 → tighten SL or widen TP (keep SL within structure).`);
  else tips.push(`✅ R:R = ${rr}:1 supports positive expectancy if win rate is maintained.`);

  if (style === 'scalper') tips.push(`Scalper: trade liquid sessions (London/NY overlap), keep SL tight, avoid high spreads/slippage.`);
  else if (style === 'aggressive') tips.push(`Aggressive: expect larger swings. Pre-define max daily loss and stop after reaching it.`);
  else if (style === 'swing') tips.push(`Swing: hold longer. Check upcoming news; widen buffers around major levels.`);
  else tips.push(`Balanced: steady approach. Focus on consistency and clear invalidation levels.`);

  return (
    <div className="ta-suggestions">
      <div className="ta-card-title">AI Suggestions</div>
      <div className="ta-suggestion-list">
        {tips.map((t, i) => (
          <div key={i} className="ta-suggestion-item">{t}</div>
        ))}
      </div>
    </div>
  );
}

/* =========================
   ScenarioChart (Canvas)
========================= */

function ScenarioChart({
  symbol, entry, sl, tp, direction, scenario
}: {
  symbol: SymbolKey;
  entry: number;
  sl: number;
  tp: number;
  direction: 'buy' | 'sell';
  scenario: 'tp' | 'sl';
}) {
  const ref = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const cvs = ref.current;
    if (!cvs) return;
    const ctx = cvs.getContext('2d')!;
    if (!ctx) return;

    const W = cvs.width, H = cvs.height;
    const padL = 16, padR = 70, padB = 36, padT = 12;

    const spec = CONTRACT[symbol];
    const pip = spec.pip;
    const digits = Math.max(0, Math.round(-Math.log10(pip)));
    const fmtPrice = (v: number) => v.toFixed(digits);

    const M5 = 5 * 60 * 1000;
    const PRE = 8, POST = 24, N = PRE + POST;

    const towardTP = direction === 'buy';
    const target = scenario === 'tp' ? (towardTP ? tp : sl) : (towardTP ? sl : tp);
    const trendUp = target > entry;
    const trendGreenProb = 0.7;

    const coreRange = Math.max(Math.abs(tp - sl), Math.abs(target - entry)) || pip * 100;
    const avgBody = (coreRange / POST) * 1.1;
    const avgWick = avgBody * 0.9;

    type C = { o:number; h:number; l:number; c:number; i:number };
    const candles: C[] = [];
    let lastClose = entry;

    for (let i = 0; i < PRE; i++) {
      const noiseDir = Math.random() < 0.5 ? -1 : 1;
      const body = (avgBody * (0.4 + Math.random() * 0.8)) * noiseDir;
      const wickUp = avgWick * (0.5 + Math.random() * 1.2);
      const wickDn = avgWick * (0.5 + Math.random() * 1.2);
      const o = lastClose;
      const c = o + body * 0.5;
      const hi = Math.max(o, c) + wickUp;
      const lo = Math.min(o, c) - wickDn;
      candles.push({ o, h: hi, l: lo, c, i });
      lastClose = c;
    }

    for (let j = 0; j < POST; j++) {
      const i = PRE + j;
      const t = j / Math.max(1, POST - 1);
      const toward = (target - lastClose);
      const pull = toward * (0.08 + 0.55 * Math.pow(t, 1.35));
      const bodyUp = Math.random() < (trendUp ? trendGreenProb : 1 - trendGreenProb);
      const bodyDir = bodyUp ? 1 : -1;
      const bodySize = (avgBody * (0.6 + Math.random() * 1.4)) * bodyDir;
      const wickUp = avgWick * (0.5 + Math.random() * 1.4);
      const wickDn = avgWick * (0.5 + Math.random() * 1.4);
      const o = lastClose;
      let c = o + pull + bodySize;
      if (j === POST - 1) c = target;
      const hi = Math.max(o, c) + wickUp;
      const lo = Math.min(o, c) - wickDn;
      candles.push({ o, h: hi, l: lo, c, i });
      lastClose = c;
    }

    const all = [entry, sl, tp, ...candles.flatMap(k => [k.h, k.l])];
const minRaw = Math.min(...all);
const maxRaw = Math.max(...all);
const padY = (maxRaw - minRaw) * 0.14 || pip * 40;
    const minP = minRaw - padY;
    const maxP = maxRaw + padY;
    const range = maxP - minP;

    const y = (p: number) => padT + (1 - (p - minP) / range) * (H - padT - padB);
    const x = (idx: number) => padL + (idx / (N - 1)) * (W - padL - padR);

    function axes() {
      ctx.strokeStyle = '#3a3a3a';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(padL, H - padB);
      ctx.lineTo(W - padR, H - padB);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(W - padR, padT);
      ctx.lineTo(W - padR, H - padB);
      ctx.stroke();

      ctx.font = '12px system-ui, -apple-system, Segoe UI, Roboto';
      ctx.fillStyle = '#bbb';
      const ticks = 7;
      for (let i = 0; i < ticks; i++) {
        const tt = i / (ticks - 1);
        const p = minP + tt * range;
        const yy = y(p);
        ctx.strokeStyle = '#2f2f2f';
        ctx.beginPath();
        ctx.moveTo(padL, yy);
        ctx.lineTo(W - padR, yy);
        ctx.stroke();
        ctx.fillText(fmtPrice(p), W - padR + 6, yy + 4);
      }

      const now = new Date();
      const startTime = new Date(now.getTime() - PRE * M5);
      const midTime = new Date(startTime.getTime() + Math.floor((N - 1) / 2) * M5);
      const endTime = new Date(startTime.getTime() + (N - 1) * M5);
      const fmtTime = (d: Date) => d.toLocaleString(undefined, {
        day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit', hour12: false,
      });

      ctx.fillStyle = '#aaa';
      ctx.textAlign = 'left';   ctx.fillText(fmtTime(startTime), padL, H - padB + 16);
      ctx.textAlign = 'center'; ctx.fillText(fmtTime(midTime), (padL + (W - padR)) / 2, H - padB + 16);
      ctx.textAlign = 'right';  ctx.fillText(fmtTime(endTime), W - padR, H - padB + 16);
      ctx.textAlign = 'left';

      const drawH = (p: number, label: string, col: string, dashed = true) => {
        if (dashed) ctx.setLineDash([6, 6]);
        ctx.strokeStyle = col;
        ctx.beginPath();
        ctx.moveTo(padL, y(p));
        ctx.lineTo(W - padR, y(p));
        ctx.stroke();
        ctx.setLineDash([]);
        ctx.fillStyle = col;
        ctx.fillText(`${label} ${fmtPrice(p)}`, padL + 6, y(p) - 16);
      };
      drawH(tp, 'TP', '#22c55e', true);
      drawH(sl, 'SL', '#ef4444', true);
      drawH(entry, 'Entry', '#e5e7eb', false);
    }

    function drawCandle(k: C, cx: number, w: number) {
      const up = k.c >= k.o;
      const bodyColor = up ? '#22c55e' : '#ef4444';
      const wickColor = up ? '#86efac' : '#fca5a5';

      ctx.strokeStyle = wickColor;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(cx, y(k.h));
      ctx.lineTo(cx, y(k.l));
      ctx.stroke();

      const top = Math.min(y(k.o), y(k.c));
      const bot = Math.max(y(k.o), y(k.c));
      const bw = Math.max(3, Math.min(12, w * 0.6));
      const bh = Math.max(1, bot - top);
      ctx.fillStyle = bodyColor;
      ctx.fillRect(cx - bw / 2, top, bw, bh);
    }

    let prog = 0;
    let raf = 0 as number;

    function loop() {
      ctx.clearRect(0, 0, W, H);
      axes();
      const colW = (W - padL - padR) / (N - 1);
      const maxIndex = Math.min(N - 1, Math.floor(prog));
      for (let i = 0; i <= maxIndex; i++) {
        drawCandle(candles[i], x(i), colW);
      }
      prog += 0.22;
      if (prog > N - 1 + 0.999) prog = N - 1 + 0.999;
      raf = requestAnimationFrame(loop);
    }

    prog = 0;
    loop();
    return () => cancelAnimationFrame(raf);
  }, [symbol, entry, sl, tp, direction, scenario]);

  return <canvas ref={ref} className="ta-chart-canvas" width={640} height={320} />;
}