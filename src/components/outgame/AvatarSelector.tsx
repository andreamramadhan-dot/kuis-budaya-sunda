import React, { useState } from 'react'
import { User, Check, ArrowRight, ArrowLeft, Sparkles, ShieldCheck } from 'lucide-react'
import { AVATARS_DATA } from '../../data/avatars'
import type { AvatarItem } from '../../types/game'

interface AvatarSelectorProps {
  pin: string
  onComplete: (playerName: string, avatar: AvatarItem) => void
  onBack: () => void
}

export const AvatarSelector: React.FC<AvatarSelectorProps> = ({
  pin,
  onComplete,
  onBack
}) => {
  const [selectedAvatar, setSelectedAvatar] = useState<AvatarItem>(AVATARS_DATA[0])
  const [playerName, setPlayerName] = useState('')
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const trimmed = playerName.trim()
    if (!trimmed) {
      setError('Mangga lebetkeun wasta / nami anjeun heula!')
      return
    }
    if (trimmed.length < 2) {
      setError('Nami kedah langkung ti 1 hurup!')
      return
    }
    onComplete(trimmed, selectedAvatar)
  }

  return (
    <div className="relative w-full min-h-screen bg-slate-950 flex items-center justify-center p-3 sm:p-6 overflow-hidden select-none font-sans">
      {/* 16:9 responsive frame */}
      <div className="relative w-full max-w-6xl aspect-[16/9] max-h-screen flex flex-col justify-between overflow-hidden shadow-2xl rounded-2xl md:rounded-3xl border-4 border-amber-900/60 bg-gradient-to-b from-amber-950 via-slate-900 to-slate-950 text-white p-4 sm:p-6">
        
        {/* Header */}
        <header className="flex items-center justify-between border-b border-amber-500/20 pb-3">
          <button
            type="button"
            onClick={onBack}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 border-2 border-black text-amber-200 text-xs sm:text-sm font-bold shadow-[0_3px_0_#000] active:translate-y-0.5 active:shadow-none transition-all cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Gentos PIN</span>
          </button>

          <div className="text-center">
            <h2 className="text-lg sm:text-2xl font-black text-amber-300 drop-shadow flex items-center justify-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-400" />
              PILIH KARAKTER & WASTA
            </h2>
            <p className="text-xs text-amber-200/70">
              Kode Room PIN: <span className="font-mono font-black text-amber-400 bg-black/40 px-2 py-0.5 rounded border border-amber-500/30">{pin}</span>
            </p>
          </div>

          <div className="w-20 hidden sm:block text-right">
            <span className="text-xs text-emerald-400 font-bold bg-emerald-950/60 px-2.5 py-1 rounded-full border border-emerald-500/30">
              8 Karakter
            </span>
          </div>
        </header>

        {/* Content Body: Avatar Grid (Left) + Selected Preview & Name Form (Right) */}
        <main className="flex-1 grid grid-cols-1 md:grid-cols-12 gap-4 items-center py-2 sm:py-4 overflow-y-auto">
          
          {/* Avatar Cards Grid (8 Karakter K1 - K8) */}
          <div className="md:col-span-7 grid grid-cols-4 gap-2 sm:gap-3">
            {AVATARS_DATA.map((avatar) => {
              const isSelected = selectedAvatar.id === avatar.id
              return (
                <button
                  key={avatar.id}
                  type="button"
                  onClick={() => setSelectedAvatar(avatar)}
                  className={`relative flex flex-col items-center p-2 rounded-2xl border-4 transition-all cursor-pointer group ${
                    isSelected
                      ? 'bg-amber-400 border-black shadow-[0_5px_0_#000] -translate-y-1 scale-105'
                      : 'bg-slate-800/80 hover:bg-slate-700 border-slate-900 shadow-[0_3px_0_#000] hover:-translate-y-0.5'
                  }`}
                >
                  {/* Badge Kode K1-K8 */}
                  <span
                    className={`absolute top-1 left-1 px-1.5 py-0.5 rounded text-[10px] font-black border ${
                      isSelected
                        ? 'bg-black text-amber-300 border-amber-300'
                        : 'bg-slate-900 text-slate-300 border-slate-700'
                    }`}
                  >
                    {avatar.code}
                  </span>

                  {/* Checkmark icon for selected */}
                  {isSelected && (
                    <span className="absolute top-1 right-1 w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center border-2 border-black">
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                    </span>
                  )}

                  {/* Avatar Sprite Image */}
                  <div className="w-14 h-16 sm:w-16 sm:h-20 flex items-center justify-center overflow-hidden my-1">
                    <img
                      src={avatar.image}
                      alt={avatar.name}
                      className="max-h-full max-w-full object-contain filter drop-shadow group-hover:scale-110 transition-transform"
                    />
                  </div>

                  {/* Character Name */}
                  <span
                    className={`text-[11px] sm:text-xs font-black truncate w-full text-center ${
                      isSelected ? 'text-black' : 'text-slate-200'
                    }`}
                  >
                    {avatar.name}
                  </span>
                </button>
              )
            })}
          </div>

          {/* Right Panel: Selected Character Details & Name Form */}
          <div className="md:col-span-5 flex flex-col justify-between bg-slate-900/90 border-4 border-black rounded-2xl p-4 shadow-[0_6px_0_#000] h-full">
            <div className="space-y-3">
              {/* Active Character Big Preview */}
              <div className="flex items-center gap-3 bg-black/40 p-3 rounded-xl border border-amber-500/20">
                <div className="w-16 h-20 bg-amber-400/20 rounded-lg border-2 border-amber-400 flex items-center justify-center p-1 overflow-hidden">
                  <img
                    src={selectedAvatar.image}
                    alt={selectedAvatar.name}
                    className="max-h-full max-w-full object-contain drop-shadow"
                  />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-black text-amber-300">{selectedAvatar.name}</h3>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-400/30 text-amber-200 uppercase border border-amber-400/40">
                      {selectedAvatar.gender}
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 mt-1 leading-snug">
                    {selectedAvatar.description}
                  </p>
                </div>
              </div>

              {/* Player Name Input */}
              <form onSubmit={handleSubmit} className="space-y-3">
                <div>
                  <label className="block text-xs font-black text-amber-200 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                    <User className="w-4 h-4 text-amber-400" />
                    Wasta / Nami Panggilan (Nama Siswa)
                  </label>
                  <input
                    type="text"
                    value={playerName}
                    onChange={(e) => {
                      setPlayerName(e.target.value)
                      setError(null)
                    }}
                    placeholder="Contoh: Asep / Galih / Neng Siti"
                    maxLength={15}
                    autoFocus
                    className="w-full px-4 py-2.5 rounded-xl bg-white text-stone-900 font-extrabold text-base border-4 border-black shadow-[0_3px_0_#000] focus:outline-none focus:ring-2 focus:ring-amber-400"
                  />
                  {error && (
                    <p className="text-xs text-rose-400 font-bold mt-1">⚠️ {error}</p>
                  )}
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-[#f4a259] hover:bg-[#ffb066] active:bg-[#e08f45] border-4 border-black text-stone-900 font-black text-lg tracking-wide shadow-[0_5px_0_#000] hover:shadow-[0_7px_0_#000] hover:-translate-y-0.5 active:translate-y-1 active:shadow-none transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  <ShieldCheck className="w-5 h-5 stroke-[2.5]" />
                  <span>Kukuhkeun & Ka Waiting Room</span>
                  <ArrowRight className="w-5 h-5 stroke-[2.5]" />
                </button>
              </form>
            </div>

            <p className="text-[10px] text-center text-slate-400 mt-2">
              Karakter ieu bakal katingali ku guru sareng rerencangan di arena kuis.
            </p>
          </div>
        </main>

      </div>
    </div>
  )
}
