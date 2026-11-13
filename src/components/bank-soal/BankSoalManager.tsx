import { useRef } from 'react'
import { Search, Plus, Download, Upload, BookOpen } from 'lucide-react'
import { useBankSoal } from '../../hooks/useBankSoal'
import { CategoryFilterBar } from './CategoryFilterBar'
import { QuestionCard } from './QuestionCard'
import { QuestionEditor } from './QuestionEditor'
import { Button } from '../ui/Button'

export function BankSoalManager() {
  const bank = useBankSoal()
  const importRef = useRef<HTMLInputElement>(null)

  return (
    <div className="w-full h-screen bg-slate-950 flex flex-col overflow-hidden">

      {/* ── TOP BAR ─────────────────────────────────────────────── */}
      <header className="flex items-center justify-between px-5 py-3 bg-slate-900/90 border-b border-slate-800/80 backdrop-blur-sm shrink-0 gap-4">
        <div className="flex items-center gap-2.5">
          <BookOpen size={18} className="text-amber-400" />
          <div>
            <h1 className="text-sm font-black text-amber-300 leading-tight">📚 Bank Soal Budaya Sunda</h1>
            <p className="text-[9px] text-slate-500 leading-none uppercase tracking-widest">
              {bank.questions.length} soal tersedia
            </p>
          </div>
        </div>

        <div className="flex gap-2 ml-auto">
          {/* Import */}
          <input
            ref={importRef}
            type="file"
            accept=".json"
            className="hidden"
            onChange={e => {
              const f = e.target.files?.[0]
              if (f) bank.importJSON(f)
              e.target.value = ''
            }}
          />
          <Button
            variant="ghost"
            size="sm"
            className="flex items-center gap-1.5"
            onClick={() => importRef.current?.click()}
          >
            <Upload size={12} />
            Impor JSON
          </Button>

          {/* Export */}
          <Button
            variant="ghost"
            size="sm"
            className="flex items-center gap-1.5"
            onClick={bank.exportJSON}
          >
            <Download size={12} />
            Ekspor JSON
          </Button>

          {/* New question */}
          <Button
            variant="primary"
            size="sm"
            className="flex items-center gap-1.5"
            onClick={bank.startNew}
          >
            <Plus size={12} />
            + Tambah Soal
          </Button>
        </div>
      </header>

      {/* ── MAIN AREA ────────────────────────────────────────────── */}
      <div className="flex flex-1 overflow-hidden">

        {/* LEFT: Filter + List */}
        <div className={`flex flex-col bg-slate-900/40 border-r border-slate-800/70 transition-all ${bank.isEditing ? 'w-[55%]' : 'w-full'}`}>

          {/* Filter toolbar */}
          <div className="px-4 py-3 border-b border-slate-800/60 space-y-3 shrink-0">
            {/* Search */}
            <div className="relative">
              <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type="text"
                placeholder="Cari soal..."
                value={bank.searchQuery}
                onChange={e => bank.setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-4 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-slate-100 placeholder-slate-600 focus:outline-none focus:border-amber-500 transition-colors"
              />
            </div>

            {/* Category filter */}
            <CategoryFilterBar
              active={bank.filterCategory}
              counts={bank.totalByCategory}
              onChange={bank.setFilterCategory}
            />
          </div>

          {/* Question list */}
          <div className="flex-1 overflow-y-auto p-3 space-y-2 scrollbar-thin scrollbar-thumb-slate-600">
            {bank.filteredQuestions.length === 0 && (
              <div className="text-center py-16 text-slate-600">
                <p className="text-2xl mb-2">🔍</p>
                <p className="text-sm font-bold">Soal tidak ditemukan</p>
                <p className="text-xs mt-1">Coba ubah filter atau tambah soal baru</p>
              </div>
            )}

            {bank.filteredQuestions.map(q => (
              <QuestionCard
                key={q.id}
                question={q}
                isSelected={bank.selectedQuestion?.id === q.id}
                onSelect={() => bank.selectQuestion(q)}
                onDelete={() => {
                  if (confirm(`Hapus soal ini?\n"${q.questionText.slice(0, 60)}..."`)) {
                    bank.deleteQuestion(q.id)
                  }
                }}
              />
            ))}
          </div>
        </div>

        {/* RIGHT: Editor panel */}
        {bank.isEditing && (
          <div className="w-[45%] flex flex-col bg-slate-900/60 overflow-hidden shrink-0">
            <QuestionEditor
              draftQuestion={bank.draftQuestion}
              updateDraft={bank.updateDraft}
              updateDraftOption={bank.updateDraftOption}
              saveQuestion={bank.saveQuestion}
              cancelEdit={bank.cancelEdit}
            />
          </div>
        )}
      </div>
    </div>
  )
}
