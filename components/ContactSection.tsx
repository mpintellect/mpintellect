'use client';
import React, { useState } from 'react';

export default function ContactSection() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [hp, setHp] = useState('');        // honeypot (should stay empty)
  const [sending, setSending] = useState(false);
  const [result, setResult] = useState<null | {ok:boolean; error?:string}>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSending(true);
    setResult(null);
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type':'application/json' },
        body: JSON.stringify({ name, email, message, hp }),
      });
      const data = await res.json();
      if (data.ok) {
        setResult({ ok: true });
        setName(''); setEmail(''); setMessage('');
      } else {
        setResult({ ok: false, error: data.error || 'Failed to send' });
      }
    } catch (err) {
      setResult({ ok: false, error: 'Network error' });
    } finally {
      setSending(false);
    }
  }

  return (
    <section id="contacts" className="bg-black text-white py-24 px-6">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-4xl md:text-5xl font-bold mb-6">Get in Touch</h2>
        <p className="text-gray-400 text-lg md:text-xl mb-10">
          For support, collaboration, or inquiries, contact us and our team will respond shortly.
        </p>

        <form onSubmit={onSubmit} className="contact-form space-y-6 text-left max-w-2xl mx-auto">
          {/* Honeypot (hidden from humans) */}
          <input
            type="text"
            value={hp}
            onChange={(e)=>setHp(e.target.value)}
            style={{ display:'none' }}
            tabIndex={-1}
            autoComplete="off"
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block mb-2 text-[10px] uppercase tracking-widest text-zinc-500 font-bold">Your Name</label>
              <input
                type="text"
                placeholder="Client Name"
                className="w-full bg-[#0a0a0a] border border-zinc-800 text-white text-sm rounded-none p-4 placeholder-zinc-700 focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37]/20 transition"
                required
                value={name}
                onChange={(e)=>setName(e.target.value)}
              />
            </div>
            <div>
              <label className="block mb-2 text-[10px] uppercase tracking-widest text-zinc-500 font-bold">Email Address</label>
              <input
                type="email"
                placeholder="client@institution.com"
                className="w-full bg-[#0a0a0a] border border-zinc-800 text-white text-sm rounded-none p-4 placeholder-zinc-700 focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37]/20 transition"
                required
                value={email}
                onChange={(e)=>setEmail(e.target.value)}
              />
            </div>
          </div>

          <div>
            <label className="block mb-2 text-[10px] uppercase tracking-widest text-zinc-500 font-bold">Inquiry Message</label>
            <textarea
              rows={5}
              placeholder="Briefly describe your inquiry..."
              className="w-full bg-[#0a0a0a] border border-zinc-800 text-white text-sm rounded-none p-4 placeholder-zinc-700 focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37]/20 transition"
              required
              value={message}
              onChange={(e)=>setMessage(e.target.value)}
            />
          </div>

          <div className="text-center pt-6">
            <button
              type="submit"
              disabled={sending}
              style={{
                background: '#D4AF37',
                color: '#000',
                padding: '16px 48px',
                fontWeight: '900',
                textTransform: 'uppercase',
                letterSpacing: '2px',
                fontSize: '12px',
                boxShadow: '0 10px 30px -10px rgba(212, 175, 55, 0.3)'
              }}
              className="disabled:opacity-40 hover:brightness-110 transition-all transform hover:scale-105 rounded-none"
            >
              {sending ? 'TRANSMITTING...' : 'SEND INQUIRY'}
            </button>
            <p className="text-[10px] text-zinc-700 mt-4 uppercase tracking-widest">
              Institutional Grade • Secure Communication
            </p>
          </div>

          {result && result.ok && (
            <div className="mt-6 p-5 border border-[#D4AF37]/20 bg-[#D4AF37]/5 text-center animate-pulse">
              <p className="text-[#D4AF37] text-xs uppercase tracking-widest font-bold">
                ✓ MESSAGE TRANSMITTED SUCCESSFULLY
              </p>
              <p className="text-zinc-600 text-[10px] mt-2 uppercase tracking-wider">
                Our team will respond within 24 hours
              </p>
            </div>
          )}
          
          {result && !result.ok && (
            <div className="mt-6 p-5 border border-red-900/30 bg-red-900/10 text-center">
              <p className="text-red-400 text-xs uppercase tracking-widest font-bold">
                ✗ TRANSMISSION FAILED
              </p>
              <p className="text-zinc-600 text-[10px] mt-2 uppercase tracking-wider">
                {result.error || 'Please try again or contact directly'}
              </p>
            </div>
          )}
        </form>

        {/* Direct Contact Info */}
        <div className="mt-16 pt-8 border-t border-zinc-900">
          <div className="flex flex-col md:flex-row justify-center items-center gap-8 text-sm">
            <div className="flex items-center gap-3">
              <span className="text-[#D4AF37] text-lg">✉</span>
              <a href="mailto:info@mpintellect.com" className="text-zinc-400 hover:text-[#D4AF37] transition">
                info@mpintellect.com
              </a>
            </div>
            <div className="hidden md:block w-px h-4 bg-zinc-800"></div>
            <div className="flex items-center gap-3">
              
             
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}