import { useEffect, useState, useCallback } from 'react'
import type { Player, Petak, SessionStatus, GameMode } from '../types/game'
import type { CharacterId } from '../assets/assetRegistry'
import { socketClient } from '../services/socketClient'

// Demo players matching the official project design (Foto 2)
const DEMO_PLAYERS: Player[] = [
  { id: 'p1', name: 'Haikal',  role: 'Pemain Utama', characterId: 'K1', score: 320, position: 0, isReady: true, isConnected: true, currentAction: 'idle', ownedPetaks: [], sawahCount: 0, dialogText: '✨ Siap gass kuis, Pa Dik Dik!' },
  { id: 'p2', name: 'Khalid',  role: 'Ketua',        characterId: 'K3', score: 280, position: 0, isReady: true, isConnected: true, currentAction: 'idle', ownedPetaks: [], sawahCount: 0, dialogText: '🔥 Hayu urang rampungkeun kuisna!' },
  { id: 'p3', name: 'Bintang', role: 'Frontend',     characterId: 'K2', score: 250, position: 0, isReady: true, isConnected: true, currentAction: 'idle', ownedPetaks: [], sawahCount: 0, dialogText: '💻 UI tos rapih pisan!' },
  { id: 'p4', name: 'Intan',   role: 'UI/UX',        characterId: 'K4', score: 310, position: 0, isReady: true, isConnected: true, currentAction: 'idle', ownedPetaks: [], sawahCount: 0, dialogText: '🎨 Desain Sunda Empire mantap!' },
  { id: 'p5', name: 'Luna',    role: 'Design',       characterId: 'K5', score: 290, position: 0, isReady: true, isConnected: true, currentAction: 'idle', ownedPetaks: [], sawahCount: 0, dialogText: '🌾 Arena desa Sunda siap!' },
  { id: 'p6', name: 'Rizky',   role: 'Backend',      characterId: 'K6', score: 270, position: 0, isReady: true, isConnected: true, currentAction: 'idle', ownedPetaks: [], sawahCount: 0, dialogText: '⚡ Socket server lancar jaya!' },
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
