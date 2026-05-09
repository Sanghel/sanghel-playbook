import { Slot } from '@radix-ui/react-slot'
import { type ButtonHTMLAttributes } from 'react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean
  variant?: 'default' | 'outline' | 'ghost'
}

export function Button({ asChild, variant = 'default', className, ...props }: ButtonProps) {
  const Comp = asChild ? Slot : 'button'
  return <Comp data-variant={variant} className={className} {...props} />
}
