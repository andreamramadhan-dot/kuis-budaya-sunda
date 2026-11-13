import type { Player, Petak, SessionStatus } from '../../types/game'
import { getCharacterSprite, HOST_ASSETS } from '../../assets/assetRegistry'

interface ArenaEngklekProps {
  status: SessionStatus
  activePlayer: Player
  allPlayers: Player[]
  petaks: Petak[]
  className?: string
}

// Koordinat petak 1-10 yang SESUAI DENGAN GAMBAR TANAH DI BAWAH KANAN (IMG-20261113-WA0005.jpg)
// Kotak 1 di sebelah kiri garis tanah, mengarah ke puncak kotak 10 (Gunung) di kanan
const REAL_PETAK_COORDS: Record<number, { left: string; top: string }> = {
  1:  { left: '44%', top: '82%' },
  2:  { left: '50%', top: '78%' },
  3:  { left: '50%', top: '86%' },
  4:  { left: '56%', top: '82%' },
  5:  { left: '62%', top: '78%' },
  6:  { left: '62%', top: '86%' },
  7:  { left: '68%', top: '82%' },
  8:  { left: '74%', top: '78%' },
  9:  { left: '74%', top: '86%' },
  10: { left: '80%', top: '82%' }, // Puncak / Gunung
}

export function ArenaEngklek({ status, activePlayer, allPlayers, className = '' }: ArenaEngklekProps) {
  const isLobby = status === 'waiting'
  const activeSprite = getCharacterSprite(activePlayer.characterId, activePlayer.currentAction)

  return (
    <div className={`relative w-full h-full overflow-hidden select-none ${className}`}>
      {/* Background Arena Desa Sunda Pixel-Art */}
      <img
        src={HOST_ASSETS.arenaEngklek}
        alt="Arena Engklek Sunda Empire"
        className="w-full h-full object-cover object-center pointer-events-none"
        draggable={false}
      />

      {/* Ambient Clouds Animasi (Parallax Pelan) */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div
          className="absolute top-8 w-28 h-10 bg-white/25 rounded-full blur-md"
          style={{ animation: 'cloudDrift 22s linear infinite', left: '-15%' }}
        />
        <div
          className="absolute top-16 w-20 h-7 bg-white/20 rounded-full blur-sm"
          style={{ animation: 'cloudDrift 30s linear infinite 10s', left: '-15%' }}
        />
      </div>

      {/* ── FASE 1: LOBBY VIEW (SESUAI PERSIS FOTO 2) ────────────────────────── */}
      {isLobby && (
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none pt-12">
          {/* Balon Dialog / Speech Bubble */}
          <div className="relative mb-3 animate-bounce" style={{ animationDuration: '3s' }}>
            <div className="bg-white/95 text-slate-900 px-4 py-2 rounded-2xl shadow-xl border border-amber-300 font-bold text-xs tracking-wide flex items-center gap-1.5 backdrop-blur-sm">
              <span>{activePlayer.dialogText || '✨ Siap gass kuis, Pa Dik Dik!'}</span>
            </div>
            {/* Ekor Balon Dialog */}
            <div className="w-0 h-0 border-x-6 border-x-transparent border-t-8 border-t-white/95 mx-auto -mt-0.5" />
          </div>

          {/* Karakter Utama Tengah (Besar, Bersih, Transparan PNG tanpa background) */}
          <div className="relative flex items-center justify-center group pointer-events-auto">
            <img
              src={activeSprite}
              alt={activePlayer.name}
              className="h-44 md:h-52 object-contain drop-shadow-[0_12px_16px_rgba(0,0,0,0.6)] transition-transform duration-200 hover:scale-105"
              style={{ imageRendering: 'pixelated' }}
            />
          </div>

          {/* Name Tag & Status Pill (Persis Desain Foto 2) */}
          <div className="mt-2 flex flex-col items-center">
            <div className="bg-slate-950/90 border-2 border-amber-500/80 px-4 py-1.5 rounded-full shadow-lg text-center backdrop-blur-sm">
              <span className="text-amber-300 font-extrabold text-xs block leading-tight">
                {activePlayer.name} ({activePlayer.characterId})
              </span>
              <span className="text-[10px] text-emerald-400 font-black tracking-wider flex items-center justify-center gap-1 mt-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping inline-block" />
                STATUS: SIAP MAIN
              </span>
            </div>
          </div>
        </div>
      )}

      {/* ── FASE 2: IN-GAME ACTIVE VIEW ────────────────────────────────────── */}
      {!isLobby && (
        <>
          {/* Pemain yang sedang bergiliran di papan engklek */}
          {allPlayers.map(p => {
            if (p.position <= 0) return null
            const coord = REAL_PETAK_COORDS[p.position]
            if (!coord) return null

            const sprite = getCharacterSprite(p.characterId, p.currentAction)
            return (
              <div
                key={p.id}
                className="absolute flex flex-col items-center transition-all duration-500 ease-out z-20"
                style={{
                  left: coord.left,
                  top: coord.top,
                  transform: 'translate(-50%, -85%)',
                }}
              >
                {/* Speech / Action indicator */}
                <span className="text-[9px] bg-slate-950/90 text-amber-300 font-black px-2 py-0.5 rounded-full border border-amber-500/60 shadow-md mb-1 whitespace-nowrap">
                  {p.name} · {p.position === 10 ? '⛰️ Gunung' : `Kotak ${p.position}`}
                </span>

                {/* Character sprite (Clean PNG) */}
                <img
                  src={sprite}
                  alt={p.name}
                  className="h-16 md:h-20 object-contain drop-shadow-[0_8px_10px_rgba(0,0,0,0.7)]"
                  style={{ imageRendering: 'pixelated' }}
                />
              </div>
            )
          })}

          {/* Highlight Gunung jika ada pemain di puncak */}
          <div className="absolute top-[75%] left-[80%] -translate-x-1/2 pointer-events-none">
            <span className="text-[10px] font-black text-amber-300 uppercase tracking-widest bg-slate-950/70 px-2 py-0.5 rounded border border-amber-500/40">
              Gunung
            </span>
          </div>
        </>
      )}
    </div>
  )
}
