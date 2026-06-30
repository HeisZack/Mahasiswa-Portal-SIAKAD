import { useState, useEffect, useRef } from "react";
import { Search, Bell, HelpCircle, Menu, ChevronDown, PanelLeftClose, PanelLeftOpen, User, Settings, LogOut } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { toast } from "sonner";
import { useAppContext } from "../context/AppContext";
import { Link, useNavigate } from "react-router";

const MONO = { fontFamily: "'JetBrains Mono', monospace" } as const;
const SM = { fontFamily: "'Hanken Grotesk', sans-serif" } as const;

interface HeaderProps {
  toggleMobileSidebar: () => void;
  toggleDesktopSidebar: () => void;
  isDesktopCollapsed: boolean;
}

export function Header({ toggleMobileSidebar, toggleDesktopSidebar, isDesktopCollapsed }: HeaderProps) {
  const [searchValue, setSearchValue] = useState("");
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);
  const { student, announcements, logout } = useAppContext();
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchValue.trim()) {
      toast.success(`Mencari: ${searchValue}`, { description: "Fitur pencarian global segera hadir." });
      setSearchValue("");
    }
  };

  // Close dropdowns on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) setShowProfileMenu(false);
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) setShowNotifications(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        document.getElementById("global-search")?.focus();
      }
      if (e.key === "Escape") { setShowProfileMenu(false); setShowNotifications(false); }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const recentNotifs = announcements.slice(0, 3);

  return (
    <header
      className="text-white h-16 flex items-center justify-between px-4 lg:px-5 sticky top-0 z-40 shrink-0"
      style={{ background: "#002045", fontFamily: "'Hanken Grotesk', sans-serif" }}
    >
      {/* Left: logo + collapse */}
      <div className="flex items-center gap-3 shrink-0">
        <button onClick={toggleMobileSidebar} className="p-1.5 hover:bg-white/10 rounded transition-colors lg:hidden">
          <Menu className="w-5 h-5" />
        </button>
        <button onClick={toggleDesktopSidebar} className="p-1.5 hover:bg-white/10 rounded transition-colors hidden lg:flex">
          {isDesktopCollapsed ? <PanelLeftOpen className="w-5 h-5" /> : <PanelLeftClose className="w-5 h-5" />}
        </button>
        <div className={`flex items-center gap-2.5 ${isDesktopCollapsed ? "lg:hidden" : ""}`}>
          <div className="w-8 h-8 rounded flex items-center justify-center bg-white shrink-0">
            <span style={{ fontSize: 10, fontWeight: 800, color: "#002045", ...MONO }}>UN</span>
          </div>
          <div className="hidden sm:block">
            <p style={{ fontSize: 13, fontWeight: 700, lineHeight: 1.2 }}>Portal Mahasiswa</p>
            <p style={{ fontSize: 10, color: "rgba(255,255,255,0.6)", lineHeight: 1.2 }}>Universitas Nusantara</p>
          </div>
        </div>
      </div>

      {/* Center: search */}
      <div className="flex-1 max-w-xl px-4 hidden md:block">
        <form onSubmit={handleSearch} className="relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "rgba(255,255,255,0.5)" }} />
          <input
            id="global-search"
            type="text"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            placeholder="Cari menu, informasi, atau panduan..."
            className="w-full rounded py-2 pl-9 pr-16 focus:outline-none transition-colors"
            style={{ background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.2)", fontSize: 13, color: "#fff" }}
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2 hidden lg:flex items-center gap-0.5 rounded px-1.5 py-0.5 pointer-events-none" style={{ border: "1px solid rgba(255,255,255,0.2)", background: "rgba(255,255,255,0.05)" }}>
            <span style={{ fontSize: 9, color: "rgba(255,255,255,0.5)", ...MONO }}>Ctrl K</span>
          </div>
        </form>
      </div>

      {/* Right: actions */}
      <div className="flex items-center gap-1 shrink-0">
        {/* Help */}
        <Link to="/bantuan" className="p-2 hover:bg-white/10 rounded transition-colors hidden sm:flex" title="Bantuan">
          <HelpCircle className="w-5 h-5" />
        </Link>

        {/* Notifications */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => { setShowNotifications(!showNotifications); setShowProfileMenu(false); }}
            className="p-2 hover:bg-white/10 rounded transition-colors relative"
            title="Notifikasi"
          >
            <Bell className="w-5 h-5" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full border-2 border-[#002045]" style={{ background: "#f59e0b" }} />
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-white rounded border border-[#c4c6cf] shadow-lg overflow-hidden z-50" style={SM}>
              <div className="flex items-center justify-between px-4 py-3 border-b border-[#e0e3e5]" style={{ background: "#f7fafc" }}>
                <span style={{ fontSize: 13, fontWeight: 700, color: "#002045" }}>Notifikasi</span>
                <span className="px-2 py-0.5 rounded text-xs font-bold" style={{ background: "#e8f0fb", color: "#0061a5", ...MONO }}>{recentNotifs.length}</span>
              </div>
              <div className="divide-y divide-[#e0e3e5] max-h-72 overflow-y-auto">
                {recentNotifs.map((n) => (
                  <Link
                    key={n.id}
                    to="/informasi"
                    className="flex gap-3 px-4 py-3 hover:bg-[#f7fafc] transition-colors"
                    onClick={() => setShowNotifications(false)}
                  >
                    <div className="w-2 h-2 rounded-full mt-1.5 shrink-0" style={{ background: n.type === "warning" ? "#f59e0b" : n.type === "success" ? "#10b981" : "#0061a5" }} />
                    <div>
                      <p style={{ fontSize: 12, fontWeight: 600, color: "#181c1e", lineHeight: 1.4 }}>{n.title}</p>
                      <p style={{ fontSize: 11, color: "#595c63", marginTop: 1, ...MONO }}>{n.date}</p>
                    </div>
                  </Link>
                ))}
              </div>
              <Link to="/informasi" className="block px-4 py-2.5 text-center border-t border-[#e0e3e5] hover:bg-[#f7fafc] transition-colors" style={{ fontSize: 12, color: "#0061a5", fontWeight: 600 }} onClick={() => setShowNotifications(false)}>
                Lihat semua pengumuman
              </Link>
            </div>
          )}
        </div>

        <div className="w-px h-6 mx-1 hidden sm:block" style={{ background: "rgba(255,255,255,0.2)" }} />

        {/* Profile dropdown */}
        <div className="relative" ref={profileRef}>
          <button
            onClick={() => { setShowProfileMenu(!showProfileMenu); setShowNotifications(false); }}
            className="flex items-center gap-2 px-2 py-1.5 rounded hover:bg-white/10 transition-colors"
          >
            <div className="w-8 h-8 rounded-full overflow-hidden border-2 shrink-0" style={{ borderColor: "rgba(255,255,255,0.3)" }}>
              <ImageWithFallback src={student.avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
            </div>
            <div className="hidden xl:block text-left">
              <p style={{ fontSize: 12, fontWeight: 700, lineHeight: 1.2 }}>{student.name}</p>
              <p style={{ fontSize: 10, color: "rgba(255,255,255,0.6)", lineHeight: 1.2, ...MONO }}>Sem. {student.semester} • {student.status}</p>
            </div>
            <ChevronDown className="w-3.5 h-3.5 hidden xl:block" style={{ color: "rgba(255,255,255,0.6)", transform: showProfileMenu ? "rotate(180deg)" : "none", transition: "transform 0.2s" }} />
          </button>

          {showProfileMenu && (
            <div className="absolute right-0 mt-2 w-64 bg-white rounded border border-[#c4c6cf] shadow-lg overflow-hidden z-50" style={SM}>
              {/* User info */}
              <div className="p-4 border-b border-[#e0e3e5]" style={{ background: "#f7fafc" }}>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full overflow-hidden border border-[#c4c6cf] shrink-0">
                    <ImageWithFallback src={student.avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                  </div>
                  <div className="overflow-hidden">
                    <p style={{ fontSize: 13, fontWeight: 700, color: "#002045" }} className="truncate">{student.name}</p>
                    <p style={{ fontSize: 11, color: "#595c63", ...MONO }} className="truncate">{student.nim}</p>
                    <p style={{ fontSize: 11, color: "#43474e" }} className="truncate">{student.major}</p>
                  </div>
                </div>
              </div>

              {/* Menu items */}
              <div className="p-1.5">
                {[
                  { icon: User, label: "Profil Saya", path: "/profil", desc: "Lihat & edit profil" },
                  { icon: Settings, label: "Pengaturan", path: "/setelan", desc: "Akun & keamanan" },
                  { icon: HelpCircle, label: "Bantuan & Panduan", path: "/bantuan", desc: "Panduan & FAQ" },
                ].map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    className="flex items-center gap-3 px-3 py-2.5 rounded hover:bg-[#f7fafc] transition-colors"
                    onClick={() => setShowProfileMenu(false)}
                  >
                    <div className="w-7 h-7 rounded flex items-center justify-center shrink-0" style={{ background: "#e8f0fb" }}>
                      <item.icon className="w-3.5 h-3.5" style={{ color: "#0061a5" }} />
                    </div>
                    <div>
                      <p style={{ fontSize: 13, fontWeight: 500, color: "#181c1e" }}>{item.label}</p>
                      <p style={{ fontSize: 11, color: "#595c63" }}>{item.desc}</p>
                    </div>
                  </Link>
                ))}
              </div>

              <div className="border-t border-[#e0e3e5] p-1.5">
                <button
                  onClick={() => { setShowProfileMenu(false); toast.success("Berhasil keluar", { description: "Sampai jumpa, " + student.name + "!" }); setTimeout(logout, 600); }}
                  className="flex items-center gap-3 px-3 py-2.5 rounded hover:bg-red-50 transition-colors w-full text-left"
                >
                  <div className="w-7 h-7 rounded flex items-center justify-center shrink-0" style={{ background: "#fef2f2" }}>
                    <LogOut className="w-3.5 h-3.5 text-red-500" />
                  </div>
                  <div>
                    <p style={{ fontSize: 13, fontWeight: 500, color: "#dc2626" }}>Keluar</p>
                    <p style={{ fontSize: 11, color: "#595c63" }}>Akhiri sesi login</p>
                  </div>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
