import { RichText } from '@/components/rich-text'
import { Shell } from '@/components/shell'
import { getCv, getUi, periodMonth } from '@/lib/data'
import { collectTerms, firstOccurrenceOnly, stripTermTokens } from '@/lib/glossary'
import type { Locale } from '@/lib/types'

export function WorkDetail({ locale, id }: { locale: Locale; id: string }) {
  const cv = getCv(locale)
  const ui = getUi(locale)
  const e = cv.experiences.find((x) => x.id === id)!
  const firstProject = e.detail.projects[0]
  // Glossary links live only where a reader first meets the jargon: the
  // description, the impact list, and the first project. Later projects are
  // plain text so the page stays readable. pageTerms mirrors exactly that
  // scope, for the header toggle / "G" shortcut's full-page list.
  const pageTerms = collectTerms([
    e.detail.description,
    ...e.detail.impact,
    firstProject?.problem ?? '',
    ...(firstProject?.approach ?? []),
  ])
  const seen = new Set<string>()
  const [description, ...impact] = firstOccurrenceOnly([e.detail.description, ...e.detail.impact], locale, seen)
  const projects = e.detail.projects.map((p, i) => {
    if (i === 0) {
      const [problem, ...approach] = firstOccurrenceOnly([p.problem ?? '', ...p.approach], locale, seen)
      return { ...p, problem: p.problem ? problem : undefined, approach }
    }
    return {
      ...p,
      problem: p.problem ? stripTermTokens(p.problem, locale) : undefined,
      approach: p.approach.map((a) => stripTermTokens(a, locale)),
    }
  })
  const d = { ...e.detail, description, impact, projects }

  return (
    <Shell locale={locale} backHref={`/work/${id}`} pageTerms={pageTerms}>
      <header>
        <p className="text-sm text-dim">{periodMonth(e.start, e.end, e.current, ui.now)}</p>
        <h1 className="mt-1 text-[1.6rem] font-semibold tracking-tight">
          {e.company}
          {e.project && (
            <span className="ml-2">
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
          <span className="ml-3 text-[1.05rem] font-normal text-muted">{e.role}</span>
        </h1>
        <p className="mt-4 leading-relaxed text-muted">
          <RichText text={d.description} locale={locale} />
        </p>
        {e.contractUrl && (
          <p className="mt-2 text-sm text-dim">
            <a href={e.contractUrl} target="_blank" rel="noreferrer" className="ext">
              {ui.explorer}
            </a>
          </p>
        )}
      </header>

      {d.impact.length > 0 && (
        <section className="mt-12">
          <h2 className="h rule mb-5">{ui.impact}</h2>
          <ul className="bullets space-y-1.5 leading-relaxed">
            {d.impact.map((i) => (
              <li key={i}>
                <RichText text={i} locale={locale} />
              </li>
            ))}
          </ul>
        </section>
      )}

      <section className="mt-12">
        <h2 className="h rule mb-6">{ui.projects}</h2>
        <div className="space-y-9">
          {d.projects.map((p) => (
            <article key={p.title}>
              <div className="flex items-baseline justify-between gap-4">
                <h3 className="font-semibold">{p.title}</h3>
                {p.period && <span className="shrink-0 text-sm text-dim">{p.period}</span>}
              </div>
              {p.problem && (
                <p className="mt-2 leading-relaxed text-muted">
                  <span className="k">{ui.problem} · </span>
                  <RichText text={p.problem} locale={locale} />
                </p>
              )}
              <ul className="bullets mt-2 space-y-1 text-[0.95rem] leading-relaxed">
                {p.approach.map((a) => (
                  <li key={a}>
                    <RichText text={a} locale={locale} />
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </section>

      <section className="mt-12">
        <h2 className="h rule mb-5">{ui.stack}</h2>
        <dl className="grid gap-x-6 gap-y-1.5 text-[0.95rem] sm:grid-cols-[100px_1fr]">
          {Object.entries(d.stack).map(([k, v]) => (
            <div key={k} className="contents">
              <dt className="text-dim">{k}</dt>
              <dd className="text-muted">{v}</dd>
            </div>
          ))}
        </dl>
      </section>
    </Shell>
  )
}
