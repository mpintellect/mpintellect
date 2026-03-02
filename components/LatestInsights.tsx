// components/LatestInsights.tsx
import Link from 'next/link';
import { getRemoteBlogPosts, BlogPost } from '@/app/lib/blog-data';

export default async function LatestInsights() {
  const allPosts = await getRemoteBlogPosts();
  
  // ✅ Fetch only the top 3 most recent executive briefings
  const latestPosts = allPosts.slice(0, 3);

  if (latestPosts.length === 0) return null;

  return (
    <section className="latest-insights">
      <div className="section-container">
        <div className="insights-header">
          <div className="title-group">
            <span className="live-tag"><span className="dot pulse"></span> LIVE_INTEL</span>
            <h2>STRATEGIC_MARKET_INSIGHTS</h2>
          </div>
          <Link href="/blog" className="view-all">ACCESS_FULL_ARCHIVE →</Link>
        </div>

        <div className="insights-grid">
          {latestPosts.map((post: BlogPost) => (
            <Link href={`/blog/${post.slug}`} key={post.slug} className="insight-card">
              {/* ✅ IMAGE WRAPPER */}
              <div className="card-image-container">
                {post.image ? (
                  <img 
                    src={post.image} 
                    alt={post.title}
                    className="card-img" 
                    loading="lazy"
                  />
                ) : (
                  <div className="card-img-placeholder">
                    <span>MZ_INTELLIGENCE</span>
                  </div>
                )}
                <div className="card-overlay" />
                <span className="category-badge">{post.category || 'MARKET_REPORT'}</span>
              </div>

              <div className="card-content">
                <div className="card-date">{post.date}</div>
                <h3 className="card-title">{post.title}</h3>
                <p className="card-desc">{post.description}</p>
                <div className="card-footer-action">READ_FULL_DOSSIER</div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}