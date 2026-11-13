import React, { useState } from 'react'
import { Users, CheckCircle, Clock, Copy, ArrowLeft, Play, Sparkles } from 'lucide-react'
import { AVATARS_DATA } from '../../data/avatars'
import type { AvatarItem, GameMode, PlayerProfile } from '../../types/game'

interface WaitingRoomProps {
  pin: string
  currentPlayer: {
    name: string
    avatar: AvatarItem
  }
  initialMode?: GameMode
  onStartGame?: (mode: GameMode) => void
  onLeaveRoom: () => void
}

export const WaitingRoom: React.FC<WaitingRoomProps> = ({
  pin,
  currentPlayer,
  initialMode = 'oray-orayan',
  onStartGame,
  onLeaveRoom
}) => {
  const [mode, setMode] = useState<GameMode>(initialMode)
  const [isReady, setIsReady] = useState(false)
  const [copied, setCopied] = useState(false)

  // Mock list of classmates in the room for instant interactive testing
  const [players, setPlayers] = useState<PlayerProfile[]>([
    {
      name: currentPlayer.name,
      avatarId: currentPlayer.avatar.id,
      isReady: isReady,
      isHost: true
    },
    {
      name: 'Galih Parahyangan',
      avatarId: 'k3',
      isReady: true
    },
    {
      name: 'Neng Mimin',
      avatarId: 'k2',
      isReady: true
    },
    {
      name: 'Ujang Kuring',
      avatarId: 'k4',
      isReady: false
    }
  ])

  const handleToggleReady = () => {
    const next = !isReady
    setIsReady(next)
    setPlayers((prev) =>
      prev.map((p) =>
        p.name === currentPlayer.name ? { ...p, isReady: next } : p
      )
    )
  }

  const handleCopyPin = () => {
    navigator.clipboard.writeText(pin)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="relative w-full min-h-screen bg-slate-950 flex items-center justify-center p-3 sm:p-6 overflow-hidden select-none font-sans">
      {/* 16:9 responsive container */}
      <div className="relative w-full max-w-6xl aspect-[16/9] max-h-screen flex flex-col justify-between overflow-hidden shadow-2xl rounded-2xl md:rounded-3xl border-4 border-amber-900/60 bg-gradient-to-b from-amber-950 via-slate-900 to-slate-950 text-white p-4 sm:p-6">
        
        {/* Header Bar */}
        <header className="flex items-center justify-between border-b border-amber-500/20 pb-3">
          <button
            type="button"
            onClick={onLeaveRoom}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 border-2 border-black text-rose-300 text-xs sm:text-sm font-bold shadow-[0_3px_0_#000] active:translate-y-0.5 active:shadow-none transition-all cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Kaluar</span>
          </button>

          {/* Big PIN Display */}
          <div className="flex items-center gap-2 bg-black/60 px-4 py-1.5 rounded-2xl border-2 border-amber-400/50 shadow-inner">
            <span className="text-xs text-amber-200 font-bold uppercase tracking-wider">PIN Room:</span>
            <span className="text-xl sm:text-2xl font-black font-mono tracking-widest text-amber-400">{pin}</span>
            <button
              type="button"
              onClick={handleCopyPin}
              className="ml-2 p-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-black border border-black shadow active:translate-y-0.5 transition-all"
              title="Salin PIN"
            >
              <Copy className="w-4 h-4" />
            </button>
            {copied && <span className="text-[10px] text-emerald-400 font-bold ml-1">Kasalinkeun!</span>}
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-amber-300 font-bold bg-amber-950/80 px-3 py-1 rounded-full border border-amber-400/30 flex items-center gap-1.5">
              <Users className="w-4 h-4 text-amber-400" />
              <span>{players.length} Pamilon (Siswa)</span>
            </span>
          </div>
        </header>

        {/* Mode Selector & Room Rules */}
        <section className="my-2 bg-slate-900/90 border-2 border-amber-500/30 rounded-2xl p-3 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="text-xs font-black text-amber-200 uppercase tracking-wider">Mode Game:</span>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setMode('oray-orayan')}
                className={`px-3 py-1.5 rounded-xl text-xs font-black border-2 transition-all cursor-pointer ${
                  mode === 'oray-orayan'
                    ? 'bg-emerald-500 text-black border-black shadow-[0_3px_0_#000]'
                    : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
                }`}
              >
                🐍 Oray-Orayan (Gerbang 60s)
              </button>
              <button
                type="button"
                onClick={() => setMode('engklek')}
                className={`px-3 py-1.5 rounded-xl text-xs font-black border-2 transition-all cursor-pointer ${
                  mode === 'engklek'
                    ? 'bg-amber-500 text-black border-black shadow-[0_3px_0_#000]'
                    : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
                }`}
              >
                🧱 Engklek (Lompat Sawah)
              </button>
            </div>
          </div>

          <div className="text-xs text-amber-200/80 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
            <span>
              {mode === 'oray-orayan'
                ? 'Lagu Oray-Orayan muter! Detik ka-60 gerbang nutup (Pandeurina!) + Tarik Tambang Bulan vs Bintang.'
                : 'Jawab kuis keur luncat petak 1-10, capai Puncak Gunung keur klaim Sawah & tarik pajeg poin!'}
            </span>
          </div>
        </section>

        {/* Players Waiting Grid */}
        <main className="flex-1 overflow-y-auto py-2">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {players.map((p, idx) => {
              const avatar = AVATARS_DATA.find((a) => a.id === p.avatarId) || AVATARS_DATA[0]
              const isMe = p.name === currentPlayer.name
              return (
                <div
                  key={idx}
                  className={`relative p-3 rounded-2xl border-4 flex flex-col items-center justify-between transition-all ${
                    isMe
                      ? 'bg-amber-950/70 border-amber-400 shadow-[0_4px_0_#000]'
                      : 'bg-slate-800/80 border-slate-900 shadow-[0_3px_0_#000]'
                  }`}
                >
                  {/* Ready indicator badge */}
                  <span
                    className={`absolute top-2 right-2 px-2 py-0.5 rounded-full text-[10px] font-black border flex items-center gap-1 ${
                      p.isReady
                        ? 'bg-emerald-500 text-black border-black'
                        : 'bg-slate-900 text-amber-300 border-amber-500/30'
                    }`}
                  >
                    {p.isReady ? (
                      <>
                        <CheckCircle className="w-3 h-3 stroke-[3]" />
                        Siap!
                      </>
                    ) : (
                      <>
                        <Clock className="w-3 h-3" />
                        Nungguan...
                      </>
                    )}
                  </span>

                  {/* Avatar Sprite */}
                  <div className="w-16 h-20 flex items-center justify-center my-1">
                    <img
                      src={avatar.image}
                      alt={p.name}
                      className="max-h-full max-w-full object-contain filter drop-shadow"
                    />
                  </div>

                  {/* Player info */}
                  <div className="text-center w-full">
                    <div className="flex items-center justify-center gap-1">
                      <span className="text-xs font-black truncate max-w-[100px]">{p.name}</span>
                      {isMe && (
                        <span className="text-[9px] font-black bg-amber-400 text-black px-1.5 py-0.2 rounded">
                          Anjeun
                        </span>
                      )}
                    </div>
                    <span className="text-[10px] text-amber-300/80">{avatar.name} ({avatar.code})</span>
                  </div>
                </div>
              )
            })}
          </div>
        </main>

        {/* Footer Actions */}
        <footer className="pt-3 border-t border-amber-500/20 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-xs text-slate-300 flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-emerald-400 animate-pulse" />
            <span>Nungguan guru ngamimitian kuis ti layar proyektor...</span>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            {/* Student Ready Toggle Button */}
            <button
              type="button"
              onClick={handleToggleReady}
              className={`flex-1 sm:flex-none px-6 py-3 rounded-2xl border-4 border-black font-black text-base shadow-[0_5px_0_#000] active:translate-y-1 active:shadow-none transition-all cursor-pointer flex items-center justify-center gap-2 ${
                isReady
                  ? 'bg-emerald-400 hover:bg-emerald-300 text-emerald-950'
                  : 'bg-amber-400 hover:bg-amber-300 text-amber-950'
              }`}
            >
              <CheckCircle className="w-5 h-5 stroke-[2.5]" />
              <span>{isReady ? 'Parantos Siap! (Ready)' : 'Kuring Siap! (Klik di dieu)'}</span>
            </button>

            {/* Test Start Game Button (Demo) */}
            {onStartGame && (
              <button
                type="button"
                onClick={() => onStartGame(mode)}
                className="px-5 py-3 rounded-2xl bg-indigo-500 hover:bg-indigo-400 border-4 border-black text-white font-black text-base shadow-[0_5px_0_#000] active:translate-y-1 active:shadow-none transition-all cursor-pointer flex items-center gap-2"
                title="Simulasi Masuk Game"
              >
                <Play className="w-5 h-5 fill-current" />
                <span>Mulai Game</span>
              </button>
            )}
          </div>
        </footer>

      </div>
    </div>
  )
}
