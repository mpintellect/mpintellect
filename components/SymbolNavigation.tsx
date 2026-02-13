'use client';

import Link from 'next/link';
import { ArrowRight, Bot } from 'lucide-react';

export default function SymbolNavigation({ symbol }: { symbol: string }) {
  // Ensure symbol is clean (e.g. BTCUSD)
  const cleanSymbol = symbol.toUpperCase();

  return (
    <section className="mt-24 border-t border-zinc-900 pt-10 pb-20 text-center max-w-4xl mx-auto">
        
        <div className="flex flex-wrap justify-center gap-3 my-6">
            {/* 1. Strategy & Setup (-SETUP) */}
            <Link href={`/trade/${cleanSymbol}`} className="seo-chip-link group">
               Trade Setup <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </Link>
            
            <Link href={`/trend/${cleanSymbol}`} className="seo-chip-link group">
               Trend Direction <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </Link>

            <Link href={`/forecast/${cleanSymbol}`} className="seo-chip-link group">
               AI Forecast <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </Link>

            {/* 2. Technical Tools (-RISK) */}
            <Link href={`/calculator/${cleanSymbol}`} className="seo-chip-link group">
               Trade Calculator <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </Link>
            
            <Link href={`/indicator/${cleanSymbol}`} className="seo-chip-link group">
               Indicator RSI Score <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </Link>

            {/* 3. Deep Analysis (-RISK) */}
            <Link href={`/zones/${cleanSymbol}`} className="seo-chip-link group">
               Liquidity Zones <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </Link>

            <Link href={`/momentum/${cleanSymbol}`} className="seo-chip-link group">
               Momentum Score <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </Link>

            <Link href={`/volatility/${cleanSymbol}`} className="seo-chip-link group">
               Volatility Risk <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </Link>

            <Link 
  href={`/analysis/${cleanSymbol.toLowerCase()}`} 
  className="seo-chip-link border-yellow-500/50 text-yellow-500 hover:bg-yellow-500/10 group"
>
  Full Analysis <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
</Link>
        </div>

        {/* --- AI CHAT CTA (-CHAT) --- */}
        <div className="mt-12 mb-8">
            <p className="text-zinc-500 text-xs mb-4">Have specific questions about {cleanSymbol}?</p>
            
            {/* 🚀 This link now passes the symbol to the Chat Bot automatically */}
            <Link 
                href={`/AIChat?symbol=${cleanSymbol}&auto_start=true`} 
                className="btn-ai-chat-pulse inline-flex items-center gap-2"
            >
                <Bot size={20} fill="currentColor" className="text-blue-200" /> 
                Chat with AI Analyst
            </Link>
        </div>

    </section>
  );
}