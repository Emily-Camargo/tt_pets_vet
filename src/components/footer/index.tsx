import Button, { ButtonDisprops } from '../button'
import { cn } from '../../lib/utils'

export type ButtonProps = ButtonDisprops & {
  render?: boolean
  text: string
  ml?: boolean
  mr?: boolean
}

export interface FooterProps {
  className?: string
  buttons?: ButtonProps[]
}

export default function Footer({ className, buttons }: Readonly<FooterProps>) {
  return (
    <footer
      className={cn(
        'py-2 px-4 bg-white text-right flex w-full flex-row-reverse absolute rounded pb-2 rounded-b-lg border-t z-10',
        className,
      )}
      style={{ bottom: '-85px' }}
    >
      {buttons?.map((v) => {
        const { render = true, ml, mr, text, ...rest } = v
        return render ? (
          <div key={text} className={cn({ 'ml-4': ml, 'mr-4': mr })}>
            {' '}
            <Button {...rest}>{text}</Button>{' '}
          </div>
        ) : null
      })}
    </footer>
  )
}
