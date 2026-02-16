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
    // Cache buster included to ensure build gets latest data
    const res = await fetch(`${R2_BLOG_URL}?t=${Date.now()}`, {
      next: { revalidate: 0 } // Ensures fresh data during build
    });
    if (!res.ok) throw new Error("R2 Blog Feed Offline");
    return await res.json();
  } catch (e) {
    console.error("Critical Blog Fetch Error:", e);
    return [];
  }
}