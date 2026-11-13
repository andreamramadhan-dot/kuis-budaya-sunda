import React from 'react'
import { X, Check, Sparkles } from 'lucide-react'
import { AVATARS_DATA } from '../../data/avatars'
import type { AvatarItem } from '../../types/game'

interface CharacterModalProps {
  isOpen: boolean
  selectedAvatar: AvatarItem
  onSelectAvatar: (avatar: AvatarItem) => void
  onClose: () => void
}

export const CharacterModal: React.FC<CharacterModalProps> = ({
  isOpen,
  selectedAvatar,
  onSelectAvatar,
  onClose
}) => {
  if (!isOpen) return null

  return (
    <div className="absolute inset-0 z-40 flex items-center justify-center p-2 sm:p-4 select-none animate-fadeIn">
      {/* Backdrop (clicking outside closes modal) */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-xs cursor-pointer"
        onClick={onClose}
      />

      {/*
        Modal Container:
        Positioned and proportioned exactly according to the dark modal in the original artwork:
        left: ~13.6%, top: ~14.8%, width: ~72.7%, height: ~74.0%
      */}
      <div
        className="relative z-50 w-full max-w-4xl h-[78%] sm:h-[75%] rounded-2xl md:rounded-3xl border-4 border-black bg-stone-900/95 shadow-[0_8px_0_#000] flex flex-col justify-between p-3 sm:p-5 overflow-hidden text-white"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-2 border-b-2 border-stone-700/60">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-amber-400" />
            <h3 className="font-extrabold text-base sm:text-xl md:text-2xl text-white tracking-wider font-mono">
              Choose your character
            </h3>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-stone-800 hover:bg-stone-700 border-2 border-black flex items-center justify-center text-stone-300 hover:text-white shadow active:translate-y-0.5 cursor-pointer transition-all"
            title="Tutup (Close)"
            aria-label="Close"
          >
            <X className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2.5]" />
          </button>
        </div>

        {/* 8 Avatar Grid (2 rows x 4 cols) */}
        <div className="flex-1 grid grid-cols-4 gap-2 sm:gap-3 py-2 sm:py-3 overflow-y-auto items-center">
          {AVATARS_DATA.map((avatar) => {
            const isSelected = selectedAvatar.id === avatar.id
            return (
              <button
                key={avatar.id}
                type="button"
                onClick={() => {
                  onSelectAvatar(avatar)
                }}
                className={`relative flex flex-col items-center justify-between p-1.5 sm:p-2.5 rounded-xl sm:rounded-2xl border-3 sm:border-4 transition-all cursor-pointer group h-full max-h-[140px] sm:max-h-[160px] ${
                  isSelected
                    ? 'bg-amber-400 border-black shadow-[0_4px_0_#000] -translate-y-1 scale-102 ring-2 ring-amber-300'
                    : 'bg-stone-800/90 hover:bg-stone-750 border-stone-900 shadow-[0_2px_0_#000] hover:-translate-y-0.5 hover:border-stone-700'
                }`}
              >
                {/* Code badge (K1..K8) */}
                <span
                  className={`absolute top-1 left-1 px-1.5 py-0.2 rounded text-[9px] sm:text-[10px] font-black border ${
                    isSelected
                      ? 'bg-black text-amber-300 border-amber-300'
                      : 'bg-stone-900 text-stone-300 border-stone-700'
                  }`}
                >
                  {avatar.code}
                </span>

                {/* Check badge when active */}
                {isSelected && (
                  <span className="absolute top-1 right-1 w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center border border-black shadow">
                    <Check className="w-3 h-3 sm:w-3.5 sm:h-3.5 stroke-[3]" />
                  </span>
                )}

                {/* Character Sprite */}
                <div className="w-12 h-14 sm:w-16 sm:h-20 flex items-center justify-center my-auto overflow-hidden">
                  <img
                    src={avatar.image}
                    alt={avatar.name}
                    className={`max-h-full max-w-full object-contain filter drop-shadow group-hover:scale-108 transition-transform ${
                      isSelected ? 'animate-bounce-subtle' : ''
                    }`}
                  />
                </div>

                {/* Name Tag */}
                <span
                  className={`text-[10px] sm:text-xs font-black truncate w-full text-center tracking-tight ${
                    isSelected ? 'text-stone-950 font-black' : 'text-stone-200'
                  }`}
                >
                  {avatar.name}
                </span>
              </button>
            )
          })}
        </div>

        {/* Modal Footer / Confirmation */}
        <div className="pt-2 border-t-2 border-stone-700/60 flex items-center justify-between text-xs text-stone-400">
          <span className="hidden sm:inline">
            Pilihan aktif: <strong className="text-amber-300">{selectedAvatar.name} ({selectedAvatar.code})</strong>
          </span>

          <button
            type="button"
            onClick={onClose}
            className="w-full sm:w-auto px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 active:bg-amber-600 text-stone-950 font-black text-xs sm:text-sm border-2 border-black shadow-[0_3px_0_#000] active:translate-y-0.5 active:shadow-none transition-all cursor-pointer"
          >
            Pilih Karakter & Simpen ✓
          </button>
        </div>
      </div>
    </div>
  )
}
