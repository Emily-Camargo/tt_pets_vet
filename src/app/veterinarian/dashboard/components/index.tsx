'use client'

import { Badge, Button, Group, Table, Text, Title } from '@mantine/core'

import { PageHeader } from '@/core/components/page-header'
import { ResponsiveBar } from '@nivo/bar'
import { ResponsiveLine } from '@nivo/line'
import { ResponsivePie } from '@nivo/pie'
import { useMemo, useState, type ReactNode } from 'react'

import { moeda } from '@/core/functions/format'
import { feedback } from '@/core/functions/feedback'
import { useUsuario } from '@/core/hooks/use-session'

import { buildFinance, receiptLabel } from '../utils/functions'

const BRAND = '#7434d6'
const BRAND_SOFT = '#c4a6f2'

export function Dashboard() {
  const { banco, usuario } = useUsuario()
  const veterinarianId = usuario?.veterinarioId ?? ''
  const finance = useMemo(
    () => buildFinance(banco, veterinarianId),
    [banco, veterinarianId],
  )
  const [showAll, setShowAll] = useState(false)
  const receipts = showAll ? finance.receipts : finance.receipts.slice(0, 6)

  const lineData = [
    {
      id: 'Receita total',
      data: finance.monthly.map((item) => ({
        x: item.mes,
        y: item.Planos + item.Avulsos,
      })),
    },
  ]

  return (
    <div
      className="grid gap-4"
      style={{ animation: 'tt-surgir 0.6s ease both' }}
    >
      <PageHeader
        eyebrow="Veterinário"
        title="Financeiro"
        description="Receitas de planos e atendimentos avulsos."
        actions={
          <>
            <Button radius="xl" variant="light" color="violet">
              {finance.monthLabel} ›
            </Button>
            <Button
              radius="xl"
              variant="gradient"
              gradient={{ from: '#7434d6', to: '#0ea5e9', deg: 135 }}
              onClick={() =>
                feedback('', 'Exportação disponível no protótipo em breve.')
              }
            >
              ↓ Exportar
            </Button>
          </>
        }
      />

      <div className="grid grid-cols-4 gap-3 max-md:grid-cols-2 max-sm:grid-cols-1">
        <Metric
          label="Receita do mês"
          value={moeda(finance.receitaMes)}
          detail={
            <Text size="xs" c="teal">
              +{finance.crescimento}% sobre o mês anterior
            </Text>
          }
        />
        <Metric
          label="Recorrente (planos)"
          value={moeda(finance.recorrente)}
          detail={`${finance.assinaturas} assinaturas`}
        />
        <Metric
          label="Avulsos"
          value={moeda(finance.avulsos)}
          detail={`${finance.atendimentosAvulsos} atendimentos`}
        />
        <Metric
          label="Inadimplência"
          value={moeda(finance.inadimplencia)}
          detail={
            <Text size="xs" c="red">
              {finance.clientesAtrasados} clientes
            </Text>
          }
        />
      </div>

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)]">
        <div className="rounded-3xl border border-slate-100 bg-white p-5 shadow-sm">
          <Group justify="space-between" align="center">
            <Title order={4}>Recebimentos</Title>
            <Button
              variant="subtle"
              color="#7434d6"
              size="compact-sm"
              onClick={() => setShowAll((value) => !value)}
            >
              {showAll ? 'Ver menos' : 'Ver todos'}
            </Button>
          </Group>
          <div className="mt-4 overflow-x-auto">
            <Table
              horizontalSpacing="sm"
              verticalSpacing="md"
              className="min-w-[520px]"
            >
              <Table.Thead>
                <Table.Tr>
                  <Table.Th>Cliente</Table.Th>
                  <Table.Th>Vencimento</Table.Th>
                  <Table.Th>Valor</Table.Th>
                  <Table.Th>Status</Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {receipts.map((row) => (
                  <Table.Tr key={row.id}>
                    <Table.Td>
                      <Text size="sm" fw={600} c="#1e293b">
                        {row.cliente}
                      </Text>
                      <Text size="xs" c="dimmed">
                        {row.detalhe}
                      </Text>
                    </Table.Td>
                    <Table.Td>
                      <Text size="sm" c="dimmed">
                        {row.vencimento}
                      </Text>
                    </Table.Td>
                    <Table.Td>
                      <Text size="sm" fw={500}>
                        {moeda(row.valor)}
                      </Text>
                    </Table.Td>
                    <Table.Td>
                      <Badge
                        radius="xl"
                        variant="light"
                        color={
                          row.status === 'pago'
                            ? 'teal'
                            : row.status === 'atrasado'
                              ? 'yellow'
                              : 'gray'
                        }
                      >
                        {receiptLabel(row.status)}
                      </Badge>
                    </Table.Td>
                  </Table.Tr>
                ))}
              </Table.Tbody>
            </Table>
          </div>
        </div>

        <div className="grid gap-4">
          <div className="rounded-3xl border border-slate-100 bg-white p-5 shadow-sm">
            <Title order={4}>Receita por mês</Title>
            <div className="mt-2 h-56">
              <ResponsiveBar
                data={finance.monthly}
                keys={['Planos', 'Avulsos']}
                indexBy="mes"
                margin={{ top: 16, right: 16, bottom: 40, left: 48 }}
                padding={0.45}
                groupMode="stacked"
                colors={[BRAND, BRAND_SOFT]}
                borderRadius={6}
                enableLabel={false}
                axisBottom={{ tickSize: 0, tickPadding: 8 }}
                axisLeft={{
                  tickSize: 0,
                  tickPadding: 8,
                  format: (value) => `R$ ${Math.round(Number(value) / 1000)}k`,
                }}
                theme={{
                  axis: { ticks: { text: { fill: '#94a3b8', fontSize: 11 } } },
                  grid: { line: { stroke: '#f1f5f9' } },
                }}
                legends={[
                  {
                    dataFrom: 'keys',
                    anchor: 'bottom',
                    direction: 'row',
                    translateY: 36,
                    itemWidth: 80,
                    itemHeight: 14,
                    symbolSize: 10,
                    symbolShape: 'circle',
                  },
                ]}
              />
            </div>
          </div>

          <div className="rounded-3xl border border-slate-100 bg-white p-5 shadow-sm">
            <Title order={4}>Por cidade</Title>
            <div className="mt-3 divide-y divide-slate-100">
              {finance.byCity.map((city) => (
                <div
                  key={city.id}
                  className="flex items-center justify-between py-3"
                >
                  <Text size="sm" fw={500} c="#1e293b">
                    {city.label}
                  </Text>
                  <Text size="sm" fw={600}>
                    {moeda(city.value)}
                  </Text>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="rounded-3xl border border-slate-100 bg-white p-5 shadow-sm lg:col-span-2">
          <Title order={4}>Evolução da receita</Title>
          <div className="mt-2 h-64">
            <ResponsiveLine
              data={lineData}
              margin={{ top: 20, right: 24, bottom: 40, left: 52 }}
              xScale={{ type: 'point' }}
              yScale={{ type: 'linear', min: 0, max: 'auto' }}
              curve="monotoneX"
              colors={[BRAND]}
              lineWidth={3}
              enableArea
              areaOpacity={0.12}
              pointSize={8}
              pointColor="#fff"
              pointBorderWidth={2}
              pointBorderColor={BRAND}
              axisBottom={{ tickSize: 0, tickPadding: 10 }}
              axisLeft={{
                tickSize: 0,
                tickPadding: 8,
                format: (value) => `R$ ${Math.round(Number(value) / 1000)}k`,
              }}
              enableGridX={false}
              theme={{
                axis: { ticks: { text: { fill: '#94a3b8', fontSize: 11 } } },
                grid: { line: { stroke: '#f1f5f9' } },
              }}
              useMesh
            />
          </div>
        </div>

        <div className="rounded-3xl border border-slate-100 bg-white p-5 shadow-sm">
          <Title order={4}>Status dos recebimentos</Title>
          <div className="mt-2 h-64">
            <ResponsivePie
              data={finance.statusMix}
              margin={{ top: 20, right: 20, bottom: 40, left: 20 }}
              innerRadius={0.62}
              padAngle={2}
              cornerRadius={4}
              colors={[BRAND, '#94a3b8', '#f59e0b']}
              enableArcLinkLabels={false}
              arcLabelsSkipAngle={12}
              arcLabelsTextColor="#fff"
              legends={[
                {
                  anchor: 'bottom',
                  direction: 'row',
                  translateY: 28,
                  itemWidth: 80,
                  itemHeight: 14,
                  symbolSize: 10,
                  symbolShape: 'circle',
                },
              ]}
            />
          </div>
        </div>
      </div>

      {finance.byPlan.length > 0 && (
        <div className="rounded-3xl border border-slate-100 bg-white p-5 shadow-sm">
          <Title order={4}>MRR por plano</Title>
          <div className="mt-2 h-56">
            <ResponsiveBar
              data={finance.byPlan}
              keys={['value']}
              indexBy="label"
              margin={{ top: 16, right: 16, bottom: 48, left: 56 }}
              padding={0.4}
              colors={[BRAND]}
              borderRadius={8}
              enableLabel={false}
              axisBottom={{ tickSize: 0, tickPadding: 8, tickRotation: -15 }}
              axisLeft={{
                tickSize: 0,
                tickPadding: 8,
                format: (value) => moeda(Number(value)),
              }}
              theme={{
                axis: { ticks: { text: { fill: '#94a3b8', fontSize: 11 } } },
                grid: { line: { stroke: '#f1f5f9' } },
              }}
            />
          </div>
        </div>
      )}
    </div>
  )
}

function Metric({
  label,
  value,
  detail,
}: {
  label: string
  value: string
  detail: ReactNode
}) {
  return (
    <div className="rounded-3xl border border-slate-100 bg-white p-5 shadow-sm">
      <Text size="sm" c="dimmed">
        {label}
      </Text>
      <Text size="xl" fw={600} c="#475569" mt={8}>
        {value}
      </Text>
      <Text size="xs" c="dimmed" mt={4}>
        {detail}
      </Text>
    </div>
  )
}
