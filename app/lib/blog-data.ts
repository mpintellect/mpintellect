// app/lib/blog-data.ts

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  date: string;
  description: string;
  category: string;
  content: string;
  image?: string;
  lang: 'en' | 'ar';
}

const R2_BLOG_URL = "https://data.mzprimer.com/blog.json";

export async function getRemoteBlogPosts(): Promise<BlogPost[]> {
  try {
    // ✅ FIX: Standard fetch for static export. 
    // Cloudflare build environment will fetch this once and distribute it to all static pages.
    const res = await fetch(R2_BLOG_URL, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      }
    });

    if (!res.ok) throw new Error("R2 Blog Feed Offline");
    return await res.json();
  } catch (e) {
    console.error("Critical Blog Fetch Error:", e);
    return [];
  }
}