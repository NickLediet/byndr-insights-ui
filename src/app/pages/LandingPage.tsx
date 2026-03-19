import { useState } from "react";
import { Link } from "react-router";
import {
  Search, TrendingUp, TrendingDown, ArrowRight, Sparkles,
  BarChart2, Database, Swords, ChevronRight, Zap, Globe, Shield
} from "lucide-react";
import { MOCK_CARDS, TOP_MOVERS, MARKET_STATS } from "../data/mockData";

const HERO_BG = "https://images.unsplash.com/photo-1637757969279-c4d028905131?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1400";

const SEARCH_SUGGESTIONS = [
  "Jace, the Mind Sculptor",
  "Black Lotus",
  "Ragavan, Nimble Pilferer",
  "Force of Will",
  "Tarmogoyf",
  "Liliana of the Veil",
];

const FEATURES = [
  {
    icon: BarChart2,
    title: "Financial Analytics",
    desc: "Real-time price tracking, historical charts, and market trend analysis for every card.",
    color: "#FFE234",
    link: "/analytics",
  },
  {
    icon: Database,
    title: "Card Database",
    desc: "Complete metadata for 98K+ cards including rulings, legality, and print history.",
    color: "#3B7EFF",
    link: "/cards",
  },
  {
    icon: Swords,
    title: "Metagame Intel",
    desc: "Track deck archetypes, win rates, and tournament representation across all formats.",
    color: "#FF3B3B",
    link: "/metagame",
  },
  {
    icon: Zap,
    title: "Query Builder",
    desc: "Build powerful custom queries to find exactly what you need using composable filters.",
    color: "#00C48C",
    link: "/query",
  },
];

