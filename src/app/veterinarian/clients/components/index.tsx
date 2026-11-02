'use client'

import { Badge, Button, Group, Text, TextInput, Title } from '@mantine/core'
import { useRouter } from 'next/navigation'
import { useMemo, useState } from 'react'
import { FiSearch } from 'react-icons/fi'

import { PageHeader } from '@/core/components/page-header'
import { cx, moeda, telefone } from '@/core/functions/format'
import { feedback } from '@/core/functions/feedback'
import { useUsuario } from '@/core/hooks/use-session'

import {
  type ClientFilter,
  type ClientRow,
  buildClientRows,
  filterClients,
  initials,
  lastVisitLabel,
  matchSearch,
  paymentUi,
  petSummary,
  petTone,
  sinceLabel,
} from '../utils/functions'

const FILTERS: Array<{ id: ClientFilter; label: string }> = [
  { id: 'all', label: 'Todos' },
  { id: 'with_plan', label: 'Com plano' },
  { id: 'no_plan', label: 'Sem plano' },
  { id: 'late', label: 'Mensalidade atrasada' },
  { id: 'vaccine', label: 'Vacina vencendo' },
]

function paymentBadgeColor(status: ClientRow['payment']) {
  if (status === 'em_dia') return 'teal'
  if (status === 'atrasado') return 'yellow'
  return 'gray'
}

