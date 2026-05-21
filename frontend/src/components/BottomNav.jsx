import { useContext } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { AppContext } from "../App";
import { Home, Bookmark, Layers, Newspaper } from "lucide-react";

export const BottomNav = () => {
  const { darkMode } = useContext(AppContext);
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { path: "/", icon: Home, label: "Home" },
    { path: "/swipe", icon: Layers, label: "Shorts" },
    { path: "/epaper", icon: Newspaper, label: "ePaper" },
    { path: "/saved", icon: Bookmark, label: "Saved" },
  ];

  return (
    <nav
      className={`bottom-nav ${
        darkMode
          ? "bg-[#0A0F1E] border-t border-[#1E293B]"
          : "bg-white border-t border-[#E2E8F0]"
      }`}
      data-testid="bottom-nav"
    >
      <div className="flex justify-around items-center h-16 max-w-lg mx-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;

          return (
            <button
              key={item.label}
              data-testid={`nav-${item.path === "/" ? "home" : item.label.toLowerCase()}`}
              onClick={() => navigate(item.path)}
              className={`flex flex-col items-center justify-center w-16 h-full transition-colors ${
                isActive
                  ? "text-[#2563EB]"
                  : darkMode
                    ? "text-slate-500 hover:text-slate-300"
                    : "text-slate-400 hover:text-slate-600"
              }`}
            >
              <Icon size={20} strokeWidth={isActive ? 2.5 : 1.8} className="mb-0.5" />
              <span className={`text-[10px] tracking-wide uppercase ${isActive ? "font-bold" : "font-medium"}`}>
                {item.label}
              </span>
              {isActive && (
                <div className="w-3 h-1 rounded-full mt-0.5 bg-[#06B6D4]" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
