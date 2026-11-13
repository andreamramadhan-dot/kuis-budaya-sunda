import { Pencil, Trash2, Clock, Star } from 'lucide-react'
import type { Question } from '../../types/quiz'
import { CATEGORY_META } from './categoryMeta'

interface QuestionCardProps {
  question: Question
  isSelected: boolean
  onSelect: () => void
  onDelete: () => void
}

export function QuestionCard({ question, isSelected, onSelect, onDelete }: QuestionCardProps) {
  const meta = CATEGORY_META[question.category]
  const correctOption = question.options.find(o => o.isCorrect)

  return (
    <div
      className={`
        group relative p-3.5 rounded-xl border transition-all cursor-pointer
        ${isSelected
          ? 'bg-amber-500/10 border-amber-500/60 shadow-md shadow-amber-900/20'
          : 'bg-slate-800/50 border-slate-700/50 hover:border-slate-600/70 hover:bg-slate-800/70'}
      `}
      onClick={onSelect}
    >
      {/* Top row: category + points + timer */}
      <div className="flex items-center gap-2 mb-2">
        <span className={`
          inline-flex items-center gap-1 text-[9px] font-black px-2 py-0.5 rounded-full border uppercase tracking-wide
          ${meta.activeBg} ${meta.activeText} border-transparent
        `}>
          {meta.emoji} {meta.label}
        </span>
        <div className="flex items-center gap-1 text-[9px] text-amber-400 font-bold ml-auto">
          <Star size={9} />
          {question.points}pt
        </div>
        <div className="flex items-center gap-1 text-[9px] text-slate-500 font-bold">
          <Clock size={9} />
          {question.timeLimitSeconds}s
        </div>
      </div>

      {/* Question text */}
      <p className="text-xs text-slate-200 font-medium leading-relaxed line-clamp-2 mb-2">
        {question.questionText || <span className="text-slate-600 italic">Pertanyaan belum diisi...</span>}
      </p>

      {/* Answer preview */}
      {correctOption && (
        <p className="text-[10px] text-emerald-400 font-bold truncate">
          ✓ {correctOption.text}
        </p>
      )}

      {/* Action buttons (hover) */}
      <div className="absolute top-2.5 right-2.5 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          onClick={e => { e.stopPropagation(); onSelect() }}
          className="p-1 rounded-lg bg-slate-700 hover:bg-amber-600 text-slate-400 hover:text-white transition-all cursor-pointer"
          title="Edit"
        >
          <Pencil size={11} />
        </button>
        <button
          onClick={e => { e.stopPropagation(); onDelete() }}
          className="p-1 rounded-lg bg-slate-700 hover:bg-rose-600 text-slate-400 hover:text-white transition-all cursor-pointer"
          title="Hapus"
        >
          <Trash2 size={11} />
        </button>
      </div>
    </div>
  )
}
