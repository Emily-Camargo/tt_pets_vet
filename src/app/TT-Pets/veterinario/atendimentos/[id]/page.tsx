import { DetalheAtendimento } from '@/app/TT-Pets/atendimento/components/detalhe'

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  return <DetalheAtendimento consultaId={id} />
}
