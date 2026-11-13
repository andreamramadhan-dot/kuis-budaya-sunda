import React, { useState, useEffect, useRef } from 'react'
import { Search, Volume2, VolumeX, Maximize2, Sparkles, ArrowRight } from 'lucide-react'
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
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [isShaking, setIsShaking] = useState(false)
  const [soundOn, setSoundOn] = useState(isAudioEnabled)
  const inputRef = useRef<HTMLInputElement>(null)

  // Focus input automatically on mount
  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  // Web Audio synth for retro game sound (PWA safe, zero asset loading delay)
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
        osc.frequency.setValueAtTime(523.25, now) // C5
        osc.frequency.setValueAtTime(659.25, now + 0.06) // E5
        osc.frequency.setValueAtTime(783.99, now + 0.12) // G5
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
      // Ignore audio context errors if blocked by browser policy
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

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault()
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

  const handleQuickDemoPin = (demoPin: string) => {
    setPin(demoPin)
    setErrorMessage(null)
    playRetroSound('click')
    inputRef.current?.focus()
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

  return (
    <div className="relative w-full min-h-screen bg-slate-950 flex items-center justify-center overflow-hidden select-none font-sans">
      {/* 16:9 Screen Container strictly matching design aspect ratio */}
      <div className="relative w-full max-w-6xl aspect-[16/9] max-h-screen flex flex-col justify-between overflow-hidden shadow-2xl md:rounded-3xl border-0 md:border-4 border-amber-900/60 bg-black">
        
        {/* Full-bleed high-res Sunda Empire artwork from Kelompok Intan */}
        <img
          src={landingBgImg}
          alt="Sunda Empire Landing"
          className="absolute inset-0 w-full h-full object-cover object-center pointer-events-none"
        />

        {/* Ambient Sunrays / Pixel Vignette */}
        <div className="absolute inset-0 bg-radial-gradient pointer-events-none mix-blend-overlay opacity-30" />

        {/* Top Control Bar (PWA friendly: sound & fullscreen) */}
        <header className="relative z-20 flex items-center justify-between p-4 md:p-6">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/40 backdrop-blur-md border border-amber-400/30 text-amber-200 text-xs font-bold tracking-wider uppercase shadow-md">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span>PWA Ready • Budaya Sunda</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={toggleAudio}
              className="p-2.5 rounded-xl bg-black/50 hover:bg-black/70 text-amber-200 border border-amber-400/40 backdrop-blur-md transition-all active:scale-95 shadow-md"
              title={soundOn ? 'Matikan Suara' : 'Nyalakan Suara'}
              aria-label="Toggle Sound"
            >
              {soundOn ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5 text-rose-300" />}
            </button>
            <button
              type="button"
              onClick={toggleFullscreen}
              className="p-2.5 rounded-xl bg-black/50 hover:bg-black/70 text-amber-200 border border-amber-400/40 backdrop-blur-md transition-all active:scale-95 shadow-md hidden sm:flex"
              title="Layar Penuh"
              aria-label="Toggle Fullscreen"
            >
              <Maximize2 className="w-5 h-5" />
            </button>
          </div>
        </header>

        {/* Center Interactive Form Layer (aligned with the mockup input & button) */}
        <main className="relative z-20 flex-1 flex flex-col items-center justify-end pb-8 sm:pb-12 md:pb-16 px-4">
          <form
            onSubmit={handleFormSubmit}
            className={`w-full max-w-md sm:max-w-lg md:max-w-xl flex flex-col items-center gap-3.5 sm:gap-4 transition-transform duration-200 ${
              isShaking ? 'translate-x-[-8px] animate-shake' : ''
            }`}
          >
            {/* Input PIN Field matching file_00000000c340820796596c9591ff9031.png */}
            <div className="relative w-full group">
              <div className="relative flex items-center bg-white rounded-2xl md:rounded-3xl border-4 border-black shadow-[0_6px_0_#000] overflow-hidden transition-all focus-within:shadow-[0_8px_0_#000] focus-within:-translate-y-0.5">
                <input
                  ref={inputRef}
                  type="text"
                  value={pin}
                  onChange={handleInputChange}
                  placeholder="Enter a join code"
                  maxLength={6}
                  autoComplete="off"
                  spellCheck="false"
                  className="w-full py-3.5 sm:py-4 md:py-5 pl-5 sm:pl-7 pr-14 sm:pr-16 bg-transparent text-stone-800 placeholder:text-stone-400 font-extrabold text-xl sm:text-2xl md:text-3xl tracking-widest text-center focus:outline-none uppercase"
                />

                {/* Magnifying Glass Icon matching the design illustration */}
                <div className="absolute right-3.5 sm:right-5 top-1/2 -translate-y-1/2 flex items-center justify-center w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-stone-100 border-2 border-stone-800 text-stone-800 pointer-events-none group-focus-within:bg-amber-100 transition-colors">
                  <Search className="w-5 h-5 sm:w-6 sm:h-6 stroke-[3]" />
                </div>
              </div>

              {/* Error feedback badge */}
              {errorMessage && (
                <div className="absolute -top-10 left-1/2 -translate-x-1/2 px-4 py-1 rounded-lg bg-rose-600 border-2 border-black text-white text-xs sm:text-sm font-black shadow-[0_3px_0_#000] whitespace-nowrap animate-bounce">
                  ⚠️ {errorMessage}
                </div>
              )}
            </div>

            {/* Join Button matching file_00000000c340820796596c9591ff9031.png */}
            <button
              type="submit"
              className="relative w-44 sm:w-52 md:w-60 py-3 sm:py-3.5 md:py-4 rounded-2xl md:rounded-3xl bg-[#f4a259] hover:bg-[#ffb066] active:bg-[#e08f45] border-4 border-black text-stone-900 font-black text-xl sm:text-2xl md:text-3xl tracking-wide shadow-[0_6px_0_#000] hover:shadow-[0_8px_0_#000] hover:-translate-y-0.5 active:translate-y-1.5 active:shadow-[0_1px_0_#000] transition-all cursor-pointer flex items-center justify-center gap-2 group"
            >
              <span>Join</span>
              <ArrowRight className="w-5 h-5 sm:w-6 sm:h-6 stroke-[3] group-hover:translate-x-1 transition-transform" />
            </button>
          </form>

          {/* Quick Demo PIN Chips (for easy testing without typing) */}
          <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
            <span className="text-[11px] sm:text-xs font-bold text-emerald-950 bg-emerald-300/80 backdrop-blur-sm px-2.5 py-1 rounded-full border border-emerald-900/30 shadow-sm flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-amber-700" />
              Tes Kode Cepat:
            </span>
            <button
              type="button"
              onClick={() => handleQuickDemoPin('ORAY01')}
              className="px-2.5 py-1 rounded-full bg-white/90 hover:bg-white text-stone-900 text-xs font-black border-2 border-black shadow-[0_2px_0_#000] active:translate-y-0.5 active:shadow-none transition-all"
            >
              🐍 ORAY01
            </button>
            <button
              type="button"
              onClick={() => handleQuickDemoPin('ENGK02')}
              className="px-2.5 py-1 rounded-full bg-white/90 hover:bg-white text-stone-900 text-xs font-black border-2 border-black shadow-[0_2px_0_#000] active:translate-y-0.5 active:shadow-none transition-all"
            >
              🧱 ENGK02
            </button>
            <button
              type="button"
              onClick={() => handleQuickDemoPin('SUNDA9')}
              className="px-2.5 py-1 rounded-full bg-white/90 hover:bg-white text-stone-900 text-xs font-black border-2 border-black shadow-[0_2px_0_#000] active:translate-y-0.5 active:shadow-none transition-all"
            >
              👑 SUNDA9
            </button>
          </div>
        </main>

        {/* Footer info */}
        <footer className="relative z-20 px-6 py-2 flex items-center justify-center text-[10px] sm:text-xs text-amber-950 font-bold bg-amber-400/40 backdrop-blur-xs border-t border-amber-900/20">
          <span>Kuis Budaya Sunda • Mode Oray-Orayan & Engklek • Divisi 4 Frontend Web & UI</span>
        </footer>

      </div>
    </div>
  )
}
