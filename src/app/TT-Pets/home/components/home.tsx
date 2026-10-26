'use client'

import {
  CalendarMonth,
  EventAvailable,
  Groups,
  LocationOn,
  MedicalServices,
  NotificationsNone,
  Pets,
  Shield,
  Vaccines,
  WorkspacePremium,
} from '@mui/icons-material'
import Link from 'next/link'
import type { ReactNode } from 'react'

import { cx, dataHora, hora, moeda, rotuloPerfil, rotuloStatus } from '@/domain/formatacao'
import type { Banco, Consulta, Plano, Usuario, Vacina } from '@/domain/tipos'
import { useUsuario } from '@/hooks/banco'
import { consultaAtiva, resumo } from '@/mocks/regras'

export function Home() {
  const { banco, usuario } = useUsuario()
  if (!usuario) return null

  if (usuario.perfil === 'admin') return <HomeAdmin banco={banco} usuario={usuario} />
  if (usuario.perfil === 'veterinario') {
    return <HomeVeterinario banco={banco} usuario={usuario} />
  }
  return <HomeTutor banco={banco} usuario={usuario} />
}

function HomeVeterinario({ banco, usuario }: { banco: Banco; usuario: Usuario }) {
  const veterinarioId = usuario.veterinarioId ?? ''
  const dados = resumo(banco, { veterinarioId })
  const veterinario = banco.veterinarios.find((item) => item.id === veterinarioId)
  const hoje = new Date()
  const doDia = dados.consultas.filter(
    (item) => item.status !== 'cancelada' && mesmoDia(item.dataHora, hoje),
  )
  const concluidas = doDia.filter((item) => item.status === 'realizada').length
  const proximas = dados.consultas
    .filter((item) => consultaAtiva(item.status) && new Date(item.dataHora) >= inicioDoDia(hoje))
    .sort((a, b) => a.dataHora.localeCompare(b.dataHora))
  const proxima = proximas[0]
  const petProximo = banco.pets.find((item) => item.id === proxima?.petId)
  const clientes = new Set(
    dados.consultas.filter((item) => item.status !== 'cancelada').map((item) => item.tutorId),
  )
  const petsAtendidos = new Set(
    dados.consultas.filter((item) => item.status !== 'cancelada').map((item) => item.petId),
  )
  const cidades =
    veterinario?.cidadeIds
      .map((id) => banco.cidades.find((item) => item.id === id)?.nome)
      .filter(Boolean)
      .join(' e ') || 'Sem cidade'
  const atendimento = proximas[0]
    ? `/TT-Pets/veterinario/atendimentos/${proximas[0].id}`
    : '/TT-Pets/veterinario/atendimentos'
  const semana = proximosDias(6).map((dia) => ({
    rotulo: dia.toLocaleDateString('pt-BR', { weekday: 'short' }).replace('.', '').slice(0, 3),
    valor: dados.consultas.filter(
      (item) => item.status !== 'cancelada' && mesmoDia(item.dataHora, dia),
    ).length,
  }))

  return (
    <Painel>
      <Hero
        perfil={rotuloPerfil(usuario.perfil)}
        nome={primeiroNome(usuario.nome)}
        texto="Sua agenda de visitas, seus pacientes e seus resultados num lugar só."
        mascote="cao"
        chips={[
          `${doDia.length} ${doDia.length === 1 ? 'visita hoje' : 'visitas hoje'}`,
          proxima && petProximo
            ? `Próxima: ${hora(proxima.dataHora)} · ${petProximo.nome}`
            : 'Sem visita marcada',
          cidades,
        ]}
        primario={{ href: '/TT-Pets/veterinario/agenda', label: 'Abrir minha agenda' }}
        secundario={{ href: atendimento, label: 'Iniciar atendimento' }}
      />
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <Metrica
          icone={<CalendarMonth sx={{ fontSize: 18 }} />}
          tom="bg-marca-anel text-marca"
          rotulo="Visitas hoje"
          valor={`${doDia.length} ${doDia.length === 1 ? 'agendada' : 'agendadas'}`}
          detalhe={`${concluidas} ${concluidas === 1 ? 'concluída' : 'concluídas'} · ${doDia.length - concluidas} ${doDia.length - concluidas === 1 ? 'pendente' : 'pendentes'}`}
        />
        <Metrica
          icone={<span className="text-base">💰</span>}
          tom="bg-emerald-50 text-emerald-600"
          rotulo="Faturamento dos planos"
          valor={moeda(dados.mrr)}
          detalhe={`${dados.assinaturas} ${dados.assinaturas === 1 ? 'assinatura ativa' : 'assinaturas ativas'}`}
        />
        <Metrica
          icone={<MedicalServices sx={{ fontSize: 18 }} />}
          tom="bg-sky-50 text-sky-600"
          rotulo="Atendimentos no mês"
          valor={String(dados.realizadasMes)}
          detalhe={`${dados.agendadas} em aberto`}
        />
        <Metrica
          icone={<Groups sx={{ fontSize: 18 }} />}
          tom="bg-amber-50 text-amber-600"
          rotulo="Clientes ativos"
          valor={String(clientes.size)}
          detalhe={`${petsAtendidos.size} ${petsAtendidos.size === 1 ? 'pet atendido' : 'pets atendidos'}`}
        />
      </div>
      <div className="grid gap-3 lg:grid-cols-2">
        <Cartao>
          <Cabeca
            titulo={doDia.length > 0 ? 'Agenda de hoje' : 'Próximas visitas'}
            href="/TT-Pets/veterinario/agenda"
            acao="Ver agenda completa"
          />
          {proximas.length === 0 ? (
            <p className="mt-4 text-sm text-slate-400">Nenhuma visita por perto.</p>
          ) : (
            <ul className="mt-3 divide-y divide-slate-100">
              {(doDia.length > 0 ? doDia : proximas).slice(0, 4).map((consulta) => (
                <LinhaConsulta key={consulta.id} banco={banco} consulta={consulta} />
              ))}
            </ul>
          )}
        </Cartao>
        <Cartao>
          <Cabeca
            titulo="Atendimentos na semana"
            href="/TT-Pets/veterinario/dashboard"
            acao="Meus resultados"
          />
          <Barras itens={semana} />
        </Cartao>
      </div>
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <Atalho href="/TT-Pets/veterinario/agenda" icone={<CalendarMonth sx={{ fontSize: 18 }} />} tom="bg-marca-anel text-marca" label="Minha agenda" />
        <Atalho href={atendimento} icone={<MedicalServices sx={{ fontSize: 18 }} />} tom="bg-sky-50 text-sky-600" label="Atendimento com IA" />
        <Atalho href="/TT-Pets/veterinario/clientes" icone={<Groups sx={{ fontSize: 18 }} />} tom="bg-amber-50 text-amber-600" label="Meus clientes" />
        <Atalho href="/TT-Pets/veterinario/dashboard" icone={<span className="text-base">📈</span>} tom="bg-emerald-50 text-emerald-600" label="Meus resultados" />
      </div>
    </Painel>
  )
}

