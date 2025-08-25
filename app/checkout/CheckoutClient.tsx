'use client';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useState, useEffect, useCallback } from 'react';

interface Bot { id: string; name: string; price: number; }
const BOTS: Record<string, Bot> = {
  scalper:   { id: 'scalper',   name: 'Scalper X1',    price: 129 },
  fibonacci: { id: 'fibonacci', name: 'Fibonacci Pro', price: 149 },
  // coming soon kept out
};

type PaymentMethod = 'card' | 'usdt';
type PaymentStatus = 'idle' | 'waiting' | 'confirmed' | 'failed' | 'error';

const WALLET_ADDRESS = 'TFqEuQYmZyUjqE7JUKVZ6t1Pr6wmcg7DVM';

export default function CheckoutClient() {
  const params = useSearchParams();
  const botId = params.get('bot') || 'scalper';
  const selectedBot = BOTS[botId as keyof typeof BOTS] || BOTS.scalper;

  const [fullName, setFullName] = useState('');                 // ← NEW
  const [email, setEmail] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('card');
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>('idle');
  const [confirmed, setConfirmed] = useState(false);            // ← NEW (order confirmed)
  const [txid, setTxid] = useState('');
  const [orderId, setOrderId] = useState<string | null>(null);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [errMsg, setErrMsg] = useState<string | null>(null);
  const [timeLeft, setTimeLeft] = useState<number>(30 * 60); // 30 minutes
  const [timerActive, setTimerActive] = useState(false);

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(WALLET_ADDRESS);
    } catch {
      const ta = document.createElement('textarea');
      ta.value = WALLET_ADDRESS;
      ta.style.position = 'fixed';
      ta.style.opacity = '0';
      document.body.appendChild(ta);
      ta.focus(); ta.select();
      try { document.execCommand('copy'); } finally { document.body.removeChild(ta); }
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }, []);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // SERVER: create order (USDT)
  async function createUsdtOrder(toEmail: string) {
    const productIdHint =
      botId === 'scalper'   ? 'scalper-x1' :
      botId === 'fibonacci' ? 'fibonacci-pro' :
      'scalper-x1';

    const payload = {
      method: 'usdt' as const,
      email: toEmail,
      productId: productIdHint,
      productName: selectedBot.name,
      amountUsd: selectedBot.price,
    };

    const res = await fetch('/api/order/create', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      console.error('order/create failed', res.status, data);
      setErrMsg(data?.error || `order/create ${res.status}`);
      throw new Error(data?.error || 'Order creation failed');
    }
    setErrMsg(null);
    return data as { orderId: string };
  }

  // Poll backend for USDT status
  useEffect(() => {
    if (!orderId || paymentStatus !== 'waiting') return;
    const t = setInterval(async () => {
      try {
        const res = await fetch(`/api/payment/check-usdt?orderId=${orderId}&txid=${encodeURIComponent(txid || '')}`);
        const data = await res.json();
        if (data.status === 'paid' && data.token) {
          setPaymentStatus('confirmed');
          setDownloadUrl(`/api/download?token=${encodeURIComponent(data.token)}`);
          setErrMsg(null);
        } else if (data.status === 'pending') {
          // keep waiting
        } else if (data.error) {
          console.warn('check-usdt error:', data.error);
          setErrMsg(data.error);
          setPaymentStatus('failed');
        }
      } catch (e) {
        console.error('poll error', e);
      }
    }, 5000);
    return () => clearInterval(t);
  }, [orderId, paymentStatus, txid]);

  // Payment countdown
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (timerActive && timeLeft > 0) {
      interval = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
    } else if (timeLeft === 0 && timerActive) {
      setTimerActive(false);
      setErrMsg('Payment time expired. Please refresh the page to try again.');
      if (orderId) {
        fetch(`/api/order/expire?orderId=${orderId}`, { method: 'POST' }).catch(console.error);
      }
    }
    return () => clearInterval(interval);
  }, [timerActive, timeLeft, orderId]);

  // 🔘 Confirm order first, then show payment instructions
  const handleConfirmOrder = async () => {
    if (!fullName.trim()) { setErrMsg('Please enter your full name.'); return; }
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
      setErrMsg('Please enter a valid email address.');
      return;
    }
    setErrMsg(null);

    if (paymentMethod === 'usdt') {
      try {
        const created = await createUsdtOrder(email);
        setOrderId(created.orderId);
        setConfirmed(true);
        setPaymentStatus('waiting');     // start polling
        setTimerActive(true);            // start countdown
        setTimeLeft(30 * 60);
      } catch {
        setPaymentStatus('error');
      }
    } else {
      // Card: no server order yet (Stripe coming soon)
      setConfirmed(true);
      setPaymentStatus('idle');
    }
  };

  const renderStatus = () => {
    if (paymentStatus === 'waiting')   return <div className="status waiting">⌛ Waiting for payment...</div>;
    if (paymentStatus === 'confirmed') return <div className="status confirmed">✅ Payment confirmed! Download will start shortly.</div>;
    if (paymentStatus === 'failed')    return <div className="status failed">❌ Payment not detected. Please try again.</div>;
    if (paymentStatus === 'error')     return <div className="status error">❌ Error creating order.</div>;
    return null;
  };

  return (
    <div className="checkout-container">
      <Link href="/" className="back-home">
        <h1 className="checkout-title">Checkout</h1>
      </Link>

      <div className="bot-summary">
        <h2 className="bot-name">{selectedBot.name}</h2>
        <p className="bot-price">${selectedBot.price}</p>
      </div>

      {/* 🔹 Name */}
      <div className="name-field">
        <label htmlFor="buyerName" className="email-label">Full Name</label>
        <input
          id="buyerName" type="text" className="email-input"
          value={fullName} onChange={(e) => setFullName(e.target.value)}
          placeholder="John Doe" required
        />
      </div>

      {/* 🔹 Email */}
      <div className="email-field">
        <label htmlFor="buyerEmail" className="email-label">Email</label>
        <input
          id="buyerEmail" type="email" className="email-input"
          value={email} onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com" required
        />
        <p className="email-hint">We’ll send your one-time download link here.</p>
      </div>

      {/* 🔹 Payment */}
      <div className="payment-section">
        <h3 className="payment-title">Payment Method</h3>

        <div className="payment-buttons">
          <button
            onClick={() => setPaymentMethod('card')}
            className={`payment-btn ${paymentMethod === 'card' ? 'active' : ''}`}
          >💳 Card</button>

          <button
            onClick={() => setPaymentMethod('usdt')}
            className={`payment-btn ${paymentMethod === 'usdt' ? 'active' : ''}`}
          >🪙 USDT (TRC20)</button>
        </div>

        {/* Confirm first */}
        {!confirmed && (
          <div className="preconfirm-box">
            <p>Click <b>Confirm Order</b> to generate your payment instructions.</p>
            {errMsg && <div className="status error">{errMsg}</div>}
            <button
              onClick={handleConfirmOrder}
              className="confirm-btn"
            >
              Confirm Order
            </button>
          </div>
        )}

        {/* After confirmation, show the selected payment instructions */}
        {confirmed && (
          <>
            {paymentMethod === 'card' ? (
              <div className="card-placeholder">
                <p>Stripe integration coming soon.</p>
                <button disabled className="card-pay-btn">Pay with Card</button>
              </div>
            ) : (
              <div className="usdt-section">
                <div className="wallet-box">
                  <p>Send <strong>${selectedBot.price} USDT</strong> to:</p>
                  <div className="wallet-address">
                    <code className={`wallet-text${copied ? ' copied' : ''}`}>{WALLET_ADDRESS}</code>
                    <button onClick={handleCopy} className={`copy-btn${copied ? ' copied' : ''}`}>
                      {copied ? 'Copied' : 'Copy'}
                    </button>
                  </div>
                  <p className="network-info">Network: TRON (TRC20)</p>
                </div>

                {renderStatus()}
                {errMsg && <div className="status error">{errMsg}</div>}

                {paymentStatus === 'waiting' && timerActive && (
                  <div className="timer-container">
                    <div className="timer-text">
                      ⏰ Time to complete payment: {formatTime(timeLeft)}
                    </div>
                    <div className="timer-progress">
                      <div
                        className="timer-progress-bar"
                        style={{
                          width: `${(timeLeft / (30 * 60)) * 100}%`,
                          backgroundColor: timeLeft > 60 ? '#28a745' : '#dc3545'
                        }}
                      />
                    </div>
                    <p className="timer-warning">
                      {timeLeft <= 60 ? 'Hurry! Less than 1 minute left!' : 'Please complete payment within the time limit'}
                    </p>
                  </div>
                )}

                {paymentStatus === 'waiting' && !timerActive && timeLeft === 0 && (
                  <div className="status expired">
                    ❌ Payment time expired. Order canceled. Please refresh to try again.
                  </div>
                )}

                <div className="txid-input">
                  <label>Transaction ID (Optional)</label>
                  <input
                    type="text" value={txid}
                    onChange={(e) => setTxid(e.target.value)}
                    placeholder="Enter TXID for faster verification"
                  />
                  <p>Providing TXID will speed up verification</p>
                </div>

                {/* Note: the old "Confirm Payment" button is no longer needed; we confirmed already */}
                {paymentStatus === 'confirmed' && downloadUrl && (
                  <div className="download-panel">
                    <a href={downloadUrl} className="download-link">Download EA (.ex5)</a>
                    <div className="download-note">We also emailed you this one-time link (expires in 24h).</div>
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}