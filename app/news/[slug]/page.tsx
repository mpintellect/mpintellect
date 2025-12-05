import { notFound } from 'next/navigation';
import { adminDb } from '../../lib/pushAdminSafe'; // Ensure this is client-safe or use a server lib
import Link from 'next/link';

// 1. Fetch Data
async function getNewsItem(slug: string) {
  const doc = await adminDb.collection('news_archive').doc(slug).get();
  if (!doc.exists) return null;
  return doc.data();
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const data = await getNewsItem(params.slug);
  if (!data) return { title: 'News Not Found' };
  
  return {
    title: data.title,
    description: `Market Flash: ${data.symbol} just hit ${data.price_at_alert} with a confirmed ${data.signal} signal. Read the full AI breakdown.`,
    openGraph: {
       // Use your dynamic image generator here
       images: [`https://mzprimer.com/api/og?sym=${data.symbol}&sig=${data.signal}&price=${data.price_at_alert}`]
    }
  };
}

export default async function NewsArticlePage({ params }: { params: { slug: string } }) {
  const news = await getNewsItem(params.slug);
  
  if (!news) return notFound();

  const isBuy = news.signal === 'BUY';
  const colorClass = isBuy ? 'text-green-500' : (news.signal === 'SELL' ? 'text-red-500' : 'text-gray-500');

  return (
    <main className="max-w-3xl mx-auto px-6 py-20 bg-black text-white min-h-screen font-sans">
      
      {/* Schema for News Article */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "NewsArticle",
            "headline": news.title,
            "datePublished": news.timestamp,
            "image": [
              `https://mzprimer.com/api/og?sym=${news.symbol}&sig=${news.signal}`
            ],
            "author": { "@type": "Organization", "name": "MZprimer AI" }
          })
        }}
      />

      <div className="border-l-4 border-blue-600 pl-6 mb-10">
        <span className="text-xs font-bold tracking-widest text-blue-400 uppercase">Breaking Market Alert</span>
        <h1 className="text-4xl md:text-5xl font-black mt-2 leading-tight">{news.title}</h1>
        <p className="text-zinc-500 mt-4 text-sm">{new Date(news.timestamp).toLocaleString()}</p>
      </div>

      <div className="prose prose-invert prose-lg">
        <p>
          <strong>MZprimer AI Detection:</strong> At {new Date(news.timestamp).toLocaleTimeString()}, our algorithmic systems detected a significant structure shift on 
          <span className="font-bold text-white"> {news.symbol}</span>.
        </p>
        
        <div className="my-8 p-6 bg-zinc-900 rounded-xl border border-zinc-800 flex items-center justify-between">
          <div>
            <p className="text-xs text-zinc-500 uppercase">Signal Detected</p>
            <p className={`text-3xl font-black ${colorClass}`}>{news.signal}</p>
          </div>
          <div className="text-right">
             <p className="text-xs text-zinc-500 uppercase">Price at Alert</p>
             <p className="text-3xl font-mono">{news.price_at_alert}</p>
          </div>
        </div>

        <p>
          This movement triggered a high-confidence alert based on volatility expansion and momentum alignment. 
          The previous market structure has been invalidated.
        </p>

        <h3>What happens next?</h3>
        <p>
          Historical performance for this setup suggests high volatility in the coming 4-hour session. 
          Traders are advised to check liquidity zones immediately.
        </p>
      </div>

      {/* CTA: Check LIVE data (Crucial for user value) */}
      <div className="mt-12 p-8 bg-blue-900/20 border border-blue-500/30 rounded-2xl text-center">
        <h3 className="text-xl font-bold mb-2">Is this trade still valid?</h3>
        <p className="text-blue-200 mb-6 text-sm">Prices change fast. Check the real-time AI dashboard.</p>
        <Link 
          href={`/analysis/${news.symbol}`}
          className="inline-block bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 px-8 rounded-full transition"
        >
          View Live {news.symbol} Chart &rarr;
        </Link>
      </div>

    </main>
  );
}