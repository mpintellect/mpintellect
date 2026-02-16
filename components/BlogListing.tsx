'use client';
import { useState } from 'react';
import Link from 'next/link';

export default function BlogListing({ initialPosts }: { initialPosts: any[] }) {
  const [filter, setFilter] = useState<'all' | 'en' | 'ar'>('all');

  const filtered = initialPosts.filter(p => filter === 'all' || p.lang === filter);

  return (
    <section>
      <div className="blog-filters">
        {['all', 'en', 'ar'].map((f) => (
          <button 
            key={f}
            onClick={() => setFilter(f as any)}
            className={`blog-filter-btn ${filter === f ? 'active' : 'inactive'}`}
          >
            {f === 'ar' ? 'العربية' : f === 'en' ? 'English' : 'View All'}
          </button>
        ))}
      </div>

      <div className="blog-grid">
        {filtered.map((post) => (
          <Link href={`/blog/${post.slug}`} key={post.slug} className="blog-card">
            <div className="blog-card-image-container">
              {post.image ? (
                <img 
                  src={post.image} 
                  alt={post.title}
                  className="blog-card-image" 
                />
              ) : (
                <div className="blog-card-placeholder" />
              )}
            </div>
            <span className="blog-card-category">{post.category || 'INSIGHTS'}</span>
            <h3 className="blog-card-title">{post.title}</h3>
            <p className="blog-card-description">{post.description}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}