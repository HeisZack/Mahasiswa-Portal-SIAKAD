import { useState } from "react";
import { FileText, Send, CheckCircle2, Clock, AlertCircle, Upload, Search, ChevronDown } from "lucide-react";
import { toast } from "sonner";

const SM = { fontFamily: "'Hanken Grotesk', sans-serif" } as const;
const MONO = { fontFamily: "'JetBrains Mono', monospace" } as const;

const SERVICES = [
  { id: "aktif_kuliah", label: "Surat Keterangan Aktif Kuliah", category: "Surat", duration: "2 hari kerja", fee: 0 },
  { id: "mahasiswa", label: "Surat Keterangan Mahasiswa", category: "Surat", duration: "2 hari kerja", fee: 0 },
  { id: "lulus", label: "Surat Keterangan Lulus (SKL)", category: "Surat", duration: "3 hari kerja", fee: 0 },
  { id: "penelitian", label: "Surat Keterangan Penelitian", category: "Surat", duration: "3 hari kerja", fee: 0 },
  { id: "legalisir_ijazah", label: "Legalisir Ijazah", category: "Legalisir", duration: "5 hari kerja", fee: 5000 },
  { id: "legalisir_transkrip", label: "Legalisir Transkrip Nilai", category: "Legalisir", duration: "5 hari kerja", fee: 5000 },
  { id: "cuti", label: "Pengajuan Cuti Akademik", category: "Akademik", duration: "5 hari kerja", fee: 0 },
  { id: "aktif_kembali", label: "Aktif Kembali dari Cuti", category: "Akademik", duration: "3 hari kerja", fee: 0 },
  { id: "pindah", label: "Pengajuan Pindah Program Studi", category: "Akademik", duration: "14 hari kerja", fee: 0 },
  { id: "pengganti_ktm", label: "Pengganti KTM Hilang", category: "Administrasi", duration: "3 hari kerja", fee: 50000 },
  { id: "bebas_perpustakaan", label: "Surat Bebas Perpustakaan", category: "Administrasi", duration: "1 hari kerja", fee: 0 },
  { id: "bebas_lab", label: "Surat Bebas Laboratorium", category: "Administrasi", duration: "1 hari kerja", fee: 0 },
];

type RequestHistoryItem = {
  id: string;
  no: string;
  date: string;
  service: string;
  status: "Selesai" | "Diproses" | "Menunggu" | "Ditolak";
  note?: string;
  estimasi?: string;
};

const historyData: RequestHistoryItem[] = [
  { id: "h1", no: "LAY-2026-0001", date: "01 Jun 2026", service: "Surat Keterangan Aktif Kuliah", status: "Selesai", note: "Dokumen dapat diambil di loket BAK" },
  { id: "h2", no: "LAY-2026-0002", date: "10 Jun 2026", service: "Legalisir Transkrip Nilai", status: "Diproses", estimasi: "20 Jun 2026" },
  { id: "h3", no: "LAY-2026-0003", date: "18 Jun 2026", service: "Surat Keterangan Penelitian", status: "Menunggu", estimasi: "24 Jun 2026" },
  { id: "h4", no: "LAY-2023-0015", date: "05 Okt 2023", service: "Pengganti KTM Hilang", status: "Selesai" },
  { id: "h5", no: "LAY-2024-0008", date: "12 Mar 2024", service: "Surat Keterangan Aktif Kuliah", status: "Selesai" },
];

const STATUS_STYLE: Record<string, { bg: string; text: string }> = {
  Selesai:   { bg: "bg-green-100", text: "text-green-700" },
  Diproses:  { bg: "bg-blue-100",  text: "text-blue-700" },
  Menunggu:  { bg: "bg-yellow-100", text: "text-yellow-700" },
  Ditolak:   { bg: "bg-red-100",   text: "text-red-700" },
};

