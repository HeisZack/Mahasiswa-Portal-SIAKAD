import { useState, useRef } from "react";
import { useAppContext } from "../context/AppContext";
import {
  User, BookOpen, Phone, MapPin, Shield, GraduationCap, CreditCard, Clock,
  Edit3, Save, X, Camera, CheckCircle2, AlertCircle, TrendingUp,
  FileText, Calendar, MonitorPlay, Box, Bell, Wallet, Activity,
} from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { toast } from "sonner";
import { Link } from "react-router";

const SM = { fontFamily: "'Hanken Grotesk', sans-serif" } as const;
const MONO = { fontFamily: "'JetBrains Mono', monospace" } as const;

type Tab = "akademik" | "pribadi" | "kontak" | "ringkasan" | "keuangan" | "aktivitas";

const ACTIVITY_ICONS: Record<string, any> = {
  krs: FileText,
  jadwal: Calendar,
  kehadiran: MonitorPlay,
  tugas: BookOpen,
  keuangan: Wallet,
  layanan: Box,
  pengumuman: Bell,
};

const ACTIVITY_COLORS: Record<string, { bg: string; color: string }> = {
  krs:        { bg: "#e8f0fb", color: "#0061a5" },
  jadwal:     { bg: "#e8f5e9", color: "#10b981" },
  kehadiran:  { bg: "#f3e8ff", color: "#7c3aed" },
  tugas:      { bg: "#fff3e0", color: "#f59e0b" },
  keuangan:   { bg: "#fce7f3", color: "#ec4899" },
  layanan:    { bg: "#e0f2fe", color: "#0ea5e9" },
  pengumuman: { bg: "#fef9c3", color: "#ca8a04" },
};

function InfoRow({ label, value, mono = false }: { label: string; value: string; mono?: boolean }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-1 py-3 border-b border-[#e0e3e5] last:border-0">
      <span className="sm:w-44 shrink-0" style={{ fontSize: 12, color: "#595c63" }}>{label}</span>
      <span style={{ fontSize: 13, fontWeight: 500, color: "#181c1e", ...(mono ? MONO : {}) }}>{value || "—"}</span>
    </div>
  );
}

function SectionCard({ title, icon: Icon, children }: { title: string; icon: any; children: React.ReactNode }) {
  return (
    <div className="bg-white border border-[#c4c6cf] rounded overflow-hidden">
      <div className="flex items-center gap-2 px-5 py-3 border-b border-[#e0e3e5]" style={{ background: "#f7fafc" }}>
        <Icon className="w-4 h-4" style={{ color: "#0061a5" }} />
        <span style={{ fontSize: 13, fontWeight: 700, color: "#002045" }}>{title}</span>
      </div>
      <div className="px-5 py-1">{children}</div>
    </div>
  );
}

