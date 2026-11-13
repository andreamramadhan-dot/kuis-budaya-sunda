import type { CharacterId } from '../assets/assetRegistry'

// =====================
// PLAYER & SESSION
// =====================

export type GameMode = 'oray-orayan' | 'engklek'
export type SessionStatus = 'waiting' | 'active' | 'paused' | 'finished'
export type PlayerAction = 'idle' | 'jump' | 'fall' | 'throw'

export interface Player {
  id: string
  name: string
  characterId: CharacterId
  score: number
  position: number         // 0 = start, 1-10 = petak engklek, 10 = gunung (puncak)
  isReady: boolean
  isConnected: boolean
  currentAction: PlayerAction
  ownedPetaks: number[]    // Petak yang dikuasai (Engklek mode)
  sawahCount: number       // Jumlah sawah dimiliki
}

// =====================
// ENGKLEK PETAK
// =====================

export interface Petak {
  number: number          // 1-10
  owner: string | null    // Player id yang menguasai (null = bebas)
  isMountain: boolean     // Petak 10 = Gunung
  taxPoints: number       // Poin pajak yang harus dibayar jika diinjak
  occupants: string[]     // Player id yang sedang berdiri di petak ini
}

// =====================
// ROOM / SESSION
// =====================

export interface GameSession {
  roomCode: string         // 6 digit PIN
  mode: GameMode
  status: SessionStatus
  players: Player[]
  petaks: Petak[]          // 10 petaks engklek
  currentQuestionId: string | null
  gateTimerSeconds: number // Countdown Oray-orayan gate (0–60)
  createdAt: string
}

// =====================
// GAMEBRIGE EVENTS
// =====================

export type GameBridgeEventName =
  | 'GAME_TRIGGER_QUIZ'
  | 'GATE_ALERT_START'
  | 'PLAYER_REACHED_MOUNTAIN'
  | 'QUIZ_RESULT_SUCCESS'
  | 'QUIZ_RESULT_FAIL'
  | 'SESSION_STATUS_CHANGED'

export interface GameBridgeEvent {
  event: GameBridgeEventName
  payload: Record<string, unknown>
}
