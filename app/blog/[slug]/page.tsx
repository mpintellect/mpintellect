// app/blog/[slug]/page.tsx
import { notFound } from 'next/navigation';
import { blogPosts } from '../../lib/blogPosts';
import Link from 'next/link';

type Params = Promise<{ slug: string }>;

export default async function BlogPostPage({
  params,
}: {
  params: Params;
}) {
  const { slug } = await params;              // 👈 Next 15: await params
  const post = blogPosts.find((p) => p.slug === slug);

  if (!post) notFound();                      // throws 404

  return (
    <main className="blog-article-wrapper">
      {/* Top Back Button */}
      <Link href="/blog" className="back-btn">← Back to Blog</Link>

      <h1 className="text-4xl font-bold text-white mb-6">{post.title}</h1>

      <article
        className="text-gray-300 leading-relaxed"
        dangerouslySetInnerHTML={{ __html: post.content }}
      />

      {/* Bottom Back Button */}
      <Link href="/blog" className="back-btn mt-10">← Back to Blog</Link>
    </main>
  );
}