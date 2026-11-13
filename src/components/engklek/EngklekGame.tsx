import React, { useCallback, useEffect, useState } from 'react'
import type { EngklekAvatar, EngklekPhase, EngklekTile, GameLog, PlayerStats } from '../../types/engklek'
import type { Question } from '../../types/quiz'
import { ENGKLEK_QUESTIONS } from '../../data/engklekQuestions'
import { useSoundEffects } from '../../hooks/useSoundEffects'
import { gameBridge } from '../../services/gameBridge'
import { EngklekBoard } from './EngklekBoard'
import { EngklekHUD } from './EngklekHUD'
import { EngklekQuizModal } from './EngklekQuizModal'
import { ClaimSawahModal } from './ClaimSawahModal'
import { EngklekPodium } from './EngklekPodium'
import { Play, Sparkles, UserCheck } from 'lucide-react'

// Susunan awal 10 Petak Engklek
const INITIAL_TILES: EngklekTile[] = [
  { id: 1, label: '1', type: 'single', row: 1, colSpan: 1, owner: null, taxRate: 40 },
  { id: 2, label: '2', type: 'double-left', row: 2, colSpan: 1, owner: null, taxRate: 40 },
  { id: 3, label: '3', type: 'double-right', row: 2, colSpan: 1, owner: null, taxRate: 40 },
  { id: 4, label: '4', type: 'single', row: 3, colSpan: 1, owner: null, taxRate: 50 },
  { id: 5, label: '5', type: 'double-left', row: 4, colSpan: 1, owner: null, taxRate: 50 },
  { id: 6, label: '6', type: 'double-right', row: 4, colSpan: 1, owner: null, taxRate: 50 },
  { id: 7, label: '7', type: 'single', row: 5, colSpan: 1, owner: null, taxRate: 60 },
  { id: 8, label: '8', type: 'double-left', row: 6, colSpan: 1, owner: null, taxRate: 60 },
  { id: 9, label: '9', type: 'double-right', row: 6, colSpan: 1, owner: null, taxRate: 60 },
  { id: 10, label: '10', type: 'peak', row: 7, colSpan: 2, owner: null, taxRate: 100 },
]

