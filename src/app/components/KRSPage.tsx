import { useState } from "react";
import { useAppContext } from "../context/AppContext";
import {
  BookOpen, PlusCircle, Trash2, CheckCircle2, AlertCircle, Clock, ChevronDown,
  Filter, Download, Info, MapPin,
} from "lucide-react";
import { toast } from "sonner";

const SM = { fontFamily: "'Hanken Grotesk', sans-serif" } as const;
const MONO = { fontFamily: "'JetBrains Mono', monospace" } as const;

const TYPE_COLORS: Record<string, { bg: string; text: string }> = {
  Wajib:        { bg: "bg-blue-100",   text: "text-blue-700" },
  Pilihan:      { bg: "bg-purple-100", text: "text-purple-700" },
  KKN:          { bg: "bg-teal-100",   text: "text-teal-700" },
  "Tugas Akhir": { bg: "bg-amber-100",  text: "text-amber-700" },
};

export function KRSPage() {
  const { availableCourses, myCourses, enrollCourse, dropCourse, totalSks } = useAppContext();
  const [activeTab, setActiveTab] = useState<"diambil" | "tersedia">("diambil");
  const [filterType, setFilterType] = useState<string>("Semua");
  const [showDropConfirm, setShowDropConfirm] = useState<string | null>(null);

  const MAX_SKS = 24;
  const sksRemaining = MAX_SKS - totalSks;
  const pct = Math.min((totalSks / MAX_SKS) * 100, 100);

  const handleEnroll = (course: any) => {
    if (totalSks + course.sks > MAX_SKS) {
      toast.error("Batas SKS terlampaui", { description: `Penambahan ${course.sks} SKS melebihi batas maksimum ${MAX_SKS} SKS.` });
      return;
    }
    enrollCourse(course);
    toast.success(`Berhasil mengambil ${course.name}`, { description: `+${course.sks} SKS ditambahkan ke KRS Anda.` });
  };

  const handleDropConfirm = (courseId: string, courseName: string) => {
    dropCourse(courseId);
    setShowDropConfirm(null);
    toast.error(`Mata kuliah dibatalkan`, { description: `${courseName} telah dihapus dari KRS Anda.` });
  };

  const notEnrolled = availableCourses.filter((c) => !myCourses.find((mc) => mc.id === c.id));
  const filteredAvailable = filterType === "Semua" ? notEnrolled : notEnrolled.filter((c) => c.type === filterType);
  const typeOptions = ["Semua", "Wajib", "Pilihan", "Tugas Akhir", "KKN"];

  return (
    <div className="flex flex-col gap-6" style={SM}>
      {/* Page Header */}
      <div className="bg-white border border-[#c4c6cf] rounded p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 style={{ fontSize: 22, fontWeight: 700, color: "#002045", letterSpacing: "-0.01em" }}>
              Kartu Rencana Studi (KRS)
            </h2>
            <p style={{ fontSize: 13, color: "#43474e", marginTop: 4 }}>
              Semester Ganjil 2026/2027 — Pengisian KRS aktif hingga <span style={{ ...MONO, color: "#0061a5", fontWeight: 600 }}>5 Juli 2026</span>
            </p>
          </div>
          <button
            onClick={() => toast.info("Fitur cetak KRS", { description: "Dokumen KRS sedang disiapkan untuk diunduh." })}
            className="flex items-center gap-2 px-4 py-2 rounded border border-[#c4c6cf] hover:border-[#0061a5] transition-colors"
            style={{ fontSize: 13, color: "#002045" }}
          >
            <Download className="w-4 h-4" />
            Cetak KRS
          </button>
        </div>

        {/* SKS Progress */}
        <div className="mt-4 pt-4 border-t border-[#e0e3e5]">
          <div className="flex items-center justify-between mb-2">
            <span style={{ fontSize: 12, color: "#43474e" }}>Beban SKS Semester Ini</span>
            <div className="flex items-center gap-3">
              <span style={{ fontSize: 12, ...MONO, color: "#002045", fontWeight: 600 }}>{totalSks} SKS</span>
              <span style={{ fontSize: 11, color: "#595c63", ...MONO }}>Sisa: {sksRemaining} SKS</span>
            </div>
          </div>
          <div className="h-2.5 rounded-full overflow-hidden" style={{ background: "#e0e3e5" }}>
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{
                width: `${pct}%`,
                background: totalSks >= 20 ? "linear-gradient(90deg, #0061a5, #10b981)" :
                            totalSks >= 14 ? "linear-gradient(90deg, #0061a5, #7c3aed)" :
                            "#0061a5",
              }}
            />
          </div>
          <div className="flex justify-between mt-1">
            <span style={{ fontSize: 10, color: "#595c63", ...MONO }}>Maks. IPK sebelumnya ≥ 3.75 → max 24 SKS</span>
            <span style={{ fontSize: 10, ...MONO, color: totalSks >= 20 ? "#10b981" : "#595c63" }}>
              {pct.toFixed(0)}%
            </span>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white border border-[#c4c6cf] rounded p-4 flex flex-col gap-1.5">
          <div className="w-8 h-8 rounded flex items-center justify-center" style={{ background: "#e8f0fb" }}>
            <BookOpen className="w-4 h-4" style={{ color: "#0061a5" }} />
          </div>
          <p style={{ fontSize: 11, color: "#595c63", ...MONO, letterSpacing: "0.04em" }}>TOTAL SKS</p>
          <p style={{ fontSize: 24, fontWeight: 700, color: "#002045" }}>{totalSks} <span style={{ fontSize: 13, fontWeight: 400, color: "#595c63" }}>/ 24</span></p>
        </div>
        <div className="bg-white border border-[#c4c6cf] rounded p-4 flex flex-col gap-1.5">
          <div className="w-8 h-8 rounded flex items-center justify-center" style={{ background: "#e8f5e9" }}>
            <CheckCircle2 className="w-4 h-4" style={{ color: "#10b981" }} />
          </div>
          <p style={{ fontSize: 11, color: "#595c63", ...MONO, letterSpacing: "0.04em" }}>MK DIAMBIL</p>
          <p style={{ fontSize: 24, fontWeight: 700, color: "#002045" }}>{myCourses.length}</p>
        </div>
        <div className="bg-white border border-[#c4c6cf] rounded p-4 flex flex-col gap-1.5">
          <div className="w-8 h-8 rounded flex items-center justify-center" style={{ background: "#fff3e0" }}>
            <Clock className="w-4 h-4" style={{ color: "#f59e0b" }} />
          </div>
          <p style={{ fontSize: 11, color: "#595c63", ...MONO, letterSpacing: "0.04em" }}>MK TERSEDIA</p>
          <p style={{ fontSize: 24, fontWeight: 700, color: "#002045" }}>{notEnrolled.length}</p>
        </div>
        <div className="bg-white border border-[#c4c6cf] rounded p-4 flex flex-col gap-1.5">
          <div className="w-8 h-8 rounded flex items-center justify-center" style={{ background: "#f3e8ff" }}>
            <AlertCircle className="w-4 h-4" style={{ color: "#7c3aed" }} />
          </div>
          <p style={{ fontSize: 11, color: "#595c63", ...MONO, letterSpacing: "0.04em" }}>STATUS KRS</p>
          <p style={{ fontSize: 13, fontWeight: 700, color: "#7c3aed" }}>Disetujui PA</p>
        </div>
      </div>

      {/* Info banner */}
      <div className="flex items-start gap-3 p-3.5 rounded border border-blue-200 bg-blue-50">
        <Info className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
        <p style={{ fontSize: 12, color: "#1e40af", lineHeight: 1.5 }}>
          KRS Anda harus disahkan oleh Dosen Pembimbing Akademik (PA) <strong>Dr. Anita Rahma, M.Kom</strong> sebelum batas akhir 5 Juli 2026.
          Perubahan KRS masih dapat dilakukan selama periode pengisian berlangsung.
        </p>
      </div>

      {/* Tabs + Table */}
      <div className="bg-white border border-[#c4c6cf] rounded overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b border-[#e0e3e5] flex-wrap gap-3">
          <div className="flex gap-1">
            {["diambil", "tersedia"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab as any)}
                className="px-4 py-2 rounded transition-colors"
                style={{
                  fontSize: 13,
                  fontWeight: 500,
                  background: activeTab === tab ? "#002045" : "transparent",
                  color: activeTab === tab ? "#ffffff" : "#43474e",
                }}
              >
                {tab === "diambil" ? `MK Diambil (${myCourses.length})` : `MK Tersedia (${notEnrolled.length})`}
              </button>
            ))}
          </div>

          {activeTab === "tersedia" && (
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4" style={{ color: "#595c63" }} />
              <div className="flex gap-1 flex-wrap">
                {typeOptions.map((t) => (
                  <button
                    key={t}
                    onClick={() => setFilterType(t)}
                    className="px-3 py-1 rounded-full border text-xs transition-colors"
                    style={{
                      borderColor: filterType === t ? "#0061a5" : "#c4c6cf",
                      background: filterType === t ? "#e8f0fb" : "transparent",
                      color: filterType === t ? "#0061a5" : "#43474e",
                      fontWeight: filterType === t ? 600 : 400,
                    }}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr style={{ background: "#f1f4f6", borderBottom: "1px solid #e0e3e5" }}>
                <th className="px-4 py-3 text-left" style={{ fontSize: 11, color: "#595c63", ...MONO, letterSpacing: "0.05em" }}>KODE</th>
                <th className="px-4 py-3 text-left" style={{ fontSize: 11, color: "#595c63", ...MONO, letterSpacing: "0.05em" }}>MATA KULIAH</th>
                <th className="px-4 py-3 text-center" style={{ fontSize: 11, color: "#595c63", ...MONO, letterSpacing: "0.05em" }}>SKS</th>
                <th className="px-4 py-3 text-left" style={{ fontSize: 11, color: "#595c63", ...MONO, letterSpacing: "0.05em" }}>TIPE</th>
                <th className="px-4 py-3 text-left" style={{ fontSize: 11, color: "#595c63", ...MONO, letterSpacing: "0.05em" }}>JADWAL</th>
                <th className="px-4 py-3 text-left" style={{ fontSize: 11, color: "#595c63", ...MONO, letterSpacing: "0.05em" }}>RUANG</th>
                <th className="px-4 py-3 text-left" style={{ fontSize: 11, color: "#595c63", ...MONO, letterSpacing: "0.05em" }}>DOSEN</th>
                <th className="px-4 py-3 text-center" style={{ fontSize: 11, color: "#595c63", ...MONO, letterSpacing: "0.05em" }}>AKSI</th>
              </tr>
            </thead>
            <tbody style={{ borderCollapse: "collapse" }}>
              {activeTab === "diambil" && myCourses.map((course) => (
                <tr key={course.id} className="border-b border-[#e0e3e5] hover:bg-[#f7fafc] transition-colors">
                  <td className="px-4 py-3" style={{ fontSize: 12, color: "#0061a5", ...MONO, fontWeight: 600 }}>{course.code}</td>
                  <td className="px-4 py-3">
                    <p style={{ fontSize: 13, fontWeight: 600, color: "#181c1e" }}>{course.name}</p>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className="inline-flex items-center justify-center w-8 h-8 rounded-full" style={{ background: "#e8f0fb", color: "#002045", fontSize: 13, fontWeight: 700, ...MONO }}>
                      {course.sks}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded text-xs font-semibold ${TYPE_COLORS[course.type]?.bg ?? "bg-gray-100"} ${TYPE_COLORS[course.type]?.text ?? "text-gray-700"}`}>
                      {course.type}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <p style={{ fontSize: 12, color: "#181c1e", ...MONO }}>{course.day}</p>
                    <p style={{ fontSize: 11, color: "#595c63", ...MONO }}>{course.schedule}</p>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      <MapPin className="w-3 h-3" style={{ color: "#595c63" }} />
                      <span style={{ fontSize: 12, color: "#43474e" }}>{course.room}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3" style={{ fontSize: 12, color: "#43474e", maxWidth: 160 }}>{course.lecturer}</td>
                  <td className="px-4 py-3 text-center">
                    {showDropConfirm === course.id ? (
                      <div className="flex items-center gap-1 justify-center">
                        <button
                          onClick={() => handleDropConfirm(course.id, course.name)}
                          className="px-2 py-1 rounded text-xs font-semibold bg-red-500 text-white hover:bg-red-600 transition-colors"
                        >Hapus</button>
                        <button
                          onClick={() => setShowDropConfirm(null)}
                          className="px-2 py-1 rounded text-xs font-semibold border border-[#c4c6cf] text-[#43474e] hover:bg-[#f1f4f6] transition-colors"
                        >Batal</button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setShowDropConfirm(course.id)}
                        className="p-1.5 rounded hover:bg-red-50 transition-colors"
                        title="Batalkan pengambilan"
                      >
                        <Trash2 className="w-4 h-4 text-red-400 hover:text-red-600" />
                      </button>
                    )}
                  </td>
                </tr>
              ))}

              {activeTab === "tersedia" && filteredAvailable.map((course) => (
                <tr key={course.id} className="border-b border-[#e0e3e5] hover:bg-[#f7fafc] transition-colors">
                  <td className="px-4 py-3" style={{ fontSize: 12, color: "#0061a5", ...MONO, fontWeight: 600 }}>{course.code}</td>
                  <td className="px-4 py-3">
                    <p style={{ fontSize: 13, fontWeight: 600, color: "#181c1e" }}>{course.name}</p>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className="inline-flex items-center justify-center w-8 h-8 rounded-full" style={{ background: "#e8f0fb", color: "#002045", fontSize: 13, fontWeight: 700, ...MONO }}>
                      {course.sks}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded text-xs font-semibold ${TYPE_COLORS[course.type]?.bg ?? "bg-gray-100"} ${TYPE_COLORS[course.type]?.text ?? "text-gray-700"}`}>
                      {course.type}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <p style={{ fontSize: 12, color: "#181c1e", ...MONO }}>{course.day}</p>
                    <p style={{ fontSize: 11, color: "#595c63", ...MONO }}>{course.schedule}</p>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      <MapPin className="w-3 h-3" style={{ color: "#595c63" }} />
                      <span style={{ fontSize: 12, color: "#43474e" }}>{course.room}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3" style={{ fontSize: 12, color: "#43474e", maxWidth: 160 }}>{course.lecturer}</td>
                  <td className="px-4 py-3 text-center">
                    <button
                      onClick={() => handleEnroll(course)}
                      disabled={totalSks + course.sks > MAX_SKS}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-semibold transition-colors mx-auto disabled:opacity-40 disabled:cursor-not-allowed"
                      style={{ background: "#002045", color: "#ffffff" }}
                    >
                      <PlusCircle className="w-3.5 h-3.5" />
                      Ambil
                    </button>
                  </td>
                </tr>
              ))}

              {activeTab === "diambil" && myCourses.length === 0 && (
                <tr><td colSpan={8} className="p-10 text-center" style={{ fontSize: 13, color: "#595c63" }}>Belum ada mata kuliah yang diambil.</td></tr>
              )}
              {activeTab === "tersedia" && filteredAvailable.length === 0 && (
                <tr><td colSpan={8} className="p-10 text-center" style={{ fontSize: 13, color: "#595c63" }}>
                  {notEnrolled.length === 0 ? "Semua mata kuliah tersedia telah diambil." : "Tidak ada mata kuliah dengan filter yang dipilih."}
                </td></tr>
              )}
            </tbody>
          </table>
        </div>

        {activeTab === "diambil" && myCourses.length > 0 && (
          <div className="flex items-center justify-between px-5 py-3 border-t border-[#e0e3e5]" style={{ background: "#f7fafc" }}>
            <span style={{ fontSize: 12, color: "#43474e" }}>Total {myCourses.length} mata kuliah</span>
            <span style={{ fontSize: 13, fontWeight: 700, color: "#002045", ...MONO }}>Total SKS: {totalSks}</span>
          </div>
        )}
      </div>
    </div>
  );
}
