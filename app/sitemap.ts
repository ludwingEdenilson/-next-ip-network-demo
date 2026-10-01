import type { MetadataRoute } from 'next'

const siteUrl = 'https://nextip.network'

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: siteUrl, changeFrequency: 'weekly', priority: 1 },
    { url: `${siteUrl}/planes`, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${siteUrl}/contacto`, changeFrequency: 'monthly', priority: 0.7 },
  ]
}