function HomeTutor({ banco, usuario }: { banco: Banco; usuario: Usuario }) {
  const tutorId = usuario.tutorId ?? ''
  const pets = banco.pets.filter((item) => item.tutorId === tutorId)
  const consultas = banco.consultas
    .filter((item) => item.tutorId === tutorId && consultaAtiva(item.status))
    .sort((a, b) => a.dataHora.localeCompare(b.dataHora))
  const proxima = consultas[0]
  const petProximo = banco.pets.find((item) => item.id === proxima?.petId)
  const vacinas = banco.vacinas
    .filter((item) => pets.some((pet) => pet.id === item.petId))
    .map((item) => ({ ...item, dias: diasAte(item.proximaDose) }))
    .filter((item) => item.dias <= 30)
    .sort((a, b) => a.dias - b.dias)
  const assinaturas = banco.assinaturas.filter(
    (item) => item.tutorId === tutorId && item.status === 'ativa',
  )
  const planos = assinaturas
    .map((item) => banco.planos.find((plano) => plano.id === item.planoId))
    .filter((item) => item !== undefined)
  const plano = planos[0]
  const cidades = [
    ...new Set(
      assinaturas
        .map((item) => banco.cidades.find((cidade) => cidade.id === item.cidadeId)?.nome)
        .filter((nome): nome is string => Boolean(nome)),
    ),
  ]
  const avisos = banco.notificacoes
    .filter((item) => item.tutorId === tutorId && !item.lida)
    .sort((a, b) => b.criadaEm.localeCompare(a.criadaEm))
  const visitasUsadas = plano
    ? banco.consultas.filter((item) => {
        const assinatura = assinaturas.find((atual) => atual.planoId === plano.id)
        if (!assinatura || item.petId !== assinatura.petId || item.status === 'cancelada') {
          return false
        }
        const data = new Date(item.dataHora)
        const agora = new Date()
        return data.getMonth() === agora.getMonth() && data.getFullYear() === agora.getFullYear()
      }).length
    : 0
  const cuidados = [
    ...consultas.map((item) => ({
      id: item.id,
      quando: item.dataHora,
      titulo: `${item.motivo} · ${banco.pets.find((pet) => pet.id === item.petId)?.nome ?? 'Pet'}`,
      detalhe: `${hora(item.dataHora)} · ${banco.veterinarios.find((vet) => vet.id === item.veterinarioId)?.nome ?? 'Veterinário'} · ${rotuloStatus(item.status)}`,
    })),
    ...vacinas.map((item) => ({
      id: item.id,
      quando: `${item.proximaDose}T12:00:00`,
      titulo: `Vacina ${item.nome} · ${banco.pets.find((pet) => pet.id === item.petId)?.nome ?? 'Pet'}`,
      detalhe: item.dias <= 0 ? 'Vence hoje' : `Vence ${emDias(item.proximaDose)}`,
    })),
  ]
    .sort((a, b) => a.quando.localeCompare(b.quando))
    .slice(0, 4)

  return (
    <Painel>
      <Hero
        perfil={rotuloPerfil(usuario.perfil)}
        nome={primeiroNome(usuario.nome)}
        texto="Vacinas, planos e a visita do veterinário, no ritmo do seu pet."
        mascote="cao"
        chips={[
          pets.length === 1 ? '1 pet' : `${pets.length} pets`,
          proxima && petProximo ? `${petProximo.nome} · ${dataHora(proxima.dataHora)}` : 'Sem consulta marcada',
          cidades.length > 0 ? cidades.join(' e ') : 'Escolha um plano',
        ]}
        primario={{ href: '/TT-Pets/tutor/agendamentos', label: '+ Agendar consulta' }}
        secundario={{ href: '/TT-Pets/tutor/vacinas', label: 'Ver carteira de vacinação' }}
      />
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <Metrica
          icone={<CalendarMonth sx={{ fontSize: 18 }} />}
          tom="bg-marca-anel text-marca"
          rotulo="Próxima consulta"
          valor={proxima ? rotuloQuando(proxima.dataHora) : 'Nenhuma'}
          detalhe={
            proxima && petProximo
              ? `${petProximo.nome} · ${banco.veterinarios.find((item) => item.id === proxima.veterinarioId)?.nome ?? ''}`
              : 'Agende quando quiser'
          }
        />
        <Metrica
          icone={<Vaccines sx={{ fontSize: 18 }} />}
          tom="bg-rose-50 text-rose-500"
          rotulo="Vacinas a vencer"
          valor={vacinas[0] ? `${vacinas.length} ${emDias(vacinas[0].proximaDose)}` : 'Em dia'}
          detalhe={
            vacinas[0]
              ? `${banco.pets.find((item) => item.id === vacinas[0].petId)?.nome ?? 'Pet'} · ${vacinas[0].nome}`
              : 'Nenhuma dose próxima'
          }
        />
        <Metrica
          icone={<Shield sx={{ fontSize: 18 }} />}
          tom="bg-emerald-50 text-emerald-600"
          rotulo="Plano ativo"
          valor={planos.length > 1 ? `${planos.length} planos` : plano?.nome ?? 'Nenhum'}
          detalhe={detalheDoPlano(plano, visitasUsadas)}
        />
        <Metrica
          icone={<NotificationsNone sx={{ fontSize: 18 }} />}
          tom="bg-amber-50 text-amber-600"
          rotulo="Notificações"
          valor={avisos.length === 1 ? '1 nova' : `${avisos.length} novas`}
          detalhe={avisos[0] ? `Última ${haQuanto(avisos[0].criadaEm)}` : 'Tudo lido'}
        />
      </div>
      <div className="grid gap-3 lg:grid-cols-2">
        <Cartao>
          <Cabeca titulo="Meus pets" href="/TT-Pets/tutor/pets" acao="Ver todos" />
          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            {pets.slice(0, 2).map((pet) => {
              const vacina = banco.vacinas
                .filter((item) => item.petId === pet.id)
                .sort((a, b) => b.proximaDose.localeCompare(a.proximaDose))[0]
              const dias = vacina ? diasAte(vacina.proximaDose) : null
              return (
                <Link
                  key={pet.id}
                  href="/TT-Pets/tutor/pets"
                  className="rounded-2xl border border-slate-100 px-3 py-4 text-center transition hover:border-marca-borda"
                >
                  <span
                    className={cx(
                      'mx-auto grid h-14 w-14 place-items-center rounded-full text-2xl',
                      pet.especie === 'Gato' ? 'bg-amber-50' : 'bg-marca-clara',
                    )}
                  >
                    {pet.especie === 'Gato' ? '🐱' : '🐶'}
                  </span>
                  <p className="mt-3 font-semibold text-slate-800">{pet.nome}</p>
                  <p className="text-xs text-slate-400">
                    {pet.raca} · {idade(pet.nascimento)} · {pet.peso} kg
                  </p>
                  <SeloPet vacina={vacina} dias={dias} />
                </Link>
              )
            })}
            <Link
              href="/TT-Pets/tutor/pets"
              className="grid place-items-center rounded-2xl border border-dashed border-marca-borda px-3 py-6 text-center text-sm font-medium text-marca"
            >
              <span className="text-2xl leading-none">+</span>
              <span>Adicionar pet</span>
            </Link>
          </div>
        </Cartao>
        <Cartao>
          <Cabeca titulo="Próximos cuidados" href="/TT-Pets/tutor/agendamentos" acao="Agenda" />
          {cuidados.length === 0 ? (
            <p className="mt-4 text-sm text-slate-400">Nada marcado por enquanto.</p>
          ) : (
            <ul className="mt-2 divide-y divide-slate-100">
              {cuidados.map((item) => {
                const data = seloData(item.quando)
                return (
                  <li key={item.id} className="flex items-center gap-3 py-3">
                    <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-marca-clara text-center leading-tight">
                      <span className="text-[10px] font-semibold tracking-wide text-marca">{data.mes}</span>
                      <span className="text-sm font-semibold text-slate-800">{data.dia}</span>
                    </span>
                    <span>
                      <span className="block text-sm font-semibold text-slate-800">{item.titulo}</span>
                      <span className="block text-xs text-slate-400">{item.detalhe}</span>
                    </span>
                  </li>
                )
              })}
            </ul>
          )}
        </Cartao>
      </div>
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <Atalho href="/TT-Pets/tutor/agendamentos" icone={<CalendarMonth sx={{ fontSize: 18 }} />} tom="bg-marca-anel text-marca" label="Agendar consulta" />
        <Atalho href="/TT-Pets/tutor/vacinas" icone={<Vaccines sx={{ fontSize: 18 }} />} tom="bg-rose-50 text-rose-500" label="Carteira de vacinação" />
        <Atalho href="/TT-Pets/tutor/historico" icone={<EventAvailable sx={{ fontSize: 18 }} />} tom="bg-sky-50 text-sky-600" label="Histórico e receitas" />
        <Atalho href="/TT-Pets/tutor/planos" icone={<Shield sx={{ fontSize: 18 }} />} tom="bg-emerald-50 text-emerald-600" label="Meu plano" />
      </div>
    </Painel>
  )
}

