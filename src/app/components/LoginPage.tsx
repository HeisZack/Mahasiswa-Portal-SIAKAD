import { useState } from "react";
import { useAppContext } from "../context/AppContext";
import { Eye, EyeOff, LogIn, AlertCircle, GraduationCap, BookOpen, Calendar, CreditCard, MonitorPlay } from "lucide-react";
import { toast } from "sonner";

const MONO: React.CSSProperties = { fontFamily: "'JetBrains Mono', monospace" };
const SANS: React.CSSProperties = { fontFamily: "'Hanken Grotesk', sans-serif" };

export function LoginPage() {
  const { login } = useAppContext();
  const [nim, setNim] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!nim.trim()) { setError("NIM tidak boleh kosong."); return; }
    if (!password) { setError("Password tidak boleh kosong."); return; }

    setLoading(true);
    await new Promise((r) => setTimeout(r, 700));
    setLoading(false);

    const ok = login(nim.trim(), password);
    if (ok) {
      toast.success("Login berhasil — Selamat datang!");
    } else {
      setError("NIM atau password salah. Periksa kembali dan coba lagi.");
    }
  };

  const fillDemo = () => {
    setNim("2023101080");
    setPassword("123456");
    setError("");
  };

  const features = [
    { icon: BookOpen, label: "KRS & Akademik" },
    { icon: Calendar, label: "Jadwal Kuliah" },
    { icon: CreditCard, label: "Keuangan & UKT" },
    { icon: MonitorPlay, label: "Perkuliahan" },
  ];

  return (
    <div className="min-h-screen flex" style={{ ...SANS, background: "#f7fafc" }}>

      {/* ── Left: branding panel ── */}
      <div
        className="hidden lg:flex lg:w-[46%] xl:w-[48%] relative flex-col overflow-hidden"
        style={{ background: "linear-gradient(150deg, #001530 0%, #002045 55%, #003d7a 100%)" }}
      >
        {/* decorative rings */}
        <div className="absolute -top-32 -left-32 w-[480px] h-[480px] rounded-full border border-white/5" />
        <div className="absolute -top-20 -left-20 w-[360px] h-[360px] rounded-full border border-white/5" />
        <div className="absolute bottom-0 right-0 w-80 h-80 rounded-full" style={{ background: "radial-gradient(circle, rgba(0,97,165,0.25) 0%, transparent 70%)" }} />

        <div className="relative z-10 flex flex-col h-full p-12 xl:p-16">
          {/* Logo */}
          <div className="flex items-center gap-3 mb-auto">
            <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-lg shrink-0">
              <GraduationCap className="w-5 h-5" style={{ color: "#002045" }} />
            </div>
            <div>
              <p style={{ fontSize: 15, fontWeight: 700, color: "#fff", lineHeight: 1.2 }}>Universitas Nusantara</p>
              <p style={{ fontSize: 11, color: "rgba(255,255,255,0.5)", lineHeight: 1.2 }}>Sistem Informasi Akademik</p>
            </div>
          </div>

          {/* Headline */}
          <div className="flex-1 flex flex-col justify-center">
            <div
              className="inline-flex items-center gap-2 mb-6 px-3 py-1.5 rounded-full self-start"
              style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.12)" }}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-green-400" style={{ animation: "pulse 2s infinite" }} />
              <span style={{ fontSize: 11, color: "rgba(255,255,255,0.7)", ...MONO, letterSpacing: "0.05em" }}>
                SEMESTER GANJIL 2026/2027
              </span>
            </div>

            <h1
              style={{
                fontSize: 40,
                fontWeight: 800,
                color: "#fff",
                lineHeight: 1.15,
                letterSpacing: "-0.02em",
                maxWidth: 380,
              }}
            >
              Portal Akademik<br />
              <span style={{ color: "#66affe" }}>Mahasiswa</span>
            </h1>
            <p style={{ fontSize: 15, color: "rgba(255,255,255,0.55)", marginTop: 14, lineHeight: 1.7, maxWidth: 360 }}>
              Kelola KRS, nilai, jadwal, keuangan, dan layanan kampus dalam satu tempat.
            </p>

            {/* Feature chips */}
            <div className="flex flex-wrap gap-2 mt-8">
              {features.map((f) => (
                <div
                  key={f.label}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg"
                  style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.1)" }}
                >
                  <f.icon style={{ width: 14, height: 14, color: "#66affe" }} />
                  <span style={{ fontSize: 12, color: "rgba(255,255,255,0.75)", fontWeight: 500 }}>{f.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom note */}
          <p style={{ fontSize: 11, color: "rgba(255,255,255,0.3)", ...MONO }}>
            SIAKAD v3.2 · © 2026 Universitas Nusantara
          </p>
        </div>
      </div>

      {/* ── Right: login form ── */}
      <div className="flex-1 flex items-center justify-center px-5 sm:px-10 py-12">
        <div className="w-full max-w-[380px]">

          {/* Mobile logo */}
          <div className="flex items-center gap-3 mb-8 lg:hidden">
            <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ background: "#002045" }}>
              <GraduationCap className="w-4 h-4 text-white" />
            </div>
            <div>
              <p style={{ fontSize: 14, fontWeight: 700, color: "#002045" }}>Universitas Nusantara</p>
              <p style={{ fontSize: 11, color: "#595c63" }}>Portal SIAKAD</p>
            </div>
          </div>

          {/* Heading */}
          <div className="mb-7">
            <h2 style={{ fontSize: 26, fontWeight: 800, color: "#002045", letterSpacing: "-0.01em", lineHeight: 1.2 }}>
              Masuk
            </h2>
            <p style={{ fontSize: 14, color: "#595c63", marginTop: 5 }}>
              Masukkan NIM dan password untuk melanjutkan.
            </p>
          </div>

          {/* Demo hint */}
          <button
            type="button"
            onClick={fillDemo}
            className="w-full flex items-start gap-3 p-3.5 rounded-xl mb-6 text-left transition-all hover:opacity-90 active:scale-[0.99]"
            style={{ background: "#e8f0fb", border: "1px dashed #0061a5" }}
          >
            <div className="w-6 h-6 rounded flex items-center justify-center shrink-0 mt-0.5" style={{ background: "#0061a5" }}>
              <span style={{ fontSize: 10, fontWeight: 900, color: "#fff", ...MONO }}>!</span>
            </div>
            <div>
              <p style={{ fontSize: 12, fontWeight: 700, color: "#002045" }}>Klik untuk isi otomatis akun demo</p>
              <div className="flex items-center gap-3 mt-1 flex-wrap">
                <span style={{ fontSize: 11, color: "#43474e" }}>
                  NIM: <strong style={MONO}>2023101080</strong>
                </span>
                <span style={{ fontSize: 11, color: "#595c63" }}>·</span>
                <span style={{ fontSize: 11, color: "#43474e" }}>
                  Password: <strong style={MONO}>123456</strong>
                </span>
              </div>
            </div>
          </button>

          {/* Form */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>

            {/* NIM */}
            <div className="flex flex-col gap-1.5">
              <label style={{ fontSize: 12, fontWeight: 600, color: "#002045" }}>
                Nomor Induk Mahasiswa (NIM)
              </label>
              <input
                type="text"
                value={nim}
                onChange={(e) => { setNim(e.target.value); setError(""); }}
                placeholder="Contoh: 2023101080"
                autoComplete="username"
                autoFocus
                className="w-full rounded-xl px-4 py-3.5 transition-all focus:outline-none"
                style={{
                  fontSize: 15,
                  ...MONO,
                  letterSpacing: "0.05em",
                  border: `1.5px solid ${error ? "#dc2626" : "#c4c6cf"}`,
                  background: "#fff",
                  color: "#002045",
                }}
              />
            </div>

            {/* Password */}
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <label style={{ fontSize: 12, fontWeight: 600, color: "#002045" }}>Password</label>
                <button
                  type="button"
                  onClick={() => toast.info("Reset password", { description: "Hubungi admin: helpdesk@univ.ac.id" })}
                  style={{ fontSize: 11, color: "#0061a5" }}
                  className="hover:underline"
                >
                  Lupa password?
                </button>
              </div>
              <div className="relative">
                <input
                  type={showPw ? "text" : "password"}
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); setError(""); }}
                  placeholder="Masukkan password"
                  autoComplete="current-password"
                  className="w-full rounded-xl px-4 py-3.5 pr-12 transition-all focus:outline-none"
                  style={{
                    fontSize: 14,
                    ...SANS,
                    border: `1.5px solid ${error ? "#dc2626" : "#c4c6cf"}`,
                    background: "#fff",
                    color: "#181c1e",
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPw((v) => !v)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1 rounded-lg transition-colors hover:bg-[#f1f4f6]"
                  tabIndex={-1}
                >
                  {showPw
                    ? <EyeOff style={{ width: 16, height: 16, color: "#595c63" }} />
                    : <Eye style={{ width: 16, height: 16, color: "#595c63" }} />}
                </button>
              </div>
            </div>

            {/* Error */}
            {error && (
              <div
                className="flex items-start gap-2.5 px-3.5 py-3 rounded-xl"
                style={{ background: "#fef2f2", border: "1px solid #fecaca" }}
              >
                <AlertCircle style={{ width: 15, height: 15, color: "#dc2626", flexShrink: 0, marginTop: 1 }} />
                <p style={{ fontSize: 12, color: "#dc2626", lineHeight: 1.5 }}>{error}</p>
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2.5 py-3.5 rounded-xl font-semibold transition-all mt-1 disabled:opacity-60"
              style={{ background: "#002045", color: "#fff", fontSize: 14, ...SANS }}
            >
              {loading ? (
                <>
                  <span className="w-4 h-4 rounded-full border-2 border-white/25 border-t-white animate-spin" />
                  Memverifikasi…
                </>
              ) : (
                <>
                  <LogIn style={{ width: 16, height: 16 }} />
                  Masuk ke Portal
                </>
              )}
            </button>
          </form>

          {/* Footer */}
          <p
            className="text-center mt-8"
            style={{ fontSize: 11, color: "#595c63", ...MONO }}
          >
            Butuh bantuan?{" "}
            <button
              onClick={() => toast.info("Helpdesk IT", { description: "helpdesk@univ.ac.id · Ext. 201 · Senin–Jumat 08.00–16.00" })}
              style={{ color: "#0061a5" }}
              className="hover:underline"
            >
              Hubungi IT Support
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
