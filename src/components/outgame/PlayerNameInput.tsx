import React, { useState, useEffect, useRef } from 'react'
import enterNameBg from '../../assets/waiting-room/enter-name-bg.png'
import { CharacterModal } from './CharacterModal'
import { AVATARS_DATA } from '../../data/avatars'
import type { AvatarItem } from '../../types/game'

interface PlayerNameInputProps {
  pin: string
  initialAvatar?: AvatarItem
  onEnter: (playerName: string, avatar: AvatarItem) => void
  onBackToPin?: () => void
}

export const PlayerNameInput: React.FC<PlayerNameInputProps> = ({
  pin,
  initialAvatar = AVATARS_DATA[0],
  onEnter,
  onBackToPin
}) => {
  const [name, setName] = useState('')
  const [selectedAvatar, setSelectedAvatar] = useState<AvatarItem>(initialAvatar)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isFocused, setIsFocused] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [isShaking, setIsShaking] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  // Web Audio retro sound
  const playRetroSound = (type: 'type' | 'click' | 'error') => {
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
      if (!AudioCtx) return
      const ctx = new AudioCtx()
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.connect(gain)
      gain.connect(ctx.destination)
      const now = ctx.currentTime

      if (type === 'type') {
        osc.type = 'triangle'
        osc.frequency.setValueAtTime(480, now)
        gain.gain.setValueAtTime(0.06, now)
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04)
        osc.start(now)
        osc.stop(now + 0.04)
      } else if (type === 'click') {
        osc.type = 'square'
        osc.frequency.setValueAtTime(587.33, now) // D5
        osc.frequency.setValueAtTime(880, now + 0.07) // A5
        gain.gain.setValueAtTime(0.1, now)
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.18)
        osc.start(now)
        osc.stop(now + 0.18)
      } else if (type === 'error') {
        osc.type = 'sawtooth'
        osc.frequency.setValueAtTime(200, now)
        gain.gain.setValueAtTime(0.12, now)
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2)
        osc.start(now)
        osc.stop(now + 0.2)
      }
    } catch {
      // Ignore audio policy issues
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value)
    setErrorMessage(null)
    playRetroSound('type')
  }

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault()
    const trimmed = name.trim()

    if (!trimmed) {
      setErrorMessage('Mangga serat nami anjeun heula!')
      setIsShaking(true)
      playRetroSound('error')
      setTimeout(() => setIsShaking(false), 500)
      inputRef.current?.focus()
      return
    }

    if (trimmed.length < 2) {
      setErrorMessage('Nami kedah minimal 2 karakter!')
      setIsShaking(true)
      playRetroSound('error')
      setTimeout(() => setIsShaking(false), 500)
      inputRef.current?.focus()
      return
    }

    playRetroSound('click')
    onEnter(trimmed, selectedAvatar)
  }

  const showWhiteFill = isFocused || name.length > 0

  return (
    <div className="relative w-full min-h-screen bg-slate-950 flex items-center justify-center overflow-hidden select-none font-sans p-0 sm:p-2">
      {/* 16:9 Screen Container strictly matching original artwork aspect ratio */}
      <div className="relative w-full max-w-6xl aspect-[16/9] max-h-screen overflow-hidden shadow-2xl md:rounded-3xl border-0 md:border-4 border-amber-900/60 bg-black">
        
        {/* Full-bleed background from original artwork */}
        <img
          src={enterNameBg}
          alt="Enter Name Background"
          className="absolute inset-0 w-full h-full object-fill pointer-events-none"
        />

        {/* Top bar back button */}
        {onBackToPin && (
          <div className="absolute top-3 left-3 sm:top-5 sm:left-5 z-30">
            <button
              type="button"
              onClick={onBackToPin}
              className="px-3 py-1.5 rounded-xl bg-black/40 hover:bg-black/60 text-amber-200 border border-amber-400/30 backdrop-blur-md text-xs font-bold shadow active:translate-y-0.5 cursor-pointer transition-all flex items-center gap-1.5"
            >
              <span>← Ganti PIN</span>
              <span className="font-mono text-amber-300">({pin})</span>
            </button>
          </div>
        )}

        {/* Form Layer */}
        <form
          onSubmit={handleSubmit}
          className={`absolute inset-0 w-full h-full z-20 pointer-events-none ${
            isShaking ? 'animate-shake' : ''
          }`}
        >
          {/*
            INPUT BOX HOTSPOT:
            Exact coordinates from analysis:
            left: 34.22%, top: 24.44%, width: 31.72%, height: 15.46%
            Inner text area: left: ~35.5%, top: ~27.0%, width: ~29.0%, height: ~10.0%
          */}
          <div
            className="absolute pointer-events-auto flex items-center justify-center"
            style={{
              left: '35.5%',
              top: '27.0%',
              width: '29.2%',
              height: '10.3%'
            }}
          >
            <input
              ref={inputRef}
              type="text"
              value={name}
              onChange={handleInputChange}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              placeholder={showWhiteFill ? 'NAMI ANJEUN' : ''}
              maxLength={15}
              autoComplete="off"
              spellCheck="false"
              className={`w-full h-full rounded-xl text-center text-stone-900 font-extrabold text-lg sm:text-2xl md:text-3xl tracking-wide focus:outline-none uppercase transition-colors duration-150 ${
                showWhiteFill
                  ? 'bg-white shadow-inner placeholder:text-stone-300'
                  : 'bg-transparent text-transparent cursor-pointer'
              }`}
            />

            {/* Error badge */}
            {errorMessage && (
              <div className="absolute -top-9 left-1/2 -translate-x-1/2 px-3 py-1 rounded-lg bg-rose-600 border-2 border-black text-white text-xs font-black shadow-[0_2px_0_#000] whitespace-nowrap animate-bounce pointer-events-none z-30">
                ⚠️ {errorMessage}
              </div>
            )}
          </div>

          {/*
            ENTER BUTTON HOTSPOT:
            Exact coordinates from analysis:
            left: 37.81%, top: 43.06%, width: 24.32%, height: 10.46%
            Directly mapped to the original amber "Enter" button!
          */}
          <button
            type="submit"
            aria-label="Enter Name"
            className="absolute pointer-events-auto cursor-pointer rounded-full transition-transform active:scale-95 hover:brightness-105"
            style={{
              left: '37.81%',
              top: '43.06%',
              width: '24.32%',
              height: '10.46%',
              background: 'transparent',
              border: 'none',
              outline: 'none'
            }}
          />

          {/*
            BOTTOM-LEFT AVATAR BUTTON HOTSPOT:
            Exact coordinates from analysis:
            left: 3.44%, top: 85.93%, width: 4.58%, height: 8.06%
            Clicking opens the CharacterModal to choose K1 - K8!
          */}
          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            aria-label="Pilih Karakter (Choose your character)"
            className="absolute pointer-events-auto rounded-full overflow-hidden cursor-pointer group transition-all hover:scale-110 active:scale-95 shadow-[0_0_12px_rgba(245,158,11,0.6)]"
            style={{
              left: '3.44%',
              top: '85.93%',
              width: '4.58%',
              height: '8.06%'
            }}
            title={`Karakter: ${selectedAvatar.name} (${selectedAvatar.code}) - Klik pikeun ngagentos!`}
          >
            {/* Show current selected avatar inside the circle */}
            <div className="w-full h-full bg-amber-200/90 flex items-center justify-center p-0.5 border-2 border-black rounded-full overflow-hidden">
              <img
                src={selectedAvatar.image}
                alt={selectedAvatar.name}
                className="max-h-full max-w-full object-contain filter drop-shadow group-hover:scale-115 transition-transform"
              />
            </div>
          </button>
        </form>

        {/* Character Selection Modal */}
        <CharacterModal
          isOpen={isModalOpen}
          selectedAvatar={selectedAvatar}
          onSelectAvatar={(avatar) => {
            setSelectedAvatar(avatar)
            setIsModalOpen(false)
            playRetroSound('click')
          }}
          onClose={() => setIsModalOpen(false)}
        />

      </div>
    </div>
  )
}
