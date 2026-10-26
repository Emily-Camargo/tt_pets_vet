'use client'

import { Card } from '@grazziotin/react-components-next/ui'
import { Badge, Button, Group, Text } from '@mantine/core'

import { dataHora, rotuloStatus, statusColor } from '@/core/functions/format'
import type { StatusConsulta } from '@/core/interfaces/types'

export function CardBooking({
  petName,
  when,
  vetName,
  reason,
  status,
  open,
  onReschedule,
  onCancel,
}: {
  petName?: string
  when: string
  vetName?: string
  reason: string
  status: StatusConsulta
  open: boolean
  onReschedule: () => void
  onCancel: () => void
}) {
  return (
    <Card title={petName ?? 'Pet'} titleColor="#7434d6" borderRadius="16px">
      <Group justify="space-between" align="center" p="md">
        <div>
          <Badge color={statusColor(status)} variant="light">
            {rotuloStatus(status)}
          </Badge>
          <Text size="sm" c="dimmed" mt={6}>
            {dataHora(when)} · {vetName}
          </Text>
          <Text size="sm" c="dimmed">
            {reason}
          </Text>
        </div>
        {open && (
          <Group gap="xs">
            <Button variant="outline" color="#7434d6" onClick={onReschedule}>
              Remarcar
            </Button>
            <Button variant="light" color="red" onClick={onCancel}>
              Cancelar
            </Button>
          </Group>
        )}
      </Group>
    </Card>
  )
}
