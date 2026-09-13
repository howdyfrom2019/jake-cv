'use client'

import { useCallback, useEffect, useId, useLayoutEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import type { Locale } from '@/lib/types'

type Kind = 'price' | 'basket'
type Leg = { symbol: string; amount: number }
type Quote = { price: number; at: number }
type Pos = { top: number; left: number; width: number }

const STABLE = new Set(['USDC', 'USDT', 'USD'])
const TTL_MS = 60_000
const MARGIN = 8
const CARD_WIDTH = 280
const cache = new Map<string, Quote>()
let inflight: Promise<void> | null = null

const UI = {
  ko: { source: 'Binance 현재가', loading: '시세 불러오는 중…', error: '시세를 불러오지 못했습니다.', total: '현재 시세 합계', each: '단가', sum: '환산' },
  en: { source: 'Binance live', loading: 'Loading prices…', error: 'Could not load prices.', total: 'Live total', each: 'Price', sum: 'Value' },
}

function parseSpec(kind: Kind, spec: string): Leg[] {
  if (kind === 'price') {
    const [symbol, amount] = spec.split(':')
    return [{ symbol, amount: Number(amount) }]
  }
  return spec.split(',').map((pair) => {
    const [symbol, amount] = pair.split('=')
    return { symbol: symbol.trim(), amount: Number(amount) }
  })
}

async function ensurePrices(symbols: string[]) {
  const now = Date.now()
  const missing = symbols.filter((s) => !STABLE.has(s) && !(cache.get(s) && now - cache.get(s)!.at < TTL_MS))
  if (missing.length === 0) return
  if (inflight) return inflight
  const list = encodeURIComponent(JSON.stringify(missing.map((s) => `${s}USDT`)))
  inflight = fetch(`https://api.binance.com/api/v3/ticker/price?symbols=${list}`)
    .then((r) => {
      if (!r.ok) throw new Error(String(r.status))
      return r.json() as Promise<{ symbol: string; price: string }[]>
    })
    .then((rows) => {
      for (const row of rows) cache.set(row.symbol.replace(/USDT$/, ''), { price: Number(row.price), at: Date.now() })
    })
    .finally(() => {
      inflight = null
    })
  return inflight
}

function priceOf(symbol: string) {
  if (STABLE.has(symbol)) return 1
  return cache.get(symbol)?.price
}

const usd = (n: number, digits = 0) =>
  n.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: digits })
const num = (n: number) => n.toLocaleString('en-US', { maximumFractionDigits: 4 })

/** Anchor rect → a fixed position for the card, clamped inside the viewport. */
function place(anchor: DOMRect): Pos {
  const vw = window.innerWidth
  const vh = window.innerHeight
  const width = Math.min(CARD_WIDTH, vw - MARGIN * 2)
  const left = Math.min(Math.max(anchor.left, MARGIN), vw - width - MARGIN)
  // Guess below first; a post-render measurement (below) flips it above if
  // the real card height would run past the bottom edge.
  const estimatedHeight = 120
  const top =
    anchor.bottom + MARGIN + estimatedHeight <= vh
      ? anchor.bottom + MARGIN
      : Math.max(MARGIN, anchor.top - MARGIN - estimatedHeight)
  return { top, left, width }
}

