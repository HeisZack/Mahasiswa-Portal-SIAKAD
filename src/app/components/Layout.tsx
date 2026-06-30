import { useState } from "react";
import { Outlet } from "react-router";
import { Header } from "./Header";
import { Sidebar } from "./Sidebar";
import { AIAssistant } from "./AIAssistantWidget";
import { LoginPage } from "./LoginPage";
import { CookieConsent } from "./CookieConsent";
import { Toaster } from "sonner";
import { useAppContext } from "../context/AppContext";

export function Layout() {
  const { isAuthenticated } = useAppContext();
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isDesktopCollapsed, setIsDesktopCollapsed] = useState(false);
  const [isAIChatOpen, setIsAIChatOpen] = useState(false);

  if (!isAuthenticated) {
    return (
      <>
        <Toaster position="top-right" richColors />
        <LoginPage />
      </>
    );
  }

  return (
    <div className="min-h-screen flex flex-col relative" style={{ background: "#f7fafc", fontFamily: "'Hanken Grotesk', sans-serif" }}>
      <Toaster position="top-right" richColors />
      <Header
        toggleMobileSidebar={() => setIsMobileSidebarOpen((v) => !v)}
        toggleDesktopSidebar={() => setIsDesktopCollapsed((v) => !v)}
        isDesktopCollapsed={isDesktopCollapsed}
      />
      <div className="flex flex-1 relative">
        {isMobileSidebarOpen && (
          <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setIsMobileSidebarOpen(false)} />
        )}
        <aside
          className={`fixed lg:sticky lg:top-16 lg:h-[calc(100vh-64px)] inset-y-0 left-0 z-50 bg-white border-r border-[#e0e3e5] transform transition-all duration-300 ease-in-out flex flex-col
            ${isMobileSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
            ${isDesktopCollapsed ? "lg:w-20" : "lg:w-64"} w-64`}
        >
          <Sidebar onClose={() => setIsMobileSidebarOpen(false)} isCollapsed={isDesktopCollapsed} onOpenAIChat={() => setIsAIChatOpen(true)} />
        </aside>
        <main className="flex-1 p-4 md:p-6 lg:p-8 w-full max-w-full min-w-0">
          <Outlet />
        </main>
      </div>
      <AIAssistant isOpen={isAIChatOpen} onClose={() => setIsAIChatOpen(false)} />
      <CookieConsent />
    </div>
  );
}
