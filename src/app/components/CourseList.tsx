import { useState } from "react";
import { Clock, MapPin, Users, ChevronRight } from "lucide-react";
import { useAppContext } from "../context/AppContext";
import { useNavigate } from "react-router";

export function CourseList() {
  const { myCourses } = useAppContext();
  const navigate = useNavigate();
  const [filter, setFilter] = useState<"Semua" | "Hari Ini" | "Mendatang">("Semua");

  const DAYS_MAP = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];
  const today = DAYS_MAP[new Date().getDay()];

  const formattedCourses = myCourses.map((course) => ({
    ...course,
    dayStatus: course.day === today ? "Hari Ini" : "Mendatang",
  }));

  const filteredCourses = formattedCourses.filter((course) =>
    filter === "Semua" ? true : course.dayStatus === filter
  );

  const handleViewCourse = (courseId: string) => {
    // Navigate to Jadwal page and pass the selected course ID via state
    navigate("/jadwal", { state: { highlightCourseId: courseId } });
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <h3 className="font-bold text-slate-800 text-lg">Mata Kuliah</h3>

        <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-lg w-max">
          {["Semua", "Hari Ini", "Mendatang"].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f as any)}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                filter === f
                  ? "bg-white text-blue-600 shadow-sm"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredCourses.map((course) => (
          <div
            key={course.id}
            onClick={() => handleViewCourse(course.id)}
            className="bg-white border border-slate-100 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow flex flex-col h-full relative group cursor-pointer hover:border-blue-200"
            role="button"
            tabIndex={0}
            aria-label={`Lihat jadwal ${course.name}`}
            onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") handleViewCourse(course.id); }}
          >
            {course.dayStatus === "Hari Ini" && (
              <div className="absolute -top-2 -right-2 bg-orange-500 text-white text-[10px] font-bold px-2 py-1 rounded-md shadow-sm">
                HARI INI
              </div>
            )}
            <div className="flex justify-between items-start mb-2">
              <span className="bg-blue-50 text-blue-700 text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider">
                {course.code} • {course.sks} SKS
              </span>
              <span className="text-[10px] font-medium text-slate-500 bg-slate-50 px-2 py-0.5 rounded border border-slate-100">
                {course.type}
              </span>
            </div>

            <h4 className="font-semibold text-slate-800 text-sm leading-tight mb-3 line-clamp-2" title={course.name}>
              {course.name}
            </h4>

            <div className="flex flex-col gap-2 mt-auto mb-4">
              <div className="flex items-center gap-2 text-xs text-slate-600">
                <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span>{course.day}, {course.schedule}</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-600">
                <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span className="truncate" title={course.room}>{course.room}</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-600">
                <Users className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span className="truncate" title={course.lecturer}>{course.lecturer}</span>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
              <div className="flex flex-col gap-1">
                <span className="text-[10px] text-slate-500 font-medium uppercase">Kehadiran</span>
                <div className="flex items-center gap-2">
                  <div className="w-16 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${course.attendance >= 80 ? "bg-emerald-500" : course.attendance >= 70 ? "bg-yellow-500" : "bg-red-500"}`}
                      style={{ width: `${course.attendance}%` }}
                    />
                  </div>
                  <span className="text-xs font-bold text-slate-700">{course.attendance}%</span>
                </div>
              </div>
              <div className="flex items-center justify-center p-1.5 rounded-lg bg-blue-50 text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                <ChevronRight className="w-4 h-4" />
              </div>
            </div>
          </div>
        ))}

        {filteredCourses.length === 0 && (
          <div className="col-span-full py-10 flex flex-col items-center justify-center bg-slate-50 rounded-xl border border-dashed border-slate-200">
            <Clock className="w-10 h-10 text-slate-300 mb-2" />
            <p className="text-slate-500 text-sm">Tidak ada mata kuliah untuk filter ini.</p>
          </div>
        )}
      </div>
    </div>
  );
}
