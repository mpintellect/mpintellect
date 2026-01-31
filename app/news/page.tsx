// app/news/page.tsx - News listing page
import Link from 'next/link';
import { getRecentNews } from '@/app/lib/newsStore';

// For Cloudflare static export, we need to export dynamic as 'force-static'
export const dynamic = 'force-static';
// export const revalidate = 3600; // Remove this for static export

export default async function NewsPage() {
  const newsArticles = await getRecentNews(50);
  
  return (
    <main className="max-w-6xl mx-auto px-4 sm:px-6 py-12 bg-black text-white min-h-screen">
      <div className="mb-12">
        <h1 className="text-4xl font-black mb-4">📰 Market News & Signals</h1>
        <p className="text-zinc-400 text-lg">
          Real-time trading signals, market analysis, and AI-generated insights
        </p>
      </div>
      
      {/* Stats Bar */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
        <div className="bg-zinc-900 p-6 rounded-xl">
          <div className="text-3xl font-bold text-green-500">{newsArticles.length}</div>
          <div className="text-zinc-400 text-sm uppercase">Recent Signals</div>
        </div>
        <div className="bg-zinc-900 p-6 rounded-xl">
          <div className="text-3xl font-bold text-blue-500">
            {newsArticles.filter(n => n.signal === 'BUY').length}
          </div>
          <div className="text-zinc-400 text-sm uppercase">Buy Signals</div>
        </div>
        <div className="bg-zinc-900 p-6 rounded-xl">
          <div className="text-3xl font-bold text-red-500">
            {newsArticles.filter(n => n.signal === 'SELL').length}
          </div>
          <div className="text-zinc-400 text-sm uppercase">Sell Signals</div>
        </div>
      </div>
      
      {/* News Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {newsArticles.map((article) => (
          <Link 
            key={article.id}
            href={`/news/${article.slug}`}
            className="group bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 rounded-xl p-6 transition-all duration-300 hover:border-blue-500/50"
          >
            <div className="flex items-start justify-between mb-4">
              <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                article.signal === 'BUY' ? 'bg-green-500/20 text-green-400' :
                article.signal === 'SELL' ? 'bg-red-500/20 text-red-400' :
                'bg-zinc-700 text-zinc-400'
              }`}>
                {article.signal}
              </span>
              <span className="text-xs text-zinc-500">
                {new Date(article.timestamp).toLocaleDateString()}
              </span>
            </div>
            
            <h3 className="text-lg font-bold mb-3 group-hover:text-blue-400 transition">
              {article.title}
            </h3>
            
            <div className="text-sm text-zinc-400 mb-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-zinc-600">📊</span>
                <span>{article.symbol}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-zinc-600">💰</span>
                <span>Price: {article.price_at_alert.toFixed(5)}</span>
              </div>
            </div>
            
            <div className="text-blue-400 text-sm font-medium group-hover:text-blue-300 transition">
              Read Analysis →
            </div>
          </Link>
        ))}
      </div>
      
      {newsArticles.length === 0 && (
        <div className="text-center py-20">
          <div className="text-6xl mb-6">📊</div>
          <h3 className="text-2xl font-bold mb-4">No News Articles Yet</h3>
          <p className="text-zinc-400 mb-8">
            News articles are generated automatically when AI detects significant market movements.
          </p>
          <Link 
            href="/ai-chat"
            className="inline-block bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 px-8 rounded-full transition"
          >
            Generate Your First Signal
          </Link>
        </div>
      )}
    </main>
  );
}