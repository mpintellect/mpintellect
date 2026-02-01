import { getDb } from "@/app/lib/cloudflare/db-simple";
import NewsFetcher from "./NewsFetcher";

// Generate static params for popular news articles
export async function generateStaticParams() {
  try {
    const db = getDb();
    if (!db) return [];

    const stmt = db.prepare('SELECT slug FROM news_articles WHERE created_at > ? ORDER BY created_at DESC LIMIT 50');
    const weekAgo = Date.now() - (7 * 24 * 60 * 60 * 1000);
    const result = await stmt.bind(weekAgo).all();
    
    return (result.results as Array<{ slug: string }>).map((item) => ({
      slug: item.slug,
    }));
  } catch (error) {
    console.error('Error generating static params for news:', error);
    return [];
  }
}

export const dynamic = 'force-static';

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <NewsFetcher slug={slug} />;
}