import { useState, useEffect } from "react";
import { Link } from "react-router";
import {
  Search, ArrowRight, Sparkles,
  BarChart2, Database, Swords, Zap,
  ChevronRight, Globe, Shield, TrendingUp,
} from "lucide-react";

const HERO_BG = "https://images.unsplash.com/photo-1761948245809-9c88fcee1f01?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1400";

const TCG_WORDS = ["Magic", "Pokémon", "Yu-Gi-Oh!", "Lorcana"];

const SEARCH_SUGGESTIONS = [
  "Jace, the Mind Sculptor",
  "Black Lotus",
  "Ragavan, Nimble Pilferer",
  "Force of Will",
  "Tarmogoyf",
  "Liliana of the Veil",
];

const PILLARS = [
  {
    icon: BarChart2,
    label: "Financial Analytics",
    desc: "Live prices, historical charts, movers",
    color: "#FFE234",
    fg: "#000",
    href: "/analytics",
  },
  {
    icon: Database,
    label: "Card Database",
    desc: "98K+ cards with full metadata",
    color: "#3B7EFF",
    fg: "#fff",
    href: "/cards",
  },
  {
    icon: Swords,
    label: "Metagame Intel",
    desc: "Deck archetypes & tournament data",
    color: "#FF3B3B",
    fg: "#fff",
    href: "/metagame",
  },
  {
    icon: Zap,
    label: "Query Builder",
    desc: "Composable filters, custom queries",
    color: "#00C48C",
    fg: "#fff",
    href: "/query",
  },
];

const PLATFORM_STATS = [
  { value: "98,234",  label: "Cards Tracked" },
  { value: "$2.1M",   label: "Daily Volume" },
  { value: "Real-time", label: "Price Updates" },
  { value: "4 Formats", label: "Legality Data" },
];

const COMING_SOON = [
  { name: "Pokémon TCG",    status: "Q3 2026" },
  { name: "Yu-Gi-Oh!",      status: "Q4 2026" },
  { name: "Lorcana",        status: "2027"     },
  { name: "Flesh & Blood",  status: "2027"     },
];

// ── Split-flap flipboard component ───────────────────────────────────────────
function FlipWord({ words }: { words: string[] }) {
  const [activeIdx, setActiveIdx] = useState(0);
  const [phase, setPhase] = useState<"idle" | "top-out" | "bottom-in">("idle");

  const cur = words[activeIdx];
  const nxt = words[(activeIdx + 1) % words.length];
  const longest = words.reduce((a, b) => (a.length >= b.length ? a : b), "");

  useEffect(() => {
    const iv = setInterval(() => {
      setPhase("top-out");
      setTimeout(() => setPhase("bottom-in"), 140);
      setTimeout(() => {
        setActiveIdx(i => (i + 1) % words.length);
        setPhase("idle");
      }, 280);
    }, 1800);
    return () => clearInterval(iv);
  }, [words.length]);

  // Shared style for each half-layer (all absolutely cover the full container)
  const layer = (extra: React.CSSProperties): React.CSSProperties => ({
    position: "absolute",
    inset: 0,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    whiteSpace: "nowrap",
    background: "#111",
    ...extra,
  });

  const TOP = "polygon(0 0,100% 0,100% 50%,0 50%)";
  const BOT = "polygon(0 50%,100% 50%,100% 100%,0 100%)";

  return (
    <span className="relative inline-block" style={{ perspective: "500px" }}>
      {/* Ghost: sizes the container to the longest word — prevents layout reflow */}
      <span className="invisible whitespace-nowrap">{longest}</span>

      {/* TOP HALF ─────────────────────────────────────────────────────────── */}
      {/* Static: next-word top — revealed as the top flap folds away */}
      <span aria-hidden="true" style={layer({ clipPath: TOP, zIndex: 1 })}>{nxt}</span>

      {/* Animated: current-word top flap — folds back on rotateX */}
      <span
        aria-hidden="true"
        style={layer({
          clipPath: TOP,
          zIndex: 2,
          transformOrigin: "center 50%",
          transform: phase !== "idle" ? "rotateX(-90deg)" : "rotateX(0deg)",
          transition: phase === "top-out" ? "transform 0.13s ease-in" : "none",
          backfaceVisibility: "hidden",
        })}
      >{cur}</span>

      {/* BOTTOM HALF ──────────────────────────────────────────────────────── */}
      {/* Static: current-word bottom — always visible until covered */}
      <span aria-hidden="true" style={layer({ clipPath: BOT, zIndex: 1 })}>{cur}</span>

      {/* Animated: next-word bottom flap — unfolds in on rotateX */}
      <span
        aria-hidden="true"
        style={layer({
          clipPath: BOT,
          zIndex: 2,
          transformOrigin: "center 50%",
          transform: phase === "bottom-in" ? "rotateX(0deg)" : "rotateX(90deg)",
          transition: phase === "bottom-in" ? "transform 0.13s ease-out" : "none",
          backfaceVisibility: "hidden",
        })}
      >{nxt}</span>

      {/* Fold line between the two halves */}
      <span
        aria-hidden="true"
        style={{
          position: "absolute", top: "50%", left: 0, right: 0,
          height: "2px", background: "#0A0A0A", zIndex: 10, pointerEvents: "none",
        }}
      />

      {/* Accessible label for screen readers */}
      <span className="sr-only">{cur}</span>
    </span>
  );
}

