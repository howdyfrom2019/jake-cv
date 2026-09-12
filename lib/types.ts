export type Locale = 'ko' | 'en'

export type Link = { type: string; label: string; url: string }

export type Profile = {
  name: string
  altName: string
  headline: string
  intro: string[]
  tagline: { label: string; href: string }[]
  email: string
  location: string
  links: Link[]
}

export type Project = {
  title: string
  period?: string
  problem?: string
  approach: string[]
}

export type Experience = {
  id: string
  company: string
  project?: string
  url?: string
  contractUrl?: string
  role: string
  start: string
  end: string | null
  current: boolean
  compact?: boolean
  oneLiner: string
  bullets: string[]
  detail: {
    description: string
    employmentNote?: string
    impact: string[]
    projects: Project[]
    stack: Record<string, string>
  }
}

export type CV = {
  meta: { version: string; updatedAt: string }
  profile: Profile
  stack: string[]
  experiences: Experience[]
  education: { school: string; degree: string; start: string; end: string }[]
  credentials: { title: string; issuer: string; date: string }[]
}

export type UI = {
  works: string
  writing: string
  education: string
  stack: string
  download: string
  cvPdf: string
  portfolioPdf: string
  details: string
  back: string
  now: string
  impact: string
  projects: string
  problem: string
  earlier: string
  updated: string
  langSwitch: string
  langHref: string
  otherLocale: Locale
  cvTitle: string
  portfolioTitle: string
  noPosts: string
}

export type PostSource = 'naver' | 'tistory' | 'paragraph' | 'medium' | 'velog' | 'brunch' | 'other'

export type Post = {
  id: string
  url: string
  source: PostSource
  title: string
  description?: string | null
  image?: string | null
  publishedAt?: string | null
  tags?: string[]
  featured?: boolean
  lang?: Locale
}
