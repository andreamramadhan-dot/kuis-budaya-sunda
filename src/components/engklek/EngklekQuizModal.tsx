import React, { useEffect, useState } from 'react'
import type { Question } from '../../types/quiz'
import type { EngklekAvatar } from '../../types/engklek'
import { Award, Clock, HelpCircle, XCircle } from 'lucide-react'

interface EngklekQuizModalProps {
  question: Question
  isOpen: boolean
  avatar: EngklekAvatar
  playerName: string
  isGunungChallenge?: boolean
  onAnswer: (isCorrect: boolean, selectedOptionId: string) => void
  onClose?: () => void
}

export const EngklekQuizModal: React.FC<EngklekQuizModalProps> = ({
  question,
  isOpen,
  avatar,
  playerName,
  isGunungChallenge = false,
  onAnswer,
}) => {
  const [selectedOption, setSelectedOption] = useState<string | null>(null)
  const [hasSubmitted, setHasSubmitted] = useState(false)
  const [timeLeft, setTimeLeft] = useState(question.timeLimitSeconds)

  // Reset state saat pertanyaan berganti
  useEffect(() => {
    setSelectedOption(null)
    setHasSubmitted(false)
    setTimeLeft(question.timeLimitSeconds)
  }, [question])

  // Countdown Timer
  useEffect(() => {
    if (!isOpen || hasSubmitted) return

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer)
          handleTimeOut()
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [isOpen, hasSubmitted, question])

  // Keyboard shortcut (1, 2, 3, 4 atau A, B, C, D)
  useEffect(() => {
    if (!isOpen || hasSubmitted) return

    const handleKeyDown = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase()
      const optionMap: Record<string, number> = {
        '1': 0,
        a: 0,
        '2': 1,
        b: 1,
        '3': 2,
        c: 2,
        '4': 3,
        d: 3,
      }
      if (optionMap[key] !== undefined && question.options[optionMap[key]]) {
        handleSelectOption(question.options[optionMap[key]].id)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, hasSubmitted, question])

  const handleTimeOut = () => {
    setHasSubmitted(true)
    onAnswer(false, 'timeout')
  }

  const handleSelectOption = (optId: string) => {
    if (hasSubmitted) return
    setSelectedOption(optId)
    setHasSubmitted(true)
    const chosen = question.options.find((o) => o.id === optId)
    const isCorrect = chosen?.isCorrect ?? false

    setTimeout(() => {
      onAnswer(isCorrect, optId)
    }, 1200) // Delay singkat agar pemain bisa melihat feedback warna hijau/merah
  }

  if (!isOpen) return null

  const progressPercent = (timeLeft / question.timeLimitSeconds) * 100

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 md:p-6 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className={`relative w-full max-w-4xl rounded-3xl overflow-hidden shadow-2xl border-4 transition-all duration-300
          ${isGunungChallenge ? 'border-yellow-400 bg-gradient-to-b from-amber-950 via-stone-900 to-amber-950 ring-4 ring-yellow-400/40' : 'border-amber-700/80 bg-gradient-to-b from-stone-900 via-amber-950/70 to-stone-900'}
        `}
      >
        {/* Banner Tantangan Khusus Puncak Gunung */}
        {isGunungChallenge && (
          <div className="bg-gradient-to-r from-amber-600 via-yellow-500 to-amber-600 text-slate-950 font-black text-center py-1.5 px-4 text-xs md:text-sm uppercase tracking-widest shadow-md flex items-center justify-center gap-2">
            <span>⛰️ SOAL TANTANGAN PUNCAK GUNUNG</span>
            <span className="hidden md:inline font-bold">| Rebut Hak Klaim Sawah!</span>
          </div>
        )}

        {/* Bar Hitung Mundur Waktu */}
        <div className="w-full h-2 bg-stone-800">
          <div
            className={`h-full transition-all duration-1000 ease-linear ${
              progressPercent > 50 ? 'bg-emerald-500' : progressPercent > 20 ? 'bg-amber-400' : 'bg-red-500 animate-pulse'
            }`}
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {/* Content Body: Grid Karakter di kiri + Balon Soal di tengah + Opsi di kanan (sesuai Kelompok Intan) */}
        <div className="p-4 md:p-8 flex flex-col md:flex-row items-center gap-6">
          {/* Kolom Karakter K1/K2 */}
          <div className="hidden md:flex flex-col items-center justify-center w-40 flex-shrink-0">
            <div className="relative">
              <img
                src={`/assets/characters/${avatar}/berdiri.png`}
                alt={playerName}
                className="h-36 object-contain drop-shadow-[0_8px_16px_rgba(0,0,0,0.8)] transform hover:scale-105 transition-transform"
                onError={(e) => {
                  ;(e.target as HTMLElement).style.display = 'none'
                }}
              />
              <div className="absolute -bottom-2 -left-2 bg-amber-950 border border-amber-400 text-amber-200 text-[10px] font-bold px-2 py-0.5 rounded-full shadow">
                {playerName}
              </div>
            </div>
            <span className="mt-3 text-xs text-amber-300 font-semibold text-center">
              {isGunungChallenge ? 'Fokus! Kuasai Sawah!' : 'Lompat Maju!'}
            </span>
          </div>

          {/* Kolom Balon Soal (Tengah) */}
          <div className="flex-1 w-full bg-stone-100 dark:bg-stone-900/90 text-stone-900 dark:text-stone-100 rounded-2xl p-5 md:p-6 border-3 border-amber-600/40 shadow-inner flex flex-col justify-between min-h-[180px]">
            <div>
              {/* Header Info Soal */}
              <div className="flex items-center justify-between mb-3">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-200 text-amber-900 border border-amber-300">
                  <Award className="w-3.5 h-3.5 text-amber-700" />
                  {question.categoryLabel}
                </span>

                <div className="flex items-center gap-1 text-sm font-extrabold text-amber-500">
                  <Clock className="w-4 h-4" />
                  <span>{timeLeft}s</span>
                </div>
              </div>

              {/* Teks Pertanyaan */}
              <h3 className="text-base md:text-xl font-bold leading-relaxed text-stone-800 dark:text-stone-100">
                {question.questionText}
              </h3>
            </div>

            {/* Penjelasan Singkat Jika Sudah Menjawab */}
            {hasSubmitted && (
              <div className="mt-4 pt-3 border-t border-amber-500/30 text-xs md:text-sm text-amber-300 font-medium animate-in fade-in">
                💡 <span className="font-bold">Pedaran:</span> {question.explanation}
              </div>
            )}
          </div>

          {/* Kolom Pilihan Jawaban A, B, C, D (Kanan) */}
          <div className="w-full md:w-80 flex flex-col gap-2.5 flex-shrink-0">
            {question.options.map((option, index) => {
              const letter = ['A', 'B', 'C', 'D'][index]
              const isChosen = selectedOption === option.id
              const showResult = hasSubmitted

              let buttonStyle = 'bg-amber-900/60 hover:bg-amber-800/80 border-amber-500/70 text-amber-100 hover:scale-[1.02]'

              if (showResult) {
                if (option.isCorrect) {
                  buttonStyle = '!bg-emerald-600 !border-emerald-300 !text-white ring-4 ring-emerald-400/60 shadow-lg'
                } else if (isChosen && !option.isCorrect) {
                  buttonStyle = '!bg-rose-700 !border-rose-300 !text-white ring-4 ring-rose-400/60 shadow-lg'
                } else {
                  buttonStyle = 'opacity-50 border-stone-700 bg-stone-900/40 text-stone-400'
                }
              }

              return (
                <button
                  key={option.id}
                  disabled={hasSubmitted}
                  onClick={() => handleSelectOption(option.id)}
                  className={`relative flex items-center gap-3 p-3.5 rounded-xl border-2 font-bold text-left transition-all duration-200 cursor-pointer shadow-md select-none ${buttonStyle}`}
                >
                  <span className="w-7 h-7 rounded-lg bg-amber-950/80 border border-amber-400/50 flex items-center justify-center text-xs font-black text-amber-300 flex-shrink-0">
                    {letter}
                  </span>
                  <span className="text-xs md:text-sm flex-1 leading-snug">{option.text}</span>

                  {showResult && option.isCorrect && (
                    <Award className="w-5 h-5 text-emerald-200 animate-bounce flex-shrink-0" />
                  )}
                  {showResult && isChosen && !option.isCorrect && (
                    <XCircle className="w-5 h-5 text-rose-200 flex-shrink-0" />
                  )}
                </button>
              )
            })}
          </div>
        </div>

        {/* Footer Petunjuk Cepat */}
        <div className="px-6 py-2.5 bg-black/40 border-t border-amber-900/50 flex items-center justify-between text-[11px] text-amber-400/70">
          <span className="flex items-center gap-1.5">
            <HelpCircle className="w-3.5 h-3.5" />
            Tekan angka <span className="font-mono font-bold text-amber-300">1-4</span> atau huruf{' '}
            <span className="font-mono font-bold text-amber-300">A-D</span> untuk menjawab cepat.
          </span>
          <span className="hidden sm:inline font-semibold text-emerald-400">
            +{question.points} Poin jika Benar
          </span>
        </div>
      </div>
    </div>
  )
}
