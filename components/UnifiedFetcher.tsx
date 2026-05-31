// components/UnifiedFetcher.tsx

'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { loadingTexts, errorTitles, commonTranslations, Locale } from '@/app/lib/translations';
import ToolNavigation from './ToolNavigation';
import SymbolNavigation from './SymbolNavigation';

// Import all client views
import AnalysisClientView from './analysis/AnalysisClientView';
import TradeClientView from './trade/TradeClientView';
import TrendClientView from './trend/TrendClientView';
import MomentumClientView from './momentum/MomentumClientView';
import ZonesClientView from './zones/ZonesClientView';
import VolatilityClientView from './volatility/VolatilityClientView';
import CalculatorClientView from './calculator/CalculatorClientView';
import IndicatorClientView from './indicator/IndicatorClientView';
import ForecastClientView from './forecast/ForecastClientView';

// Map tool names to their client view components
const clientViews: Record<string, any> = {
  analysis: AnalysisClientView,
  trade: TradeClientView,
  trend: TrendClientView,
  momentum: MomentumClientView,
  zones: ZonesClientView,
  volatility: VolatilityClientView,
  calculator: CalculatorClientView,
  indicator: IndicatorClientView,
  forecast: ForecastClientView,
};

interface UnifiedFetcherProps {
  symbol: string;
  locale: Locale;
  tool: string;
}

export default function UnifiedFetcher({ symbol, locale, tool }: UnifiedFetcherProps) {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const t = commonTranslations[locale];
  const loadingText = loadingTexts[locale][tool as keyof typeof loadingTexts.en]?.(symbol.toUpperCase()) || t.refresh;
  const errorTitle = errorTitles[locale][tool as keyof typeof errorTitles.en] || t.refresh;
  const ClientView = clientViews[tool];
  const displaySymbol = symbol.toLowerCase();

  const fetchSymbolData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const apiSymbol = symbol.toUpperCase();
      const response = await fetch(`https://mpintellect.com/api/symbol-data?symbol=${apiSymbol}`);
      
      if (!response.ok) {
        throw new Error(`Symbol ${displaySymbol} not found in database.`);
      }
      
      const result = await response.json();
      
      if (result.error) {
        throw new Error(result.error);
      }
      
      setData(result);
    } catch (err) {
      console.error(`Failed to load ${tool} data for ${symbol}`, err);
      setError(err instanceof Error ? err.message : 'Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSymbolData();
  }, [symbol, tool]);

  // Set HTML direction for RTL
  useEffect(() => {
    document.documentElement.dir = locale === 'ar' ? 'rtl' : 'ltr';
  }, [locale]);

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin h-10 w-10 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-400">{loadingText}</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="text-red-500 text-4xl mb-4">⚠️</div>
          <h2 className="text-xl text-white mb-2">{errorTitle}</h2>
          <p className="text-gray-400 mb-4">{error}</p>
          <button 
            onClick={fetchSymbolData}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
          >
            {t.retry}
          </button>
        </div>
      </div>
    );
  }

  // No data state
  if (!data) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <p className="text-zinc-400">No data available for {displaySymbol.toUpperCase()}</p>
          <button
            onClick={fetchSymbolData}
            className="mt-4 px-4 py-2 bg-zinc-800 hover:bg-zinc-700 rounded-md"
          >
            {t.retry}
          </button>
        </div>
      </div>
    );
  }

  // Success - render the appropriate client view with navigation
  return (
    <>
      <ToolNavigation currentTool={tool} currentSymbol={displaySymbol} locale={locale} />
      <ClientView data={data} symbol={displaySymbol} locale={locale} onRefresh={fetchSymbolData} />
    </>
  );
}