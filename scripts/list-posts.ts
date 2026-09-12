import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'

const db = JSON.parse(readFileSync(resolve(import.meta.dir, '../data/posts.json'), 'utf8')) as {
  posts: { source: string; title: string; url: string; publishedAt: string | null; sample?: boolean }[]
}

for (const p of db.posts) {
  console.log(`${p.publishedAt ?? '----------'}  [${p.source.padEnd(9)}] ${p.sample ? '(sample) ' : ''}${p.title}`)
  console.log(`            ${p.url}`)
}
console.log(`\n${db.posts.length} post(s)`)
