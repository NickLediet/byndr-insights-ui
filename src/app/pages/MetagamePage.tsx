import { useState } from "react";
import { Link } from "react-router";
import {
  TrendingUp, TrendingDown, Trophy, Target, Zap,
  Filter, ChevronRight, Swords, Shield, BarChart2, Users
} from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis,
  Radar, Cell, PieChart, Pie, Legend
} from "recharts";
import { DECK_ARCHETYPES, FORMAT_DATA } from "../data/mockData";

const FORMATS = ["Modern", "Legacy", "Pioneer", "Standard", "Vintage"];

const COLOR_SYMBOLS: Record<string, { bg: string; text: string }> = {
  W: { bg: "#F9F6D2", text: "black" },
  U: { bg: "#3B7EFF", text: "white" },
  B: { bg: "#333", text: "white" },
  R: { bg: "#FF3B3B", text: "white" },
  G: { bg: "#00894D", text: "white" },
};

const RADAR_DATA = [
  { subject: "Aggro", Modern: 72, Legacy: 55 },
  { subject: "Control", Modern: 65, Legacy: 78 },
  { subject: "Combo", Modern: 60, Legacy: 82 },
  { subject: "Midrange", Modern: 85, Legacy: 58 },
  { subject: "Tempo", Modern: 70, Legacy: 88 },
  { subject: "Prison", Modern: 40, Legacy: 62 },
];

const TOURNAMENT_DATA = [
  { event: "MOCS S1", date: "Mar 1", players: 412, winner: "Izzet Murktide", format: "Modern" },
  { event: "SCG Open", date: "Mar 5", players: 289, winner: "UR Delver", format: "Legacy" },
  { event: "Regional Champ", date: "Mar 8", players: 1204, winner: "Hammer Time", format: "Modern" },
  { event: "MTGO Vintage Champ", date: "Mar 10", players: 78, winner: "Doomsday", format: "Vintage" },
  { event: "SCG Classic", date: "Mar 14", players: 156, winner: "Yawgmoth Combo", format: "Modern" },
  { event: "NRG Series", date: "Mar 17", players: 340, winner: "Storm", format: "Legacy" },
];

const TOP_CARDS_MODERN = [
  { name: "Ragavan, Nimble Pilferer", copies: 3.8, decks: 82, avgPrice: 45 },
  { name: "Wrenn and Six", copies: 3.9, decks: 71, avgPrice: 55 },
  { name: "Solitude", copies: 3.2, decks: 65, avgPrice: 38 },
  { name: "Grief", copies: 3.6, decks: 58, avgPrice: 42 },
  { name: "Subtlety", copies: 3.1, decks: 54, avgPrice: 22 },
  { name: "Murktide Regent", copies: 3.7, decks: 48, avgPrice: 28 },
  { name: "Urza's Saga", copies: 3.8, decks: 45, avgPrice: 35 },
  { name: "Endurance", copies: 3.4, decks: 42, avgPrice: 32 },
];

function TrendArrow({ trend }: { trend: "up" | "down" | "stable" }) {
  if (trend === "up") return <TrendingUp className="w-3.5 h-3.5 text-[#00C48C]" />;
  if (trend === "down") return <TrendingDown className="w-3.5 h-3.5 text-[#FF3B3B]" />;
  return <span className="w-3.5 h-3.5 text-gray-400 text-sm leading-none flex items-center">—</span>;
}

function ColorPips({ colors }: { colors: string[] }) {
  return (
    <div className="flex gap-0.5">
      {colors.map(c => (
        <span
          key={c}
          className="w-4 h-4 rounded-full border border-black text-[8px] flex items-center justify-center font-bold"
          style={{ backgroundColor: COLOR_SYMBOLS[c]?.bg || "#ccc", color: COLOR_SYMBOLS[c]?.text || "black" }}
        >
          {c}
        </span>
      ))}
    </div>
  );
}

function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="border-2 border-black bg-white p-2 brutal-shadow-sm text-xs">
      <div className="font-bold mb-1">{label}</div>
      {payload.map((p: any, i: number) => (
        <div key={i} style={{ color: p.color }}>{p.name}: {typeof p.value === 'number' ? `${p.value.toFixed(1)}%` : p.value}</div>
      ))}
    </div>
  );
}

