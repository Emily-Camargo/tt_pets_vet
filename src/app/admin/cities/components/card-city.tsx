'use client'

import { Card } from '@grazziotin/react-components-next/ui'
import { Button, Group, Text } from '@mantine/core'

export function CardCity({
  title,
  detail,
  onEdit,
  onDelete,
}: {
  title: string
  detail: string
  onEdit: () => void
  onDelete: () => void
}) {
  return (
    <Card title={title} titleColor="#7434d6" borderRadius="16px">
      <Group justify="space-between" align="center" p="sm">
        <Text size="sm" c="dimmed">
          {detail}
        </Text>
        <Group gap="xs">
          <Button variant="outline" color="#7434d6" onClick={onEdit}>
            Editar
          </Button>
          <Button variant="light" color="red" onClick={onDelete}>
            Excluir
          </Button>
        </Group>
      </Group>
    </Card>
  )
}
