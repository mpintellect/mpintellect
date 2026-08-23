// app/admin/facebook-ads/lib/format.ts

import type { ColorFlag } from './types';

export function formatCurrency(value: number): string {
  return `$${value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export function formatNumber(value: number): string {
  return value.toLocaleString('en-US', { maximumFractionDigits: 0 });
}

export function formatPercent(value: number): string {
  return `${value.toFixed(2)}%`;
}

export function formatRoas(value: number): string {
  return `${value.toFixed(2)}x`;
}

export function formatFrequency(value: number): string {
  return `${value.toFixed(2)}x`;
}

export function formatDate(value: string | null): string {
  if (!value) return 'Ongoing';
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
}

export function formatTime(value: Date | null): string {
  if (!value) return '—';
  return value.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
}

export function formatChangePct(value: number | null): string {
  if (value === null) return '—';
  const sign = value > 0 ? '+' : '';
  return `${sign}${value.toFixed(1)}%`;
}

export const FLAG_STYLES: Record<ColorFlag, { bg: string; text: string; dot: string }> = {
  green: { bg: 'bg-green-50', text: 'text-green-700', dot: '🟢' },
  yellow: { bg: 'bg-yellow-50', text: 'text-yellow-700', dot: '🟡' },
  red: { bg: 'bg-red-50', text: 'text-red-700', dot: '🔴' },
  neutral: { bg: 'bg-slate-50', text: 'text-slate-500', dot: '⚪' },
};

export function healthLabel(health: 'good' | 'warning' | 'bad'): string {
  if (health === 'good') return '✅ Good';
  if (health === 'warning') return '⚠️ Warning';
  return '❌ Bad';
}
