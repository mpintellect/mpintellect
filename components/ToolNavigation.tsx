// components/ToolNavigation.tsx

'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { toolDisplay } from '@/app/lib/translations';

interface ToolNavigationProps {
  currentTool: string;
  currentSymbol: string;
  locale: 'en' | 'ar';
}

export default function ToolNavigation({ currentTool, currentSymbol, locale }: ToolNavigationProps) {
  const tools = ['analysis', 'trade', 'trend', 'momentum', 'zones', 'volatility', 'calculator', 'indicator', 'forecast'];
  const t = toolDisplay[locale];
  
  return (
    <div className="sticky top-0 z-40 bg-black/95 backdrop-blur-sm border-b border-zinc-800">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex overflow-x-auto no-scrollbar gap-1 py-2">
          {tools.map((tool) => (
            <Link
              key={tool}
              href={`/${locale}/${tool === 'analysis' ? 'analysis' : tool}/${currentSymbol}`}
              className={`px-4 py-2 text-sm font-medium rounded-lg whitespace-nowrap transition-all duration-200
                ${currentTool === tool 
                  ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30' 
                  : 'text-zinc-400 hover:text-white hover:bg-zinc-800/50'
                }`}
            >
              {t[tool as keyof typeof t]}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}