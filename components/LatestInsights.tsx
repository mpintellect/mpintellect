'use client'; // ✅ Tell Next.js to run this in the browser

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { getRemoteBlogPosts, BlogPost } from '@/app/lib/blog-data';

export default function LatestInsights() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  // This runs as soon as the user opens the website
  useEffect(() => {
    async function loadNews() {
      try {
        const data = await getRemoteBlogPosts();
        setPosts(data.slice(0, 3)); // Only take the top 3
      } catch (error) {
        console.error("Failed to load news briefings");
      } finally {
        setLoading(false);
      }
    }
    loadNews();
  }, []);

  // 1. WHILE LOADING: Show a subtle "Pulse" skeleton
  if (loading) {
    return (
      <div className="latest-insights animate-pulse">
        <div className="max-w-7xl mx-auto px-6 py-24">
          <div className="insights-header">
            <div className="h-10 w-64 bg-zinc-900 rounded" />
          </div>
          <div className="insights-grid">
            <div className="insight-card h-64 bg-zinc-900" />
            <div className="insight-card h-64 bg-zinc-900" />
            <div className="insight-card h-64 bg-zinc-900" />
          </div>
        </div>
      </div>
    );
  }

  if (posts.length === 0) return null;

  return (
    <section className="latest-insights w-full bg-[#050505] border-t border-white/5">
      <div className="max-w-7xl mx-auto px-6 py-24">
        {/* Premium Header with MZ  styling */}
        <div className="insights-header">
          <div>
            <div className="live-tag">
              <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] animate-pulse"></span>
              LIVE_INTEL_FEED
            </div>
            <h2>STRATEGIC MARKET INSIGHTS</h2>
          </div>
          <Link href="/blog" className="view-all">
            ACCESS ARCHIVE →
          </Link>
        </div>

        {/* Premium Grid with MZ  card styling */}
        <div className="insights-grid">
          {posts.map((post, index) => (
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
                  MARKET ANALYSIS
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
                  READ FULL DOSSIER →
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}