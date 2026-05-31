// app/[locale]/[tool]/[symbol]/page.tsx

import { STATIC_SYMBOLS } from "@/app/lib/symbols";
import UnifiedFetcher from "@/components/UnifiedFetcher";
import { toolMapping, toolSeo, toolDescriptions } from "@/app/lib/translations";

// Define valid tool types
type ValidTool = 'analysis' | 'trade' | 'trend' | 'momentum' | 'zones' | 'volatility' | 'calculator' | 'indicator' | 'forecast';

const TOOLS: ValidTool[] = [
  'analysis', 'trade', 'trend', 'momentum', 
  'zones', 'volatility', 'calculator', 'indicator', 'forecast'
];

export async function generateStaticParams() {
  const locales = ['en', 'ar'];
  const symbols = STATIC_SYMBOLS.map((s) => s.toLowerCase());
  
  return locales.flatMap((locale) =>
    TOOLS.flatMap((tool) =>
      symbols.map((symbol) => ({
        locale,
        tool,
        symbol,
      }))
    )
  );
}

export const dynamic = 'force-static';
export const dynamicParams = false;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; tool: string; symbol: string }>;
}) {
  const { locale, tool, symbol } = await params;
  
  // Type assertion - tell TypeScript that tool is a ValidTool
  const validTool = tool as ValidTool;
  const validLocale = locale as 'en' | 'ar';
  
  const title = toolSeo[validLocale]?.[validTool]?.(symbol.toUpperCase()) || `${symbol.toUpperCase()} ${tool} Analysis`;
  const description = toolDescriptions[validLocale]?.[validTool]?.(symbol.toUpperCase()) || `Professional ${tool} analysis for ${symbol.toUpperCase()}`;
  
  const languages: Record<string, string> = {};
  
  if (locale !== 'en') {
    languages.en = `https://mpintellect.com/en/${toolMapping.en[validTool]}/${symbol}`;
  }
  if (locale !== 'ar') {
    languages.ar = `https://mpintellect.com/ar/${toolMapping.ar[validTool]}/${symbol}`;
  }
  
  const canonical = `https://mpintellect.com/${locale}/${toolMapping[validLocale][validTool]}/${symbol}`;
  
  return {
    title,
    description,
    alternates: {
      canonical,
      languages,
    },
    openGraph: {
      title,
      description,
      type: 'website',
      url: canonical,
      siteName: 'MPIntellect',
      locale: locale === 'ar' ? 'ar_MA' : 'en_US',
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export default async function Page({
  params,
}: {
  params: Promise<{ locale: string; tool: string; symbol: string }>;
}) {
  const { locale, tool, symbol } = await params;
  const validLocale = locale as 'en' | 'ar';
  const validTool = tool as ValidTool;
  
  return <UnifiedFetcher symbol={symbol} locale={validLocale} tool={validTool} />;
}