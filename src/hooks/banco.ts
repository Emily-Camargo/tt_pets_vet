'use client'

import { useEffect, useSyncExternalStore } from 'react'

import { marcarSessaoPronta, ouvirSessao, sessaoAtual, sessaoPronta } from '@/auth/sessao'
import { bancoAtual, bancoServidor, estaHidratado, marcarHidratado, ouvirBanco } from '@/mocks/store'

export function useBanco() {
  useEffect(() => {
    marcarHidratado()
  }, [])

  return useSyncExternalStore(ouvirBanco, bancoAtual, bancoServidor)
}

export function useBancoPronto() {
  useEffect(() => {
    marcarHidratado()
  }, [])

  return useSyncExternalStore(ouvirBanco, estaHidratado, () => false)
}

export function useSessaoId() {
  useEffect(() => {
    marcarSessaoPronta()
  }, [])

  return useSyncExternalStore(ouvirSessao, sessaoAtual, () => null)
}

export function useSessaoPronta() {
  useEffect(() => {
    marcarSessaoPronta()
  }, [])

  return useSyncExternalStore(ouvirSessao, sessaoPronta, () => false)
}

export function useUsuario() {
  const banco = useBanco()
  const id = useSessaoId()
  const bancoPronto = useBancoPronto()
  const sessaoOk = useSessaoPronta()
  const pronto = bancoPronto && sessaoOk
  const usuario = banco.usuarios.find((item) => item.id === id) ?? null
  return { banco, usuario, pronto }
}
