import { useState, useMemo } from "react";
import { Link } from "react-router";
import {
  Search, X, ChevronLeft, ChevronRight, TrendingUp, TrendingDown,
} from "lucide-react";
import { EXTENDED_CARDS, MTGCard } from "../../data/mockData";

const RARITIES = ["All", "Common", "Uncommon", "Rare", "Mythic"];
const FORMATS = ["All", "Standard", "Modern", "Legacy", "Vintage", "Commander"];
const COLORS_LIST = [
  { key: "W", label: "White", bg: "#F9F6D2", text: "#000" },
  { key: "U", label: "Blue", bg: "#3B7EFF", text: "#fff" },
  { key: "B", label: "Black", bg: "#1a1a1a", text: "#fff" },
  { key: "R", label: "Red", bg: "#FF3B3B", text: "#fff" },
  { key: "G", label: "Green", bg: "#00894D", text: "#fff" },
];
const SORT_OPTIONS = [
  { value: "price_desc", label: "Price ↓" },
  { value: "price_asc", label: "Price ↑" },
  { value: "change_desc", label: "Gainers" },
  { value: "change_asc", label: "Losers" },
  { value: "name_asc", label: "Name A→Z" },
  { value: "volume_desc", label: "Volume ↓" },
];

function RarityBadge({ rarity }: { rarity: string }) {
  const styles: Record<string, string> = {
    Mythic: "bg-orange-500 text-white",
    Rare: "bg-yellow-600 text-white",
    Uncommon: "bg-gray-400 text-white",
    Common: "bg-white text-black border-gray-300",
    Special: "bg-purple-500 text-white",
  };
  return (
    <span className={`text-[8px] font-bold px-1.5 py-0.5 uppercase tracking-wider border border-black mono ${styles[rarity] || "bg-white"}`}>
      {rarity.slice(0, 1)}
    </span>
  );
}

function ColorPip({ color }: { color: string }) {
  const bg: Record<string, string> = { W: "#F9F6D2", U: "#3B7EFF", B: "#222", R: "#FF3B3B", G: "#00894D" };
  return (
    <span
      className="w-2.5 h-2.5 rounded-full border border-black inline-block shrink-0"
      style={{ backgroundColor: bg[color] || "#ccc" }}
    />
  );
}

function SidebarSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="text-[9px] font-bold uppercase tracking-[0.15em] text-gray-400 mb-2 mono border-b border-black/10 pb-1">
        {title}
      </div>
      {children}
    </div>
  );
}

