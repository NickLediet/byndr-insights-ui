import { Link } from "react-router";
import {
  TrendingUp, TrendingDown, ArrowRight,
  BarChart2, Database, Swords, Zap,
} from "lucide-react";
import { MOCK_CARDS, TOP_MOVERS, MARKET_STATS } from "../data/mockData";

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
    <div className="border-b-2 border-black bg-[#0A0A0A] overflow-hidden">
      <div className="flex animate-[marquee_30s_linear_infinite]" style={{ width: "max-content" }}>
        {[...MARKET_STATS, ...MARKET_STATS].map((stat, i) => (
          <div key={i} className="flex items-center gap-2 px-6 py-2 border-r border-gray-700 whitespace-nowrap">
            <span className="text-gray-400 text-xs mono">{stat.label}</span>
            <span className="text-white text-xs font-bold mono">{stat.value}</span>
            <span className={`text-xs flex items-center gap-0.5 mono ${stat.positive ? "text-[#00C48C]" : "text-[#FF3B3B]"}`}>
              {stat.positive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
              {stat.change}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function InsightsPage() {
  return (
    <div className="bg-[#FFFEF0]">

      {/* Ticker */}
      <StatTicker />

      {/* ── Page Title ───────────────────────────────────────────── */}
      <div className="border-b-2 border-black bg-white px-6 py-5 flex items-end justify-between">
        <div>
          <div
            className="inline-block bg-[#FFE234] text-black text-[9px] font-bold px-2 py-1 mb-2 uppercase tracking-[0.15em] border border-black mono"
          >
            Live Market
          </div>
          <h1 className="text-2xl font-bold text-black">Market Insights</h1>
          <p className="text-xs text-gray-500 mono mt-0.5">Snapshot updated in real-time</p>
        </div>
        <Link
          to="/analytics"
          className="hidden sm:flex items-center gap-1.5 px-4 py-2 border-2 border-black bg-white brutal-shadow-sm hover:bg-[#FFE234] transition-colors text-sm font-bold"
        >
          Full Analytics <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* ── Market Stats Banner ──────────────────────────────────── */}
      <section className="border-b-2 border-black bg-white">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
          {MARKET_STATS.map((stat, i) => (
            <div
              key={i}
              className={`px-5 py-4 ${i < MARKET_STATS.length - 1 ? "border-r-2 border-black/10 md:border-black" : ""}`}
            >
              <div className="text-[9px] text-gray-400 mb-1 uppercase tracking-widest mono">{stat.label}</div>
              <div className="font-bold text-black">{stat.value}</div>
              <div
                className={`text-[10px] flex items-center gap-0.5 mt-0.5 mono ${stat.positive ? "text-[#00C48C]" : "text-[#FF3B3B]"}`}
              >
                {stat.positive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                {stat.change}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Top Movers ───────────────────────────────────────────── */}
      <section className="border-b-2 border-black bg-[#FFFEF0]">
        <div className="px-6 py-10">
          <div className="flex items-center justify-between mb-6">
            <div>
              <div className="inline-block bg-[#FFE234] text-black text-[9px] font-bold px-2 py-1 mb-2 uppercase tracking-[0.15em] border border-black mono">
                Live Data
              </div>
              <h2 className="text-xl font-bold">Today's Top Movers</h2>
            </div>
            <Link
              to="/analytics"
              className="text-sm font-bold flex items-center gap-1 px-4 py-2 border-2 border-black hover:bg-[#FFE234] transition-colors brutal-shadow-sm"
            >
              Full Market <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {TOP_MOVERS.map((card, i) => (
              <Link
                key={i}
                to="/cards"
                className="group border-2 border-black p-4 bg-white hover:bg-[#FFE234] transition-colors brutal-shadow"
              >
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <div className="font-bold text-sm text-black">{card.name}</div>
                    <div className="text-[10px] text-gray-500 uppercase tracking-wide mono">{card.set}</div>
                  </div>
                  <div className={`flex items-center gap-0.5 text-xs font-bold px-2 py-0.5 border border-black mono ${
                    card.positive ? "bg-[#00C48C] text-white" : "bg-[#FF3B3B] text-white"
                  }`}>
                    {card.positive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                    {card.positive ? "+" : ""}{card.change}%
                  </div>
                </div>
                <div className="text-xl font-bold text-black mono">${card.price.toFixed(2)}</div>
                <div className="mt-3 h-1 bg-black/10 group-hover:bg-black/20">
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

      {/* ── Featured Cards ─────────���─────────────────────────────── */}
      <section className="border-b-2 border-black">
        <div className="px-6 py-10">
          <div className="flex items-center justify-between mb-6">
            <div>
              <div className="inline-block bg-[#3B7EFF] text-white text-[9px] font-bold px-2 py-1 mb-2 uppercase tracking-[0.15em] border border-black mono">
                Database
              </div>
              <h2 className="text-xl font-bold">Featured Cards</h2>
            </div>
            <Link
              to="/cards"
              className="text-sm font-bold flex items-center gap-1 px-4 py-2 border-2 border-black hover:bg-[#3B7EFF] hover:text-white transition-colors brutal-shadow-sm"
            >
              All Cards <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {MOCK_CARDS.slice(0, 4).map(card => (
              <Link
                key={card.id}
                to={`/cards/${card.id}`}
                className="group border-2 border-black bg-white brutal-shadow hover:-translate-y-0.5 hover:brutal-shadow-lg transition-all"
              >
                <div className="relative h-44 overflow-hidden border-b-2 border-black">
                  <img src={card.image} alt={card.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  <div className="absolute top-2 left-2">
                    <span className={`text-[10px] font-bold px-2 py-0.5 border border-black uppercase tracking-wider ${
                      card.rarity === "Mythic" ? "bg-[#FF7F00] text-white" :
                      card.rarity === "Rare" ? "bg-[#C8A200] text-white" :
                      card.rarity === "Uncommon" ? "bg-gray-400 text-white" :
                      "bg-white text-black"
                    }`}>
                      {card.rarity}
                    </span>
                  </div>
                  <div className="absolute top-2 right-2">
                    <div className={`text-[10px] font-bold px-2 py-0.5 border border-black flex items-center gap-0.5 mono ${
                      card.priceChange >= 0 ? "bg-[#00C48C] text-white" : "bg-[#FF3B3B] text-white"
                    }`}>
                      {card.priceChange >= 0 ? "+" : ""}{card.priceChangePercent.toFixed(1)}%
                    </div>
                  </div>
                </div>
                <div className="p-3">
                  <div className="font-bold text-sm text-black mb-0.5">{card.name}</div>
                  <div className="text-xs text-gray-500 mb-2">{card.set} · {card.type}</div>
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-black mono">${card.price.toFixed(2)}</span>
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
        </div>
      </section>

      {/* ── Platform Features ────────────────────────────────────── */}
      <section className="border-b-2 border-black bg-white">
        <div className="px-6 py-10">
          <div className="mb-8">
            <div className="inline-block bg-[#0A0A0A] text-[#FFE234] text-[9px] font-bold px-2 py-1 mb-2 uppercase tracking-[0.15em] mono">
              Platform
            </div>
            <h2 className="text-xl font-bold text-black">Tools & Views</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-0 border-2 border-black brutal-shadow-lg">
            {FEATURES.map((feat, i) => (
              <Link
                key={i}
                to={feat.link}
                className={`group p-6 border-black hover:bg-black transition-colors duration-200 ${
                  i < FEATURES.length - 1 ? "border-r-2" : ""
                }`}
              >
                <div
                  className="w-10 h-10 flex items-center justify-center border-2 border-black mb-4 group-hover:border-white transition-colors"
                  style={{ backgroundColor: feat.color }}
                >
                  <feat.icon className="w-5 h-5 text-black" />
                </div>
                <h3 className="font-bold text-black group-hover:text-white text-sm mb-2 transition-colors">{feat.title}</h3>
                <p className="text-gray-500 group-hover:text-gray-300 text-xs leading-relaxed transition-colors">{feat.desc}</p>
                <div className="mt-4 flex items-center gap-1 text-xs font-bold text-black group-hover:text-[#FFE234] transition-colors">
                  Explore <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </Link>
            ))}
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