function HomeAdmin({ banco, usuario }: { banco: Banco; usuario: Usuario }) {
  const ativos = banco.veterinarios.filter((item) => item.ativo)
  const receita = banco.assinaturas
    .filter((item) => item.status === 'ativa')
    .reduce((total, item) => {
      const plano = banco.planos.find((atual) => atual.id === item.planoId)
      return total + (plano?.precoMensal ?? 0)
    }, 0)
  const planosAtivos = banco.planos.filter((item) => item.ativo).length
  const barras = banco.veterinarios.map((vet) => ({
    rotulo: primeiroNome(vet.nome),
    valor: banco.planos.filter((item) => item.veterinarioId === vet.id && item.ativo).length,
  }))

  return (
    <Painel>
      <Hero
        perfil="Admin da plataforma"
        nome={primeiroNome(usuario.nome)}
        texto="Veterinários, cidades e planos da plataforma num só painel."
        mascote="patas"
        chips={[
          `${ativos.length} ${ativos.length === 1 ? 'veterinário ativo' : 'veterinários ativos'}`,
          `${banco.cidades.length} ${banco.cidades.length === 1 ? 'cidade' : 'cidades'}`,
          '3 perfis de acesso',
        ]}
        primario={{ href: '/TT-Pets/admin/veterinarios', label: '+ Cadastrar veterinário' }}
        secundario={{ href: '/TT-Pets/admin/veterinarios', label: 'Ver veterinários' }}
      />
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <Metrica
          icone={<MedicalServices sx={{ fontSize: 18 }} />}
          tom="bg-marca-anel text-marca"
          rotulo="Veterinários ativos"
          valor={String(ativos.length)}
          detalhe={`${banco.veterinarios.length - ativos.length} inativos`}
        />
        <Metrica
          icone={<span className="text-base">💰</span>}
          tom="bg-emerald-50 text-emerald-600"
          rotulo="Receita dos planos"
          valor={moeda(receita)}
          detalhe="Soma das assinaturas ativas"
        />
        <Metrica
          icone={<WorkspacePremium sx={{ fontSize: 18 }} />}
          tom="bg-sky-50 text-sky-600"
          rotulo="Planos ativos"
          valor={String(planosAtivos)}
          detalhe={`${banco.planos.length} cadastrados`}
        />
        <Metrica
          icone={<Pets sx={{ fontSize: 18 }} />}
          tom="bg-amber-50 text-amber-600"
          rotulo="Tutores e pets"
          valor={`${banco.tutores.length} · ${banco.pets.length}`}
          detalhe="contas de exemplo"
        />
      </div>
      <div className="grid gap-3 lg:grid-cols-2">
        <Cartao>
          <Cabeca titulo="Veterinários" href="/TT-Pets/admin/veterinarios" acao="Gerenciar" />
          <ul className="mt-2 divide-y divide-slate-100">
            {banco.veterinarios.map((vet) => {
              const cidades = vet.cidadeIds
                .map((id) => banco.cidades.find((item) => item.id === id)?.nome)
                .filter(Boolean)
                .join(' e ')
              const planos = banco.planos.filter((item) => item.veterinarioId === vet.id).length
              return (
                <li key={vet.id} className="flex items-center justify-between gap-3 py-3">
                  <span>
                    <span className="block text-sm font-semibold text-slate-800">{vet.nome}</span>
                    <span className="block text-xs text-slate-400">
                      {cidades || 'Sem cidade'} · {planos} {planos === 1 ? 'plano' : 'planos'}
                    </span>
                  </span>
                  <span
                    className={cx(
                      'rounded-full px-2 py-0.5 text-[11px] font-medium',
                      vet.ativo ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700',
                    )}
                  >
                    {vet.ativo ? 'Ativo' : 'Inativo'}
                  </span>
                </li>
              )
            })}
          </ul>
        </Cartao>
        <Cartao>
          <Cabeca titulo="Planos por veterinário" href="/TT-Pets/admin/planos" acao="Gerenciar" />
          <Barras itens={barras} />
        </Cartao>
      </div>
      <div className="grid gap-3 sm:grid-cols-3">
        <Atalho href="/TT-Pets/admin/veterinarios" icone={<MedicalServices sx={{ fontSize: 18 }} />} tom="bg-marca-anel text-marca" label="Veterinários" />
        <Atalho href="/TT-Pets/admin/cidades" icone={<LocationOn sx={{ fontSize: 18 }} />} tom="bg-sky-50 text-sky-600" label="Cidades" />
        <Atalho href="/TT-Pets/admin/planos" icone={<WorkspacePremium sx={{ fontSize: 18 }} />} tom="bg-amber-50 text-amber-600" label="Planos" />
      </div>
    </Painel>
  )
}

