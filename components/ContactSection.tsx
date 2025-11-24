'use client';
import React, { useState } from 'react';
import NotificationButton from './NotificationButton';

export default function ContactSection() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [hp, setHp] = useState(''); 
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
    // Uses the new class for background gradient
    <section id="contacts" className="contact-section-wrapper py-24 px-6 text-white">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-4xl md:text-5xl font-bold mb-6">Get in Touch</h2>
        <p className="text-gray-400 text-lg md:text-xl mb-10">
          For support, collaboration, or inquiries, contact us and our team will respond shortly.
        </p>

        <form onSubmit={onSubmit} className="contact-form space-y-6 text-left">
          {/* Honeypot */}
          <input
            type="text"
            value={hp}
            onChange={(e)=>setHp(e.target.value)}
            style={{ display:'none' }}
            tabIndex={-1}
            autoComplete="off"
          />

          <div>
            <label htmlFor="name" className="block mb-2 text-sm font-medium">Your Name</label>
            <input
              type="text"
              id="name"
              placeholder="John Doe"
              // Uses CSS class instead of long tailwind strings
              className="w-full text-sm rounded-md p-3 contact-input" 
              required
              value={name}
              onChange={(e)=>setName(e.target.value)}
            />
          </div>

          <div>
            <label htmlFor="email" className="block mb-2 text-sm font-medium">Your Email</label>
            <input
              type="email"
              id="email"
              placeholder="you@example.com"
              className="w-full text-sm rounded-md p-3 contact-input"
              required
              value={email}
              onChange={(e)=>setEmail(e.target.value)}
            />
          </div>

          <div>
            <label htmlFor="message" className="block mb-2 text-sm font-medium">Your Message</label>
            <textarea
              id="message"
              rows={5}
              placeholder="Write your message here..."
              className="w-full text-sm rounded-md p-3 contact-input"
              required
              value={message}
              onChange={(e)=>setMessage(e.target.value)}
            />
          </div>

          <div className="text-center pt-2">
            <button
              type="submit"
              disabled={sending}
              className="btn-primary text-sm md:text-base disabled:opacity-60 px-8 py-3 bg-yellow-600 hover:bg-yellow-500 rounded text-white font-bold transition-all"
            >
              {sending ? 'Sending…' : 'Send Message'}
            </button>
          </div>

          {result && result.ok && (
            <p className="text-green-400 text-center mt-2">Message sent successfully!</p>
          )}
          {result && !result.ok && (
            <p className="text-red-400 text-center mt-2">{result.error}</p>
          )}
        </form>
      </div>

      {/* FOOTER SECTION: REORGANIZED */}
      <div className="max-w-4xl mx-auto border-t border-zinc-800 mt-16 pt-8 flex flex-col md:flex-row justify-between items-center gap-6">
        
        
        
        {/* Notification Button Container */}
        <div className="flex items-center gap-4">
           <NotificationButton />
        </div>

      </div>
    </section>
  );
}