export function LayananPage() {
  const [activeTab, setActiveTab] = useState<"form" | "riwayat" | "panduan">("form");
  const [selectedService, setSelectedService] = useState("");
  const [notes, setNotes] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("Semua");
  const [searchQuery, setSearchQuery] = useState("");

  const selectedServiceObj = SERVICES.find((s) => s.id === selectedService);
  const categories = ["Semua", ...Array.from(new Set(SERVICES.map((s) => s.category)))];
  const filteredServices = SERVICES.filter((s) => {
    const matchCat = categoryFilter === "Semua" || s.category === categoryFilter;
    const matchSearch = s.label.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchSearch;
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedService) return;
    const no = `LAY-2026-${String(Math.floor(Math.random() * 9000) + 1000).padStart(4, "0")}`;
    toast.success("Pengajuan berhasil dikirim!", {
      description: `No. Pengajuan: ${no}. Admin akan memproses dalam ${selectedServiceObj?.duration}.`,
    });
    setSelectedService("");
    setNotes("");
  };

  return (
    <div className="flex flex-col gap-5" style={SM}>
      {/* Header */}
      <div className="bg-white border border-[#c4c6cf] rounded p-5">
        <h2 style={{ fontSize: 22, fontWeight: 700, color: "#002045", letterSpacing: "-0.01em" }}>Layanan Akademik</h2>
        <p style={{ fontSize: 13, color: "#43474e", marginTop: 4 }}>
          Pengajuan surat, legalisir, cuti akademik, dan layanan administrasi lainnya
        </p>
      </div>

      {/* Status summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: "Total Pengajuan", value: historyData.length, color: "#002045", bg: "#e8f0fb" },
          { label: "Diproses", value: historyData.filter((h) => h.status === "Diproses").length, color: "#0061a5", bg: "#e8f0fb" },
          { label: "Menunggu", value: historyData.filter((h) => h.status === "Menunggu").length, color: "#b45309", bg: "#fef3c7" },
          { label: "Selesai", value: historyData.filter((h) => h.status === "Selesai").length, color: "#10b981", bg: "#e8f5e9" },
        ].map((s) => (
          <div key={s.label} className="bg-white border border-[#c4c6cf] rounded p-4">
            <div className="w-8 h-8 rounded flex items-center justify-center mb-2" style={{ background: s.bg }}>
              <span style={{ fontSize: 14, fontWeight: 800, color: s.color, ...MONO }}>{s.value}</span>
            </div>
            <p style={{ fontSize: 11, color: "#595c63", ...MONO, letterSpacing: "0.03em" }}>{s.label.toUpperCase()}</p>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="bg-white border border-[#c4c6cf] rounded overflow-hidden">
        <div className="flex border-b border-[#e0e3e5]">
          {[
            { id: "form", label: "Buat Pengajuan" },
            { id: "riwayat", label: `Riwayat (${historyData.length})` },
            { id: "panduan", label: "Panduan Layanan" },
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

        {activeTab === "form" && (
          <div className="p-5">
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
              {/* Service Picker */}
              <div className="lg:col-span-3 flex flex-col gap-3">
                <p style={{ fontSize: 13, fontWeight: 600, color: "#002045" }}>Pilih Jenis Layanan</p>

                {/* Search + Category Filter */}
                <div className="flex flex-col sm:flex-row gap-2">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5" style={{ color: "#595c63" }} />
                    <input
                      type="text"
                      placeholder="Cari layanan..."
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

                <div className="grid grid-cols-1 gap-2 max-h-72 overflow-y-auto rounded border border-[#e0e3e5] p-2" style={{ scrollbarWidth: "thin" }}>
                  {filteredServices.map((service) => (
                    <button
                      key={service.id}
                      onClick={() => setSelectedService(service.id)}
                      className="flex items-center justify-between p-3 rounded border text-left transition-colors"
                      style={{
                        borderColor: selectedService === service.id ? "#002045" : "#e0e3e5",
                        background: selectedService === service.id ? "#f7fafc" : "white",
                      }}
                    >
                      <div>
                        <p style={{ fontSize: 13, fontWeight: 500, color: "#181c1e" }}>{service.label}</p>
                        <div className="flex items-center gap-3 mt-0.5">
                          <span style={{ fontSize: 10, background: "#e8f0fb", color: "#0061a5", padding: "1px 6px", borderRadius: 4, ...MONO }}>{service.category}</span>
                          <span style={{ fontSize: 11, color: "#595c63" }}>{service.duration}</span>
                          {service.fee > 0 && (
                            <span style={{ fontSize: 11, color: "#b45309" }}>Rp {service.fee.toLocaleString("id-ID")}</span>
                          )}
                        </div>
                      </div>
                      {selectedService === service.id && (
                        <CheckCircle2 className="w-4 h-4 shrink-0" style={{ color: "#002045" }} />
                      )}
                    </button>
                  ))}
                  {filteredServices.length === 0 && (
                    <div className="py-6 text-center" style={{ fontSize: 13, color: "#595c63" }}>Tidak ada layanan ditemukan.</div>
                  )}
                </div>
              </div>

              {/* Form */}
              <div className="lg:col-span-2">
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                  {selectedServiceObj && (
                    <div className="p-3.5 rounded border border-[#0061a5]" style={{ background: "#e8f0fb" }}>
                      <p style={{ fontSize: 12, fontWeight: 600, color: "#002045" }}>{selectedServiceObj.label}</p>
                      <div className="flex gap-4 mt-1.5">
                        <span style={{ fontSize: 11, color: "#43474e" }}>Estimasi: <strong>{selectedServiceObj.duration}</strong></span>
                        {selectedServiceObj.fee > 0 && (
                          <span style={{ fontSize: 11, color: "#b45309" }}>Biaya: <strong>Rp {selectedServiceObj.fee.toLocaleString("id-ID")}</strong></span>
                        )}
                      </div>
                    </div>
                  )}

                  <div className="flex flex-col gap-1.5">
                    <label style={{ fontSize: 12, fontWeight: 600, color: "#002045" }}>Keterangan Tambahan</label>
                    <textarea
                      rows={5}
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="Tuliskan keperluan atau keterangan tambahan..."
                      className="border border-[#c4c6cf] rounded px-3 py-2 resize-none focus:outline-none focus:border-[#0061a5] transition-colors"
                      style={{ fontSize: 13, ...SM }}
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label style={{ fontSize: 12, fontWeight: 600, color: "#002045" }}>Lampiran (opsional)</label>
                    <div className="border border-dashed border-[#c4c6cf] rounded p-4 flex flex-col items-center gap-2 hover:border-[#0061a5] transition-colors cursor-pointer">
                      <Upload className="w-5 h-5" style={{ color: "#595c63" }} />
                      <p style={{ fontSize: 12, color: "#595c63" }}>Klik untuk unggah dokumen pendukung</p>
                      <p style={{ fontSize: 10, color: "#595c63", ...MONO }}>PDF, JPG, PNG — Maks. 5MB</p>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={!selectedService}
                    className="flex items-center justify-center gap-2 py-2.5 rounded font-semibold transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                    style={{ background: "#002045", color: "#ffffff", fontSize: 14 }}
                  >
                    <Send className="w-4 h-4" />
                    Kirim Pengajuan
                  </button>
                </form>
              </div>
            </div>
          </div>
        )}

        {activeTab === "riwayat" && (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr style={{ background: "#f1f4f6", borderBottom: "1px solid #e0e3e5" }}>
                  {["NO. PENGAJUAN", "TANGGAL", "JENIS LAYANAN", "STATUS", "KETERANGAN"].map((h) => (
                    <th key={h} className="px-4 py-3 text-left" style={{ fontSize: 10, color: "#595c63", ...MONO, letterSpacing: "0.05em" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {historyData.map((item) => (
                  <tr key={item.id} className="border-b border-[#e0e3e5] hover:bg-[#f7fafc]">
                    <td className="px-4 py-3" style={{ fontSize: 11, color: "#0061a5", ...MONO, fontWeight: 600 }}>{item.no}</td>
                    <td className="px-4 py-3" style={{ fontSize: 12, color: "#43474e", ...MONO }}>{item.date}</td>
                    <td className="px-4 py-3" style={{ fontSize: 13, fontWeight: 500, color: "#181c1e" }}>{item.service}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${STATUS_STYLE[item.status]?.bg ?? "bg-gray-100"} ${STATUS_STYLE[item.status]?.text ?? "text-gray-700"}`} style={MONO}>
                        {item.status}
                      </span>
                    </td>
                    <td className="px-4 py-3" style={{ fontSize: 12, color: "#43474e" }}>
                      {item.note ?? item.estimasi ? `Est. ${item.estimasi}` : "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === "panduan" && (
          <div className="p-5 flex flex-col gap-5">
            <div className="flex items-start gap-3 p-4 rounded border border-blue-200 bg-blue-50">
              <AlertCircle className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
              <p style={{ fontSize: 12, color: "#1e40af", lineHeight: 1.6 }}>
                Pengajuan layanan hanya dapat dilakukan pada hari kerja (Senin–Jumat, 08.00–16.00 WIB).
                Pastikan data yang diisi sudah benar. Pengajuan yang salah dapat memperlambat proses.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { title: "Surat Keterangan", steps: ["Pilih jenis surat", "Isi keterangan tujuan surat", "Submit pengajuan", "Ambil di loket BAK setelah selesai"] },
                { title: "Legalisir", steps: ["Bawa dokumen asli ke loket", "Atau ajukan via portal", "Maksimal 5 lembar per pengajuan", "Ambil setelah 5 hari kerja"] },
                { title: "Cuti Akademik", steps: ["Ajukan minimal 1 bulan sebelum semester", "Sertakan surat rekomendasi PA", "Lampirkan dokumen pendukung (jika ada)", "Tunggu persetujuan WD I"] },
                { title: "Administrasi", steps: ["Lengkapi formulir yang diperlukan", "Sertakan bukti pembayaran jika ada biaya", "Proses: 1–3 hari kerja", "Notifikasi via email kampus"] },
              ].map((guide) => (
                <div key={guide.title} className="border border-[#e0e3e5] rounded p-4">
                  <p style={{ fontSize: 13, fontWeight: 700, color: "#002045", marginBottom: 8 }}>{guide.title}</p>
                  <ol className="flex flex-col gap-1">
                    {guide.steps.map((step, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5" style={{ background: "#e8f0fb", color: "#0061a5", fontSize: 10, fontWeight: 700 }}>
                          {i + 1}
                        </span>
                        <span style={{ fontSize: 12, color: "#43474e", lineHeight: 1.5 }}>{step}</span>
                      </li>
                    ))}
                  </ol>
                </div>
              ))}
            </div>

            <div className="border border-[#c4c6cf] rounded p-4">
              <p style={{ fontSize: 13, fontWeight: 700, color: "#002045", marginBottom: 8 }}>Kontak Layanan Akademik</p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                  { label: "Loket BAK", value: "Gedung Rektorat Lt. 1", sub: "Senin–Jumat 08.00–15.00" },
                  { label: "Email", value: "akademik@univ.ac.id", sub: "Respons 1–2 hari kerja" },
                  { label: "WhatsApp", value: "0821-1234-5678", sub: "Senin–Jumat 08.00–16.00" },
                ].map((c) => (
                  <div key={c.label} className="p-3 rounded" style={{ background: "#f7fafc" }}>
                    <p style={{ fontSize: 11, color: "#595c63", ...MONO }}>{c.label}</p>
                    <p style={{ fontSize: 13, fontWeight: 600, color: "#002045" }}>{c.value}</p>
                    <p style={{ fontSize: 11, color: "#595c63" }}>{c.sub}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
