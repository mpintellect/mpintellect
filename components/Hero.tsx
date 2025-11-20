"use client";

import { useEffect } from "react";

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
      {/* Logo Image */}
      <img
        src="/logos/mzlogo.webp"
        alt="MZPrimer Logo"
        className="w-40 md:w-56"
      />

      {/* Headline */}
      <h1>
        Enhance Your Trading with<br />
        <span className="hero-gold">AI-Driven Tools</span>
      </h1>

      {/* Subtitle */}
      <p>
        Unlock insights, test strategies, and grow your edge with advanced AI solutions tailored for traders.
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
      >
        Start Now
      </button>
    </section>
  );
}