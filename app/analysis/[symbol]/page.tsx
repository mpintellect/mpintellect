import { STATIC_SYMBOLS } from "@/app/lib/symbols";
import AnalysisFetcher from "./AnalysisFetcher";

export async function generateStaticParams() {
  // ✅ Force lowercase for all generated static folders
  return STATIC_SYMBOLS.map((s) => ({ 
    symbol: s.toLowerCase() 
  }));
}

export const dynamic = 'force-static';
// ✅ Explicitly tell Next.js not to try and render unknown symbols at runtime
export const dynamicParams = false; 

export default async function Page({ params }: { params: Promise<{ symbol: string }> }) {
  const { symbol } = await params;
  // Pass it exactly as received in the URL
  return <AnalysisFetcher symbol={symbol} />;
}