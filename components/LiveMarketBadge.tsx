'use client';

// Small live BUY/SELL + confidence badge for a single symbol. Reuses
// useMarketSignals' existing module-level cache/dedup (built for exactly
// this - many components mounting the hook at once), so mounting this 28
// times on /markets costs one shared fetch, not 28. Renders nothing if
// there's no live signal for this symbol (feed doesn't cover everything).
import { useMarketSignals } from '@/app/hooks/useMarketSignals';

export function LiveMarketBadge({ symbol }: { symbol: string }) {
  const signals = useMarketSignals();
  const signal = signals.find((s) => s.symbol === symbol);
  if (!signal) return null;

  const isBuy = signal.action === 'BUY';
  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${
        isBuy ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-500'
      }`}
    >
      {isBuy ? '▲ BUY' : '▼ SELL'} · {signal.confidence}%
    </span>
  );
}