function Painel({ children }: { children: ReactNode }) {
  return (
    <div className="space-y-4" style={{ animation: 'tt-surgir 0.6s ease both' }}>
      {children}
      <p className="pt-2 text-center text-xs text-slate-400">Protótipo com dados de exemplo.</p>
    </div>
  )
}

function Hero({
  perfil,
  nome,
  texto,
  chips,
  primario,
  secundario,
  mascote,
}: {
  perfil: string
  nome: string
  texto: string
  chips: string[]
  primario: { href: string; label: string }
  secundario: { href: string; label: string }
  mascote: 'cao' | 'patas'
}) {
  return (
    <section className="rounded-3xl border border-marca-borda bg-linear-to-br from-white via-white to-marca-clara px-5 py-6 sm:px-8">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="max-w-xl">
          <p className="text-xs font-semibold tracking-[0.16em] text-marca uppercase">{perfil}</p>
          <h1 className="mt-2 text-4xl font-semibold tracking-tight text-slate-900">Olá, {nome}</h1>
          <p className="mt-2 text-sm leading-6 text-slate-500">{texto}</p>
          <div className="mt-4 flex flex-wrap gap-2">
            {chips.map((chip) => (
              <span
                key={chip}
                className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs text-slate-500"
              >
                {chip}
              </span>
            ))}
          </div>
          <div className="mt-5 flex flex-wrap gap-2">
            <BotaoLink href={primario.href}>{primario.label}</BotaoLink>
            <BotaoLink href={secundario.href} claro>
              {secundario.label}
            </BotaoLink>
          </div>
        </div>
        {mascote === 'cao' ? <Mascote /> : <Patas />}
      </div>
    </section>
  )
}

