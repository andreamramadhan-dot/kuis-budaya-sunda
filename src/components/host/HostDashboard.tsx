import { useState } from 'react'
import type { Player } from '../../types/game'
import { useHostSession } from '../../hooks/useHostSession'
import { ArenaEngklek } from './ArenaEngklek'
import { CHARACTER_REGISTRY } from '../../assets/assetRegistry'

interface HostDashboardProps {
  roomCode?: string
  onSwitchToBankSoal?: () => void
}

export function HostDashboard({ roomCode = 'TIK26', onSwitchToBankSoal }: HostDashboardProps) {
  const session = useHostSession(roomCode)
  const [selectedPlayerId, setSelectedPlayerId] = useState<string>(session.players[0]?.id || 'p1')

  const activePlayer: Player = session.players.find(p => p.id === selectedPlayerId) || session.players[0]

  return (
    <div className="w-screen h-screen bg-slate-950 flex items-center justify-center overflow-hidden select-none font-sans">
      {/* ── 16:9 WIDESCREEN CONTAINER (Mencegah background terpotong di layar laptop) ── */}
      <div className="relative aspect-[16/9] w-full max-h-screen max-w-[calc(100vh*16/9)] flex flex-col justify-between overflow-hidden shadow-2xl bg-black">

        {/* ── 1. TOP BAR (PERSIS FOTO 2) ────────────────────────────────────────── */}
        <header className="absolute top-0 left-0 right-0 z-30 flex items-center justify-between px-4 py-2.5 bg-gradient-to-b from-slate-950/80 to-transparent pointer-events-auto">
          {/* Kiri: Ganti Avatar + PIN */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                const nextIndex = (session.players.findIndex(p => p.id === activePlayer.id) + 1) % session.players.length
                setSelectedPlayerId(session.players[nextIndex].id)
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-900/90 hover:bg-slate-800 text-slate-200 border border-slate-700 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-md"
            >
              <span>←</span>
              <span>Ganti Avatar</span>
            </button>

            <div className="bg-amber-500 text-slate-950 font-black px-4 py-1.5 rounded-xl border-2 border-amber-600 shadow-md flex items-center gap-1.5 text-xs tracking-wider">
              <span>PIN:</span>
              <span className="tracking-widest">{roomCode}</span>
            </div>
          </div>

          {/* Tengah: Mode Permainan (Engklek vs Oray-Orayan) */}
          <div className="flex items-center bg-slate-900/90 border border-slate-700/80 p-1 rounded-2xl shadow-xl backdrop-blur-md">
            <button
              onClick={() => session.setMode('engklek')}
              className={`flex items-center gap-1.5 px-4 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
                session.mode === 'engklek'
                  ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/40'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <span>🏕️</span>
              <span>Engklek</span>
            </button>
            <button
              onClick={() => session.setMode('oray-orayan')}
              className={`flex items-center gap-1.5 px-4 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
                session.mode === 'oray-orayan'
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/40'
                  : 'text-emerald-400 hover:text-emerald-300'
              }`}
            >
              <span>🐍</span>
              <span>Oray-Orayan</span>
            </button>
          </div>

          {/* Kanan: Teman Terhubung & Shortcut Bank Soal */}
          <div className="flex items-center gap-2">
            <div className="bg-slate-900/90 border border-emerald-500/40 px-3.5 py-1.5 rounded-xl text-xs font-extrabold text-emerald-400 flex items-center gap-1.5 shadow-md backdrop-blur-sm">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>{session.connectedCount} Teman</span>
            </div>

            {onSwitchToBankSoal && (
              <button
                onClick={onSwitchToBankSoal}
                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-amber-300 border border-amber-500/40 rounded-xl text-xs font-bold transition-all cursor-pointer"
              >
                📚 Bank Soal
              </button>
            )}
          </div>
        </header>

        {/* ── 2. CENTER ARENA (IMG-20261113-WA0004.jpg) ─────────────────────────── */}
        <main className="relative flex-1 w-full h-full overflow-hidden">
          <ArenaEngklek
            status={session.status}
            activePlayer={activePlayer}
            allPlayers={session.players}
            petaks={session.petaks}
            className="w-full h-full"
          />
        </main>

        {/* ── 3. BOTTOM BAR: TEMAN MASUK + MULAI PERMAINAN (PERSIS FOTO 2) ─────── */}
        <footer className="absolute bottom-0 left-0 right-0 z-30 flex items-center justify-between px-4 py-2.5 bg-slate-950/90 border-t border-slate-800/80 backdrop-blur-md">
          {/* Kiri: TEMAN MASUK List */}
          <div className="flex items-center gap-3 overflow-x-auto py-1 scrollbar-none flex-1 max-w-[75%] mr-4">
            <div className="flex items-center gap-1 text-[11px] font-black text-amber-400 uppercase tracking-wider shrink-0">
              <span>👥</span>
              <span>TEMAN MASUK:</span>
            </div>

            <div className="flex items-center gap-2">
              {session.players.map(player => {
                const char = CHARACTER_REGISTRY[player.characterId]
                const isSelected = player.id === activePlayer.id

                return (
                  <button
                    key={player.id}
                    onClick={() => setSelectedPlayerId(player.id)}
                    className={`
                      flex items-center gap-2 px-3 py-1.5 rounded-xl border transition-all cursor-pointer shrink-0
                      ${isSelected
                        ? 'bg-amber-500/20 border-amber-400 text-amber-200 shadow-md shadow-amber-900/30'
                        : 'bg-slate-900/80 border-slate-700/60 text-slate-300 hover:bg-slate-800 hover:border-slate-600'}
                    `}
                  >
                    <img
                      src={char.sprites.idle}
                      alt={player.name}
                      className="w-5 h-5 object-contain"
                      style={{ imageRendering: 'pixelated' }}
                    />
                    <span className="text-xs font-bold whitespace-nowrap">
                      {player.name} {player.role ? `(${player.role})` : ''}
                    </span>
                    <span className={`w-1.5 h-1.5 rounded-full ${player.isConnected ? 'bg-emerald-400' : 'bg-slate-600'}`} />
                  </button>
                )
              })}
            </div>
          </div>

          {/* Kanan: Tombol 3D Wood MULAI PERMAINAN */}
          <div className="shrink-0 flex items-center gap-2">
            {session.status === 'waiting' && (
              <button
                onClick={session.startSession}
                className="px-6 py-2.5 bg-amber-800 hover:bg-amber-700 active:translate-y-1 text-amber-100 font-black text-xs uppercase tracking-wider rounded-2xl border-b-4 border-amber-950 hover:border-amber-900 shadow-xl transition-all cursor-pointer flex items-center gap-2"
              >
                <span>🎮</span>
                <span>MULAI PERMAINAN (GASS!)</span>
              </button>
            )}

            {session.status === 'active' && (
              <div className="flex items-center gap-2">
                <button
                  onClick={session.pauseSession}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-amber-300 font-bold text-xs rounded-xl border border-slate-600 transition-all cursor-pointer"
                >
                  ⏸ JEDA
                </button>
                <button
                  onClick={session.endSession}
                  className="px-4 py-2 bg-rose-700 hover:bg-rose-600 text-white font-bold text-xs rounded-xl border border-rose-900 transition-all cursor-pointer"
                >
                  ⏹ SELESAI
                </button>
              </div>
            )}

            {session.status === 'paused' && (
              <button
                onClick={session.startSession}
                className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl border border-emerald-700 transition-all cursor-pointer"
              >
                ▶ LANJUTKAN
              </button>
            )}
          </div>
        </footer>
      </div>
    </div>
  )
}
