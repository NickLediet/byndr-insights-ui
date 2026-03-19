import { useState } from "react";
import {
  TrendingUp, TrendingDown, BarChart2, DollarSign, Activity,
  RefreshCw, Download, Settings, Eye, Grip, Plus, X
} from "lucide-react";
import {
  LineChart, Line, AreaChart, Area, BarChart, Bar,
  PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Legend
} from "recharts";
import {
  MOCK_CARDS, TOP_MOVERS, MARKET_STATS, FORMAT_DATA,
  generatePriceHistory
} from "../data/mockData";

// ─── Generate aggregate market data ──────────────────────────────────────────
function generateMarketIndex(days: number) {
  let value = 1000;
  const data = [];
  const now = new Date();
  for (let i = days; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    value += (Math.random() - 0.44) * value * 0.02;
    data.push({
      date: d.toISOString().split("T")[0],
      index: parseFloat(value.toFixed(2)),
      volume: Math.floor(Math.random() * 50000 + 20000),
    });
  }
  return data;
}

const MARKET_INDEX = generateMarketIndex(90);
const CARD_HISTORIES = MOCK_CARDS.slice(0, 4).map(c => ({
  name: c.name.split(",")[0].split(" ").slice(0, 2).join(" "),
  data: generatePriceHistory(c.price, 90),
  color: ["#FFE234", "#3B7EFF", "#FF3B3B", "#00C48C"][MOCK_CARDS.indexOf(c) % 4],
}));

// Combine for multi-line chart
const COMBINED_HISTORY = MARKET_INDEX.map((point, i) => ({
  date: point.date,
  index: point.index,
  volume: point.volume,
  ...Object.fromEntries(CARD_HISTORIES.map(ch => [ch.name, ch.data[i]?.price || 0])),
}));

const RARITY_BREAKDOWN = [
  { name: "Mythic", avgPrice: 42.80, count: 8120, fill: "#FF7F00" },
  { name: "Rare", avgPrice: 8.50, count: 22450, fill: "#C8A200" },
  { name: "Uncommon", avgPrice: 1.20, count: 31200, fill: "#888" },
  { name: "Common", avgPrice: 0.15, count: 36464, fill: "#ccc" },
];

type WidgetType = "market-index" | "top-movers" | "format-pie" | "rarity-bar" | "price-compare" | "volume";
interface Widget { id: string; type: WidgetType; title: string; span: 1 | 2 }

const DEFAULT_WIDGETS: Widget[] = [
  { id: "w1", type: "market-index", title: "Vaultex Market Index", span: 2 },
  { id: "w2", type: "top-movers", title: "Top Movers", span: 1 },
  { id: "w3", type: "format-pie", title: "Format Distribution", span: 1 },
  { id: "w4", type: "price-compare", title: "Multi-Card Price Comparison", span: 2 },
  { id: "w5", type: "rarity-bar", title: "Avg Price by Rarity", span: 1 },
  { id: "w6", type: "volume", title: "Market Volume (90d)", span: 1 },
];

const AVAILABLE_WIDGETS = [
  { type: "market-index" as WidgetType, label: "Market Index" },
  { type: "top-movers" as WidgetType, label: "Top Movers" },
  { type: "format-pie" as WidgetType, label: "Format Distribution" },
  { type: "rarity-bar" as WidgetType, label: "Rarity Breakdown" },
  { type: "price-compare" as WidgetType, label: "Price Comparison" },
  { type: "volume" as WidgetType, label: "Volume Chart" },
];

function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="border-2 border-black bg-white p-2 brutal-shadow-sm text-xs">
      <div className="text-gray-400 mb-1" style={{ fontFamily: 'Space Mono' }}>{label}</div>
      {payload.map((p: any, i: number) => (
        <div key={i} className="flex items-center gap-1.5">
          <div className="w-2 h-2 border border-black" style={{ backgroundColor: p.color }} />
          <span className="font-bold" style={{ fontFamily: 'Space Mono', color: p.color }}>{p.name}: {
            typeof p.value === 'number' && p.value > 100
              ? p.value.toFixed(0)
              : `$${p.value?.toFixed(2)}`
          }</span>
        </div>
      ))}
    </div>
  );
}

