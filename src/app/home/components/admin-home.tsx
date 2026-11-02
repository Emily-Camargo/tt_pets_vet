'use client'

import {
  LocationOn,
  MedicalServices,
  Pets,
  WorkspacePremium,
} from '@mui/icons-material'

import { cx, moeda } from '@/core/functions/format'
import type { Banco, Usuario } from '@/core/interfaces/types'

import {
  Bars,
  Hero,
  HomeFrame,
  Metric,
  Panel,
  PanelHead,
  Shortcut,
} from './frame'
import { firstName } from '../utils/functions'

export function AdminHome({ bank, user }: { bank: Banco; user: Usuario }) {
  const active = bank.veterinarios.filter((item) => item.ativo)
  const revenue = bank.assinaturas
    .filter((item) => item.status === 'ativa')
    .reduce((total, item) => {
      const plan = bank.planos.find((current) => current.id === item.planoId)
      return total + (plan?.precoMensal ?? 0)
    }, 0)
  const activePlans = bank.planos.filter((item) => item.ativo).length
  const bars = bank.veterinarios.map((vet) => ({
    label: firstName(vet.nome),
    value: bank.planos.filter(
      (item) => item.veterinarioId === vet.id && item.ativo,
    ).length,
  }))

  return (
    <HomeFrame>
      <Hero
        profile="Admin da plataforma"
        name={firstName(user.nome)}
        text="Veterinários, cidades e planos da plataforma num só painel."
        mascot="paws"
        chips={[
          `${active.length} ${active.length === 1 ? 'veterinário ativo' : 'veterinários ativos'}`,
          `${bank.cidades.length} ${bank.cidades.length === 1 ? 'cidade' : 'cidades'}`,
          '3 perfis de acesso',
        ]}
        primary={{
          href: '/admin/veterinarians',
          label: '+ Cadastrar veterinário',
        }}
        secondary={{ href: '/admin/veterinarians', label: 'Ver veterinários' }}
      />
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Metric
          icon={<MedicalServices sx={{ fontSize: 18 }} />}
          tone="bg-marca-anel text-marca"
          label="Veterinários ativos"
          value={String(active.length)}
          detail={`${bank.veterinarios.length - active.length} inativos`}
        />
        <Metric
          icon={<span className="text-base">💰</span>}
          tone="bg-emerald-50 text-emerald-600"
          label="Receita dos planos"
          value={moeda(revenue)}
          detail="Soma das assinaturas ativas"
        />
        <Metric
          icon={<WorkspacePremium sx={{ fontSize: 18 }} />}
          tone="bg-sky-50 text-sky-600"
          label="Planos ativos"
          value={String(activePlans)}
          detail={`${bank.planos.length} cadastrados`}
        />
        <Metric
          icon={<Pets sx={{ fontSize: 18 }} />}
          tone="bg-amber-50 text-amber-600"
          label="Tutores e pets"
          value={`${bank.tutores.length} · ${bank.pets.length}`}
          detail="contas de exemplo"
        />
      </div>
      <div className="grid gap-3 lg:grid-cols-2">
        <Panel>
          <PanelHead
            title="Veterinários"
            href="/admin/veterinarians"
            action="Gerenciar"
          />
          <ul className="mt-2 divide-y divide-slate-100">
            {bank.veterinarios.map((vet) => {
              const cities = vet.cidadeIds
                .map((id) => bank.cidades.find((item) => item.id === id)?.nome)
                .filter(Boolean)
                .join(' e ')
              const plans = bank.planos.filter(
                (item) => item.veterinarioId === vet.id,
              ).length
              return (
                <li
                  key={vet.id}
                  className="flex items-center justify-between gap-3 py-3"
                >
                  <span>
                    <span className="block text-sm font-semibold text-slate-800">
                      {vet.nome}
                    </span>
                    <span className="block text-xs text-slate-400">
                      {cities || 'Sem cidade'} · {plans}{' '}
                      {plans === 1 ? 'plano' : 'planos'}
                    </span>
                  </span>
                  <span
                    className={cx(
                      'rounded-full px-2 py-0.5 text-[11px] font-medium',
                      vet.ativo
                        ? 'bg-emerald-50 text-emerald-700'
                        : 'bg-amber-50 text-amber-700',
                    )}
                  >
                    {vet.ativo ? 'Ativo' : 'Inativo'}
                  </span>
                </li>
              )
            })}
          </ul>
        </Panel>
        <Panel>
          <PanelHead
            title="Planos por veterinário"
            href="/admin/plans"
            action="Gerenciar"
          />
          <Bars items={bars} />
        </Panel>
      </div>
      <div className="grid gap-3 sm:grid-cols-3">
        <Shortcut
          href="/admin/veterinarians"
          icon={<MedicalServices sx={{ fontSize: 18 }} />}
          tone="bg-marca-anel text-marca"
          label="Veterinários"
        />
        <Shortcut
          href="/admin/cities"
          icon={<LocationOn sx={{ fontSize: 18 }} />}
          tone="bg-sky-50 text-sky-600"
          label="Cidades"
        />
        <Shortcut
          href="/admin/plans"
          icon={<WorkspacePremium sx={{ fontSize: 18 }} />}
          tone="bg-amber-50 text-amber-600"
          label="Planos"
        />
      </div>
    </HomeFrame>
  )
}
