import { useState } from "react";
import { useAppContext } from "../context/AppContext";
import {
  Settings, User, Lock, Shield, LogOut, Eye, EyeOff, Monitor,
  Smartphone, Globe, CheckCircle2, AlertCircle, Camera, Save, Bell,
  Moon, Sun, Type, Palette, QrCode, KeyRound, RefreshCw,
} from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { toast } from "sonner";
import { Link } from "react-router";

const SM = { fontFamily: "'Hanken Grotesk', sans-serif" } as const;
const MONO = { fontFamily: "'JetBrains Mono', monospace" } as const;

type Tab = "akun" | "keamanan" | "notifikasi" | "tampilan";

const loginHistory = [
  { id: "l1", device: "Chrome — Windows 11", location: "Depok, Jawa Barat", ip: "180.252.xxx.xxx", time: "23 Jun 2026, 08:15", current: true },
  { id: "l2", device: "Chrome Mobile — Android", location: "Depok, Jawa Barat", ip: "180.252.xxx.xxx", time: "22 Jun 2026, 19:43", current: false },
  { id: "l3", device: "Safari — macOS", location: "Jakarta, DKI Jakarta", ip: "36.67.xxx.xxx", time: "20 Jun 2026, 14:05", current: false },
  { id: "l4", device: "Firefox — Windows 10", location: "Depok, Jawa Barat", ip: "180.252.xxx.xxx", time: "18 Jun 2026, 10:22", current: false },
];

function Field({ label, value, type = "text", readOnly = false, onChange }: {
  label: string; value: string; type?: string; readOnly?: boolean; onChange?: (v: string) => void;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label style={{ fontSize: 12, fontWeight: 600, color: "#43474e" }}>{label}</label>
      <input
        type={type}
        value={value}
        readOnly={readOnly}
        onChange={(e) => onChange?.(e.target.value)}
        className={`border rounded px-3 py-2.5 transition-colors focus:outline-none ${readOnly ? "" : "focus:border-[#0061a5]"}`}
        style={{
          fontSize: 13,
          ...SM,
          borderColor: "#c4c6cf",
          background: readOnly ? "#f7fafc" : "white",
          color: readOnly ? "#595c63" : "#181c1e",
        }}
      />
      {readOnly && <p style={{ fontSize: 11, color: "#595c63" }}>Data ini tidak dapat diubah.</p>}
    </div>
  );
}

