import { useState, useRef, useEffect, KeyboardEvent } from "react";
import { X, Send, Zap, Bot, RotateCcw, Maximize2, Minimize2 } from "lucide-react";
import { useAppContext } from "../context/AppContext";

interface Message {
  role: "user" | "ai";
  text: string;
  time: string;
}

function formatTime() {
  return new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" });
}

function renderText(text: string) {
  return text.split("\n").map((line, i, arr) => (
    <span key={i}>
      {line.split(/\*\*(.*?)\*\*/g).map((part, j) =>
        j % 2 === 1 ? <strong key={j}>{part}</strong> : <span key={j}>{part}</span>
      )}
      {i < arr.length - 1 && <br />}
    </span>
  ));
}

interface AIAssistantProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AIAssistant({ isOpen, onClose }: AIAssistantProps) {
  const {
    student, myCourses, totalSks, ipk, ips,
    finances, announcements, totalSksTempuh, targetSksLulus,
  } = useAppContext();

  // Live computed values
  const DAYS_MAP = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];
  const todayName = DAYS_MAP[new Date().getDay()];
  const todayCourses = myCourses.filter((c) => c.day === todayName);
  const unpaidFinances = finances.filter((f) => f.status === "Belum Lunas" && f.amount > 0);
  const totalUnpaid = unpaidFinances.reduce((s, f) => s + f.amount, 0);
  const avgAttendance = myCourses.length > 0
    ? Math.round(myCourses.reduce((s, c) => {
        const pct = c.totalMeetings ? Math.round(((c.attendedMeetings ?? 0) / c.totalMeetings) * 100) : (c.attendance ?? 0);
        return s + pct;
      }, 0) / myCourses.length)
    : 0;
  const lowAttendance = myCourses.filter((c) => {
    const pct = c.totalMeetings ? Math.round(((c.attendedMeetings ?? 0) / c.totalMeetings) * 100) : (c.attendance ?? 0);
    return pct < 75;
  });
  const progressPct = Math.min((totalSksTempuh / targetSksLulus) * 100, 100);

  const buildGreeting = () =>
    `Halo, **${student.name}**! 👋 Saya **Asisten AI** portal akademikmu.\n\nRingkasan cepat:\n• IPK kamu: **${ipk.toFixed(2)}** · SKS aktif: **${totalSks}**\n• Rata-rata kehadiran: **${avgAttendance}%**${unpaidFinances.length > 0 ? `\n• ⚠️ ${unpaidFinances.length} tagihan belum dibayar` : "\n• ✅ Tidak ada tagihan tunggakan"}\n\nApa yang bisa saya bantu?`;

  const findReply = (text: string): string => {
    const t = text.toLowerCase();

    // IPK / nilai
    if (t.includes("ipk") || t.includes("nilai kumulatif") || t.includes("ip ")) {
      return `IPK kumulatif **${student.name}** saat ini adalah **${ipk.toFixed(2)}** (skala 4.00).\nIPS semester ini: **${ips > 0 ? ips.toFixed(2) : "belum tersedia"}**\n\nPredikat: **${ipk >= 3.75 ? "Cum Laude (Pujian) 🎉" : ipk >= 3.5 ? "Sangat Memuaskan" : "Memuaskan"}**`;
    }

    // KRS / mata kuliah
    if (t.includes("krs") || t.includes("mata kuliah") || t.includes("kuliah apa") || t.includes("semester ini")) {
      return `Semester ini kamu mengambil **${myCourses.length} mata kuliah** (${totalSks} SKS):\n${myCourses.map((c) => `• **${c.name}** (${c.code}) — ${c.sks} SKS · ${c.day} ${c.schedule}`).join("\n")}\n\nStatus KRS: Disetujui PA oleh **${student.advisor}**.`;
    }

    // Jadwal
    if (t.includes("jadwal") || t.includes("hari ini") || t.includes("schedule") || t.includes("perkuliahan hari")) {
      if (todayCourses.length > 0) {
        return `Jadwal kuliah **${todayName}** (hari ini):\n${todayCourses.map((c) => `• **${c.schedule}** — ${c.name}\n  📍 ${c.room} · 👤 ${c.lecturer}`).join("\n")}`;
      }
      const nextCourse = myCourses.filter((c) => c.day !== todayName)[0];
      return `Tidak ada jadwal kuliah hari ini (${todayName}).${nextCourse ? `\n\nJadwal terdekat: **${nextCourse.name}** — ${nextCourse.day} ${nextCourse.schedule} di ${nextCourse.room}` : "\n\nLihat halaman **Jadwal Kuliah** untuk info lengkap."}`;
    }

    // Absensi / kehadiran
    if (t.includes("hadir") || t.includes("absen") || t.includes("kehadiran")) {
      if (lowAttendance.length > 0) {
        return `⚠️ Perhatikan kehadiran di mata kuliah berikut:\n${lowAttendance.map((c) => {
          const pct = c.totalMeetings ? Math.round(((c.attendedMeetings ?? 0) / c.totalMeetings) * 100) : (c.attendance ?? 0);
          return `• **${c.name}** (${c.code}): **${pct}%** — ${c.attendedMeetings ?? "?"}/${c.totalMeetings ?? "?"} pertemuan`;
        }).join("\n")}\n\nBatas minimal kehadiran untuk ikut UAS adalah **75%**.\n\nRata-rata kehadiran seluruh MK: **${avgAttendance}%**`;
      }
      return `✅ Kehadiran kamu aman di semua mata kuliah!\nRata-rata: **${avgAttendance}%**\n\n${myCourses.map((c) => {
        const pct = c.totalMeetings ? Math.round(((c.attendedMeetings ?? 0) / c.totalMeetings) * 100) : (c.attendance ?? 0);
        return `• ${c.name}: ${pct}% (${c.attendedMeetings ?? "?"}/${c.totalMeetings ?? "?"} pertemuan)`;
      }).join("\n")}`;
    }

    // Keuangan / tagihan / ukt / bayar
    if (t.includes("uang") || t.includes("bayar") || t.includes("ukt") || t.includes("tagih") || t.includes("keuangan") || t.includes("tunggakan")) {
      if (unpaidFinances.length > 0) {
        return `💳 Kamu memiliki **${unpaidFinances.length} tagihan** belum dibayar:\n${unpaidFinances.map((f) => `• **${f.description}**\n  Rp ${f.amount.toLocaleString("id-ID")} — jatuh tempo ${new Date(f.dueDate).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}`).join("\n")}\n\nTotal tunggakan: **Rp ${totalUnpaid.toLocaleString("id-ID")}**\n\nBayar via VA BNI: **8277${student.nim}**`;
      }
      return `✅ Semua tagihan sudah lunas. Tidak ada tunggakan aktif.\n\nUntuk informasi detail, kunjungi halaman **Keuangan**.`;
    }

    // SKS / progress
    if (t.includes("sks") || t.includes("kredit") || t.includes("progress") || t.includes("kelulusan")) {
      return `Progress SKS kelulusan:\n• SKS ditempuh: **${totalSksTempuh}** dari ${targetSksLulus} SKS (**${progressPct.toFixed(1)}%**)\n• SKS semester ini: **${totalSks}** SKS\n• Sisa: **${targetSksLulus - totalSksTempuh}** SKS\n\nSemester aktif: **${student.semester}** (Angkatan ${student.angkatan})`;
    }

    // Nilai / grade
    if (t.includes("nilai") || t.includes("grade") || t.includes("khs") || t.includes("hasil studi")) {
      const graded = myCourses.filter((c) => c.grade);
      if (graded.length > 0) {
        return `Nilai semester ini:\n${graded.map((c) => `• **${c.name}**: ${c.grade} (bobot ${c.score?.toFixed(2)})`).join("\n")}${myCourses.filter((c) => !c.grade).length > 0 ? `\n\nBelum ada nilai: ${myCourses.filter((c) => !c.grade).map((c) => c.name).join(", ")}` : ""}`;
      }
      return `Nilai semester ini belum tersedia. Pantau di halaman **Akademik → KHS Semester Ini**.`;
    }

    // Profil / NIM / data diri
    if (t.includes("profil") || t.includes("nim") || t.includes("data diri") || t.includes("siapa saya")) {
      return `Profil **${student.name}**:\n• NIM: ${student.nim}\n• Program Studi: ${student.major}\n• Fakultas: ${student.faculty}\n• Semester: ${student.semester} (Angkatan ${student.angkatan})\n• Status: ${student.status}\n• Dosen PA: ${student.advisor}`;
    }

    // Pengumuman / info
    if (t.includes("pengumuman") || t.includes("info") || t.includes("berita") || t.includes("kabar")) {
      if (announcements.length > 0) {
        return `📢 **${announcements.length} pengumuman** terbaru:\n\n${announcements.slice(0, 3).map((a) => `• **${a.title}** (${a.date})\n  ${a.content.slice(0, 80)}${a.content.length > 80 ? "..." : ""}`).join("\n\n")}`;
      }
      return `Tidak ada pengumuman aktif saat ini. Pantau di halaman **Informasi**.`;
    }

    // Syarat lulus / kelulusan
    if (t.includes("lulus") || t.includes("syarat") || t.includes("wisuda")) {
      return `Syarat kelulusan **${student.major}**:\n• Minimal **${targetSksLulus} SKS** ditempuh (kamu sudah ${totalSksTempuh} SKS — ${progressPct.toFixed(0)}% ✅)\n• IPK minimal **2.75** (IPK kamu: ${ipk.toFixed(2)} ✅)\n• Kehadiran minimal **75%** per mata kuliah\n• Lulus semua mata kuliah wajib\n• Menyelesaikan Tugas Akhir\n• Bebas tanggungan keuangan`;
    }

    // Dosen / pengampu
    if (t.includes("dosen") || t.includes("pengampu") || t.includes("siapa yang mengajar")) {
      return `Dosen mata kuliah semester ini:\n${myCourses.map((c) => `• **${c.name}** (${c.code}): ${c.lecturer}`).join("\n")}`;
    }

    return `Maaf, saya belum bisa menjawab itu secara spesifik. 🙏\n\nCoba tanyakan:\n• **IPK atau nilai** saya\n• **Jadwal kuliah** hari ini\n• **Kehadiran** saya\n• **Tagihan** yang belum dibayar\n• **KRS** semester ini\n• **Syarat lulus**\n\nAtau kunjungi halaman yang sesuai di sidebar.`;
  };

  const suggestions = [
    "Berapa IPK saya?",
    "Jadwal kuliah hari ini?",
    "Kehadiran saya bagaimana?",
    "Ada tagihan yang belum dibayar?",
    "Lihat KRS semester ini",
    "Syarat lulus apa saja?",
  ];

  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const [maximized, setMaximized] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const initializedRef = useRef(false);

  useEffect(() => {
    if (isOpen && !initializedRef.current) {
      initializedRef.current = true;
      setMessages([{ role: "ai", text: buildGreeting(), time: formatTime() }]);
    }
    if (isOpen) setTimeout(() => inputRef.current?.focus(), 100);
  }, [isOpen]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typing]);

  const sendMessage = (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || typing) return;
    setMessages((prev) => [...prev, { role: "user", text: trimmed, time: formatTime() }]);
    setInput("");
    setTyping(true);
    setTimeout(() => {
      setMessages((prev) => [...prev, { role: "ai", text: findReply(trimmed), time: formatTime() }]);
      setTyping(false);
    }, 700 + Math.random() * 400);
  };

  const handleKey = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(input); }
  };

  const reset = () => {
    initializedRef.current = false;
    setMessages([{ role: "ai", text: buildGreeting(), time: formatTime() }]);
    initializedRef.current = true;
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-6"
      style={{ background: "rgba(26,37,64,0.5)", backdropFilter: "blur(6px)" }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        className="flex flex-col w-full sm:w-auto transition-all duration-300 rounded-t-3xl sm:rounded-2xl overflow-hidden"
        style={{
          background: "white",
          border: "1px solid #e2e8f0",
          boxShadow: "0 25px 60px rgba(26,37,64,0.2)",
          width: maximized ? "min(720px, 95vw)" : "min(460px, 95vw)",
          height: maximized ? "min(700px, 90vh)" : "min(580px, 85vh)",
        }}
      >
        {/* Header */}
        <div className="flex items-center gap-3 px-4 py-3 flex-shrink-0"
          style={{ background: "linear-gradient(135deg, #002045, #0061a5)", borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
          <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ background: "rgba(255,255,255,0.15)", border: "1px solid rgba(255,255,255,0.25)" }}>
            <Zap size={17} color="#66affe" />
          </div>
          <div className="flex-1">
            <p style={{ color: "white", fontWeight: 700, fontSize: "0.88rem", lineHeight: 1.2, fontFamily: "inherit" }}>
              Asisten AI Akademik
            </p>
            <div className="flex items-center gap-1.5 mt-0.5">
              <div className="w-1.5 h-1.5 rounded-full" style={{ background: "#22c55e" }} />
              <span style={{ color: "rgba(255,255,255,0.7)", fontSize: "0.65rem" }}>Online · {student.name}</span>
            </div>
          </div>
          <div className="flex items-center gap-1.5">
            <button onClick={reset} title="Reset chat"
              className="w-8 h-8 flex items-center justify-center rounded-lg transition-colors hover:bg-white/10"
              style={{ color: "rgba(255,255,255,0.5)" }}>
              <RotateCcw size={14} />
            </button>
            <button onClick={() => setMaximized(!maximized)} title={maximized ? "Kecilkan" : "Perbesar"}
              className="w-8 h-8 flex items-center justify-center rounded-lg transition-colors hover:bg-white/10 hidden sm:flex"
              style={{ color: "rgba(255,255,255,0.5)" }}>
              {maximized ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
            </button>
            <button onClick={onClose} title="Tutup"
              className="w-8 h-8 flex items-center justify-center rounded-lg transition-colors hover:bg-white/10"
              style={{ color: "rgba(255,255,255,0.5)" }}>
              <X size={14} />
            </button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4"
          style={{ background: "#f8fafc", scrollbarWidth: "thin", scrollbarColor: "#e2e8f0 transparent" }}>
          {messages.map((msg, i) => (
            <div key={i} className={`flex gap-2.5 ${msg.role === "user" ? "flex-row-reverse" : "flex-row"}`}>
              {msg.role === "ai" && (
                <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5"
                  style={{ background: "linear-gradient(135deg, #002045, #0061a5)" }}>
                  <Bot size={14} color="white" />
                </div>
              )}
              {msg.role === "user" && (
                <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5 text-xs font-bold"
                  style={{ background: "linear-gradient(135deg, #0061a5, #66affe)", color: "white" }}>
                  {student.name.slice(0, 2).toUpperCase()}
                </div>
              )}
              <div className="max-w-[78%]">
                <div className="px-4 py-3 rounded-2xl text-sm leading-relaxed"
                  style={{
                    background: msg.role === "user" ? "#0061a5" : "white",
                    color: msg.role === "user" ? "white" : "#002045",
                    border: msg.role === "ai" ? "1px solid #e2e8f0" : "none",
                    boxShadow: msg.role === "ai" ? "0 1px 4px rgba(0,0,0,0.06)" : "none",
                    borderRadius: msg.role === "user" ? "18px 18px 4px 18px" : "4px 18px 18px 18px",
                  }}>
                  {renderText(msg.text)}
                </div>
                <p className="mt-1 text-xs px-1"
                  style={{ color: "#94a3b8", textAlign: msg.role === "user" ? "right" : "left" }}>
                  {msg.time}
                </p>
              </div>
            </div>
          ))}

          {typing && (
            <div className="flex gap-2.5">
              <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ background: "linear-gradient(135deg, #002045, #0061a5)" }}>
                <Bot size={14} color="white" />
              </div>
              <div className="px-4 py-3 rounded-2xl" style={{ background: "white", border: "1px solid #e2e8f0", borderRadius: "4px 18px 18px 18px" }}>
                <div className="flex gap-1 items-center h-4">
                  {[0, 1, 2].map((i) => (
                    <div key={i} className="w-2 h-2 rounded-full" style={{
                      background: "#0061a5",
                      animation: `typingBounce 1.2s ease-in-out ${i * 0.2}s infinite`,
                    }} />
                  ))}
                </div>
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {/* Suggestions */}
        <div className="px-4 py-2.5 flex-shrink-0" style={{ background: "white", borderTop: "1px solid #f1f5f9" }}>
          <p style={{ color: "#94a3b8", fontSize: "0.65rem", fontWeight: 600, marginBottom: "6px", textTransform: "uppercase", letterSpacing: "0.05em" }}>
            Pertanyaan cepat
          </p>
          <div className="flex gap-2 overflow-x-auto pb-1" style={{ scrollbarWidth: "none" }}>
            {suggestions.map((s) => (
              <button key={s} onClick={() => sendMessage(s)} disabled={typing}
                className="flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-all hover:scale-105 disabled:opacity-50"
                style={{ background: "#e8f0fb", color: "#0061a5", border: "1px solid #c4c6cf", whiteSpace: "nowrap" }}>
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* Input */}
        <div className="px-4 py-3 flex-shrink-0" style={{ background: "white", borderTop: "1px solid #e2e8f0" }}>
          <div className="flex gap-2 items-center">
            <input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKey}
              disabled={typing}
              placeholder="Ketik pertanyaan akademikmu..."
              className="flex-1 px-4 py-2.5 rounded-xl text-sm outline-none transition-all"
              style={{ background: "#f8fafc", border: "1px solid #e2e8f0", color: "#002045" }}
            />
            <button
              onClick={() => sendMessage(input)}
              disabled={!input.trim() || typing}
              className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-all hover:scale-105 disabled:opacity-40 disabled:scale-100"
              style={{ background: "linear-gradient(135deg, #002045, #0061a5)" }}
            >
              <Send size={16} color="white" />
            </button>
          </div>
          <p className="text-center mt-2 text-xs" style={{ color: "#cbd5e1" }}>
            Enter untuk kirim · Data diambil dari sistem SIAKAD Anda
          </p>
        </div>
      </div>

      <style>{`
        @keyframes typingBounce {
          0%, 60%, 100% { transform: translateY(0); opacity: 0.5; }
          30% { transform: translateY(-5px); opacity: 1; }
        }
      `}</style>
    </div>
  );
}
