import { Save, X, Plus, Clock, Star } from 'lucide-react'
import type { QuizCategory } from '../../types/quiz'
import type { BankSoalState } from '../../hooks/useBankSoal'
import { Button } from '../ui/Button'
import { CATEGORY_META, CATEGORY_ORDER } from './categoryMeta'

type Props = Pick<
  BankSoalState,
  'draftQuestion' | 'updateDraft' | 'updateDraftOption' | 'saveQuestion' | 'cancelEdit'
>

const OPTION_LABEL = ['A', 'B', 'C', 'D']

export function QuestionEditor({ draftQuestion, updateDraft, updateDraftOption, saveQuestion, cancelEdit }: Props) {
  const isValid =
    draftQuestion.questionText.trim().length > 0 &&
    draftQuestion.options.every(o => o.text.trim().length > 0) &&
    draftQuestion.options.some(o => o.isCorrect)

  return (
    <div className="flex flex-col h-full">
      {/* Editor header */}
      <div className="flex items-center justify-between px-5 py-3 border-b border-slate-700/60 shrink-0">
        <div className="flex items-center gap-2">
          <Plus size={15} className="text-amber-400" />
          <h3 className="text-sm font-black text-amber-300">
            {draftQuestion.id.startsWith('q-') ? '+ Soal Baru' : '✏️ Edit Soal'}
          </h3>
        </div>
        <button onClick={cancelEdit} className="p-1 rounded-lg hover:bg-slate-700 text-slate-500 hover:text-slate-200 cursor-pointer transition-all">
          <X size={14} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-5 py-4 space-y-5 scrollbar-thin scrollbar-thumb-slate-600">
        {/* Category */}
        <div>
          <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">
            Kategori
          </label>
          <div className="flex flex-wrap gap-2">
            {(CATEGORY_ORDER.filter(c => c !== 'all') as QuizCategory[]).map(cat => {
              const meta = CATEGORY_META[cat]
              const isActive = draftQuestion.category === cat
              return (
                <button
                  key={cat}
                  onClick={() => updateDraft({ category: cat, categoryLabel: meta.label })}
                  className={`
                    flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold border transition-all cursor-pointer
                    ${isActive ? `${meta.activeBg} ${meta.activeText} border-transparent` : `bg-slate-800 ${meta.color} ${meta.border}`}
                  `}
                >
                  {meta.emoji} {meta.label}
                </button>
              )
            })}
          </div>
        </div>

        {/* Question text */}
        <div>
          <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">
            Teks Pertanyaan
          </label>
          <textarea
            value={draftQuestion.questionText}
            onChange={e => updateDraft({ questionText: e.target.value })}
            rows={3}
            placeholder="Ketik pertanyaan di sini..."
            className="w-full px-3 py-2.5 bg-slate-800 border border-slate-600 rounded-xl text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-amber-500 resize-none transition-colors"
          />
        </div>

        {/* Options */}
        <div>
          <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">
            Pilihan Jawaban
            <span className="ml-2 normal-case font-normal text-slate-600">(klik tombol untuk menandai jawaban benar)</span>
          </label>
          <div className="space-y-2">
            {draftQuestion.options.map((option, i) => (
              <div key={option.id} className="flex gap-2 items-center">
                {/* Correct answer selector */}
                <button
                  onClick={() => updateDraftOption(option.id, { isCorrect: true })}
                  className={`
                    w-7 h-7 rounded-full text-xs font-black shrink-0 border-2 transition-all cursor-pointer
                    ${option.isCorrect
                      ? 'bg-emerald-500 border-emerald-400 text-white shadow-md shadow-emerald-900/40'
                      : 'bg-slate-700 border-slate-600 text-slate-500 hover:border-emerald-600'}
                  `}
                  title="Jadikan jawaban benar"
                >
                  {OPTION_LABEL[i]}
                </button>
                <input
                  type="text"
                  value={option.text}
                  onChange={e => updateDraftOption(option.id, { text: e.target.value })}
                  placeholder={`Pilihan ${OPTION_LABEL[i]}...`}
                  className={`
                    flex-1 px-3 py-2 bg-slate-800 border rounded-xl text-sm text-slate-100 placeholder-slate-600
                    focus:outline-none transition-colors
                    ${option.isCorrect ? 'border-emerald-600 focus:border-emerald-400' : 'border-slate-600 focus:border-amber-500'}
                  `}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Points + Timer */}
        <div className="flex gap-3">
          <div className="flex-1">
            <label className="flex items-center gap-1 text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">
              <Star size={9} /> Poin
            </label>
            <select
              value={draftQuestion.points}
              onChange={e => updateDraft({ points: Number(e.target.value) })}
              className="w-full px-3 py-2 bg-slate-800 border border-slate-600 rounded-xl text-sm text-slate-100 focus:outline-none focus:border-amber-500 cursor-pointer"
            >
              {[50, 100, 150, 200, 250, 300].map(p => (
                <option key={p} value={p}>{p} poin</option>
              ))}
            </select>
          </div>
          <div className="flex-1">
            <label className="flex items-center gap-1 text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">
              <Clock size={9} /> Batas Waktu
            </label>
            <select
              value={draftQuestion.timeLimitSeconds}
              onChange={e => updateDraft({ timeLimitSeconds: Number(e.target.value) })}
              className="w-full px-3 py-2 bg-slate-800 border border-slate-600 rounded-xl text-sm text-slate-100 focus:outline-none focus:border-amber-500 cursor-pointer"
            >
              {[10, 15, 20, 25, 30, 45, 60].map(s => (
                <option key={s} value={s}>{s} detik</option>
              ))}
            </select>
          </div>
        </div>

        {/* Explanation */}
        <div>
          <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">
            Penjelasan Jawaban
          </label>
          <textarea
            value={draftQuestion.explanation}
            onChange={e => updateDraft({ explanation: e.target.value })}
            rows={2}
            placeholder="Penjelasan singkat mengapa jawaban tersebut benar..."
            className="w-full px-3 py-2.5 bg-slate-800 border border-slate-600 rounded-xl text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-amber-500 resize-none transition-colors"
          />
        </div>
      </div>

      {/* Footer actions */}
      <div className="flex gap-2 px-5 py-3 border-t border-slate-700/60 shrink-0">
        <Button variant="ghost" size="sm" className="flex-1" onClick={cancelEdit}>
          Batal
        </Button>
        <Button
          variant="primary"
          size="sm"
          className="flex-1 flex items-center justify-center gap-2"
          onClick={saveQuestion}
          disabled={!isValid}
        >
          <Save size={13} />
          Simpan Soal
        </Button>
      </div>
    </div>
  )
}
