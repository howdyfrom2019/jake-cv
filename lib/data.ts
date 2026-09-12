import cvEn from '@/data/cv.en.json'
import cvKo from '@/data/cv.ko.json'
import postsJson from '@/data/posts.json'
import uiJson from '@/data/ui.json'
import type { CV, Locale, Post, PostSource, UI } from '@/lib/types'

export const SITE_URL = 'https://jake-cv.vercel.app'
export const LOCALES: Locale[] = ['ko', 'en']

export function getCv(locale: Locale): CV {
  return (locale === 'en' ? cvEn : cvKo) as unknown as CV
}

export function getUi(locale: Locale): UI {
  return (uiJson as Record<Locale, UI>)[locale]
}

export function localePath(locale: Locale, path = '') {
  const base = locale === 'en' ? '/en' : ''
  return `${base}${path}` || '/'
}

export const posts: Post[] = (postsJson.posts as Post[])
  .slice()
  .sort((a, b) => (b.publishedAt ?? '').localeCompare(a.publishedAt ?? ''))

export const SOURCE_LABEL: Record<PostSource, string> = {
  naver: 'Naver',
  tistory: 'Tistory',
  paragraph: 'Paragraph',
  medium: 'Medium',
  velog: 'Velog',
  brunch: 'Brunch',
  other: 'Blog',
}

export function period(start: string, end: string | null, current: boolean, now: string) {
  const y = (d: string) => d.slice(0, 4)
  const to = current ? now : end ? y(end) : ''
  const from = y(start)
  if (!to || to === from) return from
  return `${from}–${to}`
}

export function periodMonth(start: string, end: string | null, current: boolean, now: string) {
  const f = (d: string) => d.replace('-', '.')
  return `${f(start)} – ${current ? now : end ? f(end) : ''}`
}

export function downloadPath(locale: Locale, kind: 'cv' | 'portfolio') {
  return `/downloads/jake-kim-${kind}-${locale}.pdf`
}
