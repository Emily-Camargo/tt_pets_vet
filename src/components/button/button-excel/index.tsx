import ExcelJS from 'exceljs'
import { cn } from '../../../lib/utils'
import { Tooltip, Zoom } from '@mui/material'
import { ExcelIcon } from '../../../components/icons'

export interface ButtonExcelProps<T> {
  mr?: boolean
  nomeArq: string
  nomePlanilha?: string
  cabecalhos: string[]
  keys: string[]
  data: T[]
  filho?: string
  widthColumn?: { width: number; column: string }[]
  title?: string
  onLoading?: (e: boolean) => void
}
/**
 * Componente de botão para download de dados em formato Excel.
 *
 * @component
 * @param {object} props - Propriedades do componente.
 * @param {boolean} [props.mr] - Indica se deve haver margem à direita.
 * @param {string} props.nomeArq - Nome do arquivo Excel a ser baixado.
 * @param {string} [props.nomePlanilha] - Nome da planilha no arquivo Excel.
 * @param {string[]} props.cabecalhos - Cabeçalhos das colunas da planilha.
 * @param {string[]} props.keys - Chaves para obter os valores das colunas a partir dos dados.
 * @param {Array} props.data - Dados a serem incluídos na planilha.
 * @param {string} [props.filho] - Nome da propriedade contendo dados filhos alinhados.
 * @param {Array} [props.widthColumn] - Configuração da largura das colunas na planilha.
 *
 * @returns {JSX.Element} Retorna o JSX do componente ButtonExcel.
 */
export default function ButtonExcel<T>({
  mr,
  cabecalhos,
  nomeArq,
  nomePlanilha,
  data,
  keys,
  filho = '',
  widthColumn,
  title = 'Download para excel',
  onLoading,
}: Readonly<ButtonExcelProps<T>>): JSX.Element {
  /**
   * Adiciona os valores da planilha à worksheet.
   *
   * @param {ExcelJS.Worksheet} ws - Instância da planilha Excel.
   * @returns {Promise<void>} Uma Promise vazia.
   */

  const addValoresPlanilha = async (ws: ExcelJS.Worksheet): Promise<void> => {
    const bordas: Partial<ExcelJS.Borders> = {
      top: { style: 'thin', color: { argb: '666666' } },
      left: { style: 'thin', color: { argb: '666666' } },
      bottom: { style: 'thin', color: { argb: '666666' } },
      right: { style: 'thin', color: { argb: '666666' } },
    }

    const cabecalho = ws.addRow(cabecalhos)
    cabecalho.eachCell((cell) => {
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: '10B981' },
      }
      cell.font = { bold: true, name: 'Calibri' }
      cell.alignment = {
        vertical: 'middle',
        horizontal: 'center',
      }
      cell.border = bordas
    })

    data.forEach((v: any) => {
      const rowValues = keys.map((key) => v[key])
      const row = ws.addRow(rowValues)
      widthColumn?.forEach((v) => {
        ws.getColumn(v.column).width = v.width
      })

      row.eachCell({ includeEmpty: true }, (cell) => {
        cell.border = bordas
      })

      if (Object.hasOwn(v, filho)) {
        row.font = { bold: true, name: 'Calibri' }
        const arrayFilho = v[filho]
        if (Array.isArray(arrayFilho)) {
          arrayFilho.forEach((objFilho: any) => {
            const valorAlterado = keys.map((key) => objFilho[key])
            const row1 = ws.addRow(valorAlterado)
            row1.font = { name: 'Calibri' }
          })
          ws.addRow([''])
        }
      }
    })
  }

  const gerarExcel = async () => {
    onLoading && onLoading(true)
    const wb = new ExcelJS.Workbook()
    const ws = wb.addWorksheet(nomePlanilha ?? 'planilha')

    await addValoresPlanilha(ws)

    const buffer = await wb.xlsx.writeBuffer()
    const blob = new Blob([buffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = `${nomeArq}.xlsx`
    link.click()
    onLoading && onLoading(false)
  }

  return (
    <Tooltip placement="left" title={title} TransitionComponent={Zoom}>
      <button
        type="button"
        onClick={() => gerarExcel()}
        className={cn(
          '!bg-grzprimary transition-all ease-in-out duration-300 w-10 h-10 p-3 pt-2 rounded-md hover:!bg-grzsecondary justify-center flex',
          { 'mr-4': mr },
        )}
      >
        <ExcelIcon />
      </button>
    </Tooltip>
  )
}
