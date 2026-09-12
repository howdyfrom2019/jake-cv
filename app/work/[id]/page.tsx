import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { WorkDetail } from '@/components/work-detail'
import { getCv } from '@/lib/data'

type Params = { params: Promise<{ id: string }> }

export function generateStaticParams() {
  return getCv('en').experiences.map((e) => ({ id: e.id }))
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { id } = await params
  const e = getCv('en').experiences.find((x) => x.id === id)
  return { title: e ? `${e.company} · ${e.role}` : 'Work' }
}

export default async function Page({ params }: Params) {
  const { id } = await params
  if (!getCv('en').experiences.some((e) => e.id === id)) notFound()
  return <WorkDetail locale="en" id={id} />
}
