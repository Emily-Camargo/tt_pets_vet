'use client'

import { Card } from '@grazziotin/react-components-next/ui'
import { Text } from '@mantine/core'
import Link from 'next/link'

export function CardShortcut({ href, label }: { href: string; label: string }) {
  return (
    <Link href={href}>
      <Card title={label} titleColor="#7434d6" borderRadius="16px" className="cursor-pointer">
        <Text size="sm" c="dimmed" p="md">
          Abrir
        </Text>
      </Card>
    </Link>
  )
}
