// app/intel-services/page.tsx
import React from 'react';

export default function IntelLanding() {
  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans selection:bg-[#D4AF37] selection:text-black">
      {/* 1. ARCHITECTURAL HEADER */}
      <nav className="border-b border-white/5 py-8 px-12 flex justify-between items-center backdrop-blur-xl sticky top-0 z-50">
        <div className="flex items-center gap-4">
          <img src="/logos/mzlogo.webp" alt="MZ Intelligence" className="h-10" />
          <span className="text-xl font-light tracking-[6px] uppercase text-white/90">Systems</span>
        </div>
        <div className="hidden md:flex gap-12 text-xs font-medium tracking-[4px] uppercase text-[#94a3b8]">
          <a href="#solutions" className="hover:text-[#D4AF37] transition-colors">Solutions</a>
          <a href="#architecture" className="hover:text-[#D4AF37] transition-colors">Architecture</a>
          <a href="#compliance" className="hover:text-[#D4AF37] transition-colors">Compliance</a>
        </div>
        <button className="px-8 py-3 border border-[#D4AF37]/30 rounded-full text-[10px] tracking-[3px] uppercase hover:bg-[#D4AF37] hover:text-black transition-all duration-500">
          Enquire
        </button>
      </nav>

      {/* 2. HERO: THE ENGINE BEHIND THE DATA */}
      <section className="relative pt-32 pb-20 px-12 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-radial-gradient from-[#D4AF37]/5 to-transparent opacity-50" />
        
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="inline-block px-4 py-1 rounded-full border border-[#10B981]/30 bg-[#10B981]/5 text-[#10B981] text-[10px] tracking-[4px] uppercase mb-8">
            Established 2026 // Institutional Tech
          </div>
          <h1 className="text-7xl md:text-9xl font-black tracking-tighter leading-[0.85] mb-12">
            BUILDING <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-[#D4AF37] to-[#8e793e]">
              THE FUTURE
            </span><br />
            OF SYSTEMS.
          </h1>
          <p className="max-w-2xl text-xl text-[#94a3b8] leading-relaxed font-light mb-12">
            MZ Intelligence Systems provides bespoke software development and strategic IT architecture for enterprise-level data operations. 
            We specialize in mission-critical environments where performance is the only metric that matters.
          </p>
        </div>
      </section>

      {/* 3. CORE SERVICES (SIC CODES) */}
      <section id="solutions" className="py-32 px-12 bg-[#080808]">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-8">
          
          {/* SIC 62012: Software Development */}
          <div className="p-12 rounded-[40px] bg-white/[0.02] border border-white/5 hover:border-[#D4AF37]/30 transition-all duration-700 group">
            <div className="h-2 w-24 bg-[#D4AF37] mb-12 group-hover:w-full transition-all duration-700" />
            <span className="text-xs font-mono text-[#D4AF37]/60 mb-4 block">SIC 62012</span>
            <h3 className="text-4xl font-bold mb-6">Business & Enterprise <br />Software Development</h3>
            <p className="text-[#94a3b8] leading-relaxed font-light mb-8">
              Bespoke application development tailored to industrial requirements. From custom internal tools to domestic software ecosystems, we write code that drives efficiency.
            </p>
            <ul className="text-sm space-y-4 text-white/70 tracking-wide font-light">
              <li className="flex items-center gap-3">○ Proprietary API Architectures</li>
              <li className="flex items-center gap-3">○ Database Scaling & Optimization</li>
              <li className="flex items-center gap-3">○ High-Security Domestic Tools</li>
            </ul>
          </div>

          {/* SIC 62090: Other IT Services */}
          <div className="p-12 rounded-[40px] bg-white/[0.02] border border-white/5 hover:border-[#10B981]/30 transition-all duration-700 group">
            <div className="h-2 w-24 bg-[#10B981] mb-12 group-hover:w-full transition-all duration-700" />
            <span className="text-xs font-mono text-[#10B981]/60 mb-4 block">SIC 62090</span>
            <h3 className="text-4xl font-bold mb-6">Information Technology <br />Service Management</h3>
            <p className="text-[#94a3b8] leading-relaxed font-light mb-8">
              Strategic IT consulting and specialized infrastructure management. We solve the complex bottlenecks that traditional IT services overlook.
            </p>
            <ul className="text-sm space-y-4 text-white/70 tracking-wide font-light">
              <li className="flex items-center gap-3">● Edge Computing & CDN Strategy</li>
              <li className="flex items-center gap-3">● Zero-Trust Network Architecture</li>
              <li className="flex items-center gap-3">● Compliance-First Cloud Solutions</li>
            </ul>
          </div>

        </div>
      </section>

      {/* 4. THE TECH STACK PROOF */}
      <section id="architecture" className="py-32 px-12 border-t border-white/5">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-sm font-bold tracking-[10px] uppercase text-[#D4AF37] mb-12 text-center">The Intelligence Stack</h2>
          <p className="text-4xl font-light leading-snug mb-16">
            We leverage the same infrastructure powering the <span className="font-bold italic">MZ Intelligence Terminal</span>—Cloudflare Native, D1 SQL, and R2 Decentralized Storage—to build your enterprise solutions.
          </p>
          <div className="grid grid-cols-3 gap-8 opacity-40 grayscale hover:grayscale-0 transition-all duration-700">
            <div className="text-xs tracking-widest uppercase">Performance Management</div>
            <div className="text-xs tracking-widest uppercase">Scalable Architecture</div>
            <div className="text-xs tracking-widest uppercase">Global Delivery</div>
          </div>
        </div>
      </section>

      {/* 5. FOOTER */}
      <footer className="py-20 px-12 border-t border-white/5 text-center">
        <p className="text-[#64748b] text-[10px] tracking-[6px] uppercase mb-4">MZ Intelligence Systems // LTD</p>
        <p className="text-[#475569] text-[9px] tracking-[4px]">UK REGISTERED • SIC 62012 & 62090</p>
      </footer>
    </div>
  );
}