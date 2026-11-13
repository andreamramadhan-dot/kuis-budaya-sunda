import { useState, useEffect, useRef, useCallback } from 'react'
import type { CharacterId, CharacterAction } from '../../assets/assetRegistry'
import { getCharacterSprite, CHARACTER_REGISTRY } from '../../assets/assetRegistry'

interface MoveableCharacterProps {
  initialCharacterId?: CharacterId
  onPositionChange?: (x: number, y: number) => void
}

// Batas area tanah tempat karakter boleh berjalan (persentase)
// Sesuai kontur tanah jalan desa di IMG-20261113-WA0004.jpg
const BOUNDS = {
  minX: 10,
  maxX: 88,
  minY: 66, // Batas atas tanah (agar tidak jalan di langit/atas gunung)
  maxY: 88, // Batas bawah tanah
}

export function MoveableCharacter({
  initialCharacterId = 'K1',
  onPositionChange,
}: MoveableCharacterProps) {
  // Posisi natural di atas tanah depan saung
  const [pos, setPos] = useState({ x: 34, y: 80 })
  const [facing, setFacing] = useState<'left' | 'right'>('right')
  const [action, setAction] = useState<CharacterAction>('idle')
  const [charId, setCharId] = useState<CharacterId>(initialCharacterId)
  const [isJumping, setIsJumping] = useState(false)
  const [isDragging, setIsDragging] = useState(false)

  const containerRef = useRef<HTMLDivElement>(null)
  const actionTimeoutRef = useRef<number | null>(null)

  const triggerAction = useCallback((newAction: CharacterAction, durationMs = 450) => {
    if (actionTimeoutRef.current) window.clearTimeout(actionTimeoutRef.current)
    setAction(newAction)
    actionTimeoutRef.current = window.setTimeout(() => {
      setAction('idle')
    }, durationMs)
  }, [])

  const doJump = useCallback(() => {
    if (isJumping) return
    setIsJumping(true)
    triggerAction('jump', 600)
    window.setTimeout(() => {
      setIsJumping(false)
    }, 600)
  }, [isJumping, triggerAction])

  const doThrow = useCallback(() => {
    triggerAction('throw', 500)
  }, [triggerAction])

  // Keyboard Movement & Action Controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Avoid firing if typing in an input
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) return

      const speed = e.shiftKey ? 3.5 : 1.8

      switch (e.code) {
        case 'ArrowLeft':
        case 'KeyA':
          setFacing('left')
          setPos(prev => {
            const nextX = Math.max(BOUNDS.minX, prev.x - speed)
            onPositionChange?.(nextX, prev.y)
            return { ...prev, x: nextX }
          })
          if (action === 'idle') triggerAction('jump', 200)
          break

        case 'ArrowRight':
        case 'KeyD':
          setFacing('right')
          setPos(prev => {
            const nextX = Math.min(BOUNDS.maxX, prev.x + speed)
            onPositionChange?.(nextX, prev.y)
            return { ...prev, x: nextX }
          })
          if (action === 'idle') triggerAction('jump', 200)
          break

        case 'ArrowUp':
        case 'KeyW':
          setPos(prev => {
            const nextY = Math.max(BOUNDS.minY, prev.y - speed * 0.7)
            onPositionChange?.(prev.x, nextY)
            return { ...prev, y: nextY }
          })
          if (action === 'idle') triggerAction('jump', 200)
          break

        case 'ArrowDown':
        case 'KeyS':
          setPos(prev => {
            const nextY = Math.min(BOUNDS.maxY, prev.y + speed * 0.7)
            onPositionChange?.(prev.x, nextY)
            return { ...prev, y: nextY }
          })
          if (action === 'idle') triggerAction('jump', 200)
          break

        case 'Space':
          e.preventDefault()
          doJump()
          break

        case 'KeyF':
        case 'KeyE':
          e.preventDefault()
          doThrow()
          break

        // Ganti karakter 1-8 lewat tombol angka keyboard
        case 'Digit1': setCharId('K1'); break
        case 'Digit2': setCharId('K2'); break
        case 'Digit3': setCharId('K3'); break
        case 'Digit4': setCharId('K4'); break
        case 'Digit5': setCharId('K5'); break
        case 'Digit6': setCharId('K6'); break
        case 'Digit7': setCharId('K7'); break
        case 'Digit8': setCharId('K8'); break
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [action, doJump, doThrow, onPositionChange, triggerAction])

  // Click / Drag to move
  const handlePointerDown = (e: React.PointerEvent) => {
    e.stopPropagation()
    setIsDragging(true)
  }

  useEffect(() => {
    if (!isDragging) return

    const handlePointerMove = (e: PointerEvent) => {
      const parent = containerRef.current?.parentElement
      if (!parent) return
      const rect = parent.getBoundingClientRect()
      const xPct = Math.min(BOUNDS.maxX, Math.max(BOUNDS.minX, ((e.clientX - rect.left) / rect.width) * 100))
      const yPct = Math.min(BOUNDS.maxY, Math.max(BOUNDS.minY, ((e.clientY - rect.top) / rect.height) * 100))

      setPos(prev => {
        if (xPct < prev.x) setFacing('left')
        else if (xPct > prev.x) setFacing('right')
        return { x: xPct, y: yPct }
      })
      onPositionChange?.(xPct, yPct)
    }

    const handlePointerUp = () => {
      setIsDragging(false)
    }

    window.addEventListener('pointermove', handlePointerMove)
    window.addEventListener('pointerup', handlePointerUp)
    return () => {
      window.removeEventListener('pointermove', handlePointerMove)
      window.removeEventListener('pointerup', handlePointerUp)
    }
  }, [isDragging, onPositionChange])

  const sprite = getCharacterSprite(charId, action)
  const meta = CHARACTER_REGISTRY[charId]

  return (
    <>
      {/* ── Karakter Moveable ────────────────────────────────────────────────── */}
      <div
        ref={containerRef}
        onPointerDown={handlePointerDown}
        className={`absolute z-20 transition-all select-none cursor-grab active:cursor-grabbing ${
          isDragging ? 'duration-0' : 'duration-150 ease-out'
        }`}
        style={{
          left: `${pos.x}%`,
          top: `${pos.y}%`,
          transform: `translate(-50%, -90%) ${isJumping ? 'translateY(-38px)' : ''}`,
          filter: isDragging ? 'drop-shadow(0 14px 18px rgba(0,0,0,0.7))' : 'drop-shadow(0 8px 12px rgba(0,0,0,0.6))',
        }}
        title="Klik dan seret karakter atau gunakan tombol Panah/WASD"
      >
        {/* Bayangan di tanah (tetap di posisi kaki saat lompat) */}
        <div
          className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-14 h-4 bg-black/40 rounded-full blur-[2px] transition-transform pointer-events-none"
          style={{
            transform: `translateX(-50%) scale(${isJumping ? 0.6 : 1})`,
            opacity: isJumping ? 0.3 : 0.6,
          }}
        />

        {/* Sprite Karakter Transparan PNG */}
        <img
          src={sprite}
          alt={meta?.name || 'Karakter'}
          className={`h-28 md:h-36 lg:h-40 object-contain pointer-events-none transition-transform duration-100 ${
            facing === 'left' ? '-scale-x-100' : 'scale-x-100'
          }`}
          style={{ imageRendering: 'pixelated' }}
          draggable={false}
        />

        {/* Label Nama Karakter Kecil */}
        <div className="absolute -bottom-5 left-1/2 -translate-x-1/2 pointer-events-none">
          <span className="bg-slate-950/80 text-amber-300 border border-amber-500/50 text-[10px] font-black px-2 py-0.5 rounded-full shadow-md whitespace-nowrap">
            {meta?.name} ({charId})
          </span>
        </div>
      </div>

      {/* ── Discreet Control HUD (Minimalis, Bukan Halaman Lobby) ───────────── */}
      <div className="absolute top-3 left-4 z-30 flex items-center gap-2 bg-slate-950/80 border border-slate-700/70 backdrop-blur-md px-3 py-1.5 rounded-xl shadow-xl text-xs text-slate-300 pointer-events-auto">
        <span className="text-amber-400 font-bold">🎮 Gerak:</span>
        <span className="font-mono bg-slate-800 px-1.5 py-0.5 rounded text-[11px] text-amber-200">WASD / Panah</span>
        <span className="text-slate-600">|</span>
        <button
          onClick={doJump}
          className="hover:text-amber-300 font-mono bg-slate-800 hover:bg-slate-700 px-1.5 py-0.5 rounded text-[11px] text-amber-200 transition-colors cursor-pointer"
        >
          Spasi: Lompat
        </button>
        <span className="text-slate-600">|</span>
        <button
          onClick={doThrow}
          className="hover:text-amber-300 font-mono bg-slate-800 hover:bg-slate-700 px-1.5 py-0.5 rounded text-[11px] text-amber-200 transition-colors cursor-pointer"
        >
          F: Lempar
        </button>
      </div>

      {/* ── Quick Avatar Selector K1-K8 (Kecil di Pojok Bawah) ────────────── */}
      <div className="absolute bottom-3 left-4 z-30 flex items-center gap-1.5 bg-slate-950/80 border border-slate-700/70 backdrop-blur-md px-2.5 py-1.5 rounded-xl shadow-xl pointer-events-auto">
        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mr-1">
          Karakter:
        </span>
        {(['K1', 'K2', 'K3', 'K4', 'K5', 'K6', 'K7', 'K8'] as CharacterId[]).map((k, idx) => (
          <button
            key={k}
            onClick={() => setCharId(k)}
            className={`w-6 h-6 rounded-lg text-xs font-black transition-all cursor-pointer ${
              charId === k
                ? 'bg-amber-500 text-slate-950 shadow-md font-black'
                : 'bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700'
            }`}
            title={`Pilih ${CHARACTER_REGISTRY[k].name} (Angka ${idx + 1})`}
          >
            {idx + 1}
          </button>
        ))}
      </div>
    </>
  )
}