export const EngklekGame: React.FC = () => {
  // Sound FX
  const sound = useSoundEffects()

  // State Pemain & Lawan
  const [hasStarted, setHasStarted] = useState(false)
  const [playerNameInput, setPlayerNameInput] = useState('Ujang')
  const [selectedAvatar, setSelectedAvatar] = useState<EngklekAvatar>('k1')

  const [player, setPlayer] = useState<PlayerStats>({
    id: 'p1',
    name: 'Ujang',
    avatar: 'k1',
    score: 0,
    currentTile: 0, // 0 = start
    gacukTile: 1,
    streak: 0,
    highestStreak: 0,
    correctAnswers: 0,
    totalAttempts: 0,
    sawahCount: 0,
    pose: 'berdiri',
    isTurn: true,
  })

  const [opponent, setOpponent] = useState<PlayerStats>({
    id: 'bot',
    name: 'Cecep (Bot)',
    avatar: 'k2',
    score: 0,
    currentTile: 0,
    gacukTile: 1,
    streak: 0,
    highestStreak: 0,
    correctAnswers: 0,
    totalAttempts: 0,
    sawahCount: 0,
    pose: 'berdiri',
    isTurn: false,
  })

  // State Permainan
  const [tiles, setTiles] = useState<EngklekTile[]>(INITIAL_TILES)
  const [phase, setPhase] = useState<EngklekPhase>('idle')
  const [currentQuestion, setCurrentQuestion] = useState<Question>(ENGKLEK_QUESTIONS[0])
  const [isQuizModalOpen, setIsQuizModalOpen] = useState(false)
  const [isGunungChallenge, setIsGunungChallenge] = useState(false)
  const [isClaimSawahOpen, setIsClaimSawahOpen] = useState(false)
  const [logs, setLogs] = useState<GameLog[]>([])
  const [questionIndex, setQuestionIndex] = useState(0)

  // Tambah Log Notifikasi
  const addLog = useCallback((text: string, type: GameLog['type'] = 'info') => {
    const newLog: GameLog = {
      id: Math.random().toString(),
      text,
      type,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
    }
    setLogs((prev) => [newLog, ...prev.slice(0, 9)])
  }, [])

  // Keyboard shortcut Spacebar untuk memicu kuis
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space' && hasStarted && player.isTurn && !isQuizModalOpen && !isClaimSawahOpen && phase !== 'game_over') {
        e.preventDefault()
        handleTriggerQuiz()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [hasStarted, player.isTurn, isQuizModalOpen, isClaimSawahOpen, phase])

  // Mulai Permainan
  const handleStartGame = () => {
    setPlayer((prev) => ({
      ...prev,
      name: playerNameInput.trim() || 'Ujang',
      avatar: selectedAvatar,
      currentTile: 0,
      gacukTile: 1,
      score: 0,
    }))
    setOpponent((prev) => ({
      ...prev,
      avatar: selectedAvatar === 'k1' ? 'k2' : 'k1',
      name: selectedAvatar === 'k1' ? 'Ijem (Bot)' : 'Ujang (Bot)',
      currentTile: 0,
      gacukTile: 1,
      score: 0,
    }))
    setTiles(INITIAL_TILES)
    setHasStarted(true)
    setPhase('ready_to_throw')
    addLog('Permainan Engklek dimimiti! Giliran anjeun ngalungkeun gacuk.', 'info')
  }

  // Buka Soal Kuis
  const handleTriggerQuiz = () => {
    // Cek apakah pemain sedang di petak 9 dan akan melompat ke petak 10 (Gunung)
    const isTargetGunung = player.gacukTile >= 9 || player.currentTile >= 9
    setIsGunungChallenge(isTargetGunung)

    sound.playThrow()
    setPlayer((prev) => ({ ...prev, pose: 'melempar' }))
    gameBridge.emit('ENGKLEK_GACUK_THROWN', { player: player.name, tile: player.gacukTile })

    // Pilih pertanyaan berikutnya
    const questionPool = isTargetGunung
      ? ENGKLEK_QUESTIONS.filter((q) => q.difficulty === 'gunung_challenge')
      : ENGKLEK_QUESTIONS.filter((q) => q.difficulty !== 'gunung_challenge')

    const nextQ = questionPool[questionIndex % questionPool.length] || ENGKLEK_QUESTIONS[0]
    setCurrentQuestion(nextQ)
    setQuestionIndex((prev) => prev + 1)

    setTimeout(() => {
      setIsQuizModalOpen(true)
      setPhase('answering_quiz')
    }, 400)
  }

  // Handle Jawaban Kuis dari Pemain
  const handleAnswerQuiz = (isCorrect: boolean) => {
    setIsQuizModalOpen(false)

    setPlayer((prev) => ({
      ...prev,
      totalAttempts: prev.totalAttempts + 1,
      correctAnswers: isCorrect ? prev.correctAnswers + 1 : prev.correctAnswers,
    }))

    if (isCorrect) {
      sound.playCorrect()
      const newStreak = player.streak + 1
      const streakBonus = newStreak * 25
      const pointsEarned = currentQuestion.points + streakBonus

      // Target petak lompat
      const nextTile = Math.min(10, player.currentTile + 2) // Lompat 1-2 petak maju

      setPlayer((prev) => ({
        ...prev,
        score: prev.score + pointsEarned,
        currentTile: nextTile,
        streak: newStreak,
        highestStreak: Math.max(prev.highestStreak, newStreak),
        pose: 'melompat',
      }))

      addLog(`Jawaban bener! ${player.name} meunang +${pointsEarned} poin & luncat ka Petak ${nextTile}.`, 'success')
      gameBridge.emit('ENGKLEK_HOP_STEP', { player: player.name, toTile: nextTile })

      // Cek apakah menginjak sawah lawan (Pajak Poin)
      const targetTileData = tiles.find((t) => t.id === nextTile)
      if (targetTileData && targetTileData.owner === 'opponent') {
        sound.playTax()
        const taxAmount = targetTileData.taxRate
        setPlayer((prev) => ({ ...prev, score: Math.max(0, prev.score - taxAmount) }))
        setOpponent((prev) => ({ ...prev, score: prev.score + taxAmount }))
        addLog(`Aduh! ${player.name} nginjak Sawah milik lawan di Petak ${nextTile}. Mayar pajeg -${taxAmount} poin!`, 'tax')
        gameBridge.emit('ENGKLEK_TAX_PAID', { from: player.name, to: opponent.name, amount: taxAmount })
      }

      // Cek apakah mencapai Petak 10 (Gunung)
      if (nextTile === 10) {
        sound.playSawahClaim()
        addLog(`⛰️ ${player.name} parantos nepi ka Puncak Gunung! Waktuna milih Sawah.`, 'success')
        setTimeout(() => {
          setIsClaimSawahOpen(true)
          setPhase('choose_sawah')
        }, 800)
        return
      }

      // Selesai giliran pemain -> lanjut giliran lawan
      setTimeout(() => {
        setPlayer((prev) => ({ ...prev, pose: 'berdiri', isTurn: false }))
        triggerOpponentTurn()
      }, 1000)
    } else {
      // Salah Menjawab: Karakter jatuh / injak garis
      sound.playWrong()
      const penaltyTile = Math.max(0, player.currentTile - 1)

      setPlayer((prev) => ({
        ...prev,
        streak: 0,
        currentTile: penaltyTile,
        pose: 'jatuh',
      }))

      addLog(`Hanjakal lepat! Karakter nincak garis / labuh. Mundur ka Petak ${penaltyTile}. Giliran leungit!`, 'warning')
      gameBridge.emit('ENGKLEK_LINE_STEPPED', { player: player.name })

      setTimeout(() => {
        setPlayer((prev) => ({ ...prev, pose: 'berdiri', isTurn: false }))
        triggerOpponentTurn()
      }, 1200)
    }
  }

  // Pemain Memilih Petak untuk Dijadikan Sawah
  const handleClaimTile = (tileId: number) => {
    setTiles((prev) =>
      prev.map((t) => (t.id === tileId ? { ...t, owner: 'player' } : t))
    )
    setPlayer((prev) => ({
      ...prev,
      sawahCount: prev.sawahCount + 1,
      score: prev.score + 150, // Bonus klaim sawah
      currentTile: 0, // Putar balik ke start untuk ronde berikutnya
      gacukTile: Math.min(10, prev.gacukTile + 1),
      pose: 'berdiri',
      isTurn: false,
    }))

    sound.playSawahClaim()
    setIsClaimSawahOpen(false)
    addLog(`🌾 Hore! Petak ${tileId} ayeuna resmi janten Sawah milik ${player.name}! (+150 Poin)`, 'success')
    gameBridge.emit('ENGKLEK_SAWAH_CLAIMED', { owner: player.name, tileId })

    // Cek apakah permainan selesai (misal sudah 4 sawah dikuasai)
    const totalSawahClaimed = tiles.filter((t) => t.owner !== null).length + 1
    if (totalSawahClaimed >= 4 || player.score >= 1000) {
      setTimeout(() => {
        setPhase('game_over')
      }, 1000)
    } else {
      setTimeout(() => {
        triggerOpponentTurn()
      }, 1200)
    }
  }

  // Simulasi Giliran Lawan (Bot Interaktif)
  const triggerOpponentTurn = () => {
    setOpponent((prev) => ({ ...prev, isTurn: true, pose: 'melempar' }))
    sound.playThrow()
    addLog(`Giliran lawan (${opponent.name}) nuju ngalungkeun gacuk...`, 'info')

    setTimeout(() => {
      // 70% Peluang Bot Berhasil
      const isBotCorrect = Math.random() > 0.3
      if (isBotCorrect) {
        sound.playJump()
        const botNextTile = Math.min(10, opponent.currentTile + 2)

        setOpponent((prev) => ({
          ...prev,
          score: prev.score + 100,
          currentTile: botNextTile,
          pose: 'melompat',
        }))
        addLog(`Lawan ngajawab bener & luncat ka Petak ${botNextTile}.`, 'info')

        // Jika bot menginjak sawah pemain
        const steppedTile = tiles.find((t) => t.id === botNextTile)
        if (steppedTile && steppedTile.owner === 'player') {
          sound.playTax()
          const tax = steppedTile.taxRate
          setOpponent((prev) => ({ ...prev, score: Math.max(0, prev.score - tax) }))
          setPlayer((prev) => ({ ...prev, score: prev.score + tax }))
          addLog(`Lawan nginjak Sawah anjeun di Petak ${botNextTile}! Anjeun nampi pajeg +${tax} poin!`, 'tax')
        }

        // Jika bot mencapai puncak gunung
        if (botNextTile === 10) {
          const availableForBot = tiles.filter((t) => t.owner === null)
          if (availableForBot.length > 0) {
            const chosen = availableForBot[Math.floor(Math.random() * availableForBot.length)]
            setTiles((prev) =>
              prev.map((t) => (t.id === chosen.id ? { ...t, owner: 'opponent' } : t))
            )
            setOpponent((prev) => ({
              ...prev,
              sawahCount: prev.sawahCount + 1,
              score: prev.score + 150,
              currentTile: 0,
            }))
            addLog(`Lawan hasil ngawasa Petak ${chosen.id} janten Sawahna!`, 'warning')
          }
        }
      } else {
        sound.playWrong()
        setOpponent((prev) => ({ ...prev, pose: 'jatuh' }))
        addLog(`Lawan salah ngajawab! Karakter lawan nincak garis.`, 'info')
      }

      // Kembalikan giliran ke Pemain
      setTimeout(() => {
        setOpponent((prev) => ({ ...prev, pose: 'berdiri', isTurn: false }))
        setPlayer((prev) => ({ ...prev, isTurn: true, pose: 'berdiri' }))
        setPhase('ready_to_throw')
        addLog(`Ayeuna giliran anjeun! Pencet SPASI atawa tombol pikeun ngajawab.`, 'info')
      }, 1000)
    }, 1500)
  }

  // Rematch / Reset Permainan
  const handleResetGame = () => {
    setTiles(INITIAL_TILES)
    setPhase('ready_to_throw')
    setPlayer((prev) => ({
      ...prev,
      score: 0,
      currentTile: 0,
      gacukTile: 1,
      streak: 0,
      sawahCount: 0,
      pose: 'berdiri',
      isTurn: true,
    }))
    setOpponent((prev) => ({
      ...prev,
      score: 0,
      currentTile: 0,
      gacukTile: 1,
      streak: 0,
      sawahCount: 0,
      pose: 'berdiri',
      isTurn: false,
    }))
    setLogs([])
    addLog('Permainan di-reset. Wilujeng maen deui!', 'info')
  }

  return (
    <div className="relative min-h-screen w-full bg-stone-950 text-stone-100 flex flex-col justify-between overflow-x-hidden">
      {/* Background Lanskap Pedesaan / Sawah Sunda */}
      <div
        className="fixed inset-0 bg-cover bg-center opacity-30 pointer-events-none filter blur-[1px]"
        style={{ backgroundImage: `url('/assets/engklek/arena_side.jpg')` }}
      />
      <div className="fixed inset-0 bg-gradient-to-b from-stone-950/80 via-stone-950/60 to-stone-950/90 pointer-events-none" />

      {/* Main Container */}
      <div className="relative z-10 w-full max-w-5xl mx-auto p-3 md:p-6 flex flex-col gap-5 flex-1 justify-between">
        {/* LAYAR LOBBY / SELEKSI AVATAR SEBELUM MAIN */}
        {!hasStarted ? (
          <div className="my-auto max-w-xl mx-auto w-full p-6 md:p-8 rounded-3xl bg-gradient-to-b from-stone-900 via-amber-950 to-stone-900 border-4 border-amber-600 shadow-2xl text-center backdrop-blur-md">
            {/* Banner Logo Sunda Empire */}
            <div className="mb-4 flex justify-center">
              <img
                src="/assets/ui/sunda_empire_title.png"
                alt="Sunda Empire"
                className="max-h-24 md:max-h-28 object-contain drop-shadow-[0_4px_12px_rgba(245,158,11,0.5)]"
                onError={(e) => {
                  ;(e.target as HTMLElement).style.display = 'none'
                }}
              />
            </div>

            <h1 className="text-2xl md:text-3xl font-black text-amber-300 uppercase tracking-wider">
              🎮 MODE ENGKLEK
            </h1>
            <p className="text-xs md:text-sm text-stone-300 mt-1 font-medium">
              Lompat Petak & Kuasai Sawah Tradisional Tatar Sunda
            </p>

            {/* Form Input Nama Pemain */}
            <div className="mt-6 text-left">
              <label className="block text-xs font-bold text-amber-200 uppercase mb-1.5">
                Nami Pamaen (Nama Pemain):
              </label>
              <input
                type="text"
                value={playerNameInput}
                onChange={(e) => setPlayerNameInput(e.target.value)}
                maxLength={15}
                placeholder="Contoh: Ujang / Ijem"
                className="w-full px-4 py-2.5 rounded-xl bg-stone-950/80 border-2 border-amber-700/80 focus:border-amber-400 focus:outline-none text-amber-100 font-bold text-sm shadow-inner"
              />
            </div>

            {/* Pilihan Avatar K1 / K2 */}
            <div className="mt-5 text-left">
              <label className="block text-xs font-bold text-amber-200 uppercase mb-2">
                Pilih Karakter Sunda:
              </label>
              <div className="grid grid-cols-2 gap-3">
                {/* Avatar K1 (Laki-laki / Ujang) */}
                <button
                  type="button"
                  onClick={() => setSelectedAvatar('k1')}
                  className={`p-3 rounded-2xl border-2 flex flex-col items-center justify-center transition-all cursor-pointer ${
                    selectedAvatar === 'k1'
                      ? 'bg-amber-900/60 border-amber-400 ring-4 ring-amber-400/40 shadow-lg'
                      : 'bg-stone-950/60 border-stone-800 hover:border-amber-600'
                  }`}
                >
                  <img
                    src="/assets/characters/k1/berdiri.png"
                    alt="K1"
                    className="h-24 object-contain drop-shadow"
                  />
                  <span className="font-black text-xs text-amber-200 mt-2">Ujang (Pangsi)</span>
                  {selectedAvatar === 'k1' && (
                    <span className="text-[10px] text-emerald-400 font-bold flex items-center gap-1 mt-1">
                      <UserCheck className="w-3 h-3" /> Dipilih
                    </span>
                  )}
                </button>

                {/* Avatar K2 (Perempuan / Ijem) */}
                <button
                  type="button"
                  onClick={() => setSelectedAvatar('k2')}
                  className={`p-3 rounded-2xl border-2 flex flex-col items-center justify-center transition-all cursor-pointer ${
                    selectedAvatar === 'k2'
                      ? 'bg-amber-900/60 border-amber-400 ring-4 ring-amber-400/40 shadow-lg'
                      : 'bg-stone-950/60 border-stone-800 hover:border-amber-600'
                  }`}
                >
                  <img
                    src="/assets/characters/k2/berdiri.png"
                    alt="K2"
                    className="h-24 object-contain drop-shadow"
                  />
                  <span className="font-black text-xs text-amber-200 mt-2">Ijem (Kebaya)</span>
                  {selectedAvatar === 'k2' && (
                    <span className="text-[10px] text-emerald-400 font-bold flex items-center gap-1 mt-1">
                      <UserCheck className="w-3 h-3" /> Dipilih
                    </span>
                  )}
                </button>
              </div>
            </div>

            {/* Aturan Main Singkat */}
            <div className="mt-5 p-3 rounded-xl bg-black/40 border border-amber-900/40 text-[11px] text-amber-200/80 text-left space-y-1">
              <p className="font-bold text-amber-300">💡 Aturan Main Engklek Kuis:</p>
              <p>• Lempar Gacuk & Jawab soal kuis Sunda untuk melompat maju 1-2 petak.</p>
              <p>• Jika salah, karakter akan labuh (tergelincir) dan giliranmu gugur.</p>
              <p>• Capai Petak 10 (Gunung) untuk mengklaim petak menjadi Sawah milikmu!</p>
            </div>

            {/* Tombol Mulai */}
            <button
              onClick={handleStartGame}
              className="mt-6 w-full py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 hover:from-amber-400 hover:to-yellow-300 text-stone-950 font-black text-base shadow-xl border-2 border-yellow-200 transform hover:scale-[1.02] active:scale-95 transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <Play className="w-5 h-5 fill-stone-950" />
              <span>GASS MAIN AYEUNA!</span>
            </button>
          </div>
        ) : phase === 'game_over' ? (
          /* LAYAR PODIUM JUARA (GAME OVER) */
          <div className="my-auto">
            <EngklekPodium player={player} opponent={opponent} onRematch={handleResetGame} />
          </div>
        ) : (
          /* ARENA ENGKLEK AKTIF */
          <div className="flex flex-col gap-4">
            {/* In-Game HUD */}
            <EngklekHUD
              player={player}
              opponent={opponent}
              isPlayerTurn={player.isTurn}
              isQuizOpen={isQuizModalOpen}
              isMuted={sound.isMuted}
              logs={logs}
              onOpenQuiz={handleTriggerQuiz}
              onToggleMute={sound.toggleMute}
              onResetGame={handleResetGame}
            />

            {/* Papan Petak Engklek */}
            <div className="flex justify-center">
              <EngklekBoard
                tiles={tiles}
                player={player}
                opponent={opponent}
                selectedTileForSawah={null}
                isChoosingSawah={phase === 'choose_sawah'}
              />
            </div>
          </div>
        )}
      </div>

      {/* Pop-up Modal Soal Kuis Interaktif */}
      <EngklekQuizModal
        isOpen={isQuizModalOpen}
        question={currentQuestion}
        avatar={player.avatar}
        playerName={player.name}
        isGunungChallenge={isGunungChallenge}
        onAnswer={handleAnswerQuiz}
      />

      {/* Pop-up Modal Klaim Sawah Saat Mencapai Gunung */}
      <ClaimSawahModal
        isOpen={isClaimSawahOpen}
        availableTiles={tiles.filter((t) => t.owner === null)}
        onClaimTile={handleClaimTile}
      />

      {/* Footer Minimalis */}
      <footer className="relative z-10 py-2.5 text-center text-[11px] text-amber-400/60 border-t border-amber-950/60 bg-stone-950/90 flex items-center justify-center gap-2">
        <Sparkles className="w-3.5 h-3.5 text-amber-400" />
        <span>Kuis Budaya Sunda • Mode Engklek PWA • Divisi 4 Frontend Web & UI</span>
      </footer>
    </div>
  )
}
