import { useState, useEffect, useContext } from "react";
import axios from "axios";
import { API, AppContext } from "../App";
import { Radio, ArrowRight } from "lucide-react";

export default function VCRadarPage() {
  const { darkMode, openArticle } = useContext(AppContext);
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // vc category may be sparse; try it first, fall back to funding+ipo combined
    const tryVC = axios.get(`${API}/news/category/vc?limit=20&sort=newest`)
      .then(res => {
        const data = res.data.articles || res.data || [];
        if (data.length > 0) return data;
        // Fallback: fetch funding & ipo and merge
        return Promise.all([
          axios.get(`${API}/news/category/funding?limit=12&sort=newest`),
          axios.get(`${API}/news/category/ipo?limit=8&sort=newest`),
        ]).then(([f, i]) => [
          ...(f.data.articles || f.data || []),
          ...(i.data.articles || i.data || []),
        ]);
      });
    tryVC
      .then(data => setArticles(data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const featured = articles.slice(0, 4);
  const rest = articles.slice(4);

  const formatDate = (str) => {
    try { return new Date(str).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }); } catch { return ""; }
  };

  return (
    <div className={`min-h-screen pb-20 ${darkMode ? "bg-[#0A0F1E]" : "bg-[#F5F7FF]"}`}>
      {/* Header */}
      <div className={`border-b ${darkMode ? "bg-[#0A0F1E] border-[#1E293B]" : "bg-white border-[#E2E8F0]"}`}>
        <div className="max-w-screen-xl mx-auto px-4 py-8">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 rounded-full bg-[#2563EB]/20 flex items-center justify-center">
              <Radio size={16} className="text-[#2563EB] animate-pulse" />
            </div>
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#2563EB]">VC Intelligence</span>
          </div>
          <h1 className={`font-display text-[40px] font-bold leading-tight ${darkMode ? "text-white" : "text-[#0F172A]"}`}>VC Radar</h1>
          <p className={`text-[15px] mt-2 max-w-xl ${darkMode ? "text-slate-400" : "text-slate-500"}`}>
            Tracking who's writing checks, leading rounds and backing the next generation of India's tech ecosystem.
          </p>
        </div>
      </div>

      <div className="max-w-screen-xl mx-auto px-4 py-8">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[...Array(4)].map((_, i) => <div key={i} className={`h-48 rounded-xl animate-pulse ${darkMode ? "bg-[#111827]" : "bg-white"}`} />)}
          </div>
        ) : (
          <>
            {/* Why it matters */}
            <div className="rounded-2xl bg-gradient-to-r from-[#2563EB] to-[#6366F1] p-6 text-white mb-8">
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-blue-200 mb-2">Why It Matters</p>
              <p className="text-[15px] leading-relaxed">
                Venture capital shapes which ideas get resources. Tracking fund formations, LP compositions and investment theses tells you where the next wave of capital is headed — before the term sheets are signed.
              </p>
            </div>

            {/* Featured large cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              {featured.map(article => (
                <div key={article.id || article._id} onClick={() => openArticle(article)}
                  className={`rounded-xl overflow-hidden border cursor-pointer group hover:border-[#2563EB] transition-all ${darkMode ? "bg-[#111827] border-[#1E293B]" : "bg-white border-[#E2E8F0]"}`}>
                  {article.image && <img src={article.image} alt={article.title} className="w-full h-36 object-cover group-hover:scale-105 transition-transform duration-500" onError={e => e.target.style.display='none'} />}
                  <div className="p-4">
                    <span className="text-[9px] font-bold uppercase tracking-wider text-[#2563EB]">{article.category_label || "VC"}</span>
                    <h3 className={`text-[15px] font-bold leading-snug mt-1 mb-2 line-clamp-2 ${darkMode ? "text-slate-100" : "text-[#0F172A]"}`}>{article.title}</h3>
                    <p className={`text-[12px] line-clamp-2 ${darkMode ? "text-slate-400" : "text-slate-500"}`}>{(article.summary || "").slice(0, 100)}</p>
                    <div className="flex items-center justify-between mt-3">
                      <span className={`text-[11px] ${darkMode ? "text-slate-500" : "text-slate-400"}`}>{formatDate(article.published_at || article.created_at)}</span>
                      <span className="text-[11px] font-semibold text-[#2563EB] flex items-center gap-1">Read <ArrowRight size={11} /></span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Rest: list */}
            {rest.length > 0 && (
              <div className="space-y-3">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-1 h-5 bg-[#2563EB] rounded-full" />
                  <h2 className={`font-display text-[18px] font-bold ${darkMode ? "text-white" : "text-[#0F172A]"}`}>More VC Moves</h2>
                </div>
                {rest.map(article => (
                  <div key={article.id || article._id} onClick={() => openArticle(article)}
                    className={`flex gap-3 p-3 rounded-xl border cursor-pointer hover:border-[#2563EB] transition-colors ${darkMode ? "bg-[#111827] border-[#1E293B]" : "bg-white border-[#E2E8F0]"}`}>
                    {article.image && <img src={article.image} alt="" className="w-16 h-12 rounded-lg object-cover flex-shrink-0" onError={e => e.target.style.display='none'} />}
                    <div className="flex-1 min-w-0">
                      <p className={`text-[13px] font-semibold line-clamp-2 ${darkMode ? "text-slate-200" : "text-[#0F172A]"}`}>{article.title}</p>
                      <span className={`text-[11px] ${darkMode ? "text-slate-500" : "text-slate-400"}`}>{formatDate(article.published_at || article.created_at)}</span>
                    </div>
                    <ArrowRight size={14} className="text-[#2563EB] opacity-40 shrink-0 self-center" />
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