function Metrica({
  icone,
  tom,
  rotulo,
  valor,
  detalhe,
}: {
  icone: ReactNode
  tom: string
  rotulo: string
  valor: string
  detalhe: string
}) {
  return (
    <article className="rounded-2xl border border-slate-100 bg-white px-4 py-4 shadow-sm">
      <span className={cx('grid h-10 w-10 place-items-center rounded-xl', tom)}>{icone}</span>
      <p className="mt-3 text-xs text-slate-400">{rotulo}</p>
      <p className="mt-0.5 text-xl font-semibold text-slate-900">{valor}</p>
      <p className="mt-0.5 text-xs text-slate-400">{detalhe}</p>
    </article>
  )
}

function Cartao({ children }: { children: ReactNode }) {
  return <section className="rounded-2xl border border-slate-100 bg-white px-4 py-4 shadow-sm sm:px-5">{children}</section>
}

function Cabeca({ titulo, href, acao }: { titulo: string; href: string; acao: string }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <h2 className="font-semibold text-slate-900">{titulo}</h2>
      <Link href={href} className="text-sm font-medium text-marca">
        {acao}
      </Link>
    </div>
  )
}

function Atalho({
  href,
  icone,
  tom,
  label,
}: {
  href: string
  icone: ReactNode
  tom: string
  label: string
}) {
  return (
    <Link
      href={href}
      className="flex items-center gap-3 rounded-2xl border border-slate-100 bg-white px-4 py-4 text-sm font-medium text-slate-700 shadow-sm transition hover:border-marca-borda"
    >
      <span className={cx('grid h-10 w-10 place-items-center rounded-xl', tom)}>{icone}</span>
      {label}
    </Link>
  )
}

