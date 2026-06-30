import { useState } from "react";
import { useAppContext } from "../context/AppContext";
import { Megaphone, AlertCircle, Info as InfoIcon, CheckCircle2, Calendar, Search, Filter, ExternalLink, Bell } from "lucide-react";
import { AcademicCalendar } from "./AcademicCalendar";

const SM = { fontFamily: "'Hanken Grotesk', sans-serif" } as const;
const MONO = { fontFamily: "'JetBrains Mono', monospace" } as const;

const TYPE_CONFIG = {
  warning:     { icon: AlertCircle, bg: "bg-amber-50",  border: "border-amber-200",  iconColor: "text-amber-500",  titleColor: "text-amber-800",  bodyColor: "text-amber-700",  datColor: "text-amber-600",  badge: "bg-amber-100 text-amber-700" },
  info:        { icon: InfoIcon,    bg: "bg-blue-50",   border: "border-blue-200",   iconColor: "text-blue-500",   titleColor: "text-blue-800",   bodyColor: "text-blue-700",   datColor: "text-blue-600",   badge: "bg-blue-100 text-blue-700" },
  success:     { icon: CheckCircle2,bg: "bg-green-50",  border: "border-green-200",  iconColor: "text-green-500",  titleColor: "text-green-800",  bodyColor: "text-green-700",  datColor: "text-green-600",  badge: "bg-green-100 text-green-700" },
  error:       { icon: AlertCircle, bg: "bg-red-50",    border: "border-red-200",    iconColor: "text-red-500",    titleColor: "text-red-800",    bodyColor: "text-red-700",    datColor: "text-red-600",    badge: "bg-red-100 text-red-700" },
};

const CATEGORY_LABELS: Record<string, string> = {
  KRS: "KRS",
  Keuangan: "Keuangan",
  Akademik: "Akademik",
  Kalender: "Kalender",
  KKN: "KKN",
};

const extraNews = [
  {
    id: "ext1",
    title: "Pendaftaran Wisuda Periode Oktober 2026 Dibuka",
    date: "22 Jun 2026",
    category: "Akademik",
    type: "info" as const,
    content: "Pendaftaran wisuda periode Oktober 2026 telah resmi dibuka. Mahasiswa yang telah menyelesaikan seluruh persyaratan akademik dapat mendaftar melalui portal SIAKAD hingga 15 Agustus 2026.",
    source: "Biro Akademik",
  },
  {
    id: "ext2",
    title: "Hasil Seleksi Asisten Laboratorium 2026/2027",
    date: "20 Jun 2026",
    category: "Akademik",
    type: "success" as const,
    content: "Hasil seleksi asisten laboratorium untuk tahun akademik 2026/2027 telah diumumkan. Daftar nama mahasiswa yang lolos seleksi dapat dilihat di papan pengumuman Gedung C lantai 2.",
    source: "Lab. Sistem Informasi",
  },
  {
    id: "ext3",
    title: "Perubahan Jadwal Kuliah Pengganti",
    date: "19 Jun 2026",
    category: "Akademik",
    type: "warning" as const,
    content: "Kuliah pengganti untuk mata kuliah IF3203 (Sistem Enterprise) akibat libur Idul Adha akan dilaksanakan pada Sabtu, 21 Juni 2026 pukul 09.00–11.30 WIB di Lab Keamanan.",
    source: "Prodi Sistem Informasi",
  },
  {
    id: "ext4",
    title: "Kompetisi Hackathon InnovateTech 2026",
    date: "15 Jun 2026",
    category: "Kegiatan",
    type: "info" as const,
    content: "Universitas Nusantara mengundang mahasiswa untuk berpartisipasi dalam Hackathon InnovateTech 2026 yang akan diselenggarakan pada 10–12 Juli 2026. Total hadiah Rp 50.000.000. Daftar tim (3–5 orang) sebelum 5 Juli 2026.",
    source: "UKM IT Nusantara",
  },
];

