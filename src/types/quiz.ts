export type QuizCategory = 'waditra' | 'basa' | 'paribasa' | 'kuliner' | 'sejarah'

export interface Question {
  id: string
  category: QuizCategory
  categoryLabel: string
  questionText: string
  options: {
    id: string
    text: string
    isCorrect: boolean
  }[]
  explanation: string
  points: number
  timeLimitSeconds: number
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
