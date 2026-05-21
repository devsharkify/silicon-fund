import React from "react";

export const SkeletonCard = ({ darkMode }) => {
  const base = darkMode ? "bg-[#1E293B]" : "bg-[#E2E8F0]";
  const shimmer = darkMode
    ? "bg-gradient-to-r from-[#1E293B] via-[#334155] to-[#1E293B]"
    : "bg-gradient-to-r from-[#E2E8F0] via-[#F1F5F9] to-[#E2E8F0]";

  return (
    <div className={`rounded-sm overflow-hidden border ${darkMode ? "bg-[#111827] border-[#1E293B]" : "bg-white border-[#E2E8F0]"}`}>
      <style>{`
        @keyframes shimmer-sweep {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
        .shimmer {
          background-size: 200% 100%;
          animation: shimmer-sweep 1.5s infinite linear;
        }
      `}</style>
      {/* Top bar */}
      <div className={`flex items-center justify-between px-3 py-2 border-b ${darkMode ? "border-[#1E293B]" : "border-[#EFF6FF]"}`}>
        <div className={`h-2.5 w-16 rounded-full shimmer ${shimmer}`} />
        <div className={`h-2.5 w-12 rounded-full shimmer ${shimmer}`} />
      </div>
      {/* Image */}
      <div className={`aspect-[4/3] shimmer ${shimmer}`} />
      {/* Body */}
      <div className="p-4">
        <div className={`h-3.5 w-full rounded shimmer ${shimmer} mb-2`} />
        <div className={`h-3.5 w-[85%] rounded shimmer ${shimmer} mb-2`} />
        <div className={`h-3.5 w-[65%] rounded shimmer ${shimmer} mb-4`} />
        <div className={`h-2.5 w-full rounded shimmer ${shimmer} mb-1.5`} />
        <div className={`h-2.5 w-[90%] rounded shimmer ${shimmer} mb-4`} />
        <div className="flex justify-between">
          <div className={`h-2 w-20 rounded shimmer ${shimmer}`} />
          <div className={`h-2 w-16 rounded shimmer ${shimmer}`} />
        </div>
      </div>
    </div>
  );
};
