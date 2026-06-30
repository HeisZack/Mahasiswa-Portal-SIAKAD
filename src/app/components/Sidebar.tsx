import { Home, FileText, Calendar, BookOpen, CreditCard, MonitorPlay, Box, Info, HelpCircle, Settings, MessageSquare, X, User } from "lucide-react";
import { Link, useLocation } from "react-router";
import { useAppContext } from "../context/AppContext";
import { ImageWithFallback } from "./figma/ImageWithFallback";

const menuItems = [
  { id: "beranda",     icon: Home,        label: "Beranda",        path: "/" },
  { id: "krs",         icon: FileText,    label: "KRS",            path: "/krs" },
  { id: "jadwal",      icon: Calendar,    label: "Jadwal Kuliah",  path: "/jadwal" },
  { id: "akademik",    icon: BookOpen,    label: "Akademik",       path: "/akademik" },
  { id: "keuangan",    icon: CreditCard,  label: "Keuangan",       path: "/keuangan" },
  { id: "perkuliahan", icon: MonitorPlay, label: "Perkuliahan",    path: "/perkuliahan" },
  { id: "layanan",     icon: Box,         label: "Layanan",        path: "/layanan" },
  { id: "informasi",   icon: Info,        label: "Informasi",      path: "/informasi" },
];

const secondaryMenuItems = [
  { id: "bantuan",    icon: HelpCircle, label: "Bantuan & Panduan", path: "/bantuan" },
  { id: "setelan",    icon: Settings,   label: "Pengaturan",        path: "/setelan" },
];

const SM = { fontFamily: "'Hanken Grotesk', sans-serif" } as const;
const MONO = { fontFamily: "'JetBrains Mono', monospace" } as const;