export function LandingPage() {
  const [query, setQuery] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);

  const filtered = SEARCH_SUGGESTIONS.filter(s =>
    query ? s.toLowerCase().includes(query.toLowerCase()) : true
  );

  return (
    <div className="bg-[#FFFEF0]">

      {/* ── Hero ─────────────────────────────────────────────────── */}
      <section className="relative border-b-2 border-black overflow-hidden" style={{ minHeight: "88vh" }}>
        {/* Background */}
        <div className="absolute inset-0">
          <img src={HERO_BG} alt="" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-[#0A0A0A]/80" />
          <div
            className="absolute inset-0 opacity-[0.07]"
            style={{
              backgroundImage: "linear-gradient(#FFE234 1px, transparent 1px), linear-gradient(90deg, #FFE234 1px, transparent 1px)",
              backgroundSize: "48px 48px",
            }}
          />
        </div>

        {/* Content */}
        <div className="relative z-10 max-w-screen-xl mx-auto px-6 pt-24 pb-20 flex flex-col items-center text-center gap-10">

          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-[#FFE234] border-2 border-black px-3 py-1.5 brutal-shadow">
            <Sparkles className="w-3.5 h-3.5 text-black" />
            <span className="text-xs font-bold text-black uppercase tracking-wider mono">
              Financial Intelligence for MTG
            </span>
          </div>

          {/* Headline */}
          <div className="max-w-4xl">
            <h1
              className="text-5xl md:text-7xl font-bold text-white"
              style={{ fontFamily: "Space Grotesk", lineHeight: 1.08, letterSpacing: "-0.02em" }}
            >
              The Market for<br />
              <span className="text-[#FFE234]">
                <FlipWord words={TCG_WORDS} /> Cards
              </span><br />
              Decoded.
            </h1>
            <p className="mt-5 text-gray-300 max-w-xl mx-auto" style={{ fontSize: "1.1rem", lineHeight: 1.6 }}>
              Real-time prices, metagame analytics, composable queries, and a complete card database — all in one place.
            </p>
          </div>

          {/* Search */}
          <div className="relative w-full max-w-2xl">
            <div className="flex border-2 border-black brutal-shadow bg-white overflow-hidden">
              <div className="flex-1 flex items-center px-4 gap-3">
                <Search className="w-5 h-5 text-gray-400 shrink-0" />
                <input
                  value={query}
                  onChange={e => setQuery(e.target.value)}
                  onFocus={() => setShowSuggestions(true)}
                  onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
                  placeholder="Search 98,000+ cards by name, set, type..."
                  className="w-full py-3.5 outline-none text-black placeholder:text-gray-400"
                  style={{ fontFamily: "Space Grotesk", fontSize: "1rem" }}
                />
              </div>
              <Link
                to="/cards"
                className="flex items-center gap-2 px-6 bg-[#FFE234] border-l-2 border-black font-bold text-black text-sm hover:bg-[#f5d800] transition-colors shrink-0"
              >
                Search <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {showSuggestions && (
              <div className="absolute top-full left-0 right-0 z-20 border-2 border-black border-t-0 bg-white brutal-shadow">
                {filtered.slice(0, 5).map((s, i) => (
                  <button
                    key={i}
                    className="w-full text-left px-4 py-2.5 text-sm hover:bg-[#FFE234] border-b border-gray-100 last:border-0 flex items-center gap-2"
                    onMouseDown={() => setQuery(s)}
                  >
                    <Search className="w-3.5 h-3.5 text-gray-400" />
                    {s}
                  </button>
                ))}
                <Link
                  to="/cards"
                  className="flex items-center gap-1 px-4 py-2.5 text-xs text-[#3B7EFF] font-medium hover:bg-[#EEF4FF]"
                >
                  Browse all cards <ChevronRight className="w-3 h-3" />
                </Link>
              </div>
            )}
          </div>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <Link
              to="/insights"
              className="flex items-center gap-2 px-6 py-3 bg-[#FFE234] border-2 border-black text-black font-bold brutal-shadow hover:-translate-y-px hover:brutal-shadow-lg transition-all"
            >
              <TrendingUp className="w-4 h-4" /> View Market Insights
            </Link>
            <Link
              to="/cards"
              className="flex items-center gap-2 px-6 py-3 border-2 border-white/60 text-white font-bold hover:bg-white hover:text-black hover:border-white transition-colors"
            >
              <Database className="w-4 h-4" /> Browse Cards
            </Link>
          </div>
        </div>
      </section>

      {/* ── Platform Stats Bar ───────────────────────────────────── */}
      <section className="border-b-2 border-black bg-[#FFE234]">
        <div className="max-w-screen-xl mx-auto grid grid-cols-2 md:grid-cols-4 divide-x-2 divide-black">
          {PLATFORM_STATS.map((s, i) => (
            <div key={i} className="px-6 py-5 text-center">
              <div className="font-bold text-black mono" style={{ fontSize: "1.5rem" }}>{s.value}</div>
              <div className="text-[10px] text-black/60 uppercase tracking-widest mono mt-0.5">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Platform Pillars ─────────────────────────────────────── */}
      <section className="border-b-2 border-black bg-white">
        <div className="max-w-screen-xl mx-auto px-6 py-14">
          <div className="mb-10">
            <div className="inline-block bg-[#0A0A0A] text-[#FFE234] text-[9px] font-bold px-2 py-1 mb-3 uppercase tracking-[0.15em] mono">
              Platform
            </div>
            <h2 className="text-3xl font-bold text-black" style={{ fontFamily: "Space Grotesk" }}>
              Everything the market needs.
            </h2>
            <p className="text-gray-500 mt-2 max-w-md text-sm">
              Four composable tools, one unified platform. Built for traders, collectors, and competitive players.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-0 border-2 border-black brutal-shadow-lg">
            {PILLARS.map((p, i) => (
              <Link
                key={i}
                to={p.href}
                className={`group p-6 border-black hover:bg-black transition-colors duration-200 ${
                  i < PILLARS.length - 1 ? "border-r-2" : ""
                }`}
              >
                <div
                  className="w-10 h-10 flex items-center justify-center border-2 border-black mb-5 group-hover:border-white transition-colors"
                  style={{ backgroundColor: p.color }}
                >
                  <p.icon className="w-5 h-5" style={{ color: p.fg === "#fff" ? "#fff" : "#000" }} />
                </div>
                <h3 className="font-bold text-black group-hover:text-white text-sm mb-2 transition-colors">
                  {p.label}
                </h3>
                <p className="text-gray-500 group-hover:text-gray-400 text-xs leading-relaxed transition-colors">
                  {p.desc}
                </p>
                <div className="mt-5 flex items-center gap-1 text-xs font-bold text-black group-hover:text-[#FFE234] transition-colors mono">
                  Explore <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── TCG Roadmap ──────────────────────────────────────────── */}
      <section className="border-b-2 border-black bg-[#FFFEF0]">
        <div className="max-w-screen-xl mx-auto px-6 py-14 flex flex-col md:flex-row gap-10 items-start">
          {/* Left */}
          <div className="md:w-1/3 shrink-0">
            <div className="inline-flex items-center gap-1.5 bg-[#0A0A0A] text-[#FFE234] text-[9px] font-bold px-2 py-1 mb-3 uppercase tracking-[0.15em] border border-black mono">
              <Globe className="w-2.5 h-2.5" /> Roadmap
            </div>
            <h2 className="text-2xl font-bold text-black mb-3" style={{ fontFamily: "Space Grotesk" }}>
              Starting with MTG.<br />Built for all TCGs.
            </h2>
            <p className="text-gray-500 text-sm leading-relaxed">
              Vaultex is designed from the ground up to be composable and multi-game. Magic: The Gathering is our launch focus, with other major trading card games rolling out through 2026–2027.
            </p>
            <div className="mt-5 flex items-center gap-2 text-xs text-gray-400 mono">
              <Shield className="w-3.5 h-3.5" /> Data accuracy guaranteed
            </div>
          </div>

          {/* Right — TCG grid */}
          <div className="flex-1 grid grid-cols-2 gap-3">
            {/* MTG — active */}
            <div className="col-span-2 border-2 border-black bg-[#FFE234] brutal-shadow-sm p-4 flex items-center justify-between">
              <div>
                <div className="text-[9px] font-bold mono uppercase tracking-widest text-black/50 mb-1">Live Now</div>
                <div className="font-bold text-black">Magic: The Gathering</div>
                <div className="text-[10px] text-black/60 mono mt-0.5">98,234 cards · Full support</div>
              </div>
              <div className="flex items-center gap-1.5 px-2.5 py-1 bg-black text-[#FFE234] border border-black text-[9px] font-bold mono uppercase tracking-wider">
                <span className="w-1.5 h-1.5 rounded-full bg-[#FFE234] animate-pulse" />
                Active
              </div>
            </div>

            {COMING_SOON.map(tcg => (
              <div
                key={tcg.name}
                className="border-2 border-black/20 bg-white p-4 flex items-center justify-between"
              >
                <div>
                  <div className="font-bold text-sm text-black/40">{tcg.name}</div>
                  <div className="text-[9px] text-gray-400 mono mt-0.5">Coming {tcg.status}</div>
                </div>
                <div className="w-2 h-2 rounded-full bg-black/15 border border-black/20" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────────── */}
      <section className="border-b-2 border-black bg-[#0A0A0A]">
        <div className="max-w-screen-xl mx-auto px-6 py-4 flex flex-col md:flex-row items-center justify-between gap-8">
          <div>
            <h2 className="text-3xl font-bold text-white mb-2" style={{ fontFamily: "Space Grotesk" }}>
              Ready to trade smarter?
            </h2>
            <p className="text-gray-400 text-sm">
              Access real-time data, composable analytics, and a complete card database.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 shrink-0">
            <Link
              to="/insights"
              className="flex items-center gap-2 px-6 py-3 bg-[#FFE234] border-2 border-[#FFE234] text-black font-bold brutal-shadow hover:-translate-y-px transition-all"
            >
              <TrendingUp className="w-4 h-4" /> Market Insights
            </Link>
            <Link
              to="/cards"
              className="flex items-center gap-2 px-6 py-3 border-2 border-white text-white font-bold hover:bg-white hover:text-black transition-colors"
            >
              <Database className="w-4 h-4" /> Browse Cards
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}