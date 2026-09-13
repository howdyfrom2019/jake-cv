'use client'

import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react'
import { glossary, termLabel } from '@/lib/glossary'
import type { Locale } from '@/lib/types'

type Ctx = { open: (id: string) => void; toggleAll: () => void; hasTerms: boolean; locale: Locale }
const GlossaryCtx = createContext<Ctx | null>(null)

const UI = {
  ko: {
    title: 'glossary',
    close: '닫기',
    related: '관련',
    clear: '지우기',
    toggleLabel: '용어',
    toggleHint: '이 페이지의 용어 전체 보기',
  },
  en: {
    title: 'glossary',
    close: 'close',
    related: 'related',
    clear: 'clear',
    toggleLabel: 'Glossary',
    toggleHint: 'Show every term on this page',
  },
}

export function GlossaryProvider({
  locale,
  pageTerms = [],
  children,
}: {
  locale: Locale
  pageTerms?: string[]
  children: React.ReactNode
}) {
  const [history, setHistory] = useState<string[]>([])
  const [visible, setVisible] = useState(false)
  const bodyRef = useRef<HTMLDivElement>(null)

  const open = useCallback((id: string) => {
    if (!glossary[id]) return
    setHistory((h) => (h[h.length - 1] === id ? h : [...h.slice(-7), id]))
    setVisible(true)
  }, [])

  // "Show everything" toggle: closes if open, otherwise replaces history with
  // every term on the page. Kept as one state transition per click/keypress.
  const onToggleAllClick = useCallback(() => {
    setVisible((v) => {
      const next = !v
      if (next && pageTerms.length > 0) setHistory(pageTerms)
      return next
    })
  }, [pageTerms])

  // Global "G" shortcut: toggle the full-page glossary. Ignored while
  // typing, or with a modifier held (so it never fights a browser/OS shortcut).
  useEffect(() => {
    if (pageTerms.length === 0) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() !== 'g' || e.metaKey || e.ctrlKey || e.altKey) return
      const el = e.target as HTMLElement | null
      if (el && (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA' || el.isContentEditable)) return
      e.preventDefault()
      onToggleAllClick()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [pageTerms, onToggleAllClick])

  useEffect(() => {
    if (!visible) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setVisible(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [visible])

  useEffect(() => {
    bodyRef.current?.scrollTo({ top: bodyRef.current.scrollHeight, behavior: 'smooth' })
  }, [history])

  const t = UI[locale]

  return (
    <GlossaryCtx.Provider value={{ open, toggleAll: onToggleAllClick, hasTerms: pageTerms.length > 0, locale }}>
      {children}
      {visible && (
        <aside
          role="dialog"
          aria-label={t.title}
          className="term-panel fixed inset-x-0 bottom-0 z-50 flex max-h-[60dvh] flex-col sm:inset-x-auto sm:bottom-6 sm:right-6 sm:max-h-[70dvh] sm:w-[380px]"
        >
          <div className="flex items-center justify-between border-b border-line px-4 py-2 text-xs text-dim">
            <span className="flex items-center gap-2">
              <span className="inline-block h-2 w-2 rounded-full bg-key" />
              {t.title} · {locale}
              {history.length > 1 && <span>· {history.length}</span>}
            </span>
            <span className="flex items-center gap-3">
              {history.length > 1 && (
                <button type="button" onClick={() => setHistory((h) => h.slice(-1))} className="hover:text-fg">
                  {t.clear}
                </button>
              )}
              <button type="button" onClick={() => setVisible(false)} className="hover:text-fg" aria-label={t.close}>
                esc ×
              </button>
            </span>
          </div>
          <div ref={bodyRef} className="overflow-y-auto px-4 py-3 text-[0.9rem] leading-relaxed">
            {history.map((id, i) => {
              const g = glossary[id]
              const related = (g.related ?? []).filter((r) => glossary[r])
              return (
                <div key={`${id}-${i}`} className={i > 0 ? 'mt-4 border-t border-line/60 pt-4' : ''}>
                  <p className="font-mono text-xs text-dim">
                    <span className="text-key">›</span> {id}
                  </p>
                  <p className="mt-1 font-semibold">{g.term[locale]}</p>
                  <p className="mt-1 text-muted">{g[locale]}</p>
                  {related.length > 0 && (
                    <p className="mt-2 text-xs text-dim">
                      {t.related}:{' '}
                      {related.map((r, j) => (
                        <span key={r}>
                          <button type="button" onClick={() => open(r)} className="u text-muted hover:text-fg">
                            {termLabel(r, locale)}
                          </button>
                          {j < related.length - 1 ? ', ' : ''}
                        </span>
                      ))}
                    </p>
                  )}
                </div>
              )
            })}
            <p className="mt-4 font-mono text-xs text-dim">
              <span className="text-key">›</span> <span className="term-cursor" />
            </p>
          </div>
        </aside>
      )}
    </GlossaryCtx.Provider>
  )
}

export function Term({ id, children }: { id: string; children: React.ReactNode }) {
  const ctx = useContext(GlossaryCtx)
  if (!ctx || !glossary[id]) return <>{children}</>
  return (
    <button
      type="button"
      onClick={() => ctx.open(id)}
      className="term inline cursor-help appearance-none border-0 bg-transparent p-0 text-inherit"
      title={glossary[id].term[ctx.locale]}
    >
      {children}
    </button>
  )
}

/** Header control that opens the full glossary for the current page. Also bound to the "G" key. */
export function GlossaryToggle() {
  const ctx = useContext(GlossaryCtx)
  if (!ctx || !ctx.hasTerms) return null
  const t = UI[ctx.locale]
  return (
    <button
      type="button"
      onClick={ctx.toggleAll}
      title={t.toggleHint}
      className="inline-flex items-center gap-1.5 hover:text-fg"
    >
      {t.toggleLabel}
      <kbd className="rounded border border-line px-1 font-mono text-[10px] leading-[14px] text-dim">G</kbd>
    </button>
  )
}