function BotaoLink({ href, claro, children }: { href: string; claro?: boolean; children: ReactNode }) {
  return (
    <Link
      href={href}
      className={cx(
        'inline-flex items-center rounded-full px-4 py-2 text-sm font-medium transition',
        claro ? 'border border-marca bg-white text-marca hover:bg-marca-clara' : 'bg-marca text-white hover:bg-marca-forte',
      )}
    >
      {children}
    </Link>
  )
}

function LinhaConsulta({ banco, consulta }: { banco: Banco; consulta: Consulta }) {
  const pet = banco.pets.find((item) => item.id === consulta.petId)
  const tutor = banco.tutores.find((item) => item.id === consulta.tutorId)
  return (
    <li className="flex items-center gap-3 py-3">
      <span className="w-12 shrink-0 text-sm font-semibold text-marca">{hora(consulta.dataHora)}</span>
      <span>
        <span className="block text-sm font-semibold text-slate-800">
          {pet?.nome} · {consulta.motivo}
        </span>
        <span className="block text-xs text-slate-400">
          {tutor?.nome} · {rotuloStatus(consulta.status)}
        </span>
      </span>
    </li>
  )
}

function Barras({ itens }: { itens: { rotulo: string; valor: number }[] }) {
  const maior = Math.max(...itens.map((item) => item.valor), 1)
  return (
    <div className="mt-6 flex h-44 items-end justify-between gap-3">
      {itens.map((item) => (
        <div key={item.rotulo} className="flex h-full flex-1 flex-col items-center justify-end gap-2">
          <div
            className={cx('w-full max-w-14 rounded-t-xl', item.valor > 0 ? 'bg-linear-to-t from-marca-forte to-[#c4b5fd]' : 'bg-slate-100')}
            style={{ height: `${item.valor > 0 ? Math.max((item.valor / maior) * 100, 18) : 8}%` }}
          />
          <span className="text-xs text-slate-400 capitalize">{item.rotulo}</span>
        </div>
      ))}
    </div>
  )
}

