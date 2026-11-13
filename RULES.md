# Panduan Kolaborasi & Arsitektur Tim (Divisi 4: Frontend Web & UI)
## Proyek: Kuis Budaya Sunda (Sunda Empire PWA)

Selamat datang di tim **Frontend Web & UI Developer (Divisi 4)**! Dokumen ini adalah pedoman arsitektur, pembagian tugas 4 developer (**Andrea dan 3 Rekan Tim**), format standar PWA, dan protokol integrasi antarmuka untuk diimplementasikan bersama, serta menjadi pedoman wajib bagi **Antigravity AI** di setiap perangkat.

---

## 1. Konteks Proyek & Adaptasi Permainan Tradisional

Proyek ini adalah game edukasi budaya Sunda berbasis web PWA (*Progressive Web App*) yang mengadaptasi 2 permainan tradisional:
1. **Mode 1: Oray-Orayan ("Kejar Barisan & Gerbang Penentu")**
   * *Core Loop:* Jawab kuis benar = tambah stamina, panjang barisan (ekor), dan buff kecepatan lari.
   * *Event Gerbang Tertutup (Pandeurina!):* Setiap 60 detik lagu berhenti dan gerbang menutup. Pemain yang tertangkap harus menjawab *Soal Penyelamatan* (timer kilat 10 detik).
   * *Tarik Tambang Kuis:* Di menit terakhir, pemain dibagi menjadi **Tim Bulan vs Tim Bintang** untuk adu cepat kuis.
2. **Mode 2: Engklek ("Lompat Petak & Kuasai Sawah")**
   * *Core Loop:* Jawab kuis benar = lempar gacuk (pecahan genteng) dan melompat maju 1–3 petak.
   * *Mekanik Sawah/Rumah:* Pemain yang mencapai petak puncak (Gunung) dan menjawab *Soal Tantangan* berhak mengklaim petak menjadi "Sawah/Rumah". Pemain lawan yang menginjaknya membayar pajak poin.

---

## 2. Tech Stack & Standar Resmi (Format PWA)

* **Framework:** React 19 + TypeScript + Vite
* **PWA Engine:** `vite-plugin-pwa` (Service Worker, Workbox Precaching, Manifest)
* **Format Layar:** `display: "standalone"`, `orientation: "landscape"` (bebas dari browser bar, tampilan widescreen 16:9)
* **Styling:** Tailwind CSS v4 (Gamified Pixel-Art & Responsive Theme)
* **Icons:** Lucide React (`lucide-react`)
* **Effects:** Canvas Confetti (`canvas-confetti`)
* **Audio SFX:** Web Audio API / HTML5 Audio untuk aransemen gamelan, kendang, dan sfx interaktif

---

## 3. Struktur Folder & Prinsip "Zero Overlap"

Setiap developer bertanggung jawab atas foldernya masing-masing agar 4 developer tidak saling bertabrakan:

```
src/
├── assets/                  # Logo Sunda Empire, avatar K1-K8, tileset, props, audio
├── components/
│   ├── ui/                  # Komponen global (Button, Modal, Input, Badge, TimerBar)
│   ├── outgame/             # Modul 1: Landing PIN, Avatar Selector, Waiting Lobby
│   ├── host/                # Modul 2A: Layar Proyektor Guru/Host & Kontrol Sesi
│   ├── bank-soal/           # Modul 2B: Manajemen Bank Soal Budaya Sunda (CRUD)
│   ├── overlay/             # Modul 3: Fast-toggle Quiz Popup, Soal Penyelamatan & Tantangan
│   ├── hud/                 # Modul 4A: In-game HUD (Countdown Gerbang 60s, Tarik Tambang, Sawah)
│   └── podium/              # Modul 4B: Live Scoreboard, Podium Juara 1-2-3 & Confetti
├── services/
│   ├── gameBridge.ts        # Jembatan Event ke Game Client Canvas (Divisi 5)
│   └── socketClient.ts      # Jembatan WebSocket ke Server Multiplayer (Divisi 6)
├── hooks/                   # Custom hooks (useQuizTimer.ts, useSoundEffects.ts, dll.)
├── data/                    # Data bank soal bawaan Sunda (defaultQuestions.ts)
├── types/                   # Definisi TypeScript bersama (quiz.ts, game.ts)
├── App.tsx                  # HANYA untuk wiring/integrasi akhir (dilarang diedit sembarangan!)
└── main.tsx
```

