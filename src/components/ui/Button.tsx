import type { ButtonHTMLAttributes, ReactNode } from 'react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode
  variant?: 'primary' | 'danger' | 'ghost' | 'wood'
  size?: 'sm' | 'md' | 'lg'
}

const variantMap: Record<NonNullable<ButtonProps['variant']>, string> = {
  primary: 'bg-amber-500 hover:bg-amber-400 text-slate-900 border-b-4 border-amber-700 hover:border-amber-600 active:border-b-0 active:translate-y-1',
  danger:  'bg-rose-600  hover:bg-rose-500  text-white      border-b-4 border-rose-800  hover:border-rose-700  active:border-b-0 active:translate-y-1',
  ghost:   'bg-slate-700 hover:bg-slate-600 text-slate-200  border-b-4 border-slate-900 hover:border-slate-800 active:border-b-0 active:translate-y-1',
  wood:    'bg-amber-800 hover:bg-amber-700 text-amber-100  border-b-4 border-amber-950 hover:border-amber-900 active:border-b-0 active:translate-y-1',
}

const sizeMap: Record<NonNullable<ButtonProps['size']>, string> = {
  sm:  'px-3 py-1.5 text-xs rounded-xl',
  md:  'px-5 py-2.5 text-sm rounded-2xl',
  lg:  'px-7 py-3.5 text-base rounded-2xl',
}

export function Button({ children, variant = 'primary', size = 'md', className = '', ...props }: ButtonProps) {
  return (
    <button
      {...props}
      className={`
        font-bold tracking-wide transition-all duration-100 cursor-pointer
        disabled:opacity-50 disabled:cursor-not-allowed
        ${variantMap[variant]}
        ${sizeMap[size]}
        ${className}
      `}
    >
      {children}
    </button>
  )
}
