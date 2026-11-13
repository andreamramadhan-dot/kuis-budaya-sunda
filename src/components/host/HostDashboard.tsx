import { Monitor } from 'lucide-react'
import { useHostSession } from '../../hooks/useHostSession'
import { ArenaEngklek } from './ArenaEngklek'
import { RoomPinDisplay } from './RoomPinDisplay'
import { HostControls } from './HostControls'
import { PlayerListPanel } from './PlayerListPanel'
import { LiveScoreboard } from './LiveScoreboard'

interface HostDashboardProps {
  roomCode?: string
}

export function HostDashboard({ roomCode = '428-751' }: HostDashboardProps) {
  const session = useHostSession(roomCode)

  const arenaPlayers = session.players.map(p => ({
    playerId: p.id,
    name: p.name,
    characterId: p.characterId,
    currentAction: p.currentAction,
    score: p.score,
  }))

  return (
    <div className="w-full h-screen bg-slate-950 flex flex-col overflow-hidden">

      {/* ── TOP BAR ─────────────────────────────────────────────── */}
      <header className="flex items-center justify-between px-5 py-2.5 bg-slate-900/90 border-b border-slate-800/80 backdrop-blur-sm shrink-0">
        <div className="flex items-center gap-2.5">
          <Monitor size={18} className="text-amber-400" />
          <div>
            <h1 className="text-sm font-black text-amber-300 leading-tight tracking-wide">
              🏕️ Sunda Empire
            </h1>
            <p className="text-[9px] text-slate-500 leading-none uppercase tracking-widest">
              Layar Proyektor Host
            </p>
          </div>
        </div>

        {/* Mode indicator pill */}
        <div className="flex items-center gap-2">
          <div className={`
            px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider
            ${session.mode === 'engklek'
              ? 'bg-emerald-700/40 text-emerald-300 border border-emerald-600/40'
              : 'bg-violet-700/40 text-violet-300 border border-violet-600/40'}
          `}>
            {session.mode === 'engklek' ? '🏕️ Mode Engklek' : '🐍 Mode Oray-orayan'}
          </div>
          <div className={`
            w-2 h-2 rounded-full
            ${session.status === 'active' ? 'bg-emerald-400 animate-pulse' :
              session.status === 'paused' ? 'bg-amber-400' :
              session.status === 'finished' ? 'bg-rose-500' :
              'bg-slate-600'}
          `} />
        </div>
      </header>

      {/* ── MAIN BODY ────────────────────────────────────────────── */}
      <div className="flex flex-1 overflow-hidden gap-0">

        {/* LEFT SIDEBAR ─ Controls + PIN */}
        <aside className="w-64 shrink-0 flex flex-col gap-3 p-3 bg-slate-900/50 border-r border-slate-800/70 overflow-y-auto">
          <RoomPinDisplay
            roomCode={roomCode}
            connectedCount={session.connectedCount}
            totalSlots={8}
          />
          <HostControls
            status={session.status}
            mode={session.mode}
            onStart={session.startSession}
            onPause={session.pauseSession}
            onEnd={session.endSession}
            onModeChange={session.setMode}
            connectedCount={session.connectedCount}
          />
        </aside>

        {/* CENTER ─ Arena Engklek */}
        <main className="flex-1 flex items-center justify-center p-4 bg-slate-950/40 overflow-hidden">
          <div className="relative w-full h-full max-w-[900px] max-h-[560px]">
            <ArenaEngklek
              petaks={session.petaks}
              players={arenaPlayers}
              className="w-full h-full shadow-2xl shadow-slate-950"
            />

            {/* Overlay: Waiting state */}
            {session.status === 'waiting' && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-950/60 rounded-2xl backdrop-blur-[2px]">
                <div className="text-center px-8 py-6 bg-slate-900/90 rounded-2xl border border-amber-500/30 shadow-2xl">
                  <p className="text-4xl mb-2">🏕️</p>
                  <h2 className="text-xl font-black text-amber-300 mb-1">Menunggu Siswa</h2>
                  <p className="text-sm text-slate-400">
                    {session.connectedCount} siswa sudah bergabung
                  </p>
                  <p className="text-xs text-slate-600 mt-2">
                    Tekan <span className="text-amber-400 font-bold">Mulai Sesi</span> jika sudah siap
                  </p>
                </div>
              </div>
            )}

            {/* Overlay: Paused state */}
            {session.status === 'paused' && (
              <div className="absolute inset-0 flex items-center justify-center bg-slate-950/50 rounded-2xl backdrop-blur-[1px]">
                <div className="bg-amber-500/90 text-slate-900 font-black text-2xl px-8 py-4 rounded-2xl shadow-xl tracking-wide">
                  ⏸ DIJEDA
                </div>
              </div>
            )}

            {/* Overlay: Finished state */}
            {session.status === 'finished' && (
              <div className="absolute inset-0 flex items-center justify-center bg-slate-950/70 rounded-2xl backdrop-blur-[2px]">
                <div className="text-center bg-slate-900/95 px-10 py-8 rounded-2xl border border-amber-500/40">
                  <p className="text-5xl mb-3">🏆</p>
                  <h2 className="text-2xl font-black text-amber-300">Sesi Selesai!</h2>
                  <p className="text-slate-400 text-sm mt-1">Lihat Podium Juara</p>
                </div>
              </div>
            )}
          </div>
        </main>

        {/* RIGHT SIDEBAR ─ Players + Scoreboard */}
        <aside className="w-64 shrink-0 flex flex-col bg-slate-900/50 border-l border-slate-800/70 divide-y divide-slate-800/60 overflow-hidden">
          <div className="flex-1 overflow-hidden">
            <PlayerListPanel players={session.players} />
          </div>
          <div className="flex-1 overflow-hidden">
            <LiveScoreboard players={session.players} />
          </div>
        </aside>
      </div>
    </div>
  )
}
