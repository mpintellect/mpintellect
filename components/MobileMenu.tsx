'use client';

import { useState } from 'react';
import { Trophy, Zap, Shield, TrendingUp, CreditCard, Star, LogOut } from 'lucide-react';
import { useRouter } from 'next/navigation';

const navItems = [
  { label: 'Home', href: '/', icon: <Trophy size={18} className="premium-nav-icon" /> },
  { label: 'AI Chat', href: '/AIChat', icon: <Zap size={18} className="premium-nav-icon" /> },
  { label: 'News', href: '/news', icon: <TrendingUp size={18} className="premium-nav-icon" /> },
  { label: '🔴 LIVE MARKETS', href: '/markets', icon: <Shield size={18} className="premium-nav-icon" /> },
  { label: 'Prop Trading', href: '/prop-firm', icon: <Shield size={18} className="premium-nav-icon" /> },
  { label: 'Trading Robots', href: '/ai-robot', icon: <Zap size={18} className="premium-nav-icon" /> },
  { label: 'AI Assistant', href: '/tools/ai-assistant', icon: <Zap size={18} className="premium-nav-icon" /> },
  { label: 'Contact', href: '/#contacts', icon: <Star size={18} className="premium-nav-icon" /> },
  { label: 'Privacy', href: '/legal', icon: <Star size={18} className="premium-nav-icon" /> },
  { label: 'LOGIN', href: '/client/login', icon: <LogOut size={18} className="premium-nav-icon" /> },
];

export default function MobileMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeItem, setActiveItem] = useState<string | null>(null);
  const router = useRouter();

  const handleNavigation = (href: string) => {
    setActiveItem(href);
    setIsOpen(false);
    router.push(href);
  };

  return (
    <>
      {/* MOBILE NAVIGATION - Burger Menu */}
      <nav className="premium-mobile-nav">
        <button 
          className={`premium-mobile-burger ${isOpen ? 'open' : ''}`}
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle menu"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </nav>

      {/* MOBILE MENU */}
      <div className={`premium-mobile-menu ${isOpen ? 'open' : ''}`}>
        <div className="premium-mobile-items" style={{ paddingTop: '20px' }}>
          {navItems.map((item) => (
            <button
              key={item.href}
              onClick={() => handleNavigation(item.href)}
              className={`premium-mobile-item ${item.label === 'LOGIN' ? 'premium-mobile-login' : ''} ${activeItem === item.href ? 'active' : ''}`}
            >
              {item.icon}
              <span>{item.label}</span>
            </button>
          ))}
        </div>
      </div>

      <style jsx>{`
        .premium-mobile-burger.open span:nth-child(1) {
          transform: rotate(45deg) translate(5px, 5px) !important;
          background: var(--gold-soft, #8e793e) !important;
        }
        .premium-mobile-burger.open span:nth-child(2) {
          opacity: 0 !important;
        }
        .premium-mobile-burger.open span:nth-child(3) {
          transform: rotate(-45deg) translate(5px, -5px) !important;
          background: var(--gold-soft, #8e793e) !important;
        }
        .premium-mobile-burger span {
          transition: all 0.2s ease !important;
        }
        .premium-mobile-burger:hover span {
          background: var(--gold-soft, #8e793e) !important;
        }
        .premium-mobile-burger {
          border-color: ${isOpen ? 'var(--gold-soft, #8e793e)' : 'var(--border-subtle, rgba(255,255,255,0.04))'} !important;
        }
      `}</style>
    </>
  );
}