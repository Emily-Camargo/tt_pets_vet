import type { ReactNode } from 'react'
import Link from 'next/link'

import { cx } from '@/core/functions/format'

export function HomeFrame({ children }: { children: ReactNode }) {
  return (
    <div
      className="space-y-4"
      style={{ animation: 'tt-surgir 0.6s ease both' }}
    >
      {children}
      <p className="pt-2 text-center text-xs text-slate-400">
        Protótipo com dados de exemplo.
      </p>
    </div>
  )
}

export function Hero({
  profile,
  name,
  text,
  chips,
  primary,
  secondary,
  mascot,
}: {
  profile: string
  name: string
  text: string
  chips: string[]
  primary: { href: string; label: string }
  secondary: { href: string; label: string }
  mascot: 'dog' | 'paws'
}) {
  return (
    <section className="rounded-3xl border border-marca-borda bg-linear-to-br from-white via-white to-marca-clara px-5 py-6 sm:px-8">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="max-w-xl">
          <p className="text-xs font-semibold tracking-[0.16em] text-marca uppercase">
            {profile}
          </p>
          <h1 className="mt-2 text-4xl font-semibold tracking-tight text-slate-900">
            Olá, {name}
          </h1>
          <p className="mt-2 text-sm leading-6 text-slate-500">{text}</p>
          <div className="mt-4 flex flex-wrap gap-2">
            {chips.map((chip) => (
              <span
                key={chip}
                className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs text-slate-500"
              >
                {chip}
              </span>
            ))}
          </div>
          <div className="mt-5 flex flex-wrap gap-2">
            <PillLink href={primary.href}>{primary.label}</PillLink>
            <PillLink href={secondary.href} light>
              {secondary.label}
            </PillLink>
          </div>
        </div>
        {mascot === 'dog' ? <DogMascot /> : <PawMascot />}
      </div>
    </section>
  )
}

export function Metric({
  icon,
  tone,
  label,
  value,
  detail,
}: {
  icon: ReactNode
  tone: string
  label: string
  value: string
  detail: string
}) {
  return (
    <article className="flex items-center gap-3 rounded-2xl border border-slate-100 bg-white px-4 py-4 shadow-sm">
      <span
        className={cx(
          'grid h-11 w-11 shrink-0 place-items-center rounded-xl',
          tone,
        )}
      >
        {icon}
      </span>
      <div className="min-w-0">
        <p className="text-xs text-slate-400">{label}</p>
        <p className="mt-0.5 text-xl font-semibold text-slate-900">{value}</p>
        <p className="mt-0.5 text-xs text-slate-400">{detail}</p>
      </div>
    </article>
  )
}

export function Panel({ children }: { children: ReactNode }) {
  return (
    <section className="rounded-2xl border border-slate-100 bg-white px-4 py-4 shadow-sm sm:px-5">
      {children}
    </section>
  )
}

export function PanelHead({
  title,
  href,
  action,
}: {
  title: string
  href: string
  action: string
}) {
  return (
    <div className="flex items-center justify-between gap-3">
      <h2 className="font-semibold text-slate-900">{title}</h2>
      <Link href={href} className="text-sm font-medium text-marca">
        {action}
      </Link>
    </div>
  )
}

export function Shortcut({
  href,
  icon,
  tone,
  label,
}: {
  href: string
  icon: ReactNode
  tone: string
  label: string
}) {
  return (
    <Link
      href={href}
      className="flex items-center gap-3 rounded-2xl border border-slate-100 bg-white px-4 py-4 text-sm font-medium text-slate-700 shadow-sm transition hover:border-marca-borda"
    >
      <span
        className={cx('grid h-10 w-10 place-items-center rounded-xl', tone)}
      >
        {icon}
      </span>
      {label}
    </Link>
  )
}

