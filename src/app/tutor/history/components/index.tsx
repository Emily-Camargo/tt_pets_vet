'use client'

import { Badge, Button, Group, Text, Title } from '@mantine/core'
import { useMemo, useState } from 'react'

import { initials, petTone } from '@/app/tutor/appointments/utils/functions'
import { PageHeader } from '@/core/components/page-header'
import { cx, dataCurta } from '@/core/functions/format'
import { feedback } from '@/core/functions/feedback'
import { useUsuario } from '@/core/hooks/use-session'

import {
  activePrescriptions,
  buildTimeline,
  kindLabel,
  kindTone,
  progressDays,
  timelineDate,
  type HistoryKind,
} from '../utils/functions'

const FILTERS: Array<{ id: 'all' | HistoryKind; label: string }> = [
  { id: 'all', label: 'Tudo' },
  { id: 'consulta', label: 'Consultas' },
  { id: 'receita', label: 'Receitas' },
  { id: 'vacina', label: 'Vacinas' },
  { id: 'exame', label: 'Exames' },
]

export function History() {
  const { banco, usuario } = useUsuario()
  const tutorId = usuario?.tutorId ?? ''
  const pets = banco.pets.filter((item) => item.tutorId === tutorId)
  const [petId, setPetId] = useState('all')
  const [filter, setFilter] = useState<'all' | HistoryKind>('all')

  const petIds =
    petId === 'all'
      ? pets.map((item) => item.id)
      : pets.filter((item) => item.id === petId).map((item) => item.id)

  const timeline = useMemo(() => buildTimeline(banco, petIds), [banco, petIds])
  const visible = timeline.filter(
    (item) => filter === 'all' || item.kind === filter,
  )
  const actives = activePrescriptions(banco, petIds)

  return (
    <div
      className="grid gap-4"
      style={{ animation: 'tt-surgir 0.6s ease both' }}
    >
      <PageHeader
        eyebrow="Tutor"
        title="Histórico e receitas"
        description="Tudo o que foi feito em cada atendimento, com as receitas para baixar."
        actions={
          <Button
            radius="xl"
            variant="default"
            onClick={() =>
              feedback('', 'Exportação disponível no protótipo em breve.')
            }
          >
            ↓ Exportar histórico
          </Button>
        }
      />

      <Group gap="sm">
        <Button
          radius="xl"
          variant={petId === 'all' ? 'gradient' : 'default'}
          gradient={
            petId === 'all'
              ? { from: '#7434d6', to: '#a855f7', deg: 135 }
              : undefined
          }
          color={petId === 'all' ? undefined : 'gray'}
          onClick={() => setPetId('all')}
        >
          Todos os pets
        </Button>
        {pets.map((pet, index) => (
          <Button
            key={pet.id}
            radius="xl"
            color="#7434d6"
            variant={petId === pet.id ? 'light' : 'default'}
            onClick={() => setPetId(pet.id)}
            leftSection={
              <div
                className={cx(
                  'grid h-6 w-6 place-items-center rounded-full text-[10px] font-bold',
                  petTone(index),
                )}
              >
                {initials(pet.nome)}
              </div>
            }
          >
            {pet.nome}
          </Button>
        ))}
      </Group>

      <div className="grid w-full gap-4 lg:gap-6 xl:grid-cols-[minmax(0,1fr)_380px]">
        <div className="rounded-3xl border border-slate-100 bg-white p-5 shadow-sm">
          <Group gap="sm" mb="md">
            {FILTERS.map((item) => (
              <Button
                key={item.id}
                radius="xl"
                size="compact-sm"
                variant={filter === item.id ? 'gradient' : 'default'}
                gradient={
                  filter === item.id
                    ? { from: '#7434d6', to: '#a855f7', deg: 135 }
                    : undefined
                }
                color={filter === item.id ? undefined : 'gray'}
                onClick={() => setFilter(item.id)}
              >
                {item.label}
              </Button>
            ))}
          </Group>

          {visible.length === 0 ? (
            <Text py={40} ta="center" size="sm" c="dimmed">
              Nenhum registro neste filtro.
            </Text>
          ) : (
            <div className="divide-y divide-slate-100">
              {visible.map((entry) => {
                const pet = pets.find((item) => item.id === entry.petId)
                const petIndex = Math.max(
                  0,
                  pets.findIndex((item) => item.id === entry.petId),
                )
                return (
                  <div key={entry.id} className="flex gap-4 py-5">
                    <Text
                      size="sm"
                      fw={500}
                      c="dimmed"
                      className="w-24 shrink-0"
                    >
                      {timelineDate(entry.when)}
                    </Text>
                    <div className="min-w-0 flex-1">
                      <Group gap="sm" wrap="wrap">
                        <div
                          className={cx(
                            'grid h-8 w-8 place-items-center rounded-lg text-[10px] font-bold',
                            petTone(petIndex),
                          )}
                        >
                          {initials(pet?.nome ?? 'P')}
                        </div>
                        <Title order={5}>{entry.title}</Title>
                        <Badge
                          className={kindTone(entry.kind)}
                          variant="light"
                          radius="xl"
                        >
                          {kindLabel(entry.kind)}
                        </Badge>
                      </Group>
                      {(entry.vetName || pet) && (
                        <Text size="sm" c="dimmed" mt={4}>
                          {entry.vetName ?? 'Veterinário'} · em domicílio
                        </Text>
                      )}
                      {entry.summary && (
                        <Text size="sm" mt={8}>
                          {entry.summary}
                        </Text>
                      )}
                      {entry.prescriptions &&
                        entry.prescriptions.length > 0 && (
                          <div className="mt-3 space-y-2 rounded-2xl bg-slate-50 p-3">
                            {entry.prescriptions.map((item) => (
                              <Group key={`${entry.id}-${item.nome}`} gap="xs">
                                <Text size="sm">💊</Text>
                                <Text size="sm">
                                  {item.nome}
                                  {item.uso ? ` · ${item.uso}` : ''}
                                </Text>
                              </Group>
                            ))}
                          </div>
                        )}
                      {entry.examName && (
                        <div className="mt-3 rounded-2xl bg-slate-50 p-3">
                          <Text size="sm">
                            📄 {entry.examName}
                            {entry.examResult ? ` · ${entry.examResult}` : ''}
                          </Text>
                        </div>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        <div className="rounded-3xl border border-slate-100 bg-white p-5 shadow-sm">
          <Group justify="space-between" mb="md">
            <Title order={4}>Receitas ativas</Title>
            <Button
              variant="subtle"
              color="#7434d6"
              size="compact-sm"
              onClick={() => setFilter('receita')}
            >
              Todas
            </Button>
          </Group>

          {actives.length === 0 ? (
            <Text size="sm" c="dimmed">
              Nenhuma receita em uso.
            </Text>
          ) : (
            <div className="space-y-4">
              {actives.flatMap((receita) => {
                const pet = pets.find((item) => item.id === receita.petId)
                const progress = progressDays(receita)
                const items =
                  receita.itens && receita.itens.length > 0
                    ? receita.itens
                    : [{ nome: receita.texto, uso: '' }]
                return items.map((item) => (
                  <div
                    key={`${receita.id}-${item.nome}`}
                    className="rounded-2xl border border-slate-100 p-4"
                  >
                    <Group justify="space-between" align="flex-start">
                      <Title order={5}>{item.nome}</Title>
                      <Badge color="teal" variant="light" radius="xl">
                        Em uso
                      </Badge>
                    </Group>
                    <Text size="sm" c="dimmed" mt={4}>
                      {pet?.nome}
                      {item.uso ? ` · ${item.uso}` : ''}
                    </Text>
                    {progress.total > 0 && (
                      <>
                        <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-100">
                          <div
                            className="h-full rounded-full bg-marca"
                            style={{ width: `${progress.percent}%` }}
                          />
                        </div>
                        <Group justify="space-between" mt={8}>
                          <Text size="xs" c="dimmed">
                            Dia {progress.current} de {progress.total}
                          </Text>
                          <Text size="xs" c="dimmed">
                            {receita.fim
                              ? `até ${dataCurta(receita.fim).slice(0, 5)}`
                              : ''}
                          </Text>
                        </Group>
                      </>
                    )}
                  </div>
                ))
              })}
            </div>
          )}

          <Button
            radius="xl"
            variant="default"
            fullWidth
            mt="lg"
            onClick={() =>
              feedback('', 'PDF disponível no protótipo em breve.')
            }
          >
            ↓ Baixar receita (PDF)
          </Button>
        </div>
      </div>

      <Text size="xs" c="dimmed" ta="center" pt={8}>
        Protótipo com dados de exemplo.
      </Text>
    </div>
  )
}
