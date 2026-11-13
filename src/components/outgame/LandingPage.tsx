import React, { useState, useEffect, useRef } from 'react'
import { Volume2, VolumeX, Maximize2 } from 'lucide-react'
import landingBgImg from '../../assets/sunda-empire-landing.png'

interface LandingPageProps {
  onJoinPin: (pin: string) => void
  initialPin?: string
  isAudioEnabled?: boolean
  onToggleAudio?: () => void
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onJoinPin,
  initialPin = '',
  isAudioEnabled = true,
  onToggleAudio
}) => {
  const [pin, setPin] = useState(initialPin)
  const [isFocused, setIsFocused] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [isShaking, setIsShaking] = useState(false)
  const [soundOn, setSoundOn] = useState(isAudioEnabled)
  const inputRef = useRef<HTMLInputElement>(null)

  // Auto-focus input on mount
  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  // Web Audio synth for retro game feedback
  const playRetroSound = (type: 'type' | 'click' | 'error') => {
    if (!soundOn) return
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
        osc.frequency.setValueAtTime(440, now)
        osc.frequency.exponentialRampToValueAtTime(880, now + 0.05)
        gain.gain.setValueAtTime(0.08, now)
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05)
        osc.start(now)
        osc.stop(now + 0.05)
      } else if (type === 'click') {
        osc.type = 'square'
        osc.frequency.setValueAtTime(523.25, now)
        osc.frequency.setValueAtTime(659.25, now + 0.06)
        osc.frequency.setValueAtTime(783.99, now + 0.12)
        gain.gain.setValueAtTime(0.12, now)
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2)
        osc.start(now)
        osc.stop(now + 0.2)
      } else if (type === 'error') {
        osc.type = 'sawtooth'
        osc.frequency.setValueAtTime(220, now)
        osc.frequency.setValueAtTime(160, now + 0.1)
        gain.gain.setValueAtTime(0.15, now)
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2)
        osc.start(now)
        osc.stop(now + 0.2)
      }
    } catch {
      // Ignore audio policy errors
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '')
    if (val.length <= 6) {
      setPin(val)
      setErrorMessage(null)
      playRetroSound('type')
    }
  }

  const handleFormSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault()
    const trimmed = pin.trim()

    if (!trimmed) {
      setErrorMessage('Mangga lebetkeun kode PIN room!')
      setIsShaking(true)
      playRetroSound('error')
      setTimeout(() => setIsShaking(false), 500)
      inputRef.current?.focus()
      return
    }

    if (trimmed.length < 4) {
      setErrorMessage('Kode PIN kedah 4 dugi ka 6 karakter!')
      setIsShaking(true)
      playRetroSound('error')
      setTimeout(() => setIsShaking(false), 500)
      inputRef.current?.focus()
      return
    }

    playRetroSound('click')
    onJoinPin(trimmed)
  }

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {})
    } else {
      document.exitFullscreen().catch(() => {})
    }
  }

  const toggleAudio = () => {
    const next = !soundOn
    setSoundOn(next)
    onToggleAudio?.()
    if (next) playRetroSound('click')
  }

  // Active typing state: show clean white fill to cover placeholder text from original image
  const showWhiteFill = isFocused || pin.length > 0

  return (
    <div className="relative w-full min-h-screen bg-slate-950 flex items-center justify-center overflow-hidden select-none font-sans p-0 sm:p-2">
      {/* 16:9 Screen Container strictly matching original artwork aspect ratio */}
      <div className="relative w-full max-w-6xl aspect-[16/9] max-h-screen overflow-hidden shadow-2xl md:rounded-3xl border-0 md:border-4 border-amber-900/60 bg-black">
        
        {/* Full-bleed Sunda Empire artwork from original design */}
        <img
          src={landingBgImg}
          alt="Sunda Empire Landing"
          className="absolute inset-0 w-full h-full object-fill pointer-events-none"
        />

        {/* Top-Right Control Buttons (Audio & Fullscreen) */}
        <div className="absolute top-3 right-3 sm:top-5 sm:right-5 z-30 flex items-center gap-2">
          <button
            type="button"
            onClick={toggleAudio}
            className="p-2 sm:p-2.5 rounded-xl bg-black/40 hover:bg-black/60 text-amber-200 border border-amber-400/30 backdrop-blur-md transition-all active:scale-95 shadow cursor-pointer"
            title={soundOn ? 'Matikan Suara' : 'Nyalakan Suara'}
            aria-label="Toggle Sound"
          >
            {soundOn ? <Volume2 className="w-4 h-4 sm:w-5 sm:h-5" /> : <VolumeX className="w-4 h-4 sm:w-5 sm:h-5 text-rose-300" />}
          </button>
          <button
            type="button"
            onClick={toggleFullscreen}
            className="p-2 sm:p-2.5 rounded-xl bg-black/40 hover:bg-black/60 text-amber-200 border border-amber-400/30 backdrop-blur-md transition-all active:scale-95 shadow cursor-pointer hidden sm:flex"
            title="Layar Penuh"
            aria-label="Toggle Fullscreen"
          >
            <Maximize2 className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </div>

        {/* Interactive Form placed directly on top of original artwork's input box & button */}
        <form
          onSubmit={handleFormSubmit}
          className={`absolute inset-0 w-full h-full z-20 pointer-events-none ${
            isShaking ? 'animate-shake' : ''
          }`}
        >
          {/*
            INPUT BOX HOTSPOT:
            Mapped exactly to the white interior between left border and the magnifying glass.
            When empty & blurred, transparent allows original artwork placeholder to show.
            When focused or typed, white fill cleanly displays the typed PIN.
          */}
          <div
            className="absolute pointer-events-auto flex items-center justify-center"
            style={{
              left: '31.5%',
              top: '49.0%',
              width: '34.8%',
              height: '9.8%'
            }}
          >
            <input
              ref={inputRef}
              type="text"
              value={pin}
              onChange={handleInputChange}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              placeholder={showWhiteFill ? 'KODE PIN' : ''}
              maxLength={6}
              autoComplete="off"
              spellCheck="false"
              className={`w-full h-full rounded-xl text-center text-stone-900 font-extrabold text-xl sm:text-2xl md:text-3xl tracking-widest focus:outline-none uppercase transition-colors duration-150 ${
                showWhiteFill
                  ? 'bg-white shadow-inner placeholder:text-stone-300'
                  : 'bg-transparent text-transparent cursor-pointer'
              }`}
            />

            {/* Error Notification Tooltip */}
            {errorMessage && (
              <div className="absolute -top-9 left-1/2 -translate-x-1/2 px-3 py-1 rounded-lg bg-rose-600 border-2 border-black text-white text-xs font-black shadow-[0_2px_0_#000] whitespace-nowrap animate-bounce pointer-events-none z-30">
                ⚠️ {errorMessage}
              </div>
            )}
          </div>

          {/*
            JOIN BUTTON HOTSPOT:
            Directly mapped to the original design's amber pixel button!
            No secondary button is drawn on top.
            It provides hover and active click press feedback directly onto the original artwork button.
          */}
          <button
            type="submit"
            aria-label="Join Game"
            className="absolute pointer-events-auto cursor-pointer rounded-full transition-transform active:scale-95 hover:brightness-105"
            style={{
              left: '37.38%',
              top: '67.80%',
              width: '25.24%',
              height: '10.31%',
              background: 'transparent',
              border: 'none',
              outline: 'none'
            }}
          />
        </form>

      </div>
    </div>
  )
}
