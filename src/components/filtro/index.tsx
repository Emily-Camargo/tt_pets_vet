import { useState } from 'react'
import FiltroCard from './components/card'
import Filtros from './components/filtros'
import { FiltroProps } from './utils/interface'

const Filtro = <T, M extends boolean = false>({
  csv,
  title,
  inputs,
  onClear,
  onSubmit,
  pesquisa,
  excelProps,
  setPesquisa,
  inputSelect,
}: FiltroProps<T, M>): JSX.Element => {
  const [open, setOpen] = useState(false)

  function renderFiltro(): boolean {
    return (inputs?.length ?? 0) > 0 || (inputSelect?.length ?? 0) > 0
  }

  return (
    <div>
      <FiltroCard
        csv={csv}
        title={title}
        setOpen={setOpen}
        pesquisa={pesquisa}
        excelProps={excelProps}
        setPesquisa={setPesquisa}
        renderFiltro={renderFiltro()}
      />
      <Filtros
        open={open}
        inputs={inputs}
        setOpen={setOpen}
        onClear={onClear}
        onSubmit={onSubmit}
        inputSelect={inputSelect}
      />
    </div>
  )
}

export default Filtro
