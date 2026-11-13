import { HOST_ASSETS } from '../../assets/assetRegistry'
import { MoveableCharacter } from './MoveableCharacter'

interface ArenaEngklekProps {
  className?: string
}

export function ArenaEngklek({ className = '' }: ArenaEngklekProps) {
  return (
    <div className={`relative w-full h-full overflow-hidden select-none bg-slate-950 ${className}`}>
      {/* ── Background Desa Sunda (IMG-20261113-WA0004.jpg) ────────────────── */}
      <img
        src={HOST_ASSETS.arenaClean}
        alt="Arena Desa Sunda - IMG-20261113-WA0004.jpg"
        className="w-full h-full object-cover object-center pointer-events-none"
        draggable={false}
      />

      {/* ── Ambient Awan Bergerak ─────────────────────────────────────────── */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div
          className="absolute top-8 w-28 h-10 bg-white/20 rounded-full blur-md"
          style={{ animation: 'cloudDrift 22s linear infinite', left: '-15%' }}
        />
        <div
          className="absolute top-16 w-20 h-7 bg-white/15 rounded-full blur-sm"
          style={{ animation: 'cloudDrift 30s linear infinite 10s', left: '-15%' }}
        />
      </div>

      {/* ── Karakter Bergerak (Moveable Character di atas tanah) ───────────── */}
      <MoveableCharacter initialCharacterId="K1" />
    </div>
  )
}
