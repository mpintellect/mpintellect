'use client';

import { useEffect } from 'react';

type HeroProps = {
  chatRef: React.RefObject<{ triggerChat: () => void }>;
};

export default function Hero({ chatRef }: HeroProps) {
  useEffect(() => {
    // Reserved for scroll animation logic
  }, []);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    const el = document.getElementById('aiassistant');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
      setTimeout(() => {
        chatRef.current?.triggerChat(); // Trigger chat open
      }, 500);
    }
  };

  return (
    <section
      id="hero"
      className="flex flex-col items-center text-center bg-black text-white pt-12 md:pt-20 pb-[30vh] md:pb-[20vh]"
    >
      <img
        src="/logos/mzlogo.webp"
        alt="MZPrimer Logo"
        className="w-40 md:w-52 mb-4"
      />

      <h1 className="text-3xl md:text-5xl font-bold mb-3 leading-tight">
        Enhance Your Trading with<br />AI-Driven Tools
      </h1>

      <p className="text-gray-400 text-base md:text-lg mb-6">
        Unlock insights, test strategies, and grow your edge with advanced AI solutions tailored for traders.
      </p>
    </section>
  );
}