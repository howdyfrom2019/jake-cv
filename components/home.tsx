import Link from 'next/link'
import { Icon } from '@/components/icons'
import { RichText } from '@/components/rich-text'
import { Shell } from '@/components/shell'
import { SOURCE_LABEL, getCv, getUi, localePath, period, posts } from '@/lib/data'
import { firstOccurrenceOnly } from '@/lib/glossary'
import type { Locale } from '@/lib/types'

function H({ children }: { children: React.ReactNode }) {
  return <h2 className="h rule mb-6">{children}</h2>
}

export function Home({ locale }: { locale: Locale }) {
  const cv = getCv(locale)
  const ui = getUi(locale)
  const { profile } = cv
  const seen = new Set<string>()
  const dedupe = (e: (typeof cv.experiences)[number]) => {
    const [oneLiner, ...bullets] = firstOccurrenceOnly([e.oneLiner, ...e.bullets], locale, seen)
    return { ...e, oneLiner, bullets }
  }
  const main = cv.experiences.filter((e) => !e.compact).map(dedupe)
  const earlier = cv.experiences.filter((e) => e.compact).map(dedupe)

  return (
    <Shell locale={locale}>
      <header>
        <h1 className="text-[1.6rem] font-semibold tracking-tight">
          {profile.name} <span className="text-dim font-normal">{profile.altName}</span>
        </h1>
        <p className="mt-4 text-[1.05rem] leading-relaxed">{profile.headline}</p>
        <p className="mt-1 text-[1.05rem] leading-relaxed text-muted">
          {profile.tagline.map((t, i) => (
            <span key={t.label}>
              <a href={t.href} className="k u">
                {t.label}
              </a>
              {i < profile.tagline.length - 1 ? ' · ' : ''}
            </span>
          ))}
        </p>
        <div className="mt-4 space-y-3 text-[0.95rem] leading-relaxed text-muted">
          {profile.intro.map((p) => (
            <p key={p}>{p}</p>
          ))}
        </div>

        <div className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-3 text-muted">
          <a href={`mailto:${profile.email}`} aria-label="Email" className="hover:text-key">
            <Icon type="mail" />
          </a>
          {profile.links.map((l) => (
            <a key={l.type} href={l.url} target="_blank" rel="noreferrer" aria-label={l.label} className="hover:text-key">
              <Icon type={l.type} />
            </a>
          ))}
          <span className="mx-1 hidden h-4 w-px bg-line sm:block" />
          <Link href={localePath(locale, '/preview/cv')} className="u inline-flex items-center gap-1.5 text-sm hover:text-fg">
            <Icon type="doc" /> {ui.cvPdf}
          </Link>
          <Link href={localePath(locale, '/preview/portfolio')} className="u inline-flex items-center gap-1.5 text-sm hover:text-fg">
            <Icon type="doc" /> {ui.portfolioPdf}
          </Link>
        </div>
      </header>

      <section className="mt-16">
        <H>{ui.works}</H>
        <div className="space-y-9">
          {main.map((e) => (
            <article key={e.id} id={e.id} className="scroll-mt-10">
              <div className="flex items-baseline justify-between gap-4">
                <p className="min-w-0">
                  <Link href={localePath(locale, `/work/${e.id}`)} className="text-[1.05rem] font-semibold hover:text-key">
                    {e.company}
                  </Link>
                  {e.project && (
                    <span className="ml-2 text-[1.05rem]">
                      ·{' '}
                      {e.url ? (
                        <a href={e.url} target="_blank" rel="noreferrer" className="ext">
                          {e.project}
                        </a>
                      ) : (
                        e.project
                      )}
                    </span>
                  )}
                  <span className="ml-2 text-muted">{e.role}</span>
                </p>
                <span className="shrink-0 text-sm text-dim">{period(e.start, e.end, e.current, ui.now)}</span>
              </div>
              <p className="mt-1.5 text-muted">
                <RichText text={e.oneLiner} locale={locale} />
              </p>
              <ul className="bullets mt-2 space-y-1 text-[0.95rem] leading-relaxed">
                {e.bullets.map((b) => (
                  <li key={b}>
                    <RichText text={b} locale={locale} />
                  </li>
                ))}
              </ul>
              <Link href={localePath(locale, `/work/${e.id}`)} className="k u mt-2 inline-block text-sm">
                {ui.details} →
              </Link>
            </article>
          ))}
        </div>

        {earlier.length > 0 && (
          <div className="mt-10 border-t border-line pt-6">
            <p className="mb-3 text-sm text-dim">{ui.earlier}</p>
            <ul className="space-y-2 text-[0.95rem]">
              {earlier.map((e) => (
                <li key={e.id} id={e.id} className="flex items-baseline justify-between gap-4">
                  <span className="min-w-0">
                    <Link href={localePath(locale, `/work/${e.id}`)} className="font-medium hover:text-key">
                      {e.company}
                    </Link>
                    {e.project && <span className="ml-2">· {e.project}</span>}
                    <span className="ml-2 text-muted">{e.role}</span>
                    <span className="ml-2 text-dim">
                      — <RichText text={e.oneLiner} locale={locale} />
                    </span>
                  </span>
                  <span className="shrink-0 text-sm text-dim">{period(e.start, e.end, e.current, ui.now)}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </section>

      <section id="writing" className="mt-16 scroll-mt-10">
        <H>{ui.writing}</H>
        {posts.length === 0 ? (
          <p className="text-sm text-dim">{ui.noPosts}</p>
        ) : (
          <ul className="space-y-3">
            {posts.map((p) => (
              <li key={p.id} className="flex items-baseline justify-between gap-4">
                <a href={p.url} target="_blank" rel="noreferrer" className="ext min-w-0">
                  {p.title}
                </a>
                <span className="shrink-0 text-sm text-dim">
                  {SOURCE_LABEL[p.source]}
                  {p.publishedAt && ` · ${p.publishedAt.slice(0, 4)}`}
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="mt-16">
        <H>{ui.stack}</H>
        <p className="leading-relaxed text-muted">{cv.stack.join(' · ')}</p>
      </section>

      <section className="mt-16">
        <H>{ui.education}</H>
        <ul className="space-y-2">
          {cv.education.map((e) => (
            <li key={e.school} className="flex items-baseline justify-between gap-4">
              <span>
                <span className="font-medium">{e.school}</span>
                <span className="ml-2 text-muted">{e.degree}</span>
              </span>
              <span className="shrink-0 text-sm text-dim">
                {e.start}–{e.end}
              </span>
            </li>
          ))}
          {cv.credentials.map((c) => (
            <li key={c.title} className="flex items-baseline justify-between gap-4">
              <span className="min-w-0">
                <span>{c.title}</span>
                <span className="ml-2 text-dim">{c.issuer}</span>
              </span>
              <span className="shrink-0 text-sm text-dim">{c.date}</span>
            </li>
          ))}
        </ul>
      </section>

      <p className="mt-20 text-xs text-dim">
        {ui.updated} {cv.meta.updatedAt} · {profile.location}
      </p>
    </Shell>
  )
}
