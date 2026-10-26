'use client'

import { Card } from '@grazziotin/react-components-next/ui'
import { Button, Group, Text } from '@mantine/core'

export function CardPet({
  name,
  photo,
  detail,
  birth,
  plan,
  onEdit,
  onDelete,
}: {
  name: string
  photo?: string
  detail: string
  birth: string
  plan: string
  onEdit: () => void
  onDelete: () => void
}) {
  return (
    <Card title={name} titleColor="#7434d6" borderRadius="16px">
      <Group align="flex-start" p="md" wrap="nowrap">
        <div className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-2xl bg-[#f6f1fc] text-xl font-semibold text-[#7434d6]">
          {photo ? <img src={photo} alt="" className="h-full w-full object-cover" /> : name.slice(0, 1)}
        </div>
        <div>
          <Text size="sm" c="dimmed">
            {detail}
          </Text>
          <Text size="sm" c="dimmed">
            {birth}
          </Text>
          <Text size="sm" fw={600} c="#7434d6" mt={4}>
            {plan}
          </Text>
          <Group mt="sm" gap="xs">
            <Button variant="outline" color="#7434d6" onClick={onEdit}>
              Editar
            </Button>
            <Button variant="light" color="red" onClick={onDelete}>
              Excluir
            </Button>
          </Group>
        </div>
      </Group>
    </Card>
  )
}
