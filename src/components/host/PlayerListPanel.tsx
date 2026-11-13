import { Users, Wifi, WifiOff } from 'lucide-react'
import type { Player } from '../../types/game'
import { CHARACTER_REGISTRY } from '../../assets/assetRegistry'
import { Badge } from '../ui/Badge'

interface PlayerListPanelProps {
  players: Player[]
}

export function PlayerListPanel({ players }: PlayerListPanelProps) {
  const sortedPlayers = [...players].sort((a, b) => b.score - a.score)

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center gap-2 px-4 py-3 border-b border-slate-700/60">
        <Users size={16} className="text-amber-400" />
        <span className="text-sm font-bold text-amber-300">Siswa Terhubung</span>
        <Badge variant="emerald" size="sm">
          {players.filter(p => p.isConnected).length}/{players.length}
        </Badge>
      </div>

      {/* Player list */}
      <div className="flex-1 overflow-y-auto px-3 py-2 space-y-1.5 scrollbar-thin scrollbar-thumb-slate-600">
        {sortedPlayers.map((player, rank) => {
          const char = CHARACTER_REGISTRY[player.characterId]
          return (
            <div
              key={player.id}
              className={`
                flex items-center gap-2 px-3 py-2 rounded-xl transition-all
                ${player.isConnected
                  ? 'bg-slate-800/60 border border-slate-700/50 hover:border-amber-500/40'
                  : 'bg-slate-900/40 border border-slate-800/40 opacity-60'}
              `}
            >
              {/* Rank */}
              <span className={`
                w-5 h-5 flex items-center justify-center rounded-full text-[10px] font-black shrink-0
                ${rank === 0 ? 'bg-amber-400 text-slate-900' :
                  rank === 1 ? 'bg-slate-400 text-slate-900' :
                  rank === 2 ? 'bg-amber-700 text-amber-100' :
                  'bg-slate-700 text-slate-400'}
              `}>
                {rank + 1}
              </span>

              {/* Avatar sprite */}
              <img
                src={char.sprites.idle}
                alt={char.name}
                className="w-7 h-7 object-contain shrink-0"
                style={{ imageRendering: 'pixelated' }}
              />

              {/* Name & character */}
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold text-slate-100 truncate">{player.name}</p>
                <p className="text-[9px] text-slate-500 truncate">{char.name} · Petak {player.position}</p>
              </div>

              {/* Score */}
              <div className="text-right shrink-0">
                <p className="text-xs font-black text-amber-400">{player.score}</p>
                <p className="text-[9px] text-slate-500">poin</p>
              </div>

              {/* Connection status */}
              {player.isConnected
                ? <Wifi size={12} className="text-emerald-400 shrink-0" />
                : <WifiOff size={12} className="text-rose-400 shrink-0" />
              }
            </div>
          )
        })}
      </div>
    </div>
  )
}
