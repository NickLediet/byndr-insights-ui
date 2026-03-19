import { useState, useMemo } from "react";
import { Link } from "react-router";
import {
  Search, Filter, Grid, List, SlidersHorizontal, ChevronDown,
  TrendingUp, TrendingDown, X, ArrowUpDown, ChevronLeft, ChevronRight
} from "lucide-react";
import { MOCK_CARDS, MTGCard } from "../data/mockData";

const RARITIES = ["All", "Common", "Uncommon", "Rare", "Mythic"];
const FORMATS = ["All Formats", "Standard", "Modern", "Legacy", "Vintage", "Commander"];
const COLORS_LIST = [
  { key: "W", label: "White", bg: "#F9F6D2", border: "#C8B400" },
  { key: "U", label: "Blue", bg: "#C1D7E9", border: "#3B7EFF" },
  { key: "B", label: "Black", bg: "#555", border: "#222", text: "white" },
  { key: "R", label: "Red", bg: "#F4A26B", border: "#FF3B3B" },
  { key: "G", label: "Green", bg: "#9BD3AE", border: "#00894D" },
];
const SORT_OPTIONS = [
  { value: "price_desc", label: "Price: High → Low" },
  { value: "price_asc", label: "Price: Low → High" },
  { value: "change_desc", label: "Gainers First" },
  { value: "change_asc", label: "Losers First" },
  { value: "name_asc", label: "Name A→Z" },
  { value: "volume_desc", label: "Most Volume" },
];

// Expand mock data to have more cards for demo
const EXTENDED_CARDS: MTGCard[] = [
  ...MOCK_CARDS,
  ...MOCK_CARDS.map(c => ({ ...c, id: c.id + "_b", name: c.name + " (Showcase)", price: c.price * 1.4, foilPrice: c.foilPrice * 1.2 })),
  ...MOCK_CARDS.map(c => ({ ...c, id: c.id + "_c", name: c.name + " (Borderless)", set: "Secret Lair", setCode: "SLD", price: c.price * 2.1, foilPrice: c.foilPrice * 1.8 })),
];

function RarityBadge({ rarity }: { rarity: string }) {
  const colors: Record<string, string> = {
    Mythic: "bg-orange-500 text-white",
    Rare: "bg-yellow-600 text-white",
    Uncommon: "bg-gray-400 text-white",
    Common: "bg-white text-black border border-gray-300",
    Special: "bg-[#9B59B6] text-white",
  };
  return (
    <span className={`text-[9px] font-bold px-1.5 py-0.5 uppercase tracking-wider border border-black ${colors[rarity] || "bg-white"}`}>
      {rarity.slice(0, 1)}
    </span>
  );
}

function ColorPip({ color }: { color: string }) {
  const map: Record<string, string> = { W: "bg-[#F9F6D2]", U: "bg-[#3B7EFF]", B: "bg-[#333]", R: "bg-[#FF3B3B]", G: "bg-[#00894D]" };
  return <span className={`w-3 h-3 rounded-full border border-black inline-block ${map[color] || "bg-gray-300"}`} />;
}