function Mascote() {
  return (
    <div className="relative mx-auto h-36 w-36 shrink-0" aria-hidden>
      <div
        className="absolute inset-0 rounded-full border border-dashed border-marca/30"
        style={{ animation: 'tt-girar 28s linear infinite' }}
      />
      <div className="absolute inset-3 rounded-full bg-white shadow-sm" />
      <span className="absolute top-1 right-3 text-sm" style={{ animation: 'tt-pata 3.2s ease-in-out infinite' }}>
        🐾
      </span>
      <span className="absolute bottom-4 left-1 text-sm" style={{ animation: 'tt-pata 3.2s ease-in-out 1s infinite' }}>
        🐾
      </span>
      <div className="absolute inset-0 grid place-items-center" style={{ animation: 'tt-flutuar 3.6s ease-in-out infinite' }}>
        <Cao />
      </div>
    </div>
  )
}

function Patas() {
  return (
    <div className="relative mx-auto h-36 w-36 shrink-0" aria-hidden>
      <div
        className="absolute inset-0 rounded-full border border-dashed border-marca/30"
        style={{ animation: 'tt-girar 28s linear infinite' }}
      />
      <div className="absolute inset-3 rounded-full bg-white shadow-sm" />
      <span className="absolute top-7 left-8 text-3xl" style={{ animation: 'tt-pata 3.2s ease-in-out infinite' }}>
        🐾
      </span>
      <span className="absolute right-7 bottom-7 text-3xl" style={{ animation: 'tt-pata 3.2s ease-in-out 0.8s infinite' }}>
        🐾
      </span>
    </div>
  )
}

function Cao() {
  return (
    <svg viewBox="0 0 80 80" className="h-16 w-16" aria-hidden>
      <ellipse cx="22" cy="24" rx="10" ry="14" fill="#c4a574" />
      <ellipse cx="58" cy="24" rx="10" ry="14" fill="#c4a574" />
      <ellipse cx="22" cy="24" rx="5" ry="8" fill="#e7c9a0" />
      <ellipse cx="58" cy="24" rx="5" ry="8" fill="#e7c9a0" />
      <circle cx="40" cy="42" r="22" fill="#e7c9a0" />
      <ellipse cx="31" cy="40" rx="4" ry="5" fill="#fff" />
      <ellipse cx="49" cy="40" rx="4" ry="5" fill="#fff" />
      <circle cx="32" cy="41" r="2" fill="#3f2a1d" />
      <circle cx="50" cy="41" r="2" fill="#3f2a1d" />
      <ellipse cx="40" cy="50" rx="4" ry="3" fill="#3f2a1d" />
      <path d="M36 54c2.5 3 5.5 3 8 0" fill="#f43f5e" />
    </svg>
  )
}

