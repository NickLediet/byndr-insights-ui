import { useState } from "react";
import { Link, useLocation } from "react-router";
import {
  Search, BarChart2, Database, Layers, Swords, Code2,
  Menu, X, Sparkles, ChevronDown, Bell, User
} from "lucide-react";

const NAV_LINKS = [
  { href: "/cards", label: "Card DB", icon: Database },
  { href: "/analytics", label: "Analytics", icon: BarChart2 },
  { href: "/query", label: "Query Builder", icon: Code2 },
  { href: "/metagame", label: "Metagame", icon: Swords },
  { href: "/design", label: "Design System", icon: Layers },
];

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  return (
    <header className="sticky top-0 z-50 bg-[#FFFEF0] border-b-2 border-black">
      <div className="max-w-screen-xl mx-auto px-4 h-14 flex items-center justify-between gap-4">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 shrink-0">
          <div className="w-8 h-8 bg-[#FFE234] border-2 border-black flex items-center justify-center brutal-shadow-sm">
            <Sparkles className="w-4 h-4 text-black" />
          </div>
          <span className="text-black font-bold tracking-tight hidden sm:block" style={{ fontFamily: 'Space Grotesk' }}>
            VAULTEX
          </span>
          <span className="text-[10px] font-bold px-1 py-0.5 bg-[#FF3B3B] text-white border border-black" style={{ fontFamily: 'Space Mono' }}>
            MTG
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-1">
          {NAV_LINKS.map(({ href, label, icon: Icon }) => {
            const active = location.pathname === href;
            return (
              <Link
                key={href}
                to={href}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium border-2 transition-all ${
                  active
                    ? "bg-[#FFE234] border-black brutal-shadow-sm"
                    : "border-transparent hover:border-black hover:bg-white"
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                {label}
              </Link>
            );
          })}
        </nav>

        {/* Right actions */}
        <div className="flex items-center gap-2">
          <div className="hidden sm:flex items-center border-2 border-black bg-white px-2 py-1 gap-1 brutal-shadow-sm w-40">
            <Search className="w-3.5 h-3.5 text-gray-500 shrink-0" />
            <input
              className="bg-transparent text-sm outline-none w-full placeholder:text-gray-400"
              placeholder="Quick search..."
              style={{ fontFamily: 'Space Grotesk' }}
            />
          </div>
          <button className="relative p-1.5 border-2 border-black bg-white brutal-shadow-sm hover:bg-[#FFE234] transition-colors">
            <Bell className="w-4 h-4" />
            <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-[#FF3B3B] border border-black text-white text-[8px] flex items-center justify-center font-bold">3</span>
          </button>
          <button className="p-1.5 border-2 border-black bg-white brutal-shadow-sm hover:bg-[#FFE234] transition-colors hidden sm:flex">
            <User className="w-4 h-4" />
          </button>
          <button
            className="md:hidden p-1.5 border-2 border-black"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden border-t-2 border-black bg-[#FFFEF0]">
          {NAV_LINKS.map(({ href, label, icon: Icon }) => {
            const active = location.pathname === href;
            return (
              <Link
                key={href}
                to={href}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center gap-2 px-4 py-3 border-b border-black text-sm font-medium ${
                  active ? "bg-[#FFE234]" : "hover:bg-white"
                }`}
              >
                <Icon className="w-4 h-4" />
                {label}
              </Link>
            );
          })}
          <div className="flex items-center border-b border-black px-4 py-2 gap-2">
            <Search className="w-4 h-4 text-gray-500" />
            <input className="bg-transparent text-sm outline-none w-full" placeholder="Quick search..." />
          </div>
        </div>
      )}
    </header>
  );
}
