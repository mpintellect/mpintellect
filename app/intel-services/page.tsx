import React from 'react';

export default function IntelLanding() {
  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans selection:bg-[#D4AF37] selection:text-black">
      {/* 1. INDEPENDENT HEADER */}
      <nav className="border-b border-white/5 py-8 px-12 flex justify-between items-center backdrop-blur-xl sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-white flex items-center justify-center rounded-sm">
             <span className="text-black font-black text-xs">MZ</span>
          </div>
          <span className="text-xl font-bold tracking-[6px] uppercase">Intel Systems</span>
        </div>
        <div className="flex gap-10">
          <a href="#about" className="text-[10px] tracking-[3px] uppercase text-[#94a3b8] hover:text-white transition-colors">About</a>
          <a href="#contact" className="text-[10px] tracking-[3px] uppercase text-[#94a3b8] hover:text-white transition-colors">Contact</a>
        </div>
      </nav>

      {/* 2. HERO SECTION */}
      <section className="pt-32 pb-20 px-12 max-w-7xl mx-auto">
        <h1 className="text-7xl md:text-9xl font-black tracking-tighter leading-[0.85] mb-12">
          SOFTWARE <br /> 
          <span className="text-[#D4AF37]">ARCHITECTURE</span> <br />
          & IT SERVICES.
        </h1>
        <p className="max-w-2xl text-xl text-[#94a3b8] font-light leading-relaxed mb-12">
          MZ Intelligence Systems provides bespoke development and infrastructure management 
          for high-performance business operations. 
        </p>
        <div className="flex gap-6">
          <div className="px-6 py-2 border border-white/20 rounded-full text-[10px] uppercase tracking-widest text-white/40">SIC 62012</div>
          <div className="px-6 py-2 border border-white/20 rounded-full text-[10px] uppercase tracking-widest text-white/40">SIC 62090</div>
        </div>
      </section>

      {/* 3. SERVICES DETAIL */}
      <section className="py-24 px-12 bg-[#080808]">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-16">
          <div className="space-y-6">
            <h2 className="text-3xl font-bold border-l-4 border-[#D4AF37] pl-6">Business Software Development</h2>
            <p className="text-[#94a3b8] font-light text-lg">
              End-to-end development of proprietary software solutions. We build scalable backend 
              architectures, secure API gateways, and custom domestic tools optimized for 
              low-latency edge computing.
            </p>
          </div>
          <div className="space-y-6">
            <h2 className="text-3xl font-bold border-l-4 border-[#10B981] pl-6">IT Service Management</h2>
            <p className="text-[#94a3b8] font-light text-lg">
              Specialized technology services including cloud infrastructure optimization, 
              Zero-Trust security implementation, and global CDN management for enterprise assets.
            </p>
          </div>
        </div>
      </section>

      {/* 4. ABOUT SECTION */}
      <section id="about" className="py-32 px-12 max-w-5xl mx-auto text-center border-t border-white/5">
        <h2 className="text-xs font-bold tracking-[10px] uppercase text-[#D4AF37] mb-12">The Intelligence Group</h2>
        <p className="text-4xl font-light leading-snug">
          We leverage industrial-grade technology—Cloudflare Native, D1 SQL, and Decentralized R2 Storage—to build stable, high-availability IT ecosystems for modern enterprises.
        </p>
      </section>

      {/* 5. CONTACT SECTION */}
      <section id="contact" className="py-32 px-12 bg-white text-black text-center">
        <h2 className="text-5xl font-black tracking-tighter mb-8 italic uppercase">Start the Project</h2>
        <p className="mb-12 font-medium tracking-widest opacity-60">ENQUIRE VIA CORPORATE CHANNELS</p>
        <a href="mailto:contact@mzprimer.com" className="text-3xl font-light border-b-2 border-black pb-2 hover:text-[#D4AF37] transition-all duration-300">
          contact@mzprimer.com
        </a>
      </section>

      {/* 6. INDEPENDENT FOOTER */}
      <footer className="py-16 px-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8">
        <div className="text-[10px] tracking-[4px] uppercase text-zinc-600">
          MZ Intelligence Systems // LTD • SIC 62012 & 62090
        </div>
        <div className="text-[10px] tracking-[4px] uppercase text-zinc-600">
          © 2026 MZPRIMER LTD • UK REGISTERED
        </div>
      </footer>
    </div>
  );
}