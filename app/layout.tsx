import type { Metadata } from 'next'
import { SITE_URL, getCv } from '@/lib/data'
import './globals.css'

const en = getCv('en')

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: 'Jake Kim', template: '%s · Jake Kim' },
  description: en.profile.headline,
  openGraph: { siteName: 'Jake Kim', type: 'website' },
  twitter: { card: 'summary', creator: '@b_cryptojake' },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable-dynamic-subset.min.css"
        />
        <link rel="llms.txt" href="/llms.txt" />
      </head>
      <body>{children}</body>
    </html>
  )
}
