import { useState } from "react";
import { useAppContext } from "../context/AppContext";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, CartesianGrid } from "recharts";
import { BookOpen, GraduationCap, Award, TrendingUp, Download, ChevronDown } from "lucide-react";

const SM = { fontFamily: "'Hanken Grotesk', sans-serif" } as const;
const MONO = { fontFamily: "'JetBrains Mono', monospace" } as const;

const GRADE_COLORS: Record<string, { bg: string; text: string }> = {
  "A":  { bg: "bg-green-100", text: "text-green-700" },
  "A-": { bg: "bg-green-100", text: "text-green-700" },
  "B+": { bg: "bg-blue-100",  text: "text-blue-700" },
  "B":  { bg: "bg-blue-100",  text: "text-blue-700" },
  "B-": { bg: "bg-sky-100",   text: "text-sky-700" },
  "C+": { bg: "bg-yellow-100",text: "text-yellow-700" },
  "C":  { bg: "bg-yellow-100",text: "text-yellow-700" },
  "D":  { bg: "bg-red-100",   text: "text-red-700" },
  "E":  { bg: "bg-red-100",   text: "text-red-700" },
};

const semGrades: Record<string, { code: string; name: string; sks: number; grade: string; score: number; type: string }[]> = {
  "Ganjil 2023/2024": [
    { code: "IF1101", name: "Pengantar Ilmu Komputer", sks: 3, grade: "A", score: 4.0, type: "Wajib" },
    { code: "IF1102", name: "Matematika Diskrit", sks: 3, grade: "B+", score: 3.3, type: "Wajib" },
    { code: "IF1103", name: "Dasar Pemrograman", sks: 4, grade: "A", score: 4.0, type: "Wajib" },
    { code: "IF1104", name: "Kalkulus", sks: 3, grade: "B", score: 3.0, type: "Wajib" },
    { code: "IF1105", name: "Bahasa Indonesia", sks: 2, grade: "A-", score: 3.7, type: "Wajib" },
    { code: "IF1106", name: "Pancasila", sks: 2, grade: "A", score: 4.0, type: "Wajib" },
    { code: "IF1107", name: "Fisika Dasar", sks: 3, grade: "B+", score: 3.3, type: "Wajib" },
  ],
  "Genap 2023/2024": [
    { code: "IF1201", name: "Algoritma dan Struktur Data", sks: 4, grade: "A-", score: 3.7, type: "Wajib" },
    { code: "IF1202", name: "Aljabar Linear", sks: 3, grade: "B+", score: 3.3, type: "Wajib" },
    { code: "IF1203", name: "Sistem Digital", sks: 3, grade: "A", score: 4.0, type: "Wajib" },
    { code: "IF1204", name: "Bahasa Inggris Teknik", sks: 2, grade: "A", score: 4.0, type: "Wajib" },
    { code: "IF1205", name: "Kewarganegaraan", sks: 2, grade: "A", score: 4.0, type: "Wajib" },
    { code: "IF1206", name: "Pemrograman Web Dasar", sks: 3, grade: "A-", score: 3.7, type: "Wajib" },
    { code: "IF1207", name: "Statistika", sks: 3, grade: "B", score: 3.0, type: "Wajib" },
  ],
  "Ganjil 2024/2025": [
    { code: "IF2101", name: "Basis Data", sks: 4, grade: "A", score: 4.0, type: "Wajib" },
    { code: "IF2102", name: "Jaringan Komputer", sks: 3, grade: "A-", score: 3.7, type: "Wajib" },
    { code: "IF2103", name: "Sistem Operasi", sks: 3, grade: "B+", score: 3.3, type: "Wajib" },
    { code: "IF2104", name: "Rekayasa Kebutuhan", sks: 3, grade: "A", score: 4.0, type: "Wajib" },
    { code: "IF2105", name: "Manajemen Informasi", sks: 3, grade: "A-", score: 3.7, type: "Wajib" },
    { code: "IF2106", name: "Pemrograman Berorientasi Objek", sks: 4, grade: "A", score: 4.0, type: "Wajib" },
    { code: "IF2107", name: "Analisis Sistem", sks: 2, grade: "B+", score: 3.3, type: "Wajib" },
  ],
  "Genap 2024/2025": [
    { code: "IF2201", name: "Pengembangan Aplikasi Web", sks: 4, grade: "A", score: 4.0, type: "Wajib" },
    { code: "IF2202", name: "Data Mining", sks: 3, grade: "A-", score: 3.7, type: "Pilihan" },
    { code: "IF2203", name: "Sistem Enterprise", sks: 3, grade: "A", score: 4.0, type: "Wajib" },
    { code: "IF2204", name: "Pemodelan Proses Bisnis", sks: 3, grade: "B+", score: 3.3, type: "Wajib" },
    { code: "IF2205", name: "Keamanan Jaringan", sks: 3, grade: "A-", score: 3.7, type: "Pilihan" },
    { code: "IF2206", name: "Kewirausahaan", sks: 2, grade: "A", score: 4.0, type: "Wajib" },
    { code: "IF2207", name: "Metodologi Penelitian", sks: 3, grade: "A", score: 4.0, type: "Wajib" },
  ],
  "Ganjil 2025/2026": [
    { code: "IF3101", name: "Big Data Analytics", sks: 3, grade: "A", score: 4.0, type: "Pilihan" },
    { code: "IF3102", name: "Interaksi Manusia Komputer", sks: 3, grade: "A-", score: 3.7, type: "Wajib" },
    { code: "IF3103", name: "Pemrograman Mobile", sks: 4, grade: "A", score: 4.0, type: "Wajib" },
    { code: "IF3104", name: "Sistem Basis Data Lanjut", sks: 3, grade: "A", score: 4.0, type: "Wajib" },
    { code: "IF3105", name: "Kecerdasan Buatan", sks: 3, grade: "A-", score: 3.7, type: "Pilihan" },
    { code: "IF3106", name: "Tata Kelola TI", sks: 3, grade: "B+", score: 3.3, type: "Wajib" },
    { code: "IF3107", name: "Agile Development", sks: 4, grade: "A", score: 4.0, type: "Pilihan" },
  ],
  "Genap 2025/2026": [
    { code: "IF3201", name: "Komputasi Awan", sks: 3, grade: "A", score: 4.0, type: "Pilihan" },
    { code: "IF3202", name: "Pengembangan Game", sks: 3, grade: "A-", score: 3.7, type: "Pilihan" },
    { code: "IF3203", name: "Sistem Informasi Geografis", sks: 3, grade: "A", score: 4.0, type: "Pilihan" },
    { code: "IF3204", name: "Keamanan Siber", sks: 3, grade: "A", score: 4.0, type: "Wajib" },
    { code: "IF3205", name: "Manajemen Layanan TI", sks: 3, grade: "A-", score: 3.7, type: "Wajib" },
    { code: "IF3206", name: "Proyek Perangkat Lunak", sks: 4, grade: "A", score: 4.0, type: "Wajib" },
    { code: "IF3207", name: "Teknologi Blockchain", sks: 2, grade: "A-", score: 3.7, type: "Pilihan" },
  ],
};

