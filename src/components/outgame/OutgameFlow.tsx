import React, { useState } from 'react'
import { LandingPage } from './LandingPage'
import { AvatarSelector } from './AvatarSelector'
import { WaitingRoom } from './WaitingRoom'
import type { AvatarItem, GameMode } from '../../types/game'

export type OutgameStep = 'landing' | 'avatar' | 'waiting_room'

interface OutgameFlowProps {
  onGameReady?: (roomData: { pin: string; playerName: string; avatar: AvatarItem; mode: GameMode }) => void
}

export const OutgameFlow: React.FC<OutgameFlowProps> = ({ onGameReady }) => {
  const [step, setStep] = useState<OutgameStep>('landing')
  const [currentPin, setCurrentPin] = useState('')
  const [playerData, setPlayerData] = useState<{ name: string; avatar: AvatarItem } | null>(null)

  const handleJoinPin = (enteredPin: string) => {
    setCurrentPin(enteredPin)
    setStep('avatar')
  }

  const handleAvatarComplete = (playerName: string, avatar: AvatarItem) => {
    setPlayerData({ name: playerName, avatar })
    setStep('waiting_room')
  }

  const handleLeaveRoom = () => {
    setStep('landing')
  }

  const handleBackToLanding = () => {
    setStep('landing')
  }

  const handleStartGame = (mode: GameMode) => {
    if (!playerData) return
    onGameReady?.({
      pin: currentPin,
      playerName: playerData.name,
      avatar: playerData.avatar,
      mode
    })
  }

  if (step === 'landing') {
    return <LandingPage onJoinPin={handleJoinPin} initialPin={currentPin} />
  }

  if (step === 'avatar') {
    return (
      <AvatarSelector
        pin={currentPin}
        onComplete={handleAvatarComplete}
        onBack={handleBackToLanding}
      />
    )
  }

  if (step === 'waiting_room' && playerData) {
    return (
      <WaitingRoom
        pin={currentPin}
        currentPlayer={playerData}
        onLeaveRoom={handleLeaveRoom}
        onStartGame={handleStartGame}
      />
    )
  }

  return <LandingPage onJoinPin={handleJoinPin} />
}
