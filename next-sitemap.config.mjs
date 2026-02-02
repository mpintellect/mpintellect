/** @type {import('next-sitemap').IConfig} */
const siteUrl = 'https://mzprimer.com';

export default {
  siteUrl,
  generateRobotsTxt: true,
  changefreq: 'daily',
  priority: 0.7,
  sitemapSize: 5000,
  exclude: ['/admin/*'],
  robotsTxtOptions: {
    policies: [
      { userAgent: '*', allow: '/' },
      { userAgent: '*', disallow: ['/admin'] },
    ],
  },
};