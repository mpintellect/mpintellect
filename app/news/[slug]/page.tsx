// app/news/[slug]/page.tsx - CLOUDFLARE VERSION
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getNewsItem } from '@/app/lib/newsStore';
import { getDb } from '@/app/lib/cloudflare/db-simple';

// Incremental Static Regeneration - revalidate every hour
export const revalidate = 3600;

// Generate metadata
export async function generateMetadata({ params }: { params: { slug: string } }) {
  const data = await getNewsItem(params.slug);
  if (!data) return { 
    title: 'News Not Found - MZPrimer',
    description: 'This news article could not be found.'
  };
  
  return {
    title: data.title,
    description: `Market Flash: ${data.symbol} just hit ${data.price_at_alert} with a confirmed ${data.signal} signal. Read the full AI breakdown.`,
    openGraph: {
      title: data.title,
      description: `Market analysis for ${data.symbol}: ${data.signal} signal at ${data.price_at_alert}`,
      images: [`https://mzprimer.com/api/og?sym=${data.symbol}&sig=${data.signal}&price=${data.price_at_alert}`],
      type: 'article',
      publishedTime: data.timestamp,
    },
    twitter: {
      card: 'summary_large_image',
      title: data.title,
      description: `Market analysis for ${data.symbol}: ${data.signal} signal at ${data.price_at_alert}`,
      images: [`https://mzprimer.com/api/og?sym=${data.symbol}&sig=${data.signal}&price=${data.price_at_alert}`],
    },
  };
}

// Generate static params for popular articles
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

