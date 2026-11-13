import { useMemo } from 'react'
import type { Petak } from '../../types/game'
import type { CharacterId } from '../../assets/assetRegistry'
import { getCharacterSprite } from '../../assets/assetRegistry'
import { HOST_ASSETS } from '../../assets/assetRegistry'

interface PlayerOnPetak {
  playerId: string
  name: string
  characterId: CharacterId
  currentAction: 'idle' | 'jump' | 'fall' | 'throw'
  score: number
}

interface ArenaEngklekProps {
  petaks: Petak[]
  players: PlayerOnPetak[]
  className?: string
}

// Koordinat petak 1–10 relatif terhadap gambar arena (persen, left top)
// Disesuaikan dengan layout papan engklek dari desain luna IMG-20261113-WA0005.jpg
const PETAK_POSITIONS: Record<number, { left: string; top: string }> = {
  1:  { left: '12%', top: '75%' },
  2:  { left: '24%', top: '75%' },
  3:  { left: '24%', top: '62%' },
  4:  { left: '12%', top: '62%' },
  5:  { left: '18%', top: '50%' },
  6:  { left: '12%', top: '38%' },
  7:  { left: '24%', top: '38%' },
  8:  { left: '24%', top: '26%' },
  9:  { left: '12%', top: '26%' },
  10: { left: '18%', top: '14%' }, // Gunung / Puncak
}

const ACTION_LABEL: Record<string, string> = {
  idle: '🧍', jump: '🦘', fall: '😵', throw: '🪨',
}

function PetakOverlay({ petak, players }: { petak: Petak; players: PlayerOnPetak[] }) {
  const pos = PETAK_POSITIONS[petak.number]
  if (!pos) return null

  const occupants = players.filter(p => petak.occupants.includes(p.playerId))

  return (
    <div
      className="absolute flex flex-col items-center gap-0.5"
      style={{ left: pos.left, top: pos.top, transform: 'translate(-50%, -50%)' }}
    >
      {/* Petak number badge */}
      <div className={`
        w-8 h-8 rounded-lg flex items-center justify-center text-xs font-black border-2
        ${petak.isMountain
          ? 'bg-amber-500/80 border-amber-300 text-amber-900 shadow-lg shadow-amber-500/50'
          : petak.owner
            ? 'bg-emerald-700/70 border-emerald-400 text-emerald-100'
            : 'bg-slate-900/50 border-slate-500 text-slate-200'}
      `}>
        {petak.isMountain ? '⛰️' : petak.number}
      </div>

      {/* Owned badge */}
      {petak.owner && (
        <span className="text-[8px] bg-emerald-600/80 text-emerald-100 px-1 rounded font-bold">
          SAWAH {petak.taxPoints}pt
        </span>
      )}

      {/* Character sprites on this petak */}
      {occupants.length > 0 && (
        <div className="flex gap-0.5 mt-0.5">
          {occupants.map(player => (
            <div key={player.playerId} className="flex flex-col items-center">
              <img
                src={getCharacterSprite(player.characterId, player.currentAction)}
                alt={player.name}
                className="w-10 h-10 object-contain drop-shadow-lg"
                style={{ imageRendering: 'pixelated' }}
              />
              <span className="text-[8px] font-bold text-white bg-slate-900/70 px-1 rounded truncate max-w-[40px]">
                {ACTION_LABEL[player.currentAction]} {player.name}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export function ArenaEngklek({ petaks, players, className = '' }: ArenaEngklekProps) {
  const sortedPetaks = useMemo(() => [...petaks].sort((a, b) => a.number - b.number), [petaks])

  return (
    <div className={`relative w-full h-full overflow-hidden rounded-2xl ${className}`}>
      {/* Arena background */}
      <img
        src={HOST_ASSETS.arenaEngklek}
        alt="Arena Engklek Sunda Empire"
        className="w-full h-full object-cover"
        draggable={false}
      />

      {/* Animated ambient overlays */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Subtle animated cloud drift */}
        <div
          className="absolute top-6 w-24 h-10 bg-white/20 rounded-full blur-md"
          style={{ animation: 'cloudDrift 18s linear infinite', left: '-10%' }}
        />
        <div
          className="absolute top-12 w-16 h-8 bg-white/15 rounded-full blur-sm"
          style={{ animation: 'cloudDrift 25s linear infinite 8s', left: '-10%' }}
        />
      </div>

      {/* Petak overlays with player sprites */}
      {sortedPetaks.map(petak => (
        <PetakOverlay key={petak.number} petak={petak} players={players} />
      ))}

      {/* Mountain label */}
      <div className="absolute top-2 left-[18%] transform -translate-x-1/2">
        <span className="text-[10px] font-black text-amber-300 drop-shadow-md tracking-widest uppercase">
          Gunung
        </span>
      </div>
    </div>
  )
}