export function MetagamePage() {
  const [activeFormat, setActiveFormat] = useState("Modern");
  const [activeTab, setActiveTab] = useState<"decks" | "cards" | "tournaments">("decks");

  const formatDecks = DECK_ARCHETYPES.filter(d => d.format === activeFormat || activeFormat === "All");

  return (
    <div className="bg-[#FFFEF0] min-h-screen">
      {/* Header */}
      <div className="border-b-2 border-black bg-white">
        <div className="max-w-screen-xl mx-auto px-4 py-5">
          <div className="flex flex-col sm:flex-row sm:items-end gap-4 justify-between">
            <div>
              <div className="inline-block text-xs font-bold px-2 py-0.5 bg-[#FF3B3B] text-white border border-black mb-1 uppercase tracking-widest" style={{ fontFamily: 'Space Mono' }}>
                Metagame
              </div>
              <h1 className="text-2xl font-bold text-black">Metagame Intelligence</h1>
              <p className="text-gray-500 text-sm">Tournament data, archetype breakdowns & win rates</p>
            </div>
            <div className="text-xs text-gray-400 flex items-center gap-1" style={{ fontFamily: 'Space Mono' }}>
              <span className="w-2 h-2 bg-[#00C48C] rounded-full" />
              Last updated: March 19, 2026
            </div>
          </div>

          {/* Format Tabs */}
          <div className="flex gap-0 mt-5 border-b border-black/10 -mb-px">
            {FORMATS.map(f => (
              <button
                key={f}
                onClick={() => setActiveFormat(f)}
                className={`px-4 py-2 text-sm font-bold border-2 border-b-0 -mb-px transition-colors ${
                  activeFormat === f
                    ? "border-black bg-[#FFE234] text-black"
                    : "border-transparent text-gray-500 hover:text-black"
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-screen-xl mx-auto px-4 py-6">
        {/* KPI Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {[
            { label: "Tracked Decks", value: `${formatDecks.length}`, sub: `in ${activeFormat}`, icon: Swords, color: "#FF3B3B" },
            { label: "Top Win Rate", value: `${Math.max(...formatDecks.map(d => d.winRate)).toFixed(1)}%`, sub: "Yawgmoth Combo", icon: Trophy, color: "#FFE234" },
            { label: "Avg Deck Cost", value: `$${(formatDecks.reduce((s, d) => s + d.avgPrice, 0) / (formatDecks.length || 1)).toFixed(0)}`, sub: "USD", icon: Target, color: "#00C48C" },
            { label: "Data Sources", value: "12", sub: "Tournaments · MTGO", icon: BarChart2, color: "#3B7EFF" },
          ].map((kpi, i) => (
            <div key={i} className="border-2 border-black bg-white brutal-shadow p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-gray-500 font-medium uppercase tracking-wide">{kpi.label}</span>
                <div className="w-7 h-7 border-2 border-black flex items-center justify-center" style={{ backgroundColor: kpi.color }}>
                  <kpi.icon className="w-3.5 h-3.5 text-black" />
                </div>
              </div>
              <div className="text-xl font-bold text-black">{kpi.value}</div>
              <div className="text-xs text-gray-400 mt-0.5">{kpi.sub}</div>
            </div>
          ))}
        </div>

        {/* Main content + Chart sidebar */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* LEFT: Main content */}
          <div className="lg:col-span-2 space-y-4">
            {/* Tabs */}
            <div className="flex border-2 border-black bg-white brutal-shadow overflow-hidden">
              {(["decks", "cards", "tournaments"] as const).map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`flex-1 py-2.5 text-xs font-bold uppercase tracking-wider border-r border-black last:border-0 transition-colors ${
                    activeTab === tab ? "bg-[#FFE234]" : "hover:bg-[#FFFEF0]"
                  }`}
                >
                  {tab === "decks" ? "Archetypes" : tab === "cards" ? "Top Cards" : "Tournaments"}
                </button>
              ))}
            </div>

            {/* Archetypes */}
            {activeTab === "decks" && (
              <div className="border-2 border-black bg-white brutal-shadow overflow-hidden">
                {/* Table header */}
                <div className="grid grid-cols-12 border-b-2 border-black bg-[#0A0A0A] px-4 py-2.5">
                  <div className="col-span-4 text-[10px] font-bold text-white uppercase tracking-wider">Deck</div>
                  <div className="col-span-2 text-[10px] font-bold text-white uppercase tracking-wider">Colors</div>
                  <div className="col-span-2 text-[10px] font-bold text-white uppercase tracking-wider text-right">Meta %</div>
                  <div className="col-span-2 text-[10px] font-bold text-white uppercase tracking-wider text-right">Win Rate</div>
                  <div className="col-span-1 text-[10px] font-bold text-white uppercase tracking-wider text-right">Cost</div>
                  <div className="col-span-1 text-[10px] font-bold text-white uppercase tracking-wider text-center">Trend</div>
                </div>

                {formatDecks.map((deck, i) => (
                  <div
                    key={deck.id}
                    className="grid grid-cols-12 px-4 py-3.5 border-b border-black/10 last:border-0 hover:bg-[#FFFEF0] transition-colors group cursor-pointer"
                  >
                    <div className="col-span-4">
                      <div className="font-bold text-sm text-black group-hover:text-[#3B7EFF] transition-colors">{deck.name}</div>
                      <div className="text-[10px] text-gray-400 uppercase tracking-wide mt-0.5" style={{ fontFamily: 'Space Mono' }}>{deck.format}</div>
                    </div>
                    <div className="col-span-2 flex items-center">
                      <ColorPips colors={deck.colors} />
                    </div>
                    <div className="col-span-2 text-right">
                      <div className="text-sm font-bold" style={{ fontFamily: 'Space Mono' }}>{deck.metaShare}%</div>
                      <div className="mt-1 h-1.5 bg-gray-100 w-full">
                        <div className="h-full bg-[#3B7EFF]" style={{ width: `${deck.metaShare * 4}%` }} />
                      </div>
                    </div>
                    <div className="col-span-2 text-right">
                      <div className={`text-sm font-bold ${deck.winRate >= 54 ? "text-[#00C48C]" : deck.winRate >= 52 ? "text-gray-600" : "text-[#FF3B3B]"}`} style={{ fontFamily: 'Space Mono' }}>
                        {deck.winRate}%
                      </div>
                    </div>
                    <div className="col-span-1 text-right text-xs font-medium text-gray-700" style={{ fontFamily: 'Space Mono' }}>
                      ${deck.avgPrice >= 1000 ? `${(deck.avgPrice / 1000).toFixed(1)}k` : deck.avgPrice}
                    </div>
                    <div className="col-span-1 flex justify-center items-center">
                      <TrendArrow trend={deck.trend} />
                    </div>
                  </div>
                ))}

                {formatDecks.length === 0 && (
                  <div className="px-4 py-10 text-center text-sm text-gray-400">
                    No deck data available for {activeFormat} yet.
                  </div>
                )}
              </div>
            )}

            {/* Top Cards */}
            {activeTab === "cards" && (
              <div className="border-2 border-black bg-white brutal-shadow overflow-hidden">
                <div className="grid grid-cols-12 border-b-2 border-black bg-[#0A0A0A] px-4 py-2.5">
                  <div className="col-span-5 text-[10px] font-bold text-white uppercase tracking-wider">Card</div>
                  <div className="col-span-2 text-[10px] font-bold text-white uppercase tracking-wider text-center">Avg Copies</div>
                  <div className="col-span-3 text-[10px] font-bold text-white uppercase tracking-wider text-center">Deck Penetration</div>
                  <div className="col-span-2 text-[10px] font-bold text-white uppercase tracking-wider text-right">Price</div>
                </div>
                {TOP_CARDS_MODERN.map((card, i) => (
                  <div key={i} className="grid grid-cols-12 px-4 py-3 border-b border-black/10 last:border-0 hover:bg-[#FFFEF0] transition-colors">
                    <div className="col-span-5 flex items-center gap-2">
                      <span className="text-[10px] font-bold text-gray-400 w-4" style={{ fontFamily: 'Space Mono' }}>#{i + 1}</span>
                      <span className="text-sm font-bold text-black">{card.name}</span>
                    </div>
                    <div className="col-span-2 text-center text-sm font-bold" style={{ fontFamily: 'Space Mono' }}>{card.copies}x</div>
                    <div className="col-span-3 flex items-center gap-2 px-2">
                      <div className="flex-1 h-2 bg-gray-100 border border-gray-200">
                        <div className="h-full bg-[#3B7EFF]" style={{ width: `${card.decks}%` }} />
                      </div>
                      <span className="text-[10px]" style={{ fontFamily: 'Space Mono' }}>{card.decks}%</span>
                    </div>
                    <div className="col-span-2 text-right font-bold text-sm" style={{ fontFamily: 'Space Mono' }}>
                      ${card.avgPrice}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Tournaments */}
            {activeTab === "tournaments" && (
              <div className="border-2 border-black bg-white brutal-shadow overflow-hidden">
                <div className="grid grid-cols-12 border-b-2 border-black bg-[#0A0A0A] px-4 py-2.5">
                  <div className="col-span-4 text-[10px] font-bold text-white uppercase tracking-wider">Event</div>
                  <div className="col-span-2 text-[10px] font-bold text-white uppercase tracking-wider">Date</div>
                  <div className="col-span-2 text-[10px] font-bold text-white uppercase tracking-wider text-center">Players</div>
                  <div className="col-span-3 text-[10px] font-bold text-white uppercase tracking-wider">Winner</div>
                  <div className="col-span-1 text-[10px] font-bold text-white uppercase tracking-wider">Format</div>
                </div>
                {TOURNAMENT_DATA.map((t, i) => (
                  <div key={i} className="grid grid-cols-12 px-4 py-3.5 border-b border-black/10 last:border-0 hover:bg-[#FFFEF0] transition-colors cursor-pointer group">
                    <div className="col-span-4">
                      <div className="font-bold text-sm text-black group-hover:text-[#3B7EFF] transition-colors">{t.event}</div>
                    </div>
                    <div className="col-span-2 text-xs text-gray-500 flex items-center" style={{ fontFamily: 'Space Mono' }}>{t.date}</div>
                    <div className="col-span-2 text-center text-xs font-bold flex items-center justify-center gap-1" style={{ fontFamily: 'Space Mono' }}>
                      <Users className="w-3 h-3 text-gray-400" />
                      {t.players}
                    </div>
                    <div className="col-span-3 flex items-center">
                      <span className="text-xs font-medium text-black flex items-center gap-1">
                        <Trophy className="w-3 h-3 text-[#FFE234]" /> {t.winner}
                      </span>
                    </div>
                    <div className="col-span-1">
                      <span className="text-[9px] px-1.5 py-0.5 bg-[#3B7EFF] text-white border border-black font-bold uppercase">
                        {t.format.slice(0, 3)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* RIGHT: Charts */}
          <div className="space-y-4">
            {/* Meta Share Bar Chart */}
            <div className="border-2 border-black bg-white brutal-shadow">
              <div className="border-b-2 border-black px-4 py-2.5 bg-[#0A0A0A]">
                <span className="text-xs font-bold text-white uppercase tracking-wider">{activeFormat} Meta Share</span>
              </div>
              <div className="p-4" style={{ height: 240 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={formatDecks} layout="vertical" margin={{ left: 0, right: 10, top: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="2 4" stroke="#E5E5E5" horizontal={false} />
                    <XAxis type="number" tick={{ fontSize: 9, fontFamily: 'Space Mono' }} tickLine={false} axisLine={false} tickFormatter={v => `${v}%`} />
                    <YAxis type="category" dataKey="name" tick={{ fontSize: 9, fontFamily: 'Space Grotesk' }} width={80} axisLine={false} tickLine={false} />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar dataKey="metaShare" name="Meta %" stroke="#0A0A0A" strokeWidth={1} radius={0}>
                      {formatDecks.map((_, i) => (
                        <Cell key={i} fill={["#FFE234", "#3B7EFF", "#FF3B3B", "#00C48C", "#9B59B6", "#F39C12", "#E74C3C", "#1ABC9C"][i % 8]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Archetype Radar */}
            <div className="border-2 border-black bg-white brutal-shadow">
              <div className="border-b-2 border-black px-4 py-2.5 bg-[#0A0A0A]">
                <span className="text-xs font-bold text-white uppercase tracking-wider">Archetype Strengths</span>
              </div>
              <div className="p-4" style={{ height: 220 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart data={RADAR_DATA}>
                    <PolarGrid stroke="#E5E5E5" />
                    <PolarAngleAxis dataKey="subject" tick={{ fontSize: 9, fontFamily: 'Space Grotesk' }} />
                    <Radar name="Modern" dataKey="Modern" stroke="#3B7EFF" fill="#3B7EFF" fillOpacity={0.2} strokeWidth={2} />
                    <Radar name="Legacy" dataKey="Legacy" stroke="#FF3B3B" fill="#FF3B3B" fillOpacity={0.2} strokeWidth={2} />
                    <Legend wrapperStyle={{ fontSize: 10, fontFamily: 'Space Grotesk' }} />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Format Distribution */}
            <div className="border-2 border-black bg-white brutal-shadow">
              <div className="border-b-2 border-black px-4 py-2.5 bg-[#0A0A0A]">
                <span className="text-xs font-bold text-white uppercase tracking-wider">Format Distribution</span>
              </div>
              <div className="p-4">
                {FORMAT_DATA.map((f, i) => (
                  <div key={i} className="flex items-center gap-2 mb-2 last:mb-0">
                    <div className="w-3 h-3 border border-black shrink-0" style={{ backgroundColor: f.fill }} />
                    <div className="flex-1 text-xs font-medium text-black">{f.name}</div>
                    <div className="text-xs font-bold" style={{ fontFamily: 'Space Mono' }}>{f.value}%</div>
                    <div className="w-20 h-1.5 bg-gray-100">
                      <div className="h-full" style={{ backgroundColor: f.fill, width: `${f.value * 2}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
