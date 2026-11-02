'use client';

import { useCallback, useEffect, useState } from 'react';
import { RefreshCw } from 'lucide-react';
import { useAdminKey } from '../useAdminKey';
import { DateFilter } from './components/DateFilter';
import { OverviewCards } from './components/OverviewCards';
import { CampaignTable } from './components/CampaignTable';
import { Recommendations } from './components/Recommendations';
import { PlacementBreakdown } from './components/PlacementBreakdown';
import { SearchTermsTable } from './components/SearchTermsTable';
import { AudienceOverlap } from './components/AudienceOverlap';
import { AudienceOverviewCards } from './components/AudienceOverviewCards';
import { AudienceHealthTable } from './components/AudienceHealthTable';
import { ExclusionGapsCards } from './components/ExclusionGapsCards';
import { ExclusionGapsTable } from './components/ExclusionGapsTable';
import { GoogleAudienceOverviewCards } from './components/GoogleAudienceOverviewCards';
import { GoogleAudienceTable } from './components/GoogleAudienceTable';
import { GoogleExclusionGapsTable } from './components/GoogleExclusionGapsTable';
import type {
  CampaignsResponse,
  InsightsResponse,
  Period,
  RecommendationsResponse,
  PlacementsResponse,
  SearchTermsResponse,
  AudienceOverlapResponse,
  AudienceHealthResponse,
  ExclusionGapsResponse,
  GoogleAudienceHealthResponse,
  GoogleExclusionGapsResponse,
} from './lib/types';
import { formatTime } from './lib/format';

type Platform = 'facebook' | 'google';
type View = Platform | 'audience-overlap' | 'audience-insights' | 'exclusion-gaps' | 'google-audiences';

const VIEW_LABELS: Record<View, string> = {
  facebook: 'Facebook Ads',
  google: 'Google Ads',
  'audience-overlap': 'Audience Overlap',
  'audience-insights': 'Audience Insights',
  'exclusion-gaps': 'Exclusion Gaps',
  'google-audiences': 'Google Audiences',
};

/** Views with no period/date-range concept - the DateFilter is hidden and no `period` query param is sent. */
const PERIODLESS_VIEWS: View[] = ['audience-insights', 'exclusion-gaps', 'google-audiences'];

