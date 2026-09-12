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

/** Matches {{price:SYM:amount|label}} and {{basket:SYM=amt,SYM=amt|label}}. */
export const PRICE_RE = /\{\{(price|basket):([^|}]+)\|([^}]+)\}\}/g

export function termLabel(id: string, locale: Locale, override?: string) {
  if (override) return override
  return glossary[id]?.term[locale] ?? id
}

/** Plain text with term and price markers replaced by their display labels. */
export function stripTerms(text: string, locale: Locale) {
  return text
    .replace(TERM_RE, (_, id: string, label?: string) => termLabel(id, locale, label))
    .replace(PRICE_RE, (_, _kind: string, _spec: string, label: string) => label)
}

/** Plain text with only term markers replaced; price markers are kept. */
export function stripTermTokens(text: string, locale: Locale) {
  return text.replace(TERM_RE, (_, id: string, label?: string) => termLabel(id, locale, label))
}

/**
 * Keep each glossary term clickable only where it first appears. Walks the
 * strings in reading order and turns repeated [[id]] markers into plain labels,
 * so a page explains a term once instead of underlining it everywhere.
 */
export function firstOccurrenceOnly(texts: string[], locale: Locale, seen = new Set<string>()) {
  return texts.map((t) =>
    t.replace(TERM_RE, (whole, id: string, label?: string) => {
      if (seen.has(id)) return termLabel(id, locale, label)
      seen.add(id)
      return whole
    }),
  )
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
