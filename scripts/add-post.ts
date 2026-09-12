/**
 * 외부 블로그 글을 posts.json에 포워딩 등록한다.
 *
 *   bun post:add <URL> [--tags a,b] [--featured] [--title "..."] [--date YYYY-MM-DD]
 *
 * URL의 OG 메타데이터(제목/요약/썸네일/발행일)를 읽어 data/posts.json에 추가한다.
 * 네이버·티스토리·Paragraph·Medium·Velog·Brunch는 호스트로 source를 자동 판별한다.
 * 같은 URL이 이미 있으면 덮어쓴다.
 */
import { readFileSync, writeFileSync } from 'node:fs'
import { resolve } from 'node:path'

type Post = {
  id: string
  sample?: boolean
  url: string
  source: string
  title: string
  description: string | null
  image: string | null
  publishedAt: string | null
  tags: string[]
  featured: boolean
}

const FILE = resolve(import.meta.dir, '../data/posts.json')

function parseArgs(argv: string[]) {
  const [url, ...rest] = argv
  const opts: Record<string, string | boolean> = {}
  for (let i = 0; i < rest.length; i++) {
    const a = rest[i]
    if (!a.startsWith('--')) continue
    const key = a.slice(2)
    const next = rest[i + 1]
    if (!next || next.startsWith('--')) opts[key] = true
    else {
      opts[key] = next
      i++
    }
  }
  return { url, opts }
}

function detectSource(hostname: string): string {
  const h = hostname.toLowerCase()
  if (h.includes('naver.com')) return 'naver'
  if (h.includes('tistory.com')) return 'tistory'
  if (h.includes('paragraph.xyz') || h.includes('paragraph.com')) return 'paragraph'
  if (h.includes('medium.com')) return 'medium'
  if (h.includes('velog.io')) return 'velog'
  if (h.includes('brunch.co.kr')) return 'brunch'
  return 'other'
}

function meta(html: string, keys: string[]): string | null {
  for (const key of keys) {
    const re = new RegExp(
      `<meta[^>]+(?:property|name)=["']${key}["'][^>]+content=["']([^"']*)["']|<meta[^>]+content=["']([^"']*)["'][^>]+(?:property|name)=["']${key}["']`,
      'i',
    )
    const m = html.match(re)
    const v = (m?.[1] ?? m?.[2])?.trim()
    if (v) return decode(v)
  }
  return null
}

function decode(s: string) {
  return s
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
}

function slug(title: string, host: string) {
  const base = title
    .toLowerCase()
    .replace(/[^\p{L}\p{N}]+/gu, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 48)
  return `${host.split('.')[0]}-${base || Date.now()}`
}

async function fetchHtml(url: string) {
  const res = await fetch(url, {
    headers: {
      'user-agent': 'Mozilla/5.0 (compatible; jake-cv-post-forwarder/1.0; +https://github.com/howdyfrom2019)',
      accept: 'text/html,application/xhtml+xml',
    },
    redirect: 'follow',
  })
  if (!res.ok) throw new Error(`fetch failed: ${res.status} ${res.statusText}`)
  return res.text()
}

async function main() {
  const { url, opts } = parseArgs(process.argv.slice(2))
  if (!url || !/^https?:\/\//.test(url)) {
    console.error('usage: bun post:add <URL> [--tags a,b] [--featured] [--title "..."] [--date YYYY-MM-DD]')
    process.exit(1)
  }

  const u = new URL(url)
  const html = await fetchHtml(url).catch((e) => {
    console.warn(`! could not fetch page (${e.message}); falling back to manual fields`)
    return ''
  })

  const title =
    (typeof opts.title === 'string' && opts.title) ||
    meta(html, ['og:title', 'twitter:title']) ||
    html.match(/<title[^>]*>([^<]*)<\/title>/i)?.[1]?.trim() ||
    u.pathname
  const description = meta(html, ['og:description', 'twitter:description', 'description'])
  const image = meta(html, ['og:image', 'twitter:image'])
  const published =
    (typeof opts.date === 'string' && opts.date) ||
    meta(html, ['article:published_time', 'og:article:published_time', 'date', 'datePublished'])?.slice(0, 10) ||
    new Date().toISOString().slice(0, 10)

  const post: Post = {
    id: slug(title, u.hostname),
    url,
    source: detectSource(u.hostname),
    title: decode(title),
    description,
    image,
    publishedAt: published,
    tags: typeof opts.tags === 'string' ? opts.tags.split(',').map((t) => t.trim()).filter(Boolean) : [],
    featured: opts.featured === true,
  }

  const db = JSON.parse(readFileSync(FILE, 'utf8')) as { posts: Post[] }
  db.posts = db.posts.filter((p) => !p.sample && p.url !== url)
  db.posts.push(post)
  db.posts.sort((a, b) => (b.publishedAt ?? '').localeCompare(a.publishedAt ?? ''))
  writeFileSync(FILE, JSON.stringify(db, null, 2) + '\n')

  console.log(`✓ added [${post.source}] ${post.title}`)
  console.log(`  ${post.url}`)
  if (!description) console.log('  (no og:description found — edit data/posts.json to add a summary)')
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
