// app/news/page.tsx
import { STATIC_SYMBOLS } from "@/app/lib/symbols";
import NewsHubFetcher from "./NewsHubFetcher";

export const dynamic = 'force-static';

export default function NewsPage() {
  return <NewsHubFetcher />;
}