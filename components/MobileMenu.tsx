'use client';

import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';

const navItems = [
  { label: 'Home', href: '/' },
  { label: 'Market', href: '/#market' },
  { label: 'Learning', href: '/#learning' },
  { label: 'Accounts', href: '/#accounts' },
  { label: 'AI Trading', href: '/#aitrading' },
  { label: 'AI Tools', href: '/ai-robot' }, // Stays as-is
  { label: 'Contact', href: '/#contacts' },
  { label: 'Privacy', href: '/#privacy' },
  { label: 'Blog', href: '/blog' },
];

export default function MobileMenu() {
  const [isMobile, setIsMobile] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [activeItem, setActiveItem] = useState<string | null>(null);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (!isMobile) return null;

  return (
    <>
      <div className="mobile-header">
  <button onClick={() => setIsOpen(!isOpen)} className="mobile-menu-button">
    {isOpen ? <X size={28} /> : <Menu size={28} />}
  </button>
</div>

      {isOpen && (
        <div className="mobile-menu-list">
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
      )}
    </>
  );
}