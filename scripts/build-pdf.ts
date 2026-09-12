/**
 * Renders /print/{locale}/{cv|portfolio} to PDF with the system Chrome and
 * writes them to public/downloads. Run after `bun run build`:
 *
 *   bun run pdf
 *
 * Or point it at an already-running server:
 *
 *   BASE_URL=http://localhost:3000 bun scripts/build-pdf.ts
 */
import { spawn } from 'node:child_process'
import { mkdirSync } from 'node:fs'
import { resolve } from 'node:path'
import { chromium } from 'playwright-core'

const OUT = resolve(import.meta.dir, '../public/downloads')
const PORT = 3789
const LOCALES = ['ko', 'en'] as const
const KINDS = ['cv', 'portfolio'] as const

async function waitFor(url: string, ms = 20000) {
  const t0 = Date.now()
  while (Date.now() - t0 < ms) {
    try {
      const r = await fetch(url)
      if (r.ok) return
    } catch {}
    await new Promise((r) => setTimeout(r, 300))
  }
  throw new Error(`server did not come up at ${url}`)
}

async function main() {
  mkdirSync(OUT, { recursive: true })

  let server: ReturnType<typeof spawn> | null = null
  let base = process.env.BASE_URL
  if (!base) {
    base = `http://localhost:${PORT}`
    server = spawn('bun', ['run', 'start', '--', '-p', String(PORT)], {
      cwd: resolve(import.meta.dir, '..'),
      stdio: 'ignore',
    })
  }
  await waitFor(`${base}/print/ko/cv`)

  const browser = await chromium.launch({ channel: 'chrome', headless: true })
  try {
    const page = await browser.newPage()
    for (const locale of LOCALES) {
      for (const kind of KINDS) {
        const url = `${base}/print/${locale}/${kind}`
        await page.goto(url, { waitUntil: 'networkidle' })
        await page.evaluate(() => document.fonts.ready)
        const file = resolve(OUT, `jake-kim-${kind}-${locale}.pdf`)
        await page.pdf({
          path: file,
          format: 'A4',
          printBackground: true,
          preferCSSPageSize: true,
        })
        console.log(`✓ ${file.replace(process.cwd() + '/', '')}`)
      }
    }
  } finally {
    await browser.close()
    server?.kill()
  }
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
