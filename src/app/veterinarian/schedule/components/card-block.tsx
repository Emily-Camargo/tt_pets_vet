'use client'

import { Button, Group, Text } from '@mantine/core'

import { dataHora } from '@/core/functions/format'

export function CardBlock({
  vetName,
  start,
  end,
  reason,
  onRemove,
}: {
  vetName?: string
  start: string
  end: string
  reason: string
  onRemove: () => void
}) {
  return (
    <Group justify="space-between">
      <Text size="sm">
        {vetName}: {dataHora(start)} até {dataHora(end)} · {reason}
      </Text>
      <Button variant="subtle" color="gray" onClick={onRemove}>
        Remover
      </Button>
    </Group>
  )
}