export function AkademikPage() {
  const { myCourses, totalSks, ipk, ips, semesterHistory, totalSksTempuh, targetSksLulus } = useAppContext();
  const [activeTab, setActiveTab] = useState<"khs" | "transkrip" | "statistik">("khs");
  const [expandedSem, setExpandedSem] = useState<string | null>(null);

  const gradedCourses = myCourses.filter((c) => c.score !== undefined);
  const progressPct = Math.min((totalSksTempuh / targetSksLulus) * 100, 100);

  const chartData = semesterHistory.map((s, i) => ({
    name: `Sem ${i + 1}`,
    label: `${s.semester.slice(0, 3)} ${s.year.split("/")[0]}`,
    ips: s.ips,
    sks: s.sksTempuh,
  }));

  const allGrades = Object.values(semGrades).flat().concat(gradedCourses.map((c) => ({ code: c.code, name: c.name, sks: c.sks, grade: c.grade!, score: c.score!, type: c.type })));
  const gradeDistribution = ["A", "A-", "B+", "B", "B-", "C+", "C", "D", "E"].map((g) => ({
    grade: g,
    count: allGrades.filter((c) => c.grade === g).length,
  })).filter((d) => d.count > 0);

  const semesterLabels = Object.keys(semGrades);

  return (
    <div className="flex flex-col gap-5" style={SM}>
      {/* Page Header */}
      <div className="bg-white border border-[#c4c6cf] rounded p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 style={{ fontSize: 22, fontWeight: 700, color: "#002045", letterSpacing: "-0.01em" }}>Akademik</h2>
            <p style={{ fontSize: 13, color: "#43474e", marginTop: 4 }}>Kartu Hasil Studi, Transkrip Nilai & Statistik Akademik</p>
          </div>
          <button
            className="flex items-center gap-2 px-4 py-2 rounded border border-[#c4c6cf] hover:border-[#0061a5] transition-colors"
            style={{ fontSize: 13, color: "#002045" }}
          >
            <Download className="w-4 h-4" />
            Unduh Transkrip
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="bg-white border border-[#c4c6cf] rounded p-4">
          <div className="w-8 h-8 rounded flex items-center justify-center mb-2" style={{ background: "#e8f0fb" }}>
            <BookOpen className="w-4 h-4" style={{ color: "#0061a5" }} />
          </div>
          <p style={{ fontSize: 11, color: "#595c63", ...MONO, letterSpacing: "0.04em" }}>SKS TEMPUH</p>
          <p style={{ fontSize: 26, fontWeight: 700, color: "#002045", lineHeight: 1.2 }}>{totalSksTempuh}</p>
          <div className="h-1 rounded-full mt-2" style={{ background: "#e0e3e5" }}>
            <div className="h-full rounded-full" style={{ width: `${progressPct}%`, background: "#0061a5" }} />
          </div>
          <p style={{ fontSize: 10, color: "#595c63", ...MONO, marginTop: 4 }}>{progressPct.toFixed(0)}% dari {targetSksLulus} SKS</p>
        </div>
        <div className="bg-white border border-[#c4c6cf] rounded p-4">
          <div className="w-8 h-8 rounded flex items-center justify-center mb-2" style={{ background: "#e8f5e9" }}>
            <GraduationCap className="w-4 h-4" style={{ color: "#10b981" }} />
          </div>
          <p style={{ fontSize: 11, color: "#595c63", ...MONO, letterSpacing: "0.04em" }}>IPK KUMULATIF</p>
          <p style={{ fontSize: 26, fontWeight: 700, color: "#002045", lineHeight: 1.2 }}>{ipk.toFixed(2)}</p>
          <p style={{ fontSize: 10, color: "#166534", ...MONO, marginTop: 6 }}>Predikat: Cum Laude</p>
        </div>
        <div className="bg-white border border-[#c4c6cf] rounded p-4">
          <div className="w-8 h-8 rounded flex items-center justify-center mb-2" style={{ background: "#f3e8ff" }}>
            <Award className="w-4 h-4" style={{ color: "#7c3aed" }} />
          </div>
          <p style={{ fontSize: 11, color: "#595c63", ...MONO, letterSpacing: "0.04em" }}>IPS SEMESTER INI</p>
          <p style={{ fontSize: 26, fontWeight: 700, color: "#002045", lineHeight: 1.2 }}>{ips > 0 ? ips.toFixed(2) : "—"}</p>
          <p style={{ fontSize: 10, color: "#595c63", ...MONO, marginTop: 6 }}>Semester 6 / Genap</p>
        </div>
        <div className="bg-white border border-[#c4c6cf] rounded p-4">
          <div className="w-8 h-8 rounded flex items-center justify-center mb-2" style={{ background: "#fff3e0" }}>
            <TrendingUp className="w-4 h-4" style={{ color: "#f59e0b" }} />
          </div>
          <p style={{ fontSize: 11, color: "#595c63", ...MONO, letterSpacing: "0.04em" }}>SEMESTER AKTIF</p>
          <p style={{ fontSize: 26, fontWeight: 700, color: "#002045", lineHeight: 1.2 }}>7</p>
          <p style={{ fontSize: 10, color: "#595c63", ...MONO, marginTop: 6 }}>Angkatan 2023</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white border border-[#c4c6cf] rounded overflow-hidden">
        <div className="flex border-b border-[#e0e3e5]">
          {[
            { id: "khs", label: "KHS Semester Ini" },
            { id: "transkrip", label: "Transkrip Lengkap" },
            { id: "statistik", label: "Statistik Akademik" },
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

        {activeTab === "khs" && (
          <div>
            <div className="px-5 py-3 border-b border-[#e0e3e5]" style={{ background: "#f7fafc" }}>
              <p style={{ fontSize: 12, color: "#43474e" }}>
                Semester Ganjil 2026/2027 — <span style={{ ...MONO, color: "#002045", fontWeight: 600 }}>{totalSks} SKS</span> diambil
              </p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr style={{ background: "#f1f4f6", borderBottom: "1px solid #e0e3e5" }}>
                    {["NO", "KODE", "MATA KULIAH", "TIPE", "SKS", "NILAI", "BOBOT", "SKS×BOBOT"].map((h) => (
                      <th key={h} className="px-4 py-3 text-left" style={{ fontSize: 10, color: "#595c63", ...MONO, letterSpacing: "0.05em" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {myCourses.map((course, i) => (
                    <tr key={course.id} className="border-b border-[#e0e3e5] hover:bg-[#f7fafc]">
                      <td className="px-4 py-3" style={{ fontSize: 12, color: "#595c63", ...MONO }}>{i + 1}</td>
                      <td className="px-4 py-3" style={{ fontSize: 12, color: "#0061a5", ...MONO, fontWeight: 600 }}>{course.code}</td>
                      <td className="px-4 py-3" style={{ fontSize: 13, fontWeight: 600, color: "#181c1e" }}>{course.name}</td>
                      <td className="px-4 py-3">
                        <span className="px-2 py-0.5 rounded text-xs" style={{ background: "#e8f0fb", color: "#0061a5" }}>{course.type}</span>
                      </td>
                      <td className="px-4 py-3 text-center" style={{ fontSize: 13, color: "#002045", ...MONO, fontWeight: 700 }}>{course.sks}</td>
                      <td className="px-4 py-3 text-center">
                        {course.grade ? (
                          <span className={`px-2 py-0.5 rounded font-bold text-xs ${GRADE_COLORS[course.grade]?.bg ?? "bg-gray-100"} ${GRADE_COLORS[course.grade]?.text ?? "text-gray-700"}`}>
                            {course.grade}
                          </span>
                        ) : (
                          <span style={{ fontSize: 12, color: "#595c63" }}>—</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-center" style={{ fontSize: 13, color: "#43474e", ...MONO }}>
                        {course.score?.toFixed(2) ?? "—"}
                      </td>
                      <td className="px-4 py-3 text-right" style={{ fontSize: 13, color: "#002045", ...MONO, fontWeight: 600 }}>
                        {course.score ? (course.score * course.sks).toFixed(2) : "—"}
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr style={{ background: "#f1f4f6", borderTop: "2px solid #c4c6cf" }}>
                    <td colSpan={4} className="px-4 py-3" style={{ fontSize: 12, fontWeight: 700, color: "#002045" }}>TOTAL</td>
                    <td className="px-4 py-3 text-center" style={{ fontSize: 13, fontWeight: 700, color: "#002045", ...MONO }}>{totalSks}</td>
                    <td />
                    <td className="px-4 py-3 text-center" style={{ fontSize: 13, fontWeight: 700, color: "#002045", ...MONO }}>IPS</td>
                    <td className="px-4 py-3 text-right" style={{ fontSize: 13, fontWeight: 700, color: "#002045", ...MONO }}>
                      {ips > 0 ? ips.toFixed(2) : "—"}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        )}

        {activeTab === "transkrip" && (
          <div className="p-4 flex flex-col gap-3">
            {semesterLabels.map((semLabel) => {
              const courses = semGrades[semLabel];
              const semSks = courses.reduce((s, c) => s + c.sks, 0);
              const semIps = courses.reduce((s, c) => s + c.score * c.sks, 0) / semSks;
              const isOpen = expandedSem === semLabel;
              return (
                <div key={semLabel} className="border border-[#e0e3e5] rounded overflow-hidden">
                  <button
                    className="w-full flex items-center justify-between px-5 py-3 hover:bg-[#f7fafc] transition-colors"
                    style={{ background: isOpen ? "#f7fafc" : "white" }}
                    onClick={() => setExpandedSem(isOpen ? null : semLabel)}
                  >
                    <div className="flex items-center gap-4">
                      <span style={{ fontSize: 13, fontWeight: 600, color: "#002045" }}>Semester {semLabel}</span>
                      <span style={{ fontSize: 11, color: "#595c63", ...MONO }}>{semSks} SKS</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span style={{ fontSize: 12, fontWeight: 700, color: "#0061a5", ...MONO }}>IPS: {semIps.toFixed(2)}</span>
                      <ChevronDown className="w-4 h-4 transition-transform" style={{ color: "#595c63", transform: isOpen ? "rotate(180deg)" : "none" }} />
                    </div>
                  </button>
                  {isOpen && (
                    <div className="border-t border-[#e0e3e5] overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr style={{ background: "#f1f4f6" }}>
                            {["KODE", "MATA KULIAH", "TIPE", "SKS", "NILAI", "BOBOT"].map((h) => (
                              <th key={h} className="px-4 py-2 text-left" style={{ fontSize: 10, color: "#595c63", ...MONO }}>{h}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {courses.map((c) => (
                            <tr key={c.code} className="border-b border-[#e0e3e5] hover:bg-[#f7fafc]">
                              <td className="px-4 py-2" style={{ fontSize: 11, color: "#0061a5", ...MONO, fontWeight: 600 }}>{c.code}</td>
                              <td className="px-4 py-2" style={{ fontSize: 12, fontWeight: 500, color: "#181c1e" }}>{c.name}</td>
                              <td className="px-4 py-2">
                                <span style={{ fontSize: 10, background: "#e8f0fb", color: "#0061a5", padding: "1px 6px", borderRadius: 4 }}>{c.type}</span>
                              </td>
                              <td className="px-4 py-2 text-center" style={{ fontSize: 12, color: "#002045", ...MONO, fontWeight: 600 }}>{c.sks}</td>
                              <td className="px-4 py-2 text-center">
                                <span className={`px-2 py-0.5 rounded font-bold text-xs ${GRADE_COLORS[c.grade]?.bg ?? "bg-gray-100"} ${GRADE_COLORS[c.grade]?.text ?? "text-gray-700"}`}>
                                  {c.grade}
                                </span>
                              </td>
                              <td className="px-4 py-2 text-center" style={{ fontSize: 12, color: "#43474e", ...MONO }}>{c.score.toFixed(2)}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {activeTab === "statistik" && (
          <div className="p-5 flex flex-col gap-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              {/* IPS Per Semester Chart */}
              <div>
                <p style={{ fontSize: 13, fontWeight: 600, color: "#002045", marginBottom: 12 }}>Tren IPS Per Semester</p>
                <div style={{ minWidth: 200, minHeight: 220, width: "100%", height: 220 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData} margin={{ top: 5, right: 10, bottom: 5, left: -20 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e0e3e5" />
                    <XAxis dataKey="label" tick={{ fontSize: 10, fontFamily: "'JetBrains Mono', monospace", fill: "#595c63" }} />
                    <YAxis domain={[3, 4]} tick={{ fontSize: 10, fontFamily: "'JetBrains Mono', monospace", fill: "#595c63" }} />
                    <Tooltip
                      contentStyle={{ fontSize: 12, fontFamily: "'Hanken Grotesk', sans-serif", border: "1px solid #c4c6cf", borderRadius: 4 }}
                      formatter={(v: any) => [v.toFixed(2), "IPS"]}
                    />
                    <Line type="monotone" dataKey="ips" stroke="#0061a5" strokeWidth={2} dot={{ r: 4, fill: "#002045" }} activeDot={{ r: 6 }} />
                  </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Grade Distribution */}
              <div>
                <p style={{ fontSize: 13, fontWeight: 600, color: "#002045", marginBottom: 12 }}>Distribusi Nilai</p>
                <div style={{ minWidth: 200, minHeight: 220, width: "100%", height: 220 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={gradeDistribution} margin={{ top: 5, right: 10, bottom: 5, left: -20 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e0e3e5" />
                    <XAxis dataKey="grade" tick={{ fontSize: 11, fontFamily: "'JetBrains Mono', monospace", fill: "#595c63" }} />
                    <YAxis tick={{ fontSize: 10, fontFamily: "'JetBrains Mono', monospace", fill: "#595c63" }} />
                    <Tooltip
                      contentStyle={{ fontSize: 12, fontFamily: "'Hanken Grotesk', sans-serif", border: "1px solid #c4c6cf", borderRadius: 4 }}
                      formatter={(v: any) => [v, "Mata Kuliah"]}
                    />
                    <Bar dataKey="count" fill="#0061a5" radius={[3, 3, 0, 0]} />
                  </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* Semester table summary */}
            <div>
              <p style={{ fontSize: 13, fontWeight: 600, color: "#002045", marginBottom: 12 }}>Rekap Akademik Per Semester</p>
              <div className="overflow-x-auto rounded border border-[#e0e3e5]">
                <table className="w-full">
                  <thead>
                    <tr style={{ background: "#f1f4f6" }}>
                      {["SEM", "TAHUN AKADEMIK", "SKS AMBIL", "SKS TEMPUH", "IPS", "KETERANGAN"].map((h) => (
                        <th key={h} className="px-4 py-3 text-left" style={{ fontSize: 10, color: "#595c63", ...MONO, letterSpacing: "0.05em" }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {semesterHistory.map((sem, i) => (
                      <tr key={i} className="border-b border-[#e0e3e5] hover:bg-[#f7fafc]">
                        <td className="px-4 py-3" style={{ fontSize: 12, ...MONO, color: "#002045", fontWeight: 700 }}>{i + 1}</td>
                        <td className="px-4 py-3" style={{ fontSize: 12, color: "#181c1e" }}>{sem.semester} {sem.year}</td>
                        <td className="px-4 py-3 text-center" style={{ fontSize: 12, ...MONO, color: "#43474e" }}>{sem.sksAmbil}</td>
                        <td className="px-4 py-3 text-center" style={{ fontSize: 12, ...MONO, color: "#43474e" }}>{sem.sksTempuh}</td>
                        <td className="px-4 py-3 text-center">
                          <span style={{ fontSize: 13, fontWeight: 700, color: sem.ips >= 3.75 ? "#166534" : "#0061a5", ...MONO }}>
                            {sem.ips.toFixed(2)}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <span style={{ fontSize: 11, color: "#43474e" }}>
                            {sem.ips >= 3.75 ? "Sangat Memuaskan" : sem.ips >= 3.0 ? "Memuaskan" : "Baik"}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
