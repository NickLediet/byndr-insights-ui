import { useState, useMemo, useEffect } from "react";
import { Link } from "react-router";
import { Search, X, TrendingUp, TrendingDown, ChevronLeft, ChevronRight, Activity } from "lucide-react";
import { EXTENDED_CARDS, TOP_MOVERS, MARKET_STATS } from "../../data/mockData";

const TABS = ["ALL", "GAINERS", "LOSERS"] as const;
type Tab = typeof TABS[number];

const RARITIES = ["All", "Common", "Uncommon", "Rare", "Mythic"];
const SORT_OPTIONS = [
  { value: "price_desc", label: "Price ↓" },
  { value: "price_asc", label: "Price ↑" },
  { value: "change_desc", label: "Change ↓" },
  { value: "change_asc", label: "Change ↑" },
  { value: "name_asc", label: "Name" },
  { value: "volume_desc", label: "Volume ↓" },
];

const COL_TEMPLATE = "2rem 1fr 5rem 3rem 3rem 6rem 5rem 6rem 6rem 4rem";

// Deterministic sparkline from card id + price change
function Sparkline({ change, id }: { change: number; id: string }) {
  const seed = id.split("").reduce((acc, ch) => acc + ch.charCodeAt(0), 0);
  const W = 60, H = 18, n = 10;
  const pts: string[] = [];
  for (let i = 0; i <= n; i++) {
    const x = (i / n) * W;
    const noise = Math.sin(seed * 0.31 + i * 1.9) * 3 + Math.cos(seed * 0.07 + i * 0.8) * 2;
    const trend = (change / 100) * H * 0.7 * (i / n);
    const y = H / 2 - trend + noise;
    pts.push(`${x.toFixed(1)},${Math.max(1, Math.min(H - 1, y)).toFixed(1)}`);
  }
  const color = change >= 0 ? "#00C48C" : "#FF3B3B";
  const fill = change >= 0 ? "rgba(0,196,140,0.12)" : "rgba(255,59,59,0.12)";
  const lastPt = pts[pts.length - 1].split(",");
  const closedPts = `${pts.join(" ")} ${lastPt[0]},${H} 0,${H}`;
  return (
    <svg width={W} height={H} className="shrink-0">
      <polygon points={closedPts} fill={fill} />
      <polyline
        points={pts.join(" ")}
        fill="none"
        stroke={color}
        strokeWidth="1.5"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
    </svg>
  );
}

function ColorPips({ colors }: { colors: string[] }) {
  const bg: Record<string, string> = { W: "#F9F6D2", U: "#3B7EFF", B: "#222", R: "#FF3B3B", G: "#00894D" };
  if (colors.length === 0)
    return <span className="text-[9px] text-gray-400 mono border border-gray-300 px-1">C</span>;
  return (
    <div className="flex gap-0.5">
      {colors.map(c => (
        <span
          key={c}
          className="w-3 h-3 rounded-full border border-black/30 inline-block"
          style={{ backgroundColor: bg[c] || "#ccc" }}
          title={c}
        />
      ))}
    </div>
  );
}

function RarityBadge({ rarity }: { rarity: string }) {
  const styles: Record<string, { bg: string; fg: string }> = {
    Mythic: { bg: "#f97316", fg: "#fff" },
    Rare: { bg: "#ca8a04", fg: "#fff" },
    Uncommon: { bg: "#9ca3af", fg: "#fff" },
    Common: { bg: "#e5e7eb", fg: "#000" },
  };
  const s = styles[rarity] || styles.Common;
  return (
    <span
      className="text-[8px] font-bold px-1 py-0.5 border border-black mono uppercase"
      style={{ backgroundColor: s.bg, color: s.fg }}
    >
      {rarity.slice(0, 1)}
    </span>
  );
}

