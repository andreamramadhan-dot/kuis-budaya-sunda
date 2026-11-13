import React, { useEffect } from 'react'
import confetti from 'canvas-confetti'
import type { PlayerStats } from '../../types/engklek'
import { Award, Flame, RotateCcw, Trophy } from 'lucide-react'

interface EngklekPodiumProps {
  player: PlayerStats
  opponent: PlayerStats
  onRematch: () => void
}

export const EngklekPodium: React.FC<EngklekPodiumProps> = ({
  player,
  opponent,
  onRematch,
}) => {
  const isPlayerWinner = player.score >= opponent.score

  useEffect(() => {
    // Jalankan efek ledakan confetti
    const duration = 2.5 * 1000
    const end = Date.now() + duration

    const frame = () => {
      confetti({
        particleCount: 4,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ['#eab308', '#22c55e', '#f97316'],
      })
      confetti({
        particleCount: 4,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ['#eab308', '#22c55e', '#f97316'],
      })

      if (Date.now() < end) {
        requestAnimationFrame(frame)
      }
    }
    frame()
  }, [])

  return (
    <div className="w-full max-w-2xl mx-auto p-6 md:p-8 rounded-3xl bg-gradient-to-b from-stone-900 via-amber-950 to-stone-900 border-4 border-amber-600 shadow-2xl text-center relative overflow-hidden backdrop-blur-md animate-in zoom-in-95 duration-300">
      {/* Ornamen Juara */}
      <div className="inline-flex p-3 rounded-full bg-amber-500/20 text-amber-400 border-2 border-amber-400/50 mb-3 shadow-lg animate-bounce">
        <Trophy className="w-10 h-10" />
      </div>

      <h1 className="text-2xl md:text-3xl font-black text-amber-200 uppercase tracking-wider">
        {isPlayerWinner ? '🏆 Wilujeng Juara Engklek!' : '🥈 Pertandingan Rengse!'}
      </h1>
      <p className="text-xs md:text-sm text-stone-300 mt-1">
        {isPlayerWinner
          ? `${player.name} hasil ngawasa sawah tur meunangkeun poin pangluhurna!`
          : `${opponent.name} meunangkeun poin leuwih loba dina laga ieu!`}
      </p>

      {/* Panggung Podium Visual */}
      <div className="mt-8 flex items-end justify-center gap-4 md:gap-8 px-4">
        {/* Runner-up (Juara 2) */}
        <div className="flex flex-col items-center">
          <div className="relative mb-2">
            <img
              src={`/assets/characters/${isPlayerWinner ? opponent.avatar : player.avatar}/berdiri.png`}
              alt={isPlayerWinner ? opponent.name : player.name}
              className="h-20 object-contain drop-shadow"
              onError={(e) => {
                ;(e.target as HTMLElement).style.display = 'none'
              }}
            />
            <span className="absolute -bottom-2 -right-2 bg-stone-700 text-stone-200 font-black text-[10px] px-2 py-0.5 rounded-full border border-stone-500">
              #2
            </span>
          </div>
          <div className="w-24 md:w-32 h-24 rounded-t-xl bg-stone-800 border-2 border-stone-600 flex flex-col items-center justify-center p-2 shadow-lg">
            <span className="font-bold text-xs text-stone-200 truncate w-full text-center">
              {isPlayerWinner ? opponent.name : player.name}
            </span>
            <span className="font-black text-amber-400 text-sm mt-0.5">
              {isPlayerWinner ? opponent.score : player.score} Poin
            </span>
            <span className="text-[10px] text-stone-400">
              🌾 {isPlayerWinner ? opponent.sawahCount : player.sawahCount} Sawah
            </span>
          </div>
        </div>

        {/* Champion (Juara 1) */}
        <div className="flex flex-col items-center">
          <div className="relative mb-2">
            <img
              src={`/assets/characters/${isPlayerWinner ? player.avatar : opponent.avatar}/berdiri.png`}
              alt={isPlayerWinner ? player.name : opponent.name}
              className="h-28 object-contain drop-shadow-[0_8px_16px_rgba(234,179,8,0.4)] animate-bounce"
              onError={(e) => {
                ;(e.target as HTMLElement).style.display = 'none'
              }}
            />
            <span className="absolute -bottom-2 -right-2 bg-yellow-500 text-stone-950 font-black text-xs px-2.5 py-0.5 rounded-full border border-yellow-200 shadow-md">
              👑 #1
            </span>
          </div>
          <div className="w-28 md:w-40 h-36 rounded-t-xl bg-gradient-to-t from-amber-700 to-yellow-500 border-2 border-yellow-200 flex flex-col items-center justify-center p-2 shadow-2xl">
            <span className="font-black text-stone-950 text-sm md:text-base truncate w-full text-center">
              {isPlayerWinner ? player.name : opponent.name}
            </span>
            <span className="font-black text-stone-950 text-base md:text-xl mt-1">
              {isPlayerWinner ? player.score : opponent.score} Poin
            </span>
            <span className="text-xs font-bold text-amber-950">
              🌾 {isPlayerWinner ? player.sawahCount : opponent.sawahCount} Sawah Dikuasai
            </span>
          </div>
        </div>
      </div>

      {/* Rincian Statistik Permainan */}
      <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-left bg-stone-950/60 p-4 rounded-2xl border border-amber-900/50">
        <div className="p-2 rounded-xl bg-stone-900/80 border border-stone-800">
          <span className="text-[11px] text-stone-400 flex items-center gap-1">
            <Award className="w-3.5 h-3.5 text-amber-400" /> Total Poin
          </span>
          <span className="text-base font-black text-amber-300 mt-1 block">{player.score}</span>
        </div>

        <div className="p-2 rounded-xl bg-stone-900/80 border border-stone-800">
          <span className="text-[11px] text-stone-400">🌾 Sawah Milik</span>
          <span className="text-base font-black text-emerald-400 mt-1 block">{player.sawahCount} Petak</span>
        </div>

        <div className="p-2 rounded-xl bg-stone-900/80 border border-stone-800">
          <span className="text-[11px] text-stone-400">🎯 Akurasi Kuis</span>
          <span className="text-base font-black text-amber-200 mt-1 block">
            {player.totalAttempts > 0
              ? `${Math.round((player.correctAnswers / player.totalAttempts) * 100)}%`
              : '100%'}
          </span>
        </div>

        <div className="p-2 rounded-xl bg-stone-900/80 border border-stone-800">
          <span className="text-[11px] text-stone-400 flex items-center gap-1">
            <Flame className="w-3.5 h-3.5 text-amber-500" /> Streak Pangluhurna
          </span>
          <span className="text-base font-black text-amber-400 mt-1 block">{player.highestStreak} Combo</span>
        </div>
      </div>

      {/* Tombol Rematch */}
      <div className="mt-8 flex justify-center">
        <button
          onClick={onRematch}
          className="flex items-center gap-2.5 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 text-stone-950 font-black text-sm md:text-base shadow-xl border-2 border-yellow-200 transform hover:scale-105 active:scale-95 transition-all cursor-pointer"
        >
          <RotateCcw className="w-5 h-5" />
          <span>MAIN DEUI (REMATCH)</span>
        </button>
      </div>
    </div>
  )
}
