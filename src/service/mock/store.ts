import type { Banco } from '@/core/interfaces/types'

import { VERSAO_BANCO } from './catalog'
import { sincronizarLembretes } from './rules'
import { aplicarDatasDemo, criarSeed } from './seed'

const CHAVE = 'tt_pets_banco_v1'
const seedEstatico = criarSeed()

let memoria: Banco | null = null
let hidratado = false
const ouvintes = new Set<() => void>()

function avisar() {
  ouvintes.forEach((ouvinte) => ouvinte())
}

function preparar(banco: Banco) {
  aplicarDatasDemo(banco)
  sincronizarLembretes(banco)
  return banco
}

function lerDoNavegador() {
  if (typeof window === 'undefined') return seedEstatico

  try {
    const bruto = localStorage.getItem(CHAVE)
    if (!bruto) {
      const novo = preparar(structuredClone(seedEstatico))
      localStorage.setItem(CHAVE, JSON.stringify(novo))
      return novo
    }

    const lido = JSON.parse(bruto) as Banco
    if (!lido || lido.versao !== VERSAO_BANCO) {
      const novo = preparar(structuredClone(seedEstatico))
      localStorage.setItem(CHAVE, JSON.stringify(novo))
      return novo
    }

    return preparar(lido)
  } catch {
    return preparar(structuredClone(seedEstatico))
  }
}

export function bancoServidor() {
  return seedEstatico
}

export function bancoAtual() {
  if (!hidratado) return seedEstatico
  return memoria ?? seedEstatico
}

export function estaHidratado() {
  return hidratado
}

export function marcarHidratado() {
  if (hidratado) return
  memoria = lerDoNavegador()
  hidratado = true
  avisar()
}

export function ouvirBanco(ouvinte: () => void) {
  ouvintes.add(ouvinte)
  return () => ouvintes.delete(ouvinte)
}

export function alterar(fn: (banco: Banco) => void) {
  const copia = structuredClone(hidratado ? lerDoNavegador() : seedEstatico)
  fn(copia)
  sincronizarLembretes(copia)
  memoria = copia
  hidratado = true
  if (typeof window !== 'undefined') {
    localStorage.setItem(CHAVE, JSON.stringify(copia))
  }
  avisar()
}

export function restaurarBanco() {
  const novo = preparar(structuredClone(criarSeed()))
  memoria = novo
  hidratado = true
  if (typeof window !== 'undefined') {
    localStorage.setItem(CHAVE, JSON.stringify(novo))
  }
  avisar()
}