export function Bars({ items }: { items: { label: string; value: number }[] }) {
  const highest = Math.max(...items.map((item) => item.value), 1)

  return (
    <div className="mt-6 flex h-44 items-end justify-between gap-3">
      {items.map((item) => (
        <div
          key={item.label}
          className="flex h-full flex-1 flex-col items-center justify-end gap-2"
        >
          <div
            className={cx(
              'w-full max-w-14 rounded-t-xl',
              item.value > 0
                ? 'bg-linear-to-t from-marca-forte to-[#c4b5fd]'
                : 'bg-slate-100',
            )}
            style={{
              height: `${item.value > 0 ? Math.max((item.value / highest) * 100, 18) : 8}%`,
            }}
          />
          <span className="text-xs text-slate-400 capitalize">
            {item.label}
          </span>
        </div>
      ))}
    </div>
  )
}

function PillLink({
  href,
  light,
  children,
}: {
  href: string
  light?: boolean
  children: ReactNode
}) {
  return (
    <Link
      href={href}
      className={cx(
        'inline-flex items-center rounded-full px-4 py-2 text-sm font-medium transition',
        light
          ? 'border border-marca bg-white text-marca hover:bg-marca-clara'
          : 'bg-marca text-white hover:bg-marca-forte',
      )}
    >
      {children}
    </Link>
  )
}

function DogMascot() {
  return (
    <div className="relative mx-auto h-36 w-36 shrink-0" aria-hidden>
      <div
        className="absolute inset-0 rounded-full border border-dashed border-marca/30"
        style={{ animation: 'tt-girar 28s linear infinite' }}
      />
      <div className="absolute inset-3 rounded-full bg-white shadow-sm" />
      <span
        className="absolute top-1 right-3 text-sm"
        style={{ animation: 'tt-pata 3.2s ease-in-out infinite' }}
      >
        🐾
      </span>
      <span
        className="absolute bottom-4 left-1 text-sm"
        style={{ animation: 'tt-pata 3.2s ease-in-out 1s infinite' }}
      >
        🐾
      </span>
      <div
        className="absolute inset-0 grid place-items-center"
        style={{ animation: 'tt-flutuar 3.6s ease-in-out infinite' }}
      >
        <Dog />
      </div>
    </div>
  )
}

function PawMascot() {
  return (
    <div className="relative mx-auto h-36 w-36 shrink-0" aria-hidden>
      <div
        className="absolute inset-0 rounded-full border border-dashed border-marca/30"
        style={{ animation: 'tt-girar 28s linear infinite' }}
      />
      <div className="absolute inset-3 rounded-full bg-white shadow-sm" />
      <span
        className="absolute top-7 left-8 text-3xl text-[#5b4bdb]"
        style={{ animation: 'tt-pata 3.2s ease-in-out infinite' }}
      >
        🐾
      </span>
      <span
        className="absolute right-7 bottom-7 text-3xl text-[#5b4bdb]"
        style={{ animation: 'tt-pata 3.2s ease-in-out 0.8s infinite' }}
      >
        🐾
      </span>
    </div>
  )
}

function Dog() {
  return (
    <svg viewBox="0 0 80 80" className="h-16 w-16" aria-hidden>
      <ellipse cx="22" cy="24" rx="10" ry="14" fill="#c4a574" />
      <ellipse cx="58" cy="24" rx="10" ry="14" fill="#c4a574" />
      <ellipse cx="22" cy="24" rx="5" ry="8" fill="#e7c9a0" />
      <ellipse cx="58" cy="24" rx="5" ry="8" fill="#e7c9a0" />
      <circle cx="40" cy="42" r="22" fill="#e7c9a0" />
      <ellipse cx="31" cy="40" rx="4" ry="5" fill="#fff" />
      <ellipse cx="49" cy="40" rx="4" ry="5" fill="#fff" />
      <circle cx="32" cy="41" r="2" fill="#3f2a1d" />
      <circle cx="50" cy="41" r="2" fill="#3f2a1d" />
      <ellipse cx="40" cy="50" rx="4" ry="3" fill="#3f2a1d" />
      <path d="M36 54c2.5 3 5.5 3 8 0" fill="#f43f5e" />
    </svg>
  )
}
