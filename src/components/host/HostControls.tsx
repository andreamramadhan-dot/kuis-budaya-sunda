import { Play, Pause, Square, Zap } from 'lucide-react'
import type { SessionStatus, GameMode } from '../../types/game'
import { Button } from '../ui/Button'
import { Badge } from '../ui/Badge'
import { emitBridgeEvent } from '../../services/gameBridge'

interface HostControlsProps {
  status: SessionStatus
  mode: GameMode
  onStart: () => void
  onPause: () => void
  onEnd: () => void
  onModeChange: (m: GameMode) => void
  connectedCount: number
}

const STATUS_LABEL: Record<SessionStatus, { label: string; variant: 'emerald' | 'amber' | 'rose' | 'slate' }> = {
  waiting:  { label: 'Menunggu',  variant: 'slate'   },
  active:   { label: 'Berlangsung', variant: 'emerald' },
  paused:   { label: 'Dijeda',    variant: 'amber'   },
  finished: { label: 'Selesai',   variant: 'rose'    },
}

const MODE_LABEL: Record<GameMode, string> = {
  'engklek':     '🏕️ Engklek',
  'oray-orayan': '🐍 Oray-orayan',
}

export function HostControls({
  status,
  mode,
  onStart,
  onPause,
  onEnd,
  onModeChange,
  connectedCount,
}: HostControlsProps) {
  const { label, variant } = STATUS_LABEL[status]

  function triggerEmergencyQuiz() {
    emitBridgeEvent('GAME_TRIGGER_QUIZ', { source: 'host_manual', timestamp: Date.now() })
  }

  return (
    <div className="flex flex-col gap-3 p-4 bg-slate-900/70 rounded-2xl border border-slate-700/50 backdrop-blur-sm">
      {/* Status badge */}
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Status Sesi</span>
        <Badge variant={variant} size="md">{label}</Badge>
      </div>

      {/* Mode selector (only during waiting) */}
      {status === 'waiting' && (
        <div className="flex gap-2">
          {(['engklek', 'oray-orayan'] as GameMode[]).map(m => (
            <button
              key={m}
              onClick={() => onModeChange(m)}
              className={`
                flex-1 py-2 text-xs font-bold rounded-xl border-2 transition-all cursor-pointer
                ${mode === m
                  ? 'border-amber-500 bg-amber-500/20 text-amber-300'
                  : 'border-slate-700 bg-slate-800/60 text-slate-500 hover:border-slate-600'}
              `}
            >
              {MODE_LABEL[m]}
            </button>
          ))}
        </div>
      )}

      {/* Active mode indicator */}
      {status !== 'waiting' && (
        <div className="text-center py-1 bg-amber-900/30 rounded-xl border border-amber-700/40">
          <span className="text-xs text-amber-300 font-bold">{MODE_LABEL[mode]}</span>
        </div>
      )}

      {/* Primary action buttons */}
      <div className="flex gap-2">
        {status === 'waiting' && (
          <Button
            variant="primary"
            size="md"
            className="flex-1 flex items-center justify-center gap-2"
            onClick={onStart}
            disabled={connectedCount === 0}
          >
            <Play size={14} />
            Mulai Sesi
          </Button>
        )}

        {status === 'active' && (
          <>
            <Button
              variant="ghost"
              size="sm"
              className="flex-1 flex items-center justify-center gap-1.5"
              onClick={onPause}
            >
              <Pause size={13} />
              Pause
            </Button>
            <Button
              variant="danger"
              size="sm"
              className="flex-1 flex items-center justify-center gap-1.5"
              onClick={onEnd}
            >
              <Square size={13} />
              Stop
            </Button>
          </>
        )}

        {status === 'paused' && (
          <>
            <Button
              variant="primary"
              size="sm"
              className="flex-1 flex items-center justify-center gap-1.5"
              onClick={onStart}
            >
              <Play size={13} />
              Lanjutkan
            </Button>
            <Button
              variant="danger"
              size="sm"
              className="flex-1 flex items-center justify-center gap-1.5"
              onClick={onEnd}
            >
              <Square size={13} />
              Stop
            </Button>
          </>
        )}

        {status === 'finished' && (
          <div className="flex-1 text-center text-xs text-slate-500 py-2 font-bold">
            Sesi telah selesai
          </div>
        )}
      </div>

      {/* Emergency trigger */}
      {(status === 'active' || status === 'paused') && (
        <button
          onClick={triggerEmergencyQuiz}
          className="w-full flex items-center justify-center gap-2 py-2 text-[11px] font-bold text-violet-300 bg-violet-900/30 hover:bg-violet-900/50 border border-violet-700/50 rounded-xl transition-all cursor-pointer"
        >
          <Zap size={12} />
          Trigger Kuis Darurat
        </button>
      )}
    </div>
  )
}
