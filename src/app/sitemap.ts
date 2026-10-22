import type { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const rawBaseUrl = process.env.NEXT_PUBLIC_APP_URL || process.env.VERCEL_URL || 'https://beatsbazaar.com';
  const baseUrl = rawBaseUrl.startsWith('http://') || rawBaseUrl.startsWith('https://')
    ? rawBaseUrl.replace(/\/+$/, '')
    : `https://${rawBaseUrl.replace(/\/+$/, '')}`;

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
  ];
}
