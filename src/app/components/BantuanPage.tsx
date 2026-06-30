import { useState } from "react";
import {
  HelpCircle, FileText, BookOpen, CreditCard, ChevronDown, ChevronRight,
  Search, MessageCircle, Phone, Mail, Clock, Users, CheckCircle2,
  GraduationCap, Calendar, MonitorPlay, Settings, User, ExternalLink,
} from "lucide-react";
import { Link } from "react-router";

const SM = { fontFamily: "'Hanken Grotesk', sans-serif" } as const;
const MONO = { fontFamily: "'JetBrains Mono', monospace" } as const;

const guides = [
  {
    id: "krs",
    icon: FileText,
    title: "Kartu Rencana Studi (KRS)",
    color: "#0061a5",
    bg: "#e8f0fb",
    link: "/krs",
    steps: [
      { title: "Mengambil Mata Kuliah", content: "Buka halaman KRS → pilih tab 'MK Tersedia' → klik tombol 'Ambil' pada mata kuliah yang diinginkan. Pastikan total SKS tidak melebihi batas maksimum (24 SKS untuk IPK ≥ 3.75)." },
      { title: "Membatalkan Mata Kuliah", content: "Buka halaman KRS → pilih tab 'MK Diambil' → klik ikon hapus (🗑) pada baris mata kuliah → konfirmasi pembatalan. Perubahan akan langsung tersimpan." },
      { title: "Melihat Total SKS", content: "Total SKS ditampilkan di bagian atas halaman KRS beserta progress bar visual. Anda juga dapat melihat ringkasan di Dashboard dan halaman Profil." },
      { title: "Mencetak KRS", content: "Klik tombol 'Cetak KRS' di pojok kanan atas halaman KRS. Dokumen akan diunduh dalam format PDF yang sudah ditandatangani secara digital." },
    ],
  },
  {
    id: "akademik",
    icon: BookOpen,
    title: "Akademik & Nilai",
    color: "#7c3aed",
    bg: "#f3e8ff",
    link: "/akademik",
    steps: [
      { title: "Melihat KHS Semester Ini", content: "Buka halaman Akademik → tab 'KHS Semester Ini'. Tabel menampilkan semua mata kuliah beserta nilai huruf, bobot, dan perhitungan IPS." },
      { title: "Melihat Transkrip Lengkap", content: "Buka halaman Akademik → tab 'Transkrip Lengkap'. Klik pada setiap semester untuk melihat daftar mata kuliah dan nilai secara detail." },
      { title: "Melihat IPS dan IPK", content: "IPS dan IPK ditampilkan di kartu ringkasan pada halaman Akademik, Dashboard, dan Profil. IPK dihitung secara kumulatif dari seluruh semester." },
      { title: "Mengunduh Transkrip", content: "Klik tombol 'Unduh Transkrip' di pojok kanan atas halaman Akademik untuk mengunduh transkrip resmi dalam format PDF." },
    ],
  },
  {
    id: "keuangan",
    icon: CreditCard,
    title: "Keuangan & Pembayaran",
    color: "#f59e0b",
    bg: "#fff3e0",
    link: "/keuangan",
    steps: [
      { title: "Melihat Tagihan Aktif", content: "Buka halaman Keuangan → tab 'Tagihan & Pembayaran'. Tagihan yang belum dibayar ditampilkan dengan latar kuning dan tombol 'Bayar'." },
      { title: "Melakukan Pembayaran", content: "Klik tombol 'Bayar' → Anda akan diarahkan ke Payment Gateway. Gunakan Virtual Account BNI (kode: 8277 + NIM) untuk transfer." },
      { title: "Melihat Riwayat Pembayaran", content: "Buka halaman Keuangan → tab 'Riwayat Transaksi'. Semua transaksi ditampilkan dengan nomor bukti, tanggal, dan status." },
      { title: "Informasi Beasiswa", content: "Buka halaman Keuangan → tab 'Beasiswa' untuk melihat beasiswa aktif dan informasi beasiswa yang sedang dibuka pendaftarannya." },
    ],
  },
  {
    id: "perkuliahan",
    icon: MonitorPlay,
    title: "Perkuliahan & Absensi",
    color: "#10b981",
    bg: "#e8f5e9",
    link: "/perkuliahan",
    steps: [
      { title: "Memantau Kehadiran", content: "Buka halaman Perkuliahan → pilih mata kuliah → tab 'Absensi'. Persentase kehadiran ditampilkan beserta detail per pertemuan. Min. 75% untuk dapat mengikuti UAS." },
      { title: "Mengumpulkan Tugas", content: "Buka halaman Perkuliahan → pilih mata kuliah → tab 'Tugas & Kuis'. Klik tombol pada tugas yang ingin dikumpulkan dan unggah file." },
      { title: "Mengunduh Materi", content: "Buka halaman Perkuliahan → pilih mata kuliah → tab 'Materi'. Klik 'Unduh' pada materi yang tersedia (slide, PDF, video)." },
    ],
  },
  {
    id: "layanan",
    icon: Users,
    title: "Layanan Akademik",
    color: "#ec4899",
    bg: "#fce7f3",
    link: "/layanan",
    steps: [
      { title: "Mengajukan Surat Keterangan", content: "Buka halaman Layanan → pilih 'Surat Keterangan Aktif Kuliah' atau jenis surat lainnya → isi keterangan → klik 'Kirim Pengajuan'. Proses 1-3 hari kerja." },
      { title: "Melacak Status Pengajuan", content: "Buka halaman Layanan → tab 'Riwayat'. Setiap pengajuan memiliki nomor tracking (LAY-YYYY-XXXX) dan status terkini." },
      { title: "Mengajukan Cuti Akademik", content: "Pilih layanan 'Pengajuan Cuti Akademik' → isi keterangan → lampirkan dokumen pendukung (opsional) → submit minimal 1 bulan sebelum semester." },
    ],
  },
  {
    id: "profil",
    icon: User,
    title: "Profil & Pengaturan",
    color: "#64748b",
    bg: "#f1f5f9",
    link: "/profil",
    steps: [
      { title: "Mengubah Foto Profil", content: "Buka halaman Profil → klik tombol 'Edit Profil' → klik ikon kamera pada foto → pilih gambar dari perangkat. Format JPG/PNG, maks. 2MB." },
      { title: "Memperbarui Data Kontak", content: "Buka halaman Profil → klik 'Edit Profil' → ubah Email, Telepon, WhatsApp, atau Alamat Domisili → klik 'Simpan'. Data akademik tidak dapat diubah mandiri." },
      { title: "Mengubah Password", content: "Buka halaman Pengaturan → tab 'Keamanan' → isi form Ubah Password → klik 'Ubah Password'. Minimal 8 karakter." },
    ],
  },
];

