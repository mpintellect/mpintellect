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

const R2_BLOG_URL = "https://data.mpintellect.com/blog.json";

export async function getRemoteBlogPosts(): Promise<BlogPost[]> {
  try {
    // ✅ 1. THE CACHE BUSTER:
    // We add a unique timestamp to the URL. This prevents Cloudflare's CDN 
    // from serving an old version of the file to the build server.
    const cacheBuster = `?t=${new Date().getTime()}`;
    
    // ✅ 2. THE FETCH INSTRUCTION:
    // 'no-store' tells Next.js: "Do not save this data in the build cache."
    const res = await fetch(`${R2_BLOG_URL}${cacheBuster}`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
      cache: 'no-store' 
    });

    if (!res.ok) throw new Error("R2 Blog Feed Offline");
    
    const data = await res.json();
    
    // ✅ 3. INSTITUTIONAL ORDERING:
    // We sort the results by date to ensure the newest intelligence is always at the top.
    return data.sort((a: BlogPost, b: BlogPost) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    );

  } catch (e) {
    console.error("Critical Blog Fetch Error:", e);
    return [];
  }
}