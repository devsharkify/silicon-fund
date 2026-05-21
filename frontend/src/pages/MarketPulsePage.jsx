import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { API, AppContext } from "../App";
import { TrendingUp, BarChart2, Zap, ArrowRight, Clock } from "lucide-react";

const CATEGORIES = [
  { key: "funding", label: "Funding Rounds", icon: "💰", color: "#2563EB" },
  { key: "ipo", label: "IPOs & Listings", icon: "📈", color: "#6366F1" },
  { key: "deeptech", label: "Deep Tech", icon: "🔬", color: "#0891B2" },
  { key: "fintech", label: "Fintech", icon: "💳", color: "#06B6D4" },
  { key: "startups", label: "Startups", icon: "🚀", color: "#3B82F6" },
  { key: "policy", label: "Regulation", icon: "⚖️", color: "#8B5CF6" },
];

function formatTimeAgo(dateStr) {
  try {
    const diff = Date.now() - new Date(dateStr).getTime();
    const hours = Math.floor(diff / 3600000);
    if (hours < 1) return "just now";
    if (hours < 24) return `${hours}h ago`;
    return `${Math.floor(hours / 24)}d ago`;
  } catch { return ""; }
}

export default function MarketPulsePage() {
  const { darkMode, openArticle } = useContext(AppContext);
  const navigate = useNavigate();
  const [allArticles, setAllArticles] = useState([]);
  const [catData, setCatData] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get(`${API}/news/feed?limit=40&sort=newest`)
      .then(res => {
        const articles = res.data.articles || res.data || [];
        setAllArticles(articles);
        // Group by category
        const groups = {};
        articles.forEach(a => {
          const cat = a.category || "other";
          if (!groups[cat]) groups[cat] = [];
          groups[cat].push(a);
        });
        setCatData(groups);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const today = allArticles.filter(a => {
    try { return Date.now() - new Date(a.created_at).getTime() < 86400000; } catch { return false; }
  }).length;

  const stats = [
    { label: "Total Articles", value: allArticles.length + "+", icon: <BarChart2 size={18} />, color: "#2563EB" },
    { label: "Today", value: today || "—", icon: <Clock size={18} />, color: "#06B6D4" },
    { label: "Top Sector", value: Object.entries(catData).sort((a,b) => b[1].length - a[1].length)[0]?.[0] || "—", icon: <TrendingUp size={18} />, color: "#6366F1" },
    { label: "Live Coverage", value: "7 Sectors", icon: <Zap size={18} />, color: "#8B5CF6" },
  ];

  return (
    <div className={`min-h-screen pb-20 ${darkMode ? "bg-[#0A0F1E]" : "bg-[#F5F7FF]"}`}>
      {/* Hero */}
      <div className="bg-gradient-to-br from-[#0F172A] to-[#1E3A8A] text-white py-12 px-4">
        <div className="max-w-screen-xl mx-auto">
          <div className="flex items-center gap-2 mb-3">
            <span className="w-2 h-2 rounded-full bg-[#06B6D4] animate-pulse" />
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#06B6D4]">Silicon Fund Intelligence</span>
          </div>
          <h1 className="font-display text-[40px] sm:text-[52px] font-bold leading-tight mb-3">Market Pulse</h1>
          <p className="text-[16px] text-blue-200 max-w-xl">Real-time intelligence across every sector of India's startup economy.</p>
          {/* Stats row */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8">
            {stats.map(s => (
              <div key={s.label} className="rounded-xl bg-white/10 backdrop-blur p-4 flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ backgroundColor: s.color + "30", color: s.color }}>
                  {s.icon}
                </div>
                <div>
                  <p className="text-[18px] font-bold text-white">{s.value}</p>
                  <p className="text-[11px] text-blue-300">{s.label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-screen-xl mx-auto px-4 py-8">
        {/* Category spotlight grid */}
        <div className="mb-2">
          <div className="flex items-center gap-2 mb-6">
            <div className="w-1 h-5 bg-[#2563EB] rounded-full" />
            <h2 className={`font-display text-[20px] font-bold ${darkMode ? "text-white" : "text-[#0F172A]"}`}>Coverage Sectors</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {CATEGORIES.map(cat => {
              const articles = catData[cat.key] || [];
              const latest = articles[0];
              return (
                <div key={cat.key} onClick={() => navigate(`/?cat=${cat.key}`)}
                  className={`rounded-xl border p-5 cursor-pointer transition-all hover:border-[#2563EB] hover:-translate-y-0.5 ${darkMode ? "bg-[#111827] border-[#1E293B]" : "bg-white border-[#E2E8F0]"}`}>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <span className="text-[20px]">{cat.icon}</span>
                      <h3 className={`text-[14px] font-bold ${darkMode ? "text-white" : "text-[#0F172A]"}`}>{cat.label}</h3>
                    </div>
                    <span className="text-[12px] font-bold px-2 py-0.5 rounded-full text-white" style={{ backgroundColor: cat.color }}>{articles.length}</span>
                  </div>
                  {latest && (
                    <p className={`text-[12px] line-clamp-2 leading-snug ${darkMode ? "text-slate-400" : "text-slate-500"}`}>{latest.title}</p>
                  )}
                  <div className="flex items-center gap-1 mt-3 text-[11px]" style={{ color: cat.color }}>
                    <span>View all</span><ArrowRight size={11} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Recent activity timeline */}
        <div className="mt-10">
          <div className="flex items-center gap-2 mb-6">
            <div className="w-1 h-5 bg-[#06B6D4] rounded-full" />
            <h2 className={`font-display text-[20px] font-bold ${darkMode ? "text-white" : "text-[#0F172A]"}`}>Recent Activity</h2>
          </div>
          <div className="relative pl-6 border-l-2 border-[#1E293B] space-y-4">
            {allArticles.slice(0, 12).map((a, i) => (
              <div key={a.id || a._id} className="relative cursor-pointer group" onClick={() => openArticle(a)}>
                <div className="absolute -left-[29px] top-1 w-3 h-3 rounded-full border-2 border-[#2563EB] bg-[#0A0F1E] group-hover:bg-[#2563EB] transition-colors" />
                <div className={`ml-2 flex items-start justify-between gap-3`}>
                  <div className="flex-1 min-w-0">
                    <p className={`text-[13px] font-semibold leading-snug group-hover:text-[#2563EB] transition-colors ${darkMode ? "text-slate-200" : "text-[#0F172A]"}`}>{a.title}</p>
                    <div className="flex items-center gap-2 mt-1">
                      {a.category_label && <span className="text-[9px] font-bold uppercase tracking-wider text-[#2563EB]">{a.category_label}</span>}
                    </div>
                  </div>
                  <span className={`shrink-0 text-[11px] mt-0.5 ${darkMode ? "text-slate-500" : "text-slate-400"}`}>{formatTimeAgo(a.published_at || a.created_at)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
