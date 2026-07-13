import { MetadataRoute } from 'next';
import { WORKS } from '@/data/ienazo/works';

const BASE_URL = 'https://nunomaru-lab.com';

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  // 家謎（ienazo）の公開作品ページ（準備中は除外・プレイゲートは noindex なので載せない）。
  const ienazoWorks = WORKS.filter((w) => !w.comingSoon).map((w) => ({
    url: `${BASE_URL}/ienazo/works/${w.slug}`,
    lastModified: now,
    changeFrequency: 'monthly' as const,
    priority: w.type === 'paid' ? 0.9 : 0.8,
  }));

  return [
    { url: BASE_URL, lastModified: now, changeFrequency: 'weekly', priority: 1.0 },
    { url: `${BASE_URL}/ienazo`, lastModified: now, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${BASE_URL}/ienazo/works`, lastModified: now, changeFrequency: 'weekly', priority: 0.8 },
    ...ienazoWorks,
    { url: `${BASE_URL}/ienazo/howto`, lastModified: now, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${BASE_URL}/ienazo/faq`, lastModified: now, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${BASE_URL}/contents/harassment-type`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE_URL}/privacy`, lastModified: now, changeFrequency: 'yearly', priority: 0.3 },
  ];
}
