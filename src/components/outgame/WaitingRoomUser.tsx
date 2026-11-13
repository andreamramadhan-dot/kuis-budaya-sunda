import React, { useState } from 'react'
import waitingRoomBg from '../../assets/waiting-room/waiting-room-bg.png'
import { CharacterModal } from './CharacterModal'
import { LogOut } from 'lucide-react'
import type { AvatarItem, GameMode } from '../../types/game'

interface WaitingRoomUserProps {
  pin: string
  playerName: string
  avatar: AvatarItem
  mode?: GameMode
  onLeaveRoom: () => void
  onUpdateAvatar?: (avatar: AvatarItem) => void
}

export const WaitingRoomUser: React.FC<WaitingRoomUserProps> = ({
  pin,
  playerName,
  avatar,
  mode = 'oray-orayan',
  onLeaveRoom,
  onUpdateAvatar
}) => {
  const [currentAvatar, setCurrentAvatar] = useState<AvatarItem>(avatar)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const handleSelectAvatar = (newAvatar: AvatarItem) => {
    setCurrentAvatar(newAvatar)
    setIsModalOpen(false)
    onUpdateAvatar?.(newAvatar)
  }

  return (
    <div className="relative w-full min-h-screen bg-slate-950 flex items-center justify-center overflow-hidden select-none font-sans p-0 sm:p-2">
      {/* 16:9 Screen Container strictly matching original artwork aspect ratio */}
      <div className="relative w-full max-w-6xl aspect-[16/9] max-h-screen overflow-hidden shadow-2xl md:rounded-3xl border-0 md:border-4 border-amber-900/60 bg-black">
        
        {/* Full-bleed background from original artwork */}
        <img
          src={waitingRoomBg}
          alt="Waiting Room User Background"
          className="absolute inset-0 w-full h-full object-fill pointer-events-none"
        />

        {/* Top-Left Exit Button */}
        <div className="absolute top-3 left-3 sm:top-5 sm:left-5 z-30">
          <button
            type="button"
            onClick={onLeaveRoom}
            className="px-3 py-1.5 rounded-xl bg-black/40 hover:bg-black/60 text-rose-300 hover:text-rose-200 border border-rose-400/30 backdrop-blur-md text-xs font-bold shadow active:translate-y-0.5 cursor-pointer transition-all flex items-center gap-1.5"
            title="Kaluar ti Room (Keluar)"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Kaluar</span>
          </button>
        </div>

        {/*
          Top-Right Animated Status Indicator:
          Overlay directly over the static "Waiting for host..." badge with pulsing dots
        */}
        <div
          className="absolute z-20 flex items-center gap-1.5 pointer-events-none"
          style={{
            top: '2.5%',
            right: '2.5%'
          }}
        >
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
          <span className="text-xs sm:text-sm font-extrabold text-white/90 drop-shadow tracking-wider">
            Online • Room: <span className="font-mono text-amber-300 font-black">{pin}</span>
          </span>
        </div>

        {/*
          CENTER WHITE BOX CONTENT:
          Mapped exactly inside the white box from original artwork:
          left: 34.22%, top: 24.44%, width: 31.72%, height: 15.46%
        */}
        <div
          className="absolute z-20 flex flex-col items-center justify-center text-center p-2"
          style={{
            left: '34.22%',
            top: '24.44%',
            width: '31.72%',
            height: '15.46%'
          }}
        >
          {/* Sapaan Nama Siswa */}
          <h2 className="text-base sm:text-xl md:text-2xl font-black text-stone-900 tracking-tight leading-tight truncate max-w-full">
            Sampurasun, {playerName}!
          </h2>

          {/* Status Siap */}
          <div className="inline-flex items-center gap-1.5 mt-1 px-2.5 py-0.5 rounded-full bg-emerald-100 border border-emerald-600 text-emerald-800 text-[10px] sm:text-xs font-black">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Status: Parantos Siap (Ready)</span>
          </div>

          {/* Keterangan Menunggu Guru & Mode */}
          <p className="text-[9px] sm:text-[11px] text-stone-600 font-bold mt-1 tracking-tight">
            Mode: <span className="text-amber-800 font-black">{mode === 'oray-orayan' ? '🐍 Oray-Orayan' : '🧱 Engklek'}</span> • Nungguan guru ngamimitian kuis...
          </p>
        </div>

        {/*
          BOTTOM-LEFT AVATAR BUTTON HOTSPOT:
          Mapped directly over the circular button:
          left: 3.44%, top: 85.93%, width: 4.58%, height: 8.06%
        */}
        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          aria-label="Gentos Karakter (Change Character)"
          className="absolute z-20 rounded-full overflow-hidden cursor-pointer group transition-all hover:scale-110 active:scale-95 shadow-[0_0_14px_rgba(245,158,11,0.7)]"
          style={{
            left: '3.44%',
            top: '85.93%',
            width: '4.58%',
            height: '8.06%'
          }}
          title={`Karakter anjeun: ${currentAvatar.name} (${currentAvatar.code}) - Klik pikeun ngagentos!`}
        >
          <div className="w-full h-full bg-amber-200/90 flex items-center justify-center p-0.5 border-2 border-black rounded-full overflow-hidden">
            <img
              src={currentAvatar.image}
              alt={currentAvatar.name}
              className="max-h-full max-w-full object-contain filter drop-shadow group-hover:scale-115 transition-transform"
            />
          </div>
        </button>

        {/* Character Selection Modal */}
        <CharacterModal
          isOpen={isModalOpen}
          selectedAvatar={currentAvatar}
          onSelectAvatar={handleSelectAvatar}
          onClose={() => setIsModalOpen(false)}
        />

      </div>
    </div>
  )
}