export function TerminalView() {
  const [tab, setTab] = useState<Tab>("ALL");
  const [search, setSearch] = useState("");
  const [selectedRarity, setSelectedRarity] = useState("All");
  const [sortBy, setSortBy] = useState("price_desc");
  const [page, setPage] = useState(1);
  const [time, setTime] = useState(new Date());
  const perPage = 15;

  useEffect(() => {
    const iv = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(iv);
  }, []);

  const filtered = useMemo(() => {
    let cards = [...EXTENDED_CARDS];
    if (search) cards = cards.filter(c =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.setCode.toLowerCase().includes(search.toLowerCase())
    );
    if (selectedRarity !== "All") cards = cards.filter(c => c.rarity === selectedRarity);
    if (tab === "GAINERS") cards = cards.filter(c => c.priceChangePercent > 0);
    if (tab === "LOSERS") cards = cards.filter(c => c.priceChangePercent < 0);
    cards.sort((a, b) => {
      if (sortBy === "price_desc") return b.price - a.price;
      if (sortBy === "price_asc") return a.price - b.price;
      if (sortBy === "change_desc") return b.priceChangePercent - a.priceChangePercent;
      if (sortBy === "change_asc") return a.priceChangePercent - b.priceChangePercent;
      if (sortBy === "name_asc") return a.name.localeCompare(b.name);
      if (sortBy === "volume_desc") return b.volume - a.volume;
      return 0;
    });
    return cards;
  }, [search, selectedRarity, tab, sortBy]);

  const totalPages = Math.ceil(filtered.length / perPage);
  const paginated = filtered.slice((page - 1) * perPage, page * perPage);

  return (
    <div className="bg-[#FFFEF0] min-h-[calc(100vh-56px)]">

      {/* ── Terminal Header ──────────────────────────────────────────── */}
      <div className="border-b-2 border-black bg-white px-5 py-2.5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-[#FFE234] border-2 border-black flex items-center justify-center brutal-shadow-sm">
              <Activity className="w-3 h-3 text-black" />
            </div>
            <span className="font-bold text-black mono uppercase tracking-widest text-xs">
              Vaultex Terminal
            </span>
          </div>
          <span className="text-[9px] text-[#00894D] font-bold mono px-1.5 py-0.5 border-2 border-[#00894D] bg-[#00894D]/5 uppercase tracking-wider flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-[#00894D] animate-pulse inline-block" />
            LIVE
          </span>
        </div>

        {/* Market stats */}
        <div className="flex items-center gap-5">
          {MARKET_STATS.slice(0, 3).map(stat => (
            <div key={stat.label} className="hidden lg:block text-right">
              <div className="text-[8px] text-gray-400 mono uppercase tracking-wider">{stat.label}</div>
              <div
                className="text-[11px] font-bold mono"
                style={{ color: stat.positive ? "#00894D" : "#FF3B3B" }}
              >
                {stat.value}
                <span className="text-[9px] ml-1 text-gray-400">{stat.change}</span>
              </div>
            </div>
          ))}
          <div className="text-xs text-gray-500 mono tabular-nums border-l-2 border-black/10 pl-4">
            {time.toLocaleTimeString("en-US", { hour12: false })}
            <span className="text-[9px] text-gray-400 ml-1">EST</span>
          </div>
        </div>
      </div>

      {/* ── Ticker Tape ─────────────────────────────────────────────── */}
      <div className="border-b-2 border-black bg-[#FFE234] overflow-hidden py-1.5">
        <style>{`
          @keyframes scroll-ticker {
            0% { transform: translateX(0); }
            100% { transform: translateX(-50%); }
          }
          .ticker-scroll {
            animation: scroll-ticker 30s linear infinite;
            display: flex;
            width: max-content;
          }
          .ticker-scroll:hover { animation-play-state: paused; }
        `}</style>
        <div className="ticker-scroll">
          {[...TOP_MOVERS, ...TOP_MOVERS].map((m, i) => (
            <div key={i} className="flex items-center gap-2 px-4 border-r-2 border-black/20">
              <span className="text-[10px] text-black font-bold mono">{m.name}</span>
              <span className="text-[10px] text-black/50 mono">{m.set}</span>
              <span className="text-[10px] font-bold mono text-black">${m.price.toFixed(2)}</span>
              <span
                className="text-[9px] font-bold mono"
                style={{ color: m.positive ? "#00612e" : "#b91c1c" }}
              >
                {m.positive ? "▲" : "▼"}{Math.abs(m.change).toFixed(1)}%
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* ── Controls ────────────────────────────────────────────────── */}
      <div className="border-b-2 border-black bg-white px-5 py-2.5 flex flex-wrap items-center gap-3">

        {/* Tabs */}
        <div className="flex border-2 border-black brutal-shadow-sm">
          {TABS.map(t => (
            <button
              key={t}
              onClick={() => { setTab(t); setPage(1); }}
              className={`px-3 py-1.5 text-[10px] font-bold mono uppercase tracking-widest transition-colors border-r-2 border-black last:border-r-0 ${
                tab === t
                  ? t === "GAINERS"
                    ? "bg-[#00C48C] text-white"
                    : t === "LOSERS"
                      ? "bg-[#FF3B3B] text-white"
                      : "bg-[#FFE234] text-black"
                  : "bg-white text-gray-500 hover:bg-[#FFFEF0] hover:text-black"
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="flex items-center border-2 border-black bg-[#FFFEF0] px-2.5 py-1.5 gap-1.5 flex-1 max-w-xs brutal-shadow-sm">
          <Search className="w-3 h-3 text-gray-400 shrink-0" />
          <input
            value={search}
            onChange={e => { setSearch(e.target.value); setPage(1); }}
            placeholder="Search cards or set code..."
            className="outline-none bg-transparent text-xs text-black w-full placeholder:text-gray-400 mono"
          />
          {search && (
            <button onClick={() => setSearch("")}>
              <X className="w-3 h-3 text-gray-400 hover:text-black" />
            </button>
          )}
        </div>

        {/* Rarity filters */}
        <div className="flex gap-1">
          {RARITIES.map(r => (
            <button
              key={r}
              onClick={() => { setSelectedRarity(r); setPage(1); }}
              className={`text-[9px] font-bold mono px-2 py-1 border-2 transition-colors ${
                selectedRarity === r
                  ? "border-black bg-[#FFE234] text-black brutal-shadow-sm"
                  : "border-black/20 text-gray-500 bg-white hover:border-black hover:text-black"
              }`}
            >
              {r === "All" ? "ALL" : r.slice(0, 1)}
            </button>
          ))}
        </div>

        {/* Sort */}
        <select
          value={sortBy}
          onChange={e => setSortBy(e.target.value)}
          className="text-[10px] border-2 border-black bg-white text-black px-2 py-1.5 outline-none mono brutal-shadow-sm"
        >
          {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>

        <span className="text-[9px] text-gray-400 mono ml-auto">{filtered.length} results</span>
      </div>

      {/* ── Table ───────────────────────────────────────────────────── */}
      <div className="overflow-x-auto border-b-2 border-black">

        {/* Column headers */}
        <div
          className="grid min-w-[800px] border-b-2 border-black bg-[#FFE234] px-5 py-2.5"
          style={{ gridTemplateColumns: COL_TEMPLATE }}
        >
          {["#", "CARD", "SET", "RAR", "CLR", "PRICE", "24H %", "FOIL", "VOLUME", "TREND"].map(h => (
            <div
              key={h}
              className={`text-[9px] font-bold text-black/60 mono uppercase tracking-widest ${
                h === "#" || h === "CARD" ? "text-left" : "text-right"
              }`}
            >
              {h}
            </div>
          ))}
        </div>

        {/* Data rows */}
        {paginated.map((card, i) => {
          const rank = (page - 1) * perPage + i + 1;
          const isPos = card.priceChangePercent >= 0;
          const isEven = i % 2 === 0;
          return (
            <Link
              key={card.id}
              to={`/cards/${card.id}`}
              className={`grid min-w-[800px] items-center px-5 py-2.5 border-b border-black/10 last:border-b-0 hover:bg-[#FFE234]/20 transition-colors group ${
                isEven ? "bg-white" : "bg-[#FFFEF0]"
              }`}
              style={{ gridTemplateColumns: COL_TEMPLATE }}
            >
              {/* Rank */}
              <div className="text-[10px] text-gray-400 mono tabular-nums">{rank}</div>

              {/* Card name + thumb */}
              <div className="flex items-center gap-2.5 min-w-0">
                <img
                  src={card.image}
                  alt={card.name}
                  className="w-7 h-7 object-cover border-2 border-black shrink-0"
                />
                <div className="min-w-0">
                  <div className="text-xs text-black font-bold group-hover:text-[#3B7EFF] transition-colors truncate">
                    {card.name}
                  </div>
                  <div className="text-[9px] text-gray-400 mono truncate">{card.type}</div>
                </div>
              </div>

              {/* Set */}
              <div className="text-right">
                <div className="text-[9px] text-gray-500 mono">{card.setCode}</div>
              </div>

              {/* Rarity */}
              <div className="flex justify-end">
                <RarityBadge rarity={card.rarity} />
              </div>

              {/* Colors */}
              <div className="flex justify-end">
                <ColorPips colors={card.colors} />
              </div>

              {/* Price */}
              <div className="text-right text-xs font-bold text-black mono tabular-nums">
                ${card.price.toFixed(2)}
              </div>

              {/* 24h change */}
              <div
                className={`text-right text-xs font-bold mono tabular-nums flex items-center justify-end gap-0.5 ${
                  isPos ? "text-[#00894D]" : "text-[#FF3B3B]"
                }`}
              >
                {isPos
                  ? <TrendingUp className="w-3 h-3 shrink-0" />
                  : <TrendingDown className="w-3 h-3 shrink-0" />}
                {isPos ? "+" : ""}{card.priceChangePercent.toFixed(1)}%
              </div>

              {/* Foil */}
              <div className="text-right text-[10px] text-gray-500 mono tabular-nums">
                ${card.foilPrice.toFixed(0)}
              </div>

              {/* Volume */}
              <div className="text-right text-[10px] text-gray-500 mono tabular-nums">
                {card.volume.toLocaleString()}
              </div>

              {/* Sparkline */}
              <div className="flex justify-end">
                <Sparkline change={card.priceChangePercent} id={card.id} />
              </div>
            </Link>
          );
        })}
      </div>

      {/* ── Pagination ──────────────────────────────────────────────── */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between px-5 py-3 bg-white border-t-2 border-black">
          <span className="text-[10px] text-gray-500 mono">
            {(page - 1) * perPage + 1}–{Math.min(page * perPage, filtered.length)} of {filtered.length}
          </span>
          <div className="flex gap-1">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className="p-1.5 border-2 border-black bg-white hover:bg-[#FFE234] disabled:opacity-30 brutal-shadow-sm transition-colors"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
            {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
              const p = Math.max(1, Math.min(page - 3, totalPages - 6)) + i;
              return (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  className={`w-7 h-7 border-2 border-black text-[10px] font-bold mono brutal-shadow-sm transition-colors ${
                    p === page
                      ? "bg-[#FFE234] text-black"
                      : "bg-white text-gray-600 hover:bg-[#FFE234]/40"
                  }`}
                >
                  {p}
                </button>
              );
            })}
            <button
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="p-1.5 border-2 border-black bg-white hover:bg-[#FFE234] disabled:opacity-30 brutal-shadow-sm transition-colors"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}