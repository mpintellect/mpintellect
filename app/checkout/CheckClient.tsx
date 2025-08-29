'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { useSearchParams } from 'next/navigation'
// tiny inline QR generator (svg) – no external deps
function qrSvg(data: string, size = 180) {
  // very small data QR via Google Chart as a fallback (works fine for addresses)
  const u = `https://chart.googleapis.com/chart?cht=qr&chs=${size}x${size}&chl=${encodeURIComponent(data)}`;
  return u;
}

type Product = { id: string; name: string; priceUsd: number; type: 'one_time' | 'subscription' };
type ProductId = string;

export default function CheckoutClient() {
  const searchParams = useSearchParams();
  const [productId, setProductId] = useState<ProductId>('ai-assistant-monthly');
  const [paymentMethod, setPaymentMethod] = useState<'usdt'|'card'>('usdt');
  const [email, setEmail] = useState('');
  const [buyerName, setBuyerName] = useState('');

  const [orderId, setOrderId] = useState<string | null>(null);
  const [depositAddress, setDepositAddress] = useState<string>('');
  const [amountUsd, setAmountUsd] = useState<number>(0);
  const [network, setNetwork] = useState<string>('TRC20');
  const [copied, setCopied] = useState(false);
const [expiresAt, setExpiresAt] = useState<number | null>(null);
const [remaining, setRemaining] = useState<number>(0); // seconds
  const [status, setStatus] = useState<'idle'|'creating'|'awaiting'|'paid'|'error'>('idle');
  const [error, setError] = useState<string>('');
  const pollRef = useRef<number | null>(null);
const [products, setProducts] = useState<Product[]>([]);

// Read ?product=... OR ?bot=... and map to internal product IDs
useEffect(() => {
  const sp = new URLSearchParams(window.location.search);
  const raw = (sp.get('product') || sp.get('bot') || '').toLowerCase();

  // map aliases to your internal ProductId values
  const MAP: Record<string, ProductId> = {
    'ai': 'ai-assistant-monthly',
    'ai-assistant': 'ai-assistant-monthly',
    'ai-assistant-monthly': 'ai-assistant-monthly',

    'ai-pro': 'ai-assistant-pro',
    'ai-assistant-pro': 'ai-assistant-pro',

    'scalper': 'scalper-x1',
    'scalper-x1': 'scalper-x1',

    'fibonacci': 'fibonacci-pro',
    'fibonacci-pro': 'fibonacci-pro',
    'trend-seeker': 'trend-seeker-ai',
    'trend-seeker-ai': 'trend-seeker-ai',
    'hedge-matrix': 'hedge-matrix'
  };

  const mapped = MAP[raw];
  if (mapped) setProductId(mapped);
}, []);

useEffect(() => {
  (async () => {
    try {
      const res = await fetch('/api/products', { cache: 'no-store' });
      const json = await res.json();
      if (res.ok && json?.ok && Array.isArray(json.products) && json.products.length) {
        setProducts(json.products);
        // default select the first product if current id is empty or no longer available
        if (!json.products.find((p: Product) => p.id === productId)) {
          setProductId(json.products[0].id);
          setAmountUsd(json.products[0].priceUsd);
        }
      }
    } catch {}
  })();
}, []);
// Preselect product from URL ?product=... (also accept ?bot= or ?pid=)
  useEffect(() => {
    const q =
      searchParams.get('product') ||
      searchParams.get('bot') ||
      searchParams.get('pid');

    // Allowed list to keep typings tight
    const allowed: ProductId[] = [
      'ai-assistant-monthly',
      'ai-assistant-pro',
      'scalper-x1',
      'fibonacci-pro',
      'trend-seeker-ai',
      'hedge-matrix'
    ];

    if (q && (allowed as readonly string[]).includes(q)) {
      setProductId(q as ProductId);
    }
  }, [searchParams]);
// keep amount in sync when product changes
useEffect(() => {
  const found = products.find(p => p.id === productId);
  if (found) setAmountUsd(found.priceUsd);
}, [productId, products]);
  // Create the order and fetch a unique deposit address
  async function createOrder() {
    try {
      setStatus('creating');
      setError('');
      const res = await fetch('/api/checkout', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    productId,            // "ai-assistant-monthly", "ai-assistant-pro", etc.
    email,
    buyerName,
    method: 'usdt',          // optional
  }),
});
      const json = await res.json();
      if (!res.ok || !json?.ok) throw new Error(json?.error || 'Checkout failed');

      setOrderId(json.orderId);
      setDepositAddress(json.depositAddress);
      setAmountUsd(json.amountUsd);
      setNetwork(json.network || 'TRC20');
      setExpiresAt(Number(json.expiresAt || 0) || null);
      setStatus('awaiting');
    } catch (e:any) {
      setError(e.message || 'Failed to create order');
      setStatus('error');
    }
  }

  // Poll server to confirm payment
  useEffect(() => {
    if (!orderId || status !== 'awaiting') return;

    const poll = async () => {
      try {
        const r = await fetch(`/api/payment/check-usdt?orderId=${orderId}`, { cache: 'no-store' });
        const j = await r.json();
        if (j?.status === 'paid') {
  setStatus('paid');
  const next = `/thank-you?orderId=${encodeURIComponent(orderId)}${j?.licenseKey ? `&license=${encodeURIComponent(j.licenseKey)}` : ''}`;
  window.location.href = next;
}
      } catch {
        /* ignore temporary errors */
      }
    };

    poll(); // first immediate
    pollRef.current = window.setInterval(poll, 5000) as unknown as number;
    return () => {
      if (pollRef.current) clearInterval(pollRef.current);
      pollRef.current = null;
    };
  }, [orderId, status]);
