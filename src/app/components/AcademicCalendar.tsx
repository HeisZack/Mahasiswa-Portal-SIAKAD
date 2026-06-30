import { useState } from "react";
import { ChevronLeft, ChevronRight, CalendarDays } from "lucide-react";
import { useAppContext } from "../context/AppContext";
import type { AcademicCalendarEvent } from "../context/AppContext";

const MONTHS = [
  "Januari", "Februari", "Maret", "April", "Mei", "Juni",
  "Juli", "Agustus", "September", "Oktober", "November", "Desember",
];
const DAYS = ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"];

const EVENT_COLORS: Record<AcademicCalendarEvent["type"], { bg: string; text: string; dot: string; badge: string }> = {
  ujian:       { bg: "bg-red-50",    text: "text-red-700",    dot: "bg-red-500",    badge: "bg-red-100 text-red-700" },
  libur:       { bg: "bg-green-50",  text: "text-green-700",  dot: "bg-green-500",  badge: "bg-green-100 text-green-700" },
  pendaftaran: { bg: "bg-amber-50",  text: "text-amber-700",  dot: "bg-amber-500",  badge: "bg-amber-100 text-amber-700" },
  kegiatan:    { bg: "bg-blue-50",   text: "text-blue-700",   dot: "bg-blue-500",   badge: "bg-blue-100 text-blue-700" },
  pengumuman:  { bg: "bg-purple-50", text: "text-purple-700", dot: "bg-purple-500", badge: "bg-purple-100 text-purple-700" },
};

const EVENT_LABELS: Record<AcademicCalendarEvent["type"], string> = {
  ujian: "Ujian", libur: "Libur", pendaftaran: "Pendaftaran", kegiatan: "Kegiatan", pengumuman: "Pengumuman",
};

function isBetween(date: Date, start: Date, end: Date) {
  return date >= start && date <= end;
}