const faqs = [
  { q: "Bagaimana cara mengambil mata kuliah di KRS?", a: "Buka halaman KRS → tab 'MK Tersedia' → klik tombol 'Ambil' pada mata kuliah yang diinginkan. Pastikan total SKS tidak melebihi batas maksimum berdasarkan IPK semester sebelumnya." },
  { q: "Bagaimana cara melihat IPK saya?", a: "IPK ditampilkan di beberapa lokasi: Kartu ringkasan di halaman Akademik, Profil Mahasiswa, Dashboard utama, dan Panel kanan (sidebar). IPK dihitung secara kumulatif dari seluruh nilai yang sudah masuk." },
  { q: "Bagaimana cara mengajukan surat keterangan aktif kuliah?", a: "Buka halaman Layanan → tab 'Buat Pengajuan' → pilih 'Surat Keterangan Aktif Kuliah' → isi keterangan tujuan → klik 'Kirim Pengajuan'. Proses 2 hari kerja. Dokumen dapat diambil di loket BAK." },
  { q: "Bagaimana cara melihat tagihan UKT?", a: "Buka halaman Keuangan → tab 'Tagihan & Pembayaran'. Tagihan aktif ditampilkan di bagian atas beserta nominal dan jatuh tempo. Gunakan Virtual Account BNI (8277 + NIM) untuk pembayaran." },
  { q: "Bagaimana cara mengubah foto profil?", a: "Buka halaman Profil → klik tombol 'Edit Profil' → klik ikon kamera (📷) di pojok kanan bawah foto profil → pilih gambar dari perangkat. Format JPG atau PNG, ukuran maksimal 2MB." },
  { q: "Bagaimana cara melihat jadwal kuliah?", a: "Buka halaman Jadwal Kuliah dari sidebar atau navigasi utama. Tersedia dua tampilan: Grid (visual jam per jam) dan List (per hari). Jadwal secara otomatis terisi berdasarkan KRS yang telah diambil." },
  { q: "Bagaimana cara melihat kehadiran kuliah?", a: "Buka halaman Perkuliahan → pilih mata kuliah dari selector di bagian atas → tab 'Absensi'. Persentase kehadiran dan rekap per pertemuan ditampilkan. Minimal 75% untuk bisa ikut UAS." },
  { q: "Apa yang harus dilakukan jika lupa password?", a: "Klik 'Lupa Password' di halaman login → masukkan NIM atau email kampus → instruksi reset password akan dikirim ke email terdaftar. Jika email tidak aktif, hubungi admin di helpdesk@univ.ac.id." },
  { q: "Bagaimana cara melihat kalender akademik?", a: "Kalender akademik tersedia di dua tempat: (1) Halaman Dashboard — bagian tengah, dan (2) Halaman Informasi → tab 'Kalender Akademik'. Klik tanggal untuk melihat detail event akademik." },
  { q: "Kapan batas pengisian KRS?", a: "Setiap semester, periode pengisian KRS dibuka sesuai kalender akademik. Umumnya berlangsung 2 minggu sebelum perkuliahan dimulai. Pantau pengumuman di halaman Informasi untuk jadwal terbaru." },
];

