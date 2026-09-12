import { Term } from '@/components/glossary-panel'
import { PriceHover } from '@/components/price-hover'
import { PRICE_RE, TERM_RE, termLabel } from '@/lib/glossary'
import type { Locale } from '@/lib/types'

const ANY_RE = new RegExp(`${TERM_RE.source}|${PRICE_RE.source}`, 'g')

/**
 * Renders a content string, turning [[id]] / [[id|label]] into clickable
 * glossary terms and {{price:..|label}} / {{basket:..|label}} into live-price
 * hovercards. Server component; Term and PriceHover are client islands.
 */
export function RichText({ text, locale }: { text: string; locale: Locale }) {
  const parts: React.ReactNode[] = []
  let last = 0
  for (const m of text.matchAll(ANY_RE)) {
    const idx = m.index ?? 0
    if (idx > last) parts.push(text.slice(last, idx))
    const [, termId, termLabelOverride, kind, spec, priceLabel] = m
    if (termId) {
      parts.push(
        <Term key={`t-${idx}`} id={termId}>
          {termLabel(termId, locale, termLabelOverride)}
        </Term>,
      )
    } else {
      parts.push(
        <PriceHover key={`p-${idx}`} kind={kind as 'price' | 'basket'} spec={spec} locale={locale}>
          {priceLabel}
        </PriceHover>,
      )
    }
    last = idx + m[0].length
  }
  if (last < text.length) parts.push(text.slice(last))
  return <>{parts}</>
}