export function PriceHover({
  kind,
  spec,
  locale,
  children,
}: {
  kind: Kind
  spec: string
  locale: Locale
  children: React.ReactNode
}) {
  const legs = parseSpec(kind, spec)
  const [open, setOpen] = useState(false)
  const [pos, setPos] = useState<Pos | null>(null)
  const [state, setState] = useState<'idle' | 'loading' | 'ready' | 'error'>('idle')
  const [, bump] = useState(0)
  const anchorRef = useRef<HTMLButtonElement>(null)
  const cardRef = useRef<HTMLDivElement>(null)
  const id = useId()
  const t = UI[locale]

  const reposition = useCallback(() => {
    const el = anchorRef.current
    if (!el) return
    setPos(place(el.getBoundingClientRect()))
  }, [])

  const show = useCallback(() => {
    reposition()
    setOpen(true)
  }, [reposition])

  useEffect(() => {
    if (!open || state === 'ready') return
    let cancelled = false
    setState('loading')
    ensurePrices(legs.map((l) => l.symbol))
      .then(() => !cancelled && (setState('ready'), bump((n) => n + 1)))
      .catch(() => !cancelled && setState('error'))
    return () => {
      cancelled = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open])

  // Re-clamp against the anchor on scroll/resize, and once more against the
  // card's real (post-render) height so it never runs past the bottom edge.
  useLayoutEffect(() => {
    if (!open) return
    const anchorEl = anchorRef.current
    const cardEl = cardRef.current
    if (!anchorEl) return
    const anchor = anchorEl.getBoundingClientRect()
    const next = place(anchor)
    if (cardEl) {
      const h = cardEl.getBoundingClientRect().height
      const vh = window.innerHeight
      if (next.top + h > vh - MARGIN) {
        next.top = Math.max(MARGIN, Math.min(next.top, anchor.top - MARGIN - h))
      }
    }
    setPos((prev) =>
      prev && prev.top === next.top && prev.left === next.left && prev.width === next.width ? prev : next,
    )
  }, [open, state, legs.length])

  useEffect(() => {
    if (!open) return
    const onReposition = () => reposition()
    window.addEventListener('scroll', onReposition, true)
    window.addEventListener('resize', onReposition)
    return () => {
      window.removeEventListener('scroll', onReposition, true)
      window.removeEventListener('resize', onReposition)
    }
  }, [open, reposition])

  useEffect(() => {
    if (!open) return
    const onDown = (e: PointerEvent) => {
      const target = e.target as Node
      if (anchorRef.current?.contains(target) || cardRef.current?.contains(target)) return
      setOpen(false)
    }
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    document.addEventListener('pointerdown', onDown)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('pointerdown', onDown)
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  const rows = legs.map((l) => {
    const p = priceOf(l.symbol)
    return { ...l, price: p, value: p === undefined ? undefined : p * l.amount }
  })
  const total = rows.every((r) => r.value !== undefined) ? rows.reduce((s, r) => s + (r.value ?? 0), 0) : undefined

  return (
    <>
      <button
        ref={anchorRef}
        type="button"
        aria-describedby={open ? id : undefined}
        aria-expanded={open}
        onMouseEnter={show}
        onMouseLeave={() => setOpen(false)}
        onFocus={show}
        onBlur={() => setOpen(false)}
        onClick={() => (open ? setOpen(false) : show())}
        className="price inline cursor-help appearance-none border-0 bg-transparent p-0 text-inherit"
      >
        {children}
      </button>
      {open &&
        pos &&
        createPortal(
          <div
            ref={cardRef}
            id={id}
            role="tooltip"
            onMouseEnter={() => setOpen(true)}
            onMouseLeave={() => setOpen(false)}
            style={{ top: pos.top, left: pos.left, width: pos.width }}
            className="price-card fixed z-50 text-left text-[0.82rem] leading-relaxed"
          >
            <div className="flex items-center justify-between border-b border-line px-3 py-1.5 font-mono text-[0.7rem] text-dim">
              <span className="flex items-center gap-1.5">
                <span className="inline-block h-1.5 w-1.5 rounded-full bg-key" />
                {t.source}
              </span>
              {state === 'ready' && (
                <span>
                  {new Date().toLocaleTimeString(locale === 'ko' ? 'ko-KR' : 'en-US', {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </span>
              )}
            </div>
            <div className="px-3 py-2">
              {state === 'loading' && <span className="text-muted">{t.loading}</span>}
              {state === 'error' && <span className="text-muted">{t.error}</span>}
              {state === 'ready' && (
                <div className="space-y-1">
                  {rows.map((r) => (
                    <div key={r.symbol} className="flex items-baseline justify-between gap-3">
                      <span className="text-muted">
                        {num(r.amount)} {r.symbol}
                        {!STABLE.has(r.symbol) && r.price !== undefined && (
                          <span className="ml-1 text-dim">@ {usd(r.price, r.price < 1 ? 4 : 2)}</span>
                        )}
                      </span>
                      <span className="font-medium">{r.value === undefined ? '—' : usd(r.value)}</span>
                    </div>
                  ))}
                  {kind === 'basket' && (
                    <div className="mt-1 flex items-baseline justify-between gap-3 border-t border-line pt-1">
                      <span className="text-muted">{t.total}</span>
                      <span className="font-semibold text-key">{total === undefined ? '—' : usd(total)}</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>,
          document.body,
        )}
    </>
  )
}
