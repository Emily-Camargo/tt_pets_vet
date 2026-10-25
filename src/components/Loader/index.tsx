import { cn } from '../../lib/utils'
import { useDimension } from '../../hooks'
import { useState } from 'react'
import Lottie, { LottieComponentProps } from 'lottie-react'

export type animations =
  | '404 animate'
  | '404'
  | 'errorPage'
  | 'LoadingDots'
  | 'LoadingFiles'
  | 'loadingPage'
  | 'loadingWhite'
  | 'notFound'
  | 'Page404'
  | 'sucess'
  | 'not-found'
  | 'socket'

export interface CustomLoadersProps extends Partial<LottieComponentProps> {
  msm?: string
  animation?: animations
  open: boolean
  width?: number | string
  noPadding?: boolean
}

export default function CustomLoaders({
  animation = 'LoadingDots',
  open,
  width = 350,
  msm,
  noPadding = false,
  ...rest
}: CustomLoadersProps) {
  const mobile = useDimension(550)
  const [animationData] = useState(null)

  const message = {
    '404 animate': '',
    'not-found': '',
    '404': '',
    errorPage: '',
    LoadingDots: '',
    LoadingFiles: '',
    loadingPage: '',
    loadingWhite: '',
    notFound: 'Não foram encontrados dados',
    Page404: '',
    sucess: '',
    socket: '',
  }

  return open && animationData ? (
    <div
      className={cn(
        'pt-24 p-8 flex flex-col items-center justify-center h-full',
        { 'pt-0 p-0': noPadding },
      )}
    >
      <Lottie
        {...rest}
        animationData={animationData}
        autoplay
        loop
        style={{ width: mobile ? 250 : width }}
      />
      <p className="flex text-center w-full justify-center text-system-300 text-sm">
        {msm ?? message[animation]}
      </p>
    </div>
  ) : null
}
