export type EngklekAvatar = 'k1' | 'k2'

export type CharacterPose = 'berdiri' | 'melompat' | 'melempar' | 'jatuh'

export interface EngklekTile {
  id: number // 1 to 10
  label: string
  type: 'single' | 'double-left' | 'double-right' | 'peak' // 1: single, 2-3: double, 4: single, 5-6: double, 7: single, 8-9: double, 10: peak (gunung)
  row: number // 1 (bottom/start) to 6 (top/gunung)
  colSpan: number
  owner: 'player' | 'opponent' | null
  taxRate: number // default 30-50 pts
}

export interface PlayerStats {
  id: string
  name: string
  avatar: EngklekAvatar
  score: number
  currentTile: number // 0 = start, 1..10
  gacukTile: number // 1..10
  streak: number
  highestStreak: number
  correctAnswers: number
  totalAttempts: number
  sawahCount: number
  pose: CharacterPose
  isTurn: boolean
}

export type EngklekPhase =
  | 'idle'
  | 'ready_to_throw'
  | 'answering_quiz'
  | 'animating_action'
  | 'choose_sawah'
  | 'game_over'

export interface GameLog {
  id: string
  text: string
  type: 'info' | 'success' | 'warning' | 'tax'
  timestamp: string
}
