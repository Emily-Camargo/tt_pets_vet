'use client'

import { Group, Text, Title } from '@mantine/core'
import type { ReactNode } from 'react'

export function PageHeader({
  eyebrow,
  title,
  description,
  actions,
}: {
  eyebrow?: string
  title: string
  description?: string
  actions?: ReactNode
}) {
  return (
    <div className="flex flex-row items-end justify-between gap-4 text-left max-sm:flex-col max-sm:items-start">
      <div className="min-w-0 text-left">
        {eyebrow && (
          <Text
            size="xs"
            fw={500}
            c="#8b5cf6"
            tt="uppercase"
            style={{ letterSpacing: '0.14em' }}
          >
            {eyebrow}
          </Text>
        )}
        <Title
          order={3}
          mt={eyebrow ? 6 : 0}
          fw={600}
          c="#475569"
          style={{ letterSpacing: '-0.02em' }}
        >
          {title}
        </Title>
        {description && (
          <Text size="sm" c="#94a3b8" mt={6} maw={520}>
            {description}
          </Text>
        )}
      </div>
      {actions ? (
        <Group gap="sm" wrap="wrap" className="shrink-0">
          {actions}
        </Group>
      ) : null}
    </div>
  )
}
