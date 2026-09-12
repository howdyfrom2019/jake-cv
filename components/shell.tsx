import Link from 'next/link'
import { getUi, localePath } from '@/lib/data'
import type { Locale } from '@/lib/types'

export function Shell({
  locale,
  children,
  backHref,
}: {
  locale: Locale
  children: React.ReactNode
  backHref?: string
}) {
  const ui = getUi(locale)
  const switchHref = backHref
    ? localePath(ui.otherLocale, backHref)
    : ui.langHref
  return (
    <div className="mx-auto max-w-[640px] px-6 pb-24 pt-10 sm:pt-16">
      <div className="mb-10 flex items-center justify-between text-sm text-dim">
        {backHref !== undefined ? (
          <Link href={localePath(locale, '/')} className="hover:text-fg">
            ← {ui.back}
          </Link>
        ) : (
          <span />
        )}
        <Link href={switchHref} lang={ui.otherLocale} className="tracking-wide hover:text-fg">
          {ui.langSwitch}
        </Link>
      </div>
      {children}
    </div>
  )
}
