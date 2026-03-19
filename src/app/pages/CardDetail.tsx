import { useState } from "react";
import { Link, useParams } from "react-router";
import {
  TrendingUp, TrendingDown, ArrowLeft, Star, Share2, Bell,
  ShoppingCart, ExternalLink, Info, ChevronDown, BookOpen,
  Clock, BarChart2, Layers
} from "lucide-react";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Area, AreaChart, ReferenceLine
} from "recharts";
import { MOCK_CARDS, generatePriceHistory } from "../data/mockData";

const TIME_RANGES = ["1W", "1M", "3M", "6M", "1Y", "ALL"];

const PRINTINGS = [
  { set: "Worldwake", setCode: "WWK", year: 2010, price: 89.50, foilPrice: 380 },
  { set: "From the Vault: Twenty", setCode: "V13", year: 2013, price: 95.00, foilPrice: null },
  { set: "Vintage Masters", setCode: "VMA", year: 2014, price: 8.50, foilPrice: 45.00 },
  { set: "Judge Gift Cards", setCode: "J18", year: 2018, price: 250.00, foilPrice: 250.00 },
];

function CustomTooltip({ active, payload, label }: any) {
  if (active && payload && payload.length) {
    return (
      <div className="border-2 border-black bg-white p-3 brutal-shadow-sm">
        <div className="text-xs text-gray-500 mb-1" style={{ fontFamily: 'Space Mono' }}>{label}</div>
        <div className="font-bold text-black" style={{ fontFamily: 'Space Mono' }}>
          ${payload[0]?.value?.toFixed(2)}
        </div>
        {payload[1] && (
          <div className="text-xs text-[#3B7EFF]" style={{ fontFamily: 'Space Mono' }}>
            Foil: ${payload[1]?.value?.toFixed(2)}
          </div>
        )}
        <div className="text-xs text-gray-400 mt-1">Vol: {payload[0]?.payload?.volume}</div>
      </div>
    );
  }
  return null;
}

