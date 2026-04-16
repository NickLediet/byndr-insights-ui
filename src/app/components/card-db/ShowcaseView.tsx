import { useState, useMemo } from "react";
import { Link } from "react-router";
import { Search, X, TrendingUp, TrendingDown, ChevronLeft, ChevronRight, Flame, Star } from "lucide-react";
import { EXTENDED_CARDS, MTGCard } from "../../data/mockData";

const COLORS_LIST = [
  { key: "W", label: "White", bg: "#F9F6D2", text: "#000" },
  { key: "U", label: "Blue", bg: "#3B7EFF", text: "#fff" },
  { key: "B", label: "Black", bg: "#1a1a1a", text: "#fff" },
  { key: "R", label: "Red", bg: "#FF3B3B", text: "#fff" },
  { key: "G", label: "Green", bg: "#00894D", text: "#fff" },
];
const RARITIES = ["All", "Mythic", "Rare", "Uncommon", "Common"];
const SORT_OPTIONS = [
  { value: "price_desc", label: "Price ↓" },
  { value: "price_asc", label: "Price ↑" },
  { value: "change_desc", label: "Gainers" },
  { value: "change_asc", label: "Losers" },
  { value: "name_asc", label: "Name A→Z" },
];

const RARITY_ACCENT: Record<string, string> = {
  Mythic: "#f97316",
  Rare: "#ca8a04",
  Uncommon: "#9ca3af",
  Common: "#e5e7eb",
  Special: "#9b59b6",
};

