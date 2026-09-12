import { notFound } from 'next/navigation'
import { PrintDoc } from '@/components/print-doc'
import { LOCALES } from '@/lib/data'
import type { Locale } from '@/lib/types'

const KINDS = ['cv', 'portfolio'] as const

type Params = { params: Promise<{ locale: string; kind: string }> }

export function generateStaticParams() {
  return LOCALES.flatMap((locale) => KINDS.map((kind) => ({ locale, kind })))
}

export const metadata = { robots: { index: false } }

export default async function Page({ params }: Params) {
  const { locale, kind } = await params
  if (!LOCALES.includes(locale as Locale) || !KINDS.includes(kind as (typeof KINDS)[number])) notFound()
  return <PrintDoc locale={locale as Locale} kind={kind as 'cv' | 'portfolio'} />
}