export function SettingsPage() {
  const { student, updateProfile, logout } = useAppContext();
  const [activeTab, setActiveTab] = useState<Tab>("akun");

  // Account form state
  const [email, setEmail] = useState(student.email);
  const [phone, setPhone] = useState(student.phone);
  const [whatsapp, setWhatsapp] = useState(student.whatsapp);
  const [address, setAddress] = useState(student.addressDomisili);

  // Password form
  const [pwForm, setPwForm] = useState({ current: "", new: "", confirm: "" });
  const [showPw, setShowPw] = useState({ current: false, new: false, confirm: false });

  // Notification prefs
  const [notifPrefs, setNotifPrefs] = useState({
    pengumuman: true, krs: true, keuangan: true, tugas: true, layanan: false, email_notif: true,
  });

  // 2FA state
  const [twoFAEnabled, setTwoFAEnabled] = useState(false);
  const [twoFAStep, setTwoFAStep] = useState<"idle" | "setup" | "verify" | "disable">("idle");
  const [otpInput, setOtpInput] = useState("");
  const MOCK_OTP = "483291";
  const MOCK_SECRET = "SIAKAD-UN-2026-7X3K";

  const handleEnable2FA = () => setTwoFAStep("setup");
  const handleVerify2FA = () => {
    if (otpInput === MOCK_OTP) {
      setTwoFAEnabled(true);
      setTwoFAStep("idle");
      setOtpInput("");
      toast.success("2FA berhasil diaktifkan!", { description: "Akun Anda kini dilindungi verifikasi dua langkah." });
    } else {
      toast.error("Kode OTP salah", { description: `Masukkan kode yang benar. Demo: ${MOCK_OTP}` });
    }
  };
  const handleDisable2FA = () => {
    if (otpInput === MOCK_OTP) {
      setTwoFAEnabled(false);
      setTwoFAStep("idle");
      setOtpInput("");
      toast.info("2FA dinonaktifkan", { description: "Verifikasi dua langkah telah dimatikan." });
    } else {
      toast.error("Kode OTP salah", { description: `Masukkan kode yang benar. Demo: ${MOCK_OTP}` });
    }
  };

  // Appearance
  const [fontSize, setFontSize] = useState("normal");
  const [language, setLanguage] = useState("id");

  const handleSaveAccount = () => {
    updateProfile({ email, phone, whatsapp, addressDomisili: address });
    toast.success("Pengaturan akun disimpan", { description: "Perubahan data kontak telah diperbarui." });
  };

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pwForm.current || !pwForm.new || !pwForm.confirm) {
      toast.error("Lengkapi semua kolom password.");
      return;
    }
    if (pwForm.new !== pwForm.confirm) {
      toast.error("Password baru tidak cocok.");
      return;
    }
    if (pwForm.new.length < 8) {
      toast.error("Password minimal 8 karakter.");
      return;
    }
    toast.success("Password berhasil diubah", { description: "Gunakan password baru saat login berikutnya." });
    setPwForm({ current: "", new: "", confirm: "" });
  };

  const handleLogout = () => {
    toast.success("Berhasil keluar", { description: "Semua sesi aktif telah diakhiri." });
    setTimeout(logout, 700);
  };

  const tabs: { id: Tab; label: string; icon: any }[] = [
    { id: "akun",        label: "Pengaturan Akun",     icon: User },
    { id: "keamanan",    label: "Keamanan",             icon: Shield },
    { id: "notifikasi",  label: "Notifikasi",           icon: Bell },
    { id: "tampilan",    label: "Tampilan",             icon: Palette },
  ];

  return (
    <div className="flex flex-col gap-5" style={SM}>
      {/* Header */}
      <div className="bg-white border border-[#c4c6cf] rounded p-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded flex items-center justify-center" style={{ background: "#e8f0fb" }}>
            <Settings className="w-5 h-5" style={{ color: "#0061a5" }} />
          </div>
          <div>
            <h2 style={{ fontSize: 22, fontWeight: 700, color: "#002045", letterSpacing: "-0.01em" }}>Pengaturan</h2>
            <p style={{ fontSize: 13, color: "#43474e", marginTop: 2 }}>Kelola akun, keamanan, dan preferensi sistem</p>
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-5">
        {/* Sidebar nav */}
        <div className="lg:w-56 shrink-0">
          <div className="bg-white border border-[#c4c6cf] rounded overflow-hidden">
            {/* User mini card */}
            <div className="p-4 border-b border-[#e0e3e5] flex items-center gap-3">
              <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-[#e0e3e5]">
                <ImageWithFallback src={student.avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
              </div>
              <div className="overflow-hidden">
                <p style={{ fontSize: 13, fontWeight: 700, color: "#002045" }} className="truncate">{student.name}</p>
                <p style={{ fontSize: 11, color: "#595c63", ...MONO }} className="truncate">{student.nim}</p>
              </div>
            </div>
            {/* Tab list */}
            <div className="p-2 flex flex-col gap-0.5">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className="flex items-center gap-2.5 px-3 py-2.5 rounded text-left w-full transition-colors"
                  style={{
                    fontSize: 13,
                    fontWeight: activeTab === tab.id ? 600 : 400,
                    background: activeTab === tab.id ? "#002045" : "transparent",
                    color: activeTab === tab.id ? "#ffffff" : "#43474e",
                  }}
                >
                  <tab.icon className="w-4 h-4 shrink-0" />
                  {tab.label}
                </button>
              ))}
              <div className="border-t border-[#e0e3e5] mt-2 pt-2">
                <Link
                  to="/profil"
                  className="flex items-center gap-2.5 px-3 py-2.5 rounded text-left w-full transition-colors hover:bg-[#f1f4f6]"
                  style={{ fontSize: 13, color: "#43474e" }}
                >
                  <User className="w-4 h-4 shrink-0" />
                  Lihat Profil
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Main content */}
        <div className="flex-1 min-w-0 flex flex-col gap-5">

          {/* --- AKUN --- */}
          {activeTab === "akun" && (
            <>
              {/* Photo */}
              <div className="bg-white border border-[#c4c6cf] rounded p-5">
                <p style={{ fontSize: 14, fontWeight: 700, color: "#002045", marginBottom: 16 }}>Foto Profil</p>
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-[#e0e3e5]">
                    <ImageWithFallback src={student.avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                  </div>
                  <div className="flex flex-col gap-2">
                    <button
                      onClick={() => toast.info("Fitur unggah foto", { description: "Silakan pilih gambar dari perangkat Anda." })}
                      className="flex items-center gap-2 px-4 py-2 rounded border border-[#c4c6cf] hover:border-[#0061a5] transition-colors"
                      style={{ fontSize: 13, color: "#002045" }}
                    >
                      <Camera className="w-4 h-4" />
                      Ganti Foto
                    </button>
                    <p style={{ fontSize: 11, color: "#595c63" }}>Format JPG, PNG. Maks. 2MB.</p>
                  </div>
                </div>
              </div>

              {/* Editable contact info */}
              <div className="bg-white border border-[#c4c6cf] rounded p-5">
                <p style={{ fontSize: 14, fontWeight: 700, color: "#002045", marginBottom: 16 }}>Informasi Kontak</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Field label="Email Kampus" value={email} type="email" onChange={setEmail} />
                  <Field label="Nomor Telepon" value={phone} type="tel" onChange={setPhone} />
                  <Field label="WhatsApp" value={whatsapp} type="tel" onChange={setWhatsapp} />
                  <Field label="Nama Lengkap" value={student.name} readOnly />
                  <div className="sm:col-span-2">
                    <label style={{ fontSize: 12, fontWeight: 600, color: "#43474e" }}>Alamat Domisili</label>
                    <textarea
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      rows={3}
                      className="w-full mt-1.5 border border-[#c4c6cf] rounded px-3 py-2.5 focus:outline-none focus:border-[#0061a5] transition-colors resize-none"
                      style={{ fontSize: 13, ...SM }}
                    />
                  </div>
                </div>
                <button
                  onClick={handleSaveAccount}
                  className="mt-4 flex items-center gap-2 px-5 py-2.5 rounded font-semibold transition-colors"
                  style={{ background: "#002045", color: "#fff", fontSize: 13 }}
                >
                  <Save className="w-4 h-4" />
                  Simpan Perubahan
                </button>
              </div>

              {/* Read-only academic */}
              <div className="bg-white border border-[#c4c6cf] rounded p-5">
                <p style={{ fontSize: 14, fontWeight: 700, color: "#002045", marginBottom: 4 }}>Data Akademik</p>
                <p style={{ fontSize: 12, color: "#595c63", marginBottom: 16 }}>Data ini bersifat read-only dan hanya dapat diubah oleh administrator.</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Field label="NIM" value={student.nim} readOnly />
                  <Field label="Program Studi" value={student.major} readOnly />
                  <Field label="Fakultas" value={student.faculty} readOnly />
                  <Field label="Semester" value={`${student.semester}`} readOnly />
                  <Field label="Tahun Masuk" value={student.angkatan} readOnly />
                  <Field label="Status" value={student.status} readOnly />
                </div>
              </div>
            </>
          )}

          {/* --- KEAMANAN --- */}
          {activeTab === "keamanan" && (
            <>
              {/* Change password */}
              <div className="bg-white border border-[#c4c6cf] rounded p-5">
                <p style={{ fontSize: 14, fontWeight: 700, color: "#002045", marginBottom: 16 }}>Ubah Password</p>
                <form onSubmit={handleChangePassword} className="flex flex-col gap-4 max-w-md">
                  {([
                    { key: "current", label: "Password Saat Ini" },
                    { key: "new", label: "Password Baru" },
                    { key: "confirm", label: "Konfirmasi Password Baru" },
                  ] as const).map((f) => (
                    <div key={f.key} className="flex flex-col gap-1.5">
                      <label style={{ fontSize: 12, fontWeight: 600, color: "#43474e" }}>{f.label}</label>
                      <div className="relative">
                        <input
                          type={showPw[f.key] ? "text" : "password"}
                          value={pwForm[f.key]}
                          onChange={(e) => setPwForm((p) => ({ ...p, [f.key]: e.target.value }))}
                          className="w-full border border-[#c4c6cf] rounded px-3 py-2.5 pr-10 focus:outline-none focus:border-[#0061a5] transition-colors"
                          style={{ fontSize: 13, ...SM }}
                          placeholder="••••••••"
                        />
                        <button type="button" onClick={() => setShowPw((p) => ({ ...p, [f.key]: !p[f.key] }))} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                          {showPw[f.key] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>
                  ))}
                  {pwForm.new && (
                    <div className="flex flex-col gap-1">
                      <p style={{ fontSize: 11, color: "#595c63" }}>Kekuatan password:</p>
                      <div className="flex gap-1">
                        {[1, 2, 3, 4].map((i) => {
                          const strength = Math.min(4, Math.floor(pwForm.new.length / 3));
                          return (
                            <div key={i} className="h-1.5 flex-1 rounded-full" style={{ background: i <= strength ? (strength >= 3 ? "#10b981" : strength >= 2 ? "#f59e0b" : "#ef4444") : "#e0e3e5" }} />
                          );
                        })}
                      </div>
                      <p style={{ fontSize: 11, color: "#595c63" }}>Min. 8 karakter, kombinasi huruf dan angka.</p>
                    </div>
                  )}
                  <button type="submit" className="flex items-center gap-2 px-5 py-2.5 rounded font-semibold mt-2" style={{ background: "#002045", color: "#fff", fontSize: 13 }}>
                    <Lock className="w-4 h-4" />
                    Ubah Password
                  </button>
                </form>
              </div>

              {/* 2FA Section */}
              <div className="bg-white border border-[#c4c6cf] rounded overflow-hidden">
                <div className="flex items-center justify-between px-5 py-4 border-b border-[#e0e3e5]">
                  <div className="flex items-center gap-2">
                    <KeyRound className="w-4 h-4" style={{ color: "#0061a5" }} />
                    <div>
                      <p style={{ fontSize: 14, fontWeight: 700, color: "#002045" }}>Verifikasi Dua Langkah (2FA)</p>
                      <p style={{ fontSize: 12, color: "#595c63", marginTop: 1 }}>Tambahkan lapisan keamanan ekstra pada akun Anda</p>
                    </div>
                  </div>
                  <span
                    className="px-2.5 py-1 rounded-full text-xs font-bold"
                    style={{ ...MONO, background: twoFAEnabled ? "#dcfce7" : "#f1f4f6", color: twoFAEnabled ? "#166534" : "#595c63" }}
                  >
                    {twoFAEnabled ? "AKTIF" : "NONAKTIF"}
                  </span>
                </div>

                <div className="p-5">
                  {twoFAStep === "idle" && (
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                      <div className="flex-1">
                        {twoFAEnabled ? (
                          <p style={{ fontSize: 13, color: "#43474e", lineHeight: 1.6 }}>
                            2FA aktif menggunakan aplikasi autentikator. Setiap login akan memerlukan kode 6 digit dari aplikasi Anda.
                          </p>
                        ) : (
                          <p style={{ fontSize: 13, color: "#43474e", lineHeight: 1.6 }}>
                            Lindungi akun SIAKAD Anda dengan verifikasi dua langkah menggunakan aplikasi autentikator (Google Authenticator, Authy, dll.).
                          </p>
                        )}
                      </div>
                      {twoFAEnabled ? (
                        <button
                          onClick={() => { setTwoFAStep("disable"); setOtpInput(""); }}
                          className="shrink-0 flex items-center gap-2 px-4 py-2 rounded-lg border border-red-200 hover:bg-red-50 transition-colors"
                          style={{ fontSize: 12, color: "#dc2626", fontWeight: 500 }}
                        >
                          <KeyRound className="w-3.5 h-3.5" aria-hidden="true" />
                          Nonaktifkan 2FA
                        </button>
                      ) : (
                        <button
                          onClick={handleEnable2FA}
                          className="shrink-0 flex items-center gap-2 px-4 py-2 rounded-lg transition-colors"
                          style={{ background: "#002045", color: "#fff", fontSize: 12, fontWeight: 500 }}
                        >
                          <Shield className="w-3.5 h-3.5" aria-hidden="true" />
                          Aktifkan 2FA
                        </button>
                      )}
                    </div>
                  )}

                  {twoFAStep === "setup" && (
                    <div className="flex flex-col gap-5">
                      <div className="flex flex-col sm:flex-row gap-5 items-start">
                        {/* QR Code placeholder */}
                        <div
                          className="rounded-xl border-2 border-dashed border-[#c4c6cf] flex flex-col items-center justify-center p-4 shrink-0"
                          style={{ width: 140, height: 140, background: "#f7fafc" }}
                          role="img"
                          aria-label="QR Code untuk setup autentikator"
                        >
                          <QrCode className="w-16 h-16" style={{ color: "#002045" }} aria-hidden="true" />
                          <p style={{ fontSize: 9, color: "#595c63", marginTop: 6, textAlign: "center", ...MONO }}>QR CODE SETUP</p>
                        </div>
                        <div className="flex flex-col gap-3 flex-1">
                          <div>
                            <p style={{ fontSize: 13, fontWeight: 700, color: "#002045", marginBottom: 6 }}>Cara mengaktifkan 2FA:</p>
                            <ol className="flex flex-col gap-2">
                              {[
                                "Unduh Google Authenticator atau Authy di HP Anda",
                                "Scan QR Code di samping menggunakan aplikasi tersebut",
                                "Atau masukkan kode rahasia secara manual",
                                "Masukkan kode 6 digit yang ditampilkan aplikasi",
                              ].map((step, i) => (
                                <li key={i} className="flex items-start gap-2">
                                  <span className="w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5" style={{ background: "#e8f0fb", color: "#002045", fontSize: 10, fontWeight: 800, ...MONO }}>{i + 1}</span>
                                  <span style={{ fontSize: 12, color: "#43474e", lineHeight: 1.5 }}>{step}</span>
                                </li>
                              ))}
                            </ol>
                          </div>
                          <div className="p-3 rounded-lg border border-[#e0e3e5]" style={{ background: "#f7fafc" }}>
                            <p style={{ fontSize: 10, color: "#595c63", ...MONO }}>KODE RAHASIA MANUAL</p>
                            <p style={{ fontSize: 13, fontWeight: 700, color: "#002045", ...MONO, letterSpacing: "0.08em", marginTop: 2 }}>{MOCK_SECRET}</p>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col gap-2">
                        <label htmlFor="otp-setup" style={{ fontSize: 12, fontWeight: 600, color: "#002045" }}>
                          Masukkan kode OTP dari aplikasi autentikator
                        </label>
                        <div className="flex gap-3">
                          <input
                            id="otp-setup"
                            type="text"
                            value={otpInput}
                            onChange={(e) => setOtpInput(e.target.value.replace(/\D/g, "").slice(0, 6))}
                            placeholder={`Demo: ${MOCK_OTP}`}
                            maxLength={6}
                            className="border border-[#c4c6cf] rounded-lg px-4 py-2.5 focus:outline-none focus:border-[#0061a5] transition-colors"
                            style={{ fontSize: 18, ...MONO, letterSpacing: "0.15em", width: 160, textAlign: "center" }}
                            aria-label="Kode OTP 6 digit"
                            autoComplete="one-time-code"
                          />
                          <button onClick={handleVerify2FA} className="px-5 py-2.5 rounded-lg font-semibold transition-colors" style={{ background: "#002045", color: "#fff", fontSize: 13 }}>
                            Verifikasi
                          </button>
                          <button onClick={() => { setTwoFAStep("idle"); setOtpInput(""); }} className="px-4 py-2.5 rounded-lg border border-[#c4c6cf] transition-colors hover:bg-[#f1f4f6]" style={{ fontSize: 13, color: "#43474e" }}>
                            Batal
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {twoFAStep === "disable" && (
                    <div className="flex flex-col gap-4">
                      <div className="flex items-start gap-3 p-4 rounded-lg border border-amber-200 bg-amber-50">
                        <AlertCircle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" aria-hidden="true" />
                        <p style={{ fontSize: 13, color: "#92400e", lineHeight: 1.6 }}>
                          Menonaktifkan 2FA akan mengurangi keamanan akun Anda. Konfirmasi dengan memasukkan kode OTP terakhir dari aplikasi autentikator.
                        </p>
                      </div>
                      <div className="flex gap-3 items-center flex-wrap">
                        <label htmlFor="otp-disable" style={{ fontSize: 12, fontWeight: 600, color: "#002045" }}>Kode OTP:</label>
                        <input
                          id="otp-disable"
                          type="text"
                          value={otpInput}
                          onChange={(e) => setOtpInput(e.target.value.replace(/\D/g, "").slice(0, 6))}
                          placeholder={`Demo: ${MOCK_OTP}`}
                          maxLength={6}
                          className="border border-[#c4c6cf] rounded-lg px-4 py-2.5 focus:outline-none focus:border-[#0061a5] transition-colors"
                          style={{ fontSize: 18, ...MONO, letterSpacing: "0.15em", width: 160, textAlign: "center" }}
                          aria-label="Kode OTP 6 digit untuk konfirmasi"
                          autoComplete="one-time-code"
                        />
                        <button onClick={handleDisable2FA} className="px-4 py-2.5 rounded-lg font-semibold border border-red-200 hover:bg-red-50 transition-colors" style={{ fontSize: 13, color: "#dc2626" }}>
                          Konfirmasi Nonaktifkan
                        </button>
                        <button onClick={() => { setTwoFAStep("idle"); setOtpInput(""); }} className="px-4 py-2.5 rounded-lg border border-[#c4c6cf] transition-colors hover:bg-[#f1f4f6]" style={{ fontSize: 13, color: "#43474e" }}>
                          Batal
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Login history */}
              <div className="bg-white border border-[#c4c6cf] rounded overflow-hidden">
                <div className="flex items-center justify-between px-5 py-4 border-b border-[#e0e3e5]">
                  <div>
                    <p style={{ fontSize: 14, fontWeight: 700, color: "#002045" }}>Riwayat Login & Perangkat Aktif</p>
                    <p style={{ fontSize: 12, color: "#595c63", marginTop: 2 }}>Pantau sesi aktif akun Anda</p>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 px-4 py-2 rounded border border-red-200 hover:bg-red-50 transition-colors"
                    style={{ fontSize: 12, color: "#dc2626" }}
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    Logout Semua Perangkat
                  </button>
                </div>
                <div className="divide-y divide-[#e0e3e5]">
                  {loginHistory.map((log) => (
                    <div key={log.id} className="px-5 py-4 flex items-start gap-4">
                      <div className="w-9 h-9 rounded flex items-center justify-center shrink-0" style={{ background: log.current ? "#e8f0fb" : "#f1f4f6" }}>
                        {log.device.includes("Mobile") ? (
                          <Smartphone className="w-4 h-4" style={{ color: log.current ? "#0061a5" : "#595c63" }} />
                        ) : (
                          <Monitor className="w-4 h-4" style={{ color: log.current ? "#0061a5" : "#595c63" }} />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p style={{ fontSize: 13, fontWeight: 600, color: "#181c1e" }}>{log.device}</p>
                          {log.current && (
                            <span className="px-2 py-0.5 rounded text-xs font-bold" style={{ background: "#dcfce7", color: "#166534", ...MONO }}>AKTIF SEKARANG</span>
                          )}
                        </div>
                        <div className="flex flex-wrap gap-3 mt-1">
                          <span style={{ fontSize: 11, color: "#595c63" }}>{log.location}</span>
                          <span style={{ fontSize: 11, color: "#595c63", ...MONO }}>{log.ip}</span>
                          <span style={{ fontSize: 11, color: "#595c63", ...MONO }}>{log.time}</span>
                        </div>
                      </div>
                      {!log.current && (
                        <button
                          onClick={() => toast.info("Sesi diakhiri", { description: `Logout dari ${log.device}` })}
                          className="shrink-0 px-3 py-1.5 rounded border border-[#c4c6cf] hover:border-red-300 hover:bg-red-50 transition-colors"
                          style={{ fontSize: 11, color: "#dc2626" }}
                        >
                          Akhiri Sesi
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Security tips */}
              <div className="bg-white border border-[#c4c6cf] rounded p-5">
                <div className="flex items-center gap-2 mb-4">
                  <Shield className="w-4 h-4" style={{ color: "#10b981" }} />
                  <p style={{ fontSize: 14, fontWeight: 700, color: "#002045" }}>Tips Keamanan Akun</p>
                </div>
                <div className="flex flex-col gap-3">
                  {[
                    { done: true, tip: "Gunakan password yang kuat (min. 8 karakter)" },
                    { done: true, tip: "Jangan bagikan password kepada siapapun" },
                    { done: twoFAEnabled, tip: "Aktifkan verifikasi dua langkah (2FA) untuk keamanan ekstra" },
                    { done: true, tip: "Selalu logout dari perangkat publik" },
                    { done: false, tip: "Perbarui password secara berkala (setiap 3-6 bulan)" },
                  ].map((t, i) => (
                    <div key={i} className="flex items-center gap-3">
                      {t.done ? (
                        <CheckCircle2 className="w-4 h-4 shrink-0 text-green-500" />
                      ) : (
                        <AlertCircle className="w-4 h-4 shrink-0 text-amber-400" />
                      )}
                      <span style={{ fontSize: 13, color: t.done ? "#43474e" : "#92400e" }}>{t.tip}</span>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* --- NOTIFIKASI --- */}
          {activeTab === "notifikasi" && (
            <div className="bg-white border border-[#c4c6cf] rounded p-5">
              <p style={{ fontSize: 14, fontWeight: 700, color: "#002045", marginBottom: 4 }}>Preferensi Notifikasi</p>
              <p style={{ fontSize: 12, color: "#595c63", marginBottom: 20 }}>Pilih jenis notifikasi yang ingin Anda terima</p>

              <div className="flex flex-col gap-0">
                {[
                  { key: "pengumuman", label: "Pengumuman Kampus", desc: "Info terbaru dari universitas dan fakultas" },
                  { key: "krs", label: "KRS & Akademik", desc: "Batas pengisian KRS, pembukaan jadwal" },
                  { key: "keuangan", label: "Keuangan & Tagihan", desc: "Jatuh tempo UKT, konfirmasi pembayaran" },
                  { key: "tugas", label: "Tugas & Perkuliahan", desc: "Deadline tugas, absensi, nilai rilis" },
                  { key: "layanan", label: "Layanan Akademik", desc: "Status pengajuan surat, cuti, legalisir" },
                  { key: "email_notif", label: "Notifikasi via Email", desc: "Kirim ringkasan ke email kampus Anda" },
                ].map((pref) => {
                  const isOn = notifPrefs[pref.key as keyof typeof notifPrefs];
                  return (
                    <div key={pref.key} className="flex items-center justify-between py-4 border-b border-[#e0e3e5] last:border-0">
                      <div>
                        <label htmlFor={`notif-${pref.key}`} style={{ fontSize: 13, fontWeight: 600, color: "#181c1e", display: "block", cursor: "pointer" }}>
                          {pref.label}
                        </label>
                        <p style={{ fontSize: 12, color: "#595c63" }}>{pref.desc}</p>
                      </div>
                      <button
                        id={`notif-${pref.key}`}
                        role="switch"
                        aria-checked={isOn}
                        aria-label={`${isOn ? "Matikan" : "Aktifkan"} notifikasi ${pref.label}`}
                        onClick={() => setNotifPrefs((p) => ({ ...p, [pref.key]: !p[pref.key as keyof typeof p] }))}
                        className="relative w-11 h-6 rounded-full transition-colors shrink-0 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0061a5]"
                        style={{ background: isOn ? "#002045" : "#8a8d95" }}
                      >
                        <span
                          className="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform"
                          style={{ transform: isOn ? "translateX(20px)" : "translateX(0)" }}
                          aria-hidden="true"
                        />
                      </button>
                    </div>
                  );
                })}
              </div>

              <button
                onClick={() => toast.success("Preferensi notifikasi disimpan")}
                className="mt-5 flex items-center gap-2 px-5 py-2.5 rounded font-semibold"
                style={{ background: "#002045", color: "#fff", fontSize: 13 }}
              >
                <Save className="w-4 h-4" />
                Simpan Preferensi
              </button>
            </div>
          )}

          {/* --- TAMPILAN --- */}
          {activeTab === "tampilan" && (
            <div className="flex flex-col gap-5">
              <div className="bg-white border border-[#c4c6cf] rounded p-5">
                <p style={{ fontSize: 14, fontWeight: 700, color: "#002045", marginBottom: 16 }}>Bahasa Antarmuka</p>
                <div className="flex gap-3">
                  {[{ val: "id", label: "Bahasa Indonesia" }, { val: "en", label: "English" }].map((opt) => (
                    <button
                      key={opt.val}
                      onClick={() => { setLanguage(opt.val); toast.success(`Bahasa diubah ke ${opt.label}`); }}
                      className="flex items-center gap-2 px-4 py-2.5 rounded border transition-colors"
                      style={{
                        fontSize: 13,
                        borderColor: language === opt.val ? "#002045" : "#c4c6cf",
                        background: language === opt.val ? "#002045" : "white",
                        color: language === opt.val ? "#fff" : "#43474e",
                        fontWeight: language === opt.val ? 600 : 400,
                      }}
                    >
                      <Globe className="w-4 h-4" />
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="bg-white border border-[#c4c6cf] rounded p-5">
                <p style={{ fontSize: 14, fontWeight: 700, color: "#002045", marginBottom: 16 }}>Ukuran Teks</p>
                <div className="flex gap-3">
                  {[{ val: "small", label: "Kecil" }, { val: "normal", label: "Normal" }, { val: "large", label: "Besar" }].map((opt) => (
                    <button
                      key={opt.val}
                      onClick={() => { setFontSize(opt.val); toast.success(`Ukuran teks: ${opt.label}`); }}
                      className="flex items-center gap-2 px-4 py-2.5 rounded border transition-colors"
                      style={{
                        fontSize: opt.val === "small" ? 12 : opt.val === "large" ? 15 : 13,
                        borderColor: fontSize === opt.val ? "#002045" : "#c4c6cf",
                        background: fontSize === opt.val ? "#e8f0fb" : "white",
                        color: fontSize === opt.val ? "#002045" : "#43474e",
                        fontWeight: fontSize === opt.val ? 600 : 400,
                      }}
                    >
                      <Type className="w-4 h-4" />
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="bg-white border border-[#c4c6cf] rounded p-5">
                <div className="flex items-start gap-3 p-4 rounded border border-amber-200 bg-amber-50">
                  <AlertCircle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                  <div>
                    <p style={{ fontSize: 13, fontWeight: 600, color: "#92400e" }}>Mode Gelap (Segera Hadir)</p>
                    <p style={{ fontSize: 12, color: "#92400e", marginTop: 2 }}>Fitur tema gelap sedang dalam pengembangan dan akan tersedia pada pembaruan berikutnya.</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
