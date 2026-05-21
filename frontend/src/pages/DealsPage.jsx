import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { API, AppContext } from "../App";
import { ArrowRight, TrendingUp, Circle, Filter } from "lucide-react";

const ROUND_TYPES = ["All", "Seed", "Series A", "Series B", "Series C+", "IPO", "M&A", "Acquisition"];

function getDealType(text) {
  const t = (text || "").toLowerCase();
  if (t.includes("ipo") || t.includes("listing")) return { label: "IPO", color: "#6366F1" };
  if (t.includes("acqui") || t.includes("merger") || t.includes("buyout")) return { label: "M&A", color: "#8B5CF6" };
  if (t.includes("series d") || t.includes("series e") || t.includes("series f")) return { label: "Series C+", color: "#0EA5E9" };
  if (t.includes("series c")) return { label: "Series C", color: "#0891B2" };
  if (t.includes("series b")) return { label: "Series B", color: "#2563EB" };
  if (t.includes("series a")) return { label: "Series A", color: "#3B82F6" };
  if (t.includes("seed") || t.includes("pre-seed")) return { label: "Seed", color: "#06B6D4" };
  return { label: "Funding", color: "#2563EB" };
}

function extractAmount(text) {
  const match = (text || "").match(/[\$₹€£][\d,.]+\s*[BMK]?/i) || (text || "").match(/[\d,.]+\s*(billion|million|crore|lakh)/i);
  return match ? match[0] : null;
}

export default function DealsPage() {
  const { darkMode, openArticle } = useContext(AppContext);
  const navigate = useNavigate();
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState("All");
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    setLoading(true);
    axios.get(`${API}/news/category/funding?limit=20&skip=0&sort=newest`)
      .then(res => {
        const data = res.data.articles || res.data || [];
        setArticles(data);
        setHasMore(data.length === 20);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const filtered = activeFilter === "All" ? articles : articles.filter(a => {
    const dt = getDealType(a.title + " " + (a.summary || ""));
    return dt.label === activeFilter;
  });

  const formatDate = (str) => {
    try { return new Date(str).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }); } catch { return ""; }
  };

  return (
    <div className={`min-h-screen pb-20 ${darkMode ? "bg-[#0A0F1E]" : "bg-[#F5F7FF]"}`}>
      {/* Page header */}
      <div className={`border-b ${darkMode ? "bg-[#0A0F1E] border-[#1E293B]" : "bg-white border-[#E2E8F0]"}`}>
        <div className="max-w-screen-xl mx-auto px-4 py-8">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#06B6D4] animate-pulse" />
                <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#06B6D4]">Live</span>
              </div>
              <h1 className={`font-display text-[36px] sm:text-[44px] font-bold leading-tight ${darkMode ? "text-white" : "text-[#0F172A]"}`}>
                Deal Flow
              </h1>
              <p className={`text-[15px] mt-2 ${darkMode ? "text-slate-400" : "text-slate-500"}`}>
                Tracking every funding round, acquisition, and IPO filing in the India startup ecosystem.
              </p>
            </div>
            <div className={`hidden md:flex items-center gap-2 px-4 py-2 rounded-xl ${darkMode ? "bg-[#111827]" : "bg-white border border-[#E2E8F0]"}`}>
              <TrendingUp size={16} className="text-[#2563EB]" />
              <div>
                <p className={`text-[20px] font-bold ${darkMode ? "text-white" : "text-[#0F172A]"}`}>{articles.length}+</p>
                <p className={`text-[10px] ${darkMode ? "text-slate-500" : "text-slate-400"}`}>deals tracked</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-screen-xl mx-auto px-4 py-6">
        {/* Filter chips */}
        <div className="flex gap-2 overflow-x-auto hide-scrollbar mb-6 pb-1">
          {ROUND_TYPES.map(type => (
            <button key={type} onClick={() => setActiveFilter(type)}
              className={`flex-shrink-0 px-4 py-1.5 rounded-full text-[12px] font-semibold transition-colors ${
                activeFilter === type ? "bg-[#2563EB] text-white" : darkMode ? "bg-[#111827] text-slate-300 border border-[#1E293B] hover:border-[#2563EB]" : "bg-white text-slate-600 border border-[#E2E8F0] hover:border-[#2563EB]"
              }`}>
              {type}
            </button>
          ))}
        </div>

        {/* Deals list */}
        {loading ? (
          <div className="space-y-3">
            {[...Array(6)].map((_, i) => (
              <div key={i} className={`h-20 rounded-xl animate-pulse ${darkMode ? "bg-[#111827]" : "bg-white"}`} />
            ))}
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map((article, i) => {
              const deal = getDealType(article.title + " " + (article.summary || ""));
              const amount = extractAmount(article.title + " " + (article.summary || ""));
              return (
                <div key={article.id || article._id}
                  onClick={() => openArticle(article)}
                  className={`flex items-center gap-4 p-4 rounded-xl border cursor-pointer transition-all hover:border-[#2563EB] hover:shadow-md ${
                    darkMode ? "bg-[#111827] border-[#1E293B]" : "bg-white border-[#E2E8F0]"
                  }`}>
                  {/* Rank */}
                  <span className={`w-6 text-[13px] font-black text-right shrink-0 tabular-nums ${darkMode ? "text-slate-600" : "text-slate-300"}`}>{i + 1}</span>
                  {/* Dot */}
                  <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: deal.color }} />
                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <p className={`text-[14px] font-semibold line-clamp-1 ${darkMode ? "text-slate-100" : "text-[#0F172A]"}`}>{article.title}</p>
                    <p className={`text-[12px] line-clamp-1 mt-0.5 ${darkMode ? "text-slate-500" : "text-slate-400"}`}>{(article.summary || "").slice(0, 100)}</p>
                  </div>
                  {/* Badges */}
                  <div className="flex items-center gap-2 shrink-0">
                    {amount && <span className="px-2 py-0.5 rounded-full text-[10px] font-bold text-white bg-[#06B6D4]">{amount}</span>}
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold text-white" style={{ backgroundColor: deal.color }}>{deal.label}</span>
                    <span className={`text-[11px] hidden sm:block ${darkMode ? "text-slate-500" : "text-slate-400"}`}>{formatDate(article.published_at || article.created_at)}</span>
                    <ArrowRight size={14} className="text-[#2563EB] opacity-50" />
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {filtered.length === 0 && !loading && (
          <div className={`text-center py-16 ${darkMode ? "text-slate-500" : "text-slate-400"}`}>
            <p className="text-[15px]">No deals found for "{activeFilter}"</p>
          </div>
        )}
      </div>
    </div>
  );
}
