'use client'

import { Card } from '@grazziotin/react-components-next/ui'
import { Text } from '@mantine/core'

export function CardMetric({ label, value }: { label: string; value: string }) {
  return (
    <Card title={label} titleColor="#7434d6" borderRadius="16px">
      <Text fw={600} size="xl" c="#7434d6" p="md">
        {value}
      </Text>
    </Card>
  )
}
