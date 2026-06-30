import { useState } from "react";
import { useAppContext } from "../context/AppContext";
import {
  BookOpen, CheckCircle2, Clock, AlertTriangle, FileText, Download,
  ChevronDown, PlayCircle, Users, Calendar,
} from "lucide-react";

const SM = { fontFamily: "'Hanken Grotesk', sans-serif" } as const;
const MONO = { fontFamily: "'JetBrains Mono', monospace" } as const;

type Assignment = {
  id: string;
  courseId: string;
  title: string;
  type: "Tugas" | "Kuis" | "Presentasi" | "UTS" | "UAS";
  dueDate: string;
  status: "Belum Dikumpulkan" | "Sudah Dikumpulkan" | "Dinilai" | "Terlambat";
  score?: number;
  maxScore: number;
};

type Material = {
  id: string;
  courseId: string;
  pertemuan: number;
  title: string;
  type: "Slide" | "Video" | "PDF" | "Link";
  size?: string;
  date: string;
};

const assignments: Assignment[] = [
  { id: "a1", courseId: "c1", title: "Implementasi Use Case Diagram", type: "Tugas", dueDate: "2026-07-02", status: "Sudah Dikumpulkan", score: 88, maxScore: 100 },
  { id: "a2", courseId: "c1", title: "Kuis Chapter 3: Design Patterns", type: "Kuis", dueDate: "2026-06-25", status: "Dinilai", score: 92, maxScore: 100 },
  { id: "a3", courseId: "c2", title: "Analisis Kerentanan Sistem", type: "Tugas", dueDate: "2026-07-05", status: "Belum Dikumpulkan", maxScore: 100 },
  { id: "a4", courseId: "c2", title: "Laporan Penetration Testing", type: "Tugas", dueDate: "2026-07-10", status: "Belum Dikumpulkan", maxScore: 100 },
  { id: "a5", courseId: "c3", title: "Implementasi Linear Regression", type: "Tugas", dueDate: "2026-06-28", status: "Dinilai", score: 95, maxScore: 100 },
  { id: "a6", courseId: "c3", title: "Kuis Chapter 2: Supervised Learning", type: "Kuis", dueDate: "2026-06-20", status: "Dinilai", score: 78, maxScore: 100 },
  { id: "a7", courseId: "c4", title: "Project Charter Kelompok", type: "Tugas", dueDate: "2026-07-01", status: "Sudah Dikumpulkan", maxScore: 100 },
  { id: "a8", courseId: "c5", title: "Audit Sistem ERP", type: "Presentasi", dueDate: "2026-07-08", status: "Belum Dikumpulkan", maxScore: 100 },
  { id: "a9", courseId: "c5", title: "UTS Audit Sistem Informasi", type: "UTS", dueDate: "2026-07-14", status: "Belum Dikumpulkan", maxScore: 100 },
];

const materials: Material[] = [
  { id: "m1", courseId: "c1", pertemuan: 1, title: "Pengantar RPL & Software Process Models", type: "Slide", size: "4.2 MB", date: "2026-06-02" },
  { id: "m2", courseId: "c1", pertemuan: 2, title: "Requirement Engineering", type: "Slide", size: "5.8 MB", date: "2026-06-09" },
  { id: "m3", courseId: "c1", pertemuan: 3, title: "Video: UML Diagram Tutorial", type: "Video", date: "2026-06-16" },
  { id: "m4", courseId: "c2", pertemuan: 1, title: "Pengantar Keamanan Informasi & CIA Triad", type: "Slide", size: "3.1 MB", date: "2026-06-03" },
  { id: "m5", courseId: "c2", pertemuan: 2, title: "Cryptography Fundamentals", type: "PDF", size: "8.5 MB", date: "2026-06-10" },
  { id: "m6", courseId: "c3", pertemuan: 1, title: "Introduction to Machine Learning", type: "Slide", size: "6.3 MB", date: "2026-06-04" },
  { id: "m7", courseId: "c3", pertemuan: 2, title: "Supervised vs Unsupervised Learning", type: "Slide", size: "4.9 MB", date: "2026-06-11" },
  { id: "m8", courseId: "c4", pertemuan: 1, title: "PM Framework & Project Lifecycle", type: "Slide", size: "3.7 MB", date: "2026-06-05" },
  { id: "m9", courseId: "c4", pertemuan: 2, title: "WBS & Gantt Chart", type: "PDF", size: "2.1 MB", date: "2026-06-12" },
  { id: "m10", courseId: "c5", pertemuan: 1, title: "Pengantar Audit Sistem Informasi", type: "Slide", size: "4.0 MB", date: "2026-06-06" },
];

