'use client';

import { useCallback, useEffect, useState, type FormEvent } from 'react';
import { Lock, RefreshCw } from 'lucide-react';
import { DateFilter } from './components/DateFilter';
import { OverviewCards } from './components/OverviewCards';
import { CampaignTable } from './components/CampaignTable';
import { Recommendations } from './components/Recommendations';
import type { CampaignsResponse, InsightsResponse, Period, RecommendationsResponse } from './lib/types';
import { formatTime } from './lib/format';

const SESSION_KEY = 'fb_ads_admin_key';

type Platform = 'facebook' | 'google';

const PLATFORM_LABELS: Record<Platform, string> = {
  facebook: 'Facebook Ads',
  google: 'Google Ads',
};

function useAdminKey() {
  const [adminKey, setAdminKey] = useState<string | null>(null);

  useEffect(() => {
    const stored = sessionStorage.getItem(SESSION_KEY);
    if (stored) setAdminKey(stored);
  }, []);

  const login = useCallback((key: string) => {
    sessionStorage.setItem(SESSION_KEY, key);
    setAdminKey(key);
  }, []);

  const logout = useCallback(() => {
    sessionStorage.removeItem(SESSION_KEY);
    setAdminKey(null);
  }, []);

  return { adminKey, login, logout };
}

function AdminGate({ onUnlock }: { onUnlock: (key: string) => void }) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function submit(e: FormEvent) {
    e.preventDefault();
    if (!password.trim()) {
      setError('Enter the admin password');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/admin/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });
      const data = await res.json();
      if (data.valid) {
        onUnlock(password);
      } else {
        setError('Incorrect password');
      }
    } catch {
      setError('Could not reach the server');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <form onSubmit={submit} className="w-full max-w-sm rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="mb-4 flex items-center gap-2 text-slate-700">
          <Lock size={18} />
          <h1 className="text-lg font-semibold">Admin Access</h1>
        </div>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Admin password"
          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-[#3B82F6] focus:outline-none"
          autoFocus
        />
        {error && <div className="mt-2 text-sm text-red-600">{error}</div>}
        <button
          type="submit"
          disabled={loading}
          className="mt-4 w-full rounded-lg bg-[#3B82F6] px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
        >
          {loading ? 'Checking...' : 'Unlock'}
        </button>
      </form>
    </div>
  );
}

function PlatformTabs({ value, onChange }: { value: Platform; onChange: (p: Platform) => void }) {
  const platforms: Platform[] = ['facebook', 'google'];
  return (
    <div className="flex gap-1 border-b border-slate-200">
      {platforms.map((p) => (
        <button
          key={p}
          onClick={() => onChange(p)}
          className={`px-4 py-2 text-sm font-medium border-b-2 -mb-px transition-colors ${
            value === p
              ? 'border-[#3B82F6] text-[#3B82F6]'
              : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          {PLATFORM_LABELS[p]}
        </button>
      ))}
    </div>
  );
}

interface PlatformState {
  insights: InsightsResponse | null;
  campaignsData: CampaignsResponse | null;
  recs: RecommendationsResponse | null;
  lastUpdated: Date | null;
}

const EMPTY_PLATFORM_STATE: PlatformState = { insights: null, campaignsData: null, recs: null, lastUpdated: null };

export default function AdsDashboard() {
  const { adminKey, login, logout } = useAdminKey();

  const [platform, setPlatform] = useState<Platform>('facebook');
  const [period, setPeriod] = useState<Period>('today');
  const [dataByPlatform, setDataByPlatform] = useState<Record<Platform, PlatformState>>({
    facebook: EMPTY_PLATFORM_STATE,
    google: EMPTY_PLATFORM_STATE,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const current = dataByPlatform[platform];

  const load = useCallback(
    async (p: Period, plat: Platform) => {
      if (!adminKey) return;
      setLoading(true);
      setError('');
      const headers = { 'x-admin-key': adminKey };

      try {
        const [insightsRes, campaignsRes, recsRes] = await Promise.all([
          fetch(`/api/${plat}/insights?period=${p}`, { headers }),
          fetch(`/api/${plat}/campaigns?period=${p}`, { headers }),
          fetch(`/api/${plat}/recommendations?period=${p}`, { headers }),
        ]);

        if (insightsRes.status === 401 || campaignsRes.status === 401 || recsRes.status === 401) {
          logout();
          return;
        }

        const [insightsJson, campaignsJson, recsJson] = await Promise.all([
          insightsRes.json(),
          campaignsRes.json(),
          recsRes.json(),
        ]);

        if (insightsJson.error) throw new Error(insightsJson.error);
        if (campaignsJson.error) throw new Error(campaignsJson.error);
        if (recsJson.error) throw new Error(recsJson.error);

        setDataByPlatform((prev) => ({
          ...prev,
          [plat]: {
            insights: insightsJson,
            campaignsData: campaignsJson,
            recs: recsJson,
            lastUpdated: new Date(),
          },
        }));
      } catch (e: any) {
        setError(e.message || 'Failed to load data');
      } finally {
        setLoading(false);
      }
    },
    [adminKey, logout]
  );

  useEffect(() => {
    if (adminKey) load(period, platform);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [adminKey, period, platform]);

  if (!adminKey) {
    return <AdminGate onUnlock={login} />;
  }

  return (
    <div className="min-h-screen bg-white px-4 py-8 sm:px-8">
      <div className="mx-auto max-w-7xl space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-xl font-semibold text-slate-800">Ads Dashboard</h1>
            <p className="text-sm text-slate-500">Campaign performance monitoring — no audience creation, no ad management.</p>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs text-slate-400">
              {current.lastUpdated ? `Last updated: ${formatTime(current.lastUpdated)}` : 'Not loaded yet'}
            </span>
            <button
              onClick={() => load(period, platform)}
              className="flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-600 hover:border-[#3B82F6] hover:text-[#3B82F6]"
            >
              <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
              Refresh
            </button>
          </div>
        </div>

        <PlatformTabs value={platform} onChange={setPlatform} />

        <DateFilter value={period} onChange={setPeriod} />

        {error && (
          <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>
        )}

        {loading && !current.insights ? (
          <div className="py-16 text-center text-slate-400">Loading...</div>
        ) : (
          <>
            {current.insights && <OverviewCards data={current.insights} period={period} />}
            {current.campaignsData && <CampaignTable campaigns={current.campaignsData.campaigns} period={period} />}
            {current.recs && <Recommendations scope={current.recs.scope} recommendations={current.recs.recommendations} />}
          </>
        )}
      </div>
    </div>
  );
}
