import { useState } from "react";
import { useAppContext } from "../context/AppContext";
import { Receipt, CreditCard, CheckCircle2, Clock, TrendingDown, AlertCircle, Download, ExternalLink, Building2, Info } from "lucide-react";
import { toast } from "sonner";

const SM = { fontFamily: "'Hanken Grotesk', sans-serif" } as const;
const MONO = { fontFamily: "'JetBrains Mono', monospace" } as const;

const TYPE_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  UKT:      { bg: "#e8f0fb", text: "#0061a5", border: "#0061a550" },
  Beasiswa: { bg: "#e8f5e9", text: "#10b981", border: "#10b98150" },
  Denda:    { bg: "#fff3e0", text: "#f59e0b", border: "#f59e0b50" },
  Lainnya:  { bg: "#f3e8ff", text: "#7c3aed", border: "#7c3aed50" },
};

function formatRupiah(amount: number) {
  const abs = Math.abs(amount);
  return `Rp ${abs.toLocaleString("id-ID")}`;
}

export function KeuanganPage() {
  const { finances, student } = useAppContext();
  const [activeTab, setActiveTab] = useState<"tagihan" | "riwayat" | "beasiswa">("tagihan");

  const unpaid = finances.filter((f) => f.status === "Belum Lunas" && f.amount > 0);
  const paid = finances.filter((f) => f.status === "Lunas");
  const beasiswa = finances.filter((f) => f.type === "Beasiswa");
  const totalUnpaid = unpaid.reduce((s, f) => s + f.amount, 0);
  const totalBeasiswa = beasiswa.reduce((s, f) => s + Math.abs(f.amount), 0);

  const handlePay = () => {
    toast.info("Mengarahkan ke Payment Gateway", {
      description: "Anda akan diarahkan ke halaman pembayaran BNI Virtual Account.",
    });
  };

  return (
    <div className="flex flex-col gap-5" style={SM}>
      {/* Header */}
      <div className="bg-white border border-[#c4c6cf] rounded p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 style={{ fontSize: 22, fontWeight: 700, color: "#002045", letterSpacing: "-0.01em" }}>Keuangan</h2>
            <p style={{ fontSize: 13, color: "#43474e", marginTop: 4 }}>Informasi tagihan, riwayat pembayaran, dan beasiswa</p>
          </div>
          <button
            className="flex items-center gap-2 px-4 py-2 rounded border border-[#c4c6cf] hover:border-[#0061a5] transition-colors"
            style={{ fontSize: 13, color: "#002045" }}
          >
            <Download className="w-4 h-4" />
            Unduh Laporan
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className={`rounded border p-4 ${unpaid.length > 0 ? "border-amber-300 bg-amber-50" : "border-[#c4c6cf] bg-white"}`}>
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded flex items-center justify-center" style={{ background: unpaid.length > 0 ? "#fef3c7" : "#e8f0fb" }}>
              <Clock className="w-4 h-4" style={{ color: unpaid.length > 0 ? "#f59e0b" : "#0061a5" }} />
            </div>
            <p style={{ fontSize: 11, color: "#595c63", ...MONO, letterSpacing: "0.04em" }}>TAGIHAN BELUM LUNAS</p>
          </div>
          <p style={{ fontSize: 24, fontWeight: 700, color: unpaid.length > 0 ? "#b45309" : "#002045" }}>
            {unpaid.length} item
          </p>
          <p style={{ fontSize: 13, fontWeight: 600, color: unpaid.length > 0 ? "#b45309" : "#002045", marginTop: 2, ...MONO }}>
            {formatRupiah(totalUnpaid)}
          </p>
        </div>

        <div className="bg-white border border-[#c4c6cf] rounded p-4">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded flex items-center justify-center" style={{ background: "#e8f5e9" }}>
              <CheckCircle2 className="w-4 h-4" style={{ color: "#10b981" }} />
            </div>
            <p style={{ fontSize: 11, color: "#595c63", ...MONO, letterSpacing: "0.04em" }}>SUDAH DIBAYAR</p>
          </div>
          <p style={{ fontSize: 24, fontWeight: 700, color: "#002045" }}>{paid.length} transaksi</p>
          <p style={{ fontSize: 11, color: "#595c63", ...MONO, marginTop: 2 }}>
            {paid.filter((f) => f.type === "UKT").length} UKT + {paid.filter((f) => f.type !== "UKT").length} lainnya
          </p>
        </div>

        <div className="bg-white border border-[#c4c6cf] rounded p-4">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded flex items-center justify-center" style={{ background: "#e8f5e9" }}>
              <TrendingDown className="w-4 h-4" style={{ color: "#10b981" }} />
            </div>
            <p style={{ fontSize: 11, color: "#595c63", ...MONO, letterSpacing: "0.04em" }}>TOTAL BEASISWA</p>
          </div>
          <p style={{ fontSize: 24, fontWeight: 700, color: "#10b981" }}>{formatRupiah(totalBeasiswa)}</p>
          <p style={{ fontSize: 11, color: "#595c63", ...MONO, marginTop: 2 }}>{beasiswa.length} beasiswa diterima</p>
        </div>
      </div>

      {/* Tagihan aktif alert */}
      {unpaid.length > 0 && (
        <div className="flex items-start gap-3 p-4 rounded border border-amber-300 bg-amber-50" role="alert" aria-live="polite">
          <AlertCircle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" aria-hidden="true" />
          <div className="flex-1">
            <p style={{ fontSize: 13, fontWeight: 700, color: "#92400e" }}>
              {unpaid.length} tagihan belum dibayar — Total Rp {totalUnpaid.toLocaleString("id-ID")}
            </p>
            <div className="flex flex-col gap-1 mt-2">
              {unpaid.map((f) => (
                <p key={f.id} style={{ fontSize: 12, color: "#92400e", lineHeight: 1.6 }}>
                  <strong>{f.description}</strong> sebesar <strong>Rp {f.amount.toLocaleString("id-ID")}</strong> — jatuh tempo{" "}
                  <strong>{new Date(f.dueDate).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}</strong>.
                  Lakukan pembayaran sebelum tanggal tersebut untuk menghindari pemblokiran akses akademik.
                </p>
              ))}
            </div>
          </div>
          <button
            onClick={handlePay}
            className="shrink-0 px-4 py-2 rounded font-semibold transition-colors"
            style={{ background: "#b45309", color: "#ffffff", fontSize: 12 }}
            aria-label="Bayar tagihan sekarang"
          >
            Bayar Sekarang
          </button>
        </div>
      )}

      {/* Main Content Tabs */}
      <div className="bg-white border border-[#c4c6cf] rounded overflow-hidden">
        <div className="flex border-b border-[#e0e3e5]">
          {[
            { id: "tagihan", label: "Tagihan & Pembayaran" },
            { id: "riwayat", label: "Riwayat Transaksi" },
            { id: "beasiswa", label: "Beasiswa" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className="px-5 py-3 border-b-2 transition-colors"
              style={{
                fontSize: 13,
                fontWeight: 500,
                borderBottomColor: activeTab === tab.id ? "#002045" : "transparent",
                color: activeTab === tab.id ? "#002045" : "#43474e",
                background: activeTab === tab.id ? "#f7fafc" : "transparent",
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {activeTab === "tagihan" && (
          <div className="p-5 flex flex-col gap-4">
            {/* Virtual Account Info */}
            <div className="p-4 rounded border border-[#e0e3e5]" style={{ background: "#f7fafc" }}>
              <div className="flex items-center gap-2 mb-3">
                <Building2 className="w-4 h-4" style={{ color: "#002045" }} />
                <span style={{ fontSize: 13, fontWeight: 600, color: "#002045" }}>Informasi Pembayaran</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <p style={{ fontSize: 11, color: "#595c63", ...MONO }}>NIM Mahasiswa</p>
                  <p style={{ fontSize: 13, fontWeight: 600, color: "#002045", ...MONO, marginTop: 2 }}>{student.nim}</p>
                </div>
                <div>
                  <p style={{ fontSize: 11, color: "#595c63", ...MONO }}>Virtual Account BNI</p>
                  <p style={{ fontSize: 13, fontWeight: 600, color: "#002045", ...MONO, marginTop: 2 }}>8277{student.nim}</p>
                </div>
                <div>
                  <p style={{ fontSize: 11, color: "#595c63", ...MONO }}>Kode Bank</p>
                  <p style={{ fontSize: 13, fontWeight: 600, color: "#002045", ...MONO, marginTop: 2 }}>009 (BNI)</p>
                </div>
              </div>
            </div>

            {/* Finance items */}
            <div className="flex flex-col gap-3">
              {finances.filter((f) => f.amount > 0).map((finance) => (
                <div
                  key={finance.id}
                  className="border rounded overflow-hidden"
                  style={{ borderColor: finance.status === "Belum Lunas" ? "#fbbf24" : "#c4c6cf" }}
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4">
                    <div className="flex items-start gap-4">
                      <div
                        className="w-10 h-10 rounded flex items-center justify-center shrink-0"
                        style={{ background: TYPE_COLORS[finance.type]?.bg ?? "#f1f4f6" }}
                      >
                        {finance.status === "Lunas" ? (
                          <CheckCircle2 className="w-5 h-5" style={{ color: "#10b981" }} />
                        ) : (
                          <Clock className="w-5 h-5" style={{ color: "#f59e0b" }} />
                        )}
                      </div>
                      <div>
                        <p style={{ fontSize: 14, fontWeight: 600, color: "#181c1e" }}>{finance.description}</p>
                        <div className="flex flex-wrap items-center gap-3 mt-1">
                          <span style={{ fontSize: 11, color: "#595c63", ...MONO }}>
                            Jatuh Tempo: {new Date(finance.dueDate).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}
                          </span>
                          {finance.paidDate && (
                            <span style={{ fontSize: 11, color: "#10b981", ...MONO }}>
                              Dibayar: {new Date(finance.paidDate).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col items-end gap-2 shrink-0">
                      <p style={{ fontSize: 18, fontWeight: 700, color: "#002045", ...MONO }}>
                        {formatRupiah(finance.amount)}
                      </p>
                      <div className="flex items-center gap-2">
                        <span
                          className="px-2.5 py-1 rounded text-xs font-bold"
                          style={{ ...MONO, letterSpacing: "0.03em",
                            background: finance.status === "Lunas" ? "#e8f5e9" : "#fef3c7",
                            color: finance.status === "Lunas" ? "#166534" : "#92400e",
                          }}
                        >
                          {finance.status}
                        </span>
                        {finance.receipt && (
                          <button
                            className="flex items-center gap-1 px-2 py-1 rounded border border-[#c4c6cf] hover:border-[#0061a5] transition-colors"
                            style={{ fontSize: 11, color: "#43474e" }}
                          >
                            <Receipt className="w-3 h-3" />
                            Bukti
                          </button>
                        )}
                        {finance.status === "Belum Lunas" && (
                          <button
                            onClick={handlePay}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded font-semibold transition-colors"
                            style={{ background: "#002045", color: "#ffffff", fontSize: 12 }}
                          >
                            <CreditCard className="w-3.5 h-3.5" />
                            Bayar
                          </button>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* UKT Breakdown */}
                  {finance.type === "UKT" && finance.status === "Belum Lunas" && (
                    <div className="border-t border-[#e0e3e5] px-4 py-3" style={{ background: "#fef9ee" }}>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        {[
                          { label: "SPP Pokok", amount: 3500000 },
                          { label: "Dana Pengembangan", amount: 1200000 },
                          { label: "Biaya Praktikum", amount: 500000 },
                          { label: "Asuransi Mahasiswa", amount: 300000 },
                        ].map((item) => (
                          <div key={item.label}>
                            <p style={{ fontSize: 10, color: "#595c63", ...MONO }}>{item.label}</p>
                            <p style={{ fontSize: 12, fontWeight: 600, color: "#002045", ...MONO }}>{formatRupiah(item.amount)}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "riwayat" && (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr style={{ background: "#f1f4f6", borderBottom: "1px solid #e0e3e5" }}>
                  {["NO. BUKTI", "TANGGAL BAYAR", "KETERANGAN", "TIPE", "NOMINAL", "STATUS"].map((h) => (
                    <th key={h} className="px-4 py-3 text-left" style={{ fontSize: 10, color: "#595c63", ...MONO, letterSpacing: "0.05em" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {finances.map((f) => (
                  <tr key={f.id} className="border-b border-[#e0e3e5] hover:bg-[#f7fafc]">
                    <td className="px-4 py-3" style={{ fontSize: 11, color: "#0061a5", ...MONO }}>
                      {f.receipt ?? "—"}
                    </td>
                    <td className="px-4 py-3" style={{ fontSize: 12, color: "#43474e", ...MONO }}>
                      {f.paidDate ? new Date(f.paidDate).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" }) : "—"}
                    </td>
                    <td className="px-4 py-3" style={{ fontSize: 13, fontWeight: 500, color: "#181c1e" }}>{f.description}</td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-0.5 rounded text-xs font-semibold" style={{ background: TYPE_COLORS[f.type]?.bg ?? "#f1f4f6", color: TYPE_COLORS[f.type]?.text ?? "#43474e" }}>
                        {f.type}
                      </span>
                    </td>
                    <td className="px-4 py-3" style={{ fontSize: 13, fontWeight: 600, color: f.amount < 0 ? "#10b981" : "#002045", ...MONO }}>
                      {f.amount < 0 ? `- ${formatRupiah(f.amount)}` : formatRupiah(f.amount)}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className="px-2 py-0.5 rounded text-xs font-bold"
                        style={{ ...MONO,
                          background: f.status === "Lunas" ? "#e8f5e9" : "#fef3c7",
                          color: f.status === "Lunas" ? "#166534" : "#92400e",
                        }}
                      >
                        {f.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === "beasiswa" && (
          <div className="p-5 flex flex-col gap-4">
            {/* Active Scholarship */}
            <div className="border border-green-200 rounded p-4" style={{ background: "#e8f5e9" }}>
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded flex items-center justify-center" style={{ background: "#d1fae5" }}>
                  <CheckCircle2 className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p style={{ fontSize: 14, fontWeight: 700, color: "#064e3b" }}>Beasiswa Peningkatan Prestasi Akademik (PPA)</p>
                  <p style={{ fontSize: 12, color: "#065f46", marginTop: 4, lineHeight: 1.5 }}>
                    Beasiswa dari Kemendikbudristek RI untuk mahasiswa berprestasi. Nilai IPK ≥ 3.75 dipertahankan selama 2 semester berturut-turut.
                  </p>
                  <div className="flex flex-wrap gap-4 mt-3">
                    <div>
                      <p style={{ fontSize: 10, color: "#595c63", ...MONO }}>NOMINAL/BULAN</p>
                      <p style={{ fontSize: 14, fontWeight: 700, color: "#002045", ...MONO }}>Rp 500.000</p>
                    </div>
                    <div>
                      <p style={{ fontSize: 10, color: "#595c63", ...MONO }}>PERIODE</p>
                      <p style={{ fontSize: 13, fontWeight: 600, color: "#002045" }}>Genap 2025/2026</p>
                    </div>
                    <div>
                      <p style={{ fontSize: 10, color: "#595c63", ...MONO }}>STATUS</p>
                      <span className="px-2 py-0.5 rounded text-xs font-bold bg-green-200 text-green-800" style={MONO}>AKTIF</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Available Scholarships */}
            <div>
              <p style={{ fontSize: 13, fontWeight: 600, color: "#002045", marginBottom: 12 }}>Beasiswa Tersedia</p>
              <div className="flex flex-col gap-3">
                {[
                  {
                    name: "Beasiswa Bidikmisi (KIP-K)",
                    provider: "Kemendikbudristek RI",
                    amount: "Biaya Hidup + UKT",
                    deadline: "31 Juli 2026",
                    status: "open",
                    req: "Mahasiswa aktif, tidak mampu, IPK ≥ 2.75",
                  },
                  {
                    name: "Beasiswa Bank Indonesia",
                    provider: "Bank Indonesia",
                    amount: "Rp 1.500.000/bulan",
                    deadline: "15 Agustus 2026",
                    status: "open",
                    req: "Semester 3-8, IPK ≥ 3.00, aktif berorganisasi",
                  },
                  {
                    name: "Beasiswa BAZNAS",
                    provider: "BAZNAS",
                    amount: "Rp 750.000/bulan",
                    deadline: "30 Juni 2026",
                    status: "closing",
                    req: "Muslim, tidak mampu, IPK ≥ 3.00",
                  },
                ].map((b) => (
                  <div key={b.name} className="border border-[#c4c6cf] rounded p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <p style={{ fontSize: 14, fontWeight: 600, color: "#181c1e" }}>{b.name}</p>
                        <span
                          className="px-2 py-0.5 rounded text-xs font-bold"
                          style={{ ...MONO, background: b.status === "open" ? "#e8f5e9" : "#fef3c7", color: b.status === "open" ? "#166534" : "#92400e" }}
                        >
                          {b.status === "open" ? "OPEN" : "CLOSING"}
                        </span>
                      </div>
                      <p style={{ fontSize: 12, color: "#595c63", marginTop: 2 }}>{b.provider}</p>
                      <p style={{ fontSize: 12, color: "#43474e", marginTop: 4 }}>{b.req}</p>
                    </div>
                    <div className="flex flex-col sm:items-end gap-2">
                      <p style={{ fontSize: 14, fontWeight: 700, color: "#002045" }}>{b.amount}</p>
                      <p style={{ fontSize: 11, color: "#595c63", ...MONO }}>Deadline: {b.deadline}</p>
                      <button
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded border border-[#c4c6cf] hover:border-[#0061a5] transition-colors"
                        style={{ fontSize: 12, color: "#002045" }}
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        Daftar
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
