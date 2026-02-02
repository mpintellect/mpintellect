import { notFound } from 'next/navigation';
import { blogPosts } from '@/app/lib/blogPosts';
import Link from 'next/link';
import type { Metadata } from 'next';

type Params = Promise<{ slug: string }>;

// Generate static params for all blog posts
export async function generateStaticParams() {
  return blogPosts.map((post) => ({
    slug: post.slug,
  }));
}

export const dynamic = 'force-static';

// Generate metadata for each blog post
export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = blogPosts.find((p) => p.slug === slug);

  if (!post) {
    return {
      title: 'Blog Post Not Found - MZPrimer',
      description: 'This blog article could not be found.',
    };
  }

  return {
    title: `${post.title} - MZPrimer Blog`,
    description: post.description,
    openGraph: {
      title: post.title,
      description: post.description,
      type: 'article',
      publishedTime: post.date, // Will be undefined if missing
      authors: ['MZPrimer'],
      images: post.image ? [ // Optional check
        {
          url: `https://mzprimer.com${post.image}`,
          width: 1200,
          height: 630,
          alt: post.title,
        }
      ] : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.description,
      images: post.image ? [`https://mzprimer.com${post.image}`] : undefined,
    },
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Params;
}) {
  const { slug } = await params;
  const post = blogPosts.find((p) => p.slug === slug);

  if (!post) notFound();

  // Format the date if it exists, otherwise use "Recent"
  const formattedDate = post.date 
    ? new Date(post.date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : 'Recent';

  // Calculate read time based on content length
  const getReadTime = (content: string) => {
    const wordCount = content.split(/\s+/).length;
    const wordsPerMinute = 200;
    return Math.max(1, Math.ceil(wordCount / wordsPerMinute));
  };

  // Get language label if exists
  const getLanguageLabel = (lang?: 'en' | 'ar') => {
    if (!lang) return 'English'; // Default
    return lang === 'en' ? 'English' : 'العربية';
  };

  return (
    <main className="max-w-4xl mx-auto px-4 py-12 bg-black text-white min-h-screen">
      {/* Navigation */}
      <div className="mb-8">
        <Link 
          href="/blog" 
          className="text-blue-400 hover:text-blue-300 text-sm font-medium flex items-center gap-2"
        >
          ← Back to Blog
        </Link>
      </div>

      {/* Article Header */}
      <header className="mb-10">
        {/* Featured Image if exists */}
        {post.image && (
          <div className="mb-8 rounded-xl overflow-hidden">
            <img 
              src={post.image} 
              alt={post.title}
              className="w-full h-64 object-cover"
            />
          </div>
        )}

        <h1 className="text-4xl md:text-5xl font-black mb-6 leading-tight">{post.title}</h1>
        
        {/* Meta info */}
        <div className="flex flex-wrap gap-4 text-sm text-zinc-500 mb-8">
          <div className="flex items-center gap-2">
            <span className="text-zinc-600">📅</span>
            <span>{formattedDate}</span>
          </div>
          
          {/* Author - using default */}
          <div className="flex items-center gap-2">
            <span className="text-zinc-600">👤</span>
            <span>MZPrimer Team</span>
          </div>
          
          {/* Read time - calculated */}
          <div className="flex items-center gap-2">
            <span className="text-zinc-600">⏱️</span>
            <span>{getReadTime(post.content)} min read</span>
          </div>
          
          {/* Language if exists */}
          {post.lang && (
            <div className="flex items-center gap-2">
              <span className="text-zinc-600">🌐</span>
              <span className="uppercase">{getLanguageLabel(post.lang)}</span>
            </div>
          )}
        </div>

        {/* Description */}
        <div className="text-lg text-zinc-300 italic border-l-4 border-blue-500 pl-4 py-2 mb-8">
          {post.description}
        </div>
      </header>

      {/* Article Content */}
      <article
        className="prose prose-invert prose-lg max-w-none"
        dangerouslySetInnerHTML={{ __html: post.content }}
      />

      {/* CTA Section */}
      <div className="mt-12 pt-8 border-t border-zinc-800">
        <h3 className="text-xl font-bold mb-4">Enjoyed this article?</h3>
        <p className="text-zinc-400 mb-6">
          Check out more trading guides and market analysis.
        </p>
        <Link
          href="/blog"
          className="inline-block bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 px-6 rounded-full transition"
        >
          Explore More Articles →
        </Link>
      </div>

      {/* Schema.org markup for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BlogPosting",
            "headline": post.title,
            "description": post.description,
            "datePublished": post.date || new Date().toISOString(),
            "dateModified": post.date || new Date().toISOString(),
            "author": {
              "@type": "Person",
              "name": "MZPrimer Team",
            },
            "publisher": {
              "@type": "Organization",
              "name": "MZPrimer",
              "logo": {
                "@type": "ImageObject",
                "url": "https://mzprimer.com/logo.png"
              }
            },
            "image": post.image ? `https://mzprimer.com${post.image}` : undefined,
            "mainEntityOfPage": {
              "@type": "WebPage",
              "@id": `https://mzprimer.com/blog/${post.slug}`
            }
          })
        }}
      />
    </main>
  );
}