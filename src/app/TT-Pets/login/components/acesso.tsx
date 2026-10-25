'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  useEffect,
  useState,
  type ButtonHTMLAttributes,
  type FormEvent,
  type InputHTMLAttributes,
} from 'react'

import { definirSessao } from '@/auth/sessao'
import { cpf, destino, telefone } from '@/domain/formatacao'
import { useUsuario } from '@/hooks/banco'
import { cadastrarTutor, entrar } from '@/mocks/acoes'
import { SENHA_DEMO } from '@/mocks/catalogo'

const ROXO = '#7434d6'

const BENEFICIOS_LOGIN = [
  'Acompanhe vacinas e o histórico do pet',
  'Agende a consulta sem sair de casa',
  'Escolha o plano do veterinário da sua cidade',
  'Receba receitas e o retorno no celular',
  'Lembretes de dose e de atendimento',
]

const BENEFICIOS_CADASTRO = [
  'Consulta veterinária em domicílio',
  'Planos com visitas mensais inclusas',
  'Carteira de vacinas e receitas',
  'Agenda com o veterinário da sua cidade',
]

export function Acesso({ modo }: { modo: 'login' | 'cadastro' }) {
  const router = useRouter()
  const { usuario, pronto } = useUsuario()
  const cadastro = modo === 'cadastro'

  useEffect(() => {
    if (modo === 'login' && pronto && usuario) router.replace(destino(usuario.perfil))
  }, [modo, pronto, usuario, router])

  if (modo === 'login' && !pronto) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white text-sm font-semibold text-slate-500">
        Carregando TT Pets...
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col bg-white lg:flex-row">
      <section
        className={`flex min-h-screen flex-1 flex-col items-center justify-center px-6 py-10 ${
          cadastro ? 'order-2' : 'order-1'
        }`}
      >
        {cadastro ? <FormularioCadastro /> : <FormularioLogin />}
      </section>
      <aside
        className={`relative flex min-h-[34rem] flex-1 flex-col items-center justify-center px-8 py-16 text-center text-white lg:min-h-screen ${
          cadastro ? 'order-1' : 'order-2'
        }`}
        style={{ backgroundColor: ROXO }}
      >
        {cadastro ? <PainelCadastro /> : <PainelLogin />}
      </aside>
    </div>
  )
}

