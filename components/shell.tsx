import Link from 'next/link'
import { GlossaryProvider, GlossaryToggle } from '@/components/glossary-panel'
import { getUi, localePath } from '@/lib/data'
import type { Locale } from '@/lib/types'

export function Shell({
  locale,
  children,
  backHref,
  pageTerms,
}: {
  locale: Locale
  children: React.ReactNode
  backHref?: string
  pageTerms?: string[]
}) {
  const ui = getUi(locale)
  const switchHref = backHref
    ? localePath(ui.otherLocale, backHref)
    : ui.langHref
  return (
    <GlossaryProvider locale={locale} pageTerms={pageTerms}>
      <div className="mx-auto max-w-[640px] px-6 pb-24 pt-10 sm:pt-16">
        <div className="mb-10 flex items-center justify-between text-sm text-dim">
          {backHref !== undefined ? (
            <Link href={localePath(locale, '/')} className="hover:text-fg">
              ← {ui.back}
            </Link>
          ) : (
            <span />
          )}
          <div className="flex items-center gap-4">
            <GlossaryToggle />
            <Link href={switchHref} lang={ui.otherLocale} className="tracking-wide hover:text-fg">
              {ui.langSwitch}
            </Link>
          </div>
        </div>
        {children}
      </div>
    </GlossaryProvider>
  )
}