export function BantuanPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedGuide, setExpandedGuide] = useState<string | null>("krs");
  const [expandedStep, setExpandedStep] = useState<string | null>(null);
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<"panduan" | "faq" | "kontak">("panduan");

  const filteredFaqs = faqs.filter(
    (f) => f.q.toLowerCase().includes(searchQuery.toLowerCase()) || f.a.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const filteredGuides = guides.filter(
    (g) => g.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
           g.steps.some((s) => s.title.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="flex flex-col gap-5" style={SM}>
      {/* Header */}
      <div className="bg-white border border-[#c4c6cf] rounded p-5">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded flex items-center justify-center" style={{ background: "#e8f0fb" }}>
              <HelpCircle className="w-5 h-5" style={{ color: "#0061a5" }} />
            </div>
            <div>
              <h2 style={{ fontSize: 22, fontWeight: 700, color: "#002045", letterSpacing: "-0.01em" }}>Bantuan & Buku Panduan</h2>
              <p style={{ fontSize: 13, color: "#43474e", marginTop: 2 }}>Panduan penggunaan SIAKAD, FAQ, dan informasi dukungan</p>
            </div>
          </div>
          <div className="flex-1 sm:max-w-xs sm:ml-auto">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: "#595c63" }} />
              <input
                type="text"
                placeholder="Cari panduan atau FAQ..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 rounded border border-[#c4c6cf] focus:outline-none focus:border-[#0061a5] transition-colors"
                style={{ fontSize: 13, ...SM }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Quick access cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {guides.map((g) => (
          <Link
            key={g.id}
            to={g.link}
            className="group bg-white border border-[#c4c6cf] rounded p-3.5 flex flex-col items-center gap-2 text-center hover:border-[#0061a5] hover:shadow-sm transition-all"
          >
            <div className="w-9 h-9 rounded flex items-center justify-center" style={{ background: g.bg }}>
              <g.icon className="w-4 h-4" style={{ color: g.color }} />
            </div>
            <span style={{ fontSize: 12, fontWeight: 600, color: "#002045", lineHeight: 1.3 }}>{g.title.split(" ")[0]}</span>
          </Link>
        ))}
      </div>

      {/* Tabs */}
      <div className="bg-white border border-[#c4c6cf] rounded overflow-hidden">
        <div className="flex border-b border-[#e0e3e5]">
          {[
            { id: "panduan", label: "Panduan Singkat", icon: BookOpen },
            { id: "faq", label: "FAQ", icon: HelpCircle },
            { id: "kontak", label: "Pusat Bantuan", icon: MessageCircle },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className="flex items-center gap-2 px-5 py-3 border-b-2 transition-colors"
              style={{
                fontSize: 13,
                fontWeight: 500,
                borderBottomColor: activeTab === tab.id ? "#002045" : "transparent",
                color: activeTab === tab.id ? "#002045" : "#43474e",
                background: activeTab === tab.id ? "#f7fafc" : "transparent",
              }}
            >
              <tab.icon className="w-3.5 h-3.5" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* --- PANDUAN --- */}
        {activeTab === "panduan" && (
          <div className="p-5 flex flex-col gap-3">
            {filteredGuides.length === 0 && (
              <p style={{ fontSize: 13, color: "#595c63", textAlign: "center", padding: "24px 0" }}>Tidak ada panduan yang sesuai dengan pencarian.</p>
            )}
            {filteredGuides.map((guide) => (
              <div key={guide.id} className="border border-[#e0e3e5] rounded overflow-hidden">
                {/* Guide header */}
                <button
                  className="w-full flex items-center gap-3 px-5 py-4 hover:bg-[#f7fafc] transition-colors text-left"
                  onClick={() => setExpandedGuide(expandedGuide === guide.id ? null : guide.id)}
                >
                  <div className="w-9 h-9 rounded flex items-center justify-center shrink-0" style={{ background: guide.bg }}>
                    <guide.icon className="w-4 h-4" style={{ color: guide.color }} />
                  </div>
                  <div className="flex-1">
                    <span style={{ fontSize: 14, fontWeight: 700, color: "#002045" }}>{guide.title}</span>
                    <p style={{ fontSize: 12, color: "#595c63", marginTop: 1 }}>{guide.steps.length} panduan tersedia</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Link
                      to={guide.link}
                      onClick={(e) => e.stopPropagation()}
                      className="flex items-center gap-1 px-3 py-1.5 rounded border border-[#c4c6cf] hover:border-[#0061a5] transition-colors shrink-0"
                      style={{ fontSize: 11, color: "#002045" }}
                    >
                      <ExternalLink className="w-3 h-3" />
                      Buka
                    </Link>
                    <ChevronDown
                      className="w-4 h-4 transition-transform shrink-0"
                      style={{ color: "#595c63", transform: expandedGuide === guide.id ? "rotate(180deg)" : "none" }}
                    />
                  </div>
                </button>

                {/* Steps accordion */}
                {expandedGuide === guide.id && (
                  <div className="border-t border-[#e0e3e5]">
                    {guide.steps.map((step, idx) => {
                      const key = `${guide.id}-${idx}`;
                      return (
                        <div key={idx} className="border-b border-[#e0e3e5] last:border-0">
                          <button
                            className="w-full flex items-center gap-3 px-5 py-3 hover:bg-[#f7fafc] transition-colors text-left"
                            onClick={() => setExpandedStep(expandedStep === key ? null : key)}
                          >
                            <div className="w-6 h-6 rounded-full flex items-center justify-center shrink-0" style={{ background: guide.bg, color: guide.color, fontSize: 11, fontWeight: 800, ...MONO }}>
                              {idx + 1}
                            </div>
                            <span className="flex-1" style={{ fontSize: 13, fontWeight: 600, color: "#181c1e" }}>{step.title}</span>
                            <ChevronDown className="w-3.5 h-3.5 shrink-0 transition-transform" style={{ color: "#595c63", transform: expandedStep === key ? "rotate(180deg)" : "none" }} />
                          </button>
                          {expandedStep === key && (
                            <div className="px-5 pb-4 pl-14">
                              <p style={{ fontSize: 13, color: "#43474e", lineHeight: 1.7 }}>{step.content}</p>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* --- FAQ --- */}
        {activeTab === "faq" && (
          <div className="p-5 flex flex-col gap-2">
            <p style={{ fontSize: 12, color: "#595c63", marginBottom: 8 }}>
              {filteredFaqs.length} pertanyaan {searchQuery ? "sesuai pencarian" : "umum"} tersedia
            </p>
            {filteredFaqs.length === 0 && (
              <p style={{ fontSize: 13, color: "#595c63", textAlign: "center", padding: "24px 0" }}>Tidak ada FAQ yang sesuai dengan pencarian.</p>
            )}
            {filteredFaqs.map((faq, idx) => (
              <div key={idx} className="border border-[#e0e3e5] rounded overflow-hidden">
                <button
                  className="w-full flex items-start gap-3 px-5 py-4 hover:bg-[#f7fafc] transition-colors text-left"
                  onClick={() => setExpandedFaq(expandedFaq === idx ? null : idx)}
                >
                  <div className="w-6 h-6 rounded flex items-center justify-center shrink-0 mt-0.5" style={{ background: "#e8f0fb" }}>
                    <HelpCircle className="w-3.5 h-3.5" style={{ color: "#0061a5" }} />
                  </div>
                  <span className="flex-1" style={{ fontSize: 13, fontWeight: 600, color: "#002045", lineHeight: 1.4 }}>{faq.q}</span>
                  <ChevronDown className="w-4 h-4 shrink-0 transition-transform mt-0.5" style={{ color: "#595c63", transform: expandedFaq === idx ? "rotate(180deg)" : "none" }} />
                </button>
                {expandedFaq === idx && (
                  <div className="px-5 pb-4 pl-14 border-t border-[#e0e3e5]" style={{ background: "#f7fafc" }}>
                    <p style={{ fontSize: 13, color: "#43474e", lineHeight: 1.7, paddingTop: 12 }}>{faq.a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* --- KONTAK / PUSAT BANTUAN --- */}
        {activeTab === "kontak" && (
          <div className="p-5 flex flex-col gap-5">
            {/* Contact cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { icon: Mail, title: "Email Akademik", value: "akademik@univ.ac.id", sub: "Respons 1–2 hari kerja", color: "#0061a5", bg: "#e8f0fb" },
                { icon: Phone, title: "Kontak Administrasi", value: "(021) 5551234", sub: "Senin–Jumat 08.00–16.00", color: "#10b981", bg: "#e8f5e9" },
                { icon: MessageCircle, title: "WhatsApp Helpdesk", value: "0821-1234-5678", sub: "Senin–Jumat 08.00–16.00", color: "#7c3aed", bg: "#f3e8ff" },
                { icon: Clock, title: "Jam Operasional", value: "Senin – Jumat", sub: "08.00 – 16.00 WIB", color: "#f59e0b", bg: "#fff3e0" },
              ].map((c) => (
                <div key={c.title} className="bg-white border border-[#c4c6cf] rounded p-4 flex flex-col gap-3">
                  <div className="w-10 h-10 rounded flex items-center justify-center" style={{ background: c.bg }}>
                    <c.icon className="w-5 h-5" style={{ color: c.color }} />
                  </div>
                  <div>
                    <p style={{ fontSize: 11, color: "#595c63", ...MONO }}>{c.title.toUpperCase()}</p>
                    <p style={{ fontSize: 14, fontWeight: 700, color: "#002045", marginTop: 2 }}>{c.value}</p>
                    <p style={{ fontSize: 11, color: "#595c63", marginTop: 2 }}>{c.sub}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Unit contacts */}
            <div className="bg-white border border-[#c4c6cf] rounded overflow-hidden">
              <div className="px-5 py-3 border-b border-[#e0e3e5]" style={{ background: "#f7fafc" }}>
                <p style={{ fontSize: 13, fontWeight: 700, color: "#002045" }}>Direktori Kontak Unit</p>
              </div>
              <div className="divide-y divide-[#e0e3e5]">
                {[
                  { unit: "Biro Administrasi Akademik (BAK)", email: "bak@univ.ac.id", ext: "101", location: "Gedung Rektorat Lt. 1" },
                  { unit: "Biro Keuangan", email: "keuangan@univ.ac.id", ext: "102", location: "Gedung Rektorat Lt. 2" },
                  { unit: "IT Support / Helpdesk Sistem", email: "helpdesk@univ.ac.id", ext: "201", location: "Gedung ICT Lt. 1" },
                  { unit: "Perpustakaan", email: "library@univ.ac.id", ext: "301", location: "Gedung Perpustakaan" },
                  { unit: "Kemahasiswaan", email: "kemahasiswaan@univ.ac.id", ext: "401", location: "Gedung Rektorat Lt. 3" },
                  { unit: "Prodi Sistem Informasi", email: "si@univ.ac.id", ext: "501", location: "Gedung C Lt. 2" },
                ].map((u) => (
                  <div key={u.unit} className="px-5 py-3 flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6">
                    <p style={{ fontSize: 13, fontWeight: 600, color: "#181c1e" }} className="flex-1">{u.unit}</p>
                    <div className="flex flex-wrap gap-4">
                      <span style={{ fontSize: 12, color: "#0061a5", ...MONO }}>{u.email}</span>
                      <span style={{ fontSize: 12, color: "#595c63" }}>Ext. {u.ext}</span>
                      <span style={{ fontSize: 12, color: "#595c63" }}>{u.location}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* System info */}
            <div className="bg-white border border-[#c4c6cf] rounded p-5">
              <p style={{ fontSize: 14, fontWeight: 700, color: "#002045", marginBottom: 12 }}>Informasi Sistem</p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { label: "Versi Sistem", value: "SIAKAD v3.2.1" },
                  { label: "Terakhir Diperbarui", value: "23 Jun 2026" },
                  { label: "Browser Support", value: "Chrome, Firefox, Safari" },
                  { label: "Status Sistem", value: "● Operasional" },
                ].map((info) => (
                  <div key={info.label} className="p-3 rounded" style={{ background: "#f7fafc" }}>
                    <p style={{ fontSize: 10, color: "#595c63", ...MONO }}>{info.label.toUpperCase()}</p>
                    <p style={{ fontSize: 12, fontWeight: 600, color: info.value.includes("●") ? "#10b981" : "#002045", marginTop: 2 }}>{info.value}</p>
                  </div>
                ))}
              </div>
              <div className="mt-4 p-3.5 rounded border border-blue-200 bg-blue-50 flex items-start gap-3">
                <HelpCircle className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
                <p style={{ fontSize: 12, color: "#1e40af", lineHeight: 1.6 }}>
                  Jika mengalami kendala teknis (tidak bisa login, halaman error, dll.), hubungi IT Support di <strong>helpdesk@univ.ac.id</strong> atau WhatsApp <strong>0821-1234-5678</strong> dengan menyertakan: NIM, nama halaman, dan screenshot error.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
