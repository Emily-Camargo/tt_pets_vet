'use client'

import { Badge, Button, Group, Progress, Text } from '@mantine/core'
import { useMemo, useState } from 'react'
import { FiDownload, FiFileText } from 'react-icons/fi'
import { LuPill } from 'react-icons/lu'

import { initials, petTone } from '@/app/tutor/appointments/utils/functions'
import { PageHeader } from '@/core/components/page-header'
import { cx, dataCurta } from '@/core/functions/format'
import { feedback } from '@/core/functions/feedback'
import { useUsuario } from '@/core/hooks/use-session'

import {
  activePrescriptions,
  buildTimeline,
  kindColor,
  kindLabel,
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
            variant="light"
            color="gray"
            leftSection={<FiDownload size={14} />}
            onClick={() =>
              feedback('', 'Exportação disponível no protótipo em breve.')
            }
          >
            Exportar histórico
          </Button>
        }
      />

      <Group gap="xs" wrap="wrap">
        <Button
          radius="xl"
          size="compact-sm"
          variant={petId === 'all' ? 'gradient' : 'light'}
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
            size="compact-sm"
            variant={petId === pet.id ? 'gradient' : 'light'}
            gradient={
              petId === pet.id
                ? { from: '#7434d6', to: '#a855f7', deg: 135 }
                : undefined
            }
            color={petId === pet.id ? undefined : 'gray'}
            onClick={() => setPetId(pet.id)}
            leftSection={
              <div
                className={cx(
                  'grid h-5 w-5 place-items-center rounded-full text-[10px] font-semibold',
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

      <div className="grid w-full gap-4 lg:gap-6 xl:grid-cols-[minmax(0,1fr)_340px]">
        <div className="min-w-0 rounded-3xl border border-slate-100 bg-white p-4 shadow-sm sm:p-5">
          <Group gap="xs" mb="md" wrap="wrap">
            {FILTERS.map((item) => (
              <Button
                key={item.id}
                radius="xl"
                size="compact-sm"
                variant={filter === item.id ? 'gradient' : 'light'}
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
            <div className="rounded-2xl border border-dashed border-slate-200 bg-[#faf7ff] px-6 py-14 text-center">
              <Text size="sm" c="#94a3b8">
                Nenhum registro neste filtro.
              </Text>
            </div>
          ) : (
            <div className="grid gap-3">
              {visible.map((entry) => {
                const pet = pets.find((item) => item.id === entry.petId)
                const petIndex = Math.max(
                  0,
                  pets.findIndex((item) => item.id === entry.petId),
                )
                return (
                  <div
                    key={entry.id}
                    className="rounded-2xl border border-slate-100 bg-[#fcfbfe] px-4 py-4 transition hover:border-[#e4d4f7] hover:bg-white"
                  >
                    <div className="flex flex-row gap-3 max-sm:flex-col">
                      <div className="w-24 shrink-0 max-sm:w-auto">
                        <Text size="xs" fw={500} c="#94a3b8">
                          {timelineDate(entry.when)}
                        </Text>
                      </div>

                      <div className="min-w-0 flex-1">
                        <Group gap="sm" wrap="wrap" align="center">
                          <div
                            className={cx(
                              'grid h-8 w-8 place-items-center rounded-lg text-[10px] font-semibold',
                              petTone(petIndex),
                            )}
                          >
                            {initials(pet?.nome ?? 'P')}
                          </div>
                          <Text size="sm" fw={600} c="#475569">
                            {entry.title}
                          </Text>
                          <Badge
                            color={kindColor(entry.kind)}
                            variant="light"
                            radius="xl"
                            size="sm"
                          >
                            {kindLabel(entry.kind)}
                          </Badge>
                        </Group>

                        {(entry.vetName || pet) && (
                          <Text size="xs" c="#94a3b8" mt={6}>
                            {entry.vetName ?? 'Veterinário'} · em domicílio
                            {pet ? ` · ${pet.nome}` : ''}
                          </Text>
                        )}

                        {entry.summary && (
                          <Text size="sm" c="#64748b" mt={10}>
                            {entry.summary}
                          </Text>
                        )}

                        {entry.prescriptions &&
                          entry.prescriptions.length > 0 && (
                            <div className="mt-3 space-y-2 rounded-xl border border-slate-100 bg-white px-3 py-3">
                              {entry.prescriptions.map((item) => (
                                <div
                                  key={`${entry.id}-${item.nome}`}
                                  className="flex items-start gap-2"
                                >
                                  <LuPill
                                    size={14}
                                    className="mt-0.5 shrink-0 text-[#a78bfa]"
                                  />
                                  <Text size="sm" c="#475569">
                                    {item.nome}
                                    {item.uso ? (
                                      <Text span size="sm" c="#94a3b8">
                                        {' '}
                                        · {item.uso}
                                      </Text>
                                    ) : null}
                                  </Text>
                                </div>
                              ))}
                            </div>
                          )}

                        {entry.examName && (
                          <div className="mt-3 flex items-start gap-2 rounded-xl border border-slate-100 bg-white px-3 py-3">
                            <FiFileText
                              size={14}
                              className="mt-0.5 shrink-0 text-[#38bdf8]"
                            />
                            <Text size="sm" c="#475569">
                              {entry.examName}
                              {entry.examResult ? (
                                <Text span size="sm" c="#94a3b8">
                                  {' '}
                                  · {entry.examResult}
                                </Text>
                              ) : null}
                            </Text>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        <div className="h-fit rounded-3xl border border-slate-100 bg-white p-4 shadow-sm sm:p-5 xl:sticky xl:top-20">
          <Group justify="space-between" mb="md">
            <Text size="sm" fw={600} c="#64748b">
              Receitas ativas
            </Text>
            <Button
              variant="subtle"
              color="violet"
              size="compact-sm"
              onClick={() => setFilter('receita')}
            >
              Todas
            </Button>
          </Group>

          {actives.length === 0 ? (
            <Text size="sm" c="#94a3b8">
              Nenhuma receita em uso.
            </Text>
          ) : (
            <div className="space-y-3">
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
                    className="rounded-2xl border border-slate-100 bg-[#fcfbfe] p-4"
                  >
                    <Group justify="space-between" align="flex-start" gap="sm">
                      <Text size="sm" fw={600} c="#475569" className="min-w-0">
                        {item.nome}
                      </Text>
                      <Badge color="teal" variant="light" radius="xl" size="sm">
                        Em uso
                      </Badge>
                    </Group>
                    <Text size="xs" c="#94a3b8" mt={6}>
                      {pet?.nome}
                      {item.uso ? ` · ${item.uso}` : ''}
                    </Text>
                    {progress.total > 0 && (
                      <>
                        <Progress
                          value={progress.percent}
                          color="#7434d6"
                          size="sm"
                          radius="xl"
                          mt="md"
                        />
                        <Group justify="space-between" mt={8}>
                          <Text size="xs" c="#94a3b8">
                            Dia {progress.current} de {progress.total}
                          </Text>
                          <Text size="xs" c="#94a3b8">
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
            variant="light"
            color="violet"
            fullWidth
            mt="lg"
            leftSection={<FiDownload size={14} />}
            onClick={() =>
              feedback('', 'PDF disponível no protótipo em breve.')
            }
          >
            Baixar receita (PDF)
          </Button>
        </div>
      </div>
    </div>
  )
}