function FormularioLogin() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [mostrarSenha, setMostrarSenha] = useState(false)
  const [erro, setErro] = useState<string | null>(null)
  const [lembrete, setLembrete] = useState(false)

  function acessar(emailAcesso: string, senhaAcesso: string) {
    const resultado = entrar(emailAcesso, senhaAcesso)
    if ('erro' in resultado && resultado.erro) {
      setErro(resultado.erro)
      return
    }
    if (!('usuario' in resultado) || !resultado.usuario) return
    definirSessao(resultado.usuario.id)
    router.replace(destino(resultado.usuario.perfil))
  }

  return (
    <div className="w-full max-w-[390px]">
      <h1 className="text-center text-[22px] font-semibold" style={{ color: ROXO }}>
        Faça seu login
      </h1>
      <form
        className="mt-8 space-y-3"
        onSubmit={(evento) => {
          evento.preventDefault()
          acessar(email, senha)
        }}
      >
        {erro && <p className="text-center text-sm text-red-600">{erro}</p>}
        <CampoCinza
          type="email"
          placeholder="E-mail *"
          value={email}
          autoComplete="email"
          onChange={setEmail}
        />
        <CampoSenha
          placeholder="Senha *"
          value={senha}
          visivel={mostrarSenha}
          onChange={setSenha}
          onAlternar={() => setMostrarSenha((atual) => !atual)}
        />
        <BotaoRoxo type="submit">Entrar</BotaoRoxo>
      </form>
      <button
        type="button"
        className="mt-4 w-full text-center text-xs"
        style={{ color: ROXO }}
        onClick={() => setLembrete((atual) => !atual)}
      >
        Esqueceu sua senha?
      </button>
      {lembrete && (
        <p className="mt-2 text-center text-xs leading-5 text-slate-500">
          Nas contas de exemplo a senha é {SENHA_DEMO}. Se você criou a sua, use a senha do cadastro.
        </p>
      )}
      <p className="mt-5 text-center text-sm text-slate-600">
        Não tem conta?{' '}
        <Link href="/TT-Pets/cadastro" className="font-semibold" style={{ color: ROXO }}>
          Criar conta
        </Link>
      </p>
      <div className="mt-8">
        <p className="text-center text-sm font-bold text-slate-800">Cuidado completo do pet</p>
        <ul className="mt-4 space-y-2.5">
          {BENEFICIOS_LOGIN.map((item) => (
            <li key={item} className="flex items-start gap-2.5 text-sm text-slate-600">
              <Check />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>
      <p className="mt-8 text-center text-[11px] leading-5 text-slate-400">
        Acesso para tutores e veterinários. Consulta em domicílio, planos e carteira de vacinas.
      </p>
    </div>
  )
}

function FormularioCadastro() {
  const router = useRouter()
  const [etapa, setEtapa] = useState<1 | 2>(1)
  const [nome, setNome] = useState('')
  const [documento, setDocumento] = useState('')
  const [email, setEmail] = useState('')
  const [fone, setFone] = useState('')
  const [senha, setSenha] = useState('')
  const [confirmar, setConfirmar] = useState('')
  const [mostrarSenha, setMostrarSenha] = useState(false)
  const [erro, setErro] = useState<string | null>(null)

  function avancar(evento: FormEvent) {
    evento.preventDefault()
    if (documento.replace(/\D/g, '').length < 11) {
      setErro('Informe um CPF com 11 dígitos.')
      return
    }
    if (fone.replace(/\D/g, '').length < 10) {
      setErro('Informe um telefone com DDD.')
      return
    }
    setErro(null)
    setEtapa(2)
  }

  function concluir(evento: FormEvent) {
    evento.preventDefault()
    if (senha.length < 6) {
      setErro('A senha precisa ter ao menos 6 caracteres.')
      return
    }
    if (senha !== confirmar) {
      setErro('A confirmação da senha não confere.')
      return
    }
    const falha = cadastrarTutor({
      nome,
      cpf: documento,
      telefone: fone,
      email,
      senha,
    })
    if (falha) {
      setErro(falha)
      return
    }
    const acesso = entrar(email, senha)
    if (!('usuario' in acesso) || !acesso.usuario) {
      setErro('Conta criada, mas o login falhou.')
      return
    }
    definirSessao(acesso.usuario.id)
    router.replace('/TT-Pets/tutor/pets')
  }

  return (
    <div className="w-full max-w-[420px]">
      <h1 className="text-center text-[22px] font-semibold" style={{ color: ROXO }}>
        Criar conta
      </h1>
      <div className="mx-auto mt-4 h-1.5 w-full max-w-[280px] overflow-hidden rounded-full bg-[#eceff3]">
        <div
          className="h-full rounded-full transition-all"
          style={{ width: etapa === 1 ? '46%' : '100%', backgroundColor: ROXO }}
        />
      </div>
      {etapa === 1 ? (
        <form className="mt-8 space-y-3" onSubmit={avancar}>
          {erro && <p className="text-center text-sm text-red-600">{erro}</p>}
          <CampoCinza placeholder="Nome completo" value={nome} autoComplete="name" onChange={setNome} />
          <CampoCinza
            placeholder="CPF"
            value={documento}
            inputMode="numeric"
            autoComplete="off"
            onChange={(valor) => setDocumento(cpf(valor))}
          />
          <CampoCinza
            type="email"
            placeholder="E-mail"
            value={email}
            autoComplete="email"
            onChange={setEmail}
          />
          <CampoCinza
            placeholder="Telefone"
            value={fone}
            inputMode="tel"
            autoComplete="tel"
            onChange={(valor) => setFone(telefone(valor))}
          />
          <CampoSenha
            placeholder="Senha"
            value={senha}
            visivel={mostrarSenha}
            onChange={setSenha}
            onAlternar={() => setMostrarSenha((atual) => !atual)}
          />
          <div className="flex justify-end pt-2">
            <BotaoRoxo type="submit" className="w-auto px-5">
              Próximo
            </BotaoRoxo>
          </div>
        </form>
      ) : (
        <form className="mt-8 space-y-3" onSubmit={concluir}>
          {erro && <p className="text-center text-sm text-red-600">{erro}</p>}
          <p className="text-sm text-slate-500">
            Confirme a senha para criar a conta de tutor e cadastrar seus pets.
          </p>
          <CampoSenha
            placeholder="Confirmar senha"
            value={confirmar}
            visivel={mostrarSenha}
            onChange={setConfirmar}
            onAlternar={() => setMostrarSenha((atual) => !atual)}
          />
          <p className="text-xs leading-5 text-slate-500">
            Ao continuar, você cria seu acesso de tutor no TT Pets Vet para planos, agenda e atendimento domiciliar.
          </p>
          <div className="flex items-center justify-between pt-2">
            <button
              type="button"
              className="text-sm font-semibold"
              style={{ color: ROXO }}
              onClick={() => {
                setErro(null)
                setEtapa(1)
              }}
            >
              Voltar
            </button>
            <BotaoRoxo type="submit" className="w-auto px-5">
              Criar conta
            </BotaoRoxo>
          </div>
        </form>
      )}
    </div>
  )
}

function PainelLogin() {
  return (
    <>
      <div className="flex max-w-md flex-col items-center">
        <Logo />
        <h2 className="mt-10 text-3xl font-semibold tracking-tight">
          Cuidado veterinário na casa do seu pet
        </h2>
        <p className="mt-4 max-w-sm text-sm leading-6 text-white/85">
          Planos mensais, consulta em domicílio, vacinas e o histórico do pet em um só lugar. Para tutores e veterinários.
        </p>
        <p className="mt-8 rounded-full border border-white/25 bg-white/10 px-5 py-2 text-[13px] font-medium text-white/95">
          Atendimento em Passo Fundo e Marau
        </p>
      </div>
      <p className="absolute bottom-8 left-0 right-0 text-center text-xs leading-5 text-white/75">
        consulta domiciliar · carteira de vacinas
        <br />
        planos por cidade e por veterinário
      </p>
    </>
  )
}

function PainelCadastro() {
  return (
    <>
      <div className="flex max-w-md flex-col items-center">
        <Logo />
        <h2 className="mt-10 text-3xl font-semibold tracking-tight">
          Cadastre-se para cuidar do seu pet em casa
        </h2>
        <p className="mt-3 text-sm text-white/80">Faça parte do TT Pets Vet</p>
        <ul className="mt-8 space-y-3 text-left">
          {BENEFICIOS_CADASTRO.map((item) => (
            <li key={item} className="flex items-center gap-3 text-sm text-white/95">
              <CheckClaro />
              <span>{item}</span>
            </li>
          ))}
        </ul>
        <Link
          href="/TT-Pets/login"
          className="mt-10 inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-5 py-2 text-[13px] font-medium text-white transition hover:bg-white/20"
        >
          <span aria-hidden>←</span>
          Voltar para Login
        </Link>
      </div>
      <p className="absolute bottom-8 left-0 right-0 text-center text-xs leading-5 text-white/75">
        atendimento onde o pet está
        <br />
        veterinários de Passo Fundo e Marau
      </p>
    </>
  )
}

function Logo() {
  return (
    <div className="flex items-center gap-3">
      <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/15">
        <svg viewBox="0 0 24 24" className="h-6 w-6 fill-white" aria-hidden>
          <circle cx="6.2" cy="8" r="2" />
          <circle cx="10.4" cy="5.2" r="2" />
          <circle cx="15" cy="6" r="2" />
          <circle cx="18.2" cy="9.6" r="1.8" />
          <path d="M8.4 13.8c.5-1.5 1.9-2.5 3.6-2.5s3.1 1 3.6 2.5c.7 2-.4 4.1-2 4.9-.9.4-1.5.4-1.6.4s-.7 0-1.6-.4c-1.6-.8-2.7-2.9-2-4.9z" />
        </svg>
      </span>
      <span className="text-left text-lg leading-tight font-semibold">
        TT Pets
        <span className="block text-xs font-medium tracking-[0.18em] text-white/80">VET</span>
      </span>
    </div>
  )
}

function CampoCinza({
  onChange,
  ...props
}: {
  onChange: (valor: string) => void
} & Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'className'>) {
  return (
    <input
      {...props}
      required
      onChange={(evento) => onChange(evento.target.value)}
      className="w-full rounded-lg bg-[#f3f4f6] px-4 py-3.5 text-sm text-slate-700 outline-none placeholder:text-slate-400 focus:ring-2 focus:ring-[#7434d6]/25"
    />
  )
}

function CampoSenha({
  visivel,
  onChange,
  onAlternar,
  ...props
}: {
  visivel: boolean
  onChange: (valor: string) => void
  onAlternar: () => void
} & Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'className' | 'type'>) {
  return (
    <div className="relative">
      <input
        {...props}
        required
        type={visivel ? 'text' : 'password'}
        onChange={(evento) => onChange(evento.target.value)}
        className="w-full rounded-lg bg-[#f3f4f6] px-4 py-3.5 pr-12 text-sm text-slate-700 outline-none placeholder:text-slate-400 focus:ring-2 focus:ring-[#7434d6]/25"
      />
      <button
        type="button"
        className="absolute top-1/2 right-3 -translate-y-1/2 text-slate-400"
        aria-label={visivel ? 'Ocultar senha' : 'Mostrar senha'}
        onClick={onAlternar}
      >
        <Olho aberto={visivel} />
      </button>
    </div>
  )
}

function BotaoRoxo({
  children,
  className = 'w-full',
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...props}
      className={`h-10 rounded-full px-4 text-[13px] font-medium text-white shadow-sm shadow-[#7434d6]/20 transition hover:brightness-110 ${className}`}
      style={{ backgroundColor: ROXO }}
    >
      {children}
    </button>
  )
}

function Check() {
  return (
    <span
      className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[11px] text-white"
      style={{ backgroundColor: ROXO }}
      aria-hidden
    >
      ✓
    </span>
  )
}

function CheckClaro() {
  return (
    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-white/20 text-[11px]" aria-hidden>
      ✓
    </span>
  )
}

function Olho({ aberto }: { aberto: boolean }) {
  if (aberto) {
    return (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
        <path d="M3 3l18 18" />
        <path d="M10.6 10.6a2 2 0 002.8 2.8" />
        <path d="M9.9 5.2A10.8 10.8 0 0121 12c-.7 1.2-1.6 2.3-2.6 3.2M6.1 6.1C4.4 7.4 3 9.4 3 12c1.6 3.2 5 6 9 6 1.5 0 2.9-.4 4.2-1" />
      </svg>
    )
  }
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
      <path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6S2 12 2 12z" />
      <circle cx="12" cy="12" r="2.5" />
    </svg>
  )
}

