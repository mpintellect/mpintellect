import Link from 'next/link';

export const metadata = {
  title: 'Privacy Policy – MP Intel Systems',
  description: 'Privacy Policy for MP Intel Systems.',
};

export default function PrivacyPage() {
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
        <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-8">Privacy Policy</h1>
        <p className="text-[#94a3b8] text-sm mb-12">Last updated: {new Date().getFullYear()}</p>

        <div className="space-y-8 text-[#c8c8c8] text-sm leading-relaxed">
          <section>
            <h2 className="text-white font-bold text-lg mb-2">1. Information We Collect</h2>
            <p>When you submit an inquiry through our contact form, we collect the information you provide: company name, registration number, contact person, position, business email, phone number, service category, and project requirements.</p>
          </section>
          <section>
            <h2 className="text-white font-bold text-lg mb-2">2. How We Use Your Information</h2>
            <p>We use the information you submit solely to respond to your inquiry, prepare a proposal, and deliver the services you request. We do not sell or rent your information to third parties.</p>
          </section>
          <section>
            <h2 className="text-white font-bold text-lg mb-2">3. Data Retention</h2>
            <p>We retain inquiry and client data for as long as necessary to fulfil the purposes described above and to comply with our legal obligations.</p>
          </section>
          <section>
            <h2 className="text-white font-bold text-lg mb-2">4. Your Rights (GDPR)</h2>
            <p>If you are located in the EU/UK, you have the right to access, correct, or request deletion of your personal data. To exercise these rights, contact us via the <Link href="/#contact" className="text-[#D4AF37] hover:underline">contact form</Link>.</p>
          </section>
          <section>
            <h2 className="text-white font-bold text-lg mb-2">5. Security</h2>
            <p>We take reasonable technical and organizational measures to protect the information you submit to us.</p>
          </section>
        </div>
      </main>
    </div>
  );
}
