import { useContext, useState } from "react";
import { Twitter, Linkedin, Instagram, Youtube, ArrowRight } from "lucide-react";
import { AppContext } from "../App";

const COVERAGE = [
  { label: "Markets", href: "/?cat=markets" },
  { label: "Deal Flow", href: "/?cat=funding" },
  { label: "Startups", href: "/?cat=startups" },
  { label: "Deep Tech", href: "/?cat=deeptech" },
  { label: "Fintech", href: "/?cat=fintech" },
  { label: "SaaS", href: "/?cat=saas" },
  { label: "Regulation", href: "/?cat=policy" },
  { label: "IPOs", href: "/?cat=ipo" },
  { label: "Venture Capital", href: "/?cat=vc" },
  { label: "Climate Tech", href: "/?cat=climate" },
];

const INSIDE = [
  { label: "About", href: "/about" },
  { label: "Our Team", href: "/team" },
  { label: "Editorial Standards", href: "/editorial-standards" },
  { label: "Pitch a Story", href: "/pitch" },
  { label: "Advertise", href: "/advertise" },
  { label: "Careers", href: "/careers" },
  { label: "Contact", href: "/contact" },
];

const LEGAL = [
  { label: "Privacy", href: "/privacy-policy" },
  { label: "Terms", href: "/terms" },
  { label: "Cookies", href: "/cookie-policy" },
  { label: "Disclaimer", href: "/disclaimer" },
  { label: "RSS", href: "/rss" },
];

const SOCIALS = [
  { Icon: Twitter, href: "https://twitter.com/siliconfund", label: "Twitter / X" },
  { Icon: Linkedin, href: "https://linkedin.com/company/siliconfund", label: "LinkedIn" },
  { Icon: Instagram, href: "https://instagram.com/siliconfund", label: "Instagram" },
  { Icon: Youtube, href: "https://youtube.com/@siliconfund", label: "YouTube" },
];

export const Footer = () => {
  const { darkMode } = useContext(AppContext);
  const [email, setEmail] = useState("");

  const handleSubscribe = (e) => {
    e.preventDefault();
    console.log("Silicon Fund newsletter subscribe:", email);
    setEmail("");
  };

  const year = new Date().getFullYear();

  return (
    <footer
      data-testid="footer"
      className="mt-8 bg-[#0A0F1E] text-slate-300"
    >
      {/* Top blue accent stripe */}
      <div className="h-[3px] bg-gradient-to-r from-[#2563EB] via-[#06B6D4] to-[#6366F1]" />

      <div className="max-w-screen-xl mx-auto px-6 py-10">
        {/* Newsletter band */}
        <div className="pb-8 mb-8 grid grid-cols-1 md:grid-cols-3 gap-6 items-center border-b border-[#1E293B]">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#06B6D4] animate-pulse" />
              <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#06B6D4]">
                Daily Brief
              </span>
            </div>
            <h2 className="font-display text-[22px] md:text-[26px] font-bold leading-tight text-white">
              Intelligence that moves capital.
            </h2>
            <p className="text-[14px] mt-2 text-slate-400">
              A 5-minute brief on deals, IPOs, and deep tech — every weekday at 7am IST.
            </p>
          </div>

          <div className="md:col-span-1">
            <form
              onSubmit={handleSubscribe}
              className="flex flex-col sm:flex-row gap-2"
            >
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                className="flex-1 min-w-0 rounded-lg px-4 py-2.5 text-[13px] outline-none border border-[#1E293B] bg-[#111827] text-white placeholder:text-slate-500 focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/30"
              />
              <button
                type="submit"
                className="bg-[#2563EB] text-white rounded-lg px-5 py-2.5 text-[13px] font-bold hover:bg-[#1D4ED8] transition-colors whitespace-nowrap flex items-center gap-1.5"
              >
                Subscribe <ArrowRight size={13} />
              </button>
            </form>
            <p className="text-[11px] mt-2 text-slate-500">
              Free. Unsubscribe anytime. We never share your email.
            </p>
          </div>
        </div>

        {/* Main 3-column grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* Column 1 - Silicon Fund brand */}
          <div>
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#2563EB] to-[#6366F1] flex items-center justify-center">
                <span className="text-white font-black text-[13px] leading-none font-grotesk tracking-tight">SF</span>
              </div>
              <span className="font-display text-[20px] font-black tracking-tight text-white">
                Silicon Fund
              </span>
            </div>
            <p className="text-[12px] leading-relaxed max-w-[26ch] text-slate-400">
              Where capital meets conviction. Daily startup, VC, and policy intelligence — written by people who've shipped, raised, and exited.
            </p>
            <p className="text-[12px] mt-3 text-slate-500">
              Bengaluru · Hyderabad · 2026
            </p>
            <div className="flex items-center gap-4 mt-5">
              {SOCIALS.map(({ Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="text-slate-500 hover:text-[#06B6D4] transition-colors duration-150"
                >
                  <Icon size={16} strokeWidth={1.75} />
                </a>
              ))}
            </div>
          </div>

          {/* Column 2 - Coverage */}
          <div>
            <h3 className="text-[10px] font-bold uppercase tracking-[0.18em] mb-4 text-[#06B6D4]">
              Coverage
            </h3>
            <nav className="flex flex-col gap-2.5">
              {COVERAGE.map(({ label, href }) => (
                <a
                  key={label}
                  href={href}
                  className="text-[13px] text-slate-400 hover:text-white transition-colors duration-150 flex items-center gap-1.5 group"
                >
                  <span className="w-0 group-hover:w-2 h-[1px] bg-[#2563EB] transition-all duration-200 inline-block" />
                  {label}
                </a>
              ))}
            </nav>
          </div>

          {/* Column 3 - Inside Silicon Fund */}
          <div>
            <h3 className="text-[10px] font-bold uppercase tracking-[0.18em] mb-4 text-[#06B6D4]">
              Inside Silicon Fund
            </h3>
            <nav className="flex flex-col gap-2.5">
              {INSIDE.map(({ label, href }) => (
                <a
                  key={label}
                  href={href}
                  className="text-[13px] text-slate-400 hover:text-white transition-colors duration-150 flex items-center gap-1.5 group"
                >
                  <span className="w-0 group-hover:w-2 h-[1px] bg-[#2563EB] transition-all duration-200 inline-block" />
                  {label}
                </a>
              ))}
            </nav>
          </div>
        </div>

        {/* Bottom strip */}
        <div className="mt-8 pt-6 border-t border-[#1E293B] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
            {LEGAL.map(({ label, href }, i) => (
              <span key={label} className="flex items-center gap-2">
                <a
                  href={href}
                  className="text-[11px] text-slate-500 hover:text-slate-200 transition-colors duration-150"
                >
                  {label}
                </a>
                {i < LEGAL.length - 1 && (
                  <span className="text-[11px] text-[#1E293B]">·</span>
                )}
              </span>
            ))}
          </div>
          <p className="text-[11px] text-slate-600">
            © {year} Silicon Fund. Built for builders.
          </p>
        </div>
      </div>
    </footer>
  );
};
