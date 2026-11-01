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
        <Button
          variant="subtle"
          color="gray"
          onClick={onOpen}
          className="min-w-0 flex-1"
          styles={{
            root: { height: 'auto', padding: 0 },
            inner: { justifyContent: 'flex-start' },
            label: { whiteSpace: 'normal', textAlign: 'left' },
          }}
        >
          <div className="min-w-0 text-left">
            <Text size="sm">{text}</Text>
            <Text size="xs" c="dimmed" mt={4}>
              {when}
            </Text>
          </div>
        </Button>
        <Button variant="light" color="red" onClick={onDelete}>
          Excluir
        </Button>
      </Group>
    </Card>
  )
}
