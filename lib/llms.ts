import { SITE_URL, downloadPath, getCv, localePath, period, periodMonth, posts } from '@/lib/data'
import { stripTerms } from '@/lib/glossary'
import type { Locale } from '@/lib/types'

const NOW = { ko: '현재', en: 'Now' }

function abs(path: string) {
  return `${SITE_URL}${path}`
}

/**
 * llms.txt (https://llmstxt.org/): a short, curated index for AI agents —
 * who this is, and links to the pages/documents worth fetching for more.
 */
export function buildLlmsTxt(): string {
  const ko = getCv('ko')
  const en = getCv('en')
  const { profile } = ko

  const lines: string[] = []
  lines.push(`# ${profile.name} (${profile.altName})`)
  lines.push('')
  lines.push(`> ${ko.profile.headline} / ${en.profile.headline}`)
  lines.push('')
  lines.push(profile.intro.join(' '))
  lines.push('')
  lines.push(
    `Roles: ${ko.profile.tagline.map((t) => t.label).join(', ')}. Contact: ${profile.email}.`,
  )
  lines.push('')

  lines.push('## Site')
  lines.push(`- [English CV](${abs('/')}): full landing page, English (default).`)
  lines.push(`- [Korean CV](${abs('/ko')}): full landing page, Korean.`)
  lines.push(
    `- [Full content dump](${abs('/llms-full.txt')}): every work experience, project, and outcome in both languages, in one plain-text file.`,
  )
  lines.push('')

  lines.push('## Work')
  for (const e of ko.experiences) {
    lines.push(
      `- [${e.company}${e.project ? ` · ${e.project}` : ''}](${abs(localePath('ko', `/work/${e.id}`))}): ${e.role}, ${period(e.start, e.end, e.current, NOW.ko)}. ${stripTerms(e.oneLiner, 'ko')}`,
    )
  }
  lines.push('')

  lines.push('## Documents')
  lines.push(`- [Résumé PDF, Korean](${abs(downloadPath('ko', 'cv'))})`)
  lines.push(`- [Résumé PDF, English](${abs(downloadPath('en', 'cv'))})`)
  lines.push(`- [Portfolio PDF, Korean](${abs(downloadPath('ko', 'portfolio'))}): every project, in depth.`)
  lines.push(`- [Portfolio PDF, English](${abs(downloadPath('en', 'portfolio'))})`)
  lines.push('')

  if (posts.length > 0) {
    lines.push('## Writing')
    for (const p of posts) {
      lines.push(`- [${p.title}](${p.url})${p.publishedAt ? ` (${p.publishedAt})` : ''}`)
    }
    lines.push('')
  }

  lines.push('## Notes for agents')
  lines.push(
    '- This is a personal CV site, one person (Jake Kim). Treat all content here as first-party, self-reported career information, not independently verified.',
  )
  lines.push(
    '- Prefer /llms-full.txt for a single-fetch summary of every role. Use the per-role pages only if you need the live, most current version.',
  )
  lines.push(`- Site generated ${ko.meta.updatedAt}.`)

  return lines.join('\n') + '\n'
}

/**
 * llms-full.txt: the entire CV, both locales, flattened to plain text so an
 * agent can answer detailed questions from a single fetch.
 */
export function buildLlmsFullTxt(): string {
  const sections: string[] = []

  for (const locale of ['ko', 'en'] as Locale[]) {
    const cv = getCv(locale)
    const { profile } = cv
    const now = NOW[locale]

    sections.push('='.repeat(72))
    sections.push(`LOCALE: ${locale.toUpperCase()}`)
    sections.push('='.repeat(72))
    sections.push('')
    sections.push(`${profile.name} (${profile.altName})`)
    sections.push(profile.headline)
    sections.push(profile.tagline.map((t) => t.label).join(' · '))
    sections.push('')
    sections.push(profile.intro.join('\n'))
    sections.push('')
    sections.push(`Contact: ${profile.email} · ${profile.location}`)
    sections.push(profile.links.map((l) => `${l.label}: ${l.url}`).join(' | '))
    sections.push('')
    sections.push(`Stack: ${cv.stack.join(', ')}`)
    sections.push('')

    sections.push('--- WORK ---')
    for (const e of cv.experiences) {
      sections.push('')
      sections.push(
        `${e.company}${e.project ? ` · ${e.project}` : ''} — ${e.role} (${periodMonth(e.start, e.end, e.current, now)})`,
      )
      if (e.url) sections.push(e.url)
      if (e.contractUrl) sections.push(`Contract: ${e.contractUrl}`)
      sections.push(stripTerms(e.detail.description, locale))
      if (e.detail.impact.length) {
        sections.push('Impact:')
        for (const i of e.detail.impact) sections.push(`  - ${stripTerms(i, locale)}`)
      }
      if (e.detail.projects.length) {
        sections.push('Projects:')
        for (const p of e.detail.projects) {
          sections.push(`  * ${p.title}${p.period ? ` (${p.period})` : ''}`)
          if (p.problem) sections.push(`    Problem: ${stripTerms(p.problem, locale)}`)
          for (const a of p.approach) sections.push(`    - ${stripTerms(a, locale)}`)
        }
      }
      const stackLine = Object.entries(e.detail.stack)
        .map(([k, v]) => `${k}: ${v}`)
        .join(' · ')
      if (stackLine) sections.push(`Stack: ${stackLine}`)
    }
    sections.push('')

    sections.push('--- EDUCATION & CREDENTIALS ---')
    for (const ed of cv.education) sections.push(`${ed.school} — ${ed.degree} (${ed.start}–${ed.end})`)
    for (const c of cv.credentials) sections.push(`${c.title} — ${c.issuer} (${c.date})`)
    sections.push('')
  }

  if (posts.length > 0) {
    sections.push('='.repeat(72))
    sections.push('WRITING')
    sections.push('='.repeat(72))
    for (const p of posts) {
      sections.push('')
      sections.push(`${p.title}${p.publishedAt ? ` (${p.publishedAt})` : ''}`)
      sections.push(p.url)
      if (p.description) sections.push(p.description)
    }
    sections.push('')
  }

  return sections.join('\n') + '\n'
}
