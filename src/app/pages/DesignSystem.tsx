import { useState } from "react";
import {
  Sparkles, TrendingUp, TrendingDown, AlertCircle, CheckCircle,
  Info, ChevronDown, X, Search, Bell, Star, ArrowRight, Zap,
  Database, BarChart2, Swords, Copy
} from "lucide-react";

// ── Design Token palette ──────────────────────────────────────────────────────
const COLORS = [
  { name: "Yellow Primary", hex: "#FFE234", text: "black", usage: "Highlights, CTAs, Active states" },
  { name: "Blue Accent", hex: "#3B7EFF", text: "white", usage: "Links, badges, chart series" },
  { name: "Red Accent", hex: "#FF3B3B", text: "white", usage: "Losers, errors, destructive" },
  { name: "Green Accent", hex: "#00C48C", text: "white", usage: "Gainers, success, positive" },
  { name: "Ink Black", hex: "#0A0A0A", text: "white", usage: "Borders, text, headers" },
  { name: "Cream BG", hex: "#FFFEF0", text: "black", usage: "Page background" },
  { name: "White", hex: "#FFFFFF", text: "black", usage: "Cards, panels" },
  { name: "Purple", hex: "#9B59B6", text: "white", usage: "Vintage, special variants" },
];

const FONT_SPECIMENS = [
  { family: "Space Grotesk", weight: "700", sample: "Trade Smarter.", size: "2rem" },
  { family: "Space Grotesk", weight: "500", sample: "Financial intelligence for the trading card market.", size: "1.125rem" },
  { family: "Space Grotesk", weight: "400", sample: "Real-time prices, metagame analytics, and composable queries.", size: "1rem" },
  { family: "Space Mono", weight: "700", sample: "$89.50 +15.9%", size: "1.25rem" },
  { family: "Space Mono", weight: "400", sample: "WWK · 2010-01-01 · Legacy", size: "0.75rem" },
];

// ── Reusable component samples ────────────────────────────────────────────────
function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mb-12">
      <div className="flex items-center gap-3 mb-6">
        <div className="h-px flex-1 bg-black/10" />
        <h2 className="text-xs font-bold uppercase tracking-widest text-gray-500">{title}</h2>
        <div className="h-px flex-1 bg-black/10" />
      </div>
      {children}
    </section>
  );
}

function CodeBlock({ code }: { code: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <div className="border-2 border-black bg-[#0A0A0A] mt-2 overflow-hidden">
      <div className="flex items-center justify-between border-b border-[#333] px-3 py-1.5">
        <span className="text-[10px] text-[#FFE234] uppercase tracking-wider" style={{ fontFamily: 'Space Mono' }}>className</span>
        <button
          onClick={() => { navigator.clipboard?.writeText(code); setCopied(true); setTimeout(() => setCopied(false), 1500); }}
          className="text-[10px] text-gray-400 hover:text-white flex items-center gap-1"
        >
          <Copy className="w-3 h-3" /> {copied ? "Copied!" : "Copy"}
        </button>
      </div>
      <pre className="text-[#00C48C] text-[10px] px-3 py-2 overflow-x-auto" style={{ fontFamily: 'Space Mono' }}>{code}</pre>
    </div>
  );
}

