'use client'

import { useState } from 'react'

import {
  Aviso,
  Botao,
  Campo,
  Cartao,
  Modal,
  Ok,
  Pagina,
  Selecao,
  Texto,
  Vazio,
} from '@/components/ui'
import { dataCurta } from '@/domain/formatacao'
import { useUsuario } from '@/hooks/banco'
import { salvarVacina } from '@/mocks/acoes'

export function VacinasTutor() {
  const { banco, usuario } = useUsuario()
  const tutorId = usuario?.tutorId ?? ''
  const pets = banco.pets.filter((item) => item.tutorId === tutorId)
  const [petId, setPetId] = useState(pets[0]?.id ?? '')
  const [aberto, setAberto] = useState(false)
  const [nome, setNome] = useState('')
  const [aplicadaEm, setAplicadaEm] = useState('')
  const [proximaDose, setProximaDose] = useState('')
  const [erro, setErro] = useState<string | null>(null)
  const [ok, setOk] = useState<string | null>(null)
  const vacinas = banco.vacinas
    .filter((item) => item.petId === petId)
    .sort((a, b) => b.aplicadaEm.localeCompare(a.aplicadaEm))

  return (
    <Pagina
      titulo="Carteira de vacinação"
      descricao="As doses aplicadas pelo veterinário e as que você registrar aparecem juntas."
      acao={<Botao onClick={() => setAberto(true)}>Registrar dose</Botao>}
    >
      <Campo label="Pet">
        <Selecao value={petId} onChange={(evento) => setPetId(evento.target.value)}>
          {pets.map((pet) => (
            <option key={pet.id} value={pet.id}>
              {pet.nome}
            </option>
          ))}
        </Selecao>
      </Campo>
      <Ok texto={ok} />
      {vacinas.length === 0 ? (
        <Vazio texto="Nenhuma vacina nesta carteira." />
      ) : (
        <div className="grid gap-3">
          {vacinas.map((vacina) => (
            <Cartao key={vacina.id}>
              <h2 className="font-semibold">{vacina.nome}</h2>
              <p className="text-sm text-slate-500">
                Aplicada em {dataCurta(vacina.aplicadaEm)} · próxima dose{' '}
                {dataCurta(vacina.proximaDose)}
              </p>
            </Cartao>
          ))}
        </div>
      )}
      <Modal aberto={aberto} titulo="Registrar vacina" onFechar={() => setAberto(false)}>
        <form
          className="space-y-4"
          onSubmit={(evento) => {
            evento.preventDefault()
            const falha = salvarVacina({
              petId,
              nome,
              aplicadaEm,
              proximaDose,
              tutorId,
            })
            setErro(falha)
            if (!falha) {
              setOk('Vacina registrada.')
              setAberto(false)
            }
          }}
        >
          <Aviso texto={erro} />
          <Campo label="Vacina">
            <Texto value={nome} required onChange={(evento) => setNome(evento.target.value)} />
          </Campo>
          <Campo label="Aplicada em">
            <Texto
              type="date"
              value={aplicadaEm}
              required
              onChange={(evento) => setAplicadaEm(evento.target.value)}
            />
          </Campo>
          <Campo label="Próxima dose">
            <Texto
              type="date"
              value={proximaDose}
              required
              onChange={(evento) => setProximaDose(evento.target.value)}
            />
          </Campo>
          <Botao type="submit">Salvar</Botao>
        </form>
      </Modal>
    </Pagina>
  )
}
