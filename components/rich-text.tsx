import { Term } from '@/components/glossary-panel'
import { TERM_RE, termLabel } from '@/lib/glossary'
import type { Locale } from '@/lib/types'

/**
 * Renders a content string, turning [[id]] / [[id|label]] markers into
 * clickable glossary terms. Server component; Term itself is a client island.
 */
export function RichText({ text, locale }: { text: string; locale: Locale }) {
  const parts: React.ReactNode[] = []
  let last = 0
  for (const m of text.matchAll(TERM_RE)) {
    const idx = m.index ?? 0
    if (idx > last) parts.push(text.slice(last, idx))
    const [, id, label] = m
    parts.push(
      <Term key={`${id}-${idx}`} id={id}>
        {termLabel(id, locale, label)}
      </Term>,
    )
    last = idx + m[0].length
  }
  if (last < text.length) parts.push(text.slice(last))
  return <>{parts}</>
}
