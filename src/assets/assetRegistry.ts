/**
 * Asset Registry for Kuis Budaya Sunda (Sunda Empire PWA)
 * Centralizes image and sprite paths for Host, Characters K1-K8, and UI.
 */

export type CharacterId = 'K1' | 'K2' | 'K3' | 'K4' | 'K5' | 'K6' | 'K7' | 'K8'
export type CharacterAction = 'idle' | 'jump' | 'fall' | 'throw'

export interface CharacterMeta {
  id: CharacterId
  name: string
  gender: 'male' | 'female'
  description: string
  sprites: Record<CharacterAction, string>
}

// Host arena background assets
export const HOST_ASSETS = {
  arenaEngklek: '/assets/host/IMG-20261113-WA0004.jpg',
  arenaClean: '/assets/host/IMG-20261113-WA0004.jpg',
  arenaBlueprint: '/assets/host/arena-blueprint.jpg',
} as const

// UI assets from design
export const UI_ASSETS = {
  landingBg: '/assets/ui/landing-sunda-empire.png',
  quizTemplateMale: '/assets/ui/quiz-cowo.png',
  quizTemplateFemale: '/assets/ui/quiz-cewe.png',
  logoGame: '/assets/ui/logo-game.png',
} as const

// Character metadata and sprite mapping
export const CHARACTER_REGISTRY: Record<CharacterId, CharacterMeta> = {
  K1: {
    id: 'K1',
    name: 'Asep',
    gender: 'male',
    description: 'Anak Sunda beriket pangsi biru lincah',
    sprites: {
      idle: '/assets/karakter/K1/idle.png',
      jump: '/assets/karakter/K1/jump.png',
      fall: '/assets/karakter/K1/fall.png',
      throw: '/assets/karakter/K1/throw.png',
    },
  },
  K2: {
    id: 'K2',
    name: 'Cecep',
    gender: 'male',
    description: 'Anak Sunda ceria berpeci hitam santun',
    sprites: {
      idle: '/assets/karakter/K2/idle.PNG',
      jump: '/assets/karakter/K2/jump.jpeg',
      fall: '/assets/karakter/K2/fall.jpeg',
      throw: '/assets/karakter/K2/throw.PNG',
    },
  },
  K3: {
    id: 'K3',
    name: 'Ujang',
    gender: 'male',
    description: 'Jagoan engklek beriket motif batik',
    sprites: {
      idle: '/assets/karakter/K3/idle.png',
      jump: '/assets/karakter/K3/jump.png',
      fall: '/assets/karakter/K3/fall.png',
      throw: '/assets/karakter/K3/throw.png',
    },
  },
  K4: {
    id: 'K4',
    name: 'Eneng',
    gender: 'female',
    description: 'Gadis Sunda berkebaya anggun dan teliti',
    sprites: {
      idle: '/assets/karakter/K4/idle.png',
      jump: '/assets/karakter/K4/jump.png',
      fall: '/assets/karakter/K4/fall.png',
      throw: '/assets/karakter/K4/throw.png',
    },
  },
  K5: {
    id: 'K5',
    name: 'Iteung',
    gender: 'female',
    description: 'Gadis periang bersanggul modern',
    sprites: {
      idle: '/assets/karakter/K5/idle.png',
      jump: '/assets/karakter/K5/jump.png',
      fall: '/assets/karakter/K5/fall.png',
      throw: '/assets/karakter/K5/throw.png',
    },
  },
  K6: {
    id: 'K6',
    name: 'Dadang',
    gender: 'male',
    description: 'Pemain tangguh penuh semangat',
    sprites: {
      idle: '/assets/karakter/K6/idle.png',
      jump: '/assets/karakter/K6/jump.png',
      fall: '/assets/karakter/K6/fall.png',
      throw: '/assets/karakter/K6/throw.png',
    },
  },
  K7: {
    id: 'K7',
    name: 'Neneng',
    gender: 'female',
    description: 'Anak perempuan cerdas pembaca ulung',
    sprites: {
      idle: '/assets/karakter/K7/idle.png',
      jump: '/assets/karakter/K7/jump.png',
      fall: '/assets/karakter/K7/fall.png',
      throw: '/assets/karakter/K7/throw.png',
    },
  },
  K8: {
    id: 'K8',
    name: 'Jajang',
    gender: 'male',
    description: 'Pemberani penakluk tantangan gunung',
    sprites: {
      idle: '/assets/karakter/K8/idle.png',
      jump: '/assets/karakter/K8/jump.png',
      fall: '/assets/karakter/K8/fall.png',
      throw: '/assets/karakter/K8/throw.png',
    },
  },
}

export function getCharacterSprite(id: CharacterId, action: CharacterAction = 'idle'): string {
  return CHARACTER_REGISTRY[id]?.sprites[action] || CHARACTER_REGISTRY.K1.sprites.idle
}
