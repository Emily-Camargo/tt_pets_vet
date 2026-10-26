import { memo } from 'react'
import ExcelSvg from './svgs/excel.svg'
import CheckSvg from './svgs/check.svg'
import ConfigSvg from './svgs/config.svg'
import LoadingSvg from './svgs/loading.svg'

/**
 * Este é um arquivo de ícones. Para obter os ícones, visite https://icons8.com/icons
 * @ViniciusCLoeblein
 */

/**
 * ![img](./svgs/excel.svg)
 */
const ExcelIcon = memo(() => {
  return <img src={ExcelSvg} alt="Excel" loading="lazy" />
})
ExcelIcon.displayName = 'ExcelIcon'

/**
 * ![img](./svgs/check.svg)
 */
const Check = memo(() => {
  return <img src={CheckSvg} alt="Check" loading="lazy" />
})
Check.displayName = 'Check'

/**
 * ![img](./svgs/config.svg)
 */
const Config = memo(() => {
  return <img src={ConfigSvg} alt="Config" loading="lazy" />
})
Config.displayName = 'Config'

/**
 * ![img](./svgs/loading.svg|height=20|width=20)
 */
const Loading = memo(() => {
  return (
    <img
      src={LoadingSvg}
      alt="Loading"
      loading="lazy"
      className="inline w-5 h-5 animate-spin"
    />
  )
})
Loading.displayName = 'Loading'

export { ExcelIcon, Check, Config, Loading }
