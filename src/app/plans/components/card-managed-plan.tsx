'use client'

import { Card } from '@grazziotin/react-components-next/ui'
import { Badge, Button, Group, Text } from '@mantine/core'

export function CardManagedPlan({
  name,
  highlight,
  active,
  detail,
  price,
  onEdit,
  onToggle,
}: {
  name: string
  highlight: boolean
  active: boolean
  detail: string
  price: string
  onEdit: () => void
  onToggle: () => void
}) {
  return (
    <Card title={name} titleColor="#7434d6" borderRadius="16px">
      <Group justify="space-between" align="center" p="md">
        <div>
          <Group gap="xs">
            {highlight && <Badge color="violet">Mais vendido</Badge>}
            <Badge color={active ? 'teal' : 'yellow'}>
              {active ? 'Ativo' : 'Inativo'}
            </Badge>
          </Group>
          <Text size="sm" c="dimmed" mt={6}>
            {detail}
          </Text>
          <Text size="sm" fw={700} c="#7434d6">
            {price}
          </Text>
        </div>
        <Group gap="xs">
          <Button variant="outline" color="#7434d6" onClick={onEdit}>
            Editar
          </Button>
          <Button variant="light" color="red" onClick={onToggle}>
            {active ? 'Inativar' : 'Ativar'}
          </Button>
        </Group>
      </Group>
    </Card>
  )
}
