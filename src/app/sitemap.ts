import type { MetadataRoute } from 'next'
import { getAllDocs } from '@/lib/docs'

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://sanghel-playbook.vercel.app'

export default function sitemap(): MetadataRoute.Sitemap {
  const docs = getAllDocs()

  const docUrls = docs.map((doc) => ({
    url: `${BASE_URL}/docs/${doc.slug.join('/')}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }))

  return [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 1,
    },
    ...docUrls,
  ]
}