const meetings: Record<string, { no: number; topic: string; date: string; status: "Hadir" | "Izin" | "Alpha" | "Sakit" | "Belum" }[]> = {
  c1: [
    { no: 1, topic: "Pengantar RPL", date: "02 Jun 2026", status: "Hadir" },
    { no: 2, topic: "Requirement Engineering", date: "09 Jun 2026", status: "Hadir" },
    { no: 3, topic: "UML & Desain Sistem", date: "16 Jun 2026", status: "Hadir" },
    { no: 4, topic: "Software Architecture", date: "23 Jun 2026", status: "Belum" },
  ],
  c2: [
    { no: 1, topic: "Pengantar Keamanan Informasi", date: "03 Jun 2026", status: "Hadir" },
    { no: 2, topic: "Kriptografi", date: "10 Jun 2026", status: "Hadir" },
    { no: 3, topic: "Network Security", date: "17 Jun 2026", status: "Hadir" },
    { no: 4, topic: "Ethical Hacking", date: "24 Jun 2026", status: "Belum" },
  ],
  c3: [
    { no: 1, topic: "Pengantar ML", date: "04 Jun 2026", status: "Hadir" },
    { no: 2, topic: "Supervised Learning", date: "11 Jun 2026", status: "Hadir" },
    { no: 3, topic: "Feature Engineering", date: "18 Jun 2026", status: "Izin" },
    { no: 4, topic: "Evaluation Metrics", date: "25 Jun 2026", status: "Belum" },
  ],
};

const STATUS_COLORS: Record<string, { bg: string; text: string }> = {
  "Belum Dikumpulkan": { bg: "bg-gray-100", text: "text-gray-600" },
  "Sudah Dikumpulkan": { bg: "bg-blue-100", text: "text-blue-700" },
  "Dinilai":           { bg: "bg-green-100", text: "text-green-700" },
  "Terlambat":         { bg: "bg-red-100", text: "text-red-700" },
  "Hadir":             { bg: "bg-green-100", text: "text-green-700" },
  "Izin":              { bg: "bg-blue-100", text: "text-blue-700" },
  "Sakit":             { bg: "bg-yellow-100", text: "text-yellow-700" },
  "Alpha":             { bg: "bg-red-100", text: "text-red-700" },
  "Belum":             { bg: "bg-gray-100", text: "text-gray-500" },
};

