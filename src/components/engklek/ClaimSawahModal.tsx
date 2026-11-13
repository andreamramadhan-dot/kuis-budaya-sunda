import React from 'react'
import type { EngklekTile } from '../../types/engklek'
import { CheckCircle2, Sparkles } from 'lucide-react'

interface ClaimSawahModalProps {
  isOpen: boolean
  availableTiles: EngklekTile[]
  onClaimTile: (tileId: number) => void
}

export const ClaimSawahModal: React.FC<ClaimSawahModalProps> = ({
  isOpen,
  availableTiles,
  onClaimTile,
}) => {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
      <div className="w-full max-w-lg rounded-3xl bg-gradient-to-b from-stone-900 via-amber-950 to-stone-900 border-4 border-yellow-400 p-6 md:p-8 shadow-2xl text-center relative overflow-hidden ring-4 ring-yellow-400/30">
        <div className="inline-flex p-3 rounded-full bg-yellow-400/20 text-yellow-300 border border-yellow-400/50 mb-3 animate-bounce">
          <Sparkles className="w-8 h-8" />
        </div>

        <h2 className="text-xl md:text-2xl font-black text-amber-200 uppercase tracking-wide">
          ⛰️ Wilujeng! Puncak Gunung Ditaklukeun!
        </h2>
        <p className="text-xs md:text-sm text-stone-300 mt-2 leading-relaxed">
          Anjeun parantos ngajawab Soal Tantangan kalayan bener. Ayeuna pilih{' '}
          <span className="font-bold text-yellow-300">1 petak di papan</span> pikeun dijadikeun{' '}
          <span className="font-bold text-emerald-400">Sawah / Rumah Anjeun</span>.
        </p>

        {/* Grid Pilihan Petak */}
        <div className="mt-5 grid grid-cols-3 sm:grid-cols-4 gap-2.5">
          {availableTiles.length === 0 ? (
            <div className="col-span-full py-4 text-xs text-amber-400 italic">
              Sadaya petak parantos aya nu ngagaduhan!
            </div>
          ) : (
            availableTiles.map((tile) => (
              <button
                key={tile.id}
                onClick={() => onClaimTile(tile.id)}
                className="group p-3 rounded-xl bg-amber-900/40 hover:bg-emerald-600 border-2 border-amber-500/60 hover:border-emerald-300 transition-all duration-200 cursor-pointer flex flex-col items-center justify-center shadow-md hover:scale-105"
              >
                <span className="text-xl font-black text-amber-100 group-hover:text-white">
                  Petak {tile.id}
                </span>
                <span className="text-[10px] text-amber-300/80 group-hover:text-emerald-100 mt-1 flex items-center gap-1 font-bold">
                  <CheckCircle2 className="w-3 h-3" /> Klaim
                </span>
              </button>
            ))
          )}
        </div>

        <div className="mt-6 pt-4 border-t border-amber-800/60 text-[11px] text-amber-300/70">
          💡 <span className="font-semibold">Manfaat:</span> Lawan anu nginjak sawah anjeun bakal mayar{' '}
          <span className="text-emerald-400 font-bold">+50 Poin Pajak</span> ka anjeun!
        </div>
      </div>
    </div>
  )
}
