'use client'

import {
  CheckCircleOutlined,
  HourglassEmpty,
  Vaccines as VaccineIcon,
  WarningAmber,
} from '@mui/icons-material'
import { Badge, Button, Group, Text, Title } from '@mantine/core'
import { useMemo, useState } from 'react'

import { Metric } from '@/app/home/components/frame'
import { ageLabel, petEmoji } from '@/app/tutor/pets/utils/functions'
import { PageHeader } from '@/core/components/page-header'
import { cx, dataCurta } from '@/core/functions/format'
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
  statusLabel,
  statusTone,
  upcomingDoses,
  vaccineStatus,
} from '../utils/functions'

export function Vaccines() {
  const { banco, usuario } = useUsuario()
  const tutorId = usuario?.tutorId ?? ''
  const tutor = banco.tutores.find((item) => item.id === tutorId)
  const pets = banco.pets.filter((item) => item.tutorId === tutorId)
  const [petId, setPetId] = useState(pets[0]?.id ?? '')
  const [open, setOpen] = useState(false)
  const [filter, setFilter] = useState('Todas')

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
        <Text size="sm" c="dimmed">
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
              variant="default"
              onClick={() =>
                feedback('', 'PDF disponível no protótipo em breve.')
              }
            >
              ↓ Baixar PDF
            </Button>
            <Button radius="xl" color="#7434d6" onClick={() => setOpen(true)}>
              + Agendar vacina
            </Button>
          </>
        }
      />

      <Group gap="sm">
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
              color="#7434d6"
              variant={active ? 'light' : 'default'}
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

      <div className="rounded-3xl bg-linear-to-r from-[#7434d6] to-[#8b5cf6] px-5 py-5 text-white sm:px-7">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-4">
            <div className="grid h-16 w-16 place-items-center overflow-hidden rounded-full bg-white/15 text-3xl">
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
            <div>
              <Text
                size="xs"
                fw={600}
                tt="uppercase"
                c="rgba(255,255,255,0.8)"
                style={{ letterSpacing: '0.16em' }}
              >
                Carteira de vacinação
              </Text>
              <Title order={3} c="white" mt={4}>
                {pet.nome}
              </Title>
              <Text size="sm" c="rgba(255,255,255,0.85)" mt={4}>
                {pet.raca} · {pet.sexo} · {ageLabel(pet.nascimento)} ·{' '}
                {pet.peso} kg · {formatChip(pet.microchip)}
              </Text>
            </div>
          </div>
          <div className="text-sm lg:text-right">
            <Text c="rgba(255,255,255,0.9)">
              Tutora {tutor?.nome ?? usuario?.nome}
            </Text>
            <Text c="rgba(255,255,255,0.75)">Clínica TT Pets · {cityName}</Text>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-3 max-md:grid-cols-2 max-sm:grid-cols-1">
        <Metric
          icon={<CheckCircleOutlined sx={{ fontSize: 18 }} />}
          tone="bg-emerald-50 text-emerald-600"
          label="Doses aplicadas"
          value={String(appliedCount(vaccines))}
          detail="registradas na carteira"
        />
        <Metric
          icon={<VaccineIcon sx={{ fontSize: 18 }} />}
          tone="bg-sky-50 text-sky-600"
          label="Próxima dose"
          value={nextDose.value}
          detail={nextDose.detail}
        />
        <Metric
          icon={<HourglassEmpty sx={{ fontSize: 18 }} />}
          tone="bg-amber-50 text-amber-600"
          label="A vencer em 30 dias"
          value={String(dueInDays(vaccines, 30))}
          detail="reforços próximos"
        />
        <Metric
          icon={<WarningAmber sx={{ fontSize: 18 }} />}
          tone="bg-rose-50 text-rose-500"
          label="Atrasadas"
          value={String(overdueCount(vaccines))}
          detail="precisam de atenção"
        />
      </div>

      <div className="grid w-full gap-4 lg:gap-6 xl:grid-cols-[minmax(0,1fr)_380px]">
        <div className="rounded-3xl border border-slate-100 bg-white p-5 shadow-sm">
          <Group justify="space-between" mb="md" wrap="wrap">
            <Title order={4}>Histórico de vacinas</Title>
            <select
              value={filter}
              onChange={(event) => setFilter(event.target.value)}
              className="rounded-full border border-slate-200 px-3 py-1.5 text-sm outline-none"
            >
              <option>Todas</option>
              <option>Em dia</option>
              <option>Concluída</option>
              <option>Recomendada</option>
              <option>Atrasada</option>
            </select>
          </Group>
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead>
                <tr className="border-b border-slate-100 text-xs tracking-wide text-slate-400 uppercase">
                  <th className="py-3 pr-3 font-semibold">Vacina</th>
                  <th className="py-3 pr-3 font-semibold">Dose</th>
                  <th className="py-3 pr-3 font-semibold">Aplicada em</th>
                  <th className="py-3 pr-3 font-semibold">Próxima</th>
                  <th className="py-3 pr-3 font-semibold">Veterinário</th>
                  <th className="py-3 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((item) => {
                  const status = vaccineStatus(item)
                  const vet = banco.veterinarios.find(
                    (current) => current.id === item.veterinarioId,
                  )
                  return (
                    <tr key={item.id} className="border-b border-slate-50">
                      <td className="py-3 pr-3">
                        <Text fw={600} size="sm">
                          {item.nome}
                        </Text>
                        <Text size="xs" c="dimmed">
                          {item.lote ? `Lote ${item.lote}` : 'Sem lote'}
                        </Text>
                      </td>
                      <td className="py-3 pr-3 text-slate-600">
                        {item.dose ?? '—'}
                      </td>
                      <td className="py-3 pr-3 text-slate-600">
                        {item.aplicadaEm ? dataCurta(item.aplicadaEm) : '—'}
                      </td>
                      <td className="py-3 pr-3 text-slate-600">
                        {item.proximaDose ? dataCurta(item.proximaDose) : '—'}
                      </td>
                      <td className="py-3 pr-3 text-slate-600">
                        {vet?.nome ?? '—'}
                      </td>
                      <td className="py-3">
                        <Badge
                          className={cx(statusTone(status))}
                          variant="light"
                          radius="xl"
                        >
                          {statusLabel(status)}
                        </Badge>
                      </td>
                    </tr>
                  )
                })}
                {rows.length === 0 && (
                  <tr>
                    <td colSpan={6} className="py-8 text-center">
                      <Text c="dimmed">Nenhuma vacina neste filtro.</Text>
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
              <Title order={4}>Próximas doses</Title>
              <Text size="sm" fw={500} c="#7434d6">
                Lembretes
              </Text>
            </Group>
            {upcoming.length === 0 ? (
              <Text size="sm" c="dimmed">
                Nenhuma dose marcada.
              </Text>
            ) : (
              <div className="divide-y divide-slate-100">
                {upcoming.map((item) => {
                  const stamp = dateStamp(item.proximaDose!)
                  return (
                    <Group key={item.id} gap="md" py="sm">
                      <div className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-marca-clara text-center leading-tight">
                        <Text size="xs" fw={600} c="#7434d6">
                          {stamp.month}
                        </Text>
                        <Text size="sm" fw={600}>
                          {stamp.day}
                        </Text>
                      </div>
                      <div>
                        <Text size="sm" fw={600}>
                          {item.nome}
                        </Text>
                        <Text size="xs" c="dimmed">
                          {remainingLabel(item.days)}
                        </Text>
                      </div>
                    </Group>
                  )
                })}
              </div>
            )}
          </div>

          <div className="rounded-3xl border border-slate-100 bg-white p-5 shadow-sm">
            <Title order={4}>Cobertura do protocolo</Title>
            <Text size="sm" c="dimmed" mt={8}>
              {coverage.covered} de {coverage.recommended} vacinas recomendadas
            </Text>
            <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-100">
              <div
                className="h-full rounded-full bg-marca"
                style={{ width: `${coverage.percent}%` }}
              />
            </div>
            <Text size="xs" c="dimmed" mt={12}>
              Complete as doses recomendadas para manter a proteção em dia.
            </Text>
            <Button
              radius="xl"
              variant="default"
              fullWidth
              mt="md"
              onClick={() => setOpen(true)}
            >
              Agendar visita para vacinar
            </Button>
          </div>
        </div>
      </div>

      <Text size="xs" c="dimmed" ta="center" pt={8}>
        Protótipo com dados de exemplo.
      </Text>

      <VaccineForm
        open={open}
        petId={petId}
        tutorId={tutorId}
        onClose={() => setOpen(false)}
      />
    </div>
  )
}
