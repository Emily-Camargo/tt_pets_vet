import type { ReactNode } from 'react'
import { Badge, Button, Group, Text, Title } from '@mantine/core'
import Link from 'next/link'

import { cx } from '@/core/functions/format'

export function HomeFrame({ children }: { children: ReactNode }) {
  return (
    <div
      className="grid gap-4"
      style={{ animation: 'tt-surgir 0.6s ease both' }}
    >
      {children}
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
    <div className="rounded-3xl border border-marca-borda bg-linear-to-br from-white via-white to-marca-clara px-5 py-6 sm:px-8">
      <div className="flex flex-row items-center gap-10 max-lg:flex-col max-lg:text-center">
        <div className="max-w-xl max-lg:mx-auto">
          <Text
            size="xs"
            fw={600}
            c="#7434d6"
            tt="uppercase"
            style={{ letterSpacing: '0.16em' }}
          >
            {profile}
          </Text>
          <Title order={3} mt={6} fw={600} c="#475569">
            Olá, {name}
          </Title>
          <Text size="sm" c="#94a3b8" mt={6}>
            {text}
          </Text>
          <Group gap="xs" mt="md" className="max-lg:justify-center">
            {chips.map((chip) => (
              <Badge
                key={chip}
                radius="xl"
                variant="light"
                color="violet"
                size="sm"
                tt="none"
                className="normal-case font-normal"
              >
                {chip}
              </Badge>
            ))}
          </Group>
          <Group gap="sm" mt="md" className="max-lg:justify-center">
            <Button
              component={Link}
              href={primary.href}
              radius="xl"
              variant="gradient"
              gradient={{ from: '#7434d6', to: '#ec4899', deg: 135 }}
            >
              {primary.label}
            </Button>
            <Button
              component={Link}
              href={secondary.href}
              radius="xl"
              variant="light"
              color="violet"
            >
              {secondary.label}
            </Button>
          </Group>
        </div>
        {mascot === 'dog' ? <DogMascot /> : <PawMascot />}
      </div>
    </div>
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
    <div className="flex items-center gap-3 rounded-2xl border border-slate-100 bg-white px-4 py-4 shadow-sm">
      <div
        className={cx(
          'grid h-11 w-11 shrink-0 place-items-center rounded-xl',
          tone,
        )}
      >
        {icon}
      </div>
      <div className="min-w-0">
        <Text size="xs" c="#94a3b8">
          {label}
        </Text>
        <Text size="lg" fw={600} c="#475569" mt={2}>
          {value}
        </Text>
        <Text size="xs" c="#94a3b8" mt={2}>
          {detail}
        </Text>
      </div>
    </div>
  )
}

export function Panel({ children }: { children: ReactNode }) {
  return (
    <div className="rounded-2xl border border-slate-100 bg-white px-4 py-4 shadow-sm sm:px-5">
      {children}
    </div>
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
    <Group justify="space-between" align="center" gap="sm">
      <Text size="sm" fw={600} c="#64748b">
        {title}
      </Text>
      <Button
        component={Link}
        href={href}
        variant="light"
        color="violet"
        size="compact-sm"
        radius="xl"
      >
        {action}
      </Button>
    </Group>
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
    <Button
      component={Link}
      href={href}
      unstyled
      className="flex items-center gap-3 rounded-2xl border border-slate-100 bg-white px-4 py-4 text-sm font-medium text-slate-700 shadow-sm transition hover:border-marca-borda"
    >
      <div className={cx('grid h-10 w-10 place-items-center rounded-xl', tone)}>
        {icon}
      </div>
      {label}
    </Button>
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
          <Text size="xs" c="dimmed" tt="capitalize">
            {item.label}
          </Text>
        </div>
      ))}
    </div>
  )
}

function DogMascot() {
  return (
    <div className="relative h-36 w-36 shrink-0 max-lg:mx-auto" aria-hidden>
      <div
        className="absolute inset-0 rounded-full border border-dashed border-marca/30"
        style={{ animation: 'tt-girar 28s linear infinite' }}
      />
      <div className="absolute inset-3 rounded-full bg-white shadow-sm" />
      <div
        className="absolute top-1 right-3 text-sm"
        style={{ animation: 'tt-pata 3.2s ease-in-out infinite' }}
      >
        🐾
      </div>
      <div
        className="absolute bottom-4 left-1 text-sm"
        style={{ animation: 'tt-pata 3.2s ease-in-out 1s infinite' }}
      >
        🐾
      </div>
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
    <div className="relative h-36 w-36 shrink-0 max-lg:mx-auto" aria-hidden>
      <div
        className="absolute inset-0 rounded-full border border-dashed border-marca/30"
        style={{ animation: 'tt-girar 28s linear infinite' }}
      />
      <div className="absolute inset-3 rounded-full bg-white shadow-sm" />
      <div
        className="absolute top-7 left-8 text-3xl text-[#5b4bdb]"
        style={{ animation: 'tt-pata 3.2s ease-in-out infinite' }}
      >
        🐾
      </div>
      <div
        className="absolute right-7 bottom-7 text-3xl text-[#5b4bdb]"
        style={{ animation: 'tt-pata 3.2s ease-in-out 0.8s infinite' }}
      >
        🐾
      </div>
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
