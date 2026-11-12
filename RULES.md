# Panduan Kolaborasi & Arsitektur Tim (4 Developer): Kuis Budaya Sunda

Selamat datang di tim frontend **Kuis Budaya Sunda**! Dokumen ini adalah pedoman arsitektur dan alur kerja bersama untuk **Andrea dan 3 Rekan Tim**, serta pedoman wajib bagi **Antigravity AI** di setiap perangkat.

---

## 1. Tech Stack & Library Resmi
* **Framework:** React 19 + TypeScript + Vite
* **Styling:** Tailwind CSS (Modern Gamified & Vibrant UI)
* **Icons:** Lucide React (`lucide-react`)
* **Effects:** Canvas Confetti (`canvas-confetti`)
* **Audio SFX:** Web Audio API / HTML5 Audio untuk efek suara gamelan/kendang

---

## 2. Struktur Folder & Prinsip "Zero Overlap"
Setiap modul/fitur dikelompokkan ke dalam foldernya masing-masing agar 4 developer tidak saling bertabrakan:

```
src/
├── assets/             # Gambar, ikon SVG, audio sfx
├── components/         
│   ├── ui/             # Komponen global reusable (Button, Modal, Badge, Card)
│   ├── landing/        # Halaman awal, input nama, pilih kategori
│   ├── gameplay/       # Kartu soal, tombol opsi A/B/C/D, review jawaban
│   └── result/         # Layar skor akhir, review hasil kuis, tombol main lagi
├── hooks/              # Custom hooks (useQuizTimer.ts, useSoundEffects.ts, dll)
├── data/               # Bank soal & kategori budaya Sunda (quizQuestions.ts)
├── types/              # Definisi TypeScript bersama (quiz.ts)
├── App.tsx             # HANYA untuk wiring/integrasi akhir (dilarang diedit sembarangan!)
└── main.tsx
```

### ⚠️ Aturan Emas File `src/App.tsx`:
* **Jangan mengedit file `src/App.tsx` di branch fitur Anda!**
* Setiap developer hanya membuat komponen mandiri (*self-contained*) dan mengekspornya dari foldernya masing-masing.
* Penggabungan (wiring) semua komponen ke dalam `App.tsx` akan dilakukan secara terpusat setelah komponen selesai.

### Konvensi Penamaan:
* Komponen: `PascalCase.tsx` (contoh: `QuestionCard.tsx`, `ScoreSummary.tsx`)
* Hooks: `camelCase.ts` diawali `use` (contoh: `useQuizTimer.ts`)
* Tipe Data: Semua kontrak data wajib merujuk ke `src/types/`

---

## 3. Pembagian Modul 4 Developer (Menunggu Desain UI/UX)
*Status: Menunggu rilis mockup / Figma dari tim desain.*
Setelah desain selesai, 4 modul utama akan dibagi:
1. **Modul A (Landing & Onboarding):** Hero section, input nama pemain, pemilihan kategori/level.
2. **Modul B (Gameplay Core):** Question card, opsi jawaban interaktif, animasi benar/salah.
3. **Modul C (Timer & Gamification FX):** Countdown bar, audio effect (gamelan/sfx), kalkulasi streak poin.
4. **Modul D (Result Screen & Bank Soal):** Tampilan skor akhir, confetti celebration, kurasi data bank soal Sunda.

---

## 4. Alur Git & Protokol Pull Request (PR) 4 Orang

1. **Dilarang keras push langsung ke branch `main`.**
2. **Kerja di Feature Branch:**
   ```bash
   git checkout main
   git pull origin main
   git checkout -b feature/<nama-fitur>
   ```
3. **Wajib Uji Build Sebelum Bikin PR:**
   Jalankan perintah ini di terminal dan pastikan lolos tanpa error:
   ```bash
   npm run build
   ```
4. **Protokol Review & Merge:**
   * Buat Pull Request (PR) ke branch `main` di GitHub.
   * Tunjuk minimal **1 orang rekan tim sebagai Reviewer**.
   * Setelah mendapat minimal **1 Approval**, branch boleh di-merge.
5. **Sinkronisasi Wajib:**
   Setiap kali ada PR teman yang berhasil di-merge ke `main`, 3 orang lainnya wajib segera melakukan:
   ```bash
   git pull origin main
   ```
