import NewsFetcher from "./NewsFetcher";

// Generate static params for news articles
export async function generateStaticParams() {
  return [];
}

export const dynamic = 'force-static';

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <NewsFetcher slug={slug} />;
}