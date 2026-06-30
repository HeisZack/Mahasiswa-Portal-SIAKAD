import { useState, useEffect } from "react";
import { Cookie, X, ExternalLink } from "lucide-react";

const STORAGE_KEY = "siakad_cookie_consent";

const SM: React.CSSProperties = { fontFamily: "'Hanken Grotesk', sans-serif" };
const MONO: React.CSSProperties = { fontFamily: "'JetBrains Mono', monospace" };

export function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) setVisible(true);
  }, []);

  const accept = () => {
    localStorage.setItem(STORAGE_KEY, "accepted");
    setVisible(false);
  };

  const decline = () => {
    localStorage.setItem(STORAGE_KEY, "declined");
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-live="polite"
      aria-label="Persetujuan penggunaan cookie"
      className="fixed bottom-0 left-0 right-0 z-50 px-4 pb-4 sm:px-6 sm:pb-5"
      style={SM}
    >
      <div
        className="max-w-3xl mx-auto rounded-xl shadow-xl border border-[#c4c6cf] overflow-hidden"
        style={{ background: "#ffffff" }}
      >
        {/* Accent top bar */}
        <div className="h-1" style={{ background: "linear-gradient(90deg, #002045, #0061a5)" }} />

        <div className="flex flex-col sm:flex-row sm:items-center gap-4 px-5 py-4">
          {/* Icon */}
          <div
            className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
            style={{ background: "#e8f0fb" }}
            aria-hidden="true"
          >
            <Cookie className="w-5 h-5" style={{ color: "#0061a5" }} />
          </div>

          {/* Text */}
          <div className="flex-1 min-w-0">
            <p style={{ fontSize: 13, fontWeight: 700, color: "#002045", marginBottom: 3 }}>
              Penggunaan Cookie & Penyimpanan Lokal
            </p>
            <p style={{ fontSize: 12, color: "#43474e", lineHeight: 1.6 }}>
              SIAKAD menggunakan <em>cookie</em> dan penyimpanan lokal untuk menyimpan preferensi sidebar, pengaturan tampilan, dan status sesi Anda. Data ini tidak dikirim ke pihak ketiga.
            </p>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 shrink-0 flex-wrap">
            <button
              onClick={() => window.open("#", "_blank")}
              className="flex items-center gap-1 transition-colors hover:underline"
              style={{ fontSize: 12, color: "#0061a5" }}
              aria-label="Pelajari selengkapnya tentang kebijakan privasi"
            >
              <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" />
              Pelajari selengkapnya
            </button>

            <button
              onClick={decline}
              className="px-4 py-2 rounded-lg border border-[#c4c6cf] transition-colors hover:bg-[#f1f4f6]"
              style={{ fontSize: 12, color: "#43474e", fontWeight: 500 }}
              aria-label="Tolak penggunaan cookie"
            >
              Tolak
            </button>

            <button
              onClick={accept}
              className="px-4 py-2 rounded-lg transition-colors"
              style={{ background: "#002045", color: "#ffffff", fontSize: 12, fontWeight: 600 }}
              aria-label="Terima penggunaan cookie"
            >
              Terima
            </button>

            <button
              onClick={decline}
              className="p-1.5 rounded hover:bg-[#f1f4f6] transition-colors"
              aria-label="Tutup banner cookie"
            >
              <X className="w-4 h-4" style={{ color: "#595c63" }} aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
