import { useContext, useRef, useEffect } from "react";
import { AppContext } from "../App";

export const CategoryChips = ({ activeCategory, onCategoryChange }) => {
  const { categories, darkMode } = useContext(AppContext);
  const scrollRef = useRef(null);

  const categoryList = [
    { key: "all", en: "All News" },
    ...Object.entries(categories).map(([key, value]) => ({
      key,
      en: value.en
    }))
  ];

  useEffect(() => {
    if (scrollRef.current && activeCategory) {
      const activeChip = scrollRef.current.querySelector(
        `[data-category="${activeCategory}"]`
      );
      if (activeChip) {
        activeChip.scrollIntoView({
          behavior: "smooth",
          inline: "center",
          block: "nearest"
        });
      }
    }
  }, [activeCategory]);

  return (
    <div
      className={`sticky top-[88px] z-40 ${
        darkMode ? "bg-[#0A0F1E]" : "bg-white"
      }`}
      data-testid="category-chips"
    >
      {/* Mint hairline across the top of the nav strip */}
      <div className="h-[2px] bg-[#2563EB]" />

      {/* Scrollable chip row */}
      <div
        ref={scrollRef}
        className={`
          flex gap-2 overflow-x-auto hide-scrollbar
          px-4 md:px-6 py-2.5
          max-w-screen-xl md:mx-auto
          chip-scroll-container
        `}
      >
        {categoryList.map((cat) => {
          const isActive = activeCategory === cat.key;
          const label = cat.en;

          return (
            <button
              key={cat.key}
              data-category={cat.key}
              data-testid={`category-${cat.key}`}
              onClick={() => onCategoryChange(cat.key)}
              className={`
                flex-shrink-0
                rounded-full px-4 py-1.5
                transition-colors duration-150
                whitespace-nowrap
                focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB] focus-visible:ring-offset-1
                text-[12px] font-semibold uppercase tracking-wider
                ${isActive
                  ? "bg-[#2563EB] text-white border border-[#2563EB]"
                  : darkMode
                    ? "bg-[#111827] border border-[#1E293B] text-slate-200 hover:border-[#2563EB] hover:text-[#2563EB]"
                    : "bg-white border border-[#E2E8F0] text-[#0F172A] hover:border-[#2563EB] hover:text-[#2563EB]"
                }
              `}
            >
              {label}
            </button>
          );
        })}
      </div>

      {/* Bottom divider */}
      <div
        className={`h-px ${darkMode ? "bg-[#1E293B]" : "bg-[#E2E8F0]"}`}
      />
    </div>
  );
};
