import { useState, useEffect, useRef } from "react";
import { useAppContext } from "../context/AppContext";
import { useLocation } from "react-router";
import { Clock, MapPin, Users, Calendar, ChevronLeft, ChevronRight } from "lucide-react";

const SM = { fontFamily: "'Hanken Grotesk', sans-serif" } as const;
const MONO = { fontFamily: "'JetBrains Mono', monospace" } as const;

const DAYS_ORDER = ["Senin", "Selasa", "Rabu", "Kamis", "Jumat"];
const HOURS = ["07:00", "08:00", "09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00"];

const COURSE_COLORS = [
  { bg: "#e8f0fb", border: "#0061a5", text: "#002045" },
  { bg: "#e8f5e9", border: "#10b981", text: "#064e3b" },
  { bg: "#f3e8ff", border: "#7c3aed", text: "#4c1d95" },
  { bg: "#fff3e0", border: "#f59e0b", text: "#78350f" },
  { bg: "#fce7f3", border: "#ec4899", text: "#831843" },
  { bg: "#e0f2fe", border: "#0ea5e9", text: "#0c4a6e" },
  { bg: "#f0fdf4", border: "#22c55e", text: "#14532d" },
];

function parseTime(timeStr: string): number {
  const [h, m] = timeStr.split(":").map(Number);
  return h * 60 + m;
}