function ViewTabs({ value, onChange }: { value: View; onChange: (v: View) => void }) {
  const views: View[] = ['facebook', 'google', 'audience-overlap', 'audience-insights', 'exclusion-gaps', 'google-audiences'];
  return (
    <div className="flex gap-1 border-b border-slate-200">
      {views.map((v) => (
        <button
          key={v}
          onClick={() => onChange(v)}
          className={`px-4 py-2 text-sm font-medium border-b-2 -mb-px transition-colors ${
            value === v
              ? 'border-[#3B82F6] text-[#3B82F6]'
              : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          {VIEW_LABELS[v]}
        </button>
      ))}
    </div>
  );
}

interface PlatformState {
  insights: InsightsResponse | null;
  campaignsData: CampaignsResponse | null;
  recs: RecommendationsResponse | null;
  placements: PlacementsResponse | null; // Facebook only
  searchTerms: SearchTermsResponse | null; // Google only
  lastUpdated: Date | null;
}

const EMPTY_PLATFORM_STATE: PlatformState = {
  insights: null,
  campaignsData: null,
  recs: null,
  placements: null,
  searchTerms: null,
  lastUpdated: null,
};

export default function MonitoringDashboard() {
  const { adminKey, logout } = useAdminKey();

  const [view, setView] = useState<View>('facebook');
  const [period, setPeriod] = useState<Period>('today');
  const [dataByPlatform, setDataByPlatform] = useState<Record<Platform, PlatformState>>({
    facebook: EMPTY_PLATFORM_STATE,
    google: EMPTY_PLATFORM_STATE,
  });
  const [audienceOverlap, setAudienceOverlap] = useState<AudienceOverlapResponse | null>(null);
  const [audienceOverlapUpdated, setAudienceOverlapUpdated] = useState<Date | null>(null);
  const [audienceHealth, setAudienceHealth] = useState<AudienceHealthResponse | null>(null);
  const [audienceHealthUpdated, setAudienceHealthUpdated] = useState<Date | null>(null);
  const [exclusionGaps, setExclusionGaps] = useState<ExclusionGapsResponse | null>(null);
  const [exclusionGapsUpdated, setExclusionGapsUpdated] = useState<Date | null>(null);
  const [googleAudienceHealth, setGoogleAudienceHealth] = useState<GoogleAudienceHealthResponse | null>(null);
  const [googleExclusionGaps, setGoogleExclusionGaps] = useState<GoogleExclusionGapsResponse | null>(null);
  const [googleAudiencesUpdated, setGoogleAudiencesUpdated] = useState<Date | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const platform: Platform | null = view === 'facebook' || view === 'google' ? view : null;
  const current = platform ? dataByPlatform[platform] : null;
  const lastUpdated =
    view === 'audience-overlap'
      ? audienceOverlapUpdated
      : view === 'audience-insights'
        ? audienceHealthUpdated
        : view === 'exclusion-gaps'
          ? exclusionGapsUpdated
          : view === 'google-audiences'
            ? googleAudiencesUpdated
            : current?.lastUpdated ?? null;

  const load = useCallback(
    async (p: Period, plat: Platform) => {
      if (!adminKey) return;
      setLoading(true);
      setError('');
      const headers = { 'x-admin-key': adminKey };

      const extraPath = plat === 'facebook' ? 'placements' : 'search-terms';

      try {
        const [insightsRes, campaignsRes, recsRes, extraRes] = await Promise.all([
          fetch(`/api/${plat}/insights?period=${p}`, { headers }),
          fetch(`/api/${plat}/campaigns?period=${p}`, { headers }),
          fetch(`/api/${plat}/recommendations?period=${p}`, { headers }),
          fetch(`/api/${plat}/${extraPath}?period=${p}`, { headers }),
        ]);

        if ([insightsRes, campaignsRes, recsRes, extraRes].some((r) => r.status === 401)) {
          logout();
          return;
        }

        const [insightsJson, campaignsJson, recsJson, extraJson] = await Promise.all([
          insightsRes.json(),
          campaignsRes.json(),
          recsRes.json(),
          extraRes.json(),
        ]);

        if (insightsJson.error) throw new Error(insightsJson.error);
        if (campaignsJson.error) throw new Error(campaignsJson.error);
        if (recsJson.error) throw new Error(recsJson.error);
        if (extraJson.error) throw new Error(extraJson.error);

        setDataByPlatform((prev) => ({
          ...prev,
          [plat]: {
            insights: insightsJson,
            campaignsData: campaignsJson,
            recs: recsJson,
            placements: plat === 'facebook' ? extraJson : null,
            searchTerms: plat === 'google' ? extraJson : null,
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

  const loadAudienceOverlap = useCallback(
    async (p: Period) => {
      if (!adminKey) return;
      setLoading(true);
      setError('');
      try {
        const res = await fetch(`/api/facebook/audiences/overlap?period=${p}`, { headers: { 'x-admin-key': adminKey } });
        if (res.status === 401) {
          logout();
          return;
        }
        const json = await res.json();
        if (json.error) throw new Error(json.error);
        setAudienceOverlap(json);
        setAudienceOverlapUpdated(new Date());
      } catch (e: any) {
        setError(e.message || 'Failed to load data');
      } finally {
        setLoading(false);
      }
    },
    [adminKey, logout]
  );

  const loadAudienceHealth = useCallback(async () => {
    if (!adminKey) return;
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/facebook/audiences/health', { headers: { 'x-admin-key': adminKey } });
      if (res.status === 401) {
        logout();
        return;
      }
      const json = await res.json();
      if (json.error) throw new Error(json.error);
      setAudienceHealth(json);
      setAudienceHealthUpdated(new Date());
    } catch (e: any) {
      setError(e.message || 'Failed to load data');
    } finally {
      setLoading(false);
    }
  }, [adminKey, logout]);

  const loadExclusionGaps = useCallback(async () => {
    if (!adminKey) return;
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/facebook/audiences/exclusion-gaps', { headers: { 'x-admin-key': adminKey } });
      if (res.status === 401) {
        logout();
        return;
      }
      const json = await res.json();
      if (json.error) throw new Error(json.error);
      setExclusionGaps(json);
      setExclusionGapsUpdated(new Date());
    } catch (e: any) {
      setError(e.message || 'Failed to load data');
    } finally {
      setLoading(false);
    }
  }, [adminKey, logout]);

  const loadGoogleAudiences = useCallback(async () => {
    if (!adminKey) return;
    setLoading(true);
    setError('');
    const headers = { 'x-admin-key': adminKey };
    try {
      const [healthRes, gapsRes] = await Promise.all([
        fetch('/api/google/audiences/health', { headers }),
        fetch('/api/google/audiences/exclusion-gaps', { headers }),
      ]);
      if ([healthRes, gapsRes].some((r) => r.status === 401)) {
        logout();
        return;
      }
      const [healthJson, gapsJson] = await Promise.all([healthRes.json(), gapsRes.json()]);
      if (healthJson.error) throw new Error(healthJson.error);
      if (gapsJson.error) throw new Error(gapsJson.error);
      setGoogleAudienceHealth(healthJson);
      setGoogleExclusionGaps(gapsJson);
      setGoogleAudiencesUpdated(new Date());
    } catch (e: any) {
      setError(e.message || 'Failed to load data');
    } finally {
      setLoading(false);
    }
  }, [adminKey, logout]);

  const refresh = useCallback(() => {
    if (view === 'audience-overlap') loadAudienceOverlap(period);
    else if (view === 'audience-insights') loadAudienceHealth();
    else if (view === 'exclusion-gaps') loadExclusionGaps();
    else if (view === 'google-audiences') loadGoogleAudiences();
    else load(period, view);
  }, [view, period, load, loadAudienceOverlap, loadAudienceHealth, loadExclusionGaps, loadGoogleAudiences]);

  useEffect(() => {
    if (!adminKey) return;
    if (view === 'audience-overlap') {
      loadAudienceOverlap(period);
    } else if (view === 'audience-insights') {
      loadAudienceHealth();
    } else if (view === 'exclusion-gaps') {
      loadExclusionGaps();
    } else if (view === 'google-audiences') {
      loadGoogleAudiences();
    } else {
      load(period, view);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [adminKey, period, view]);

  return (
    <div className="min-h-screen bg-white px-4 py-8 sm:px-8">
      <div className="mx-auto max-w-7xl space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-xl font-semibold text-slate-800">Monitoring</h1>
            <p className="text-sm text-slate-500">Facebook & Google Ads performance and audience health — no audience creation, no ad management.</p>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs text-slate-400">
              {lastUpdated ? `Last updated: ${formatTime(lastUpdated)}` : 'Not loaded yet'}
            </span>
            <button
              onClick={refresh}
              className="flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-600 hover:border-[#3B82F6] hover:text-[#3B82F6]"
            >
              <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
              Refresh
            </button>
          </div>
        </div>

        <ViewTabs value={view} onChange={setView} />

        {!PERIODLESS_VIEWS.includes(view) && <DateFilter value={period} onChange={setPeriod} />}

        {error && (
          <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>
        )}

        {view === 'audience-overlap' ? (
          loading && !audienceOverlap ? (
            <div className="py-16 text-center text-slate-400">Loading...</div>
          ) : (
            audienceOverlap && <AudienceOverlap data={audienceOverlap} />
          )
        ) : view === 'audience-insights' ? (
          loading && !audienceHealth ? (
            <div className="py-16 text-center text-slate-400">Loading...</div>
          ) : (
            audienceHealth && (
              <>
                <AudienceOverviewCards summary={audienceHealth.summary} />
                <AudienceHealthTable audiences={audienceHealth.audiences} />
              </>
            )
          )
        ) : view === 'exclusion-gaps' ? (
          loading && !exclusionGaps ? (
            <div className="py-16 text-center text-slate-400">Loading...</div>
          ) : (
            exclusionGaps && (
              <>
                <ExclusionGapsCards summary={exclusionGaps.summary} currency={exclusionGaps.currency} />
                <ExclusionGapsTable gaps={exclusionGaps.gaps} currency={exclusionGaps.currency} />
              </>
            )
          )
        ) : view === 'google-audiences' ? (
          loading && !googleAudienceHealth ? (
            <div className="py-16 text-center text-slate-400">Loading...</div>
          ) : (
            <>
              {googleAudienceHealth && (
                <>
                  <GoogleAudienceOverviewCards summary={googleAudienceHealth.summary} />
                  <GoogleAudienceTable audiences={googleAudienceHealth.audiences} />
                </>
              )}
              {googleExclusionGaps && <GoogleExclusionGapsTable gaps={googleExclusionGaps.gaps} />}
            </>
          )
        ) : loading && !current?.insights ? (
          <div className="py-16 text-center text-slate-400">Loading...</div>
        ) : (
          <>
            {current?.insights && <OverviewCards data={current.insights} />}
            {current?.campaignsData && (
              <CampaignTable
                campaigns={current.campaignsData.campaigns}
                currency={current.campaignsData.currency}
              />
            )}
            {current?.recs && <Recommendations scope={current.recs.scope} recommendations={current.recs.recommendations} />}
            {view === 'facebook' && current?.placements && (
              <PlacementBreakdown
                placements={current.placements.placements}
                devices={current.placements.devices}
                currency={current.placements.currency}
              />
            )}
            {view === 'google' && current?.searchTerms && (
              <SearchTermsTable
                searchTerms={current.searchTerms.searchTerms}
                negativeCandidates={current.searchTerms.negativeCandidates}
                currency={current.searchTerms.currency}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
}
