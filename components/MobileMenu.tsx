'use client';

import { useState } from 'react';
import { Menu, X } from 'lucide-react';


const navItems = [
  { label: 'Home', href: '/' },
  { label: 'AI Chat', href: '/AIChat' },
   { label: '🔴 LIVE MARKETS', href: '/markets' }, 
  { label: 'Prop Trading', href: '/prop-firm' },
  { label: 'Trading Robots', href: '/ai-robot' },
  { label: 'AI Assistant', href: '/tools/ai-assistant' },
  { label: 'Contact', href: '/#contacts' },
  { label: 'Privacy', href: '/legal' },
  { label: 'Blog', href: '/blog' },
  { label: 'LOGIN', href: '/client/login' },
];

export default function MobileMenu() {

  const [isOpen, setIsOpen] = useState(false);
  const [activeItem, setActiveItem] = useState<string | null>(null);

  

  return (
    <>
      <div className="mobile-header-left">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="mobile-menu-button"
          aria-label="Toggle Menu"
        >
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      <div className={`mobile-menu-list ${isOpen ? 'open' : ''}`}>
        <div className="mobile-menu-panel">
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              onClick={() => {
                setActiveItem(item.href);
                setIsOpen(false);
              }}
              className={`mobile-menu-link ${activeItem === item.href ? 'active' : ''}`}
            >
              {item.label}
            </a>
          ))}
        </div>
      </div>
    </>
  );
}