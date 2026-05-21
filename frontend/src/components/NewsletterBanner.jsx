import { useState } from "react";
import { ArrowRight, Sparkles } from "lucide-react";

export const NewsletterBanner = ({ darkMode }) => {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email) {
      setSubmitted(true);
      setEmail("");
    }
  };

  return (
    <div className="rounded-2xl overflow-hidden my-8 bg-gradient-to-r from-[#1E40AF] via-[#2563EB] to-[#6366F1] p-6 sm:p-8">
      <div className="max-w-screen-xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center gap-6">
          {/* Left */}
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles size={14} className="text-[#06B6D4]" />
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#06B6D4]">Silicon Fund Daily</span>
            </div>
            <h3 className="text-[22px] sm:text-[26px] font-display font-bold text-white leading-tight">
              Intelligence that moves capital.
            </h3>
            <p className="text-[13px] text-blue-200 mt-2">5-minute brief on deals, IPOs and deep tech — every weekday at 7am IST.</p>
            <div className="flex items-center gap-4 mt-3">
              <div className="flex -space-x-1.5">
                {["bg-[#06B6D4]","bg-[#3B82F6]","bg-[#8B5CF6]","bg-[#2563EB]"].map((c,i) => (
                  <div key={i} className={`w-6 h-6 rounded-full border-2 border-[#2563EB] ${c}`} />
                ))}
              </div>
              <span className="text-[12px] text-blue-200 font-medium">50,000+ subscribers</span>
            </div>
          </div>
          {/* Right */}
          <div className="md:w-[320px]">
            {submitted ? (
              <div className="text-center py-4">
                <div className="text-[32px] mb-2">✓</div>
                <p className="text-white font-bold">You're in!</p>
                <p className="text-blue-200 text-[13px]">First brief arrives tomorrow at 7am IST.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-2">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="w-full rounded-full px-5 py-3 text-[14px] text-slate-900 bg-white/95 outline-none focus:ring-2 focus:ring-white/50 placeholder:text-slate-400"
                />
                <button type="submit" className="w-full flex items-center justify-center gap-2 bg-[#06B6D4] hover:bg-[#0891B2] text-white font-bold rounded-full px-5 py-3 text-[14px] transition-colors">
                  Subscribe free <ArrowRight size={15} />
                </button>
                <p className="text-[11px] text-blue-300 text-center">Free. Unsubscribe anytime.</p>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