function sameDay(a: Date, b: Date) {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

function getEventsForDate(events: AcademicCalendarEvent[], date: Date): AcademicCalendarEvent[] {
  return events.filter((ev) => {
    const start = new Date(ev.date);
    const end = ev.endDate ? new Date(ev.endDate) : start;
    return isBetween(date, start, end);
  });
}

export function AcademicCalendar() {
  const { academicCalendar } = useAppContext();
  const today = new Date();
  const [current, setCurrent] = useState({ year: today.getFullYear(), month: today.getMonth() });
  const [selectedDate, setSelectedDate] = useState<Date | null>(today);

  const firstDay = new Date(current.year, current.month, 1).getDay();
  const daysInMonth = new Date(current.year, current.month + 1, 0).getDate();

  const prevMonth = () => {
    setCurrent((c) => {
      const m = c.month === 0 ? 11 : c.month - 1;
      const y = c.month === 0 ? c.year - 1 : c.year;
      return { year: y, month: m };
    });
  };

  const nextMonth = () => {
    setCurrent((c) => {
      const m = c.month === 11 ? 0 : c.month + 1;
      const y = c.month === 11 ? c.year + 1 : c.year;
      return { year: y, month: m };
    });
  };

  const selectedEvents = selectedDate ? getEventsForDate(academicCalendar, selectedDate) : [];

  const upcomingEvents = academicCalendar
    .filter((ev) => {
      const evDate = new Date(ev.date);
      return evDate >= today;
    })
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 4);

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" });
  };

  return (
    <div className="bg-white border border-[#c4c6cf] rounded" style={{ fontFamily: "'Hanken Grotesk', sans-serif" }}>
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-[#c4c6cf]" style={{ background: "#002045" }}>
        <div className="flex items-center gap-2">
          <CalendarDays className="w-5 h-5 text-white/80" />
          <span className="text-white font-semibold" style={{ fontSize: 15 }}>Kalender Akademik</span>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={prevMonth} className="p-1 rounded text-white/70 hover:text-white hover:bg-white/10 transition-colors">
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="text-white font-medium min-w-[120px] text-center" style={{ fontSize: 13, fontFamily: "'JetBrains Mono', monospace" }}>
            {MONTHS[current.month]} {current.year}
          </span>
          <button onClick={nextMonth} className="p-1 rounded text-white/70 hover:text-white hover:bg-white/10 transition-colors">
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row">
        {/* Calendar Grid */}
        <div className="flex-1 p-4">
          {/* Day headers */}
          <div className="grid grid-cols-7 mb-2">
            {DAYS.map((d) => (
              <div key={d} className="text-center py-1" style={{ fontSize: 11, fontFamily: "'JetBrains Mono', monospace", color: "#595c63", fontWeight: 600, letterSpacing: "0.04em" }}>
                {d}
              </div>
            ))}
          </div>

          {/* Date cells */}
          <div className="grid grid-cols-7 gap-0.5">
            {Array.from({ length: firstDay }).map((_, i) => (
              <div key={`empty-${i}`} />
            ))}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const date = new Date(current.year, current.month, i + 1);
              const dayEvents = getEventsForDate(academicCalendar, date);
              const isToday = sameDay(date, today);
              const isSelected = selectedDate && sameDay(date, selectedDate);

              return (
                <button
                  key={i}
                  onClick={() => setSelectedDate(date)}
                  className={`relative flex flex-col items-center py-1.5 rounded transition-colors group ${
                    isSelected ? "bg-[#002045]" : isToday ? "bg-[#e8f0fb]" : "hover:bg-[#f1f4f6]"
                  }`}
                >
                  <span
                    style={{
                      fontSize: 13,
                      fontFamily: "'JetBrains Mono', monospace",
                      fontWeight: isToday || isSelected ? 700 : 400,
                      color: isSelected ? "#ffffff" : isToday ? "#002045" : "#181c1e",
                    }}
                  >
                    {i + 1}
                  </span>
                  {dayEvents.length > 0 && (
                    <div className="flex gap-0.5 mt-0.5">
                      {dayEvents.slice(0, 3).map((ev) => (
                        <span
                          key={ev.id}
                          className={`w-1.5 h-1.5 rounded-full ${isSelected ? "bg-white" : EVENT_COLORS[ev.type].dot}`}
                        />
                      ))}
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          {/* Legend */}
          <div className="mt-4 flex flex-wrap gap-x-4 gap-y-1.5 pt-3 border-t border-[#e0e3e5]">
            {(Object.keys(EVENT_LABELS) as AcademicCalendarEvent["type"][]).map((type) => (
              <div key={type} className="flex items-center gap-1.5">
                <span className={`w-2 h-2 rounded-full ${EVENT_COLORS[type].dot}`} />
                <span style={{ fontSize: 11, color: "#43474e", fontFamily: "'JetBrains Mono', monospace" }}>
                  {EVENT_LABELS[type]}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Right panel: selected date events + upcoming */}
        <div className="w-full lg:w-64 border-t lg:border-t-0 lg:border-l border-[#c4c6cf] flex flex-col">
          {/* Selected Date Events */}
          <div className="p-4 border-b border-[#e0e3e5]">
            <p className="font-semibold mb-3" style={{ fontSize: 13, color: "#002045", fontFamily: "'Hanken Grotesk', sans-serif" }}>
              {selectedDate
                ? selectedDate.toLocaleDateString("id-ID", { weekday: "long", day: "numeric", month: "long" })
                : "Pilih tanggal"}
            </p>
            {selectedEvents.length === 0 ? (
              <p style={{ fontSize: 12, color: "#595c63" }}>Tidak ada agenda pada tanggal ini.</p>
            ) : (
              <div className="flex flex-col gap-2">
                {selectedEvents.map((ev) => (
                  <div key={ev.id} className={`p-2.5 rounded border-l-2 ${EVENT_COLORS[ev.type].bg}`} style={{ borderLeftColor: ev.type === "ujian" ? "#ef4444" : ev.type === "libur" ? "#22c55e" : ev.type === "pendaftaran" ? "#f59e0b" : ev.type === "kegiatan" ? "#3b82f6" : "#a855f7" }}>
                    <div className="flex items-start justify-between gap-1 mb-1">
                      <p className={`font-semibold leading-tight ${EVENT_COLORS[ev.type].text}`} style={{ fontSize: 12 }}>
                        {ev.title}
                      </p>
                      <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded shrink-0 ${EVENT_COLORS[ev.type].badge}`} style={{ fontFamily: "'JetBrains Mono', monospace", letterSpacing: "0.03em" }}>
                        {EVENT_LABELS[ev.type]}
                      </span>
                    </div>
                    {ev.description && (
                      <p className={`${EVENT_COLORS[ev.type].text} opacity-80`} style={{ fontSize: 11, lineHeight: 1.4 }}>
                        {ev.description}
                      </p>
                    )}
                    {ev.endDate && (
                      <p className={`mt-1 ${EVENT_COLORS[ev.type].text} opacity-70`} style={{ fontSize: 10, fontFamily: "'JetBrains Mono', monospace" }}>
                        s.d. {formatDate(ev.endDate)}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Upcoming Events */}
          <div className="p-4 flex-1">
            <p className="font-semibold mb-3" style={{ fontSize: 13, color: "#002045" }}>Agenda Mendatang</p>
            <div className="flex flex-col gap-2">
              {upcomingEvents.map((ev) => (
                <div key={ev.id} className="flex items-start gap-2.5">
                  <span className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${EVENT_COLORS[ev.type].dot}`} />
                  <div>
                    <p className="font-medium" style={{ fontSize: 12, color: "#181c1e", lineHeight: 1.4 }}>{ev.title}</p>
                    <p style={{ fontSize: 11, color: "#595c63", fontFamily: "'JetBrains Mono', monospace" }}>
                      {formatDate(ev.date)}{ev.endDate ? ` — ${formatDate(ev.endDate)}` : ""}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
