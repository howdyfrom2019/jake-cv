import glossaryJson from '@/data/glossary.json'
import type { Locale } from '@/lib/types'

export type GlossaryEntry = {
  term: Record<Locale, string>
  ko: string
  en: string
  related?: string[]
}

export const glossary = glossaryJson as Record<string, GlossaryEntry>

/** Matches [[id]] or [[id|display text]] inside content strings. */
export const TERM_RE = /\[\[([a-z0-9-]+)(?:\|([^\]]+))?\]\]/g

export function termLabel(id: string, locale: Locale, override?: string) {
  if (override) return override
  return glossary[id]?.term[locale] ?? id
}

/** Plain text with term markers replaced by their display label. */
export function stripTerms(text: string, locale: Locale) {
  return text.replace(TERM_RE, (_, id: string, label?: string) => termLabel(id, locale, label))
}

/** Every glossary id referenced in the given strings, in first-seen order. */
export function collectTerms(texts: string[]) {
  const seen = new Set<string>()
  for (const t of texts) {
    for (const m of t.matchAll(TERM_RE)) {
      if (glossary[m[1]]) seen.add(m[1])
    }
  }
  return Array.from(seen)
}
