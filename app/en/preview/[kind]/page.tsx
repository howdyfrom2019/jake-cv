import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { DocPreview } from '@/components/doc-preview'
import { getUi } from '@/lib/data'

const KINDS = ['cv', 'portfolio'] as const
type Kind = (typeof KINDS)[number]
type Params = { params: Promise<{ kind: string }> }

export function generateStaticParams() {
  return KINDS.map((kind) => ({ kind }))
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { kind } = await params
  const ui = getUi('en')
  return { title: kind === 'cv' ? ui.cvTitle : ui.portfolioTitle }
}

export default async function Page({ params }: Params) {
  const { kind } = await params
  if (!KINDS.includes(kind as Kind)) notFound()
  return <DocPreview locale="en" kind={kind as Kind} />
}
