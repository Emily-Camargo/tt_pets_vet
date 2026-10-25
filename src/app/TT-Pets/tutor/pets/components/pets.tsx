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
import { excluirPet, salvarPet } from '@/mocks/acoes'

const ESPECIES = ['Cão', 'Gato', 'Outro']

export function Pets() {
  const { banco, usuario } = useUsuario()
  const tutorId = usuario?.tutorId ?? ''
  const pets = banco.pets.filter((item) => item.tutorId === tutorId)
  const [aberto, setAberto] = useState(false)
  const [id, setId] = useState<string>()
  const [nome, setNome] = useState('')
  const [especie, setEspecie] = useState('Cão')
  const [raca, setRaca] = useState('')
  const [nascimento, setNascimento] = useState('')
  const [peso, setPeso] = useState('')
  const [foto, setFoto] = useState<string>()
  const [erro, setErro] = useState<string | null>(null)
  const [ok, setOk] = useState<string | null>(null)

  function abrir(petId?: string) {
    const pet = pets.find((item) => item.id === petId)
    setId(pet?.id)
    setNome(pet?.nome ?? '')
    setEspecie(pet?.especie ?? 'Cão')
    setRaca(pet?.raca ?? '')
    setNascimento(pet?.nascimento ?? '')
    setPeso(pet ? String(pet.peso) : '')
    setFoto(pet?.foto)
    setErro(null)
    setAberto(true)
  }

  return (
    <Pagina
      titulo="Meus pets"
      descricao="Cada consulta e cada plano ficam ligados a um pet."
      acao={<Botao onClick={() => abrir()}>Novo pet</Botao>}
    >
      <Ok texto={ok} />
      <Aviso texto={!aberto ? erro : null} />
      {pets.length === 0 ? (
        <Vazio texto="Você ainda não cadastrou pets." />
      ) : (
        <div className="grid gap-3 md:grid-cols-2">
          {pets.map((pet) => {
            const plano = banco.assinaturas.find(
              (item) => item.petId === pet.id && item.status === 'ativa',
            )
            const nomePlano = banco.planos.find((item) => item.id === plano?.planoId)?.nome
            return (
              <Cartao key={pet.id}>
                <div className="flex gap-4">
                  <div className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-2xl bg-rose-50 text-xl font-extrabold text-rose-600">
                    {pet.foto ? (
                      <img src={pet.foto} alt="" className="h-full w-full object-cover" />
                    ) : (
                      pet.nome.slice(0, 1)
                    )}
                  </div>
                  <div className="flex-1">
                    <h2 className="font-extrabold text-slate-900">{pet.nome}</h2>
                    <p className="text-sm text-slate-500">
                      {pet.especie} · {pet.raca} · {pet.peso} kg
                    </p>
                    <p className="text-sm text-slate-500">
                      Nascimento {dataCurta(pet.nascimento)}
                    </p>
                    <p className="mt-1 text-sm font-semibold text-rose-600">
                      {nomePlano ? `Plano ${nomePlano}` : 'Sem plano ativo'}
                    </p>
                    <div className="mt-3 flex gap-2">
                      <Botao variante="outline" onClick={() => abrir(pet.id)}>
                        Editar
                      </Botao>
                      <Botao
                        variante="perigo"
                        onClick={() => {
                          const falha = excluirPet(pet.id, tutorId)
                          setErro(falha)
                          setOk(falha ? null : 'Pet removido.')
                        }}
                      >
                        Excluir
                      </Botao>
                    </div>
                  </div>
                </div>
              </Cartao>
            )
          })}
        </div>
      )}
      <Modal aberto={aberto} titulo={id ? 'Editar pet' : 'Novo pet'} onFechar={() => setAberto(false)}>
        <form
          className="space-y-4"
          onSubmit={(evento) => {
            evento.preventDefault()
            const falha = salvarPet({
              id,
              tutorId,
              nome,
              especie,
              raca,
              nascimento,
              peso: Number(peso.replace(',', '.')),
              foto,
            })
            setErro(falha)
            if (!falha) {
              setOk('Pet salvo.')
              setAberto(false)
            }
          }}
        >
          <Aviso texto={erro} />
          <Campo label="Nome">
            <Texto value={nome} required onChange={(evento) => setNome(evento.target.value)} />
          </Campo>
          <Campo label="Espécie">
            <Selecao value={especie} onChange={(evento) => setEspecie(evento.target.value)}>
              {ESPECIES.map((item) => (
                <option key={item}>{item}</option>
              ))}
            </Selecao>
          </Campo>
          <Campo label="Raça">
            <Texto value={raca} required onChange={(evento) => setRaca(evento.target.value)} />
          </Campo>
          <Campo label="Nascimento">
            <Texto
              type="date"
              value={nascimento}
              required
              onChange={(evento) => setNascimento(evento.target.value)}
            />
          </Campo>
          <Campo label="Peso (kg)">
            <Texto value={peso} required onChange={(evento) => setPeso(evento.target.value)} />
          </Campo>
          <Campo label="Foto">
            <Texto
              type="file"
              accept="image/*"
              onChange={(evento) => {
                const arquivo = evento.target.files?.[0]
                if (!arquivo) return
                if (arquivo.size > 400_000) {
                  setErro('Escolha uma foto de até 400 KB.')
                  return
                }
                const leitor = new FileReader()
                leitor.onload = () => setFoto(String(leitor.result))
                leitor.readAsDataURL(arquivo)
              }}
            />
          </Campo>
          <Botao type="submit">Salvar</Botao>
        </form>
      </Modal>
    </Pagina>
  )
}
