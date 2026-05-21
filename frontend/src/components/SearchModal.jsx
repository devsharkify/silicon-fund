import { useState, useEffect, useRef, useCallback, useContext } from "react";
import { Search, X, Clock, TrendingUp } from "lucide-react";
import axios from "axios";
import { API, AppContext } from "../App";

export const SearchModal = ({ isOpen, onClose }) => {
  const { darkMode, openArticle } = useContext(AppContext);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedIdx, setSelectedIdx] = useState(0);
  const inputRef = useRef(null);
  const debounceRef = useRef(null);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setQuery("");
      setResults([]);
      setSelectedIdx(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  // Debounced search
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (!query || query.length < 2) { setResults([]); setLoading(false); return; }
    setLoading(true);
    debounceRef.current = setTimeout(async () => {
      try {
        const res = await axios.get(`${API}/news/search?q=${encodeURIComponent(query)}&limit=8`);
        setResults(res.data.articles || res.data || []);
        setSelectedIdx(0);
      } catch { setResults([]); }
      setLoading(false);
    }, 300);
  }, [query]);

  const handleSelect = useCallback((article) => {
    openArticle(article);
    onClose();
  }, [openArticle, onClose]);

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e) => {
      if (e.key === "Escape") { onClose(); return; }
      if (e.key === "ArrowDown") { e.preventDefault(); setSelectedIdx(i => Math.min(i + 1, results.length - 1)); }
      if (e.key === "ArrowUp") { e.preventDefault(); setSelectedIdx(i => Math.max(i - 1, 0)); }
      if (e.key === "Enter" && results[selectedIdx]) handleSelect(results[selectedIdx]);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [isOpen, results, selectedIdx, handleSelect, onClose]);

  if (!isOpen) return null;

  const formatDate = (str) => {
    try { return new Date(str).toLocaleDateString("en-IN", { day: "numeric", month: "short" }); } catch { return ""; }
  };

  return (
    <div
      className="fixed inset-0 z-[200] flex items-start justify-center pt-[12vh] px-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

      {/* Modal card */}
      <div className={`relative w-full max-w-2xl rounded-2xl overflow-hidden shadow-2xl ${darkMode ? "bg-[#111827]" : "bg-white"}`}
        style={{ boxShadow: "0 25px 60px rgba(0,0,0,0.35)" }}>

        {/* Search input row */}
        <div className={`flex items-center gap-3 px-5 py-4 border-b ${darkMode ? "border-slate-700" : "border-slate-200"}`}>
          <Search size={20} className={darkMode ? "text-slate-400" : "text-slate-400"} strokeWidth={2} />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search deals, founders, startups..."
            className={`flex-1 text-[16px] outline-none bg-transparent ${darkMode ? "text-white placeholder:text-slate-500" : "text-slate-900 placeholder:text-slate-400"}`}
          />
          {loading && <div className="w-4 h-4 border-2 border-[#2563EB] border-t-transparent rounded-full animate-spin" />}
          <button onClick={onClose} className={`p-1 rounded-md ${darkMode ? "hover:bg-slate-700 text-slate-400" : "hover:bg-slate-100 text-slate-400"}`}>
            <X size={16} />
          </button>
        </div>

        {/* Category filter chips */}
        <div className={`flex gap-2 px-5 py-2.5 overflow-x-auto hide-scrollbar border-b ${darkMode ? "border-slate-800 bg-[#0D1526]" : "border-slate-100 bg-slate-50"}`}>
          {["All", "Funding", "Markets", "Startups", "Deep Tech", "Policy"].map(cat => (
            <button key={cat} className={`flex-shrink-0 px-3 py-1 rounded-full text-[11px] font-semibold transition-colors ${cat === "All" ? "bg-[#2563EB] text-white" : darkMode ? "bg-slate-700 text-slate-300 hover:bg-slate-600" : "bg-white text-slate-500 border border-slate-200 hover:border-[#2563EB] hover:text-[#2563EB]"}`}>
              {cat}
            </button>
          ))}
        </div>

        {/* Results area */}
        <div className="max-h-[420px] overflow-y-auto">
          {query.length < 2 && (
            <div className={`px-5 py-8 text-center ${darkMode ? "text-slate-500" : "text-slate-400"}`}>
              <Search size={32} className="mx-auto mb-3 opacity-30" />
              <p className="text-[14px] font-medium">Type to search Silicon Fund</p>
              <p className="text-[12px] mt-1 opacity-60">Press <kbd className={`px-1.5 py-0.5 rounded text-[10px] ${darkMode ? "bg-slate-700" : "bg-slate-200"}`}>⌘K</kbd> to open anytime</p>
            </div>
          )}

          {query.length >= 2 && results.length === 0 && !loading && (
            <div className={`px-5 py-8 text-center ${darkMode ? "text-slate-500" : "text-slate-400"}`}>
              <p className="text-[14px]">No results for "<span className="font-semibold">{query}</span>"</p>
            </div>
          )}

          {results.map((article, idx) => {
            const img = article.image || "";
            const cat = article.category_label || article.category || "";
            return (
              <button
                key={article.id || article._id}
                onClick={() => handleSelect(article)}
                className={`w-full flex items-center gap-3 px-5 py-3 text-left transition-colors ${
                  idx === selectedIdx
                    ? darkMode ? "bg-[#1E293B]" : "bg-[#EFF6FF]"
                    : darkMode ? "hover:bg-[#1A2744]" : "hover:bg-slate-50"
                }`}
              >
                <div className="flex-shrink-0 w-12 h-9 rounded-md overflow-hidden bg-slate-200">
                  {img && <img src={img} alt="" className="w-full h-full object-cover" onError={e => e.target.style.display='none'} />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    {cat && <span className="text-[9px] font-bold uppercase tracking-wider text-[#2563EB]">{cat}</span>}
                    <span className={`text-[10px] ${darkMode ? "text-slate-500" : "text-slate-400"}`}>{formatDate(article.published_at || article.created_at)}</span>
                  </div>
                  <p className={`text-[13px] font-semibold leading-snug line-clamp-1 ${darkMode ? "text-slate-200" : "text-slate-800"}`}>{article.title}</p>
                </div>
                {idx === selectedIdx && <span className={`text-[10px] px-1.5 py-0.5 rounded ${darkMode ? "bg-slate-700 text-slate-400" : "bg-slate-200 text-slate-500"}`}>↵</span>}
              </button>
            );
          })}
        </div>

        {/* Footer hint */}
        {results.length > 0 && (
          <div className={`px-5 py-2.5 flex items-center gap-4 text-[10px] border-t ${darkMode ? "border-slate-800 text-slate-600 bg-[#0D1526]" : "border-slate-100 text-slate-400 bg-slate-50"}`}>
            <span><kbd className="px-1 rounded bg-current/10">↑↓</kbd> navigate</span>
            <span><kbd className="px-1 rounded bg-current/10">↵</kbd> open</span>
            <span><kbd className="px-1 rounded bg-current/10">esc</kbd> close</span>
          </div>
        )}
      </div>
    </div>
  );
};
