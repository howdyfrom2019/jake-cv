import type { Metadata } from 'next'
import { Home } from '@/components/home'
import { getCv } from '@/lib/data'

export const metadata: Metadata = { description: getCv('ko').profile.headline }

export default function Page() {
  return <Home locale="ko" />
}