function FeaturedCard({ card, size }: { card: MTGCard; size: "large" | "small" }) {
  const isPos = card.priceChangePercent >= 0;
  return (
    <Link
      to={`/cards/${card.id}`}
      className="group relative overflow-hidden border-2 border-black brutal-shadow bg-black block"
      style={{ borderTopColor: RARITY_ACCENT[card.rarity] || "#000", borderTopWidth: 4 }}
    >
      {/* Image */}
      <div className={`relative overflow-hidden ${size === "large" ? "aspect-[2/3]" : "aspect-[3/4]"}`}>
        <img
          src={card.image}
          alt={card.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />

        {/* Change badge */}
        <div className={`absolute top-3 right-3 flex items-center gap-1 px-2 py-1 border border-black text-xs font-bold mono ${
          isPos ? "bg-[#00C48C] text-white" : "bg-[#FF3B3B] text-white"
        }`}>
          {isPos ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
          {isPos ? "+" : ""}{card.priceChangePercent.toFixed(1)}%
        </div>

        {/* Rarity */}
        <div
          className="absolute top-3 left-3 w-2 h-2 rounded-full border border-black/40"
          style={{ backgroundColor: RARITY_ACCENT[card.rarity] || "#ccc" }}
          title={card.rarity}
        />

        {/* Bottom info overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <div className={`font-bold text-white leading-tight mb-1 ${size === "large" ? "text-base" : "text-sm"}`}>
            {card.name}
          </div>
          <div className="text-[10px] text-gray-400 mono mb-2">{card.set} · {card.setCode}</div>
          <div className="flex items-end justify-between">
            <div className={`font-bold text-white mono ${size === "large" ? "text-2xl" : "text-lg"}`}>
              ${card.price.toFixed(2)}
            </div>
            <div className="text-right">
              <div className="text-[9px] text-gray-500 mono">Foil</div>
              <div className="text-xs text-gray-300 mono">${card.foilPrice.toFixed(0)}</div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}

function CardTile({ card }: { card: MTGCard }) {
  const isPos = card.priceChangePercent >= 0;
  return (
    <Link
      to={`/cards/${card.id}`}
      className="group relative border-2 border-black bg-white brutal-shadow hover:-translate-y-1 hover:shadow-[6px_6px_0px_0px_#0A0A0A] transition-all duration-150 overflow-hidden"
    >
      {/* Rarity color top strip */}
      <div className="h-1" style={{ backgroundColor: RARITY_ACCENT[card.rarity] || "#e5e7eb" }} />

      {/* Image */}
      <div className="relative aspect-[3/4] overflow-hidden border-b-2 border-black">
        <img
          src={card.image}
          alt={card.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        {/* Hover overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/10 to-transparent translate-y-1/3 group-hover:translate-y-0 transition-transform duration-300">
          <div className="absolute bottom-0 left-0 right-0 p-2.5">
            <div className="text-[9px] text-gray-300 mono mb-1">{card.type}</div>
            <div className="flex items-center gap-1 flex-wrap mb-1.5">
              {card.formats.slice(0, 2).map(f => (
                <span key={f} className="text-[8px] font-bold px-1 py-0.5 bg-white/10 border border-white/20 text-white mono">
                  {f.slice(0, 3).toUpperCase()}
                </span>
              ))}
            </div>
            <div className="text-[9px] text-gray-400 mono">Vol: {card.volume.toLocaleString()}</div>
          </div>
        </div>

        {/* Price badge (always visible) */}
        <div className="absolute top-2 left-2 bg-black border border-black/50 px-1.5 py-0.5">
          <span className="text-[10px] font-bold text-white mono">${card.price.toFixed(2)}</span>
        </div>

        {/* Change badge */}
        <div className={`absolute top-2 right-2 flex items-center gap-0.5 px-1.5 py-0.5 border border-black text-[9px] font-bold mono ${
          isPos ? "bg-[#00C48C] text-white" : "bg-[#FF3B3B] text-white"
        }`}>
          {isPos ? "▲" : "▼"}{Math.abs(card.priceChangePercent).toFixed(1)}%
        </div>
      </div>

      {/* Info */}
      <div className="p-2.5">
        <div className="font-bold text-xs text-black leading-snug truncate">{card.name}</div>
        <div className="text-[9px] text-gray-400 mono mt-0.5 uppercase">{card.setCode}</div>
      </div>
    </Link>
  );
}

export function ShowcaseView() {
  const [search, setSearch] = useState("");
  const [selectedRarity, setSelectedRarity] = useState("All");
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState("price_desc");
  const [page, setPage] = useState(1);
  const perPage = 15;

  const toggleColor = (c: string) =>
    setSelectedColors(prev => prev.includes(c) ? prev.filter(x => x !== c) : [...prev, c]);

  // Top movers for the featured section (top 3 gainers by %)
  const topMovers = useMemo(() => {
    return [...EXTENDED_CARDS]
      .filter(c => c.priceChangePercent > 0)
      .sort((a, b) => b.priceChangePercent - a.priceChangePercent)
      .slice(0, 3);
  }, []);

  const filtered = useMemo(() => {
    let cards = [...EXTENDED_CARDS];
    if (search) cards = cards.filter(c => c.name.toLowerCase().includes(search.toLowerCase()) || c.set.toLowerCase().includes(search.toLowerCase()));
    if (selectedRarity !== "All") cards = cards.filter(c => c.rarity === selectedRarity);
    if (selectedColors.length > 0) cards = cards.filter(c => selectedColors.some(col => c.colors.includes(col)));
    cards.sort((a, b) => {
      if (sortBy === "price_desc") return b.price - a.price;
      if (sortBy === "price_asc") return a.price - b.price;
      if (sortBy === "change_desc") return b.priceChangePercent - a.priceChangePercent;
      if (sortBy === "change_asc") return a.priceChangePercent - b.priceChangePercent;
      if (sortBy === "name_asc") return a.name.localeCompare(b.name);
      return 0;
    });
    return cards;
  }, [search, selectedRarity, selectedColors, sortBy]);

  const totalPages = Math.ceil(filtered.length / perPage);
  const paginated = filtered.slice((page - 1) * perPage, page * perPage);
  const hasFilters = !!(search || selectedRarity !== "All" || selectedColors.length > 0);

  return (
    <div className="bg-[#FFFEF0] min-h-[calc(100vh-56px)]">
      {/* ── Hero / Search Header ─────────────────────────────────────── */}
      <div className="border-b-2 border-black bg-[#FFE234] px-6 py-8">
        <div className="max-w-screen-xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Star className="w-4 h-4 text-black" />
                <span className="text-[10px] font-bold mono uppercase tracking-widest text-black">Card Database</span>
              </div>
              <h1 className="font-bold text-black" style={{ fontSize: "2.5rem", lineHeight: 1 }}>
                Browse the Collection
              </h1>
              <p className="text-black/60 mt-2 text-sm">{EXTENDED_CARDS.length.toLocaleString()} cards tracked across all formats</p>
            </div>
            {/* Search */}
            <div className="flex items-center border-2 border-black bg-white px-3 py-2.5 gap-2 w-full sm:w-72 brutal-shadow">
              <Search className="w-4 h-4 text-gray-400 shrink-0" />
              <input
                value={search}
                onChange={e => { setSearch(e.target.value); setPage(1); }}
                placeholder="Search cards or sets..."
                className="outline-none bg-transparent text-sm w-full"
              />
              {search && <button onClick={() => setSearch("")}><X className="w-3.5 h-3.5 text-gray-400" /></button>}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-screen-xl mx-auto px-5 py-6">
        {/* ── Featured Top Movers ──────────────────────────────────────── */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Flame className="w-4 h-4 text-[#FF3B3B]" />
            <span className="font-bold text-black text-sm uppercase tracking-widest">Top Movers Today</span>
            <div className="h-px flex-1 bg-black/20" />
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div className="col-span-1">
              {topMovers[0] && <FeaturedCard card={topMovers[0]} size="large" />}
            </div>
            <div className="col-span-2 grid grid-cols-2 gap-4">
              {topMovers[1] && <FeaturedCard card={topMovers[1]} size="small" />}
              {topMovers[2] && <FeaturedCard card={topMovers[2]} size="small" />}
            </div>
          </div>
        </div>

        {/* ── Filter Chips ─────────────────────────────────────────────── */}
        <div className="flex flex-wrap items-center gap-2 mb-4 py-3 border-y-2 border-black">
          {/* Rarity */}
          <div className="flex gap-1">
            {RARITIES.map(r => (
              <button
                key={r}
                onClick={() => { setSelectedRarity(r); setPage(1); }}
                className={`text-xs px-2.5 py-1 border-2 font-bold transition-all mono ${
                  selectedRarity === r
                    ? "border-black bg-black text-white brutal-shadow-sm"
                    : "border-black/20 text-gray-600 hover:border-black hover:text-black"
                }`}
              >
                {r}
              </button>
            ))}
          </div>

          <div className="h-4 w-px bg-black/20 hidden sm:block" />

          {/* Colors */}
          <div className="flex gap-1">
            {COLORS_LIST.map(c => (
              <button
                key={c.key}
                title={c.label}
                onClick={() => { toggleColor(c.key); setPage(1); }}
                className={`w-7 h-7 border-2 font-bold text-[10px] mono transition-all flex items-center justify-center ${
                  selectedColors.includes(c.key) ? "border-black brutal-shadow-sm scale-110" : "border-transparent hover:border-black/30"
                }`}
                style={{ backgroundColor: c.bg, color: c.text }}
              >
                {c.key}
              </button>
            ))}
          </div>

          <div className="h-4 w-px bg-black/20 hidden sm:block" />

          {/* Sort */}
          <div className="flex gap-1 flex-wrap">
            {SORT_OPTIONS.map(o => (
              <button
                key={o.value}
                onClick={() => setSortBy(o.value)}
                className={`text-xs px-2.5 py-1 border-2 font-medium transition-all ${
                  sortBy === o.value
                    ? "border-black bg-[#3B7EFF] text-white brutal-shadow-sm"
                    : "border-black/20 text-gray-500 hover:border-black/50"
                }`}
              >
                {o.label}
              </button>
            ))}
          </div>

          {hasFilters && (
            <button
              onClick={() => { setSearch(""); setSelectedRarity("All"); setSelectedColors([]); setPage(1); }}
              className="ml-auto text-xs flex items-center gap-1 text-[#FF3B3B] font-bold border-2 border-[#FF3B3B] px-2 py-1 hover:bg-[#FF3B3B] hover:text-white transition-colors"
            >
              <X className="w-3 h-3" /> Clear
            </button>
          )}
        </div>

        {/* Results count */}
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs text-gray-500 mono">{filtered.length} results</span>
          <span className="text-xs text-gray-400 mono">
            Page {page} of {totalPages}
          </span>
        </div>

        {/* ── Card Grid ─────────────────────────────────────────────────── */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
          {paginated.map(card => (
            <CardTile key={card.id} card={card} />
          ))}
        </div>

        {/* ── Pagination ────────────────────────────────────────────────── */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-8 pt-6 border-t-2 border-black">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className="p-2 border-2 border-black bg-white hover:bg-[#FFE234] disabled:opacity-30 brutal-shadow-sm transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
              const p = Math.max(1, Math.min(page - 3, totalPages - 6)) + i;
              return (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  className={`w-9 h-9 border-2 border-black text-sm font-bold mono brutal-shadow-sm transition-colors ${
                    p === page ? "bg-[#FFE234]" : "bg-white hover:bg-[#FFE234]/40"
                  }`}
                >
                  {p}
                </button>
              );
            })}
            <button
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="p-2 border-2 border-black bg-white hover:bg-[#FFE234] disabled:opacity-30 brutal-shadow-sm transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