function detalheDoPlano(plano: Plano | undefined, visitasUsadas: number) {
  if (!plano) return 'Contrate para agendar'
  if (plano.visitasMes === null) return 'Visitas ilimitadas'
  return `${visitasUsadas} de ${plano.visitasMes} visitas no mês`
}

function SeloPet({ vacina, dias }: { vacina?: Vacina; dias: number | null }) {
  if (vacina && dias !== null && dias <= 20) {
    return (
      <span className="mt-3 inline-block rounded-full bg-amber-50 px-2 py-0.5 text-[11px] font-medium text-amber-700">
        {vacina.nome} vence {emDias(vacina.proximaDose)}
      </span>
    )
  }
  if (!vacina) return null
  return (
    <span className="mt-3 inline-block rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-medium text-emerald-700">
      Vacinas em dia
    </span>
  )
}

function primeiroNome(nome: string) {
  return nome.split(' ')[0]
}

function inicioDoDia(data: Date) {
  const copia = new Date(data)
  copia.setHours(0, 0, 0, 0)
  return copia
}

function mesmoDia(iso: string, dia: Date) {
  const data = new Date(iso)
  return (
    data.getFullYear() === dia.getFullYear() &&
    data.getMonth() === dia.getMonth() &&
    data.getDate() === dia.getDate()
  )
}

function proximosDias(quantidade: number) {
  const dias: Date[] = []
  const cursor = inicioDoDia(new Date())
  while (dias.length < quantidade) {
    cursor.setDate(cursor.getDate() + 1)
    if (cursor.getDay() !== 0) dias.push(new Date(cursor))
  }
  return dias
}

function diasAte(iso: string) {
  const alvo = new Date(iso.length === 10 ? `${iso}T12:00:00` : iso)
  const hoje = inicioDoDia(new Date())
  alvo.setHours(0, 0, 0, 0)
  return Math.round((alvo.getTime() - hoje.getTime()) / 86400000)
}

function emDias(iso: string) {
  const dias = diasAte(iso)
  if (dias <= 0) return 'hoje'
  if (dias === 1) return 'amanhã'
  return `em ${dias} dias`
}

function rotuloQuando(iso: string) {
  const dias = diasAte(iso)
  const horario = hora(iso)
  if (dias <= 0) return `Hoje, ${horario}`
  if (dias === 1) return `Amanhã, ${horario}`
  return dataHora(iso)
}

function haQuanto(iso: string) {
  const minutos = Math.max(1, Math.round((Date.now() - new Date(iso).getTime()) / 60000))
  if (minutos < 60) return `há ${minutos} min`
  const horas = Math.round(minutos / 60)
  if (horas < 24) return `há ${horas} h`
  const dias = Math.round(horas / 24)
  return dias === 1 ? 'há 1 dia' : `há ${dias} dias`
}

function idade(nascimento: string) {
  const nasc = new Date(`${nascimento}T12:00:00`)
  const agora = new Date()
  let anos = agora.getFullYear() - nasc.getFullYear()
  const mes = agora.getMonth() - nasc.getMonth()
  if (mes < 0 || (mes === 0 && agora.getDate() < nasc.getDate())) anos -= 1
  if (anos >= 1) return anos === 1 ? '1 ano' : `${anos} anos`
  let meses = agora.getMonth() - nasc.getMonth()
  if (agora.getDate() < nasc.getDate()) meses -= 1
  if (meses < 0) meses += 12
  return meses <= 1 ? '1 mês' : `${meses} meses`
}

function seloData(iso: string) {
  const data = new Date(iso.length === 10 ? `${iso}T12:00:00` : iso)
  const mes = data.toLocaleDateString('pt-BR', { month: 'short' }).replace('.', '').slice(0, 3).toUpperCase()
  return { mes, dia: String(data.getDate()).padStart(2, '0') }
}