export function PerkuliahanPage() {
  const { myCourses } = useAppContext();
  const [selectedCourse, setSelectedCourse] = useState<string>(myCourses[0]?.id ?? "");
  const [activeSection, setActiveSection] = useState<"absensi" | "tugas" | "materi">("absensi");

  const course = myCourses.find((c) => c.id === selectedCourse);
  const courseAssignments = assignments.filter((a) => a.courseId === selectedCourse);
  const courseMaterials = materials.filter((m) => m.courseId === selectedCourse);
  const courseMeetings = meetings[selectedCourse] ?? [];

  const attendancePct = course ? Math.round((course.attendedMeetings ?? 0) / (course.totalMeetings || 1) * 100) : 0;
  const attendanceOk = attendancePct >= 75;

  const pendingAssignments = assignments.filter((a) => a.status === "Belum Dikumpulkan").length;
  const totalAssignments = assignments.length;

  return (
    <div className="flex flex-col gap-5" style={SM}>
      {/* Header */}
      <div className="bg-white border border-[#c4c6cf] rounded p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 style={{ fontSize: 22, fontWeight: 700, color: "#002045", letterSpacing: "-0.01em" }}>Perkuliahan</h2>
            <p style={{ fontSize: 13, color: "#43474e", marginTop: 4 }}>Absensi, Tugas, dan Materi Perkuliahan</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <div className="flex items-center gap-2 px-3 py-2 rounded border border-[#c4c6cf]">
              <AlertTriangle className="w-4 h-4 text-amber-500" />
              <span style={{ fontSize: 12, color: "#43474e" }}>{pendingAssignments} tugas pending</span>
            </div>
          </div>
        </div>
      </div>

      {/* Course Selector */}
      <div className="flex flex-wrap gap-2">
        {myCourses.map((c) => {
          const att = Math.round((c.attendedMeetings ?? 0) / (c.totalMeetings || 1) * 100);
          return (
            <button
              key={c.id}
              onClick={() => setSelectedCourse(c.id)}
              className="flex items-center gap-2 px-3 py-2 rounded border transition-all"
              style={{
                fontSize: 12,
                borderColor: selectedCourse === c.id ? "#002045" : "#c4c6cf",
                background: selectedCourse === c.id ? "#002045" : "white",
                color: selectedCourse === c.id ? "#ffffff" : "#43474e",
              }}
            >
              <span>{c.name}</span>
              <span
                className="px-1.5 py-0.5 rounded"
                style={{
                  fontSize: 10,
                  ...MONO,
                  background: selectedCourse === c.id ? "rgba(255,255,255,0.2)" : att >= 75 ? "#e8f5e9" : "#fef3c7",
                  color: selectedCourse === c.id ? "white" : att >= 75 ? "#10b981" : "#b45309",
                  fontWeight: 700,
                }}
              >
                {att}%
              </span>
            </button>
          );
        })}
      </div>

      {course && (
        <>
          {/* Course Info Card */}
          <div className="bg-white border border-[#c4c6cf] rounded p-5">
            <div className="flex flex-col sm:flex-row sm:items-start gap-5">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span style={{ fontSize: 11, color: "#0061a5", fontWeight: 600, ...MONO }}>{course.code}</span>
                  <span className="px-2 py-0.5 rounded text-xs" style={{ background: "#e8f0fb", color: "#0061a5" }}>{course.type}</span>
                </div>
                <h3 style={{ fontSize: 18, fontWeight: 700, color: "#002045" }}>{course.name}</h3>
                <div className="flex flex-wrap gap-4 mt-2">
                  <div className="flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5" style={{ color: "#595c63" }} />
                    <span style={{ fontSize: 12, color: "#43474e" }}>{course.lecturer}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5" style={{ color: "#595c63" }} />
                    <span style={{ fontSize: 12, color: "#43474e" }}>{course.day}, {course.schedule}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <BookOpen className="w-3.5 h-3.5" style={{ color: "#595c63" }} />
                    <span style={{ fontSize: 12, color: "#43474e" }}>{course.sks} SKS</span>
                  </div>
                </div>
              </div>

              {/* Attendance Badge */}
              <div className="flex flex-col items-center gap-2 p-4 rounded border" style={{ background: attendanceOk ? "#e8f5e9" : "#fef3c7", borderColor: attendanceOk ? "#10b981" : "#f59e0b", minWidth: 100 }}>
                <div className={`w-14 h-14 rounded-full flex items-center justify-center`} style={{ background: attendanceOk ? "#d1fae5" : "#fef3c7", border: `3px solid ${attendanceOk ? "#10b981" : "#f59e0b"}` }}>
                  <span style={{ fontSize: 16, fontWeight: 800, color: attendanceOk ? "#064e3b" : "#92400e", ...MONO }}>{attendancePct}%</span>
                </div>
                <p style={{ fontSize: 11, color: attendanceOk ? "#064e3b" : "#92400e", fontWeight: 600 }}>
                  {attendanceOk ? "Memenuhi Syarat" : "Perlu Perhatian"}
                </p>
                <p style={{ fontSize: 10, color: "#595c63", ...MONO }}>
                  {course.attendedMeetings}/{course.totalMeetings} pertemuan
                </p>
              </div>
            </div>

            {/* Attendance Progress */}
            <div className="mt-4 pt-4 border-t border-[#e0e3e5]">
              <div className="flex justify-between mb-1">
                <span style={{ fontSize: 11, color: "#43474e" }}>Kehadiran ({attendancePct}%)</span>
                <span style={{ fontSize: 11, color: "#595c63", ...MONO }}>Min. 75% = {Math.ceil((course.totalMeetings ?? 0) * 0.75)} pertemuan</span>
              </div>
              <div className="h-2 rounded-full" style={{ background: "#e0e3e5" }}>
                <div
                  className="h-full rounded-full transition-all"
                  style={{
                    width: `${attendancePct}%`,
                    background: attendanceOk ? "#10b981" : "#f59e0b",
                  }}
                />
              </div>
            </div>
          </div>

          {/* Sections */}
          <div className="bg-white border border-[#c4c6cf] rounded overflow-hidden">
            <div className="flex border-b border-[#e0e3e5]">
              {[
                { id: "absensi", label: `Absensi (${courseMeetings.length})` },
                { id: "tugas", label: `Tugas & Kuis (${courseAssignments.length})` },
                { id: "materi", label: `Materi (${courseMaterials.length})` },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveSection(tab.id as any)}
                  className="px-5 py-3 border-b-2 transition-colors"
                  style={{
                    fontSize: 13,
                    fontWeight: 500,
                    borderBottomColor: activeSection === tab.id ? "#002045" : "transparent",
                    color: activeSection === tab.id ? "#002045" : "#43474e",
                    background: activeSection === tab.id ? "#f7fafc" : "transparent",
                  }}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {activeSection === "absensi" && (
              courseMeetings.length === 0 ? (
                <div className="p-8 text-center" style={{ fontSize: 13, color: "#595c63" }}>
                  Belum ada data absensi untuk mata kuliah ini.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr style={{ background: "#f1f4f6", borderBottom: "1px solid #e0e3e5" }}>
                        {["NO.", "TANGGAL", "TOPIK PERKULIAHAN", "STATUS"].map((h) => (
                          <th key={h} className="px-4 py-3 text-left" style={{ fontSize: 10, color: "#595c63", ...MONO, letterSpacing: "0.05em" }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {courseMeetings.map((m) => (
                        <tr key={m.no} className="border-b border-[#e0e3e5] hover:bg-[#f7fafc]">
                          <td className="px-4 py-3" style={{ fontSize: 12, ...MONO, color: "#595c63" }}>Pertemuan {m.no}</td>
                          <td className="px-4 py-3" style={{ fontSize: 12, color: "#43474e", ...MONO }}>{m.date}</td>
                          <td className="px-4 py-3" style={{ fontSize: 13, color: "#181c1e" }}>{m.topic}</td>
                          <td className="px-4 py-3">
                            <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${STATUS_COLORS[m.status]?.bg ?? "bg-gray-100"} ${STATUS_COLORS[m.status]?.text ?? "text-gray-600"}`} style={MONO}>
                              {m.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )
            )}

            {activeSection === "tugas" && (
              courseAssignments.length === 0 ? (
                <div className="p-8 text-center" style={{ fontSize: 13, color: "#595c63" }}>Tidak ada tugas untuk mata kuliah ini.</div>
              ) : (
                <div className="divide-y divide-[#e0e3e5]">
                  {courseAssignments.map((a) => (
                    <div key={a.id} className="px-5 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-[#f7fafc]">
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded flex items-center justify-center shrink-0" style={{ background: "#e8f0fb" }}>
                          <FileText className="w-4 h-4" style={{ color: "#0061a5" }} />
                        </div>
                        <div>
                          <p style={{ fontSize: 13, fontWeight: 600, color: "#181c1e" }}>{a.title}</p>
                          <div className="flex items-center gap-3 mt-1">
                            <span style={{ fontSize: 11, color: "#595c63" }}>
                              Tipe: <strong>{a.type}</strong>
                            </span>
                            <span style={{ fontSize: 11, color: "#595c63", ...MONO }}>
                              Due: {new Date(a.dueDate).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        {a.score !== undefined && (
                          <div className="text-right">
                            <p style={{ fontSize: 18, fontWeight: 800, color: a.score >= 75 ? "#166534" : "#92400e", ...MONO }}>
                              {a.score}
                            </p>
                            <p style={{ fontSize: 10, color: "#595c63", ...MONO }}>/{a.maxScore}</p>
                          </div>
                        )}
                        <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${STATUS_COLORS[a.status]?.bg ?? "bg-gray-100"} ${STATUS_COLORS[a.status]?.text ?? "text-gray-600"}`} style={MONO}>
                          {a.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )
            )}

            {activeSection === "materi" && (
              courseMaterials.length === 0 ? (
                <div className="p-8 text-center" style={{ fontSize: 13, color: "#595c63" }}>Belum ada materi untuk mata kuliah ini.</div>
              ) : (
                <div className="divide-y divide-[#e0e3e5]">
                  {courseMaterials.map((m) => (
                    <div key={m.id} className="px-5 py-4 flex items-center justify-between gap-3 hover:bg-[#f7fafc]">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded flex items-center justify-center" style={{ background: m.type === "Video" ? "#f3e8ff" : "#e8f0fb" }}>
                          {m.type === "Video" ? (
                            <PlayCircle className="w-4 h-4" style={{ color: "#7c3aed" }} />
                          ) : (
                            <FileText className="w-4 h-4" style={{ color: "#0061a5" }} />
                          )}
                        </div>
                        <div>
                          <p style={{ fontSize: 13, fontWeight: 500, color: "#181c1e" }}>{m.title}</p>
                          <div className="flex items-center gap-3 mt-0.5">
                            <span style={{ fontSize: 10, ...MONO, background: "#e8f0fb", color: "#0061a5", padding: "1px 6px", borderRadius: 4 }}>{m.type}</span>
                            <span style={{ fontSize: 11, color: "#595c63" }}>Pertemuan {m.pertemuan}</span>
                            {m.size && <span style={{ fontSize: 11, color: "#595c63", ...MONO }}>{m.size}</span>}
                            <span style={{ fontSize: 11, color: "#595c63", ...MONO }}>{m.date}</span>
                          </div>
                        </div>
                      </div>
                      <button
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded border border-[#c4c6cf] hover:border-[#0061a5] transition-colors"
                        style={{ fontSize: 12, color: "#002045" }}
                      >
                        <Download className="w-3.5 h-3.5" />
                        Unduh
                      </button>
                    </div>
                  ))}
                </div>
              )
            )}
          </div>
        </>
      )}
    </div>
  );
}
