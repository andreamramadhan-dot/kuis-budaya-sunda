import type { ReactNode } from 'react'

interface BadgeProps {
  children: ReactNode
  variant?: 'amber' | 'emerald' | 'violet' | 'rose' | 'sky' | 'slate'
  size?: 'sm' | 'md'
}

const variantMap: Record<NonNullable<BadgeProps['variant']>, string> = {
  amber:   'bg-amber-400/20 text-amber-300 border border-amber-500/40',
  emerald: 'bg-emerald-400/20 text-emerald-300 border border-emerald-500/40',
  violet:  'bg-violet-400/20 text-violet-300 border border-violet-500/40',
  rose:    'bg-rose-400/20 text-rose-300 border border-rose-500/40',
  sky:     'bg-sky-400/20 text-sky-300 border border-sky-500/40',
  slate:   'bg-slate-600/40 text-slate-300 border border-slate-500/40',
}

export function Badge({ children, variant = 'amber', size = 'sm' }: BadgeProps) {
  return (
    <span className={`
      inline-flex items-center gap-1 font-bold tracking-wide uppercase rounded-full
      ${size === 'sm' ? 'px-2 py-0.5 text-[10px]' : 'px-3 py-1 text-xs'}
      ${variantMap[variant]}
    `}>
      {children}
    </span>
  )
}
