import { getRemoteBlogPosts } from '@/app/lib/blog-data';
import BlogListing from '@/components/BlogListing';

export const dynamic = 'force-static';

export default async function BlogHub() {
  const posts = await getRemoteBlogPosts();

  return (
    <main className="blog-hub">
      <div className="blog-container">
        <div className="blog-header">
          <h1>_BLOG</h1>
          <p>Strategic Market Insights & Education</p>
        </div>
        
        <BlogListing initialPosts={posts} />
      </div>
    </main>
  );
}