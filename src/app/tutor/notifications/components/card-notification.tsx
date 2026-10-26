'use client'

import { Card } from '@grazziotin/react-components-next/ui'
import { Button, Group, Text } from '@mantine/core'

export function CardNotification({
  title,
  text,
  when,
  onOpen,
  onDelete,
}: {
  title: string
  text: string
  when: string
  onOpen: () => void
  onDelete: () => void
}) {
  return (
    <Card title={title} titleColor="#7434d6" borderRadius="16px">
      <Group justify="space-between" align="flex-start" p="md">
        <button type="button" className="min-w-0 flex-1 text-left" onClick={onOpen}>
          <Text size="sm">{text}</Text>
          <Text size="xs" c="dimmed" mt={4}>
            {when}
          </Text>
        </button>
        <Button variant="light" color="red" onClick={onDelete}>
          Excluir
        </Button>
      </Group>
    </Card>
  )
}
