import Link from 'next/link'
import { Icon } from '@/components/icons'
import { PrintDoc } from '@/components/print-doc'
import { downloadPath, getUi, localePath } from '@/lib/data'
import type { Locale } from '@/lib/types'

export function DocPreview({ locale, kind }: { locale: Locale; kind: 'cv' | 'portfolio' }) {
  const ui = getUi(locale)
  const title = kind === 'cv' ? ui.cvTitle : ui.portfolioTitle
  const file = downloadPath(locale, kind)
  const other = localePath(ui.otherLocale, `/preview/${kind}`)

  return (
    <div className="min-h-dvh">
      <div className="sticky top-0 z-40 border-b border-line bg-bg/90 backdrop-blur">
        <div className="mx-auto flex max-w-[820px] flex-wrap items-center justify-between gap-x-4 gap-y-2 px-4 py-3 text-sm">
          <div className="flex items-center gap-4">
            <Link href={localePath(locale, '/')} className="text-dim hover:text-fg">
              ← {ui.back}
            </Link>
            <span className="font-medium">{title}</span>
            <span className="hidden text-xs text-dim sm:inline">{ui.previewHint}</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href={other} lang={ui.otherLocale} className="text-dim hover:text-fg">
              {ui.langSwitch}
            </Link>
            <a
              href={file}
              download
              className="inline-flex items-center gap-1.5 rounded-full bg-key px-4 py-1.5 font-medium text-bg hover:opacity-90"
            >
              <Icon type="download" /> {ui.downloadPdf}
            </a>
          </div>
        </div>
      </div>
      <div className="overflow-x-auto px-3 py-6 sm:px-6 sm:py-10">
        <div className="mx-auto w-[820px] rounded-md bg-white p-12 shadow-2xl">
          <PrintDoc locale={locale} kind={kind} />
        </div>
      </div>
    </div>
  )
}
