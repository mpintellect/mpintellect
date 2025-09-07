'use client';

import { motion } from 'framer-motion';

export default function Hero() {
  return (
    <>
      <section
        id="hero"
        className="flex flex-col items-center text-center bg-black text-white pt-10 md:pt-16 pb-12"
      >
        <motion.img
          src="https://i.postimg.cc/5ypD6FmV/mzlogotransap.png"
          alt="MZPrimer Logo"
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.4, ease: 'easeInOut' }}
          className="w-16 md:w-20 mb-4"
        />

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

      {/* TEMP: force scroll space */}
      <div style={{ height: '200vh', background: '#111' }}></div>
    </>
  );
}