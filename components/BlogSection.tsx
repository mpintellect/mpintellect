'use client';

import Link from 'next/link';

const blogPosts = [
  {
    title: 'What is Lot Size in Forex? A Simple Guide',
    slug: 'lot-size-guide',
    date: '16.06.2025',
    image: 'https://i.postimg.cc/mD48SH06/ssimage.png',
    description:
      'Understanding lot size is key to controlling your trade risk and reward. This guide breaks down standard, mini, and micro lots.',
  },
  {
    title: 'How to Use Stop Loss & Take Profit Like a Pro',
    slug: 'stop-loss-take-profit',
    date: '16.06.2025',
    image: 'https://i.postimg.cc/YCQKSpRM/imastge.png',
    description:
      'SL and TP are your best friends in trading. Learn how to use them to lock profits and limit risk like a professional.',
  },
  {
    title: 'Middle East Tensions: How It Impacts Gold, Oil, and Forex',
    slug: 'middle-east-tensions',
    date: '17.06.2025',
    image: 'https://i.postimg.cc/c4t4Qt0S/imftfttage.png',
    description:
      'Israel–Iran tensions are shaking the markets. Here’s how this geopolitical crisis affects commodities and currencies.',
  },
  {
    title: 'توتّرات إيران–إسرائيل: تأثير مباشر على النفط والذهب اليوم',
    slug: 'iran-israel-tensions-ar',
    date: '17.06.2025 23:33',
    image: 'https://i.postimg.cc/c4t4Qt0S/imftfttage.png',
    description: 'تحليل معمّق للحظة الأهم في التوترات الجيوسياسية الحالية: كيف يتفاعل سوق النفط والذهب مع تطورات ما قبل منتصف الليل.',
    lang: 'ar',
  },
  {
    title: 'تحليل استراتيجي: موانئ إيران النفطية وتأثيرها العالمي',
    slug: 'iran-ports-analysis-ar',
    date: '18.06.2025 00:28',
    image: 'https://i.postimg.cc/RVFDWw1M/imaawfscge.png',
    description: 'مضيق هرمز ليس وحده في الصورة – جزيرة خارك قد تكون مفتاح الأزمة القادمة في أسعار النفط العالمية.',
    lang: 'ar',
  }
];

export default function BlogSection() {
  return (
    <section id="blog" className="w-full bg-black py-20 px-6">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-white text-center mb-12">
          📚 Latest Blog Insights
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
         {blogPosts.map((post) => {
  console.log('Rendered post slug:', post.slug); // ← ADD THIS HERE

  return (
    <div key={post.slug} className="blog-card">
      <img src={post.image} alt={post.title} />
      <h3 className="blog-card-title">{post.title}</h3>
      <p className="blog-card-desc">{post.description}</p>

      <div className="blog-card-footer">
        <span>{post.date}</span>
        <Link href={`/blog/${post.slug}`} className="blog-card-btn">
          Read More →
        </Link>
      </div>
    </div>
  );
})}
        </div>
      </div>
    </section>
  );
}