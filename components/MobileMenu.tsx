'use client';

import { useState } from 'react';
import { Trophy, Zap, Shield, TrendingUp, Star, LogOut, ChevronRight, BarChart3 } from 'lucide-react';
import { useRouter } from 'next/navigation';

const navItems = [
  { label: 'Home', href: '/', icon: <Trophy size={18} className="premium-nav-icon" /> },
  { label: 'AI Chat', href: '/AIChat', icon: <Zap size={18} className="premium-nav-icon" /> },
  { label: 'Live Charts', href: '/charts', icon: <BarChart3 size={18} className="premium-nav-icon" /> },
  { label: 'News', href: '/news', icon: <TrendingUp size={18} className="premium-nav-icon" /> },
  { label: 'Live Markets', href: '/markets', icon: <Shield size={18} className="premium-nav-icon" />, live: true },
  { label: 'AI Funded', href: '/prop-firm', icon: <Shield size={18} className="premium-nav-icon" /> },
  { label: 'EA', href: '/ai-robot', icon: <Zap size={18} className="premium-nav-icon" /> },
  { label: 'AI Assistant', href: '/tools/ai-assistant', icon: <Zap size={18} className="premium-nav-icon" /> },
  { label: 'Contact', href: '/#contacts', icon: <Star size={18} className="premium-nav-icon" /> },
  { label: 'Blog', href: '/blog', icon: <Star size={18} className="premium-nav-icon" /> },
];

const loginItem = { label: 'Login', href: '/client/login', icon: <LogOut size={18} className="premium-nav-icon" /> };

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
        <div className="premium-mobile-items">
          {navItems.map((item, i) => (
            <button
              key={item.href}
              onClick={() => handleNavigation(item.href)}
              className={`premium-mobile-item ${activeItem === item.href ? 'active' : ''}`}
              style={{ animationDelay: `${i * 30}ms` }}
            >
              <span className="premium-mobile-icon-wrap">{item.icon}</span>
              <span className="premium-mobile-label">
                {item.live && (
                  <span className="navbar-live-dot">
                    <span className="navbar-live-dot-ping" />
                    <span className="navbar-live-dot-core" />
                  </span>
                )}
                {item.label}
              </span>
              <ChevronRight size={16} className="premium-mobile-chevron" />
            </button>
          ))}
        </div>

        <div className="premium-mobile-footer">
          <button
            onClick={() => handleNavigation(loginItem.href)}
            className={`premium-mobile-item premium-mobile-login ${activeItem === loginItem.href ? 'active' : ''}`}
            style={{ animationDelay: `${navItems.length * 30}ms` }}
          >
            <span className="premium-mobile-icon-wrap">{loginItem.icon}</span>
            <span>{loginItem.label}</span>
            <ChevronRight size={16} className="premium-mobile-chevron" />
          </button>
        </div>
      </div>
    </>
  );
}