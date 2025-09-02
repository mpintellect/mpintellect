'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';

type Product = { id: string; name: string; priceUsd: number; type: 'one_time' | 'subscription' };
type ProductId = string;
type CategoryKey = 'tools' | 'robots';

export default function CheckoutClient() {
  const searchParams = useSearchParams();

  const [productId, setProductId] = useState<ProductId>('ai-assistant-monthly');
  const [email, setEmail] = useState('');
  const [buyerName, setBuyerName] = useState('');
  const [category, setCategory] = useState<CategoryKey>('tools');

  const [products, setProducts] = useState<Product[]>([]);
  const [amountUsd, setAmountUsd] = useState<number>(0);
  const [error, setError] = useState<string>('');

  // Accept ?product=… / ?bot=… / ?pid=…
  useEffect(() => {
    const q =
      searchParams.get('product') ||
      searchParams.get('bot') ||
      searchParams.get('pid');
    const allowed: ProductId[] = [
      'ai-assistant-monthly',
      'ai-assistant-pro',
      'scalper-x1',
      'fibonacci-pro',
      'trend-seeker-ai',
      'hedge-matrix',
    ];
    if (q && allowed.includes(q)) setProductId(q);
  }, [searchParams]);

  // Load products
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch('/api/products', { cache: 'no-store' });
        const json = await res.json();
        if (res.ok && json?.ok && Array.isArray(json.products) && json.products.length) {
          setProducts(json.products);
          if (!json.products.find((p: Product) => p.id === productId)) {
            setProductId(json.products[0].id);
            setAmountUsd(json.products[0].priceUsd);
          }
        } else {
          setError(json?.error || 'Failed to load products');
        }
      } catch (e: any) {
        setError(e?.message || 'Failed to load products');
      }
    })();
  }, []);

  // Category filters
  const tools = useMemo(() => products.filter(p => p.type === 'subscription'), [products]);
  const robots = useMemo(() => products.filter(p => p.type === 'one_time'), [products]);
  const filtered = category === 'tools' ? tools : robots;

  // Auto-pick product when category changes
  useEffect(() => {
    if (!filtered.find(p => p.id === productId)) {
      setProductId(filtered[0]?.id ?? '');
    }
  }, [category, filtered, productId]);

  // Update price on product change
  useEffect(() => {
    const found = products.find((p) => p.id === productId);
    if (found) setAmountUsd(found.priceUsd);
  }, [productId, products]);

  // Payment
  async function payWithCard() {
    try {
      setError('');
      if (!email) {
        setError('Please enter your email first.');
        return;
      }
      const res = await fetch('/api/stripe/create-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId, email, buyerName }),
      });
      const j = await res.json();
      if (res.ok && j?.ok && j?.url) {
        window.location.href = j.url;
      } else {
        setError(j?.error || 'Could not start Stripe checkout');
      }
    } catch (e: any) {
      setError(e?.message || 'Stripe error');
    }
  }

  return (
    <div className="checkout-wrap">
      <h1 className="checkout-title">Checkout</h1>
      <div className="checkout-card">
        <h3 className="checkout-card-title">Product</h3>

        <div className="checkout-grid">
          {/* First: Category Selector */}
          <label className="checkout-field">
            <span>Choose Category</span>
            <select
              className="checkout-input"
              value={category}
              onChange={(e) => setCategory(e.target.value as CategoryKey)}
            >
              <option value="tools">AI Tools (Subscription)</option>
              <option value="robots">AI Robots (One-Time)</option>
            </select>
          </label>

          {/* Second: Product Selector (filtered) */}
          <label className="checkout-field">
            <span>Choose Product</span>
            <select
              className="checkout-input"
              value={productId}
              onChange={(e) => setProductId(e.target.value)}
              disabled={filtered.length === 0}
            >
              {filtered.length === 0 ? (
                <option value="">No products available</option>
              ) : (
                filtered.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} (${p.priceUsd})
                  </option>
                ))
              )}
            </select>
          </label>

          {/* Email & Name */}
          <label className="checkout-field">
            <span>Your Email</span>
            <input
              className="checkout-input"
              type="email"
              placeholder="you@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </label>

          <label className="checkout-field">
            <span>Your Name (optional)</span>
            <input
              className="checkout-input"
              type="text"
              placeholder="John Smith"
              value={buyerName}
              onChange={(e) => setBuyerName(e.target.value)}
            />
          </label>
        </div>

        {/* Pay Button */}
        <div className="checkout-tabs">
          <button
            type="button"
            className="checkout-tab primary"
            onClick={payWithCard}
            aria-label="Pay with bank card via Stripe"
          >
            Pay with Card (Stripe)
          </button>
        </div>

        {/* Price Preview */}
        {amountUsd > 0 && (
          <p className="checkout-note" style={{ marginTop: 10 }}>
            Total: <b>${amountUsd.toFixed(2)}</b>
          </p>
        )}

        {!!error && <p className="checkout-error">{error}</p>}
      </div>
    </div>
  );
}