'use client'

import {
  CalendarMonth,
  Pets as PetsIcon,
  Shield,
  Vaccines,
} from '@mui/icons-material'
import { useMemo, useState } from 'react'

import { Metric } from '@/app/home/components/frame'
import { useUsuario } from '@/core/hooks/use-session'
import type { Pet } from '@/core/interfaces/types'

import { CardPet } from './card-pet'
import { PetForm } from './pet-form'
import { SORT_OPTIONS, SPECIES } from '../utils/constants'
import {
  nextVisitSummary,
  planSummary,
  speciesCount,
  vaccinesOkSummary,
} from '../utils/functions'

export function Pets() {
  const { banco, usuario } = useUsuario()
  const tutorId = usuario?.tutorId ?? ''
  const pets = banco.pets.filter((item) => item.tutorId === tutorId)
  const [open, setOpen] = useState(false)
  const [current, setCurrent] = useState<Pet>()
  const [search, setSearch] = useState('')
  const [species, setSpecies] = useState('Todas')
  const [sort, setSort] = useState<(typeof SORT_OPTIONS)[number]['id']>('nome')

  const vaccinesOk = vaccinesOkSummary(pets, banco.vacinas)
  const nextVisit = nextVisitSummary(
    banco,
    pets.map((item) => item.id),
  )
  const plan = planSummary(banco, tutorId, pets.length)

  const filtered = useMemo(() => {
    const list = pets.filter((pet) => {
      const matchName = pet.nome
        .toLowerCase()
        .includes(search.trim().toLowerCase())
      const matchSpecies = species === 'Todas' || pet.especie === species
      return matchName && matchSpecies
    })

    return [...list].sort((a, b) => {
      if (sort === 'peso') return b.peso - a.peso
      if (sort === 'idade') return a.nascimento.localeCompare(b.nascimento)
      return a.nome.localeCompare(b.nome)
    })
  }, [pets, search, species, sort])

  function openForm(pet?: Pet) {
    setCurrent(pet)
    setOpen(true)
  }

  function closeForm() {
    setOpen(false)
    setCurrent(undefined)
  }

  return (
    <div
      className="space-y-4"
      style={{ animation: 'tt-surgir 0.6s ease both' }}
    >
      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-semibold tracking-[0.16em] text-marca uppercase">
            Tutor
          </p>
          <h1 className="mt-1 text-3xl font-semibold tracking-tight text-slate-900">
            Meus pets
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Cadastre seus pets e acompanhe a saúde de cada um.
          </p>
        </div>
        <button
          type="button"
          onClick={() => openForm()}
          className="rounded-full bg-marca px-4 py-2.5 text-sm font-medium text-white hover:bg-marca-forte"
        >
          + Adicionar pet
        </button>
      </header>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Metric
          icon={<PetsIcon sx={{ fontSize: 18 }} />}
          tone="bg-sky-50 text-sky-600"
          label="Pets cadastrados"
          value={String(pets.length)}
          detail={speciesCount(pets)}
        />
        <Metric
          icon={<Vaccines sx={{ fontSize: 18 }} />}
          tone="bg-emerald-50 text-emerald-600"
          label="Vacinas em dia"
          value={vaccinesOk.value}
          detail={vaccinesOk.detail}
        />
        <Metric
          icon={<CalendarMonth sx={{ fontSize: 18 }} />}
          tone="bg-rose-50 text-rose-500"
          label="Próxima consulta"
          value={nextVisit.value}
          detail={nextVisit.detail}
        />
        <Metric
          icon={<Shield sx={{ fontSize: 18 }} />}
          tone="bg-amber-50 text-amber-600"
          label="Plano"
          value={plan.value}
          detail={plan.detail}
        />
      </div>

      <div
        className={`grid w-full gap-4 lg:gap-6 ${open ? 'xl:grid-cols-[minmax(0,1fr)_420px]' : ''}`}
      >
        <div className="space-y-4">
          <div className="flex flex-col gap-3 rounded-2xl border border-slate-100 bg-white p-3 shadow-sm lg:flex-row">
            <label className="relative flex-1">
              <span className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-slate-400">
                🔍
              </span>
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Buscar pet pelo nome"
                className="w-full rounded-xl border border-slate-200 py-2.5 pr-3 pl-10 text-sm outline-none focus:border-marca focus:ring-2 focus:ring-marca-anel"
              />
            </label>
            <select
              value={species}
              onChange={(event) => setSpecies(event.target.value)}
              className="rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-marca"
            >
              <option value="Todas">Todas as espécies</option>
              {SPECIES.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
            <select
              value={sort}
              onChange={(event) =>
                setSort(
                  event.target.value as (typeof SORT_OPTIONS)[number]['id'],
                )
              }
              className="rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-marca"
            >
              {SORT_OPTIONS.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.label}
                </option>
              ))}
            </select>
          </div>

          {filtered.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-slate-200 bg-white px-6 py-12 text-center text-sm text-slate-500">
              Nenhum pet encontrado.
            </div>
          ) : (
            <div className="space-y-4">
              {filtered.map((pet) => (
                <CardPet
                  key={pet.id}
                  pet={pet}
                  vaccines={banco.vacinas.filter(
                    (item) => item.petId === pet.id,
                  )}
                  appointments={banco.consultas.filter(
                    (item) => item.petId === pet.id,
                  )}
                  onEdit={() => openForm(pet)}
                />
              ))}
            </div>
          )}
        </div>

        {open && (
          <PetForm
            key={current?.id ?? 'new'}
            tutorId={tutorId}
            pet={current}
            onClose={closeForm}
          />
        )}
      </div>

      <p className="pt-2 text-center text-xs text-slate-400">
        Protótipo com dados de exemplo.
      </p>
    </div>
  )
}
