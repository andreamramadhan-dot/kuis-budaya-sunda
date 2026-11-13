import type { QuizCategory } from '../../types/quiz'
import { CATEGORY_META, CATEGORY_ORDER } from './categoryMeta'

interface CategoryFilterBarProps {
  active: QuizCategory | 'all'
  counts: Record<QuizCategory | 'all', number>
  onChange: (c: QuizCategory | 'all') => void
}

export function CategoryFilterBar({ active, counts, onChange }: CategoryFilterBarProps) {
  return (
    <div className="flex gap-2 flex-wrap">
      {CATEGORY_ORDER.map(cat => {
        const meta = CATEGORY_META[cat]
        const isActive = active === cat
        const count = counts[cat] ?? 0

        return (
          <button
            key={cat}
            onClick={() => onChange(cat)}
            className={`
              flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border transition-all cursor-pointer
              ${isActive
                ? `${meta.activeBg} ${meta.activeText} border-transparent shadow-md`
                : `bg-slate-800/60 ${meta.color} ${meta.border} hover:bg-slate-700/60`}
            `}
          >
            <span>{meta.emoji}</span>
            <span>{meta.label}</span>
            <span className={`
              px-1.5 py-0.5 rounded-full text-[9px] font-black
              ${isActive ? 'bg-white/20 text-white' : 'bg-slate-700 text-slate-400'}
            `}>
              {count}
            </span>
          </button>
        )
      })}
    </div>
  )
}
