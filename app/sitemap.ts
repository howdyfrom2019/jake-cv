import type { MetadataRoute } from 'next'
import { LOCALES, SITE_URL, getCv, localePath } from '@/lib/data'

export default function sitemap(): MetadataRoute.Sitemap {
  const entries: MetadataRoute.Sitemap = []
  for (const locale of LOCALES) {
    entries.push({ url: `${SITE_URL}${localePath(locale, '/')}` })
    for (const e of getCv(locale).experiences) {
      entries.push({ url: `${SITE_URL}${localePath(locale, `/work/${e.id}`)}` })
    }
  }
  return entries
}
