'use client'

import { Card } from '@grazziotin/react-components-next/ui'
import { Text } from '@mantine/core'

export function CardClient({
  name,
  email,
  pets,
}: {
  name: string
  email?: string
  pets: string[]
}) {
  return (
    <Card title={name} titleColor="#7434d6" borderRadius="16px">
      <div className="space-y-2 p-4">
        <Text size="sm" c="dimmed">
          {email}
        </Text>
        {pets.map((pet) => (
          <Text key={pet} size="sm" className="rounded-xl bg-slate-50 px-3 py-2">
            {pet}
          </Text>
        ))}
      </div>
    </Card>
  )
}
