'use client';

import type { ColorFlag } from '../lib/types';
import { FLAG_STYLES, healthLabel } from '../lib/format';

export function StatusBadge({ status }: { status: string }) {
  const isActive = status === 'ACTIVE';
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ${
        isActive ? 'bg-green-50 text-green-700' : 'bg-slate-100 text-slate-500'
      }`}
    >
      {isActive ? '🟢 Active' : '🔴 Paused'}
    </span>
  );
}

export function ColorFlagBadge({ flag, label }: { flag: ColorFlag; label: string }) {
  const style = FLAG_STYLES[flag];
  return (
    <span className={`inline-flex items-center gap-1 rounded px-2 py-0.5 text-sm font-medium ${style.bg} ${style.text}`}>
      {style.dot} {label}
    </span>
  );
}

export function HealthBadge({ health }: { health: 'good' | 'warning' | 'bad' }) {
  const bg = health === 'good' ? 'bg-green-50 text-green-700' : health === 'warning' ? 'bg-yellow-50 text-yellow-700' : 'bg-red-50 text-red-700';
  return <span className={`inline-flex items-center rounded px-2 py-0.5 text-sm font-medium ${bg}`}>{healthLabel(health)}</span>;
}
