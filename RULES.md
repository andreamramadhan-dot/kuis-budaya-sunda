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
├── data/            # Bank soal & data kategori kuis
├── hooks/           # Custom hooks
├── types/           # Definisi TypeScript (quiz.ts)
├── App.tsx          # Main entry / state container
└── main.tsx
```

### Aturan Penamaan:
* Komponen: `PascalCase.tsx` (contoh: `QuestionCard.tsx`, `TimerBar.tsx`)
* Hooks: `camelCase.ts` diawali `use` (contoh: `useTimer.ts`)
* Tipe Data: Simpan di `src/types/`

---

## 3. Pembagian Tugas Tim (Task Division)
*Status: Menunggu desain dari tim UI/UX.*
* Pembagian modul dan fitur akan disepakati bersama oleh tim developer setelah mockup / Figma tersedia.
* Jangan mulai membuat fitur spesifik sebelum kesepakatan pembagian tugas ditentukan.

---

## 4. Git & Kolaborasi Branch
* **Branch Utama:** `main` (dilarang push langsung ke `main`).
* **Feature Branch:** Setiap developer bekerja di branch fitur masing-masing (format: `feature/<nama-fitur>`).
* **Integrasi:** Penggabungan fitur ke branch `main` wajib melalui Pull Request (PR) di GitHub.
* **Sebelum push/PR:** Pastikan menjalankan `npm run build` terlebih dahulu untuk memverifikasi tidak ada error TypeScript.
