'use client'

import { Card } from '@grazziotin/react-components-next/ui'
import { Badge, Button, Group, Text } from '@mantine/core'
import Link from 'next/link'

import { dataHora, rotuloStatus, statusColor } from '@/core/functions/format'

export function CardCare({
  id,
  petName,
  tutorName,
  when,
  reason,
  status,
}: {
  id: string
  petName?: string
  tutorName?: string
  when: string
  reason: string
  status: Parameters<typeof rotuloStatus>[0]
}) {
  return (
    <Card title={petName ?? 'Pet'} titleColor="#7434d6" borderRadius="16px">
      <Group justify="space-between" p="md">
        <div>
          <Badge color={statusColor(status)} variant="light">
            {rotuloStatus(status)}
          </Badge>
          <Text size="sm" c="dimmed" mt={6}>
            {dataHora(when)} · {tutorName} · {reason}
          </Text>
        </div>
        <Button component={Link} href={`/veterinarian/appointments/${id}`} color="#7434d6">
          Abrir atendimento
        </Button>
      </Group>
    </Card>
  )
}
