"use client";

import React, { useEffect, useRef, useState } from 'react';

type RevealProps = {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  y?: number;
  scale?: boolean;
  once?: boolean;
  as?: 'div' | 'section' | 'h1' | 'h2' | 'h3' | 'h4' | 'p' | 'span' | 'li';
};

export default function Reveal({
  children,
  className = '',
  delay = 0,
  y = 24,
  scale = false,
  once = true,
  as = 'div',
}: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    const mql = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReduceMotion(mql.matches);

    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          if (once) observer.unobserve(el);
        } else if (!once) {
          setVisible(false);
        }
      },
      { threshold: 0.15, rootMargin: '0px 0px -10% 0px' }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [once]);

  const Tag = as as any;
  const shown = visible || reduceMotion;

  return (
    <Tag
      ref={ref}
      className={className}
      style={
        reduceMotion
          ? undefined
          : {
              opacity: shown ? 1 : 0,
              transform: shown
                ? 'translateY(0) scale(1)'
                : `translateY(${y}px)${scale ? ' scale(0.94)' : ''}`,
              transition: `opacity 700ms cubic-bezier(0.16,1,0.3,1) ${delay}ms, transform 700ms cubic-bezier(0.16,1,0.3,1) ${delay}ms`,
              willChange: 'opacity, transform',
            }
      }
    >
      {children}
    </Tag>
  );
}
