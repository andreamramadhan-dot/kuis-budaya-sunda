import React, { useState } from 'react'
import { LandingPage } from './LandingPage'
import { PlayerNameInput } from './PlayerNameInput'
import { WaitingRoomUser } from './WaitingRoomUser'
import { AVATARS_DATA } from '../../data/avatars'
import type { AvatarItem, GameMode } from '../../types/game'

export type OutgameStep = 'landing' | 'name_input' | 'waiting'

interface OutgameFlowProps {
  onGameReady?: (roomData: { pin: string; playerName: string; avatar: AvatarItem; mode: GameMode }) => void
}

export const OutgameFlow: React.FC<OutgameFlowProps> = ({ onGameReady: _onGameReady }) => {
  const [step, setStep] = useState<OutgameStep>('landing')
  const [currentPin, setCurrentPin] = useState('')
  const [playerData, setPlayerData] = useState<{ name: string; avatar: AvatarItem }>({
    name: '',
    avatar: AVATARS_DATA[0]
  })

  // 1. PIN submitted from Sunda Empire landing
  const handleJoinPin = (enteredPin: string) => {
    setCurrentPin(enteredPin)
    setStep('name_input')
  }

  // 2. Name & Avatar submitted from Enter your name screen
  const handleNameEntered = (playerName: string, avatar: AvatarItem) => {
    setPlayerData({ name: playerName, avatar })
    setStep('waiting')
  }

  // 3. User leaves waiting room back to landing
  const handleLeaveRoom = () => {
    setStep('landing')
  }

  // 4. Back to PIN input
  const handleBackToPin = () => {
    setStep('landing')
  }

  // 5. Update avatar dynamically while in waiting room
  const handleUpdateAvatar = (newAvatar: AvatarItem) => {
    setPlayerData((prev) => ({ ...prev, avatar: newAvatar }))
  }

  if (step === 'landing') {
    return <LandingPage onJoinPin={handleJoinPin} initialPin={currentPin} />
  }

  if (step === 'name_input') {
    return (
      <PlayerNameInput
        pin={currentPin}
        initialAvatar={playerData.avatar}
        onEnter={handleNameEntered}
        onBackToPin={handleBackToPin}
      />
    )
  }

  if (step === 'waiting') {
    return (
      <WaitingRoomUser
        pin={currentPin}
        playerName={playerData.name}
        avatar={playerData.avatar}
        onLeaveRoom={handleLeaveRoom}
        onUpdateAvatar={handleUpdateAvatar}
      />
    )
  }

  return <LandingPage onJoinPin={handleJoinPin} />
}