function StatTicker() {
  return (
    <div className="border-y-2 border-black bg-[#0A0A0A] overflow-hidden">
      <div className="flex animate-[marquee_30s_linear_infinite]" style={{ width: 'max-content' }}>
        {[...MARKET_STATS, ...MARKET_STATS].map((stat, i) => (
          <div key={i} className="flex items-center gap-2 px-6 py-2 border-r border-gray-700 whitespace-nowrap">
            <span className="text-gray-400 text-xs" style={{ fontFamily: 'Space Mono' }}>{stat.label}</span>
            <span className="text-white text-xs font-bold" style={{ fontFamily: 'Space Mono' }}>{stat.value}</span>
            <span className={`text-xs flex items-center gap-0.5 ${stat.positive ? "text-[#00C48C]" : "text-[#FF3B3B]"}`} style={{ fontFamily: 'Space Mono' }}>
              {stat.positive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
              {stat.change}
            </span>
          </div>
        ))}
      </div>
    </div>
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
      {/* Ticker */}
      <StatTicker />

      {/* ── Hero ─────────────────────────────────────── */}
      <section className="relative border-b-2 border-black overflow-hidden" style={{ minHeight: '82vh' }}>
        {/* Background image */}
        <div className="absolute inset-0">
          <img src={HERO_BG} alt="" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-[#0A0A0A]/75" />
          {/* Grid overlay */}
          <div className="absolute inset-0 opacity-10" style={{
            backgroundImage: 'linear-gradient(#FFE234 1px, transparent 1px), linear-gradient(90deg, #FFE234 1px, transparent 1px)',
            backgroundSize: '48px 48px'
          }} />
        </div>

        <div className="relative z-10 max-w-screen-xl mx-auto px-4 pt-24 pb-20 flex flex-col items-center text-center gap-8">
          {/* Tag */}
          <div className="inline-flex items-center gap-2 bg-[#FFE234] border-2 border-black px-3 py-1 brutal-shadow">
            <Sparkles className="w-3.5 h-3.5 text-black" />
            <span className="text-xs font-bold text-black uppercase tracking-wider">Financial Intelligence for MTG</span>
          </div>

          {/* Headline */}
          <div>
            <h1 className="text-5xl md:text-7xl font-bold text-white leading-tight" style={{ fontFamily: 'Space Grotesk' }}>
              The Market for<br />
              <span className="text-[#FFE234]">Magic Cards</span><br />
              Decoded.
            </h1>
            <p className="mt-4 text-gray-300 text-lg max-w-xl mx-auto">
              Real-time prices, metagame analytics, composable queries, and a complete card database — all in one place.
            </p>
          </div>

          {/* Search bar */}
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
                  style={{ fontFamily: 'Space Grotesk', fontSize: '1rem' }}
                />
              </div>
              <Link
                to="/cards"
                className="flex items-center gap-2 px-6 bg-[#FFE234] border-l-2 border-black font-bold text-black text-sm hover:bg-[#f5d800] transition-colors shrink-0"
              >
                Search <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {/* Suggestions */}
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

          {/* Quick links */}
          <div className="flex flex-wrap items-center justify-center gap-2">
            {["Standard", "Modern", "Legacy", "Commander", "Vintage"].map(f => (
              <Link
                key={f}
                to="/cards"
                className="text-xs font-medium px-3 py-1.5 border-2 border-white/30 text-white hover:bg-white hover:text-black transition-colors"
              >
                {f}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Market Stats Banner ───────────────────────── */}
      <section className="border-b-2 border-black bg-white">
        <div className="max-w-screen-xl mx-auto px-4 py-6 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-0">
          {MARKET_STATS.map((stat, i) => (
            <div key={i} className={`px-4 py-4 ${i < MARKET_STATS.length - 1 ? 'border-r-2 border-black/10 md:border-black' : ''}`}>
              <div className="text-xs text-gray-500 mb-1 uppercase tracking-wide">{stat.label}</div>
              <div className="font-bold text-black text-base">{stat.value}</div>
              <div className={`text-xs flex items-center gap-0.5 mt-0.5 ${stat.positive ? "text-[#00C48C]" : "text-[#FF3B3B]"}`} style={{ fontFamily: 'Space Mono' }}>
                {stat.positive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                {stat.change}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Features ─────────────────────────────────── */}
      <section className="max-w-screen-xl mx-auto px-4 py-16">
        <div className="mb-10">
          <div className="inline-block bg-[#0A0A0A] text-[#FFE234] text-xs font-bold px-3 py-1 mb-3 uppercase tracking-widest" style={{ fontFamily: 'Space Mono' }}>
            Platform Features
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-black">Everything the market needs.</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-0 border-2 border-black brutal-shadow-lg">
          {FEATURES.map((feat, i) => (
            <Link
              key={i}
              to={feat.link}
              className={`group p-6 border-black hover:bg-black transition-colors duration-200 ${
                i < FEATURES.length - 1 ? 'border-r-2' : ''
              }`}
            >
              <div
                className="w-10 h-10 flex items-center justify-center border-2 border-black mb-4 group-hover:border-white transition-colors"
                style={{ backgroundColor: feat.color }}
              >
                <feat.icon className="w-5 h-5 text-black" />
              </div>
              <h3 className="font-bold text-black group-hover:text-white text-base mb-2 transition-colors">{feat.title}</h3>
              <p className="text-gray-500 group-hover:text-gray-300 text-sm leading-relaxed transition-colors">{feat.desc}</p>
              <div className="mt-4 flex items-center gap-1 text-xs font-bold text-black group-hover:text-[#FFE234] transition-colors">
                Explore <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ── Top Movers ───────────────────────────────── */}
      <section className="border-y-2 border-black bg-white">
        <div className="max-w-screen-xl mx-auto px-4 py-12">
          <div className="flex items-center justify-between mb-8">
            <div>
              <div className="inline-block bg-[#FFE234] text-black text-xs font-bold px-3 py-1 mb-2 uppercase tracking-widest border border-black" style={{ fontFamily: 'Space Mono' }}>
                Live Data
              </div>
              <h2 className="text-2xl font-bold">Today's Top Movers</h2>
            </div>
            <Link to="/analytics" className="text-sm font-bold flex items-center gap-1 px-4 py-2 border-2 border-black hover:bg-[#FFE234] transition-colors brutal-shadow-sm">
              Full Market <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {TOP_MOVERS.map((card, i) => (
              <Link key={i} to="/cards" className="group border-2 border-black p-4 bg-[#FFFEF0] hover:bg-[#FFE234] transition-colors brutal-shadow">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <div className="font-bold text-sm text-black">{card.name}</div>
                    <div className="text-xs text-gray-500 uppercase tracking-wide" style={{ fontFamily: 'Space Mono' }}>{card.set}</div>
                  </div>
                  <div className={`flex items-center gap-0.5 text-xs font-bold px-2 py-0.5 border border-black ${
                    card.positive ? "bg-[#00C48C] text-white" : "bg-[#FF3B3B] text-white"
                  }`}>
                    {card.positive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                    {card.positive ? "+" : ""}{card.change}%
                  </div>
                </div>
                <div className="text-xl font-bold text-black" style={{ fontFamily: 'Space Mono' }}>
                  ${card.price.toFixed(2)}
                </div>
                <div className="mt-2 h-1 bg-black/10 group-hover:bg-black/20">
                  <div
                    className={`h-full ${card.positive ? "bg-[#00C48C]" : "bg-[#FF3B3B]"}`}
                    style={{ width: `${Math.min(Math.abs(card.change) * 3, 100)}%` }}
                  />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Featured Cards ───────────────────────────── */}
      <section className="max-w-screen-xl mx-auto px-4 py-16">
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="inline-block bg-[#3B7EFF] text-white text-xs font-bold px-3 py-1 mb-2 uppercase tracking-widest border border-black" style={{ fontFamily: 'Space Mono' }}>
              Database
            </div>
            <h2 className="text-2xl font-bold">Featured Cards</h2>
          </div>
          <Link to="/cards" className="text-sm font-bold flex items-center gap-1 px-4 py-2 border-2 border-black hover:bg-[#3B7EFF] hover:text-white transition-colors brutal-shadow-sm">
            All Cards <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {MOCK_CARDS.slice(0, 4).map(card => (
            <Link key={card.id} to={`/cards/${card.id}`} className="group border-2 border-black bg-white brutal-shadow hover:-translate-y-0.5 hover:brutal-shadow-lg transition-all">
              <div className="relative h-44 overflow-hidden border-b-2 border-black">
                <img src={card.image} alt={card.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                <div className="absolute top-2 left-2">
                  <span className={`text-[10px] font-bold px-2 py-0.5 border border-black uppercase tracking-wider ${
                    card.rarity === 'Mythic' ? 'bg-[#FF7F00] text-white' :
                    card.rarity === 'Rare' ? 'bg-[#C8A200] text-white' :
                    card.rarity === 'Uncommon' ? 'bg-gray-400 text-white' :
                    'bg-white text-black'
                  }`}>
                    {card.rarity}
                  </span>
                </div>
                <div className="absolute top-2 right-2">
                  <div className={`text-[10px] font-bold px-2 py-0.5 border border-black flex items-center gap-0.5 ${
                    card.priceChange >= 0 ? 'bg-[#00C48C] text-white' : 'bg-[#FF3B3B] text-white'
                  }`} style={{ fontFamily: 'Space Mono' }}>
                    {card.priceChange >= 0 ? '+' : ''}{card.priceChangePercent.toFixed(1)}%
                  </div>
                </div>
              </div>
              <div className="p-3">
                <div className="font-bold text-sm text-black mb-0.5">{card.name}</div>
                <div className="text-xs text-gray-500 mb-2">{card.set} · {card.type}</div>
                <div className="flex items-center justify-between">
                  <span className="text-base font-bold text-black" style={{ fontFamily: 'Space Mono' }}>${card.price.toFixed(2)}</span>
                  <div className="flex gap-1">
                    {card.formats.slice(0, 2).map(f => (
                      <span key={f} className="text-[9px] px-1.5 py-0.5 bg-[#FFFEF0] border border-black font-medium uppercase">{f.slice(0, 3)}</span>
                    ))}
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────── */}
      <section className="border-t-2 border-black bg-[#0A0A0A]">
        <div className="max-w-screen-xl mx-auto px-4 py-16 flex flex-col md:flex-row items-center justify-between gap-8">
          <div>
            <h2 className="text-3xl font-bold text-white mb-2">
              Ready to trade smarter?
            </h2>
            <p className="text-gray-400">Access real-time data, composable analytics, and a complete card database.</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <Link to="/analytics" className="flex items-center gap-2 px-6 py-3 bg-[#FFE234] border-2 border-[#FFE234] text-black font-bold brutal-shadow hover:translate-x-[-2px] hover:translate-y-[-2px] transition-transform">
              <BarChart2 className="w-4 h-4" /> View Analytics
            </Link>
            <Link to="/cards" className="flex items-center gap-2 px-6 py-3 border-2 border-white text-white font-bold hover:bg-white hover:text-black transition-colors">
              <Database className="w-4 h-4" /> Browse Cards
            </Link>
          </div>
        </div>
      </section>

      <style>{`
        @keyframes marquee {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  );
}
