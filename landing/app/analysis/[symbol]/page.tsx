// app/analysis/[symbol]/page.tsx
import { STATIC_SYMBOLS } from "../../../app/lib/symbols";
import AnalysisFetcher from "./AnalysisFetcher";

export async function generateStaticParams() {
  return STATIC_SYMBOLS.map((s) => ({ symbol: s }));
}

export const dynamic = 'force-static';

export default async function Page({ params }: { params: Promise<{ symbol: string }> }) {
  const { symbol } = await params;
  return <AnalysisFetcher symbol={symbol} />;
}