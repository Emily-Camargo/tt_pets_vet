'use client'

import { Card } from '@grazziotin/react-components-next/ui'
import { Text } from '@mantine/core'

export function CardVaccine({ name, detail }: { name: string; detail: string }) {
  return (
    <Card title={name} titleColor="#7434d6" borderRadius="16px">
      <Text size="sm" c="dimmed" p="md">
        {detail}
      </Text>
    </Card>
  )
}
