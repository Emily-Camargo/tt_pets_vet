import Link from 'next/link'

export default function NaoEncontrada() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-3">
      <p className="text-lg font-bold">Página não encontrada</p>
      <Link href="/TT-Pets/login" className="font-medium text-marca">
        Ir para o login
      </Link>
    </div>
  )
}
