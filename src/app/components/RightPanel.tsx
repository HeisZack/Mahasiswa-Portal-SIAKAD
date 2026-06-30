import { ImageWithFallback } from "./figma/ImageWithFallback";
import { Megaphone, CalendarDays, Receipt, FileSpreadsheet, CalendarClock, GraduationCap, ChevronRight } from "lucide-react";
import { useAppContext } from "../context/AppContext";
import { Link } from "react-router";

const quickLinks = [
  { icon: Megaphone, title: "Pengumuman", desc: "Info kampus terbaru", color: "bg-blue-100 text-blue-600", path: "/informasi" },
  { icon: CalendarDays, title: "Kalender", desc: "Agenda akademik", color: "bg-indigo-100 text-indigo-600", path: "/informasi" },
  { icon: Receipt, title: "Tagihan", desc: "Cek UKT & biaya", color: "bg-rose-100 text-rose-600", path: "/keuangan" },
  { icon: FileSpreadsheet, title: "Hasil Studi", desc: "Transkrip nilai", color: "bg-emerald-100 text-emerald-600", path: "/akademik" },
  { icon: CalendarClock, title: "Jadwal Ujian", desc: "UTS & UAS", color: "bg-amber-100 text-amber-600", path: "/jadwal" },
  { icon: GraduationCap, title: "Transkrip", desc: "Dokumen resmi", color: "bg-purple-100 text-purple-600", path: "/akademik" },
];

export function RightPanel() {
  const { student, totalSks, ipk, ips, totalSksTempuh } = useAppContext();


  return (
    <div className="flex flex-col gap-6">
      {/* Biodata Card */}
      <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="bg-gradient-to-br from-slate-50 to-slate-100 p-5 border-b border-slate-100 flex flex-col items-center text-center relative">
          <div className="w-20 h-20 rounded-full border-4 border-white shadow-sm overflow-hidden mb-3 bg-blue-100">
             <ImageWithFallback 
              src={student.avatarUrl} 
              alt="Profile" 
              className="w-full h-full object-cover"
            />
          </div>
          <h3 className="font-bold text-slate-800 text-lg leading-tight">{student.name}</h3>
          <p className="text-sm text-slate-500 mt-1">{student.nim}</p>
          <span className="mt-2 inline-block bg-emerald-100 text-emerald-700 text-xs font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
            {student.status}
          </span>
        </div>
        
        <div className="p-5 flex flex-col gap-3">
          <div className="flex justify-between items-center pb-2 border-b border-slate-50">
            <span className="text-xs text-slate-500">Program Studi</span>
            <span className="text-xs font-semibold text-slate-800 text-right">{student.major}</span>
          </div>
          <div className="flex justify-between items-center pb-2 border-b border-slate-50">
            <span className="text-xs text-slate-500">Fakultas</span>
            <span className="text-xs font-semibold text-slate-800 text-right">{student.faculty}</span>
          </div>
          <div className="flex justify-between items-center pb-2 border-b border-slate-50">
            <span className="text-xs text-slate-500">Semester / Kelas</span>
            <span className="text-xs font-semibold text-slate-800 text-right">{student.semester} / SI-{student.semester}A</span>
          </div>
          <div className="flex justify-between items-center pb-2 border-b border-slate-50">
            <span className="text-xs text-slate-500">IPK / IPS Terakhir</span>
            <span className="text-xs font-semibold text-slate-800 text-right">{ipk.toFixed(2)} / {ips.toFixed(2)}</span>
          </div>
          <div className="flex justify-between items-center pb-2 border-b border-slate-50">
            <span className="text-xs text-slate-500">SKS Ditempuh</span>
            <span className="text-xs font-semibold text-slate-800 text-right">{totalSksTempuh} SKS</span>
          </div>
          <div className="flex justify-between items-center pb-2 border-b border-slate-50">
            <span className="text-xs text-slate-500">Periode Masuk</span>
            <span className="text-xs font-semibold text-slate-800 text-right">Ganjil {student.angkatan}</span>
          </div>

          <Link
            to="/profil"
            className="w-full mt-2 text-sm font-medium text-blue-600 bg-blue-50 py-2 rounded-lg hover:bg-blue-100 transition-colors text-center block"
          >
            Lihat Selengkapnya
          </Link>
        </div>
      </div>

      {/* Quick Info Grid */}
      <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-5">
        <h3 className="font-bold text-slate-800 mb-4">Informasi Cepat</h3>
        <div className="grid grid-cols-2 gap-3">
          {quickLinks.map((link, idx) => (
            <Link 
              key={idx} 
              to={link.path}
              className="group text-left p-3 rounded-lg border border-slate-100 hover:border-blue-200 hover:shadow-sm bg-slate-50/50 hover:bg-blue-50/30 transition-all flex flex-col gap-2 relative"
            >
              <div className={`w-8 h-8 rounded-md flex items-center justify-center ${link.color}`}>
                <link.icon className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-semibold text-slate-800 group-hover:text-blue-700 transition-colors">{link.title}</h4>
                <p className="text-[10px] text-slate-500 mt-0.5">{link.desc}</p>
              </div>
              <ChevronRight className="w-3.5 h-3.5 text-slate-300 absolute top-3 right-3 group-hover:text-blue-500 transition-colors" />
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
