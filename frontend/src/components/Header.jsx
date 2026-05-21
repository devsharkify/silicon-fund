import { useContext, useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { AppContext } from "../App";
import { SearchModal } from "./SearchModal";
import {
  Settings,
  LogOut,
  Search,
  ChevronLeft,
  TrendingUp,
} from "lucide-react";

const NAV_LINKS = [
  { label: "Markets", href: "/market-pulse" },
  { label: "Deal Flow", href: "/deals" },
  { label: "VC Radar", href: "/vc-radar" },
  { label: "Startups", slug: "startups" },
  { label: "Regulation", slug: "policy" },
  { label: "Deep Tech", slug: "deeptech" },
];

const TICKER_ITEMS = [
  "OpenAI raises $6.6B Series E at $157B valuation",
  "Anthropic closes $2.5B round led by Google",
  "Sequoia announces $195M India early-stage fund",
  "Zepto hits $5B valuation in latest primary round",
  "SEBI proposes new framework for startup listings",
];

export const Header = () => {
  const { isAdmin, isLoggedIn, handleLogout } = useContext(AppContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [searchOpen, setSearchOpen] = useState(false);

  useEffect(() => {
    const handler = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setSearchOpen(prev => !prev);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  const isHomePage = location.pathname === "/";

  const today = new Date();
  const formattedDate = today.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  const tickerStream = (
    <div className="flex whitespace-nowrap shrink-0 pr-12">
      <span className="opacity-60">{formattedDate}</span>
      <span className="px-2 opacity-40">·</span>
      <span className="text-cyan-400 font-bold tracking-wider">WIRE</span>
      {TICKER_ITEMS.map((item) => (
        <span key={item} className="flex items-center">
          <span className="px-3 opacity-30">▸</span>
          <span>{item}</span>
        </span>
      ))}
    </div>
  );

  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm" data-testid="header">
      <style>{`@keyframes marquee { from { transform: translateX(0); } to { transform: translateX(-50%); } }`}</style>

      {/* ── Top accent stripe ── */}
      <div className="h-[3px] bg-gradient-to-r from-[#2563EB] via-[#06B6D4] to-[#6366F1]" />

      {/* ── Primary bar ── */}
      <div className="h-[58px] flex items-center">
        <div className="max-w-screen-xl mx-auto px-4 w-full flex items-center justify-between gap-4">
          {/* LEFT: back + brand */}
          <div className="flex items-center gap-2 min-w-0">
            {!isHomePage && (
              <button
                data-testid="back-btn"
                onClick={() => window.history.length > 1 ? navigate(-1) : navigate("/")}
                className="p-1.5 rounded-md transition-colors text-slate-600 hover:bg-[#EFF6FF]"
                aria-label="Go back"
              >
                <ChevronLeft size={18} />
              </button>
            )}

            <button
              data-testid="logo"
              onClick={() => navigate("/")}
              className="flex items-center gap-2.5 select-none"
              aria-label="Silicon Fund home"
            >
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#2563EB] to-[#6366F1] flex items-center justify-center shadow-md">
                <span className="text-white font-black text-[13px] leading-none font-grotesk tracking-tight">SF</span>
              </div>
              <div className="flex flex-col leading-none">
                <span className="font-display font-black text-[20px] leading-none tracking-tight text-[#0F172A]">
                  Silicon Fund
                </span>
                <span className="text-[9px] font-semibold uppercase tracking-[0.18em] text-[#2563EB]">
                  Startup Intelligence
                </span>
              </div>
            </button>
          </div>

          {/* CENTER: pill nav (desktop) */}
          <nav className="hidden md:flex items-center gap-0.5" data-testid="nav-pill">
            {NAV_LINKS.map((link) => (
              <button
                key={link.href || link.slug}
                type="button"
                onClick={() => navigate(link.href || `/?cat=${link.slug}`)}
                className="group relative px-3.5 py-2 text-[13px] font-semibold transition-colors rounded-md text-slate-600 hover:text-[#2563EB] hover:bg-[#EFF6FF]"
              >
                {link.label}
                <span className="pointer-events-none absolute left-1/2 -bottom-0.5 h-[2px] w-0 -translate-x-1/2 bg-[#2563EB] transition-all duration-200 group-hover:w-[70%] rounded-full" />
              </button>
            ))}
          </nav>

          {/* RIGHT: actions */}
          <div className="flex items-center gap-1">
            <button
              data-testid="search-btn"
              onClick={() => setSearchOpen(true)}
              className="p-2 rounded-full transition-colors text-slate-500 hover:bg-[#EFF6FF]"
              aria-label="Search"
            >
              <Search size={16} />
            </button>

            {isAdmin && (
              <button
                data-testid="admin-btn"
                onClick={() => navigate("/admin")}
                className="p-2 rounded-full transition-colors text-slate-500 hover:bg-[#EFF6FF]"
                aria-label="Admin settings"
              >
                <Settings size={16} />
              </button>
            )}

            {isLoggedIn && (
              <button
                data-testid="logout-btn"
                onClick={handleLogout}
                className="p-2 rounded-full transition-colors text-slate-500 hover:text-red-500 hover:bg-[#EFF6FF]"
                aria-label="Log out"
              >
                <LogOut size={16} />
              </button>
            )}

            <button
              data-testid="subscribe-btn"
              className="bg-[#2563EB] text-white px-4 py-1.5 rounded-full text-[12px] font-bold ml-1 hover:bg-[#1D4ED8] transition-colors shadow-sm shadow-blue-200 flex items-center gap-1.5"
            >
              <TrendingUp size={12} />
              Subscribe
            </button>
          </div>
        </div>
      </div>

      {/* ── Deal Wire ticker strip ── */}
      <div
        className="h-7 flex items-center overflow-hidden relative bg-[#0F172A] text-slate-200"
        data-testid="ticker"
      >
        <span className="shrink-0 bg-[#2563EB] text-white px-3 h-7 flex items-center text-[10px] font-black uppercase tracking-widest z-10 gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-[#06B6D4] animate-pulse" />
          DEAL WIRE
        </span>
        <div
          className="flex text-[11px] font-medium pl-4"
          style={{ animation: "marquee 40s linear infinite" }}
        >
          {tickerStream}
          {tickerStream}
        </div>
      </div>

      {/* ── Divider ── */}
      <div className="border-b border-[#E2E8F0]" />

      <SearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </header>
  );
};