export function CardDetail() {
  const { id } = useParams();
  const card = MOCK_CARDS.find(c => c.id === id) || MOCK_CARDS[0];
  const [timeRange, setTimeRange] = useState("3M");
  const [showFoil, setShowFoil] = useState(false);
  const [activeTab, setActiveTab] = useState<"overview" | "printings" | "rulings" | "legality">("overview");

  const days = { "1W": 7, "1M": 30, "3M": 90, "6M": 180, "1Y": 365, "ALL": 730 }[timeRange] || 90;
  const priceHistory = generatePriceHistory(card.price, days);

  const firstPrice = priceHistory[0]?.price || card.price;
  const lastPrice = priceHistory[priceHistory.length - 1]?.price || card.price;
  const rangeChange = ((lastPrice - firstPrice) / firstPrice * 100).toFixed(1);
  const rangePositive = parseFloat(rangeChange) >= 0;

  // Format chart data to show only every Nth label
  const chartData = priceHistory.filter((_, i) => {
    if (days <= 7) return true;
    if (days <= 30) return i % 3 === 0;
    if (days <= 90) return i % 7 === 0;
    return i % 14 === 0;
  });

  const MANA_COLORS: Record<string, string> = {
    W: "#F9F6D2", U: "#3B7EFF", B: "#333", R: "#FF3B3B", G: "#00894D"
  };

  const RULINGS = [
    { date: "2010-03-01", text: "The first ability looks at the top card of the target player's library. You may then put that card on the bottom of that player's library." },
    { date: "2010-03-01", text: "The 0 ability lets you draw three cards and then put two cards from your hand on top of your library in any order. You reveal the cards you put back." },
    { date: "2013-07-01", text: "When resolving the −12 loyalty ability, the affected player's library is exiled, then that player shuffles their hand into their library." },
  ];

  const LEGALITY = [
    { format: "Standard", status: "Not Legal" },
    { format: "Pioneer", status: "Not Legal" },
    { format: "Modern", status: "Not Legal" },
    { format: "Legacy", status: "Legal" },
    { format: "Vintage", status: "Legal" },
    { format: "Commander", status: "Legal" },
    { format: "Pauper", status: "Not Legal" },
  ];

  return (
    <div className="bg-[#FFFEF0] min-h-screen">
      {/* Breadcrumb */}
      <div className="border-b-2 border-black bg-white">
        <div className="max-w-screen-xl mx-auto px-4 py-3 flex items-center gap-2 text-sm">
          <Link to="/cards" className="flex items-center gap-1 text-gray-500 hover:text-black transition-colors">
            <ArrowLeft className="w-4 h-4" /> Cards
          </Link>
          <span className="text-gray-300">/</span>
          <span className="text-gray-500">{card.set}</span>
          <span className="text-gray-300">/</span>
          <span className="font-bold text-black">{card.name}</span>
        </div>
      </div>

      <div className="max-w-screen-xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* ── LEFT: Card Image + Quick Info ─────────── */}
          <div className="lg:col-span-1 space-y-4">
            {/* Card Image */}
            <div className="border-2 border-black bg-white brutal-shadow-lg overflow-hidden">
              <img src={card.image} alt={card.name} className="w-full aspect-[3/4] object-cover" />
              <div className="p-4 border-t-2 border-black">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-gray-500 font-medium">{card.type}{card.subtype ? ` — ${card.subtype}` : ""}</span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 border border-black uppercase ${
                    card.rarity === 'Mythic' ? 'bg-orange-500 text-white' :
                    card.rarity === 'Rare' ? 'bg-yellow-600 text-white' :
                    card.rarity === 'Uncommon' ? 'bg-gray-400 text-white' : 'bg-white'
                  }`}>{card.rarity}</span>
                </div>
                <div className="text-xs text-gray-400 mb-3" style={{ fontFamily: 'Space Mono' }}>
                  {card.set} · #{card.id.replace('c0', '')} · Art by {card.artist}
                </div>
                {/* Mana cost */}
                <div className="flex items-center gap-1 mb-3">
                  <span className="text-xs text-gray-500 mr-1">Mana Cost:</span>
                  {card.colors.map((c, i) => (
                    <span key={i} className="w-5 h-5 rounded-full border-2 border-black flex items-center justify-center text-[9px] font-bold"
                      style={{ backgroundColor: MANA_COLORS[c] || "#ccc", color: c === "B" ? "white" : "black" }}>
                      {c}
                    </span>
                  ))}
                  {card.colors.length === 0 && <span className="text-xs text-gray-400">Colorless</span>}
                </div>
                {/* Stats */}
                {card.power && (
                  <div className="inline-flex items-center gap-1 border-2 border-black px-2 py-1 text-sm font-bold bg-[#FFFEF0]">
                    P/T: {card.power}/{card.toughness}
                  </div>
                )}
                {/* Flavor text */}
                {card.flavorText && (
                  <p className="mt-3 text-xs text-gray-500 italic border-l-2 border-[#FFE234] pl-2 leading-relaxed">
                    {card.flavorText}
                  </p>
                )}
              </div>
            </div>

            {/* Market actions */}
            <div className="border-2 border-black bg-white brutal-shadow p-4 space-y-2">
              <button className="w-full flex items-center justify-center gap-2 py-2.5 bg-[#FFE234] border-2 border-black font-bold text-sm hover:bg-[#f5d800] transition-colors brutal-shadow-sm">
                <ShoppingCart className="w-4 h-4" /> Add to Watchlist
              </button>
              <div className="grid grid-cols-2 gap-2">
                <button className="flex items-center justify-center gap-1.5 py-2 border-2 border-black bg-white text-sm font-medium hover:bg-[#FFFEF0] transition-colors">
                  <Bell className="w-3.5 h-3.5" /> Alert
                </button>
                <button className="flex items-center justify-center gap-1.5 py-2 border-2 border-black bg-white text-sm font-medium hover:bg-[#FFFEF0] transition-colors">
                  <Share2 className="w-3.5 h-3.5" /> Share
                </button>
              </div>
              <a href="#" className="flex items-center justify-center gap-1.5 py-2 border-2 border-black bg-[#0A0A0A] text-white text-sm font-medium hover:bg-gray-800 transition-colors">
                <ExternalLink className="w-3.5 h-3.5" /> View on TCGPlayer
              </a>
            </div>
          </div>

          {/* ── RIGHT: Data Panel ─────────────────────── */}
          <div className="lg:col-span-2 space-y-4">
            {/* Name + Price */}
            <div className="border-2 border-black bg-white brutal-shadow p-6">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                <div>
                  <h1 className="text-2xl font-bold text-black leading-tight">{card.name}</h1>
                  <div className="text-sm text-gray-500 mt-0.5">{card.set} — {card.setCode}</div>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-black" style={{ fontFamily: 'Space Mono' }}>
                    ${card.price.toFixed(2)}
                  </div>
                  <div className={`flex items-center gap-1 justify-end text-sm font-bold mt-0.5 ${
                    card.priceChange >= 0 ? "text-[#00C48C]" : "text-[#FF3B3B]"
                  }`}>
                    {card.priceChange >= 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                    {card.priceChange >= 0 ? "+" : ""}{card.priceChange.toFixed(2)} ({card.priceChangePercent.toFixed(1)}%) 30d
                  </div>
                  <div className="text-xs text-gray-400 mt-1" style={{ fontFamily: 'Space Mono' }}>
                    Foil: ${card.foilPrice.toFixed(2)}
                  </div>
                </div>
              </div>

              {/* Mini stats row */}
              <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-0 border-2 border-black">
                {[
                  { label: "7D High", value: `$${card.weekHigh.toFixed(2)}` },
                  { label: "7D Low", value: `$${card.weekLow.toFixed(2)}` },
                  { label: "ATH", value: `$${card.allTimeHigh.toFixed(2)}` },
                  { label: "Volume", value: card.volume.toLocaleString() },
                ].map((stat, i) => (
                  <div key={i} className={`px-3 py-2 ${i < 3 ? "border-r border-black/20" : ""}`}>
                    <div className="text-[10px] text-gray-400 uppercase tracking-wider">{stat.label}</div>
                    <div className="font-bold text-sm" style={{ fontFamily: 'Space Mono' }}>{stat.value}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Price Chart */}
            <div className="border-2 border-black bg-white brutal-shadow p-4">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <h3 className="font-bold text-black">Price History</h3>
                  <label className="flex items-center gap-1.5 text-xs cursor-pointer">
                    <input
                      type="checkbox"
                      checked={showFoil}
                      onChange={e => setShowFoil(e.target.checked)}
                      className="w-3 h-3 border border-black"
                    />
                    <span className="text-[#3B7EFF] font-medium">Show Foil</span>
                  </label>
                </div>
                <div className="flex gap-1">
                  {TIME_RANGES.map(r => (
                    <button
                      key={r}
                      onClick={() => setTimeRange(r)}
                      className={`text-[11px] px-2 py-1 font-bold border border-black transition-colors ${
                        timeRange === r ? "bg-[#FFE234]" : "bg-white hover:bg-gray-50"
                      }`}
                      style={{ fontFamily: 'Space Mono' }}
                    >
                      {r}
                    </button>
                  ))}
                </div>
              </div>

              {/* Range Summary */}
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xs text-gray-400">{timeRange} Return:</span>
                <span className={`text-xs font-bold flex items-center gap-0.5 ${rangePositive ? "text-[#00C48C]" : "text-[#FF3B3B]"}`} style={{ fontFamily: 'Space Mono' }}>
                  {rangePositive ? "+" : ""}{rangeChange}%
                </span>
                <span className="text-xs text-gray-400">(${firstPrice.toFixed(2)} → ${lastPrice.toFixed(2)})</span>
              </div>

              <ResponsiveContainer width="100%" height={240}>
                <AreaChart data={chartData} margin={{ top: 5, right: 5, bottom: 5, left: 0 }}>
                  <defs>
                    <linearGradient id="priceGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={rangePositive ? "#00C48C" : "#FF3B3B"} stopOpacity={0.3} />
                      <stop offset="95%" stopColor={rangePositive ? "#00C48C" : "#FF3B3B"} stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="foilGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3B7EFF" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="#3B7EFF" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E5E5" />
                  <XAxis dataKey="date" tick={{ fontSize: 10, fontFamily: 'Space Mono' }} tickLine={false} axisLine={false} />
                  <YAxis tick={{ fontSize: 10, fontFamily: 'Space Mono' }} tickLine={false} axisLine={false} tickFormatter={v => `$${v}`} width={50} />
                  <Tooltip content={<CustomTooltip />} />
                  <Area type="monotone" dataKey="price" stroke={rangePositive ? "#00C48C" : "#FF3B3B"} strokeWidth={2} fill="url(#priceGrad)" dot={false} />
                  {showFoil && (
                    <Area type="monotone" dataKey="foilPrice" stroke="#3B7EFF" strokeWidth={2} fill="url(#foilGrad)" dot={false} strokeDasharray="4 2" />
                  )}
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* Tabs: Card Info */}
            <div className="border-2 border-black bg-white brutal-shadow">
              <div className="flex border-b-2 border-black overflow-x-auto">
                {(["overview", "printings", "rulings", "legality"] as const).map(tab => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`flex-1 min-w-fit px-4 py-3 text-xs font-bold uppercase tracking-wider border-r border-black last:border-0 transition-colors ${
                      activeTab === tab ? "bg-[#FFE234]" : "hover:bg-[#FFFEF0]"
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              <div className="p-4">
                {/* Overview */}
                {activeTab === "overview" && (
                  <div className="space-y-4">
                    <div>
                      <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Card Text</div>
                      <div className="text-sm text-gray-700 leading-relaxed border-l-2 border-[#FFE234] pl-3 whitespace-pre-line">
                        {card.text}
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Formats</div>
                        <div className="flex flex-wrap gap-1">
                          {card.formats.map(f => (
                            <span key={f} className="text-xs px-2 py-0.5 bg-[#3B7EFF] text-white border border-black font-medium">{f}</span>
                          ))}
                        </div>
                      </div>
                      <div>
                        <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Artist</div>
                        <div className="text-sm font-medium">{card.artist}</div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Printings */}
                {activeTab === "printings" && (
                  <div className="space-y-2">
                    {PRINTINGS.map((p, i) => (
                      <div key={i} className="flex items-center justify-between border-b border-black/10 pb-2 last:border-0">
                        <div>
                          <div className="text-sm font-bold">{p.set}</div>
                          <div className="text-xs text-gray-400 uppercase" style={{ fontFamily: 'Space Mono' }}>{p.setCode} · {p.year}</div>
                        </div>
                        <div className="text-right">
                          <div className="font-bold text-sm" style={{ fontFamily: 'Space Mono' }}>${p.price.toFixed(2)}</div>
                          {p.foilPrice && (
                            <div className="text-xs text-[#3B7EFF]" style={{ fontFamily: 'Space Mono' }}>Foil: ${p.foilPrice.toFixed(2)}</div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Rulings */}
                {activeTab === "rulings" && (
                  <div className="space-y-3">
                    {RULINGS.map((r, i) => (
                      <div key={i} className="border-l-2 border-[#3B7EFF] pl-3">
                        <div className="text-xs text-gray-400 mb-1" style={{ fontFamily: 'Space Mono' }}>{r.date}</div>
                        <div className="text-sm text-gray-700 leading-relaxed">{r.text}</div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Legality */}
                {activeTab === "legality" && (
                  <div className="grid grid-cols-2 gap-2">
                    {LEGALITY.map((l, i) => (
                      <div key={i} className="flex items-center justify-between border border-black/10 px-3 py-2">
                        <span className="text-sm text-gray-700">{l.format}</span>
                        <span className={`text-xs font-bold px-2 py-0.5 border border-black ${
                          l.status === "Legal" ? "bg-[#00C48C] text-white" : "bg-gray-100 text-gray-500"
                        }`}>
                          {l.status}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Related Cards */}
        <div className="mt-8">
          <h3 className="text-lg font-bold text-black mb-4">Related Cards</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
            {MOCK_CARDS.slice(0, 8).map(c => (
              <Link
                key={c.id}
                to={`/cards/${c.id}`}
                className="border-2 border-black bg-white brutal-shadow hover:-translate-y-0.5 transition-all group"
              >
                <img src={c.image} alt={c.name} className="w-full aspect-[3/4] object-cover border-b border-black group-hover:opacity-90" />
                <div className="p-1.5">
                  <div className="text-[9px] font-bold truncate">{c.name}</div>
                  <div className="text-[9px] font-mono text-gray-600">${c.price.toFixed(2)}</div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
