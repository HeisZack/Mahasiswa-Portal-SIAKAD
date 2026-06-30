import { useState } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { CheckCircle2, Clock, XCircle, ChevronDown } from "lucide-react";
import { toast } from "sonner";
import { useAppContext } from "../context/AppContext";

const tabs = ["Absensi", "Kuisioner Kuliah", "Nilai", "Realisasi Kuliah"];

// Mock meetings data (1 to 16)
const meetings = Array.from({ length: 16 }, (_, i) => i + 1);

export function LectureStatus() {
  const { myCourses } = useAppContext();
  const [activeTab, setActiveTab] = useState("Absensi");

  const handleSemesterSelect = () => {
    toast("Pilih Semester", {
      description: "Dropdown riwayat semester akan segera hadir."
    });
  };

  // Real attendance calculation from attendedMeetings / totalMeetings
  const totalMeetingsAll = myCourses.reduce((s, c) => s + (c.totalMeetings ?? 0), 0);
  const attendedAll = myCourses.reduce((s, c) => s + (c.attendedMeetings ?? 0), 0);
  const percentage = totalMeetingsAll > 0 ? Math.round((attendedAll / totalMeetingsAll) * 100) : 0;

  // Approximate breakdown: un-attended split 30% Izin, 70% Alpha
  const notAttended = totalMeetingsAll - attendedAll;
  const izinTotal = Math.round(notAttended * 0.3);
  const alphaTotal = notAttended - izinTotal;
  const izinPct = totalMeetingsAll > 0 ? Math.round((izinTotal / totalMeetingsAll) * 100) : 0;
  const alphaPct = totalMeetingsAll > 0 ? 100 - percentage - izinPct : 0;

  const chartData = [
    { name: "Hadir", value: percentage, color: "#10b981" },
    { name: "Izin/Sakit", value: izinPct, color: "#eab308" },
    { name: "Alpha", value: Math.max(alphaPct, 0), color: "#ef4444" },
  ].filter(d => d.value > 0);

  return (
    <div className="bg-white border border-slate-100 rounded-xl shadow-sm overflow-hidden flex flex-col">
      <div className="p-4 sm:p-5 border-b border-slate-100">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
          <h3 className="font-bold text-slate-800 text-lg">Status Perkuliahan</h3>
          <button 
            onClick={handleSemesterSelect}
            className="flex items-center gap-2 text-sm font-medium text-slate-600 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-lg hover:bg-slate-100 transition-colors w-max"
          >
            Semester Ganjil 2026/2027
            <ChevronDown className="w-4 h-4 text-slate-400" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden gap-1 border-b border-slate-100 pb-px">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
                activeTab === tab
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {activeTab === "Absensi" && (
      <div className="p-4 sm:p-5 flex flex-col lg:flex-row gap-6">
        {/* Left: Donut Chart */}
        <div className="lg:w-1/3 flex flex-col items-center justify-center p-4 bg-slate-50/50 rounded-xl border border-slate-50">
          <div className="relative w-40 h-40" style={{ minWidth: 160, minHeight: 160 }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={75}
                  paddingAngle={2}
                  dataKey="value"
                  stroke="none"
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            {/* Center Label */}
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
              <span className="text-2xl font-bold text-slate-800">{percentage}%</span>
              <span className="text-[10px] uppercase font-bold tracking-wider text-emerald-600 bg-emerald-100 px-2 py-0.5 rounded-full mt-1">
                {percentage >= 80 ? "Baik" : percentage >= 60 ? "Cukup" : "Kurang"}
              </span>
            </div>
          </div>
          
          {/* Legend */}
          <div className="flex flex-wrap justify-center gap-3 mt-4 w-full">
            {chartData.map((item, idx) => (
              <div key={idx} className="flex items-center gap-1.5 text-xs">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }}></span>
                <span className="text-slate-600 font-medium">{item.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Attendance Table */}
        <div className="lg:w-2/3 flex flex-col">
          <h4 className="text-sm font-semibold text-slate-800 mb-3">Rekapitulasi Kehadiran per Pertemuan</h4>
          <div className="overflow-x-auto bg-white border border-slate-100 rounded-lg shadow-sm">
            <table className="w-full text-left border-collapse min-w-[600px]">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100">
                  <th className="p-3 text-xs font-semibold text-slate-500 w-32">Mata Kuliah</th>
                  {meetings.map((m) => (
                    <th key={m} className="p-2 text-xs font-semibold text-slate-500 text-center w-8">
                      {m}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {myCourses.map((course, idx) => {
                  // Use actual attendedMeetings and totalMeetings from context
                  const total = course.totalMeetings ?? 0;
                  const hadir = course.attendedMeetings ?? 0;
                  const notHadir = total - hadir;
                  // Last 1 un-attended = Izin, rest = Alpha
                  const izinCount = notHadir > 0 ? 1 : 0;
                  const alphaCount = notHadir - izinCount;

                  return (
                    <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                      <td className="p-3 text-xs font-medium text-slate-700 truncate max-w-[120px]" title={course.name}>
                        {course.name}
                      </td>
                      {meetings.map((m) => {
                        let statusIcon = <div className="w-4 h-4 bg-slate-100 rounded-full mx-auto" title="Belum terjadwal" />;
                        if (m <= total) {
                          if (m <= hadir) {
                            statusIcon = <CheckCircle2 className="w-4 h-4 text-emerald-500 mx-auto" title="Hadir" />;
                          } else if (m === hadir + 1 && izinCount > 0) {
                            statusIcon = <Clock className="w-4 h-4 text-yellow-500 mx-auto" title="Izin" />;
                          } else if (m <= hadir + 1 + alphaCount) {
                            statusIcon = <XCircle className="w-4 h-4 text-red-500 mx-auto" title="Alpha" />;
                          }
                        }
                        return (
                          <td key={m} className="p-2 text-center">{statusIcon}</td>
                        );
                      })}
                    </tr>
                  );
                })}
                {myCourses.length === 0 && (
                  <tr>
                    <td colSpan={17} className="p-8 text-center text-slate-500 text-sm">Tidak ada mata kuliah yang diambil.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <div className="mt-3 flex items-center justify-end gap-4 text-[10px] text-slate-500">
            <div className="flex items-center gap-1"><CheckCircle2 className="w-3 h-3 text-emerald-500" /> Hadir</div>
            <div className="flex items-center gap-1"><Clock className="w-3 h-3 text-yellow-500" /> Izin</div>
            <div className="flex items-center gap-1"><CheckCircle2 className="w-3 h-3 text-blue-500" /> Sakit</div>
            <div className="flex items-center gap-1"><XCircle className="w-3 h-3 text-red-500" /> Alpha</div>
            <div className="flex items-center gap-1"><div className="w-3 h-3 bg-slate-100 rounded-full" /> Belum Terjadwal</div>
          </div>
        </div>
      </div>
      )}

      {activeTab !== "Absensi" && (
        <div className="p-10 flex flex-col items-center justify-center text-center text-slate-500">
          <Clock className="w-12 h-12 text-slate-300 mb-3" />
          <p className="font-medium text-slate-700">Data {activeTab} Belum Tersedia</p>
          <p className="text-sm mt-1">Informasi ini sedang dipersiapkan untuk semester berjalan.</p>
        </div>
      )}
    </div>
  );
}
