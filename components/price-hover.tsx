'use client'

import { useEffect, useId, useRef, useState } from 'react'
import type { Locale } from '@/lib/types'

type Kind = 'price' | 'basket'
type Leg = { symbol: string; amount: number }
type Quote = { price: number; at: number }

const STABLE = new Set(['USDC', 'USDT', 'USD'])
const TTL_MS = 60_000
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
  const [state, setState] = useState<'idle' | 'loading' | 'ready' | 'error'>('idle')
  const [, bump] = useState(0)
  const wrapRef = useRef<HTMLSpanElement>(null)
  const id = useId()
  const t = UI[locale]

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

  useEffect(() => {
    if (!open) return
    const onDown = (e: PointerEvent) => {
      if (!wrapRef.current?.contains(e.target as Node)) setOpen(false)
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
    <span ref={wrapRef} className="relative inline">
      <button
        type="button"
        aria-describedby={open ? id : undefined}
        aria-expanded={open}
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
        onFocus={() => setOpen(true)}
        onBlur={() => setOpen(false)}
        onClick={() => setOpen((v) => !v)}
        className="price inline cursor-help appearance-none border-0 bg-transparent p-0 text-inherit"
      >
        {children}
      </button>
      {open && (
        <span
          id={id}
          role="tooltip"
          onMouseEnter={() => setOpen(true)}
          onMouseLeave={() => setOpen(false)}
          className="price-card absolute left-0 top-full z-50 mt-2 block w-[280px] max-w-[calc(100vw-2rem)] text-left text-[0.82rem] leading-relaxed"
        >
          <span className="flex items-center justify-between border-b border-line px-3 py-1.5 font-mono text-[0.7rem] text-dim">
            <span className="flex items-center gap-1.5">
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-key" />
              {t.source}
            </span>
            {state === 'ready' && <span>{new Date().toLocaleTimeString(locale === 'ko' ? 'ko-KR' : 'en-US', { hour: '2-digit', minute: '2-digit' })}</span>}
          </span>
          <span className="block px-3 py-2">
            {state === 'loading' && <span className="text-muted">{t.loading}</span>}
            {state === 'error' && <span className="text-muted">{t.error}</span>}
            {state === 'ready' && (
              <span className="block space-y-1">
                {rows.map((r) => (
                  <span key={r.symbol} className="flex items-baseline justify-between gap-3">
                    <span className="text-muted">
                      {num(r.amount)} {r.symbol}
                      {!STABLE.has(r.symbol) && r.price !== undefined && (
                        <span className="ml-1 text-dim">@ {usd(r.price, r.price < 1 ? 4 : 2)}</span>
                      )}
                    </span>
                    <span className="font-medium">{r.value === undefined ? '—' : usd(r.value)}</span>
                  </span>
                ))}
                {kind === 'basket' && (
                  <span className="mt-1 flex items-baseline justify-between gap-3 border-t border-line pt-1">
                    <span className="text-muted">{t.total}</span>
                    <span className="font-semibold text-key">{total === undefined ? '—' : usd(total)}</span>
                  </span>
                )}
              </span>
            )}
          </span>
        </span>
      )}
    </span>
  )
}