useEffect(() => {
  if (!expiresAt || status === 'paid') return;
  const tick = () => {
    const secs = Math.max(0, Math.floor((expiresAt - Date.now()) / 1000));
    setRemaining(secs);
    if (secs === 0 && status === 'awaiting') {
      setStatus('error');
      setError('Order expired. Please create a new order.');
    }
  };
  tick();
  const id = window.setInterval(tick, 1000);
  return () => clearInterval(id);
}, [expiresAt, status]);
function handleCopyAddress() {
  if (!depositAddress) return;
  navigator.clipboard.writeText(depositAddress).then(
    () => {
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    },
    () => {
      // fallback if clipboard fails
      try {
        const tmp = document.createElement('textarea');
        tmp.value = depositAddress;
        document.body.appendChild(tmp);
        tmp.select();
        document.execCommand('copy');
        document.body.removeChild(tmp);
        setCopied(true);
        window.setTimeout(() => setCopied(false), 1800);
      } catch {}
    }
  );
}
  return (
    <div className="checkout-wrap">
      <h1 className="checkout-title">Checkout</h1>

      {/* 1) Product / customer */}
      <div className="checkout-card">
        <h3 className="checkout-card-title">Product</h3>
        <div className="checkout-grid">
          <label className="checkout-field">
            <span>Choose</span>
            <select
  className="checkout-input"
  value={productId}
  onChange={(e)=>setProductId(e.target.value)}
  disabled={status==='awaiting' || status==='paid' || products.length === 0}
>
  {products.length === 0 ? (
    <option value="">Loading products…</option>
  ) : (
    products.map(p => (
      <option key={p.id} value={p.id}>
        {p.name} (${p.priceUsd})
      </option>
    ))
  )}
</select>
          </label>

          <label className="checkout-field">
            <span>Your email</span>
            <input
              className="checkout-input"
              type="email"
              placeholder="you@email.com"
              value={email}
              onChange={(e)=>setEmail(e.target.value)}
              disabled={status==='awaiting' || status==='paid'}
            />
          </label>

          <label className="checkout-field">
            <span>Your name (optional)</span>
            <input
              className="checkout-input"
              type="text"
              placeholder="John Smith"
              value={buyerName}
              onChange={(e)=>setBuyerName(e.target.value)}
              disabled={status==='awaiting' || status==='paid'}
            />
          </label>
        </div>
<div className="checkout-tabs">
  <button
    type="button"
    className={`checkout-tab ${paymentMethod === 'usdt' ? 'active' : ''}`}
    onClick={() => setPaymentMethod('usdt')}
  >
    USDT (TRC20)
  </button>
  <button
    type="button"
    className="checkout-tab disabled"
    title="Card payments via Stripe will be available soon"
    onClick={(e) => e.preventDefault()}
  >
    Bank Card Payment — soon
  </button>
</div>
        {paymentMethod === 'usdt' ? (
  <button
    className="checkout-btn"
    onClick={createOrder}
    disabled={status==='creating' || status==='awaiting' || status==='paid' || !productId || !email}
  >
    {status==='creating' ? 'Creating order…' : 'Create USDT Order'}
  </button>
) : (
  <button
    className="checkout-btn secondary disabled"
    title="Card payments via Stripe will be available soon"
    onClick={(e) => e.preventDefault()}
  >
    Bank Card Payment — soon
  </button>
)}

        {!!error && <p className="checkout-error">{error}</p>}
      </div>

      {/* 2) Payment box */}
      {status !== 'idle' && orderId && (
        <div className="checkout-card">
          <h3 className="checkout-card-title">Pay with USDT ({network})</h3>
          {status !== 'paid' ? (
            <>
              <p className="checkout-note">Send exactly <b>${amountUsd.toFixed(2)}</b> in USDT to:</p>

<div className="wallet-address">
  <span className={`wallet-text ${copied ? 'copied' : ''}`}>
    {depositAddress}
  </span>
  <button
    type="button"
    className={`copy-btn ${copied ? 'copied' : ''}`}
    onClick={handleCopyAddress}
    aria-live="polite"
  >
    {copied ? 'Copied' : 'Copy'}
  </button>
</div>
<p className="network-info">Network: {network || 'TRC20'}</p>

{depositAddress && (
  <div className="checkout-qr">
    <QRCodeSVG value={depositAddress} size={128} />
    <p className="checkout-qr-label">USDT deposit QR</p>
  </div>
)}

{expiresAt && status === 'awaiting' && (
  <p className="checkout-expiry">
    Expires in <b>{Math.floor(remaining/60)}:{String(remaining%60).padStart(2,'0')}</b>
  </p>
)}

<p className="checkout-hint">We’ll auto-detect your payment. Keep this page open.</p>
<p className="checkout-status">
  Status: {status === 'awaiting' ? 'Awaiting payment…' : status === 'error' ? 'Expired' : 'Preparing…'}
</p>
            </>
          ) : (
            <div className="checkout-paid">
              <p>✅ Payment confirmed. You’re all set!</p>
              <a className="checkout-btn" href="/tools/ai-assistant">Open AI Assistant</a>
            </div>
          )}
        </div>
      )}
    </div>
  );
}