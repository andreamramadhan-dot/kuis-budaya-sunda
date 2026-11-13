import React from 'react'
import type { EngklekTile, PlayerStats } from '../../types/engklek'

interface EngklekBoardProps {
  tiles: EngklekTile[]
  player: PlayerStats
  opponent: PlayerStats
  selectedTileForSawah: number | null
  isChoosingSawah: boolean
  onSelectTileForSawah?: (tileId: number) => void
}

export const EngklekBoard: React.FC<EngklekBoardProps> = ({
  tiles,
  player,
  opponent,
  selectedTileForSawah,
  isChoosingSawah,
  onSelectTileForSawah,
}) => {
  // Susun baris petak dari atas (Puncak Gunung / 10) ke bawah (Petak 1)
  // Row 6: [ 10 (Puncak/Gunung) ]
  // Row 5: [ 8 ] [ 9 ]
  // Row 4: [ 7 ]
  // Row 3: [ 5 ] [ 6 ]
  // Row 2: [ 4 ]
  // Row 1: [ 2 ] [ 3 ]
  // Row 0: [ 1 ]

  const getTile = (id: number) => tiles.find((t) => t.id === id)

  const renderTileBox = (id: number, customClass = '') => {
    const tile = getTile(id)
    if (!tile) return null

    const hasPlayer = player.currentTile === id
    const hasOpponent = opponent.currentTile === id
    const hasPlayerGacuk = player.gacukTile === id
    const hasOpponentGacuk = opponent.gacukTile === id
    const isSelected = selectedTileForSawah === id
    const canClaim = isChoosingSawah && tile.owner === null

    // Pemilik sawah
    const isPlayerSawah = tile.owner === 'player'
    const isOpponentSawah = tile.owner === 'opponent'

    return (
      <div
        key={id}
        onClick={() => {
          if (canClaim && onSelectTileForSawah) {
            onSelectTileForSawah(id)
          }
        }}
        className={`relative flex flex-col items-center justify-center transition-all duration-300 select-none
          border-4 rounded-xl font-bold shadow-md
          ${id === 10 ? 'h-24 rounded-t-full bg-amber-950/40 border-amber-400/80' : 'h-20 bg-amber-900/30 border-amber-200/60'}
          ${isPlayerSawah ? '!bg-emerald-900/60 !border-emerald-400 ring-2 ring-emerald-400/50' : ''}
          ${isOpponentSawah ? '!bg-rose-900/60 !border-rose-400 ring-2 ring-rose-400/50' : ''}
          ${canClaim ? 'cursor-pointer hover:scale-105 hover:border-yellow-300 ring-4 ring-yellow-400 animate-pulse bg-yellow-900/40' : ''}
          ${isSelected ? '!border-yellow-300 !bg-yellow-800/80 ring-4 ring-yellow-300' : ''}
          ${customClass}
        `}
      >
        {/* Nomor Petak Kapur */}
        <span
          className={`text-2xl md:text-3xl font-black drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]
            ${id === 10 ? 'text-amber-300' : 'text-amber-100'}
            ${isPlayerSawah ? 'text-emerald-200' : ''}
            ${isOpponentSawah ? 'text-rose-200' : ''}
          `}
        >
          {id === 10 ? '⛰️ 10' : id}
        </span>

        {/* Label Khusus Petak Puncak */}
        {id === 10 && (
          <span className="text-[10px] md:text-xs uppercase tracking-wider text-amber-300 font-extrabold bg-amber-950/80 px-2 py-0.5 rounded-full border border-amber-500/50 mt-1">
            Gunung Puncak
          </span>
        )}

        {/* Badge Pemilik Sawah */}
        {isPlayerSawah && (
          <div className="absolute -top-3 bg-emerald-600 text-white text-[10px] font-extrabold px-2 py-0.5 rounded-full shadow-lg border border-emerald-300 flex items-center gap-1 animate-bounce">
            🌾 Sawah {player.name}
          </div>
        )}
        {isOpponentSawah && (
          <div className="absolute -top-3 bg-rose-600 text-white text-[10px] font-extrabold px-2 py-0.5 rounded-full shadow-lg border border-rose-300 flex items-center gap-1">
            🌾 Sawah {opponent.name}
          </div>
        )}

        {/* Gacuk (Batu Pecahan Genteng) */}
        <div className="absolute bottom-1 flex gap-1 z-10">
          {hasPlayerGacuk && (
            <div
              title={`Gacuk ${player.name}`}
              className="w-5 h-5 md:w-6 md:h-6 rounded-md bg-amber-600 border-2 border-amber-200 shadow-md flex items-center justify-center text-[10px] font-black text-white transform -rotate-12 hover:scale-110 transition-transform"
            >
              🧱
            </div>
          )}
          {hasOpponentGacuk && (
            <div
              title={`Gacuk ${opponent.name}`}
              className="w-5 h-5 md:w-6 md:h-6 rounded-md bg-red-700 border-2 border-red-300 shadow-md flex items-center justify-center text-[10px] font-black text-white transform rotate-12 hover:scale-110 transition-transform"
            >
              🪨
            </div>
          )}
        </div>

        {/* Pion / Karakter Pemain */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20">
          {hasPlayer && (
            <div className="flex flex-col items-center transform -translate-y-2 transition-all duration-300">
              <img
                src={`/assets/characters/${player.avatar}/${player.pose}.png`}
                alt={player.name}
                className={`h-16 md:h-20 object-contain drop-shadow-[0_4px_8px_rgba(0,0,0,0.7)]
                  ${player.pose === 'melompat' ? 'animate-bounce' : ''}
                  ${player.pose === 'jatuh' ? 'rotate-45 brightness-75' : ''}
                `}
                onError={(e) => {
                  // Fallback emoji bila gambar belum siap
                  ;(e.target as HTMLElement).style.display = 'none'
                }}
              />
              <span className="text-[10px] font-bold bg-amber-950/90 text-amber-200 px-1.5 py-0.5 rounded border border-amber-400 shadow">
                {player.name}
              </span>
            </div>
          )}

          {hasOpponent && (
            <div className="flex flex-col items-center transform -translate-y-2 translate-x-4 transition-all duration-300">
              <img
                src={`/assets/characters/${opponent.avatar}/${opponent.pose}.png`}
                alt={opponent.name}
                className={`h-14 md:h-16 object-contain opacity-90 drop-shadow-[0_4px_8px_rgba(0,0,0,0.7)]
                  ${opponent.pose === 'melompat' ? 'animate-bounce' : ''}
                  ${opponent.pose === 'jatuh' ? '-rotate-45 brightness-75' : ''}
                `}
                onError={(e) => {
                  ;(e.target as HTMLElement).style.display = 'none'
                }}
              />
              <span className="text-[10px] font-bold bg-rose-950/90 text-rose-200 px-1.5 py-0.5 rounded border border-rose-400 shadow">
                {opponent.name}
              </span>
            </div>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="relative w-full max-w-md mx-auto p-4 md:p-6 rounded-2xl bg-gradient-to-b from-stone-900 via-amber-950/60 to-stone-900 border-2 border-amber-800/60 shadow-2xl overflow-hidden backdrop-blur-sm">
      {/* Tekstur Lapangan Tanah & Hiasan Rumput */}
      <div className="absolute inset-0 bg-[radial-gradient(#78350f_1px,transparent_1px)] [background-size:16px_16px] opacity-30 pointer-events-none" />

      {/* Header Info Papan */}
      <div className="flex justify-between items-center mb-3 text-xs text-amber-200/80 font-medium px-1">
        <span>📍 Pola Gunung Tradisional</span>
        <span className="flex items-center gap-2">
          <span className="inline-block w-2.5 h-2.5 rounded-full bg-emerald-400"></span>
          Sawah: Poin Pajak Otomatis
        </span>
      </div>

      {/* Susunan Petak Engklek */}
      <div className="flex flex-col gap-2 relative z-10">
        {/* Row 6: Petak 10 (Gunung / Puncak) */}
        <div className="w-full">{renderTileBox(10)}</div>

        {/* Row 5: Petak 8 & 9 (Ganda Atas) */}
        <div className="grid grid-cols-2 gap-2">
          {renderTileBox(8)}
          {renderTileBox(9)}
        </div>

        {/* Row 4: Petak 7 (Tunggal Leher) */}
        <div className="w-1/2 mx-auto">{renderTileBox(7)}</div>

        {/* Row 3: Petak 5 & 6 (Ganda Tengah) */}
        <div className="grid grid-cols-2 gap-2">
          {renderTileBox(5)}
          {renderTileBox(6)}
        </div>

        {/* Row 2: Petak 4 (Tunggal Tengah) */}
        <div className="w-1/2 mx-auto">{renderTileBox(4)}</div>

        {/* Row 1: Petak 2 & 3 (Ganda Bawah) */}
        <div className="grid grid-cols-2 gap-2">
          {renderTileBox(2)}
          {renderTileBox(3)}
        </div>

        {/* Row 0: Petak 1 (Tunggal Awal) */}
        <div className="w-1/2 mx-auto">{renderTileBox(1)}</div>

        {/* Garis Awal / Start Zone */}
        <div className="mt-2 pt-3 border-t-2 border-dashed border-amber-700/60 flex items-center justify-between text-xs font-bold text-amber-300/80 px-2">
          <span>🏁 Garis Awal (Start)</span>
          <div className="flex gap-2 text-[11px]">
            {player.currentTile === 0 && <span className="text-emerald-400">Kamu di Start</span>}
            {opponent.currentTile === 0 && <span className="text-rose-400">Lawan di Start</span>}
          </div>
        </div>
      </div>
    </div>
  )
}
