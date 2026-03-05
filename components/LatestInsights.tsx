import Link from 'next/link';
import { getRemoteBlogPosts, BlogPost } from '@/app/lib/blog-data';

export default async function LatestInsights() {
  let latestPosts: BlogPost[] = [];
  let hasError = false;
  
  try {
    const allPosts = await getRemoteBlogPosts();
    latestPosts = (allPosts || []).slice(0, 3);
  } catch (e) {
    console.error("Failed to fetch blog posts:", e);
    hasError = true;
  }

  // If no posts and no error, return null (no data to show)
  if (latestPosts.length === 0 && !hasError) return null;

  return (
    <section className="latest-insights w-full bg-[#050505] border-t border-white/5">
      <div className="max-w-7xl mx-auto px-6 py-24">
        {/* Premium Header with MZ Intelligence styling */}
        <div className="insights-header">
          <div>
            <div className="live-tag">
              <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] animate-pulse"></span>
              LIVE_INTEL_FEED
            </div>
            <h2 className="text-white">STRATEGIC_MARKET_INSIGHTS</h2>
          </div>
          <Link href="/blog" className="view-all">
            ACCESS_ARCHIVE →
          </Link>
        </div>

        {/* Show error message if fetch failed */}
        {hasError ? (
          <div className="text-center py-12 border border-white/5">
            <p className="text-[#94a3b8] mb-4">Unable to load latest insights</p>
            <Link href="/blog" className="text-[#D4AF37] text-sm tracking-widest hover:underline">
              VIEW ALL INSIGHTS →
            </Link>
          </div>
        ) : (
          /* Premium Grid with MZ Intelligence card styling */
          <div className="insights-grid">
            {latestPosts.map((post: BlogPost, index: number) => (
              <Link 
                key={post.slug} 
                href={`/blog/${post.slug}`} 
                className="insight-card group"
                style={{ 
                  animationDelay: `${index * 150}ms`,
                }}
              >
                {/* Image Container with 16:9 Ratio and MZ styling */}
                <div className="card-image-container">
                  {post.image ? (
                    <img 
                      src={post.image} 
                      alt={post.title} 
                      className="card-img"
                    />
                  ) : (
                    <div className="card-img-placeholder">
                      MZ_INTEL
                    </div>
                  )}
                  {/* Category Badge - You can make this dynamic if you have categories */}
                  <div className="category-badge">
                    MARKET_ANALYSIS
                  </div>
                </div>

                {/* Card Content with MZ typography */}
                <div className="card-content">
                  <div className="card-date">
                    {post.date}
                  </div>
                  <h3 className="card-title group-hover:text-[#D4AF37] transition-colors duration-300">
                    {post.title}
                  </h3>
                  <p className="card-desc">
                    {post.description}
                  </p>
                  <div className="card-footer-action">
                    READ_DOSSIER →
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}