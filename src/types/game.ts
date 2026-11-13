export type GameMode = 'oray-orayan' | 'engklek'

export interface AvatarItem {
  id: string
  code: string
  name: string
  gender: 'putra' | 'putri'
  image: string
  description: string
}

export interface PlayerProfile {
  name: string
  avatarId: string
  isReady: boolean
  isHost?: boolean
}

export interface GameRoom {
  pin: string
  mode: GameMode
  hostName: string
  players: PlayerProfile[]
  status: 'waiting' | 'in_game' | 'finished'
  createdAt: number
}
