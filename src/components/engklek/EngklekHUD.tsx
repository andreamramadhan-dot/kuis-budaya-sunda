import React from 'react'
import type { GameLog, PlayerStats } from '../../types/engklek'
import { Award, Flame, Play, RotateCcw, Volume2, VolumeX } from 'lucide-react'

interface EngklekHUDProps {
  player: PlayerStats
  opponent: PlayerStats
  isPlayerTurn: boolean
  isQuizOpen: boolean
  isMuted: boolean
  logs: GameLog[]
  onOpenQuiz: () => void
  onToggleMute: () => void
  onResetGame: () => void
}

export const EngklekHUD: React.FC<EngklekHUDProps> = ({
  player,
  opponent,
  isPlayerTurn,
  isQuizOpen,
  isMuted,
  logs,
  onOpenQuiz,
  onToggleMute,
  onResetGame,
}) => {
  return (
    <div className="w-full flex flex-col gap-3">
      {/* Top Bar Status */}
      <div className="flex flex-wrap items-center justify-between gap-2 p-3 rounded-2xl bg-stone-900/90 border border-amber-800/60 shadow-lg backdrop-blur-md">
        {/* Sisi Kiri: Profil Pemain */}
        <div className="flex items-center gap-3">
          <div className="relative">
            <img
              src={`/assets/characters/${player.avatar}/berdiri.png`}
              alt={player.name}
              className="w-10 h-10 md:w-12 md:h-12 object-contain rounded-full bg-amber-950 border-2 border-emerald-400 p-0.5 shadow"
              onError={(e) => {
                ;(e.target as HTMLElement).style.display = 'none'
              }}
            />
            {player.streak > 1 && (
              <span className="absolute -bottom-1 -right-1 bg-amber-500 text-stone-950 font-black text-[10px] px-1 rounded-full flex items-center shadow animate-pulse">
                <Flame className="w-2.5 h-2.5 inline" /> {player.streak}
              </span>
            )}
          </div>

          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-sm text-stone-100">{player.name}</span>
              <span className="text-[10px] bg-emerald-900/80 text-emerald-300 font-extrabold px-1.5 py-0.5 rounded border border-emerald-600">
                Pemain
              </span>
            </div>
            <div className="flex items-center gap-3 text-xs mt-0.5">
              <span className="font-extrabold text-amber-400">{player.score} Poin</span>
              <span className="text-emerald-400 font-bold">🌾 {player.sawahCount} Sawah</span>
            </div>
          </div>
        </div>

        {/* Tengah: Status Giliran & Target Lompatan */}
        <div className="flex flex-col items-center">
          <div
            className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider flex items-center gap-1.5 shadow ${
              isPlayerTurn
                ? 'bg-emerald-500 text-stone-950 ring-2 ring-emerald-300 animate-pulse'
                : 'bg-stone-800 text-stone-400'
            }`}
          >
            <span>{isPlayerTurn ? '⭐ Giliran Kamu' : '⏳ Giliran Lawan'}</span>
          </div>
          <span className="text-[11px] text-amber-200/80 mt-1">
            Gacuk di Petak: <span className="font-bold text-amber-400">{player.gacukTile || 1}</span>
          </span>
        </div>

        {/* Sisi Kanan: Profil Lawan + Action Button */}
        <div className="flex items-center gap-3">
          <div className="text-right">
            <div className="flex items-center justify-end gap-1.5">
              <span className="text-[10px] bg-rose-950 text-rose-300 font-extrabold px-1.5 py-0.5 rounded border border-rose-800">
                Bot Lawan
              </span>
              <span className="font-bold text-sm text-stone-200">{opponent.name}</span>
            </div>
            <div className="flex items-center justify-end gap-3 text-xs mt-0.5">
              <span className="text-rose-400 font-bold">🌾 {opponent.sawahCount} Sawah</span>
              <span className="font-extrabold text-amber-400">{opponent.score} Poin</span>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={onToggleMute}
              title={isMuted ? 'Nyalakan Audio' : 'Bisukan Audio'}
              className="p-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-amber-300 border border-amber-900/60 transition-colors cursor-pointer"
            >
              {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>
            <button
              onClick={onResetGame}
              title="Reset Permainan"
              className="p-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 border border-amber-900/60 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Floating CTA / Tombol Lempar Gacuk & Jawab Kuis */}
      {isPlayerTurn && !isQuizOpen && (
        <div className="flex justify-center">
          <button
            onClick={onOpenQuiz}
            className="group relative flex items-center gap-3 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 hover:from-amber-400 hover:to-yellow-300 text-stone-950 font-black text-sm md:text-base shadow-xl border-2 border-yellow-200 transform hover:scale-105 active:scale-95 transition-all cursor-pointer ring-4 ring-amber-400/30 animate-bounce"
          >
            <Play className="w-5 h-5 fill-stone-950" />
            <span>LEMPAR GACUK & JAWAB KUIS</span>
            <span className="hidden md:inline text-xs font-mono bg-stone-950/20 px-2 py-0.5 rounded border border-stone-950/30">
              [SPASI]
            </span>
          </button>
        </div>
      )}

      {/* Ticker / Log Notifikasi Permainan */}
      {logs.length > 0 && (
        <div className="w-full bg-stone-950/70 border border-amber-900/40 rounded-xl p-2.5 text-xs flex items-center justify-between overflow-hidden shadow-inner">
          <div className="flex items-center gap-2 truncate">
            <span className="font-bold text-amber-400 flex items-center gap-1 flex-shrink-0">
              <Award className="w-3.5 h-3.5" /> Kabar Arena:
            </span>
            <span
              className={`truncate font-medium ${
                logs[0].type === 'tax'
                  ? 'text-yellow-300'
                  : logs[0].type === 'success'
                  ? 'text-emerald-300'
                  : logs[0].type === 'warning'
                  ? 'text-rose-300'
                  : 'text-stone-300'
              }`}
            >
              {logs[0].text}
            </span>
          </div>
          <span className="text-[10px] text-stone-500 flex-shrink-0 ml-2">{logs[0].timestamp}</span>
        </div>
      )}
    </div>
  )
}