export function Sidebar({ onClose, isCollapsed, onOpenAIChat }: { onClose: () => void; isCollapsed: boolean; onOpenAIChat: () => void }) {
  const location = useLocation();
  const { student } = useAppContext();

  const allItems = [...menuItems, ...secondaryMenuItems];
  const isActive = (path: string) => path === "/" ? location.pathname === "/" : location.pathname.startsWith(path);

  return (
    <div className="flex flex-col h-full overflow-hidden bg-white" style={SM}>
      {/* Mobile header */}
      <div className="h-16 flex items-center justify-between px-4 lg:hidden border-b border-[#e0e3e5] shrink-0">
        <span style={{ fontSize: 13, fontWeight: 600, color: "#002045" }}>Menu Navigasi</span>
        <button onClick={onClose} className="p-1 rounded hover:bg-[#f1f4f6] transition-colors">
          <X className="w-5 h-5" style={{ color: "#595c63" }} />
        </button>
      </div>

      {/* Nav items */}
      <div className="flex-1 overflow-y-auto py-3 px-2.5 flex flex-col gap-0.5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {menuItems.map((item) => {
          const active = isActive(item.path);
          return (
            <Link
              key={item.id}
              to={item.path}
              onClick={() => onClose()}
              className={`flex items-center py-2.5 rounded transition-colors group ${isCollapsed ? "justify-center px-2" : "gap-3 px-3"}`}
              style={active ? { background: "#002045", color: "#ffffff" } : {}}
              title={isCollapsed ? item.label : undefined}
            >
              <item.icon className={`w-4.5 h-4.5 shrink-0 ${active ? "text-white" : "text-slate-400 group-hover:text-[#0061a5]"}`} style={{ width: 18, height: 18 }} />
              {!isCollapsed && (
                <span style={{ fontSize: 13, fontWeight: active ? 600 : 400, color: active ? "#ffffff" : "#43474e" }}>
                  {item.label}
                </span>
              )}
            </Link>
          );
        })}

        {/* Separator */}
        <div className={`mt-4 mb-2 ${isCollapsed ? "border-t border-[#e0e3e5] mx-2" : "px-3"}`}>
          {!isCollapsed && (
            <p style={{ fontSize: 10, color: "#595c63", letterSpacing: "0.06em", ...MONO }}>LAINNYA</p>
          )}
        </div>

        {secondaryMenuItems.map((item) => {
          const active = isActive(item.path);
          return (
            <Link
              key={item.id}
              to={item.path}
              onClick={() => onClose()}
              className={`flex items-center py-2.5 rounded transition-colors group ${isCollapsed ? "justify-center px-2" : "gap-3 px-3"}`}
              style={active ? { background: "#002045", color: "#ffffff" } : {}}
              title={isCollapsed ? item.label : undefined}
            >
              <item.icon className={`shrink-0 ${active ? "text-white" : "text-slate-400 group-hover:text-[#0061a5]"}`} style={{ width: 18, height: 18 }} />
              {!isCollapsed && (
                <span style={{ fontSize: 13, fontWeight: active ? 600 : 400, color: active ? "#ffffff" : "#43474e" }}>
                  {item.label}
                </span>
              )}
            </Link>
          );
        })}

        {/* Profile shortcut */}
        <Link
          to="/profil"
          onClick={() => onClose()}
          className={`flex items-center py-2.5 rounded transition-colors group ${isCollapsed ? "justify-center px-2" : "gap-3 px-3"}`}
          style={isActive("/profil") ? { background: "#002045", color: "#ffffff" } : {}}
          title={isCollapsed ? "Profil" : undefined}
        >
          <User className={`shrink-0 ${isActive("/profil") ? "text-white" : "text-slate-400 group-hover:text-[#0061a5]"}`} style={{ width: 18, height: 18 }} />
          {!isCollapsed && (
            <span style={{ fontSize: 13, fontWeight: isActive("/profil") ? 600 : 400, color: isActive("/profil") ? "#ffffff" : "#43474e" }}>
              Profil Saya
            </span>
          )}
        </Link>
      </div>

      {/* AI Assistant Widget */}
      {!isCollapsed && (
        <div className="p-3 border-t border-[#e0e3e5] shrink-0">
          <div className="rounded border border-[#c4c6cf] p-3 relative overflow-hidden" style={{ background: "linear-gradient(135deg, #f7fafc 0%, #e8f0fb 100%)" }}>
            <div className="flex items-center justify-between mb-2">
              <div className="w-8 h-8 rounded flex items-center justify-center" style={{ background: "#002045" }}>
                <MessageSquare className="w-4 h-4 text-white" />
              </div>
              <span className="px-1.5 py-0.5 rounded" style={{ fontSize: 9, fontWeight: 800, ...MONO, background: "#0061a5", color: "#fff" }}>BETA</span>
            </div>
            <p style={{ fontSize: 12, fontWeight: 600, color: "#002045" }}>Asisten AI</p>
            <p style={{ fontSize: 11, color: "#595c63", marginTop: 2, marginBottom: 8 }}>Tanya seputar akademik & layanan kampus</p>
            <button
              onClick={onOpenAIChat}
              className="w-full py-1.5 rounded border border-[#0061a5] text-[#0061a5] hover:text-white hover:bg-[#0061a5] transition-colors"
              style={{ fontSize: 12, fontWeight: 600 }}
            >
              Mulai Chat
            </button>
          </div>
        </div>
      )}

      {/* Collapsed AI button */}
      {isCollapsed && (
        <div className="p-2.5 border-t border-[#e0e3e5] shrink-0 flex justify-center">
          <button
            onClick={onOpenAIChat}
            className="w-9 h-9 rounded flex items-center justify-center transition-colors hover:bg-[#e8f0fb]"
            style={{ border: "1px solid #c4c6cf" }}
            title="Asisten AI"
          >
            <MessageSquare className="w-4 h-4" style={{ color: "#0061a5" }} />
          </button>
        </div>
      )}

      {/* Profile mini at bottom */}
      {!isCollapsed && (
        <Link
          to="/profil"
          className="flex items-center gap-3 px-3 py-3 border-t border-[#e0e3e5] hover:bg-[#f7fafc] transition-colors shrink-0"
          onClick={() => onClose()}
        >
          <div className="w-8 h-8 rounded-full overflow-hidden border border-[#c4c6cf] shrink-0">
            <ImageWithFallback src={student.avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
          </div>
          <div className="flex-1 overflow-hidden">
            <p style={{ fontSize: 12, fontWeight: 700, color: "#002045" }} className="truncate">{student.name}</p>
            <p style={{ fontSize: 10, color: "#595c63", ...MONO }} className="truncate">{student.nim}</p>
          </div>
          <Settings className="w-3.5 h-3.5 shrink-0" style={{ color: "#595c63" }} />
        </Link>
      )}
    </div>
  );
}
