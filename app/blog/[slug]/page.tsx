import { notFound } from 'next/navigation';
import { blogPosts } from '@/lib/blogPosts';
import Link from 'next/link';
import type { Metadata } from 'next';

type Params = Promise<{ slug: string }>;

// Generate static params for all blog posts
export async function generateStaticParams() {
  return blogPosts.map((post) => ({
    slug: post.slug,
  }));
}

// Add this for Cloudflare static export
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
    description: post.description || post.content.substring(0, 160),
    openGraph: {
      title: post.title,
      description: post.description || post.content.substring(0, 160),
      type: 'article',
      publishedTime: post.date,
      authors: [post.author || 'MZPrimer'],
      tags: post.tags || [],
      images: post.image ? [
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
      description: post.description || post.content.substring(0, 160),
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

  // Format the date nicely
  const formattedDate = new Date(post.date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

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
        {/* Featured Image */}
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
          
          {post.author && (
            <div className="flex items-center gap-2">
              <span className="text-zinc-600">👤</span>
              <span>{post.author}</span>
            </div>
          )}
          
          {post.readTime && (
            <div className="flex items-center gap-2">
              <span className="text-zinc-600">⏱️</span>
              <span>{post.readTime} min read</span>
            </div>
          )}
          
          {post.lang && (
            <div className="flex items-center gap-2">
              <span className="text-zinc-600">🌐</span>
              <span className="uppercase">{post.lang}</span>
            </div>
          )}
        </div>

        {/* Tags */}
        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-8">
            {post.tags.map((tag: string) => (
              <span 
                key={tag}
                className="px-3 py-1 bg-zinc-800 text-zinc-300 rounded-full text-xs"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
        
        {/* Description/Excerpt */}
        {post.description && (
          <div className="text-lg text-zinc-300 italic border-l-4 border-blue-500 pl-4 py-2 mb-8">
            {post.description}
          </div>
        )}
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
            "datePublished": post.date,
            "dateModified": post.date,
            "author": {
              "@type": "Person",
              "name": post.author || "MZPrimer",
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