import { ArenaEngklek } from './ArenaEngklek'

interface HostDashboardProps {
  onSwitchToBankSoal?: () => void
}

export function HostDashboard({ onSwitchToBankSoal }: HostDashboardProps) {
  return (
    <div className="w-screen h-screen bg-slate-950 flex items-center justify-center overflow-hidden select-none font-sans">
      {/* ── 16:9 Widescreen Container (Presisi, Mencegah Latar Terpotong) ─────── */}
      <div className="relative aspect-[16/9] w-full max-h-screen max-w-[calc(100vh*16/9)] overflow-hidden shadow-2xl bg-black">

        {/* ── Arena Desa Sunda + Moveable Character ───────────────────────────── */}
        <ArenaEngklek className="w-full h-full" />

        {/* ── Navigasi Bank Soal Minimalis (Hanya tombol kecil di pojok kanan atas) ── */}
        {onSwitchToBankSoal && (
          <div className="absolute top-3 right-4 z-30">
            <button
              onClick={onSwitchToBankSoal}
              className="px-3 py-1.5 bg-slate-900/90 hover:bg-slate-800 text-amber-300 border border-amber-500/40 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-lg backdrop-blur-sm flex items-center gap-1.5"
            >
              <span>📚</span>
              <span>Bank Soal</span>
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
