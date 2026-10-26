'use client'

import { Card } from '@grazziotin/react-components-next/ui'
import { Badge, Button, Group, Text } from '@mantine/core'

import { dataHora, rotuloStatus, statusColor } from '@/core/functions/format'

import type { AppointmentCardProps } from '../utils/interfaces'

export function CardAppointment({
  appointment,
  petName,
  tutorName,
  vetName,
  open,
  onConfirm,
  onReschedule,
  onCancel,
}: AppointmentCardProps) {
  return (
    <Card
      title={`${dataHora(appointment.dataHora)} · ${petName ?? 'Pet'}`}
      titleColor="#7434d6"
      borderRadius="16px"
    >
      <Group justify="space-between" align="center" p="sm">
        <div>
          <Badge color={statusColor(appointment.status)} variant="light">
            {rotuloStatus(appointment.status)}
          </Badge>
          <Text size="sm" c="dimmed" mt={6}>
            {tutorName} · {vetName} · {appointment.motivo}
          </Text>
        </div>
        {open && (
          <Group gap="xs">
            <Button variant="outline" color="#7434d6" onClick={onConfirm}>
              Confirmar
            </Button>
            <Button variant="outline" color="gray" onClick={onReschedule}>
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
