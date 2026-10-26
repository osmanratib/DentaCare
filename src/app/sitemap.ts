import { MetadataRoute } from 'next'
import { CLINIC_SERVICES, BLOG_POSTS } from '@/lib/data/mockData'

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://dentacare.vercel.app'
  const currentDate = new Date().toISOString()

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${siteUrl}`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 1.0,
    },
    {
      url: `${siteUrl}/services`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${siteUrl}/smile-gallery`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${siteUrl}/team`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${siteUrl}/pricing`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${siteUrl}/blog`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${siteUrl}/contact`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${siteUrl}/book`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
  ]

  const serviceRoutes: MetadataRoute.Sitemap = CLINIC_SERVICES.map((s) => ({
    url: `${siteUrl}/services/${s.slug}`,
    lastModified: currentDate,
    changeFrequency: 'weekly',
    priority: 0.85,
  }))

  const blogRoutes: MetadataRoute.Sitemap = BLOG_POSTS.map((b) => ({
    url: `${siteUrl}/blog/${b.slug}`,
    lastModified: b.publishedAt,
    changeFrequency: 'monthly',
    priority: 0.75,
  }))

  return [...staticRoutes, ...serviceRoutes, ...blogRoutes]
}
