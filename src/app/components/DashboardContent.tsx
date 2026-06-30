import { FileText, Calendar, BookOpen, CreditCard, GraduationCap, TrendingUp, AlertCircle, CheckCircle2, Clock } from "lucide-react";
import { LectureStatus } from "./LectureStatus";
import { CourseList } from "./CourseList";
import { AcademicCalendar } from "./AcademicCalendar";
import { useAppContext } from "../context/AppContext";
import { Link } from "react-router";

const quickCards = [
  { icon: FileText, title: "KRS", desc: "Rencana Studi", path: "/krs", accent: "#0061a5" },
  { icon: Calendar, title: "Jadwal", desc: "Jadwal Kuliah", path: "/jadwal", accent: "#10b981" },
  { icon: BookOpen, title: "Akademik", desc: "Nilai & Transkrip", path: "/akademik", accent: "#7c3aed" },
  { icon: CreditCard, title: "Keuangan", desc: "Tagihan & Bayar", path: "/keuangan", accent: "#f59e0b" },
];

const SM = { fontFamily: "'Hanken Grotesk', sans-serif" } as const;
const MONO = { fontFamily: "'JetBrains Mono', monospace" } as const;

export function DashboardContent() {
  const { student, announcements, myCourses, totalSks, ipk, ips, finances, totalSksTempuh, targetSksLulus } = useAppContext();
  const unpaidFinances = finances.filter((f) => f.status === "Belum Lunas" && f.amount > 0);
  const progressPct = Math.min((totalSksTempuh / targetSksLulus) * 100, 100);

  return (
    <div className="flex flex-col gap-6" style={SM}>
      {/* Welcome + Quick Stats */}
      <div className="bg-white border border-[#c4c6cf] rounded p-5 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <GraduationCap className="w-5 h-5" style={{ color: "#0061a5" }} />
              <span style={{ fontSize: 12, color: "#595c63", ...MONO }}>PORTAL MAHASISWA AKTIF</span>
            </div>
            <h2 style={{ fontSize: 26, fontWeight: 700, color: "#002045", lineHeight: 1.25, letterSpacing: "-0.01em" }}>
              Selamat datang, {student.name}
            </h2>
            <div className="flex flex-wrap items-center gap-2 mt-1">
              <span style={{ fontSize: 12, color: "#43474e" }}>{student.major}</span>
              <span style={{ color: "#c4c6cf" }}>•</span>
              <span style={{ fontSize: 12, color: "#43474e" }}>Fak. {student.faculty}</span>
              <span style={{ color: "#c4c6cf" }}>•</span>
              <span style={{ fontSize: 12, ...MONO, color: "#0061a5", fontWeight: 600 }}>Semester {student.semester}</span>
              <span style={{ color: "#c4c6cf" }}>•</span>
              <span style={{ fontSize: 11, ...MONO, color: "#43474e" }}>NIM: {student.nim}</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded" style={{ background: "#e8f5e9", color: "#2e7d32", fontSize: 11, fontWeight: 700, ...MONO, letterSpacing: "0.03em" }}>
              ● {student.status}
            </span>
          </div>
        </div>

        {/* SKS Progress */}
        <div className="mt-5 pt-5 border-t border-[#e0e3e5]">
          <div className="flex items-center justify-between mb-2">
            <span style={{ fontSize: 12, color: "#43474e" }}>Progress SKS Kelulusan</span>
            <span style={{ fontSize: 12, ...MONO, color: "#002045", fontWeight: 600 }}>{totalSksTempuh} / {targetSksLulus} SKS</span>
          </div>
          <div className="h-2 rounded-full overflow-hidden" style={{ background: "#e0e3e5" }}>
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{ width: `${progressPct}%`, background: "linear-gradient(90deg, #002045, #0061a5)" }}
            />
          </div>
          <div className="flex justify-between mt-1">
            <span style={{ fontSize: 10, color: "#595c63", ...MONO }}>Angkatan {student.angkatan}</span>
            <span style={{ fontSize: 10, color: "#595c63", ...MONO }}>{progressPct.toFixed(1)}% selesai</span>
          </div>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="bg-white border border-[#c4c6cf] rounded p-4">
          <p style={{ fontSize: 11, color: "#595c63", ...MONO, letterSpacing: "0.04em" }}>TOTAL SKS AKTIF</p>
          <p style={{ fontSize: 28, fontWeight: 700, color: "#002045", lineHeight: 1.2, marginTop: 4 }}>{totalSks}</p>
          <p style={{ fontSize: 11, color: "#595c63", ...MONO }}>dari maks. 24 SKS</p>
        </div>
        <div className="bg-white border border-[#c4c6cf] rounded p-4">
          <p style={{ fontSize: 11, color: "#595c63", ...MONO, letterSpacing: "0.04em" }}>IPK KUMULATIF</p>
          <p style={{ fontSize: 28, fontWeight: 700, color: "#002045", lineHeight: 1.2, marginTop: 4 }}>{ipk.toFixed(2)}</p>
          <p style={{ fontSize: 11, color: "#0061a5", ...MONO }}>Cum Laude ≥ 3.75</p>
        </div>
        <div className="bg-white border border-[#c4c6cf] rounded p-4">
          <p style={{ fontSize: 11, color: "#595c63", ...MONO, letterSpacing: "0.04em" }}>IPS SEMESTER INI</p>
          <p style={{ fontSize: 28, fontWeight: 700, color: "#002045", lineHeight: 1.2, marginTop: 4 }}>{ips > 0 ? ips.toFixed(2) : "—"}</p>
          <p style={{ fontSize: 11, color: "#595c63", ...MONO }}>Semester {student.semester}</p>
        </div>
        <div className={`border rounded p-4 ${unpaidFinances.length > 0 ? "border-amber-300 bg-amber-50" : "bg-white border-[#c4c6cf]"}`}>
          <p style={{ fontSize: 11, color: "#595c63", ...MONO, letterSpacing: "0.04em" }}>TAGIHAN AKTIF</p>
          <p style={{ fontSize: 28, fontWeight: 700, color: unpaidFinances.length > 0 ? "#b45309" : "#002045", lineHeight: 1.2, marginTop: 4 }}>
            {unpaidFinances.length}
          </p>
          <p style={{ fontSize: 11, color: unpaidFinances.length > 0 ? "#b45309" : "#595c63", ...MONO }}>
            {unpaidFinances.length > 0 ? "Belum dibayar" : "Semua lunas"}
          </p>
        </div>
      </div>

      {/* Quick Navigation */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {quickCards.map((card) => (
          <Link
            key={card.path}
            to={card.path}
            className="group bg-white border border-[#c4c6cf] rounded p-4 flex flex-col gap-3 transition-all hover:border-[#0061a5] hover:shadow-sm"
          >
            <div className="w-9 h-9 rounded flex items-center justify-center" style={{ background: `${card.accent}18` }}>
              <card.icon className="w-4 h-4" style={{ color: card.accent }} />
            </div>
            <div>
              <p style={{ fontSize: 13, fontWeight: 600, color: "#002045" }}>{card.title}</p>
              <p style={{ fontSize: 11, color: "#595c63", marginTop: 2 }}>{card.desc}</p>
            </div>
          </Link>
        ))}
      </div>

      {/* Announcements */}
      {announcements.slice(0, 2).map((ann) => (
        <div
          key={ann.id}
          className={`border rounded p-4 flex gap-3 ${
            ann.type === "warning" ? "bg-amber-50 border-amber-200" :
            ann.type === "error" ? "bg-red-50 border-red-200" :
            ann.type === "success" ? "bg-green-50 border-green-200" :
            "bg-blue-50 border-blue-200"
          }`}
        >
          <AlertCircle className={`w-4 h-4 shrink-0 mt-0.5 ${
            ann.type === "warning" ? "text-amber-500" :
            ann.type === "error" ? "text-red-500" :
            ann.type === "success" ? "text-green-500" : "text-blue-500"
          }`} />
          <div>
            <div className="flex items-center gap-2 mb-0.5">
              <span style={{ fontSize: 12, fontWeight: 600, color: "#002045" }}>{ann.title}</span>
              <span style={{ fontSize: 10, color: "#595c63", ...MONO }}>{ann.date}</span>
            </div>
            <p style={{ fontSize: 12, color: "#43474e", lineHeight: 1.5 }}>{ann.content}</p>
          </div>
        </div>
      ))}

      {/* Academic Calendar */}
      <AcademicCalendar />

      {/* Lecture Status Section */}
      <LectureStatus />

      {/* Course List Section */}
      <CourseList />
    </div>
  );
}
