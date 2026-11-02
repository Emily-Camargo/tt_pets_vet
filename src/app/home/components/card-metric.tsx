'use client'

import { Card } from '@grazziotin/react-components-next/ui'
import { Text } from '@mantine/core'

export function CardMetric({
  label,
  value,
  detail,
}: {
  label: string
  value: string
  detail: string
}) {
  return (
    <Card title={label} titleColor="#7434d6" borderRadius="16px">
      <div className="p-4">
        <Text fw={700} size="xl">
          {value}
        </Text>
        <Text size="xs" c="dimmed">
          {detail}
        </Text>
      </div>
    </Card>
  )
}
