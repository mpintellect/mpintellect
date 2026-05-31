// components/SymbolNavigation.tsx

'use client';

import Link from 'next/link';
import { ArrowRight, Bot } from 'lucide-react';
import { toolMapping } from '@/app/lib/translations';

interface SymbolNavigationProps {
  symbol: string;
  locale?: 'en' | 'ar';
}

export default function SymbolNavigation({ symbol, locale = 'en' }: SymbolNavigationProps) {
  const cleanSymbol = symbol.toLowerCase();
  const t = toolMapping[locale];
  
  return (
    <section className="mt-24 border-t border-zinc-900 pt-10 pb-20 text-center max-w-4xl mx-auto">
        
        <div className="flex flex-wrap justify-center gap-3 my-6">
            <Link href={`/${locale}/${t.trade}/${cleanSymbol}`} className="seo-chip-link group">
               Trade Setup <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </Link>
            
            <Link href={`/${locale}/${t.trend}/${cleanSymbol}`} className="seo-chip-link group">
               Trend Direction <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </Link>

            <Link href={`/${locale}/${t.forecast}/${cleanSymbol}`} className="seo-chip-link group">
               AI Forecast <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </Link>

            <Link href={`/${locale}/${t.calculator}/${cleanSymbol}`} className="seo-chip-link group">
               Trade Calculator <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </Link>
            
            <Link href={`/${locale}/${t.indicator}/${cleanSymbol}`} className="seo-chip-link group">
               Indicator RSI Score <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </Link>

            <Link href={`/${locale}/${t.zones}/${cleanSymbol}`} className="seo-chip-link group">
               Liquidity Zones <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </Link>

            <Link href={`/${locale}/${t.momentum}/${cleanSymbol}`} className="seo-chip-link group">
               Momentum Score <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </Link>

            <Link href={`/${locale}/${t.volatility}/${cleanSymbol}`} className="seo-chip-link group">
               Volatility Risk <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </Link>

            <Link 
              href={`/${locale}/${t.analysis}/${cleanSymbol.toLowerCase()}`} 
              className="seo-chip-link border-yellow-500/50 text-yellow-500 hover:bg-yellow-500/10 group"
            >
              Full Analysis <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </Link>
        </div>

        <div className="mt-12 mb-8">
            <p className="text-zinc-500 text-xs mb-4">Have specific questions about {cleanSymbol}?</p>
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