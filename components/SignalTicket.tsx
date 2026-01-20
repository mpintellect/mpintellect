'use client';

import { X, Share2, Copy, Send, Mail } from 'lucide-react';
import toast from 'react-hot-toast';

interface Props {
  data: {
    symbol: string;
    action: string;
    entry: string;
    sl: string;
    tp: string;
    lot: string;
    slDistanceUSD: number;
    tpDistanceUSD: number;
  };
  onClose: () => void;
}

export default function SignalTicket({ data, onClose }: Props) {
  const isBuy = data.action === 'BUY';

  const handleShare = async (platform: string) => {
    const text = `🚀 MZPrimer Signal: ${data.symbol} ${data.action}\nEntry: ${data.entry}\nSL: ${data.sl} (Risk: -$${data.slDistanceUSD.toFixed(2)})\nTP: ${data.tp} (Profit: $${data.tpDistanceUSD.toFixed(2)})\nLot Size: ${data.lot} Lots\n\nGet more AI Analysis at: https://mzprimer.com/`;
    const url = encodeURIComponent(window.location.href);
    
    if (platform === 'copy') {
      try {
        await navigator.clipboard.writeText(text);
        toast.success('Copied to clipboard');
      } catch (err) {
        // Fallback
        const textArea = document.createElement("textarea");
        textArea.value = text;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        toast.success('Copied to clipboard');
      }
    } else if (platform === 'whatsapp') {
      window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
    } else if (platform === 'telegram') {
      window.open(`https://t.me/share/url?url=${url}&text=${encodeURIComponent(text)}`, '_blank');
    } else if (platform === 'website') {
      window.open('https://www.litefinance.org/?uid=967798214', '_blank');
    }
  };

  // Handle overlay click (close only when clicking the overlay itself)
  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div 
      className="ticket-overlay" 
      onClick={handleOverlayClick}
    >
      <div 
        className={`ticket-modal ${isBuy ? 'buy-mode' : 'sell-mode'}`}
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Decorative Top Accent */}
        <div className="ticket-accent-bar" />

        <button onClick={onClose} className="ticket-close-btn">
          <X size={20} />
        </button>

        <div className="ticket-content">
          <h2 className="ticket-symbol">{data.symbol}</h2>
          
          <div className="ticket-badge">
            {data.action} NOW
          </div>

          <div className="ticket-grid">
            <div className="ticket-item entry">
              <span className="label">Entry</span>
              <span className="value">{data.entry}</span>
            </div>
            <div className="ticket-item stop">
              <span className="label">Stop (SL)</span>
              <span className="value">{data.sl}</span>
              <span className="distance-value text-red-400">-${data.slDistanceUSD.toFixed(2)}</span>
            </div>
            <div className="ticket-item target">
              <span className="label">Target (TP)</span>
              <span className="value">{data.tp}</span>
              <span className="distance-value text-emerald-400">+${data.tpDistanceUSD.toFixed(2)}</span>
            </div>
          </div>

          <div className="ticket-lot-hero">
             <span className="lot-label">Recommended Size</span>
             <div className="lot-value">
               {data.lot} <span className="unit">Lots</span>
             </div>
          </div>

          <div className="ticket-share-grid">
            <button 
              className="share-btn" 
              onClick={() => handleShare('copy')}
            >
              <Copy size={18}/>
            </button>
            <button 
              className="share-btn" 
              onClick={() => handleShare('telegram')}
            >
              <Send size={18}/>
            </button>
            <button 
              className="share-btn" 
              onClick={() => handleShare('whatsapp')}
            >
              <span className="wa-text font-bold">WA</span>
            </button>
            <button 
              className="share-btn" 
              onClick={() => handleShare('website')}
            >
              <Share2 size={18}/>
            </button>
          </div>
        </div>

        <button onClick={onClose} className="ticket-footer-btn">
          Close & View Full Analysis
        </button>
      </div>
    </div>
  );
}