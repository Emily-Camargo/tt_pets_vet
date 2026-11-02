'use client'

import { Text } from '@mantine/core'

export function EmptyState({ text }: { text: string }) {
  return (
    <Text
      c="dimmed"
      size="sm"
      ta="center"
      py={40}
      style={{
        border: '1px dashed #e2e8f0',
        borderRadius: 16,
        background: '#fff',
      }}
    >
      {text}
    </Text>
  )
}
