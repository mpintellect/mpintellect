'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { blogPosts } from '../landing/app/lib/blogPosts';

// Define the actual type based on your data
type BlogPostItem = {
  title: string;
  slug: string;
  description: string;
  content: string;
  // These might be optional or missing in your actual data
  date?: string;
  image?: string;
  lang?: 'en' | 'ar';
};

type FilterType = 'all' | 'en' | 'ar' | 'latest' | 'popular';

export default function BlogListing() {
  const [filter, setFilter] = useState<FilterType>('all');
  const [visiblePosts, setVisiblePosts] = useState<BlogPostItem[]>([]);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  // Extract all unique tags from blog posts (create default tags based on language or content)
  const allTags = Array.from(
    new Set(
      (blogPosts as BlogPostItem[]).flatMap(post => {
        const tags = [];
        if (post.description?.toLowerCase().includes('forex') || 
            post.content?.toLowerCase().includes('forex')) {
          tags.push('Forex');
        }
        if (post.description?.toLowerCase().includes('risk') || 
            post.content?.toLowerCase().includes('risk')) {
          tags.push('Risk Management');
        }
        if (post.description?.toLowerCase().includes('lot') || 
            post.content?.toLowerCase().includes('lot')) {
          tags.push('Position Sizing');
        }
        tags.push('Trading Guides');
        return tags;
      })
    )
  );

  // Filter posts based on selected filter
  useEffect(() => {
    let filtered = [...(blogPosts as BlogPostItem[])];

    // Apply language filter if lang exists
    if (filter === 'en') {
      filtered = filtered.filter(post => !post.lang || post.lang === 'en');
    } else if (filter === 'ar') {
      filtered = filtered.filter(post => post.lang === 'ar');
    }

    // Apply sorting
    if (filter === 'latest' || filter === 'popular') {
      // Try to sort by date if available, otherwise keep as is
      filtered.sort((a, b) => {
        if (a.date && b.date) {
          return new Date(b.date).getTime() - new Date(a.date).getTime();
        }
        return 0;
      });
    }

    // Apply tag filter if selected
    if (selectedTag) {
      filtered = filtered.filter(post => {
        if (selectedTag === 'Forex') {
          return post.description?.toLowerCase().includes('forex') || 
                 post.content?.toLowerCase().includes('forex');
        }
        if (selectedTag === 'Risk Management') {
          return post.description?.toLowerCase().includes('risk') || 
                 post.content?.toLowerCase().includes('risk');
        }
        if (selectedTag === 'Position Sizing') {
          return post.description?.toLowerCase().includes('lot') || 
                 post.content?.toLowerCase().includes('lot');
        }
        return true;
      });
    }

    setVisiblePosts(filtered);
  }, [filter, selectedTag]);

  // Format date to readable format (with fallback)
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Recent';
    
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch {
      return 'Recent';
    }
  };

  // Get language label (with fallback)
  const getLanguageLabel = (lang?: 'en' | 'ar') => {
    if (!lang) return 'English'; // Default to English
    return lang === 'en' ? 'English' : 'العربية';
  };

  // Get language icon (with fallback)
  const getLanguageIcon = (lang?: 'en' | 'ar') => {
    if (!lang) return '🇺🇸'; // Default to English
    return lang === 'en' ? '🇺🇸' : '🇸🇦';
  };

  // Get estimated read time
  const getReadTime = (content: string) => {
    const wordCount = content.split(/\s+/).length;
    const wordsPerMinute = 200;
    return Math.max(1, Math.ceil(wordCount / wordsPerMinute));
  };

  // Clear all filters
  const clearFilters = () => {
    setFilter('all');
    setSelectedTag(null);
  };

  // Stats
  const totalPosts = (blogPosts as BlogPostItem[]).length;
  const englishPosts = (blogPosts as BlogPostItem[]).filter(p => !p.lang || p.lang === 'en').length;
  const arabicPosts = (blogPosts as BlogPostItem[]).filter(p => p.lang === 'ar').length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
      {/* Hero Header */}
      <div className="mb-12 text-center">
        <h1 className="text-5xl font-black mb-4 bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
          MZPrimer Trading Blog
        </h1>
        <p className="text-zinc-400 text-xl max-w-3xl mx-auto">
          Expert trading insights, market analysis, and actionable guides.
        </p>
      </div>

      {/* Stats Bar */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-zinc-900 p-6 rounded-xl">
          <div className="text-3xl font-bold text-green-500">{totalPosts}</div>
          <div className="text-zinc-400 text-sm uppercase">Total Articles</div>
        </div>
        <div className="bg-zinc-900 p-6 rounded-xl">
          <div className="text-3xl font-bold text-blue-500">{englishPosts}</div>
          <div className="text-zinc-400 text-sm uppercase">English Articles</div>
        </div>
        <div className="bg-zinc-900 p-6 rounded-xl">
          <div className="text-3xl font-bold text-amber-500">{arabicPosts}</div>
          <div className="text-zinc-400 text-sm uppercase">Arabic Articles</div>
        </div>
      </div>

      {/* Filter Controls */}
      <div className="mb-8">
        <div className="flex flex-wrap gap-3 mb-6">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-full text-sm font-medium transition ${
              filter === 'all'
                ? 'bg-blue-600 text-white'
                : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700'
            }`}
          >
            All Articles ({totalPosts})
          </button>
          <button
            onClick={() => setFilter('en')}
            className={`px-4 py-2 rounded-full text-sm font-medium transition ${
              filter === 'en'
                ? 'bg-blue-600 text-white'
                : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700'
            }`}
          >
            🇺🇸 English ({englishPosts})
          </button>
          <button
            onClick={() => setFilter('ar')}
            className={`px-4 py-2 rounded-full text-sm font-medium transition ${
              filter === 'ar'
                ? 'bg-blue-600 text-white'
                : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700'
            }`}
          >
            🇸🇦 Arabic ({arabicPosts})
          </button>
          <button
            onClick={() => setFilter('latest')}
            className={`px-4 py-2 rounded-full text-sm font-medium transition ${
              filter === 'latest'
                ? 'bg-blue-600 text-white'
                : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700'
            }`}
          >
            🔥 Latest
          </button>
        </div>

        {/* Tags Filter */}
        <div className="mb-6">
          <h3 className="text-sm font-medium text-zinc-400 mb-3 uppercase">Browse by Category</h3>
          <div className="flex flex-wrap gap-2">
            {allTags.map((tag) => (
              <button
                key={tag}
                onClick={() => setSelectedTag(selectedTag === tag ? null : tag)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition ${
                  selectedTag === tag
                    ? 'bg-purple-600 text-white'
                    : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'
                }`}
              >
                {tag}
              </button>
            ))}
            {selectedTag && (
              <button
                onClick={clearFilters}
                className="px-3 py-1.5 rounded-full text-xs font-medium bg-red-600/20 text-red-400 hover:bg-red-600/30 transition"
              >
                ✕ Clear Filters
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Active Filters Display */}
      {(filter !== 'all' || selectedTag) && (
        <div className="mb-6 p-4 bg-zinc-900 rounded-lg">
          <div className="flex items-center justify-between">
            <div className="text-sm text-zinc-300">
              Showing {visiblePosts.length} of {totalPosts} articles
              {filter !== 'all' && ` • Filtered by: ${filter === 'en' ? 'English' : filter === 'ar' ? 'Arabic' : filter}`}
              {selectedTag && ` • Tag: ${selectedTag}`}
            </div>
            <button
              onClick={clearFilters}
              className="text-sm text-blue-400 hover:text-blue-300"
            >
              Clear all filters
            </button>
          </div>
        </div>
      )}

      {/* Blog Posts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        {visiblePosts.map((post) => (
          <Link
            key={post.slug}
            href={`/blog/${post.slug}`}
            className="group bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 rounded-xl p-6 transition-all duration-300 hover:border-blue-500/30 hover:shadow-xl hover:shadow-blue-500/5"
          >
            {/* Post Image (if exists) */}
            {post.image && (
              <div className="mb-4 rounded-lg overflow-hidden">
                <img
                  src={post.image}
                  alt={post.title}
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
            )}

            {/* Language Badge (if lang exists) */}
            {post.lang && (
              <div className="flex items-center justify-between mb-3">
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                  post.lang === 'en' 
                    ? 'bg-blue-500/20 text-blue-400' 
                    : 'bg-amber-500/20 text-amber-400'
                }`}>
                  {getLanguageIcon(post.lang)} {getLanguageLabel(post.lang)}
                </span>
                <span className="text-xs text-zinc-500">
                  {formatDate(post.date)}
                </span>
              </div>
            )}

            {/* Title */}
            <h3 className="text-xl font-bold mb-3 group-hover:text-blue-400 transition line-clamp-2">
              {post.title}
            </h3>

            {/* Description */}
            <p className="text-zinc-400 text-sm mb-4 line-clamp-2">
              {post.description}
            </p>

            {/* Meta Info */}
            <div className="flex items-center justify-between pt-4 border-t border-zinc-800">
              <div className="text-xs text-zinc-500">
                <span className="flex items-center gap-1">
                  <span>⏱️</span>
                  <span>{getReadTime(post.content)} min read</span>
                </span>
              </div>
              <span className="text-blue-400 text-sm font-medium group-hover:text-blue-300 transition flex items-center gap-1">
                Read Article
                <span className="group-hover:translate-x-1 transition-transform">→</span>
              </span>
            </div>
          </Link>
        ))}
      </div>

      {/* Empty State */}
      {visiblePosts.length === 0 && (
        <div className="text-center py-16">
          <div className="text-6xl mb-6">🔍</div>
          <h3 className="text-2xl font-bold mb-4">No Articles Found</h3>
          <p className="text-zinc-400 mb-8 max-w-md mx-auto">
            Try adjusting your filters or check back later for new content.
          </p>
          <button
            onClick={clearFilters}
            className="inline-block bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 px-8 rounded-full transition"
          >
            Show All Articles
          </button>
        </div>
      )}

      {/* Newsletter CTA */}
      <div className="mt-12 p-8 bg-gradient-to-r from-blue-900/30 to-purple-900/30 rounded-2xl border border-blue-500/20 text-center">
        <h3 className="text-2xl font-bold mb-4">Stay Updated with Market Insights</h3>
        <p className="text-zinc-400 mb-6 max-w-xl mx-auto">
          Get weekly trading guides, market analysis, and exclusive content delivered to your inbox.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
          <input
            type="email"
            placeholder="Enter your email"
            className="flex-1 px-4 py-3 bg-zinc-900 border border-zinc-800 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:border-blue-500"
          />
          <button className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-lg transition">
            Subscribe
          </button>
        </div>
        <p className="text-xs text-zinc-500 mt-4">
          No spam. Unsubscribe anytime.
        </p>
      </div>
    </div>
  );
}