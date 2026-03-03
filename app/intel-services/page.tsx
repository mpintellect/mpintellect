import React from 'react';

export default function IntelServices() {
  return (
    <div className="bg-[#050505] text-white min-h-screen font-sans selection:bg-[#D4AF37] selection:text-black">
      
      {/* --- UNIQUE INTEL HEADER --- */}
      <nav className="w-full border-b border-white/5 py-6 px-8 md:px-16 flex justify-between items-center backdrop-blur-2xl sticky top-0 z-[100]">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-white flex items-center justify-center rounded-sm">
             <span className="text-black font-black text-xs">MZ</span>
          </div>
          <span className="text-lg font-bold tracking-[4px] uppercase">Intel Systems</span>
        </div>
        <div className="flex gap-8 items-center">
          <a href="#about" className="text-[10px] tracking-[3px] uppercase text-zinc-500 hover:text-white transition-colors">About</a>
          <a href="#contact" className="px-6 py-2 bg-white text-black text-[10px] font-bold tracking-[2px] uppercase rounded-sm hover:bg-[#D4AF37] transition-all">Get in Touch</a>
        </div>
      </nav>

      {/* --- HERO SECTION --- */}
      <main className="pt-24 pb-20 px-8 md:px-16 max-w-7xl mx-auto">
        <header className="mb-24">
          <p className="text-[#D4AF37] font-mono text-sm tracking-[5px] mb-6 uppercase">Institutional IT Solutions</p>
          <h1 className="text-6xl md:text-8xl font-black tracking-tighter leading-none mb-12">
            ENGINEERING <br />
            COMMERCIAL <br />
            <span className="text-zinc-500">INFRASTRUCTURE.</span>
          </h1>
          <div className="h-1 w-24 bg-[#D4AF37]"></div>
        </header>

        {/* --- SERVICES SECTION (The Descriptions) --- */}
        <section className="grid md:grid-cols-2 gap-12 mb-32">
          <div className="space-y-8">
            <div className="p-8 border border-white/10 rounded-2xl bg-zinc-900/20">
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-4">
                <span className="text-[#D4AF37]">62012</span> Software Development
              </h2>
              <p className="text-zinc-400 leading-relaxed font-light">
                We specialize in the creation of bespoke business and domestic software architectures. 
                Our development cycle focuses on the <strong>MZ Intelligence DNA</strong>: 
                Security, Scalability, and Speed. From private API environments to custom 
                enterprise tools, we build the engines that drive modern commerce.
              </p>
            </div>

            <div className="p-8 border border-white/10 rounded-2xl bg-zinc-900/20">
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-4">
                <span className="text-[#10B981]">62090</span> IT Service Activities
              </h2>
              <p className="text-zinc-400 leading-relaxed font-light">
                Our strategic IT services cover the spectrum of modern technological needs. 
                We provide Zero-Trust network design, decentralized data storage solutions, 
                and advanced system monitoring for firms that cannot afford a second of downtime.
              </p>
            </div>
          </div>

          <div className="flex items-center justify-center relative">
             <div className="absolute inset-0 bg-[#D4AF37]/5 blur-[120px] rounded-full"></div>
             <div className="relative border border-white/10 p-12 rounded-[40px] bg-[#050505] shadow-2xl">
                <p className="text-sm font-mono text-zinc-600 mb-4 tracking-widest uppercase">System Audit v2.0</p>
                <p className="text-4xl font-light italic text-white/90 leading-tight">
                  "Architecture is not just about code. It is about the <span className="text-[#D4AF37] font-bold">stability of the operation</span>."
                </p>
             </div>
          </div>
        </section>

        {/* --- ABOUT SECTION --- */}
        <section id="about" className="py-24 border-t border-white/5">
          <div className="grid md:grid-cols-3 gap-12">
            <h2 className="text-sm font-bold tracking-[8px] uppercase text-[#94a3b8]">The Foundation</h2>
            <div className="md:col-span-2 space-y-6 text-xl font-light leading-relaxed text-zinc-300">
              <p>
                MZ Intelligence Systems operates at the intersection of financial logic and enterprise technology. 
                As a subsidiary of <span className="text-white font-medium italic">MZPrimer LTD</span>, our mission is 
                to provide the same industrial-strength technology we use for our global market terminals 
                to domestic and business sectors.
              </p>
              <p>
                Every line of code we write is optimized for Cloudflare’s global edge network, ensuring your business 
                tools are available instantly, anywhere in the world, with military-grade encryption.
              </p>
            </div>
          </div>
        </section>

        {/* --- CONTACT SECTION --- */}
        <section id="contact" className="py-32 mb-20 bg-gradient-to-b from-[#080808] to-[#050505] border border-white/5 rounded-[60px] px-12 text-center">
          <h2 className="text-5xl font-black mb-6">START THE PROJECT</h2>
          <p className="text-zinc-500 max-w-xl mx-auto mb-12 tracking-wide">
            Consult with our lead architects on your next software deployment or system overhaul.
          </p>
          <a href="mailto:contact@mzprimer.com" className="text-2xl font-light border-b border-[#D4AF37] text-[#D4AF37] pb-2 hover:text-white hover:border-white transition-all">
            contact@mzprimer.com
          </a>
        </section>
      </main>

      {/* --- UNIQUE INTEL FOOTER --- */}
      <footer className="bg-black py-20 px-8 border-t border-white/5">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="text-left">
            <p className="text-[10px] tracking-[5px] uppercase font-bold text-white mb-2">MZ Intelligence Systems</p>
            <p className="text-[10px] tracking-[3px] text-zinc-600 uppercase">UK Registered Legal Entity • MZPrimer LTD</p>
          </div>
          <div className="flex gap-12 text-[10px] tracking-[4px] uppercase text-zinc-500">
            <span>SIC 62012</span>
            <span>SIC 62090</span>
            <span>Security First</span>
          </div>
        </div>
      </footer>
    </div>
  );
}