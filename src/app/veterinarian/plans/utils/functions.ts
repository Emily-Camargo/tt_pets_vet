import type { Banco, Plano } from '@/core/interfaces/types'

export interface CityTab {
  id: string
  nome: string
  plans: number
  subscribers: number
}

export function cityTabs(bank: Banco, veterinarianId: string): CityTab[] {
  const vet = bank.veterinarios.find((item) => item.id === veterinarianId)
  const cityIds = vet?.cidadeIds ?? []

  return cityIds
    .map((cityId) => {
      const city = bank.cidades.find((item) => item.id === cityId)
      if (!city) return null
      const plans = bank.planos.filter(
        (item) =>
          item.veterinarioId === veterinarianId && item.cidadeId === cityId,
      )
      const planIds = new Set(plans.map((item) => item.id))
      const subscribers = bank.assinaturas.filter(
        (item) => item.status === 'ativa' && planIds.has(item.planoId),
      ).length
      return {
        id: city.id,
        nome: city.nome,
        plans: plans.length,
        subscribers,
      }
    })
    .filter((item): item is CityTab => Boolean(item))
}

export function plansForCity(
  bank: Banco,
  veterinarianId: string,
  cityId: string,
) {
  return bank.planos.filter(
    (item) =>
      item.veterinarioId === veterinarianId && item.cidadeId === cityId,
  )
}

export function planSubscribers(bank: Banco, planId: string) {
  return bank.assinaturas.filter(
    (item) => item.planoId === planId && item.status === 'ativa',
  ).length
}

export function featuredFirst(plans: Plano[]) {
  return [...plans].sort((a, b) => Number(b.destaque) - Number(a.destaque))
}