export function Clients() {
  const router = useRouter()
  const { banco, usuario } = useUsuario()
  const veterinarianId = usuario?.veterinarioId ?? ''
  const rows = useMemo(
    () => buildClientRows(banco, veterinarianId),
    [banco, veterinarianId],
  )
  const [filter, setFilter] = useState<ClientFilter>('all')
  const [search, setSearch] = useState('')
  const [selectedId, setSelectedId] = useState(rows[0]?.tutor.id)

  const visible = useMemo(
    () => filterClients(rows, filter).filter((row) => matchSearch(row, search)),
    [rows, filter, search],
  )

  const selected =
    visible.find((row) => row.tutor.id === selectedId) ?? visible[0]

  const petCount = rows.reduce((sum, row) => sum + row.pets.length, 0)

  return (
    <div
      className="grid gap-4"
      style={{ animation: 'tt-surgir 0.6s ease both' }}
    >
      <PageHeader
        eyebrow="Veterinário"
        title="Clientes e pets"
        description={`${rows.length} ${rows.length === 1 ? 'tutor' : 'tutores'} e ${petCount} ${
          petCount === 1 ? 'pet' : 'pets'
        } na sua carteira.`}
        actions={
          <>
            <Button
              radius="xl"
              variant="default"
              onClick={() =>
                feedback('', 'Exportação disponível no protótipo em breve.')
              }
            >
              ↓ Exportar
            </Button>
            <Button
              radius="xl"
              color="#7434d6"
              onClick={() =>
                feedback('', 'Cadastro de cliente disponível em breve.')
              }
            >
              + Novo cliente
            </Button>
          </>
        }
      />

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_340px]">
        <div className="min-w-0 rounded-3xl border border-slate-100 bg-white p-4 shadow-sm sm:p-5">
          <div className="flex flex-row items-center justify-between gap-3 max-sm:flex-col max-sm:items-stretch">
            <Group gap="xs" wrap="wrap" className="min-w-0">
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
            <TextInput
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Buscar tutor ou pet"
              radius="xl"
              leftSection={<FiSearch size={16} />}
              className="w-[240px] shrink-0 max-sm:w-full"
            />
          </div>

          {visible.length === 0 ? (
            <Text size="sm" c="dimmed" ta="center" py="xl">
              Nenhum cliente neste filtro.
            </Text>
          ) : (
            <div className="mt-4 overflow-x-auto">
              <table className="w-full min-w-[720px] text-left text-sm">
                <thead>
                  <tr className="border-b border-slate-100 text-xs tracking-wide text-slate-400 uppercase">
                    <th className="pb-3 font-medium">Tutor</th>
                    <th className="pb-3 font-medium">Pets</th>
                    <th className="pb-3 font-medium">Plano</th>
                    <th className="pb-3 font-medium">Cidade</th>
                    <th className="pb-3 font-medium">Última visita</th>
                    <th className="pb-3 font-medium">Pagamento</th>
                  </tr>
                </thead>
                <tbody>
                  {visible.map((row) => {
                    const payment = paymentUi(row.payment)
                    const active = selected?.tutor.id === row.tutor.id
                    return (
                      <tr
                        key={row.tutor.id}
                        onClick={() => setSelectedId(row.tutor.id)}
                        className={cx(
                          'cursor-pointer border-b border-slate-50 transition',
                          active ? 'bg-[#faf7ff]' : 'hover:bg-slate-50',
                        )}
                      >
                        <td className="py-3.5 pr-3">
                          <Text size="sm" fw={600} c="#1e293b">
                            {row.tutor.nome}
                          </Text>
                          <Text size="xs" c="dimmed">
                            {telefone(row.tutor.telefone)}
                          </Text>
                        </td>
                        <td className="py-3.5 pr-3">
                          <div className="flex -space-x-1">
                            {row.pets.map((pet, index) => (
                              <Text
                                key={pet.id}
                                component="span"
                                title={pet.nome}
                                className={cx(
                                  'inline-flex h-8 w-8 items-center justify-center rounded-lg text-[10px] font-bold ring-2 ring-white',
                                  petTone(index),
                                )}
                              >
                                {initials(pet.nome)}
                              </Text>
                            ))}
                          </div>
                        </td>
                        <td className="py-3.5 pr-3">
                          <Text size="sm" c="dimmed">
                            {row.planName}
                          </Text>
                        </td>
                        <td className="py-3.5 pr-3">
                          <Text size="sm" c="dimmed">
                            {row.cityName}
                          </Text>
                        </td>
                        <td className="py-3.5 pr-3">
                          <Text size="sm" c="dimmed">
                            {lastVisitLabel(row.lastVisit)}
                          </Text>
                        </td>
                        <td className="py-3.5">
                          <Badge
                            radius="xl"
                            variant="light"
                            color={paymentBadgeColor(row.payment)}
                          >
                            {payment.label}
                          </Badge>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {selected ? (
          <ClientDetail
            row={selected}
            bank={banco}
            onRecords={() => router.push('/veterinarian/appointments')}
            onSchedule={() => router.push('/veterinarian/schedule')}
          />
        ) : (
          <div className="rounded-3xl border border-dashed border-slate-200 bg-white p-6 shadow-sm">
            <Text size="sm" c="dimmed">
              Selecione um cliente para ver os detalhes.
            </Text>
          </div>
        )}
      </div>
    </div>
  )
}

function ClientDetail({
  row,
  bank,
  onRecords,
  onSchedule,
}: {
  row: ClientRow
  bank: ReturnType<typeof useUsuario>['banco']
  onRecords: () => void
  onSchedule: () => void
}) {
  const month = new Date()
    .toLocaleDateString('pt-BR', { month: 'long' })
    .toLowerCase()
  const limit = row.planVisits ?? 0

  return (
    <div className="h-fit rounded-3xl border border-slate-100 bg-white p-5 shadow-sm">
      <Group justify="space-between" align="flex-start" wrap="nowrap">
        <Title order={4}>{row.tutor.nome}</Title>
        <Button
          variant="subtle"
          color="#7434d6"
          size="compact-sm"
          onClick={() => feedback('', 'Edição de cliente em breve.')}
        >
          Editar
        </Button>
      </Group>

      <dl className="mt-4 grid grid-cols-2 gap-x-4 gap-y-3 text-sm">
        <div>
          <Text size="xs" c="dimmed" component="dt">
            Telefone
          </Text>
          <Text size="sm" fw={500} c="#1e293b" component="dd">
            {telefone(row.tutor.telefone)}
          </Text>
        </div>
        <div>
          <Text size="xs" c="dimmed" component="dt">
            Cidade
          </Text>
          <Text size="sm" fw={500} c="#1e293b" component="dd">
            {row.cityName}
          </Text>
        </div>
        <div className="col-span-2">
          <Text size="xs" c="dimmed" component="dt">
            Endereço
          </Text>
          <Text size="sm" fw={500} c="#1e293b" component="dd">
            {row.tutor.endereco ?? '—'}
          </Text>
        </div>
        <div className="col-span-2">
          <Text size="xs" c="dimmed" component="dt">
            Cliente desde
          </Text>
          <Text size="sm" fw={500} c="#1e293b" component="dd">
            {sinceLabel(row.since)}
          </Text>
        </div>
      </dl>

      <div className="mt-5">
        <Text size="xs" fw={600} tt="uppercase" c="dimmed">
          Pets
        </Text>
        <div className="mt-2 space-y-3">
          {row.pets.map((pet, index) => (
            <div key={pet.id} className="flex items-start gap-3">
              <Text
                component="span"
                className={cx(
                  'inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-xs font-bold',
                  petTone(index),
                )}
              >
                {initials(pet.nome)}
              </Text>
              <div>
                <Text size="sm" fw={600} c="#1e293b">
                  {pet.nome}
                </Text>
                <Text size="xs" c="dimmed">
                  {petSummary(bank, pet)}
                </Text>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-5 rounded-2xl bg-slate-50 p-4">
        <Group justify="space-between" wrap="nowrap">
          <Text size="sm" fw={600} c="#1e293b">
            {row.planName}
          </Text>
          {row.planPrice != null && (
            <Text size="sm" fw={600} c="#7434d6">
              {moeda(row.planPrice)}/mês
            </Text>
          )}
        </Group>
        {row.payment !== 'avulso' && limit > 0 && (
          <>
            <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-200">
              <div
                className="h-full rounded-full bg-marca"
                style={{
                  width: `${Math.min(100, (row.visitsUsed / limit) * 100)}%`,
                }}
              />
            </div>
            <Text size="xs" c="dimmed" mt={8}>
              {row.visitsUsed} de {limit} visitas usadas em {month}
            </Text>
          </>
        )}
        {row.payment === 'avulso' && (
          <Text size="xs" c="dimmed" mt={8}>
            Atendimentos avulsos, sem assinatura ativa.
          </Text>
        )}
      </div>

      <div className="mt-5 grid grid-cols-2 gap-2">
        <Button radius="xl" variant="default" onClick={onRecords}>
          Prontuários
        </Button>
        <Button radius="xl" color="#7434d6" onClick={onSchedule}>
          Agendar
        </Button>
      </div>
    </div>
  )
}
