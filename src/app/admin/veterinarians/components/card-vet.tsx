'use client'

import { Card } from '@grazziotin/react-components-next/ui'
import { Badge, Button, Group, Text } from '@mantine/core'

export function CardVet({
  name,
  active,
  detail,
  email,
  cities,
  onEdit,
}: {
  name: string
  active: boolean
  detail: string
  email?: string
  cities: string
  onEdit: () => void
}) {
  return (
    <Card title={name} titleColor="#7434d6" borderRadius="16px">
      <Group justify="space-between" align="center" p="md">
        <div>
          <Badge color={active ? 'teal' : 'yellow'}>{active ? 'Ativo' : 'Inativo'}</Badge>
          <Text size="sm" c="dimmed" mt={6}>
            {detail}
          </Text>
          <Text size="sm" c="dimmed">
            {email}
          </Text>
          <Text size="sm" c="dimmed">
            {cities}
          </Text>
        </div>
        <Button variant="outline" color="#7434d6" onClick={onEdit}>
          Editar
        </Button>
      </Group>
    </Card>
  )
}