export function JadwalPage() {
  const { myCourses, student } = useAppContext();
  const location = useLocation();
  // If navigated from Dashboard with a specific course, start in list view and highlight it
  const highlightCourseId: string | undefined = (location.state as any)?.highlightCourseId;
  const [view, setView] = useState<"grid" | "list">(highlightCourseId ? "list" : "grid");
  const highlightRef = useRef<HTMLDivElement>(null);

  // Scroll to highlighted course when rendered in list view
  useEffect(() => {
    if (highlightCourseId && view === "list") {
      setTimeout(() => highlightRef.current?.scrollIntoView({ behavior: "smooth", block: "center" }), 100);
    }
  }, [highlightCourseId, view]);

  const courseColorMap: Record<string, typeof COURSE_COLORS[0]> = {};
  myCourses.forEach((c, i) => {
    courseColorMap[c.id] = COURSE_COLORS[i % COURSE_COLORS.length];
  });

  const getTopPct = (startTime: string) => {
    const startMin = parseTime(startTime);
    const gridStart = parseTime("07:00");
    const gridEnd = parseTime("18:00");
    return ((startMin - gridStart) / (gridEnd - gridStart)) * 100;
  };

  const getHeightPct = (startTime: string, endTime: string) => {
    const startMin = parseTime(startTime);
    const endMin = parseTime(endTime);
    const gridEnd = parseTime("18:00");
    const gridStart = parseTime("07:00");
    return ((endMin - startMin) / (gridEnd - gridStart)) * 100;
  };

  const totalSKS = myCourses.reduce((s, c) => s + c.sks, 0);
  const today = DAYS_ORDER[new Date().getDay() - 1];

  return (
    <div className="flex flex-col gap-5" style={SM}>
      {/* Header */}
      <div className="bg-white border border-[#c4c6cf] rounded p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 style={{ fontSize: 22, fontWeight: 700, color: "#002045", letterSpacing: "-0.01em" }}>
              Jadwal Kuliah
            </h2>
            <p style={{ fontSize: 13, color: "#43474e", marginTop: 4 }}>
              Semester Ganjil 2026/2027 — {myCourses.length} mata kuliah, {totalSKS} SKS
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setView("grid")}
              className="px-4 py-2 rounded border transition-colors"
              style={{
                fontSize: 12,
                background: view === "grid" ? "#002045" : "transparent",
                color: view === "grid" ? "#ffffff" : "#43474e",
                borderColor: view === "grid" ? "#002045" : "#c4c6cf",
              }}
            >
              Tampilan Grid
            </button>
            <button
              onClick={() => setView("list")}
              className="px-4 py-2 rounded border transition-colors"
              style={{
                fontSize: 12,
                background: view === "list" ? "#002045" : "transparent",
                color: view === "list" ? "#ffffff" : "#43474e",
                borderColor: view === "list" ? "#002045" : "#c4c6cf",
              }}
            >
              Tampilan List
            </button>
          </div>
        </div>
      </div>

      {myCourses.length === 0 ? (
        <div className="bg-white border border-dashed border-[#c4c6cf] rounded p-12 flex flex-col items-center gap-3">
          <Calendar className="w-12 h-12" style={{ color: "#c4c6cf" }} />
          <p style={{ fontSize: 14, color: "#595c63" }}>Belum ada jadwal. Silakan ambil mata kuliah di halaman KRS.</p>
        </div>
      ) : view === "grid" ? (
        /* GRID VIEW */
        <div className="bg-white border border-[#c4c6cf] rounded overflow-hidden">
          <div className="overflow-x-auto">
            <div style={{ minWidth: 700 }}>
              {/* Day headers */}
              <div className="grid border-b border-[#e0e3e5]" style={{ gridTemplateColumns: "60px repeat(5, 1fr)" }}>
                <div className="border-r border-[#e0e3e5]" />
                {DAYS_ORDER.map((day) => (
                  <div
                    key={day}
                    className="py-3 px-3 text-center border-r border-[#e0e3e5]"
                    style={{
                      fontSize: 13,
                      fontWeight: 600,
                      color: day === today ? "#ffffff" : "#002045",
                      background: day === today ? "#002045" : "#f1f4f6",
                    }}
                  >
                    {day}
                    {day === today && (
                      <span className="ml-2 text-xs font-normal opacity-75">(Hari ini)</span>
                    )}
                  </div>
                ))}
              </div>

              {/* Time grid */}
              <div className="flex" style={{ height: 660 }}>
                {/* Time labels */}
                <div className="flex flex-col border-r border-[#e0e3e5] shrink-0" style={{ width: 60 }}>
                  {HOURS.map((h) => (
                    <div
                      key={h}
                      className="flex-1 flex items-start justify-center pt-1 border-b border-[#e0e3e5]"
                      style={{ fontSize: 10, color: "#595c63", ...MONO }}
                    >
                      {h}
                    </div>
                  ))}
                </div>

                {/* Day columns */}
                {DAYS_ORDER.map((day) => {
                  const coursesOnDay = myCourses.filter((c) => c.day === day);
                  return (
                    <div
                      key={day}
                      className="flex-1 relative border-r border-[#e0e3e5]"
                      style={{ background: day === today ? "#f7fafc" : "transparent" }}
                    >
                      {/* Hour grid lines */}
                      {HOURS.map((h, i) => (
                        <div
                          key={h}
                          className="absolute w-full border-b border-[#e0e3e5]"
                          style={{ top: `${(i / HOURS.length) * 100}%`, borderStyle: i % 2 === 0 ? "solid" : "dashed", borderColor: "#e0e3e5" }}
                        />
                      ))}

                      {/* Course blocks */}
                      {coursesOnDay.map((course) => {
                        const [startRaw, endRaw] = course.schedule.split(" - ");
                        const top = getTopPct(startRaw);
                        const height = getHeightPct(startRaw, endRaw);
                        const colors = courseColorMap[course.id];

                        return (
                          <div
                            key={course.id}
                            className="absolute left-1 right-1 rounded overflow-hidden shadow-sm hover:shadow-md transition-shadow cursor-default"
                            style={{
                              top: `${top}%`,
                              height: `${height}%`,
                              background: colors.bg,
                              borderLeft: `3px solid ${colors.border}`,
                              minHeight: 40,
                            }}
                          >
                            <div className="p-1.5 h-full overflow-hidden">
                              <p style={{ fontSize: 11, fontWeight: 700, color: colors.text, lineHeight: 1.3 }} className="truncate">
                                {course.name}
                              </p>
                              <p style={{ fontSize: 10, color: colors.text, opacity: 0.8, ...MONO }}>
                                {course.schedule}
                              </p>
                              <p style={{ fontSize: 10, color: colors.text, opacity: 0.7 }} className="truncate">
                                {course.room}
                              </p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* LIST VIEW */
        <div className="flex flex-col gap-4">
          {DAYS_ORDER.map((day) => {
            const coursesOnDay = myCourses.filter((c) => c.day === day).sort((a, b) => a.schedule.localeCompare(b.schedule));
            if (coursesOnDay.length === 0) return null;
            return (
              <div key={day} className="bg-white border border-[#c4c6cf] rounded overflow-hidden">
                <div
                  className="px-5 py-3 flex items-center justify-between"
                  style={{ background: day === today ? "#002045" : "#f1f4f6" }}
                >
                  <span style={{ fontSize: 14, fontWeight: 700, color: day === today ? "#ffffff" : "#002045" }}>
                    {day}
                  </span>
                  {day === today && (
                    <span className="px-2 py-0.5 rounded text-xs font-semibold bg-white/20 text-white" style={MONO}>
                      Hari ini
                    </span>
                  )}
                </div>
                <div className="divide-y divide-[#e0e3e5]">
                  {coursesOnDay.map((course) => {
                    const colors = courseColorMap[course.id];
                    const isHighlighted = course.id === highlightCourseId;
                    return (
                      <div
                        key={course.id}
                        ref={isHighlighted ? highlightRef : undefined}
                        className="px-5 py-4 flex flex-col sm:flex-row sm:items-center gap-3 transition-colors"
                        style={{
                          borderLeft: `4px solid ${colors.border}`,
                          background: isHighlighted ? colors.bg : undefined,
                          outline: isHighlighted ? `2px solid ${colors.border}` : undefined,
                          outlineOffset: isHighlighted ? "-2px" : undefined,
                        }}
                      >
                        <div className="flex-1">
                          <div className="flex items-start gap-3">
                            <div className="flex flex-col gap-0.5 w-20 shrink-0">
                              <span style={{ fontSize: 12, fontWeight: 600, color: "#002045", ...MONO }}>
                                {course.schedule.split(" - ")[0]}
                              </span>
                              <span style={{ fontSize: 11, color: "#595c63", ...MONO }}>
                                {course.schedule.split(" - ")[1]}
                              </span>
                            </div>
                            <div className="flex-1">
                              <p style={{ fontSize: 14, fontWeight: 700, color: "#181c1e" }}>{course.name}</p>
                              <p style={{ fontSize: 11, color: "#0061a5", ...MONO, fontWeight: 600 }}>{course.code}</p>
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-4 sm:gap-5">
                          <div className="flex items-center gap-1.5">
                            <MapPin className="w-3.5 h-3.5" style={{ color: "#595c63" }} />
                            <span style={{ fontSize: 12, color: "#43474e" }}>{course.room}</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <Users className="w-3.5 h-3.5" style={{ color: "#595c63" }} />
                            <span style={{ fontSize: 12, color: "#43474e" }}>{course.lecturer}</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <span
                              className="px-2 py-0.5 rounded-full text-xs font-semibold"
                              style={{ background: colors.bg, color: colors.text, border: `1px solid ${colors.border}30` }}
                            >
                              {course.sks} SKS
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Course Legend */}
      <div className="bg-white border border-[#c4c6cf] rounded p-4">
        <p style={{ fontSize: 12, fontWeight: 600, color: "#002045", marginBottom: 12 }}>Legenda Mata Kuliah</p>
        <div className="flex flex-wrap gap-3">
          {myCourses.map((course) => {
            const colors = courseColorMap[course.id];
            return (
              <div key={course.id} className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-sm" style={{ background: colors.border }} />
                <span style={{ fontSize: 12, color: "#43474e" }}>{course.name}</span>
                <span style={{ fontSize: 11, color: "#595c63", ...MONO }}>({course.code})</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