export function CardDatabase() {
  const [view, setView] = useState<"grid" | "list">("grid");
  const [search, setSearch] = useState("");
  const [selectedRarity, setSelectedRarity] = useState("All");
  const [selectedFormat, setSelectedFormat] = useState("All Formats");
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState("price_desc");
  const [page, setPage] = useState(1);
  const [filterOpen, setFilterOpen] = useState(false);
  const perPage = view === "grid" ? 12 : 15;

  const toggleColor = (c: string) =>
    setSelectedColors(prev => prev.includes(c) ? prev.filter(x => x !== c) : [...prev, c]);

  const filtered = useMemo(() => {
    let cards = [...EXTENDED_CARDS];
    if (search) cards = cards.filter(c => c.name.toLowerCase().includes(search.toLowerCase()) || c.set.toLowerCase().includes(search.toLowerCase()));
    if (selectedRarity !== "All") cards = cards.filter(c => c.rarity === selectedRarity);
    if (selectedFormat !== "All Formats") cards = cards.filter(c => c.formats.includes(selectedFormat));
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

  const hasFilters = search || selectedRarity !== "All" || selectedFormat !== "All Formats" || selectedColors.length > 0;

  return (
    <div className="bg-[#FFFEF0] min-h-screen">
      {/* Page Header */}
      <div className="border-b-2 border-black bg-white">
        <div className="max-w-screen-xl mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row md:items-end gap-4 justify-between">
            <div>
              <div className="inline-block text-xs font-bold px-2 py-0.5 bg-[#3B7EFF] text-white border border-black mb-2 uppercase tracking-widest" style={{ fontFamily: 'Space Mono' }}>
                Database
              </div>
              <h1 className="text-3xl font-bold text-black">Card Database</h1>
              <p className="text-gray-500 text-sm mt-1">{filtered.length.toLocaleString()} cards found</p>
            </div>
            {/* Search + Controls */}
            <div className="flex flex-col sm:flex-row gap-2">
              <div className="flex items-center border-2 border-black bg-white px-3 py-2 gap-2 brutal-shadow-sm">
                <Search className="w-4 h-4 text-gray-400" />
                <input
                  value={search}
                  onChange={e => { setSearch(e.target.value); setPage(1); }}
                  placeholder="Search cards..."
                  className="outline-none bg-transparent text-sm w-48"
                />
                {search && <button onClick={() => setSearch("")}><X className="w-3.5 h-3.5 text-gray-400 hover:text-black" /></button>}
              </div>
              <button
                onClick={() => setFilterOpen(!filterOpen)}
                className={`flex items-center gap-2 px-3 py-2 border-2 border-black text-sm font-medium brutal-shadow-sm transition-colors ${filterOpen ? "bg-[#FFE234]" : "bg-white hover:bg-[#FFE234]"}`}
              >
                <SlidersHorizontal className="w-4 h-4" />
                Filters {hasFilters && <span className="w-4 h-4 bg-[#FF3B3B] text-white text-[9px] rounded-full flex items-center justify-center font-bold">!</span>}
              </button>
              <div className="flex border-2 border-black brutal-shadow-sm">
                <button
                  onClick={() => setView("grid")}
                  className={`p-2 ${view === "grid" ? "bg-[#FFE234]" : "bg-white hover:bg-gray-50"} border-r border-black`}
                >
                  <Grid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setView("list")}
                  className={`p-2 ${view === "list" ? "bg-[#FFE234]" : "bg-white hover:bg-gray-50"}`}
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Filter Panel */}
          {filterOpen && (
            <div className="mt-4 border-2 border-black bg-[#FFFEF0] p-4 grid grid-cols-2 md:grid-cols-4 gap-4">
              {/* Rarity */}
              <div>
                <div className="text-xs font-bold uppercase tracking-wider mb-2 text-gray-600">Rarity</div>
                <div className="flex flex-wrap gap-1">
                  {RARITIES.map(r => (
                    <button
                      key={r}
                      onClick={() => { setSelectedRarity(r); setPage(1); }}
                      className={`text-xs px-2 py-1 border border-black font-medium transition-colors ${selectedRarity === r ? "bg-[#FFE234]" : "bg-white hover:bg-gray-50"}`}
                    >
                      {r}
                    </button>
                  ))}
                </div>
              </div>
              {/* Format */}
              <div>
                <div className="text-xs font-bold uppercase tracking-wider mb-2 text-gray-600">Format</div>
                <div className="flex flex-wrap gap-1">
                  {FORMATS.map(f => (
                    <button
                      key={f}
                      onClick={() => { setSelectedFormat(f); setPage(1); }}
                      className={`text-xs px-2 py-1 border border-black font-medium transition-colors ${selectedFormat === f ? "bg-[#3B7EFF] text-white" : "bg-white hover:bg-gray-50"}`}
                    >
                      {f === "All Formats" ? "All" : f}
                    </button>
                  ))}
                </div>
              </div>
              {/* Colors */}
              <div>
                <div className="text-xs font-bold uppercase tracking-wider mb-2 text-gray-600">Color</div>
                <div className="flex gap-1.5">
                  {COLORS_LIST.map(c => (
                    <button
                      key={c.key}
                      onClick={() => { toggleColor(c.key); setPage(1); }}
                      title={c.label}
                      className={`w-7 h-7 border-2 font-bold text-xs transition-all ${
                        selectedColors.includes(c.key) ? "border-black brutal-shadow-sm scale-110" : "border-gray-300"
                      }`}
                      style={{ backgroundColor: c.bg, color: c.text || "black" }}
                    >
                      {c.key}
                    </button>
                  ))}
                </div>
              </div>
              {/* Sort */}
              <div>
                <div className="text-xs font-bold uppercase tracking-wider mb-2 text-gray-600">Sort By</div>
                <select
                  value={sortBy}
                  onChange={e => setSortBy(e.target.value)}
                  className="text-xs border-2 border-black px-2 py-1.5 bg-white outline-none w-full"
                  style={{ fontFamily: 'Space Grotesk' }}
                >
                  {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                </select>
              </div>
              {/* Clear */}
              {hasFilters && (
                <div className="col-span-2 md:col-span-4 flex justify-end">
                  <button
                    onClick={() => { setSearch(""); setSelectedRarity("All"); setSelectedFormat("All Formats"); setSelectedColors([]); setPage(1); }}
                    className="text-xs flex items-center gap-1 text-[#FF3B3B] font-bold hover:underline"
                  >
                    <X className="w-3 h-3" /> Clear all filters
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="max-w-screen-xl mx-auto px-4 py-6">
        {/* Grid View */}
        {view === "grid" && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {paginated.map(card => (
              <Link
                key={card.id}
                to={`/cards/${card.id}`}
                className="group border-2 border-black bg-white brutal-shadow hover:-translate-y-0.5 hover:shadow-[6px_6px_0px_0px_#0A0A0A] transition-all"
              >
                <div className="relative aspect-[3/4] overflow-hidden border-b-2 border-black">
                  <img src={card.image} alt={card.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute top-1.5 left-1.5 flex gap-1">
                    <RarityBadge rarity={card.rarity} />
                  </div>
                  <div className="absolute bottom-1.5 left-1.5 flex gap-0.5">
                    {card.colors.map(c => <ColorPip key={c} color={c} />)}
                  </div>
                  <div className={`absolute top-1.5 right-1.5 text-[9px] font-bold px-1 py-0.5 border border-black flex items-center gap-0.5 ${
                    card.priceChange >= 0 ? "bg-[#00C48C] text-white" : "bg-[#FF3B3B] text-white"
                  }`} style={{ fontFamily: 'Space Mono' }}>
                    {card.priceChange >= 0 ? "+" : ""}{card.priceChangePercent.toFixed(1)}%
                  </div>
                </div>
                <div className="p-2">
                  <div className="font-bold text-[11px] text-black leading-tight mb-0.5 truncate">{card.name}</div>
                  <div className="text-[9px] text-gray-500 uppercase tracking-wide mb-1.5 truncate" style={{ fontFamily: 'Space Mono' }}>{card.setCode}</div>
                  <div className="font-bold text-sm text-black" style={{ fontFamily: 'Space Mono' }}>${card.price.toFixed(2)}</div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* List View */}
        {view === "list" && (
          <div className="border-2 border-black bg-white brutal-shadow">
            <div className="grid grid-cols-12 gap-0 border-b-2 border-black bg-[#0A0A0A] text-white px-4 py-2.5">
              <div className="col-span-4 text-xs font-bold uppercase tracking-wider">Card</div>
              <div className="col-span-2 text-xs font-bold uppercase tracking-wider">Set</div>
              <div className="col-span-1 text-xs font-bold uppercase tracking-wider text-center">Rarity</div>
              <div className="col-span-2 text-xs font-bold uppercase tracking-wider text-right">Price</div>
              <div className="col-span-1 text-xs font-bold uppercase tracking-wider text-right">24h</div>
              <div className="col-span-2 text-xs font-bold uppercase tracking-wider text-right">Volume</div>
            </div>
            {paginated.map((card, i) => (
              <Link
                key={card.id}
                to={`/cards/${card.id}`}
                className={`grid grid-cols-12 gap-0 px-4 py-3 items-center hover:bg-[#FFE234]/30 transition-colors border-b border-black/10 last:border-0`}
              >
                <div className="col-span-4 flex items-center gap-3">
                  <img src={card.image} alt={card.name} className="w-8 h-8 object-cover border border-black shrink-0" />
                  <div>
                    <div className="font-bold text-sm text-black">{card.name}</div>
                    <div className="text-[10px] text-gray-500">{card.type}</div>
                  </div>
                </div>
                <div className="col-span-2">
                  <div className="text-xs font-medium text-gray-700">{card.set}</div>
                  <div className="text-[10px] text-gray-400 uppercase" style={{ fontFamily: 'Space Mono' }}>{card.setCode}</div>
                </div>
                <div className="col-span-1 flex justify-center">
                  <RarityBadge rarity={card.rarity} />
                </div>
                <div className="col-span-2 text-right font-bold text-black" style={{ fontFamily: 'Space Mono' }}>
                  ${card.price.toFixed(2)}
                </div>
                <div className="col-span-1 text-right">
                  <span className={`text-xs font-bold flex items-center justify-end gap-0.5 ${
                    card.priceChange >= 0 ? "text-[#00C48C]" : "text-[#FF3B3B]"
                  }`} style={{ fontFamily: 'Space Mono' }}>
                    {card.priceChange >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                    {Math.abs(card.priceChangePercent).toFixed(1)}%
                  </span>
                </div>
                <div className="col-span-2 text-right text-xs text-gray-600" style={{ fontFamily: 'Space Mono' }}>
                  {card.volume.toLocaleString()}
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* Pagination */}
        <div className="flex items-center justify-between mt-6">
          <div className="text-sm text-gray-500">
            Showing {(page - 1) * perPage + 1}–{Math.min(page * perPage, filtered.length)} of {filtered.length}
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className="p-2 border-2 border-black bg-white hover:bg-[#FFE234] disabled:opacity-40 disabled:cursor-not-allowed transition-colors brutal-shadow-sm"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
              const p = Math.max(1, Math.min(page - 2, totalPages - 4)) + i;
              return (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  className={`w-9 h-9 border-2 border-black text-sm font-bold transition-colors ${
                    p === page ? "bg-[#FFE234]" : "bg-white hover:bg-[#FFE234]/50"
                  } brutal-shadow-sm`}
                >
                  {p}
                </button>
              );
            })}
            <button
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="p-2 border-2 border-black bg-white hover:bg-[#FFE234] disabled:opacity-40 disabled:cursor-not-allowed transition-colors brutal-shadow-sm"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
