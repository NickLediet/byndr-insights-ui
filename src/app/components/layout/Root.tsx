import { Outlet, Link } from "react-router";
import { Navbar } from "./Navbar";

export function Root() {
  return (
    <div className="min-h-screen bg-[#FFFEF0]" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
      <Navbar />
      <main>
        <Outlet />
      </main>
      <footer className="border-t-2 border-black mt-4 bg-[#0A0A0A] text-[#FFFEF0]">
        <div className="max-w-screen-xl mx-auto px-4 py-4 grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <div className="text-[#FFE234] font-bold mb-3 text-sm tracking-widest uppercase">Vaultex</div>
            <p className="text-gray-400 text-xs leading-relaxed">Financial intelligence for the trading card market. Built for collectors, investors & competitors.</p>
          </div>
          <div>
            <div className="font-bold mb-3 text-sm tracking-widest uppercase text-gray-300">Platform</div>
            <ul className="space-y-2 text-xs text-gray-400">
              <li><a href="/cards" className="hover:text-[#FFE234] transition-colors">Card Database</a></li>
              <li><a href="/analytics" className="hover:text-[#FFE234] transition-colors">Analytics</a></li>
              <li><a href="/query" className="hover:text-[#FFE234] transition-colors">Query Builder</a></li>
              <li><a href="/metagame" className="hover:text-[#FFE234] transition-colors">Metagame</a></li>
              <li><Link to="/design" className="hover:text-[#FFE234] transition-colors">Design System</Link></li>
            </ul>
          </div>
          <div>
            <div className="font-bold mb-3 text-sm tracking-widest uppercase text-gray-300">Data</div>
            <ul className="space-y-2 text-xs text-gray-400">
              <li>Magic: The Gathering</li>
              <li className="text-gray-600">Pokémon TCG (soon)</li>
              <li className="text-gray-600">Yu-Gi-Oh! (soon)</li>
              <li className="text-gray-600">Lorcana (soon)</li>
            </ul>
          </div>
          <div>
            <div className="font-bold mb-3 text-sm tracking-widest uppercase text-gray-300">Legal</div>
            <ul className="space-y-2 text-xs text-gray-400">
              <li>Privacy Policy</li>
              <li>Terms of Service</li>
              <li>API Docs</li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-800 max-w-screen-xl mx-auto px-4 py-4 flex items-center justify-between">
          <span className="text-xs text-gray-600" style={{ fontFamily: 'Space Mono' }}>© 2026 Vaultex. Not affiliated with Wizards of the Coast.</span>
          <span className="text-xs text-gray-600" style={{ fontFamily: 'Space Mono' }}>v0.1.0-alpha</span>
        </div>
      </footer>
    </div>
  );
}