### ⚠️ Aturan Emas File `src/App.tsx`:
* **Jangan mengedit file `src/App.tsx` di branch fitur Anda!**
* Setiap developer hanya membuat komponen mandiri (*self-contained*) dan mengekspornya dari foldernya masing-masing.
* Penggabungan (*wiring*) semua komponen ke dalam `App.tsx` akan dilakukan secara terpusat setelah komponen selesai diuji.

---

## 4. Pembagian Modul 4 Developer (Divisi 4)

Berdasarkan aset resmi (*Sunda Empire*, Avatar K1–K8, dan Desain UI Kelompok Intan/Luna):

### 🧑‍💻 Developer 1 — Onboarding & Player Lobby (`src/components/outgame/`)
* **Halaman Landing "Sunda Empire":** Form input PIN 6 digit + validasi kode room.
* **Avatar & Profil:** Pemilihan karakter dari 8 avatar anak Sunda (K1–K8) dan input nama pemain.
* **Waiting Room (Lobby Siswa):** Grid avatar pemain yang sudah gabung, status ready, dan ringkasan mode permainan (Oray-orayan / Engklek).

### 🧑‍💻 Developer 2 — Host Screen & Bank Soal (`src/components/host/` & `src/components/bank-soal/`)
* **Host / Teacher Dashboard (Proyektor Kelas):** Layar host beresolusi besar, PIN & QR Code raksasa, daftar siswa terhubung, tombol *Mulai Sesi*, serta kontrol darurat (pause/event trigger).
* **Bank Soal Budaya Sunda:** Manajemen soal (Waditra, Basa & Paribasa, Carita Rayat, Kuliner, Sejarah Sunda), fitur filter kategori, serta ekspor/impor file JSON.

### 🧑‍💻 Developer 3 — Quiz Overlay & Event Soal (`src/components/overlay/`)
* **Fast-Toggle Quiz Modal:** Pop-up kuis di atas game canvas (balon dialog putih + 4 tombol kayu A/B/C/D sesuai desain `kelompok intan`) yang bisa dibuka-tutup cepat.
* **Soal Penyelamatan Gerbang (Oray-orayan):** Modal darurat berkedip merah dengan countdown 10 detik saat tertangkap gerbang *Pandeurina*.
* **Soal Tantangan Puncak Gunung (Engklek):** Pop-up soal khusus tingkat mahir untuk mengklaim petak sawah.
* **Visual Combo & Streak:** Animasi streak jawaban benar, efek visual shake saat salah, dan pemicu bonus stamina.

### 🧑‍💻 Developer 4 — In-Game HUD & Podium Juara (`src/components/hud/` & `src/components/podium/`)
* **HUD Oray-Orayan:** Indikator bar countdown 60 detik menuju gerbang tutup dan meteran Tarik Tambang Kuis (Bulan vs Bintang).
* **HUD Engklek:** Indikator jatah lempar gacuk, petak sawah yang dikuasai, dan notifikasi pajak poin.
* **Live Scoreboard & Podium Juara:** Peringkat skor live di sudut layar, serta layar podium akhir (Juara 1, 2, 3) dengan efek ledakan confetti (`canvas-confetti`) dan breakdown performa pemain.

---

## 5. Kontrak Integrasi Antar-Divisi

1. **Jembatan ke Divisi 5 (Game Client Canvas):**
   * Berkomunikasi melalui event bus lokal di `src/services/gameBridge.ts` (`CustomEvent` berbasis window):
     * Canvas -> UI: `GAME_TRIGGER_QUIZ`, `GATE_ALERT_START`, `PLAYER_REACHED_MOUNTAIN`.
     * UI -> Canvas: `QUIZ_RESULT_SUCCESS (stamina_boost / step_jump)`, `QUIZ_RESULT_FAIL (cooldown)`.
2. **Jembatan ke Divisi 6 (Backend Multiplayer WebSocket):**
   * Berkomunikasi melalui `src/services/socketClient.ts`:
     * Event: `ROOM_JOIN`, `ANSWER_SUBMIT`, `SCORE_BROADCAST`, `GATE_CLOSED`, `CLAIM_SAWAH`, `TUG_OF_WAR_TICK`.

---

## 6. Alur Git & Protokol Pull Request (PR)

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
5. **Sinkronisasi Wajib Setelah PR Di-merge:**
   ```bash
   git checkout main
   git pull origin main
   npm install
   ```