export function InformasiPage() {
  const { announcements } = useAppContext();
  const [activeTab, setActiveTab] = useState<"pengumuman" | "kalender" | "berita">("pengumuman");
  const [categoryFilter, setCategoryFilter] = useState("Semua");
  const [searchQuery, setSearchQuery] = useState("");

  const allAnnouncements = [...announcements, ...extraNews.map((n) => ({ ...n, id: n.id }))];
  const categories = ["Semua", ...Array.from(new Set(allAnnouncements.map((a: any) => a.category ?? "Umum")))];

  const filtered = allAnnouncements.filter((a: any) => {
    const matchCat = categoryFilter === "Semua" || (a.category ?? "Umum") === categoryFilter;
    const matchSearch = a.title.toLowerCase().includes(searchQuery.toLowerCase()) || a.content.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <div className="flex flex-col gap-5" style={SM}>
      {/* Header */}
      <div className="bg-white border border-[#c4c6cf] rounded p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 style={{ fontSize: 22, fontWeight: 700, color: "#002045", letterSpacing: "-0.01em" }}>Informasi Kampus</h2>
            <p style={{ fontSize: 13, color: "#43474e", marginTop: 4 }}>
              Pengumuman resmi, kalender akademik, dan berita terkini
            </p>
          </div>
          <div className="flex items-center gap-2 px-3 py-2 rounded border border-[#c4c6cf]" style={{ fontSize: 12, color: "#43474e" }}>
            <Bell className="w-4 h-4" style={{ color: "#0061a5" }} />
            <span>{announcements.length} pengumuman baru</span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white border border-[#c4c6cf] rounded overflow-hidden">
        <div className="flex border-b border-[#e0e3e5]">
          {[
            { id: "pengumuman", label: "Pengumuman" },
            { id: "kalender", label: "Kalender Akademik" },
            { id: "berita", label: "Berita & Kegiatan" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className="px-5 py-3 border-b-2 transition-colors"
              style={{
                fontSize: 13,
                fontWeight: 500,
                borderBottomColor: activeTab === tab.id ? "#002045" : "transparent",
                color: activeTab === tab.id ? "#002045" : "#43474e",
                background: activeTab === tab.id ? "#f7fafc" : "transparent",
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {activeTab === "pengumuman" && (
          <div className="p-5 flex flex-col gap-4">
            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5" style={{ color: "#595c63" }} />
                <input
                  type="text"
                  placeholder="Cari pengumuman..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 rounded border border-[#c4c6cf] focus:outline-none focus:border-[#0061a5] transition-colors"
                  style={{ fontSize: 13, ...SM }}
                />
              </div>
              <div className="flex flex-wrap gap-1">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setCategoryFilter(cat)}
                    className="px-3 py-1.5 rounded border transition-colors text-xs"
                    style={{
                      borderColor: categoryFilter === cat ? "#0061a5" : "#c4c6cf",
                      background: categoryFilter === cat ? "#e8f0fb" : "transparent",
                      color: categoryFilter === cat ? "#0061a5" : "#43474e",
                      fontWeight: categoryFilter === cat ? 600 : 400,
                    }}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Announcements List */}
            <div className="flex flex-col gap-3">
              {filtered.map((ann: any) => {
                const cfg = TYPE_CONFIG[ann.type] ?? TYPE_CONFIG.info;
                const Icon = cfg.icon;
                return (
                  <div key={ann.id} className={`border rounded p-4 flex gap-4 ${cfg.bg} ${cfg.border}`}>
                    <div className="shrink-0 mt-0.5">
                      <Icon className={`w-5 h-5 ${cfg.iconColor}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-start justify-between gap-2 mb-1.5">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h4 className={`font-semibold leading-tight ${cfg.titleColor}`} style={{ fontSize: 14 }}>
                            {ann.title}
                          </h4>
                          {ann.category && (
                            <span className={`px-2 py-0.5 rounded text-xs font-semibold ${cfg.badge}`} style={MONO}>
                              {ann.category}
                            </span>
                          )}
                        </div>
                        <span className={`text-xs whitespace-nowrap shrink-0 ${cfg.datColor}`} style={MONO}>
                          {ann.date}
                        </span>
                      </div>
                      <p className={`leading-relaxed ${cfg.bodyColor}`} style={{ fontSize: 13 }}>
                        {ann.content}
                      </p>
                      {ann.source && (
                        <p className={`mt-2 text-xs opacity-70 ${cfg.bodyColor}`} style={MONO}>
                          Sumber: {ann.source}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
              {filtered.length === 0 && (
                <div className="py-10 text-center" style={{ fontSize: 13, color: "#595c63" }}>
                  Tidak ada pengumuman yang sesuai dengan filter.
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === "kalender" && (
          <div className="p-5">
            <AcademicCalendar />
          </div>
        )}

        {activeTab === "berita" && (
          <div className="p-5 flex flex-col gap-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {extraNews.map((news) => {
                const cfg = TYPE_CONFIG[news.type];
                const Icon = cfg.icon;
                return (
                  <div key={news.id} className={`border rounded p-4 flex flex-col gap-3 ${cfg.bg} ${cfg.border}`}>
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <Icon className={`w-4 h-4 shrink-0 ${cfg.iconColor}`} />
                        <span className={`text-xs font-bold px-2 py-0.5 rounded ${cfg.badge}`} style={MONO}>
                          {news.category}
                        </span>
                      </div>
                      <span className={`text-xs whitespace-nowrap ${cfg.datColor}`} style={MONO}>{news.date}</span>
                    </div>
                    <div>
                      <h4 className={`font-semibold leading-tight ${cfg.titleColor}`} style={{ fontSize: 14 }}>{news.title}</h4>
                      <p className={`mt-2 leading-relaxed line-clamp-3 ${cfg.bodyColor}`} style={{ fontSize: 12 }}>
                        {news.content}
                      </p>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className={`text-xs opacity-70 ${cfg.bodyColor}`} style={MONO}>{news.source}</span>
                      <button className={`flex items-center gap-1 text-xs font-medium ${cfg.datColor} hover:underline`}>
                        <ExternalLink className="w-3 h-3" />
                        Baca selengkapnya
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Quick Links */}
            <div className="border border-[#c4c6cf] rounded p-4 mt-2">
              <p style={{ fontSize: 13, fontWeight: 700, color: "#002045", marginBottom: 12 }}>Tautan Penting</p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { label: "Website Universitas", url: "#" },
                  { label: "Portal E-Learning", url: "#" },
                  { label: "Perpustakaan Digital", url: "#" },
                  { label: "Career Center", url: "#" },
                  { label: "UKM & Organisasi", url: "#" },
                  { label: "Beasiswa & Bantuan", url: "#" },
                  { label: "Jadwal Dosen", url: "#" },
                  { label: "Pengaduan Mahasiswa", url: "#" },
                ].map((link) => (
                  <button
                    key={link.label}
                    className="flex items-center gap-2 p-3 rounded border border-[#e0e3e5] hover:border-[#0061a5] transition-colors text-left"
                    style={{ fontSize: 12, color: "#43474e" }}
                  >
                    <ExternalLink className="w-3.5 h-3.5 shrink-0" style={{ color: "#0061a5" }} />
                    {link.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
