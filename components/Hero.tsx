'use client';

import Image from 'next/image';
import '@/app/globals.css'; // if not already imported

export default function Hero() {
  return (
    <section
      id="hero"
      className="flex flex-col items-center text-center bg-black text-white pt-10 md:pt-16 pb-12"
    >
      <div className="fade-in">
        <Image
          src="/logos/mzlogo.webp"
          alt="MZPrimer Logo"
          width={300}
          height={300}
          priority
          className="w-16 md:w-20 mb-4"
        />
      </div>

      <h1 className="text-3xl md:text-5xl font-bold mb-3 leading-tight">
        Enhance Your Trading with<br />AI-Driven Tools
      </h1>

      <p className="text-gray-400 text-base md:text-lg mb-6">
        Unlock insights, test strategies, and grow your edge with advanced AI solutions tailored for traders.
      </p>

      <a
        href="tools/ai-assistant"
        onClick={(e) => {
          e.preventDefault();
          const el = document.getElementById('ai-assistant');
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }}
        className="btn-primary no-underline"
      >
        Get AI Assistant
      </a>
    </section>
  );
}