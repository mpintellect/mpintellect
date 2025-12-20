"use client";

import { useEffect } from "react";
import Image from "next/image";

export default function Hero() {
  useEffect(() => {}, []);

  const handleClick = () => {
    const el = document.getElementById("aiassistant");
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <section id="hero">
      {/* Logo Image - Optimized with Next.js Image */}
      <Image
        src="/logos/mzlogo.webp"
        alt="MZPrimer Logo"
        width={224}
        height={224}
        className="w-40 md:w-56"
        priority={true}
        quality={85}
        loading="eager"
        fetchPriority="high"
        sizes="(max-width: 768px) 160px, 224px"
      />

      {/* Headline */}
      <h1>
        Enhance Your Trading with<br />
        <span className="hero-gold">AI-Driven Tools</span>
      </h1>

      {/* Subtitle */}
      <p>
        Unlock insights, test strategies, and grow your edge with advanced AI
        solutions tailored for traders.
      </p>

      {/* CTA Button */}
      <button
        onClick={handleClick}
        className="btn-primary"
        style={{
          maxWidth: "220px",
          fontSize: "1.1rem",
          padding: "16px 32px",
          marginTop: "1rem",
        }}
        aria-label="Start using AI assistant for trading"
      >
        Start Now
      </button>
    </section>
  );
}