export default async function NewsArticlePage({ params }: { params: { slug: string } }) {
  const news = await getNewsItem(params.slug);
  
  if (!news) return notFound();

  const isBuy = news.signal === 'BUY';
  const colorClass = isBuy ? 'text-green-500' : (news.signal === 'SELL' ? 'text-red-500' : 'text-gray-500');
  const timestamp = new Date(news.timestamp);

  return (
    <main className="max-w-3xl mx-auto px-4 sm:px-6 py-12 bg-black text-white min-h-screen font-sans">
      
      {/* Schema for News Article */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "NewsArticle",
            "headline": news.title,
            "datePublished": news.timestamp,
            "dateModified": news.timestamp,
            "image": [
              `https://mzprimer.com/api/og?sym=${news.symbol}&sig=${news.signal}&price=${news.price_at_alert}`
            ],
            "author": { 
              "@type": "Organization", 
              "name": "MZPrimer AI",
              "url": "https://mzprimer.com"
            },
            "publisher": {
              "@type": "Organization",
              "name": "MZPrimer",
              "logo": {
                "@type": "ImageObject",
                "url": "https://mzprimer.com/logo.png"
              }
            }
          })
        }}
      />

      {/* Navigation */}
      <div className="mb-8">
        <Link 
          href="/news" 
          className="text-blue-400 hover:text-blue-300 text-sm font-medium flex items-center gap-2"
        >
          ← Back to News
        </Link>
      </div>

      {/* Article Header */}
      <div className="border-l-4 border-blue-600 pl-6 mb-10">
        <span className="text-xs font-bold tracking-widest text-blue-400 uppercase">Breaking Market Alert</span>
        <h1 className="text-3xl md:text-4xl font-black mt-2 leading-tight">{news.title}</h1>
        
        <div className="mt-4 flex flex-wrap gap-4 text-sm text-zinc-500">
          <div className="flex items-center gap-2">
            <span className="text-zinc-600">📅</span>
            <span>{timestamp.toLocaleDateString('en-US', { 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-zinc-600">🕒</span>
            <span>{timestamp.toLocaleTimeString('en-US', { 
              hour: '2-digit', 
              minute: '2-digit',
              timeZoneName: 'short' 
            })}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-zinc-600">📊</span>
            <span>Symbol: {news.symbol}</span>
          </div>
        </div>
      </div>

      {/* Signal Highlight */}
      <div className="my-8 p-6 bg-zinc-900 rounded-xl border border-zinc-800 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="text-center md:text-left">
          <p className="text-xs text-zinc-500 uppercase mb-1">Signal Detected</p>
          <p className={`text-3xl font-black ${colorClass}`}>
            {news.signal} 
            <span className="ml-2">
              {isBuy ? '📈' : news.signal === 'SELL' ? '📉' : '⚡'}
            </span>
          </p>
        </div>
        <div className="text-center md:text-right">
          <p className="text-xs text-zinc-500 uppercase mb-1">Price at Alert</p>
          <p className="text-3xl font-mono">{news.price_at_alert.toFixed(5)}</p>
        </div>
      </div>

      {/* Article Content */}
      <div className="prose prose-invert prose-lg max-w-none">
        <p className="text-lg leading-relaxed">
          <strong>MZPrimer AI Detection:</strong> At {timestamp.toLocaleTimeString()}, our algorithmic systems detected a significant structure shift on 
          <span className="font-bold text-white"> {news.symbol}</span>. This movement triggered a high-confidence alert based on volatility expansion and momentum alignment.
        </p>
        
        <h2 className="text-2xl font-bold mt-8 mb-4">Market Context</h2>
        <p>
          The previous market structure has been invalidated by this {news.signal.toLowerCase()} signal. 
          Technical indicators suggest strong momentum in the direction of the signal, with key support/resistance 
          levels being tested.
        </p>

        <h2 className="text-2xl font-bold mt-8 mb-4">What Happens Next?</h2>
        <p>
          Historical performance for this setup suggests increased volatility in the coming trading session. 
          Traders should monitor:
        </p>
        <ul className="list-disc pl-5 space-y-2">
          <li>Key support/resistance levels around the current price</li>
          <li>Volume confirmation for the signal direction</li>
          <li>Market sentiment indicators for confirmation</li>
          <li>Upcoming economic events that could impact {news.symbol}</li>
        </ul>

        <div className="bg-amber-900/20 border border-amber-500/30 p-4 rounded-lg my-6">
          <p className="text-sm text-amber-200">
            <strong>⚠️ Risk Warning:</strong> All trading involves risk. This analysis is for informational purposes only. 
            Past performance is not indicative of future results.
          </p>
        </div>
      </div>

      {/* CTA Section */}
      <div className="mt-12 p-6 bg-gradient-to-r from-blue-900/20 to-purple-900/20 border border-blue-500/30 rounded-2xl">
        <div className="text-center">
          <h3 className="text-xl font-bold mb-2">Ready to Trade?</h3>
          <p className="text-blue-200 mb-6">Get real-time AI analysis and precise entry points.</p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href={`/analysis/${news.symbol.toLowerCase()}`}
              className="inline-block bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 px-6 rounded-full transition text-center"
            >
              View {news.symbol} Analysis →
            </Link>
            <Link 
              href="/ai-chat"
              className="inline-block bg-purple-600 hover:bg-purple-500 text-white font-bold py-3 px-6 rounded-full transition text-center"
            >
              Try AI Trading Assistant
            </Link>
          </div>
          
          <p className="text-sm text-zinc-400 mt-6">
            Need help? <Link href="/contact" className="text-blue-400 hover:text-blue-300">Contact our trading support</Link>
          </p>
        </div>
      </div>

      {/* Related Articles (Optional) */}
      <div className="mt-12 pt-8 border-t border-zinc-800">
        <h3 className="text-xl font-bold mb-6">Latest Market News</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Link 
            href="/news/trending"
            className="p-4 bg-zinc-900 hover:bg-zinc-800 rounded-lg transition"
          >
            <span className="text-xs text-blue-400 uppercase font-medium">Trending</span>
            <p className="mt-2 font-medium">Daily Market Updates & Analysis</p>
          </Link>
          <Link 
            href="/ai-robot"
            className="p-4 bg-zinc-900 hover:bg-zinc-800 rounded-lg transition"
          >
            <span className="text-xs text-purple-400 uppercase font-medium">AI Tools</span>
            <p className="mt-2 font-medium">Advanced Trading Robots & Signals</p>
          </Link>
        </div>
      </div>
    </main>
  );
}