export function DesignSystem() {
  const [badgeVariant, setBadgeVariant] = useState<"yellow" | "blue" | "red" | "green" | "black">("yellow");
  const [inputVal, setInputVal] = useState("");
  const [switchOn, setSwitchOn] = useState(false);
  const [activeTab2, setActiveTab2] = useState(0);

  return (
    <div className="bg-[#FFFEF0] min-h-screen">
      {/* Header */}
      <div className="border-b-2 border-black bg-[#0A0A0A]">
        <div className="max-w-screen-xl mx-auto px-4 py-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-[#FFE234] border-2 border-[#FFE234] flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-black" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">Vaultex Design System</h1>
              <p className="text-gray-400 text-sm">Neobrutalist component library extending shadcn/ui</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            {["v0.1.0-alpha", "Neobrutalist", "shadcn/ui Extension", "Space Grotesk + Mono", "Tailwind CSS v4"].map(tag => (
              <span key={tag} className="text-[10px] px-2 py-0.5 border border-[#FFE234] text-[#FFE234]" style={{ fontFamily: 'Space Mono' }}>{tag}</span>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-screen-xl mx-auto px-4 py-10">

        {/* ── Color Palette ───────────────────────────── */}
        <Section title="Color Palette">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {COLORS.map(c => (
              <div key={c.name} className="border-2 border-black brutal-shadow bg-white overflow-hidden">
                <div className="h-20 border-b-2 border-black" style={{ backgroundColor: c.hex }} />
                <div className="p-3">
                  <div className="font-bold text-sm text-black">{c.name}</div>
                  <div className="text-xs text-gray-400 uppercase mt-0.5" style={{ fontFamily: 'Space Mono' }}>{c.hex}</div>
                  <div className="text-[10px] text-gray-500 mt-1">{c.usage}</div>
                </div>
              </div>
            ))}
          </div>
        </Section>

        {/* ── Typography ──────────────────────────────── */}
        <Section title="Typography">
          <div className="border-2 border-black bg-white brutal-shadow overflow-hidden">
            {FONT_SPECIMENS.map((spec, i) => (
              <div key={i} className={`p-5 ${i < FONT_SPECIMENS.length - 1 ? "border-b-2 border-black" : ""}`}>
                <div
                  style={{ fontFamily: spec.family, fontWeight: spec.weight, fontSize: spec.size }}
                  className="text-black"
                >
                  {spec.sample}
                </div>
                <div className="mt-1.5 text-[10px] text-gray-400" style={{ fontFamily: 'Space Mono' }}>
                  {spec.family} · weight {spec.weight} · {spec.size}
                </div>
              </div>
            ))}
          </div>
        </Section>

        {/* ── Buttons ─────────────────────────────────── */}
        <Section title="Buttons">
          <div className="border-2 border-black bg-white brutal-shadow p-6">
            <div className="flex flex-wrap gap-3 mb-6">
              {/* Primary */}
              <button className="flex items-center gap-2 px-4 py-2 bg-[#FFE234] border-2 border-black font-bold text-sm brutal-shadow hover:-translate-x-0.5 hover:-translate-y-0.5 transition-transform">
                <Zap className="w-4 h-4" /> Primary
              </button>
              {/* Secondary */}
              <button className="flex items-center gap-2 px-4 py-2 bg-white border-2 border-black font-bold text-sm brutal-shadow hover:-translate-x-0.5 hover:-translate-y-0.5 transition-transform">
                Secondary
              </button>
              {/* Black */}
              <button className="flex items-center gap-2 px-4 py-2 bg-[#0A0A0A] text-white border-2 border-[#0A0A0A] font-bold text-sm brutal-shadow hover:-translate-x-0.5 hover:-translate-y-0.5 transition-transform">
                Dark
              </button>
              {/* Danger */}
              <button className="flex items-center gap-2 px-4 py-2 bg-[#FF3B3B] text-white border-2 border-[#FF3B3B] font-bold text-sm brutal-shadow hover:-translate-x-0.5 hover:-translate-y-0.5 transition-transform">
                Danger
              </button>
              {/* Success */}
              <button className="flex items-center gap-2 px-4 py-2 bg-[#00C48C] text-white border-2 border-[#00C48C] font-bold text-sm brutal-shadow hover:-translate-x-0.5 hover:-translate-y-0.5 transition-transform">
                Success
              </button>
              {/* Ghost */}
              <button className="flex items-center gap-2 px-4 py-2 border-2 border-dashed border-black font-bold text-sm hover:bg-black hover:text-white transition-colors">
                Ghost
              </button>
              {/* Icon only */}
              <button className="p-2 border-2 border-black bg-white brutal-shadow hover:bg-[#FFE234] transition-colors">
                <Bell className="w-4 h-4" />
              </button>
            </div>
            <CodeBlock code={`// Primary Button
className="px-4 py-2 bg-[#FFE234] border-2 border-black font-bold text-sm brutal-shadow hover:-translate-x-0.5 hover:-translate-y-0.5 transition-transform"

// Dark Button
className="px-4 py-2 bg-[#0A0A0A] text-white border-2 border-black font-bold text-sm brutal-shadow"`} />
          </div>
        </Section>

        {/* ── Badges ──────────────────────────────────── */}
        <Section title="Badges & Labels">
          <div className="border-2 border-black bg-white brutal-shadow p-6">
            <div className="flex flex-wrap gap-2 mb-4">
              <span className="text-[10px] font-bold px-2.5 py-1 bg-[#FFE234] border border-black uppercase tracking-wider">Yellow</span>
              <span className="text-[10px] font-bold px-2.5 py-1 bg-[#3B7EFF] text-white border border-black uppercase tracking-wider">Blue</span>
              <span className="text-[10px] font-bold px-2.5 py-1 bg-[#FF3B3B] text-white border border-black uppercase tracking-wider">Red</span>
              <span className="text-[10px] font-bold px-2.5 py-1 bg-[#00C48C] text-white border border-black uppercase tracking-wider">Green</span>
              <span className="text-[10px] font-bold px-2.5 py-1 bg-[#0A0A0A] text-white border border-black uppercase tracking-wider">Black</span>
              <span className="text-[10px] font-bold px-2.5 py-1 bg-orange-500 text-white border border-black uppercase tracking-wider">Mythic</span>
              <span className="text-[10px] font-bold px-2.5 py-1 bg-yellow-600 text-white border border-black uppercase tracking-wider">Rare</span>
              <span className="text-[10px] font-bold px-2.5 py-1 bg-gray-400 text-white border border-black uppercase tracking-wider">Uncommon</span>
            </div>
            {/* Price change badges */}
            <div className="flex flex-wrap gap-2 mb-4">
              <span className="text-xs font-bold px-2.5 py-1 bg-[#00C48C] text-white border border-black flex items-center gap-1">
                <TrendingUp className="w-3 h-3" /> +15.9%
              </span>
              <span className="text-xs font-bold px-2.5 py-1 bg-[#FF3B3B] text-white border border-black flex items-center gap-1">
                <TrendingDown className="w-3 h-3" /> -6.3%
              </span>
              <span className="text-xs font-bold px-2.5 py-1 bg-[#3B7EFF] text-white border border-black">Legacy</span>
              <span className="text-xs font-bold px-2.5 py-1 bg-[#3B7EFF] text-white border border-black">Modern</span>
            </div>
            <CodeBlock code={`// Badge
<span className="text-[10px] font-bold px-2.5 py-1 bg-[#FFE234] border border-black uppercase tracking-wider">Label</span>

// Price Badge (positive)
<span className="text-xs font-bold px-2.5 py-1 bg-[#00C48C] text-white border border-black flex items-center gap-1">
  <TrendingUp className="w-3 h-3" /> +15.9%
</span>`} />
          </div>
        </Section>

        {/* ── Cards ───────────────────────────────────── */}
        <Section title="Cards & Panels">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Brutal Card */}
            <div className="border-2 border-black bg-white brutal-shadow p-5">
              <div className="w-9 h-9 bg-[#FFE234] border-2 border-black flex items-center justify-center mb-3">
                <BarChart2 className="w-5 h-5 text-black" />
              </div>
              <h3 className="font-bold text-black mb-1">Standard Card</h3>
              <p className="text-sm text-gray-500">A basic brutal card with offset shadow and 2px black border.</p>
            </div>

            {/* Interactive Card */}
            <div className="border-2 border-black bg-white brutal-shadow p-5 hover:-translate-y-0.5 hover:shadow-[6px_6px_0px_0px_#0A0A0A] transition-all cursor-pointer group">
              <div className="w-9 h-9 bg-[#3B7EFF] border-2 border-black flex items-center justify-center mb-3">
                <Database className="w-5 h-5 text-white" />
              </div>
              <h3 className="font-bold text-black mb-1 group-hover:text-[#3B7EFF] transition-colors">Hover Card</h3>
              <p className="text-sm text-gray-500">Lifts on hover with increased shadow. Great for clickable items.</p>
              <div className="flex items-center gap-1 text-xs font-bold mt-3 text-black">
                Explore <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </div>

            {/* Dark Card */}
            <div className="border-2 border-black bg-[#0A0A0A] brutal-shadow-yellow p-5">
              <div className="w-9 h-9 bg-[#FFE234] border-2 border-[#FFE234] flex items-center justify-center mb-3">
                <Swords className="w-5 h-5 text-black" />
              </div>
              <h3 className="font-bold text-white mb-1">Dark Card</h3>
              <p className="text-sm text-gray-400">Dark variant with yellow offset shadow for emphasis.</p>
            </div>
          </div>
          <CodeBlock code={`// Standard Brutal Card
<div className="border-2 border-black bg-white brutal-shadow p-5">

// Hover Card (interactive)
<div className="border-2 border-black bg-white brutal-shadow hover:-translate-y-0.5 hover:shadow-[6px_6px_0px_0px_#0A0A0A] transition-all">

// Dark Card with Yellow Shadow
<div className="border-2 border-black bg-[#0A0A0A] brutal-shadow-yellow p-5">`} />
        </Section>

        {/* ── Form Controls ───────────────────────────── */}
        <Section title="Form Controls">
          <div className="border-2 border-black bg-white brutal-shadow p-6 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Text Input */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-1.5">Text Input</label>
                <div className="flex items-center border-2 border-black bg-white px-3 py-2 gap-2 brutal-shadow-sm">
                  <Search className="w-4 h-4 text-gray-400 shrink-0" />
                  <input
                    value={inputVal}
                    onChange={e => setInputVal(e.target.value)}
                    placeholder="Search cards..."
                    className="flex-1 outline-none text-sm bg-transparent"
                  />
                  {inputVal && <button onClick={() => setInputVal("")}><X className="w-3.5 h-3.5 text-gray-400" /></button>}
                </div>
              </div>

              {/* Select */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-1.5">Select</label>
                <select className="w-full border-2 border-black px-3 py-2.5 bg-white outline-none text-sm brutal-shadow-sm" style={{ fontFamily: 'Space Grotesk' }}>
                  <option>All Formats</option>
                  <option>Modern</option>
                  <option>Legacy</option>
                  <option>Commander</option>
                </select>
              </div>

              {/* Checkbox group */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-1.5">Checkboxes</label>
                <div className="space-y-1.5">
                  {["Mythic", "Rare", "Uncommon"].map(r => (
                    <label key={r} className="flex items-center gap-2 cursor-pointer group">
                      <input type="checkbox" className="w-4 h-4 border-2 border-black" style={{ accentColor: '#FFE234' }} />
                      <span className="text-sm font-medium group-hover:text-[#3B7EFF] transition-colors">{r}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Toggle */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-1.5">Toggle Switch</label>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setSwitchOn(!switchOn)}
                    className={`relative w-12 h-6 border-2 border-black transition-colors ${switchOn ? "bg-[#FFE234]" : "bg-gray-200"}`}
                  >
                    <div className={`absolute top-0.5 w-4 h-4 bg-[#0A0A0A] border border-black transition-all ${switchOn ? "left-6" : "left-0.5"}`} />
                  </button>
                  <span className="text-sm font-medium">{switchOn ? "Enabled" : "Disabled"}</span>
                </div>
              </div>
            </div>
            <CodeBlock code={`// Text Input
<div className="flex items-center border-2 border-black px-3 py-2 gap-2 brutal-shadow-sm">
  <Search className="w-4 h-4 text-gray-400" />
  <input className="flex-1 outline-none text-sm bg-transparent" />
</div>

// Select
<select className="w-full border-2 border-black px-3 py-2.5 bg-white outline-none text-sm brutal-shadow-sm">`} />
          </div>
        </Section>

        {/* ── Alerts ──────────────────────────────────── */}
        <Section title="Alerts & Notifications">
          <div className="space-y-3">
            {[
              { icon: CheckCircle, color: "#00C48C", bg: "#EAFAF5", label: "Success", msg: "Price alert triggered: Jace, the Mind Sculptor crossed $90.00." },
              { icon: AlertCircle, color: "#FF3B3B", bg: "#FFF0F0", label: "Error", msg: "Failed to load market data. Please refresh the page." },
              { icon: Info, color: "#3B7EFF", bg: "#EEF4FF", label: "Info", msg: "Metagame data is updated every 24 hours from tournament results." },
              { icon: Sparkles, color: "#FFE234", bg: "#FFFDE0", label: "Notice", msg: "New set 'Final Fantasy' data is now available in the database." },
            ].map(alert => (
              <div key={alert.label} className="flex items-start gap-3 border-2 border-black p-4" style={{ backgroundColor: alert.bg }}>
                <alert.icon className="w-5 h-5 shrink-0 mt-0.5" style={{ color: alert.color }} />
                <div className="flex-1">
                  <div className="font-bold text-sm text-black">{alert.label}</div>
                  <div className="text-xs text-gray-600 mt-0.5">{alert.msg}</div>
                </div>
                <button className="text-gray-400 hover:text-black"><X className="w-4 h-4" /></button>
              </div>
            ))}
          </div>
        </Section>

        {/* ── Tabs ────────────────────────────────────── */}
        <Section title="Tabs">
          <div className="border-2 border-black bg-white brutal-shadow overflow-hidden">
            <div className="flex border-b-2 border-black">
              {["Overview", "Printings", "Rulings", "Legality"].map((tab, i) => (
                <button
                  key={i}
                  onClick={() => setActiveTab2(i)}
                  className={`flex-1 py-3 text-xs font-bold uppercase tracking-wider border-r border-black last:border-0 transition-colors ${
                    activeTab2 === i ? "bg-[#FFE234]" : "hover:bg-[#FFFEF0]"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
            <div className="p-5 text-sm text-gray-500">
              {["Card overview, text, and artwork information.", "All printings and their market prices.", "Official rulings from Wizards of the Coast.", "Format legality status across all formats."][activeTab2]}
            </div>
          </div>
          <CodeBlock code={`// Tabs
<div className="flex border-b-2 border-black">
  {tabs.map(tab => (
    <button className={\`flex-1 py-3 text-xs font-bold uppercase border-r border-black last:border-0 \${active === tab ? "bg-[#FFE234]" : "hover:bg-[#FFFEF0]"}\`}>
      {tab}
    </button>
  ))}
</div>`} />
        </Section>

        {/* ── Shadow System ───────────────────────────── */}
        <Section title="Shadow System">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {[
              { label: "brutal-shadow-sm", cls: "brutal-shadow-sm", desc: "2px" },
              { label: "brutal-shadow", cls: "brutal-shadow", desc: "4px" },
              { label: "brutal-shadow-lg", cls: "brutal-shadow-lg", desc: "6px" },
              { label: "brutal-shadow-yellow", cls: "brutal-shadow-yellow", desc: "Yellow" },
              { label: "brutal-shadow-blue", cls: "brutal-shadow-blue", desc: "Blue" },
            ].map(s => (
              <div key={s.label} className="text-center">
                <div className={`border-2 border-black bg-white p-4 mb-2 ${s.cls}`}>
                  <div className="text-xs font-bold text-black">{s.desc}</div>
                </div>
                <div className="text-[9px] text-gray-400 uppercase" style={{ fontFamily: 'Space Mono' }}>{s.label}</div>
              </div>
            ))}
          </div>
        </Section>

        {/* ── Icon System ─────────────────────────────── */}
        <Section title="Icon System (Lucide React)">
          <div className="border-2 border-black bg-white brutal-shadow p-6">
            <p className="text-sm text-gray-500 mb-4">All icons use Lucide React. Common icons for the platform:</p>
            <div className="grid grid-cols-4 sm:grid-cols-8 gap-3">
              {[
                { icon: Database, label: "Database" },
                { icon: BarChart2, label: "Analytics" },
                { icon: Swords, label: "Metagame" },
                { icon: TrendingUp, label: "Trend Up" },
                { icon: TrendingDown, label: "Trend Down" },
                { icon: Bell, label: "Alert" },
                { icon: Star, label: "Watchlist" },
                { icon: Search, label: "Search" },
              ].map(({ icon: Icon, label }) => (
                <div key={label} className="flex flex-col items-center gap-1.5 p-3 border border-black/10 hover:border-black hover:bg-[#FFFEF0] transition-colors cursor-pointer">
                  <Icon className="w-5 h-5 text-black" />
                  <span className="text-[9px] text-gray-400 text-center uppercase" style={{ fontFamily: 'Space Mono' }}>{label}</span>
                </div>
              ))}
            </div>
          </div>
        </Section>
      </div>
    </div>
  );
}
