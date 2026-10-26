const CHAVE = 'tt_pets_sessao_v1'

let usuarioId: string | null = null
let pronta = false
const ouvintes = new Set<() => void>()

function avisar() {
  ouvintes.forEach((ouvinte) => ouvinte())
}

export function ouvirSessao(ouvinte: () => void) {
  ouvintes.add(ouvinte)
  return () => ouvintes.delete(ouvinte)
}

export function sessaoAtual() {
  return pronta ? usuarioId : null
}

export function sessaoPronta() {
  return pronta
}

export function marcarSessaoPronta() {
  if (pronta || typeof window === 'undefined') return
  usuarioId = localStorage.getItem(CHAVE)
  pronta = true
  avisar()
}

export function definirSessao(id: string | null) {
  usuarioId = id
  pronta = true
  if (typeof window !== 'undefined') {
    if (id) localStorage.setItem(CHAVE, id)
    else localStorage.removeItem(CHAVE)
  }
  avisar()
}
