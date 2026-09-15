import { getCv, getUi, period, periodMonth } from '@/lib/data'
import { collectTerms, glossary, stripTerms } from '@/lib/glossary'
import type { Locale } from '@/lib/types'

/**
 * Print-styled documents. `cv` is a one-page résumé, `portfolio` is the full
 * career description with every project. Both are rendered to PDF by
 * scripts/build-pdf.ts and served from /downloads.
 */
export function PrintDoc({ locale, kind }: { locale: Locale; kind: 'cv' | 'portfolio' }) {
  const cv = getCv(locale)
  const ui = getUi(locale)
  const { profile } = cv
  const full = kind === 'portfolio'
  const S = (t: string) => stripTerms(t, locale)
  const usedTerms = full
    ? collectTerms(
        cv.experiences.flatMap((e) => [
          e.detail.description,
          ...e.detail.impact,
          ...e.detail.projects.flatMap((p) => [p.problem ?? '', ...p.approach]),
        ]),
      )
    : []

  return (
    <div className="print-page w-full">
      <header className="flex items-start justify-between gap-6">
        <div>
          <h1 className="text-[20pt] font-semibold tracking-tight">
            {profile.name} <span className="dim font-normal">{profile.altName}</span>
          </h1>
          <p className="mt-1 text-[11pt]">{profile.headline}</p>
          <p className="mt-0.5 text-[10pt]">
            {profile.tagline.map((t, i) => (
              <span key={t.label} className="k">
                {t.label}
                {i < profile.tagline.length - 1 ? ' · ' : ''}
              </span>
            ))}
          </p>
        </div>
        <div className="dim shrink-0 text-right text-[9pt] leading-relaxed">
          <p>{profile.email}</p>
          {profile.links.map((l) => (
            <p key={l.type}>{l.url.replace('https://', '').replace('www.', '')}</p>
          ))}
          <p>{profile.location}</p>
          <p>
            {ui.updated} {cv.meta.updatedAt}
          </p>
        </div>
      </header>

      <div className="muted mt-2 space-y-1 text-[9.5pt] leading-snug">
        {profile.intro.map((p) => (
          <p key={p}>{p}</p>
        ))}
      </div>

      <section className="mt-4">
        <h2 className="rule mb-3 text-[11pt] font-semibold">{ui.works}</h2>
        <div className={full ? 'space-y-6' : 'space-y-2'}>
          {cv.experiences.map((e) => (
            <article key={e.id} className="avoid-break">
              <div className="flex items-baseline justify-between gap-4">
                <p>
                  <span className="text-[11pt] font-semibold">{e.company}</span>
                  {e.project && <span className="ml-2">· {e.project}</span>}
                  <span className="muted ml-2">{e.role}</span>
                </p>
                <span className="dim shrink-0 text-[9pt]">
                  {full ? periodMonth(e.start, e.end, e.current, ui.now) : period(e.start, e.end, e.current, ui.now)}
                </span>
              </div>
              <p className="muted mt-0.5">{S(full ? e.detail.description : e.oneLiner)}</p>

              {!full && e.bullets.length > 0 && (
                <ul className="bullets mt-0.5 space-y-0 leading-snug">
                  {e.bullets.map((b) => (
                    <li key={b}>{S(b)}</li>
                  ))}
                </ul>
              )}

              {full && (
                <>
                  {e.detail.impact.length > 0 && (
                    <>
                      <p className="mt-2 text-[9pt] font-semibold uppercase tracking-wide">{ui.impact}</p>
                      <ul className="bullets mt-0.5 space-y-0.5">
                        {e.detail.impact.map((i) => (
                          <li key={i}>{S(i)}</li>
                        ))}
                      </ul>
                    </>
                  )}
                  <p className="mt-2 text-[9pt] font-semibold uppercase tracking-wide">{ui.projects}</p>
                  <div className="mt-1 space-y-2.5">
                    {e.detail.projects.map((p) => (
                      <div key={p.title} className="avoid-break">
                        <p>
                          <span className="font-semibold">{p.title}</span>
                          {p.period && <span className="dim ml-2 text-[9pt]">{p.period}</span>}
                        </p>
                        {p.problem && (
                          <p className="muted mt-0.5">
                            <span className="k">{ui.problem} · </span>
                            {S(p.problem)}
                          </p>
                        )}
                        <ul className="bullets mt-0.5 space-y-0.5">
                          {p.approach.map((a) => (
                            <li key={a}>{S(a)}</li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                  <p className="dim mt-2 text-[9pt]">
                    {Object.entries(e.detail.stack)
                      .map(([k, v]) => `${k}: ${v}`)
                      .join(' · ')}
                  </p>
                </>
              )}
            </article>
          ))}
        </div>
      </section>

      <div className={full ? 'mt-4' : 'mt-3 grid grid-cols-[1fr_1.4fr] gap-6'}>
        {!full && (
          <section>
            <h2 className="rule mb-2 text-[11pt] font-semibold">{ui.stack}</h2>
            <p className="muted">{cv.stack.join(' · ')}</p>
          </section>
        )}

        <section>
          <h2 className="rule mb-2 text-[11pt] font-semibold">{ui.education}</h2>
          <ul className="space-y-0.5">
            {cv.education.map((e) => (
              <li key={e.school} className="flex justify-between gap-4">
                <span>
                  <span className="font-medium">{e.school}</span>
                  <span className="muted ml-2">{e.degree}</span>
                </span>
                <span className="dim shrink-0 text-[9pt]">
                  {e.start}–{e.end}
                </span>
              </li>
            ))}
            {cv.credentials.map((c) => (
              <li key={c.title} className="flex justify-between gap-4">
                <span>
                  {c.title}
                  <span className="dim ml-2">{c.issuer}</span>
                </span>
                <span className="dim shrink-0 text-[9pt]">{c.date}</span>
              </li>
            ))}
          </ul>
        </section>
      </div>

      {full && usedTerms.length > 0 && (
        <section className="mt-5">
          <h2 className="rule mb-2 text-[11pt] font-semibold">{locale === 'ko' ? '용어 설명' : 'Glossary'}</h2>
          <dl className="grid grid-cols-2 gap-x-6 gap-y-1 text-[8.5pt]">
            {usedTerms.map((id) => (
              <div key={id} className="avoid-break">
                <dt className="font-semibold">{glossary[id].term[locale]}</dt>
                <dd className="muted">{glossary[id][locale]}</dd>
              </div>
            ))}
          </dl>
        </section>
      )}
    </div>
  )
}