export function ProfilePage() {
  const { student, updateProfile, myCourses, totalSks, totalSksTempuh, targetSksLulus, ipk, ips, finances, recentActivities, announcements } = useAppContext();
  const [activeTab, setActiveTab] = useState<Tab>("akademik");
  const [editing, setEditing] = useState(false);
  const [editData, setEditData] = useState({
    email: student.email,
    phone: student.phone,
    whatsapp: student.whatsapp,
    addressDomisili: student.addressDomisili,
    avatarUrl: student.avatarUrl,
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSave = () => {
    updateProfile(editData);
    setEditing(false);
    toast.success("Profil berhasil diperbarui", { description: "Perubahan data kontak telah disimpan." });
  };

  const handleCancel = () => {
    setEditData({ email: student.email, phone: student.phone, whatsapp: student.whatsapp, addressDomisili: student.addressDomisili, avatarUrl: student.avatarUrl });
    setEditing(false);
  };

  const avgAttendance = myCourses.length > 0
    ? Math.round(myCourses.reduce((s, c) => s + (c.attendance ?? 0), 0) / myCourses.length)
    : 0;

  const unpaidFinances = finances.filter((f) => f.status === "Belum Lunas" && f.amount > 0);
  const totalUnpaid = unpaidFinances.reduce((s, f) => s + f.amount, 0);
  const lastPaid = finances.find((f) => f.status === "Lunas" && f.paidDate);
  const progressPct = Math.min((totalSksTempuh / targetSksLulus) * 100, 100);

  const TABS: { id: Tab; label: string; icon: any }[] = [
    { id: "akademik",  label: "Info Akademik",   icon: GraduationCap },
    { id: "pribadi",   label: "Info Pribadi",    icon: User },
    { id: "kontak",    label: "Kontak",          icon: Phone },
    { id: "ringkasan", label: "Ringkasan Akademik", icon: TrendingUp },
    { id: "keuangan",  label: "Keuangan",        icon: CreditCard },
    { id: "aktivitas", label: "Aktivitas",       icon: Activity },
  ];

  return (
    <div className="flex flex-col gap-5" style={SM}>
      {/* Profile Hero */}
      <div className="bg-white border border-[#c4c6cf] rounded overflow-hidden">
        <div className="h-24 sm:h-32" style={{ background: "linear-gradient(135deg, #002045 0%, #0061a5 100%)" }} />
        <div className="px-5 pb-5">
          <div className="flex flex-col sm:flex-row sm:items-end gap-4 -mt-12 sm:-mt-14">
            {/* Avatar */}
            <div className="relative shrink-0">
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full border-4 border-white overflow-hidden shadow-md bg-[#e8f0fb]">
                <ImageWithFallback src={editing ? editData.avatarUrl : student.avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
              </div>
              {editing && (
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute bottom-0 right-0 w-7 h-7 rounded-full flex items-center justify-center shadow-md"
                  style={{ background: "#002045" }}
                  title="Ganti foto"
                >
                  <Camera className="w-3.5 h-3.5 text-white" />
                </button>
              )}
              <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={() => toast.info("Fitur unggah foto", { description: "Simulasi: foto profil diperbarui." })} />
            </div>

            {/* Name & info */}
            <div className="flex-1 pb-1 mt-4 sm:mt-0">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                <div>
                  <h2 style={{ fontSize: 20, fontWeight: 800, color: "#002045", letterSpacing: "-0.01em" }}>{student.name}</h2>
                  <div className="flex flex-wrap items-center gap-2 mt-1">
                    <span style={{ fontSize: 12, ...MONO, color: "#0061a5", fontWeight: 600 }}>{student.nim}</span>
                    <span style={{ color: "#c4c6cf" }}>•</span>
                    <span style={{ fontSize: 12, color: "#43474e" }}>{student.major}</span>
                    <span style={{ color: "#c4c6cf" }}>•</span>
                    <span style={{ fontSize: 12, color: "#43474e" }}>Semester {student.semester}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-1 rounded" style={{ fontSize: 11, fontWeight: 700, ...MONO, background: "#dcfce7", color: "#166534" }}>
                    ● {student.status.toUpperCase()}
                  </span>
                  {!editing ? (
                    <button
                      onClick={() => setEditing(true)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded border border-[#c4c6cf] hover:border-[#0061a5] transition-colors"
                      style={{ fontSize: 12, color: "#002045" }}
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      Edit Profil
                    </button>
                  ) : (
                    <div className="flex items-center gap-2">
                      <button onClick={handleSave} className="flex items-center gap-1.5 px-3 py-1.5 rounded font-semibold transition-colors" style={{ background: "#002045", color: "#fff", fontSize: 12 }}>
                        <Save className="w-3.5 h-3.5" />
                        Simpan
                      </button>
                      <button onClick={handleCancel} className="flex items-center gap-1.5 px-3 py-1.5 rounded border border-[#c4c6cf] transition-colors" style={{ fontSize: 12, color: "#43474e" }}>
                        <X className="w-3.5 h-3.5" />
                        Batal
                      </button>
                    </div>
                  )}
                </div>
              </div>
              {/* Quick stats */}
              <div className="flex flex-wrap gap-5 mt-3 pt-3 border-t border-[#e0e3e5]">
                {[
                  { label: "IPK", value: ipk.toFixed(2), mono: true },
                  { label: "SKS Tempuh", value: `${totalSksTempuh}/${targetSksLulus}`, mono: true },
                  { label: "Angkatan", value: student.angkatan, mono: true },
                  { label: "Dosen PA", value: student.advisor, mono: false },
                ].map((s) => (
                  <div key={s.label}>
                    <p style={{ fontSize: 10, color: "#595c63", ...MONO, letterSpacing: "0.04em" }}>{s.label.toUpperCase()}</p>
                    <p style={{ fontSize: 13, fontWeight: 700, color: "#002045", ...(s.mono ? MONO : {}) }}>{s.value}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Edit banner */}
      {editing && (
        <div className="flex items-center gap-3 p-3.5 rounded border border-blue-200 bg-blue-50">
          <Edit3 className="w-4 h-4 text-blue-500 shrink-0" />
          <p style={{ fontSize: 12, color: "#1e40af" }}>
            Mode edit aktif. Anda hanya dapat mengubah <strong>Email, Telepon, WhatsApp, dan Alamat Domisili</strong>. Data akademik & identitas bersifat read-only.
          </p>
        </div>
      )}

      {/* Tabs */}
      <div className="bg-white border border-[#c4c6cf] rounded overflow-hidden">
        <div className="flex overflow-x-auto [scrollbar-width:none] border-b border-[#e0e3e5]">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className="flex items-center gap-2 px-4 py-3 border-b-2 transition-colors whitespace-nowrap"
              style={{
                fontSize: 13,
                fontWeight: 500,
                borderBottomColor: activeTab === tab.id ? "#002045" : "transparent",
                color: activeTab === tab.id ? "#002045" : "#43474e",
                background: activeTab === tab.id ? "#f7fafc" : "transparent",
              }}
            >
              <tab.icon className="w-3.5 h-3.5" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* --- Info Akademik --- */}
        {activeTab === "akademik" && (
          <div className="p-5 grid grid-cols-1 lg:grid-cols-2 gap-5">
            <SectionCard title="Identitas Akademik" icon={GraduationCap}>
              <InfoRow label="Nama Lengkap" value={student.name} />
              <InfoRow label="NIM" value={student.nim} mono />
              <InfoRow label="Program Studi" value={student.major} />
              <InfoRow label="Fakultas" value={student.faculty} />
              <InfoRow label="Jenjang" value="Strata 1 (S1)" />
              <InfoRow label="Akreditasi Prodi" value="Unggul (A)" />
            </SectionCard>
            <SectionCard title="Status Akademik" icon={Shield}>
              <InfoRow label="Status" value={student.status} />
              <InfoRow label="Semester Aktif" value={`Semester ${student.semester} (Ganjil 2026/2027)`} />
              <InfoRow label="Tahun Masuk" value={student.angkatan} mono />
              <InfoRow label="Dosen Pembimbing Akademik" value={student.advisor} />
              <InfoRow label="Kelas" value={`SI-${student.semester}A`} />
              <InfoRow label="SKS Ditempuh" value={`${totalSksTempuh} / ${targetSksLulus} SKS`} mono />
            </SectionCard>
          </div>
        )}

        {/* --- Info Pribadi --- */}
        {activeTab === "pribadi" && (
          <div className="p-5 grid grid-cols-1 lg:grid-cols-2 gap-5">
            <SectionCard title="Data Diri" icon={User}>
              <InfoRow label="Nama Lengkap" value={student.name} />
              <InfoRow label="NIK" value={student.nik} mono />
              <InfoRow label="Tempat Lahir" value={student.birthPlace} />
              <InfoRow label="Tanggal Lahir" value={new Date(student.birthDate).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })} />
              <InfoRow label="Usia" value={`${new Date().getFullYear() - new Date(student.birthDate).getFullYear()} tahun`} />
              <InfoRow label="Jenis Kelamin" value={student.gender} />
            </SectionCard>
            <SectionCard title="Data Tambahan" icon={Shield}>
              <InfoRow label="Agama" value={student.religion} />
              <InfoRow label="Kewarganegaraan" value={student.nationality} />
              <InfoRow label="Status Perkawinan" value={student.maritalStatus} />
              <InfoRow label="Golongan Darah" value={student.bloodType} mono />
            </SectionCard>
          </div>
        )}

        {/* --- Kontak --- */}
        {activeTab === "kontak" && (
          <div className="p-5 grid grid-cols-1 lg:grid-cols-2 gap-5">
            <SectionCard title="Informasi Kontak" icon={Phone}>
              {editing ? (
                <div className="flex flex-col gap-3 py-3">
                  {[
                    { field: "email" as const, label: "Email", type: "email" },
                    { field: "phone" as const, label: "Nomor Telepon", type: "tel" },
                    { field: "whatsapp" as const, label: "WhatsApp", type: "tel" },
                  ].map((f) => (
                    <div key={f.field} className="flex flex-col gap-1">
                      <label style={{ fontSize: 11, color: "#595c63", ...MONO }}>{f.label.toUpperCase()}</label>
                      <input
                        type={f.type}
                        value={editData[f.field]}
                        onChange={(e) => setEditData((prev) => ({ ...prev, [f.field]: e.target.value }))}
                        className="border border-[#c4c6cf] rounded px-3 py-2 focus:outline-none focus:border-[#0061a5] transition-colors"
                        style={{ fontSize: 13, ...SM }}
                      />
                    </div>
                  ))}
                </div>
              ) : (
                <>
                  <InfoRow label="Email Kampus" value={student.email} mono />
                  <InfoRow label="Nomor Telepon" value={student.phone} mono />
                  <InfoRow label="WhatsApp" value={student.whatsapp} mono />
                </>
              )}
            </SectionCard>
            <SectionCard title="Alamat" icon={MapPin}>
              {editing ? (
                <div className="flex flex-col gap-3 py-3">
                  <div className="flex flex-col gap-1">
                    <label style={{ fontSize: 11, color: "#595c63", ...MONO }}>ALAMAT DOMISILI</label>
                    <textarea
                      rows={3}
                      value={editData.addressDomisili}
                      onChange={(e) => setEditData((prev) => ({ ...prev, addressDomisili: e.target.value }))}
                      className="border border-[#c4c6cf] rounded px-3 py-2 focus:outline-none focus:border-[#0061a5] transition-colors resize-none"
                      style={{ fontSize: 13, ...SM }}
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label style={{ fontSize: 11, color: "#595c63", ...MONO }}>ALAMAT SESUAI KTP (READ-ONLY)</label>
                    <textarea rows={3} value={student.addressKTP} readOnly className="border border-[#e0e3e5] rounded px-3 py-2 resize-none" style={{ fontSize: 13, background: "#f7fafc", color: "#595c63" }} />
                  </div>
                </div>
              ) : (
                <>
                  <InfoRow label="Alamat Domisili" value={student.addressDomisili} />
                  <InfoRow label="Alamat KTP" value={student.addressKTP} />
                  <InfoRow label="Kode Pos" value={student.postalCode} mono />
                </>
              )}
            </SectionCard>
          </div>
        )}

        {/* --- Ringkasan Akademik --- */}
        {activeTab === "ringkasan" && (
          <div className="p-5 flex flex-col gap-5">
            {/* Stats grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { label: "SKS Aktif", value: totalSks, sub: `dari maks. 24`, color: "#0061a5", bg: "#e8f0fb" },
                { label: "SKS Tempuh", value: totalSksTempuh, sub: `dari ${targetSksLulus} SKS`, color: "#10b981", bg: "#e8f5e9" },
                { label: "IPK", value: ipk.toFixed(2), sub: "Cum Laude ≥ 3.75", color: "#7c3aed", bg: "#f3e8ff" },
                { label: "IPS Sem. Ini", value: ips > 0 ? ips.toFixed(2) : "—", sub: `Semester ${student.semester}`, color: "#f59e0b", bg: "#fff3e0" },
              ].map((s) => (
                <div key={s.label} className="bg-white border border-[#c4c6cf] rounded p-4">
                  <div className="w-8 h-8 rounded flex items-center justify-center mb-2" style={{ background: s.bg }}>
                    <span style={{ fontSize: 12, fontWeight: 800, color: s.color, ...MONO }}>{s.value}</span>
                  </div>
                  <p style={{ fontSize: 11, color: "#595c63", ...MONO }}>{s.label.toUpperCase()}</p>
                  <p style={{ fontSize: 11, color: "#595c63", marginTop: 2 }}>{s.sub}</p>
                </div>
              ))}
            </div>

            {/* Progress kelulusan */}
            <div className="bg-white border border-[#c4c6cf] rounded p-5">
              <p style={{ fontSize: 13, fontWeight: 700, color: "#002045", marginBottom: 12 }}>Progress SKS Kelulusan</p>
              <div className="flex justify-between mb-2">
                <span style={{ fontSize: 12, color: "#43474e" }}>{totalSksTempuh} SKS ditempuh</span>
                <span style={{ fontSize: 12, ...MONO, color: "#002045", fontWeight: 600 }}>{progressPct.toFixed(1)}%</span>
              </div>
              <div className="h-3 rounded-full overflow-hidden" style={{ background: "#e0e3e5" }}>
                <div className="h-full rounded-full" style={{ width: `${progressPct}%`, background: "linear-gradient(90deg, #002045, #0061a5)" }} />
              </div>
              <div className="flex justify-between mt-1">
                <span style={{ fontSize: 10, color: "#595c63", ...MONO }}>Lulus = {targetSksLulus} SKS</span>
                <span style={{ fontSize: 10, color: "#595c63", ...MONO }}>Sisa: {targetSksLulus - totalSksTempuh} SKS</span>
              </div>
            </div>

            {/* Per-course stats */}
            <div className="bg-white border border-[#c4c6cf] rounded overflow-hidden">
              <div className="px-5 py-3 border-b border-[#e0e3e5]" style={{ background: "#f7fafc" }}>
                <p style={{ fontSize: 13, fontWeight: 700, color: "#002045" }}>Kehadiran & Nilai Semester Ini</p>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr style={{ background: "#f1f4f6", borderBottom: "1px solid #e0e3e5" }}>
                      {["MATA KULIAH", "SKS", "KEHADIRAN", "NILAI", "STATUS"].map((h) => (
                        <th key={h} className="px-4 py-3 text-left" style={{ fontSize: 10, color: "#595c63", ...MONO }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {myCourses.map((c) => {
                      const att = c.attendance ?? 0;
                      return (
                        <tr key={c.id} className="border-b border-[#e0e3e5] hover:bg-[#f7fafc]">
                          <td className="px-4 py-3" style={{ fontSize: 13, fontWeight: 500, color: "#181c1e" }}>{c.name}</td>
                          <td className="px-4 py-3 text-center" style={{ fontSize: 12, ...MONO, color: "#002045", fontWeight: 600 }}>{c.sks}</td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2">
                              <div className="flex-1 h-1.5 rounded-full" style={{ background: "#e0e3e5", minWidth: 60 }}>
                                <div className="h-full rounded-full" style={{ width: `${att}%`, background: att >= 75 ? "#10b981" : "#f59e0b" }} />
                              </div>
                              <span style={{ fontSize: 11, ...MONO, color: att >= 75 ? "#166534" : "#92400e", fontWeight: 700 }}>{att}%</span>
                            </div>
                          </td>
                          <td className="px-4 py-3 text-center">
                            {c.grade ? (
                              <span className="px-2 py-0.5 rounded text-xs font-bold" style={{ background: c.score && c.score >= 3.5 ? "#e8f5e9" : "#e8f0fb", color: c.score && c.score >= 3.5 ? "#166534" : "#0061a5" }}>
                                {c.grade}
                              </span>
                            ) : <span style={{ fontSize: 12, color: "#595c63" }}>—</span>}
                          </td>
                          <td className="px-4 py-3">
                            <span className="text-xs font-bold px-2 py-0.5 rounded" style={{ background: att >= 75 ? "#e8f5e9" : "#fef3c7", color: att >= 75 ? "#166534" : "#92400e" }}>
                              {att >= 75 ? "Memenuhi Syarat" : "Perlu Perhatian"}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Summary footer */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                { label: "Mata Kuliah Aktif", value: myCourses.length, icon: BookOpen, color: "#0061a5" },
                { label: "Rata-rata Kehadiran", value: `${avgAttendance}%`, icon: Activity, color: "#10b981" },
                { label: "MK Sudah Bernilai", value: `${myCourses.filter((c) => c.grade).length} dari ${myCourses.length}`, icon: CheckCircle2, color: "#7c3aed" },
              ].map((s) => (
                <div key={s.label} className="bg-white border border-[#c4c6cf] rounded p-4 flex items-center gap-3">
                  <div className="w-10 h-10 rounded flex items-center justify-center shrink-0" style={{ background: `${s.color}18` }}>
                    <s.icon className="w-5 h-5" style={{ color: s.color }} />
                  </div>
                  <div>
                    <p style={{ fontSize: 18, fontWeight: 800, color: "#002045", ...MONO }}>{s.value}</p>
                    <p style={{ fontSize: 11, color: "#595c63" }}>{s.label}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* --- Keuangan --- */}
        {activeTab === "keuangan" && (
          <div className="p-5 flex flex-col gap-5">
            {/* Summary */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { label: "Tagihan Aktif", value: unpaidFinances.length, sub: "belum dibayar", color: unpaidFinances.length > 0 ? "#b45309" : "#10b981", bg: unpaidFinances.length > 0 ? "#fef3c7" : "#e8f5e9" },
                { label: "Total Tunggakan", value: `Rp ${(totalUnpaid / 1e6).toFixed(1)}jt`, sub: "outstanding", color: "#b45309", bg: "#fef3c7" },
                { label: "Bayar Terakhir", value: lastPaid?.paidDate ? new Date(lastPaid.paidDate).toLocaleDateString("id-ID", { day: "numeric", month: "short" }) : "—", sub: lastPaid?.description?.slice(0, 16) + "…" ?? "—", color: "#10b981", bg: "#e8f5e9" },
                { label: "Status UKT", value: unpaidFinances.some((f) => f.type === "UKT") ? "Belum Lunas" : "Lunas", sub: "Semester Ganjil 2026", color: unpaidFinances.some((f) => f.type === "UKT") ? "#b45309" : "#10b981", bg: unpaidFinances.some((f) => f.type === "UKT") ? "#fef3c7" : "#e8f5e9" },
              ].map((s) => (
                <div key={s.label} className="bg-white border border-[#c4c6cf] rounded p-4">
                  <p style={{ fontSize: 11, color: "#595c63", ...MONO }}>{s.label.toUpperCase()}</p>
                  <p style={{ fontSize: 16, fontWeight: 800, color: s.color, ...MONO, marginTop: 4 }}>{s.value}</p>
                  <p style={{ fontSize: 10, color: "#595c63", marginTop: 2 }}>{s.sub}</p>
                </div>
              ))}
            </div>

            {/* Finance table */}
            <div className="bg-white border border-[#c4c6cf] rounded overflow-hidden">
              <div className="px-5 py-3 border-b border-[#e0e3e5]" style={{ background: "#f7fafc" }}>
                <p style={{ fontSize: 13, fontWeight: 700, color: "#002045" }}>Riwayat Pembayaran</p>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr style={{ background: "#f1f4f6", borderBottom: "1px solid #e0e3e5" }}>
                      {["KETERANGAN", "JATUH TEMPO", "TGL BAYAR", "NOMINAL", "STATUS"].map((h) => (
                        <th key={h} className="px-4 py-3 text-left" style={{ fontSize: 10, color: "#595c63", ...MONO }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {finances.filter((f) => f.amount > 0).map((f) => (
                      <tr key={f.id} className="border-b border-[#e0e3e5] hover:bg-[#f7fafc]">
                        <td className="px-4 py-3" style={{ fontSize: 13, fontWeight: 500, color: "#181c1e" }}>{f.description}</td>
                        <td className="px-4 py-3" style={{ fontSize: 12, color: "#43474e", ...MONO }}>{new Date(f.dueDate).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })}</td>
                        <td className="px-4 py-3" style={{ fontSize: 12, color: "#43474e", ...MONO }}>{f.paidDate ? new Date(f.paidDate).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" }) : "—"}</td>
                        <td className="px-4 py-3" style={{ fontSize: 13, fontWeight: 600, color: "#002045", ...MONO }}>Rp {f.amount.toLocaleString("id-ID")}</td>
                        <td className="px-4 py-3">
                          <span className="px-2 py-0.5 rounded text-xs font-bold" style={{ background: f.status === "Lunas" ? "#e8f5e9" : "#fef3c7", color: f.status === "Lunas" ? "#166534" : "#92400e" }}>
                            {f.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="flex justify-end">
              <Link to="/keuangan" className="flex items-center gap-1.5 px-4 py-2 rounded border border-[#c4c6cf] hover:border-[#0061a5] transition-colors" style={{ fontSize: 12, color: "#002045" }}>
                <CreditCard className="w-3.5 h-3.5" />
                Lihat detail keuangan
              </Link>
            </div>
          </div>
        )}

        {/* --- Aktivitas Terbaru --- */}
        {activeTab === "aktivitas" && (
          <div className="p-5 flex flex-col gap-3">
            <p style={{ fontSize: 12, color: "#595c63", marginBottom: 4 }}>
              {recentActivities.length} aktivitas terbaru dari seluruh modul akademik
            </p>
            {recentActivities.map((act) => {
              const Icon = ACTIVITY_ICONS[act.type] ?? Activity;
              const colors = ACTIVITY_COLORS[act.type] ?? { bg: "#e8f0fb", color: "#0061a5" };
              return (
                <div key={act.id} className="flex items-start gap-3 p-4 border border-[#e0e3e5] rounded hover:bg-[#f7fafc] transition-colors">
                  <div className="w-9 h-9 rounded flex items-center justify-center shrink-0" style={{ background: colors.bg }}>
                    <Icon className="w-4 h-4" style={{ color: colors.color }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p style={{ fontSize: 13, fontWeight: 600, color: "#181c1e" }}>{act.title}</p>
                    <p style={{ fontSize: 12, color: "#595c63", marginTop: 2 }}>{act.description}</p>
                  </div>
                  <span style={{ fontSize: 11, color: "#595c63", ...MONO, whiteSpace: "nowrap", flexShrink: 0 }}>
                    {act.timestamp}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