export function MarketView() {
  const [search, setSearch] = useState("");
  const [selectedRarity, setSelectedRarity] = useState("All");
  const [selectedFormat, setSelectedFormat] = useState("All");
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState("price_desc");
  const [page, setPage] = useState(1);
  const perPage = 9;

  const toggleColor = (c: string) =>
    setSelectedColors(prev => prev.includes(c) ? prev.filter(x => x !== c) : [...prev, c]);

  const filtered = useMemo(() => {
    let cards = [...EXTENDED_CARDS];
    if (search) cards = cards.filter(c => c.name.toLowerCase().includes(search.toLowerCase()) || c.set.toLowerCase().includes(search.toLowerCase()));
    if (selectedRarity !== "All") cards = cards.filter(c => c.rarity === selectedRarity);
    if (selectedFormat !== "All") cards = cards.filter(c => c.formats.includes(selectedFormat));
    if (selectedColors.length > 0) cards = cards.filter(c => selectedColors.some(col => c.colors.includes(col)));
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
  }, [search, selectedRarity, selectedFormat, selectedColors, sortBy]);

  const totalPages = Math.ceil(filtered.length / perPage);
  const paginated = filtered.slice((page - 1) * perPage, page * perPage);
  const hasFilters = !!(search || selectedRarity !== "All" || selectedFormat !== "All" || selectedColors.length > 0);

  const clearAll = () => { setSearch(""); setSelectedRarity("All"); setSelectedFormat("All"); setSelectedColors([]); setPage(1); };

  return (
    <div className="flex min-h-[calc(100vh-56px)]">
      {/* ── Sidebar ─────────────────────────────────────────────────── */}
      <aside className="hidden md:flex flex-col w-52 shrink-0 border-r-2 border-black bg-white sticky top-14 h-[calc(100vh-56px)] overflow-y-auto">
        {/* Sidebar header */}
        <div className="px-4 py-3 border-b-2 border-black bg-[#0A0A0A] flex items-center justify-between">
          <span className="text-[10px] font-bold text-white uppercase tracking-widest mono">Filters</span>
          {hasFilters && (
            <button onClick={clearAll} className="text-[9px] text-[#FFE234] font-bold hover:underline mono flex items-center gap-0.5">
              <X className="w-2.5 h-2.5" /> Clear
            </button>
          )}
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-5">
          {/* Search */}
          <SidebarSection title="Search">
            <div className="flex items-center border-2 border-black px-2 py-1.5 gap-1.5 bg-[#FFFEF0]">
              <Search className="w-3 h-3 text-gray-400 shrink-0" />
              <input
                value={search}
                onChange={e => { setSearch(e.target.value); setPage(1); }}
                placeholder="Name or set..."
                className="outline-none bg-transparent text-xs w-full"
              />
              {search && <button onClick={() => setSearch("")}><X className="w-2.5 h-2.5 text-gray-400" /></button>}
            </div>
          </SidebarSection>

          {/* Sort */}
          <SidebarSection title="Sort By">
            <div className="flex flex-col gap-0.5">
              {SORT_OPTIONS.map(o => (
                <button
                  key={o.value}
                  onClick={() => setSortBy(o.value)}
                  className={`text-left text-xs px-2.5 py-1.5 border-2 font-medium transition-all ${
                    sortBy === o.value
                      ? "border-black bg-[#FFE234] brutal-shadow-sm"
                      : "border-transparent hover:border-black/30 hover:bg-gray-50"
                  }`}
                >
                  {o.label}
                </button>
              ))}
            </div>
          </SidebarSection>

          {/* Rarity */}
          <SidebarSection title="Rarity">
            <div className="flex flex-col gap-0.5">
              {RARITIES.map(r => (
                <button
                  key={r}
                  onClick={() => { setSelectedRarity(r); setPage(1); }}
                  className={`text-left text-xs px-2.5 py-1.5 border-2 font-medium transition-all ${
                    selectedRarity === r
                      ? "border-black bg-[#FFFEF0] brutal-shadow-sm"
                      : "border-transparent hover:border-black/30 hover:bg-gray-50"
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>
          </SidebarSection>

          {/* Color */}
          <SidebarSection title="Color Identity">
            <div className="flex gap-1.5 flex-wrap">
              {COLORS_LIST.map(c => (
                <button
                  key={c.key}
                  onClick={() => { toggleColor(c.key); setPage(1); }}
                  title={c.label}
                  className={`w-8 h-8 border-2 font-bold text-xs transition-all flex items-center justify-center mono ${
                    selectedColors.includes(c.key) ? "border-black brutal-shadow-sm scale-110" : "border-gray-200 hover:border-gray-400"
                  }`}
                  style={{ backgroundColor: c.bg, color: c.text }}
                >
                  {c.key}
                </button>
              ))}
            </div>
          </SidebarSection>

          {/* Format */}
          <SidebarSection title="Format">
            <div className="flex flex-col gap-0.5">
              {FORMATS.map(f => (
                <button
                  key={f}
                  onClick={() => { setSelectedFormat(f); setPage(1); }}
                  className={`text-left text-xs px-2.5 py-1.5 border-2 font-medium transition-all ${
                    selectedFormat === f
                      ? "border-black bg-[#3B7EFF] text-white brutal-shadow-sm"
                      : "border-transparent hover:border-black/30 hover:bg-gray-50"
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </SidebarSection>
        </div>
      </aside>

      {/* ── Main Content ─────────────────────────────────────────────── */}
      <div className="flex-1 min-w-0 p-5">
        {/* Results meta */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-500 mono">{filtered.length} results</span>
            {hasFilters && (
              <div className="flex items-center gap-1 flex-wrap">
                {search && (
                  <span className="flex items-center gap-1 text-[9px] font-bold px-1.5 py-0.5 bg-black text-white mono">
                    "{search}" <button onClick={() => setSearch("")}><X className="w-2 h-2" /></button>
                  </span>
                )}
                {selectedRarity !== "All" && (
                  <span className="flex items-center gap-1 text-[9px] font-bold px-1.5 py-0.5 bg-[#FFE234] text-black border border-black mono">
                    {selectedRarity} <button onClick={() => setSelectedRarity("All")}><X className="w-2 h-2" /></button>
                  </span>
                )}
                {selectedColors.map(col => (
                  <span key={col} className="flex items-center gap-1 text-[9px] font-bold px-1.5 py-0.5 bg-[#3B7EFF] text-white border border-black mono">
                    {col} <button onClick={() => toggleColor(col)}><X className="w-2 h-2" /></button>
                  </span>
                ))}
              </div>
            )}
          </div>
          {/* Mobile sort */}
          <select
            value={sortBy}
            onChange={e => setSortBy(e.target.value)}
            className="md:hidden text-xs border-2 border-black px-2 py-1 bg-white outline-none mono"
          >
            {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-3 gap-4">
          {paginated.map(card => (
            <Link
              key={card.id}
              to={`/cards/${card.id}`}
              className="group border-2 border-black bg-white brutal-shadow hover:-translate-y-1 hover:shadow-[6px_6px_0px_0px_#0A0A0A] transition-all duration-150"
            >
              {/* Image */}
              <div className="relative aspect-[3/4] border-b-2 border-black overflow-hidden">
                <img
                  src={card.image}
                  alt={card.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />

                {/* Rarity + change badges */}
                <div className="absolute top-2 left-2">
                  <RarityBadge rarity={card.rarity} />
                </div>
                <div className={`absolute top-2 right-2 text-[9px] font-bold px-1.5 py-0.5 border border-black flex items-center gap-0.5 mono ${
                  card.priceChange >= 0 ? "bg-[#00C48C] text-white" : "bg-[#FF3B3B] text-white"
                }`}>
                  {card.priceChange >= 0 ? <TrendingUp className="w-2.5 h-2.5" /> : <TrendingDown className="w-2.5 h-2.5" />}
                  {Math.abs(card.priceChangePercent).toFixed(1)}%
                </div>

                {/* Bottom info */}
                <div className="absolute bottom-2 left-2 right-2">
                  <div className="flex gap-1 mb-1">
                    {card.colors.map(c => <ColorPip key={c} color={c} />)}
                  </div>
                </div>
              </div>

              {/* Info panel */}
              <div className="p-3">
                <div className="font-bold text-xs text-black leading-snug mb-0.5 line-clamp-1">{card.name}</div>
                <div className="text-[9px] text-gray-400 mono mb-2 uppercase">{card.set} · {card.setCode}</div>
                <div className="flex items-end justify-between">
                  <div>
                    <div className="font-bold text-base text-black mono leading-none">${card.price.toFixed(2)}</div>
                    <div className="text-[9px] text-gray-400 mono mt-0.5">Foil ${card.foilPrice.toFixed(0)}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-[9px] text-gray-400 mono">Vol</div>
                    <div className="text-[10px] font-bold text-gray-600 mono">{card.volume.toLocaleString()}</div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between mt-8 pt-4 border-t-2 border-black">
            <span className="text-xs text-gray-500 mono">
              {(page - 1) * perPage + 1}–{Math.min(page * perPage, filtered.length)} of {filtered.length}
            </span>
            <div className="flex gap-1">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="p-1.5 border-2 border-black bg-white hover:bg-[#FFE234] disabled:opacity-30 brutal-shadow-sm transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                const p = Math.max(1, Math.min(page - 2, totalPages - 4)) + i;
                return (
                  <button
                    key={p}
                    onClick={() => setPage(p)}
                    className={`w-8 h-8 border-2 border-black text-xs font-bold brutal-shadow-sm transition-colors mono ${
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
                className="p-1.5 border-2 border-black bg-white hover:bg-[#FFE234] disabled:opacity-30 brutal-shadow-sm transition-colors"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
