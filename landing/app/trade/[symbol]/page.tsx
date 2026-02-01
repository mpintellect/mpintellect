import { STATIC_SYMBOLS } from "@/landing/app/lib/symbols";
import TradeFetcher from "./TradeFetcher";

export async function generateStaticParams() {
  return STATIC_SYMBOLS.map((s) => ({ symbol: s }));
}

export const dynamic = 'force-static';

export default async function Page({ params }: { params: Promise<{ symbol: string }> }) {
  const { symbol } = await params;
  return <TradeFetcher symbol={symbol} />;
}