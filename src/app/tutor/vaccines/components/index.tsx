'use client'

import {
  Badge,
  Button,
  Group,
  NativeSelect,
  Progress,
  Text,
  Title,
} from '@mantine/core'
import { useMemo, useState } from 'react'
import {
  FiAlertTriangle,
  FiCheckCircle,
  FiClock,
  FiDownload,
} from 'react-icons/fi'
import { LuSyringe } from 'react-icons/lu'

import { Metric } from '@/app/home/components/frame'
import { ageLabel, petEmoji } from '@/app/tutor/pets/utils/functions'
import { PageHeader } from '@/core/components/page-header'
import { dataCurta } from '@/core/functions/format'
import { feedback } from '@/core/functions/feedback'
import { useUsuario } from '@/core/hooks/use-session'

import { VaccineForm } from './vaccine-form'
import {
  appliedCount,
  dateStamp,
  dueInDays,
  formatChip,
  nextDoseSummary,
  overdueCount,
  protocolCoverage,
  remainingLabel,
  statusColor,
  statusLabel,
  upcomingDoses,
  vaccineStatus,
} from '../utils/functions'

const FILTERS = [
  'Todas',
  'Em dia',
  'Concluída',
  'Recomendada',
  'Atrasada',
] as const

export function Vaccines() {
  const { banco, usuario } = useUsuario()
  const tutorId = usuario?.tutorId ?? ''
  const tutor = banco.tutores.find((item) => item.id === tutorId)
  const pets = banco.pets.filter((item) => item.tutorId === tutorId)
  const [petId, setPetId] = useState(pets[0]?.id ?? '')
  const [open, setOpen] = useState(false)
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>('Todas')

  const pet = pets.find((item) => item.id === petId)
  const vaccines = banco.vacinas.filter((item) => item.petId === petId)
  const nextDose = nextDoseSummary(vaccines)
  const coverage = protocolCoverage(vaccines)
  const upcoming = upcomingDoses(vaccines).slice(0, 4)
  const cityName =
    banco.cidades.find(
      (item) =>
        item.id ===
        banco.assinaturas.find(
          (sub) => sub.petId === petId && sub.status === 'ativa',
        )?.cidadeId,
    )?.nome ?? 'Passo Fundo'

  const rows = useMemo(() => {
    return vaccines.filter((item) => {
      if (filter === 'Todas') return true
      return statusLabel(vaccineStatus(item)) === filter
    })
  }, [vaccines, filter])

  if (!pet) {
    return (
      <div className="rounded-3xl border border-dashed border-slate-200 bg-white px-6 py-12 text-center">
        <Text size="sm" c="#94a3b8">
          Cadastre um pet para ver a carteira de vacinação.
        </Text>
      </div>
    )
  }

  return (
    <div
      className="grid gap-4"
      style={{ animation: 'tt-surgir 0.6s ease both' }}
    >
      <PageHeader
        eyebrow="Tutor"
        title="Carteira de vacinação"
        description="Doses aplicadas, próximas doses e lembretes de cada pet."
        actions={
          <>
            <Button
              radius="xl"
              variant="light"
              color="gray"
              leftSection={<FiDownload size={14} />}
              onClick={() =>
                feedback('', 'PDF disponível no protótipo em breve.')
              }
            >
              Baixar PDF
            </Button>
            <Button
              radius="xl"
              variant="gradient"
              gradient={{ from: '#7434d6', to: '#ec4899', deg: 135 }}
              onClick={() => setOpen(true)}
            >
              + Agendar vacina
            </Button>
          </>
        }
      />

      <Group gap="xs" wrap="wrap">
        {pets.map((item) => {
          const alert = dueInDays(
            banco.vacinas.filter((vaccine) => vaccine.petId === item.id),
            30,
          )
          const active = item.id === petId
          return (
            <Button
              key={item.id}
              radius="xl"
              size="compact-sm"
              variant={active ? 'gradient' : 'light'}
              gradient={
                active
                  ? { from: '#7434d6', to: '#a855f7', deg: 135 }
                  : undefined
              }
              color={active ? undefined : 'gray'}
              onClick={() => setPetId(item.id)}
              leftSection={<Text size="sm">{petEmoji(item.especie)}</Text>}
              rightSection={
                alert > 0 ? (
                  <Badge color="orange" size="sm" circle>
                    {alert}
                  </Badge>
                ) : undefined
              }
            >
              {item.nome}
            </Button>
          )
        })}
      </Group>

      <div className="rounded-3xl border border-[#e4d4f7] bg-linear-to-br from-white via-[#faf7ff] to-[#f3e8ff] px-5 py-5 sm:px-6">
        <div className="flex flex-row items-center justify-between gap-4 max-md:flex-col max-md:items-start">
          <div className="flex min-w-0 items-center gap-4">
            <div className="grid h-16 w-16 shrink-0 place-items-center overflow-hidden rounded-full bg-white text-3xl shadow-sm ring-1 ring-[#e4d4f7]">
              {pet.foto ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={pet.foto}
                  alt=""
                  className="h-full w-full object-cover"
                />
              ) : (
                petEmoji(pet.especie)
              )}
            </div>
            <div className="min-w-0">
              <Text
                size="xs"
                fw={500}
                tt="uppercase"
                c="#7434d6"
                style={{ letterSpacing: '0.14em' }}
              >
                Carteira de vacinação
              </Text>
              <Title order={4} fw={600} c="#475569" mt={4}>
                {pet.nome}
              </Title>
              <Text size="sm" c="#94a3b8" mt={4}>
                {pet.raca} · {pet.sexo} · {ageLabel(pet.nascimento)} ·{' '}
                {pet.peso} kg · {formatChip(pet.microchip)}
              </Text>
            </div>
          </div>
          <div className="text-left md:text-right">
            <Text size="sm" c="#64748b">
              Tutora {tutor?.nome ?? usuario?.nome}
            </Text>
            <Text size="xs" c="#94a3b8" mt={2}>
              Clínica TT Pets · {cityName}
            </Text>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-3 max-md:grid-cols-2 max-sm:grid-cols-1">
        <Metric
          icon={<FiCheckCircle size={18} />}
          tone="bg-emerald-50 text-emerald-600"
          label="Doses aplicadas"
          value={String(appliedCount(vaccines))}
          detail="registradas na carteira"
        />
        <Metric
          icon={<LuSyringe size={18} />}
          tone="bg-sky-50 text-sky-600"
          label="Próxima dose"
          value={nextDose.value}
          detail={nextDose.detail}
        />
        <Metric
          icon={<FiClock size={18} />}
          tone="bg-amber-50 text-amber-600"
          label="A vencer em 30 dias"
          value={String(dueInDays(vaccines, 30))}
          detail="reforços próximos"
        />
        <Metric
          icon={<FiAlertTriangle size={18} />}
          tone="bg-rose-50 text-rose-500"
          label="Atrasadas"
          value={String(overdueCount(vaccines))}
          detail="precisam de atenção"
        />
      </div>

      <div className="grid w-full gap-4 lg:gap-6 xl:grid-cols-[minmax(0,1fr)_340px]">
        <div className="min-w-0 rounded-3xl border border-slate-100 bg-white p-4 shadow-sm sm:p-5">
          <Group justify="space-between" mb="md" wrap="wrap" gap="sm">
            <Text size="sm" fw={600} c="#64748b">
              Histórico de vacinas
            </Text>
            <NativeSelect
              value={filter}
              onChange={(event) =>
                setFilter(event.currentTarget.value as (typeof FILTERS)[number])
              }
              data={[...FILTERS]}
              radius="xl"
              size="xs"
              className="w-40"
              styles={{
                input: {
                  borderColor: '#e2e8f0',
                  backgroundColor: '#f8fafc',
                },
              }}
            />
          </Group>

          <div className="-mx-1 overflow-x-auto px-1">
            <table className="min-w-[640px] w-full text-left">
              <thead>
                <tr className="border-b border-slate-100">
                  {[
                    'Vacina',
                    'Dose',
                    'Aplicada em',
                    'Próxima',
                    'Veterinário',
                    'Status',
                  ].map((label) => (
                    <th key={label} className="py-3 pr-3">
                      <Text
                        size="xs"
                        fw={500}
                        c="#94a3b8"
                        tt="uppercase"
                        style={{ letterSpacing: '0.06em' }}
                      >
                        {label}
                      </Text>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map((item) => {
                  const status = vaccineStatus(item)
                  const vet = banco.veterinarios.find(
                    (current) => current.id === item.veterinarioId,
                  )
                  return (
                    <tr
                      key={item.id}
                      className="border-b border-slate-50 last:border-b-0"
                    >
                      <td className="py-3.5 pr-3">
                        <Text size="sm" fw={600} c="#475569">
                          {item.nome}
                        </Text>
                        <Text size="xs" c="#94a3b8">
                          {item.lote ? `Lote ${item.lote}` : 'Sem lote'}
                        </Text>
                      </td>
                      <td className="py-3.5 pr-3">
                        <Text size="sm" c="#64748b">
                          {item.dose ?? '—'}
                        </Text>
                      </td>
                      <td className="py-3.5 pr-3">
                        <Text size="sm" c="#64748b">
                          {item.aplicadaEm ? dataCurta(item.aplicadaEm) : '—'}
                        </Text>
                      </td>
                      <td className="py-3.5 pr-3">
                        <Text size="sm" c="#64748b">
                          {item.proximaDose ? dataCurta(item.proximaDose) : '—'}
                        </Text>
                      </td>
                      <td className="py-3.5 pr-3">
                        <Text size="sm" c="#64748b">
                          {vet?.nome ?? '—'}
                        </Text>
                      </td>
                      <td className="py-3.5">
                        <Badge
                          color={statusColor(status)}
                          variant="light"
                          radius="xl"
                          size="sm"
                        >
                          {statusLabel(status)}
                        </Badge>
                      </td>
                    </tr>
                  )
                })}
                {rows.length === 0 && (
                  <tr>
                    <td colSpan={6} className="py-10 text-center">
                      <Text size="sm" c="#94a3b8">
                        Nenhuma vacina neste filtro.
                      </Text>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="grid gap-4">
          <div className="rounded-3xl border border-slate-100 bg-white p-5 shadow-sm">
            <Group justify="space-between" mb="sm">
              <Text size="sm" fw={600} c="#64748b">
                Próximas doses
              </Text>
              <Text size="xs" fw={500} c="#7434d6">
                Lembretes
              </Text>
            </Group>
            {upcoming.length === 0 ? (
              <Text size="sm" c="#94a3b8">
                Nenhuma dose marcada.
              </Text>
            ) : (
              <div className="divide-y divide-slate-100">
                {upcoming.map((item) => {
                  const stamp = dateStamp(item.proximaDose!)
                  return (
                    <div key={item.id} className="flex items-center gap-3 py-3">
                      <div className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-marca-clara text-center leading-tight">
                        <Text size="xs" fw={600} c="#7434d6" tt="uppercase">
                          {stamp.month}
                        </Text>
                        <Text size="sm" fw={600} c="#475569">
                          {stamp.day}
                        </Text>
                      </div>
                      <div className="min-w-0">
                        <Text size="sm" fw={600} c="#475569">
                          {item.nome}
                        </Text>
                        <Text size="xs" c="#94a3b8">
                          {remainingLabel(item.days)}
                        </Text>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>

          <div className="rounded-3xl border border-slate-100 bg-white p-5 shadow-sm">
            <Text size="sm" fw={600} c="#64748b">
              Cobertura do protocolo
            </Text>
            <Text size="sm" c="#94a3b8" mt={8}>
              {coverage.covered} de {coverage.recommended} vacinas recomendadas
            </Text>
            <Progress
              value={coverage.percent}
              color="#7434d6"
              size="sm"
              radius="xl"
              mt="md"
            />
            <Text size="xs" c="#94a3b8" mt={12}>
              Complete as doses recomendadas para manter a proteção em dia.
            </Text>
            <Button
              radius="xl"
              variant="light"
              color="violet"
              fullWidth
              mt="md"
              onClick={() => setOpen(true)}
            >
              Agendar visita para vacinar
            </Button>
          </div>
        </div>
      </div>

      <VaccineForm
        open={open}
        petId={petId}
        tutorId={tutorId}
        onClose={() => setOpen(false)}
      />
    </div>
  )
}
