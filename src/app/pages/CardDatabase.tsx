import { useState } from "react";
import { LayoutGrid, Terminal, Image, ChevronRight } from "lucide-react";
import { MarketView } from "../components/card-db/MarketView";
import { TerminalView } from "../components/card-db/TerminalView";
import { ShowcaseView } from "../components/card-db/ShowcaseView";

type Variant = "market" | "terminal" | "showcase";

const VARIANTS: {
  id: Variant;
  label: string;
  letter: string;
  desc: string;
  icon: React.ElementType;
  accent: string;
}[] = [
  {
    id: "market",
    label: "Market",
    letter: "A",
    desc: "Sidebar filters + card grid",
    icon: LayoutGrid,
    accent: "#FFE234",
  },
  {
    id: "terminal",
    label: "Terminal",
    letter: "B",
    desc: "Bloomberg-style data table",
    icon: Terminal,
    accent: "#3B7EFF",
  },
  {
    id: "showcase",
    label: "Showcase",
    letter: "C",
    desc: "Art-forward visual browser",
    icon: Image,
    accent: "#FF3B3B",
  },
];

export function CardDatabase() {
  const [active, setActive] = useState<Variant>("market");
  const activeVariant = VARIANTS.find(v => v.id === active)!;

  return (
    <div>
      {/* ── Variation Switcher Bar ─────────────────────────────────────── */}
      <div className="bg-white border-b-2 border-black px-4 py-0 flex items-stretch">

        {/* Label */}
        <div className="flex items-center pr-4 mr-2 border-r border-black/10">
          <span className="text-[9px] text-gray-400 mono uppercase tracking-widest">View Variant</span>
        </div>

        {/* Variant tabs */}
        {VARIANTS.map(v => {
          const Icon = v.icon;
          const isActive = active === v.id;
          return (
            <button
              key={v.id}
              onClick={() => setActive(v.id)}
              className={`flex items-center gap-2.5 px-4 py-3 border-r border-black/10 last:border-r-0 transition-all group relative ${
                isActive ? "bg-[#FFFEF0]" : "hover:bg-[#FAFAF8]"
              }`}
            >
              {/* Active accent line at top */}
              {isActive && (
                <div
                  className="absolute top-0 left-0 right-0 h-[3px]"
                  style={{ backgroundColor: v.accent }}
                />
              )}

              {/* Letter badge */}
              <div
                className="w-5 h-5 flex items-center justify-center border text-[9px] font-bold mono shrink-0 transition-colors"
                style={{
                  backgroundColor: isActive ? v.accent : "transparent",
                  borderColor: isActive ? v.accent : "rgba(0,0,0,0.18)",
                  color: isActive ? "#000" : "#aaa",
                }}
              >
                {v.letter}
              </div>

              <div className="text-left hidden sm:block">
                <div
                  className={`text-xs font-bold mono tracking-wide ${
                    isActive ? "text-black" : "text-gray-400 group-hover:text-gray-700"
                  }`}
                >
                  {v.label}
                </div>
                <div className="text-[9px] text-gray-400 mono">{v.desc}</div>
              </div>

              <Icon
                className={`w-3.5 h-3.5 sm:hidden shrink-0 ${
                  isActive ? "text-black" : "text-gray-400"
                }`}
              />
            </button>
          );
        })}

        {/* Active breadcrumb */}
        <div className="ml-auto flex items-center gap-2 pr-2">
          <span className="text-[9px] text-gray-400 mono hidden md:flex items-center gap-1">
            Card DB <ChevronRight className="w-3 h-3" />
            <span className="font-bold text-black">{activeVariant.label}</span>
          </span>
        </div>
      </div>

      {/* ── Render Active View ─────────────────────────────────────────── */}
      {active === "market"   && <MarketView />}
      {active === "terminal" && <TerminalView />}
      {active === "showcase" && <ShowcaseView />}
    </div>
  );
}
