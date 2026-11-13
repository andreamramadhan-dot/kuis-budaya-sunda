import type { QuizCategory } from '../../types/quiz'

export const CATEGORY_META: Record<QuizCategory | 'all', { label: string; emoji: string; color: string; border: string; activeBg: string; activeText: string }> = {
  all:       { label: 'Semua',    emoji: '📚', color: 'text-slate-300',   border: 'border-slate-600',   activeBg: 'bg-slate-600',    activeText: 'text-white' },
  waditra:   { label: 'Waditra',  emoji: '🎵', color: 'text-violet-300',  border: 'border-violet-600',  activeBg: 'bg-violet-700',   activeText: 'text-violet-100' },
  basa:      { label: 'Basa',     emoji: '🗣️', color: 'text-sky-300',     border: 'border-sky-600',     activeBg: 'bg-sky-700',      activeText: 'text-sky-100' },
  paribasa:  { label: 'Paribasa', emoji: '📖', color: 'text-emerald-300', border: 'border-emerald-600', activeBg: 'bg-emerald-700',  activeText: 'text-emerald-100' },
  kuliner:   { label: 'Kuliner',  emoji: '🍜', color: 'text-amber-300',   border: 'border-amber-600',   activeBg: 'bg-amber-700',    activeText: 'text-amber-100' },
  sejarah:   { label: 'Sejarah',  emoji: '🏛️', color: 'text-rose-300',    border: 'border-rose-600',    activeBg: 'bg-rose-700',     activeText: 'text-rose-100' },
}

export const CATEGORY_ORDER: (QuizCategory | 'all')[] = [
  'all', 'waditra', 'basa', 'paribasa', 'kuliner', 'sejarah',
]
