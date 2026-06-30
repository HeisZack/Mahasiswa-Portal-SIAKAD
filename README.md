# Mahasiswa Portal SIAKAD

Portal Akademik (SIAKAD) untuk mahasiswa — sebuah Single Page Application berbasis React yang menyediakan akses ke informasi akademik, keuangan, perkuliahan, dan layanan kampus dalam satu dashboard terpadu.

> Status: Frontend prototype/demo (data masih bersifat statis/mock, belum terhubung ke backend/API sungguhan).

## 🔗 Tautan Penting

- **Prototype (Figma):** https://www.figma.com/design/FEu1uA3wgOeFtmF7wuOEkl/Portal-Mahasiswa?node-id=1-89&t=NqV43nPsnTEOD3fb-1
- **Project Tracker (Notion):** https://app.notion.com/p/38fa4959671880f3b8b3ef7881f82ff1?v=e04bedfed1374188bd1fd8153e38239a&source=copy_link

## ✨ Fitur Utama

Berdasarkan struktur halaman yang tersedia, portal ini mencakup:

- **Dashboard** — Ringkasan informasi akademik mahasiswa secara umum.
- **Login** — Autentikasi mahasiswa menggunakan NIM dan password.
- **KRS (Kartu Rencana Studi)** — Pengisian dan pengelolaan rencana studi per semester.
- **Jadwal** — Jadwal perkuliahan mahasiswa.
- **Akademik** — Riwayat akademik, nilai, dan transkrip (IPS/IPK per semester).
- **Keuangan** — Informasi tagihan UKT, status pembayaran, dan riwayat transaksi.
- **Perkuliahan** — Status kehadiran/presensi dan informasi kelas yang diambil.
- **Layanan** — Layanan administratif kampus untuk mahasiswa.
- **Informasi & Pengumuman** — Berita dan pengumuman kampus, termasuk kalender akademik.
- **Profil** — Data diri mahasiswa (akademik dan personal).
- **Setelan** — Pengaturan akun dan preferensi pengguna.
- **Bantuan** — Pusat bantuan/FAQ.
- **AI Assistant Widget** — Widget asisten berbasis AI untuk membantu navigasi/pertanyaan mahasiswa.

## 🛠️ Tech Stack

- **Framework:** React 18 + Vite 6
- **Routing:** React Router 7
- **Styling:** Tailwind CSS 4
- **UI Components:** Radix UI primitives, shadcn/ui style components, Material UI (MUI)
- **Form:** React Hook Form
- **Animasi:** Motion (Framer Motion)
- **Grafik:** Recharts
- **Lainnya:** date-fns, lucide-react (icons), sonner (toast notification), cmdk, vaul, embla-carousel, react-dnd, dan lain-lain
- **Package Manager:** pnpm (lihat `pnpm-workspace.yaml`)

## 📁 Struktur Proyek

```
Mahasiswa-Portal-SIAKAD/
├── src/
│   ├── app/
│   │   ├── App.tsx                # Root komponen aplikasi
│   │   ├── routes.tsx             # Definisi routing aplikasi
│   │   ├── context/
│   │   │   └── AppContext.tsx     # Global state (data mahasiswa, kursus, keuangan, dll)
│   │   └── components/
│   │       ├── DashboardPage.tsx
│   │       ├── LoginPage.tsx
│   │       ├── KRSPage.tsx
│   │       ├── JadwalPage.tsx
│   │       ├── AkademikPage.tsx
│   │       ├── KeuanganPage.tsx
│   │       ├── PerkuliahanPage.tsx
│   │       ├── LayananPage.tsx
│   │       ├── InformasiPage.tsx
│   │       ├── ProfilePage.tsx
│   │       ├── SettingsPage.tsx
│   │       ├── BantuanPage.tsx
│   │       ├── AIAssistantWidget.tsx
│   │       ├── Sidebar.tsx / Header.tsx / Layout.tsx / RightPanel.tsx
│   │       └── ui/                # Komponen UI dasar (shadcn/ui)
│   ├── main.tsx                   # Entry point aplikasi
│   └── styles/                    # Global styles
├── guidelines/
│   └── Guidelines.md              # Panduan pengembangan/design system
├── index.html
├── vite.config.ts
├── package.json
└── default_shadcn_theme.css
```

## 🚀 Instalasi & Menjalankan Proyek

### Prasyarat
- Node.js (disarankan versi LTS terbaru)
- pnpm (atau npm/yarn sebagai alternatif)

### Langkah-langkah

1. Clone repository ini:
   ```bash
   git clone <repository-url>
   cd Mahasiswa-Portal-SIAKAD
   ```

2. Install dependencies:
   ```bash
   pnpm install
   # atau
   npm install
   ```

3. Jalankan development server:
   ```bash
   pnpm dev
   # atau
   npm run dev
   ```

4. Buka browser dan akses `http://localhost:5173` (port default Vite).

### Build untuk Production

```bash
pnpm build
# atau
npm run build
```

Hasil build akan berada di folder `dist/`.

## 🔑 Login Demo

Aplikasi menggunakan autentikasi NIM & password yang masih berupa data mock di sisi frontend (lihat `AppContext.tsx`). Gunakan kredensial demo berikut untuk mencoba aplikasi:

- **NIM:** `2023101080`
- **Password:** `123456`

## 🗺️ Roadmap / Pengembangan Selanjutnya

- Integrasi dengan backend/API SIAKAD sesungguhnya (autentikasi, data akademik real-time)
- Penyimpanan data persisten (database)
- Notifikasi real-time
- Pengembangan fitur AI Assistant lebih lanjut

Progress dan rencana pengembangan dapat dipantau melalui [Notion Project Tracker](https://app.notion.com/p/38fa4959671880f3b8b3ef7881f82ff1?v=e04bedfed1374188bd1fd8153e38239a&source=copy_link).

## 🎨 Desain

Desain UI/UX lengkap tersedia di Figma, dapat dilihat melalui [link Prototype Figma](https://www.figma.com/design/FEu1uA3wgOeFtmF7wuOEkl/Portal-Mahasiswa?node-id=1-89&t=NqV43nPsnTEOD3fb-1) di atas.

## 📄 Lisensi

Proyek ini dibuat untuk keperluan akademik/internal. Sesuaikan bagian lisensi ini sesuai kebutuhan Anda.
