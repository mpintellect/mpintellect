import { notFound } from 'next/navigation';
import { getRemoteBlogPosts } from '@/app/lib/blog-data';
import Link from 'next/link';

// ✅ This ensures Next.js knows exactly which paths to build
export async function generateStaticParams() {
  const posts = await getRemoteBlogPosts();
  return posts.map((p) => ({ slug: p.slug }));
}

// ✅ Keep this to ensure static behavior
export const dynamic = 'force-static';

export default async function BlogPostPage({ params }: any) {
  const { slug } = await params;
  const posts = await getRemoteBlogPosts();
  const post = posts.find((p) => p.slug === slug);

  if (!post) notFound();
  const isAr = post.lang === 'ar';

  return (
    <main className="blog-post" dir={isAr ? 'rtl' : 'ltr'}>
      <div className="blog-post-container">
        <Link href="/blog" className="blog-post-back-link">
          {isAr ? '← العودة للمدونة' : '← BACK TO HUB'}
        </Link>
        
        <header className="blog-post-header">
          <h1 className="blog-post-title">{post.title}</h1>
          <div className="blog-post-meta">
            <span className="blog-post-category">{post.category || 'INSIGHTS'}</span>
            <span className="blog-post-divider">•</span>
            <span>{post.date}</span>
          </div>
        </header>

        <article 
          className="blog-content prose-gold"
          dangerouslySetInnerHTML={{ __html: post.content }} 
        />
      </div>
    </main>
  );
}