// components/Hero.tsx
'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';

export default function Hero() {
  return (
    <section
      id="hero"
      className="flex flex-col items-center text-center bg-black text-white pt-10 md:pt-16 pb-12"
    >
      {/* LCP image with priority + animation */}
      <motion.div
        initial={{ opacity: 0, scale: 0.92 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.4, ease: 'easeInOut' }}
      >
        <Image
          src="https://i.postimg.cc/4yNW4Ts2/mzlogotransap.png"
          alt="MZPrimer Logo"
          width={80}           // exact intrinsic size for best CLS
          height={80}
          priority              // preloads -> fixes LCP
          sizes="(min-width: 768px) 80px, 64px" // helps responsive loading
          className="w-16 md:w-20 mb-4"
        />
      </motion.div>

      <h1 className="text-3xl md:text-5xl font-bold mb-3 leading-tight">
        Enhance Your Trading with<br />AI-Driven Tools
      </h1>

      <p className="text-gray-400 text-base md:text-lg mb-6">
        Unlock insights, test strategies, and grow your edge with advanced AI solutions tailored for traders.
      </p>

      <a href="#aitrading" className="btn-primary no-underline">
        Start Exploring
      </a>
    </section>
  );
}