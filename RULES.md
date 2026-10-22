# Panduan Kolaborasi & Arsitektur: Kuis Budaya Sunda (Wayground Style)

Selamat datang di proyek **Kuis Budaya Sunda**! Dokumen ini menjadi pedoman bersama antara **Andrea** dan **Rekan Tim**, serta pedoman bagi **Antigravity AI** di masing-masing perangkat.

---

## 1. Tech Stack
* **Framework:** React 19 + TypeScript + Vite
* **Styling:** Tailwind CSS (Modern Gamified & Vibrant UI)
* **Icons:** Lucide React (`lucide-react`)
* **Effects:** Canvas Confetti (`canvas-confetti`)
* **Audio SFX:** Web Audio API / HTML5 Audio untuk efek suara gamelan/kendang

---

## 2. Struktur Folder & Konvensi
```
src/
├── assets/          # Ikon, ilustrasi, audio sfx
├── components/      
│   ├── ui/          # Komponen reusable (Button, Badge, Modal, TimerBar)
│   ├── quiz/        # Komponen khusus kuis (QuestionCard, OptionButton, ScoreBoard)
│   └── layout/      # Navbar, Header, Footer
├── data/            # Bank soal & data kategori kuis (quizQuestions.ts)
├── hooks/           # Custom hooks (useQuizTimer.ts, useSoundEffects.ts)
├── types/           # Definisi TypeScript (quiz.ts)
├── App.tsx          # Main entry / state container
└── main.tsx
```

### Aturan Penamaan:
* Komponen: `PascalCase.tsx` (contoh: `QuestionCard.tsx`, `TimerBar.tsx`)
* Hooks: `camelCase.ts` diawali `use` (contoh: `useQuizTimer.ts`)
* Tipe Data: Simpan di `src/types/`

---

## 3. Pembagian Tugas Tim (Task Division)

| Developer | Peran Utama | File / Modul yang Ditangani |
| :--- | :--- | :--- |
| **Andrea (Dev A)** | **Game Logic & Flow** | - `src/hooks/useQuizTimer.ts`<br>- Flow navigasi soal (Next/Prev/Submit)<br>- Kalkulasi Skor & Nyawa/Streak<br>- State management di `src/App.tsx` |
| **Rekan Tim (Dev B)** | **Visual Gamification & UI** | - `src/components/quiz/OptionButton.tsx`<br>- `src/components/quiz/QuestionCard.tsx`<br>- Efek Confetti & Sound FX (`useSoundEffects.ts`)<br>- Tampilan Hasil Akhir / Leaderboard |

---

## 4. Git & Kolaborasi Branch
* **Branch Utama:** `main` (jangan commit langsung ke `main`)
* **Branch Andrea:** `feature/game-flow-and-timer`
* **Branch Rekan:** `feature/quiz-ui-and-components`
* **Sebelum push:** Jalankan `npm run build` untuk memastikan tidak ada error TypeScript atau build error.
