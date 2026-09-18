import Link from 'next/link';

export const metadata = {
  title: 'Terms of Service – MP Intel Systems',
  description: 'Terms of Service for MP Intel Systems.',
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-[#050505] text-white">
      <nav className="border-b border-white/5 py-6 px-6 md:px-12 flex items-center gap-3">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 bg-white flex items-center justify-center rounded-sm">
            <span className="text-black font-black text-sm">MP</span>
          </div>
          <div>
            <span className="text-sm md:text-xl font-bold tracking-[4px] md:tracking-[6px] uppercase">Intel</span>
            <span className="text-[#D4AF37] text-sm md:text-xl font-bold tracking-[4px] md:tracking-[6px] uppercase ml-1">Systems</span>
          </div>
        </Link>
      </nav>

      <main className="max-w-3xl mx-auto px-6 md:px-12 py-16 md:py-24">
        <p className="text-[10px] tracking-[3px] uppercase text-[#D4AF37] mb-3">Legal</p>
        <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-8">Terms of Service</h1>
        <p className="text-[#94a3b8] text-sm mb-12">Last updated: {new Date().getFullYear()}</p>

        <div className="space-y-8 text-[#c8c8c8] text-sm leading-relaxed">
          <section>
            <h2 className="text-white font-bold text-lg mb-2">1. Acceptance of Terms</h2>
            <p>By engaging MP Intel Systems ("we", "us", "our") for software development, hardware distribution, system integration, installation, configuration, or maintenance services, you ("Client") agree to be bound by these Terms of Service.</p>
          </section>
          <section>
            <h2 className="text-white font-bold text-lg mb-2">2. Services</h2>
            <p>Services are provided on a project or engagement basis, as agreed in a separate statement of work, proposal, or quote. Scope, timelines, and deliverables are governed by that agreement.</p>
          </section>
          <section>
            <h2 className="text-white font-bold text-lg mb-2">3. Client Responsibilities</h2>
            <p>The Client confirms it is authorized to represent the business submitting an inquiry or order, and agrees to provide accurate information required to deliver the requested services.</p>
          </section>
          <section>
            <h2 className="text-white font-bold text-lg mb-2">4. Payment</h2>
            <p>Fees, invoicing schedules, and payment terms are set out in the applicable proposal or contract for each engagement.</p>
          </section>
          <section>
            <h2 className="text-white font-bold text-lg mb-2">5. Limitation of Liability</h2>
            <p>To the maximum extent permitted by law, MP Intel Systems is not liable for indirect, incidental, or consequential damages arising from the use of our services.</p>
          </section>
          <section>
            <h2 className="text-white font-bold text-lg mb-2">6. Contact</h2>
            <p>Questions about these terms can be directed to us via the <Link href="/#contact" className="text-[#D4AF37] hover:underline">contact form</Link>.</p>
          </section>
        </div>
      </main>
    </div>
  );
}
