export type QuizCategory = 'waditra' | 'basa' | 'paribasa' | 'kuliner' | 'sejarah' | 'dongeng'

export interface QuestionOption {
  id: string
  text: string
  isCorrect: boolean
}

export interface Question {
  id: string
  category: QuizCategory
  categoryLabel: string
  questionText: string
  options: QuestionOption[]
  explanation: string
  points: number
  timeLimitSeconds: number
  difficulty?: 'mudah' | 'sedang' | 'nanjak' | 'gunung_challenge'
}

export interface PlayerScore {
  playerName: string
  score: number
  correctCount: number
  totalQuestions: number
  timeSpentSeconds: number
  date: string
}

export type QuizStatus = 'idle' | 'playing' | 'review' | 'finished'
