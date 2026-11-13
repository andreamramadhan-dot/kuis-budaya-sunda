import { useEffect, useState, useCallback } from 'react'
import type { Player, Petak, SessionStatus, GameMode } from '../types/game'
import type { CharacterId } from '../assets/assetRegistry'
import { socketClient } from '../services/socketClient'

// Demo players for development / preview
const DEMO_PLAYERS: Player[] = [
  { id: 'p1', name: 'Rafi', characterId: 'K1', score: 320, position: 5, isReady: true,  isConnected: true,  currentAction: 'idle', ownedPetaks: [3], sawahCount: 1 },
  { id: 'p2', name: 'Sinta', characterId: 'K4', score: 280, position: 3, isReady: true,  isConnected: true,  currentAction: 'idle', ownedPetaks: [],  sawahCount: 0 },
  { id: 'p3', name: 'Deden', characterId: 'K3', score: 150, position: 1, isReady: true,  isConnected: true,  currentAction: 'idle', ownedPetaks: [],  sawahCount: 0 },
  { id: 'p4', name: 'Mia',   characterId: 'K5', score: 410, position: 7, isReady: true,  isConnected: true,  currentAction: 'jump', ownedPetaks: [6], sawahCount: 1 },
  { id: 'p5', name: 'Budi',  characterId: 'K2', score: 90,  position: 2, isReady: false, isConnected: false, currentAction: 'idle', ownedPetaks: [],  sawahCount: 0 },
]

function buildPetaks(): Petak[] {
  return Array.from({ length: 10 }, (_, i) => ({
    number: i + 1,
    owner: i === 2 ? 'p1' : i === 5 ? 'p4' : null,
    isMountain: i === 9,
    taxPoints: i === 2 ? 50 : i === 5 ? 50 : 0,
    occupants: DEMO_PLAYERS.filter(p => p.position === i + 1).map(p => p.id),
  }))
}

export interface HostSessionState {
  roomCode: string
  mode: GameMode
  status: SessionStatus
  players: Player[]
  petaks: Petak[]
  connectedCount: number
  startSession: () => void
  pauseSession: () => void
  endSession: () => void
  setMode: (m: GameMode) => void
  characterIdForPlayer: (playerId: string) => CharacterId
}

export function useHostSession(roomCode: string): HostSessionState {
  const [mode, setMode] = useState<GameMode>('engklek')
  const [status, setStatus] = useState<SessionStatus>('waiting')
  const [players, setPlayers] = useState<Player[]>(DEMO_PLAYERS)
  const [petaks] = useState<Petak[]>(buildPetaks())

  const connectedCount = players.filter(p => p.isConnected).length

  // Subscribe to socket events (Divisi 6 integration)
  useEffect(() => {
    const unsubScore = socketClient.on('SCORE_BROADCAST', data => {
      const { playerId, score } = data as { playerId: string; score: number }
      setPlayers(prev =>
        prev.map(p => (p.id === playerId ? { ...p, score } : p))
      )
    })
    return () => { unsubScore() }
  }, [])

  const startSession = useCallback(() => {
    setStatus('active')
    socketClient.emit('SESSION_START', { roomCode, mode })
  }, [roomCode, mode])

  const pauseSession = useCallback(() => {
    setStatus('paused')
    socketClient.emit('SESSION_PAUSE', { roomCode })
  }, [roomCode])

  const endSession = useCallback(() => {
    setStatus('finished')
    socketClient.emit('SESSION_END', { roomCode })
  }, [roomCode])

  const characterIdForPlayer = useCallback(
    (playerId: string): CharacterId =>
      players.find(p => p.id === playerId)?.characterId ?? 'K1',
    [players]
  )

  return {
    roomCode,
    mode,
    status,
    players,
    petaks,
    connectedCount,
    startSession,
    pauseSession,
    endSession,
    setMode,
    characterIdForPlayer,
  }
}