// ─── Widget renderers ─────────────────────────────────────────────────────────
function MarketIndexWidget() {
  const start = MARKET_INDEX[0].index;
  const end = MARKET_INDEX[MARKET_INDEX.length - 1].index;
  const change = ((end - start) / start * 100).toFixed(2);
  const positive = parseFloat(change) >= 0;
  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center gap-4 mb-3">
        <div>
          <div className="text-2xl font-bold" style={{ fontFamily: 'Space Mono' }}>{end.toFixed(0)}</div>
          <div className={`text-sm font-bold flex items-center gap-1 ${positive ? "text-[#00C48C]" : "text-[#FF3B3B]"}`}>
            {positive ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
            {positive ? "+" : ""}{change}% (90d)
          </div>
        </div>
        <div className="text-xs text-gray-400 border-l border-gray-200 pl-4">
          <div>Measures aggregate price performance</div>
          <div>of the top 500 MTG cards by volume.</div>
        </div>
      </div>
      <div className="flex-1" style={{ minHeight: 160 }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={MARKET_INDEX.filter((_, i) => i % 3 === 0)}>
            <defs>
              <linearGradient id="indexGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={positive ? "#00C48C" : "#FF3B3B"} stopOpacity={0.3} />
                <stop offset="95%" stopColor={positive ? "#00C48C" : "#FF3B3B"} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="2 4" stroke="#E5E5E5" />
            <XAxis dataKey="date" tick={{ fontSize: 9, fontFamily: 'Space Mono' }} tickLine={false} axisLine={false} interval={14} />
            <YAxis tick={{ fontSize: 9, fontFamily: 'Space Mono' }} tickLine={false} axisLine={false} width={45} />
            <Tooltip content={<CustomTooltip />} />
            <Area type="monotone" dataKey="index" stroke={positive ? "#00C48C" : "#FF3B3B"} strokeWidth={2} fill="url(#indexGrad)" dot={false} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

function TopMoversWidget() {
  return (
    <div className="space-y-2">
      {TOP_MOVERS.slice(0, 6).map((m, i) => (
        <div key={i} className="flex items-center justify-between border-b border-black/10 pb-1.5 last:border-0">
          <div>
            <div className="text-xs font-bold text-black">{m.name}</div>
            <div className="text-[10px] text-gray-400 uppercase" style={{ fontFamily: 'Space Mono' }}>{m.set}</div>
          </div>
          <div className="text-right">
            <div className="text-xs font-bold" style={{ fontFamily: 'Space Mono' }}>${m.price.toFixed(2)}</div>
            <div className={`text-[10px] font-bold flex items-center gap-0.5 justify-end ${m.positive ? "text-[#00C48C]" : "text-[#FF3B3B]"}`}>
              {m.positive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
              {m.positive ? "+" : ""}{m.change}%
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function FormatPieWidget() {
  return (
    <div className="h-full flex flex-col">
      <div className="flex-1" style={{ minHeight: 160 }}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie data={FORMAT_DATA} cx="50%" cy="50%" outerRadius={70} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`} labelLine={{ stroke: "#0A0A0A" }} fontSize={10}>
              {FORMAT_DATA.map((entry, i) => (
                <Cell key={i} fill={entry.fill} stroke="#0A0A0A" strokeWidth={1.5} />
              ))}
            </Pie>
            <Tooltip formatter={(value: number) => [`${value}%`, "Share"]} />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

function RarityBarWidget() {
  return (
    <div className="h-full" style={{ minHeight: 160 }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={RARITY_BREAKDOWN} layout="vertical" margin={{ left: 8, right: 8 }}>
          <CartesianGrid strokeDasharray="2 4" stroke="#E5E5E5" horizontal={false} />
          <XAxis type="number" tick={{ fontSize: 9, fontFamily: 'Space Mono' }} tickLine={false} axisLine={false} tickFormatter={v => `$${v}`} />
          <YAxis type="category" dataKey="name" tick={{ fontSize: 10, fontFamily: 'Space Grotesk' }} width={60} axisLine={false} tickLine={false} />
          <Tooltip formatter={(v: number) => [`$${v.toFixed(2)}`, "Avg Price"]} />
          <Bar dataKey="avgPrice" radius={0} stroke="#0A0A0A" strokeWidth={1}>
            {RARITY_BREAKDOWN.map((r, i) => <Cell key={i} fill={r.fill} />)}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

function PriceCompareWidget() {
  return (
    <div className="h-full flex flex-col">
      <div className="flex flex-wrap gap-3 mb-2">
        {CARD_HISTORIES.map(ch => (
          <div key={ch.name} className="flex items-center gap-1.5 text-xs">
            <div className="w-3 h-3 border border-black" style={{ backgroundColor: ch.color }} />
            <span className="font-medium">{ch.name}</span>
          </div>
        ))}
      </div>
      <div className="flex-1" style={{ minHeight: 160 }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={COMBINED_HISTORY.filter((_, i) => i % 5 === 0)}>
            <CartesianGrid strokeDasharray="2 4" stroke="#E5E5E5" />
            <XAxis dataKey="date" tick={{ fontSize: 9, fontFamily: 'Space Mono' }} tickLine={false} axisLine={false} interval={8} />
            <YAxis tick={{ fontSize: 9, fontFamily: 'Space Mono' }} tickLine={false} axisLine={false} width={45} tickFormatter={v => `$${v}`} />
            <Tooltip content={<CustomTooltip />} />
            {CARD_HISTORIES.map(ch => (
              <Line key={ch.name} type="monotone" dataKey={ch.name} stroke={ch.color} strokeWidth={2} dot={false} />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

function VolumeWidget() {
  return (
    <div className="h-full" style={{ minHeight: 160 }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={MARKET_INDEX.filter((_, i) => i % 5 === 0)} margin={{ left: 0, right: 0 }}>
          <CartesianGrid strokeDasharray="2 4" stroke="#E5E5E5" vertical={false} />
          <XAxis dataKey="date" tick={{ fontSize: 9, fontFamily: 'Space Mono' }} tickLine={false} axisLine={false} interval={5} />
          <YAxis tick={{ fontSize: 9, fontFamily: 'Space Mono' }} tickLine={false} axisLine={false} width={50} tickFormatter={v => `${(v / 1000).toFixed(0)}K`} />
          <Tooltip formatter={(v: number) => [v.toLocaleString(), "Volume"]} />
          <Bar dataKey="volume" fill="#3B7EFF" stroke="#0A0A0A" strokeWidth={1} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

function renderWidget(type: WidgetType) {
  switch (type) {
    case "market-index": return <MarketIndexWidget />;
    case "top-movers": return <TopMoversWidget />;
    case "format-pie": return <FormatPieWidget />;
    case "rarity-bar": return <RarityBarWidget />;
    case "price-compare": return <PriceCompareWidget />;
    case "volume": return <VolumeWidget />;
  }
}

export function AnalyticsDashboard() {
  const [widgets, setWidgets] = useState<Widget[]>(DEFAULT_WIDGETS);
  const [addOpen, setAddOpen] = useState(false);
  const [lastUpdated] = useState(new Date().toLocaleTimeString());

  const removeWidget = (id: string) => setWidgets(ws => ws.filter(w => w.id !== id));
  const addWidget = (type: WidgetType) => {
    const def = AVAILABLE_WIDGETS.find(w => w.type === type);
    if (!def) return;
    setWidgets(ws => [...ws, { id: `w${Date.now()}`, type, title: def.label, span: 1 }]);
    setAddOpen(false);
  };

  return (
    <div className="bg-[#FFFEF0] min-h-screen">
      {/* Header */}
      <div className="border-b-2 border-black bg-white sticky top-14 z-30">
        <div className="max-w-screen-xl mx-auto px-4 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="inline-block text-xs font-bold px-2 py-0.5 bg-[#FF3B3B] text-white border border-black mb-1 uppercase tracking-widest" style={{ fontFamily: 'Space Mono' }}>
              Live Data
            </div>
            <h1 className="text-2xl font-bold text-black">Analytics Dashboard</h1>
          </div>
          <div className="flex items-center gap-2">
            <div className="text-xs text-gray-400 flex items-center gap-1" style={{ fontFamily: 'Space Mono' }}>
              <Activity className="w-3 h-3 text-[#00C48C]" />
              Updated {lastUpdated}
            </div>
            <button className="flex items-center gap-1.5 px-3 py-2 border-2 border-black bg-white text-sm font-medium hover:bg-[#FFFEF0] brutal-shadow-sm">
              <RefreshCw className="w-3.5 h-3.5" /> Refresh
            </button>
            <button className="flex items-center gap-1.5 px-3 py-2 border-2 border-black bg-white text-sm font-medium hover:bg-[#FFFEF0] brutal-shadow-sm">
              <Download className="w-3.5 h-3.5" /> Export
            </button>
            <button
              onClick={() => setAddOpen(!addOpen)}
              className="flex items-center gap-1.5 px-3 py-2 border-2 border-black bg-[#FFE234] text-sm font-bold hover:bg-[#f5d800] brutal-shadow-sm"
            >
              <Plus className="w-3.5 h-3.5" /> Add Widget
            </button>
          </div>
        </div>

        {/* Add Widget Panel */}
        {addOpen && (
          <div className="border-t-2 border-black bg-[#FFFEF0] px-4 py-3">
            <div className="flex flex-wrap gap-2">
              <span className="text-xs font-bold text-gray-500 self-center mr-2 uppercase">Add:</span>
              {AVAILABLE_WIDGETS.map(w => (
                <button
                  key={w.type}
                  onClick={() => addWidget(w.type)}
                  className="text-xs px-3 py-1.5 border-2 border-black bg-white hover:bg-[#FFE234] font-medium brutal-shadow-sm transition-colors"
                >
                  + {w.label}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Summary KPIs */}
      <div className="max-w-screen-xl mx-auto px-4 pt-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {[
            { label: "MTG Market Cap", value: "$2.4B", change: "+6.3%", positive: true, icon: DollarSign, color: "#FFE234" },
            { label: "Top Gainer (24h)", value: "Mox Ruby", change: "+23.1%", positive: true, icon: TrendingUp, color: "#00C48C" },
            { label: "Top Loser (24h)", value: "Tamiyo", change: "-11.2%", positive: false, icon: TrendingDown, color: "#FF3B3B" },
            { label: "Volume (24h)", value: "847K", change: "+1.4%", positive: true, icon: BarChart2, color: "#3B7EFF" },
          ].map((kpi, i) => (
            <div key={i} className="border-2 border-black bg-white brutal-shadow p-4">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs text-gray-500 font-medium uppercase tracking-wide">{kpi.label}</span>
                <div className="w-8 h-8 border-2 border-black flex items-center justify-center" style={{ backgroundColor: kpi.color }}>
                  <kpi.icon className="w-4 h-4 text-black" />
                </div>
              </div>
              <div className="text-xl font-bold text-black">{kpi.value}</div>
              <div className={`text-xs font-bold mt-0.5 ${kpi.positive ? "text-[#00C48C]" : "text-[#FF3B3B]"}`} style={{ fontFamily: 'Space Mono' }}>
                {kpi.change} vs yesterday
              </div>
            </div>
          ))}
        </div>

        {/* Composable Widget Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pb-12">
          {widgets.map(widget => (
            <div
              key={widget.id}
              className={`border-2 border-black bg-white brutal-shadow overflow-hidden ${widget.span === 2 ? "md:col-span-2" : ""}`}
            >
              {/* Widget Header */}
              <div className="flex items-center justify-between border-b-2 border-black px-4 py-2.5 bg-[#0A0A0A]">
                <div className="flex items-center gap-2">
                  <Grip className="w-3.5 h-3.5 text-gray-500 cursor-grab" />
                  <span className="text-xs font-bold text-white uppercase tracking-wide">{widget.title}</span>
                </div>
                <div className="flex gap-1">
                  <button className="p-1 text-gray-500 hover:text-white transition-colors">
                    <Eye className="w-3.5 h-3.5" />
                  </button>
                  <button className="p-1 text-gray-500 hover:text-white transition-colors">
                    <Settings className="w-3.5 h-3.5" />
                  </button>
                  <button onClick={() => removeWidget(widget.id)} className="p-1 text-gray-500 hover:text-[#FF3B3B] transition-colors">
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
              {/* Widget Content */}
              <div className="p-4" style={{ minHeight: 220 }}>
                {renderWidget(widget.type)}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
