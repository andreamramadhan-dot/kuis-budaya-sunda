import { useState, useCallback, useMemo } from 'react'
import type { Question, QuizCategory } from '../types/quiz'
import { defaultQuestions } from '../data/defaultQuestions'

function generateId(): string {
  return `q-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`
}

function emptyQuestion(): Question {
  return {
    id: generateId(),
    category: 'waditra',
    categoryLabel: 'Waditra',
    questionText: '',
    options: [
      { id: 'a', text: '', isCorrect: true  },
      { id: 'b', text: '', isCorrect: false },
      { id: 'c', text: '', isCorrect: false },
      { id: 'd', text: '', isCorrect: false },
    ],
    explanation: '',
    points: 100,
    timeLimitSeconds: 20,
  }
}

export interface BankSoalState {
  questions: Question[]
  filteredQuestions: Question[]
  filterCategory: QuizCategory | 'all'
  searchQuery: string
  selectedQuestion: Question | null
  isEditing: boolean
  draftQuestion: Question

  setFilterCategory: (c: QuizCategory | 'all') => void
  setSearchQuery: (q: string) => void
  selectQuestion: (q: Question) => void
  startNew: () => void
  cancelEdit: () => void
  updateDraft: (patch: Partial<Question>) => void
  updateDraftOption: (optionId: string, patch: { text?: string; isCorrect?: boolean }) => void
  saveQuestion: () => void
  deleteQuestion: (id: string) => void
  exportJSON: () => void
  importJSON: (file: File) => void
  totalByCategory: Record<QuizCategory | 'all', number>
}

export function useBankSoal(): BankSoalState {
  const [questions, setQuestions] = useState<Question[]>(defaultQuestions)
  const [filterCategory, setFilterCategory] = useState<QuizCategory | 'all'>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedQuestion, setSelectedQuestion] = useState<Question | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [draftQuestion, setDraftQuestion] = useState<Question>(emptyQuestion())

  const filteredQuestions = useMemo(() => {
    return questions.filter(q => {
      const matchCat = filterCategory === 'all' || q.category === filterCategory
      const matchSearch = searchQuery === '' ||
        q.questionText.toLowerCase().includes(searchQuery.toLowerCase()) ||
        q.categoryLabel.toLowerCase().includes(searchQuery.toLowerCase())
      return matchCat && matchSearch
    })
  }, [questions, filterCategory, searchQuery])

  const totalByCategory = useMemo(() => {
    const counts: Record<string, number> = { all: questions.length }
    for (const q of questions) {
      counts[q.category] = (counts[q.category] ?? 0) + 1
    }
    return counts as Record<QuizCategory | 'all', number>
  }, [questions])

  const selectQuestion = useCallback((q: Question) => {
    setSelectedQuestion(q)
    setDraftQuestion({ ...q, options: q.options.map(o => ({ ...o })) })
    setIsEditing(true)
  }, [])

  const startNew = useCallback(() => {
    const blank = emptyQuestion()
    setSelectedQuestion(null)
    setDraftQuestion(blank)
    setIsEditing(true)
  }, [])

  const cancelEdit = useCallback(() => {
    setIsEditing(false)
    setSelectedQuestion(null)
  }, [])

  const updateDraft = useCallback((patch: Partial<Question>) => {
    setDraftQuestion(prev => ({ ...prev, ...patch }))
  }, [])

  const updateDraftOption = useCallback((optionId: string, patch: { text?: string; isCorrect?: boolean }) => {
    setDraftQuestion(prev => ({
      ...prev,
      options: prev.options.map(o => {
        if (o.id !== optionId) {
          // If marking a new answer correct, unset others
          if (patch.isCorrect) return { ...o, isCorrect: false }
          return o
        }
        return { ...o, ...patch }
      }),
    }))
  }, [])

  const saveQuestion = useCallback(() => {
    setQuestions(prev => {
      const idx = prev.findIndex(q => q.id === draftQuestion.id)
      if (idx >= 0) {
        const copy = [...prev]
        copy[idx] = draftQuestion
        return copy
      }
      return [...prev, draftQuestion]
    })
    setIsEditing(false)
    setSelectedQuestion(null)
  }, [draftQuestion])

  const deleteQuestion = useCallback((id: string) => {
    setQuestions(prev => prev.filter(q => q.id !== id))
    if (selectedQuestion?.id === id) {
      setIsEditing(false)
      setSelectedQuestion(null)
    }
  }, [selectedQuestion])

  const exportJSON = useCallback(() => {
    const blob = new Blob([JSON.stringify(questions, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `bank-soal-sunda-${new Date().toISOString().slice(0, 10)}.json`
    a.click()
    URL.revokeObjectURL(url)
  }, [questions])

  const importJSON = useCallback((file: File) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const parsed = JSON.parse(e.target?.result as string) as Question[]
        if (Array.isArray(parsed)) {
          setQuestions(parsed)
        }
      } catch {
        alert('File JSON tidak valid.')
      }
    }
    reader.readAsText(file)
  }, [])

  return {
    questions,
    filteredQuestions,
    filterCategory,
    searchQuery,
    selectedQuestion,
    isEditing,
    draftQuestion,
    setFilterCategory,
    setSearchQuery,
    selectQuestion,
    startNew,
    cancelEdit,
    updateDraft,
    updateDraftOption,
    saveQuestion,
    deleteQuestion,
    exportJSON,
    importJSON,
    totalByCategory,
  }
}
