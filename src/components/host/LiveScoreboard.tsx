import { Trophy } from 'lucide-react'
import type { Player } from '../../types/game'
import { CHARACTER_REGISTRY } from '../../assets/assetRegistry'

interface LiveScoreboardProps {
  players: Player[]
}

export function LiveScoreboard({ players }: LiveScoreboardProps) {
  const top5 = [...players]
    .sort((a, b) => b.score - a.score)
    .slice(0, 5)

  const RANK_STYLE = [
    'text-amber-400 border-amber-500/60 bg-amber-500/10',
    'text-slate-400 border-slate-500/60 bg-slate-500/10',
    'text-amber-700 border-amber-700/60 bg-amber-700/10',
    'text-slate-500 border-slate-700/50 bg-slate-800/40',
    'text-slate-500 border-slate-700/50 bg-slate-800/40',
  ]

  const RANK_ICON = ['🥇', '🥈', '🥉', '4️⃣', '5️⃣']

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-2 px-4 py-3 border-b border-slate-700/60">
        <Trophy size={15} className="text-amber-400" />
        <span className="text-sm font-bold text-amber-300">Papan Skor Live</span>
      </div>

      <div className="flex-1 overflow-y-auto px-3 py-2 space-y-2">
        {top5.map((player, rank) => {
          const char = CHARACTER_REGISTRY[player.characterId]
          return (
            <div
              key={player.id}
              className={`
                flex items-center gap-2.5 px-3 py-2.5 rounded-xl border transition-all
                ${RANK_STYLE[rank] || RANK_STYLE[4]}
              `}
            >
              <span className="text-base w-6 text-center">{RANK_ICON[rank]}</span>
              <img
                src={char.sprites.idle}
                alt={char.name}
                className="w-8 h-8 object-contain"
                style={{ imageRendering: 'pixelated' }}
              />
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold text-slate-100 truncate">{player.name}</p>
                <p className="text-[9px] text-slate-500">Petak {player.position}</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-black text-amber-400">{player.score}</p>
              </div>
            </div>
          )
        })}

        {top5.length === 0 && (
          <div className="text-center py-8 text-slate-600 text-xs">
            Belum ada pemain
          </div>
        )}
      </div>
    </div>
  )
}
