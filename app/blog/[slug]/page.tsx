import { notFound } from 'next/navigation';
import { blogPosts } from '../../lib/blogPosts';
import Link from 'next/link';

export default function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = blogPosts.find((p) => p.slug === params.slug);

  if (!post) return notFound();

  return (
    <main className="blog-article-wrapper">
      {/* Top Back Button */}
      <Link href="/blog">
        <button className="back-btn">← Back to Blog</button>
      </Link>

      <h1 className="text-4xl font-bold text-white mb-6">{post.title}</h1>

      <article
        className="text-gray-300 leading-relaxed"
        dangerouslySetInnerHTML={{ __html: post.content }}
      />

      {/* Bottom Back Button */}
      <Link href="/blog">
        <button className="back-btn mt-10">← Back to Blog</button>
      </Link>
    </main>
  );
}