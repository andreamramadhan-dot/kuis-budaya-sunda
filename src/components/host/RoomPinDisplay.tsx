import { QrCode } from 'lucide-react'

interface RoomPinDisplayProps {
  roomCode: string
  connectedCount: number
  totalSlots?: number
}

export function RoomPinDisplay({ roomCode, connectedCount, totalSlots = 8 }: RoomPinDisplayProps) {
  // Split PIN into two groups of 3 for readability: "ABC" "123"
  const part1 = roomCode.slice(0, 3)
  const part2 = roomCode.slice(3, 6)

  return (
    <div className="flex flex-col items-center justify-center gap-3 p-4 bg-slate-900/80 rounded-2xl border border-amber-500/30 backdrop-blur-sm">
      {/* QR code icon placeholder */}
      <div className="flex items-center gap-2 text-amber-400/60">
        <QrCode size={36} strokeWidth={1.5} />
        <div className="flex flex-col text-left">
          <span className="text-[9px] uppercase tracking-widest text-slate-500 font-bold">Room PIN</span>
          <span className="text-[9px] text-slate-500">scan / ketik kode</span>
        </div>
      </div>

      {/* Giant PIN code */}
      <div className="flex items-center gap-2">
        <div className="flex gap-1">
          {part1.split('').map((digit, i) => (
            <span
              key={i}
              className="w-10 h-12 flex items-center justify-center bg-slate-800 border-2 border-amber-500/60 rounded-xl text-2xl font-black text-amber-400 shadow-lg shadow-amber-900/40"
            >
              {digit}
            </span>
          ))}
        </div>
        <span className="text-slate-500 text-xl font-black">-</span>
        <div className="flex gap-1">
          {part2.split('').map((digit, i) => (
            <span
              key={i}
              className="w-10 h-12 flex items-center justify-center bg-slate-800 border-2 border-amber-500/60 rounded-xl text-2xl font-black text-amber-400 shadow-lg shadow-amber-900/40"
            >
              {digit}
            </span>
          ))}
        </div>
      </div>

      {/* Connected indicator */}
      <div className="flex items-center gap-1.5">
        <div className="flex gap-0.5">
          {Array.from({ length: totalSlots }).map((_, i) => (
            <div
              key={i}
              className={`w-2 h-2 rounded-full transition-all ${
                i < connectedCount
                  ? 'bg-emerald-400 shadow-sm shadow-emerald-400/50'
                  : 'bg-slate-700'
              }`}
            />
          ))}
        </div>
        <span className="text-[10px] text-slate-400 font-bold">
          {connectedCount}/{totalSlots} siswa
        </span>
      </div>
    </div>
  )
}
