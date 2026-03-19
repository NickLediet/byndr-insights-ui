import { useState } from "react";
import {
  Plus, X, Play, Download, Save, ChevronDown, Code2,
  Table, Copy, Info, Trash2, GripVertical, Wand2
} from "lucide-react";
import { MOCK_CARDS, QUERY_FIELDS } from "../data/mockData";

type Operator = "equals" | "contains" | "greater_than" | "less_than" | "between" | "in" | "not_in";
type LogicOp = "AND" | "OR";

interface Condition {
  id: string;
  field: string;
  operator: Operator;
  value: string;
  value2?: string; // for "between"
}

interface QueryGroup {
  id: string;
  logic: LogicOp;
  conditions: Condition[];
}

const OPERATORS: Record<string, { value: Operator; label: string }[]> = {
  text: [
    { value: "contains", label: "contains" },
    { value: "equals", label: "equals" },
    { value: "not_in", label: "does not contain" },
  ],
  select: [
    { value: "equals", label: "is" },
    { value: "not_in", label: "is not" },
  ],
  multiselect: [
    { value: "in", label: "includes" },
    { value: "not_in", label: "excludes" },
  ],
  range: [
    { value: "greater_than", label: "greater than" },
    { value: "less_than", label: "less than" },
    { value: "between", label: "between" },
    { value: "equals", label: "equals" },
  ],
};

const PRESET_QUERIES = [
  {
    name: "Budget Staples",
    desc: "Competitive cards under $15",
    group: {
      id: "g1",
      logic: "AND" as LogicOp,
      conditions: [
        { id: "c1", field: "price", operator: "less_than" as Operator, value: "15" },
        { id: "c2", field: "format", operator: "in" as Operator, value: "Modern" },
      ],
    },
  },
  {
    name: "Mythic Gainers",
    desc: "Mythics with positive 30d price change",
    group: {
      id: "g2",
      logic: "AND" as LogicOp,
      conditions: [
        { id: "c1", field: "rarity", operator: "equals" as Operator, value: "Mythic" },
        { id: "c2", field: "priceChange", operator: "greater_than" as Operator, value: "5" },
      ],
    },
  },
  {
    name: "Legacy Legal Blue",
    desc: "Blue cards legal in Legacy",
    group: {
      id: "g3",
      logic: "AND" as LogicOp,
      conditions: [
        { id: "c1", field: "color", operator: "in" as Operator, value: "Blue" },
        { id: "c2", field: "format", operator: "in" as Operator, value: "Legacy" },
      ],
    },
  },
];

function matchesCondition(card: any, cond: Condition): boolean {
  const field = QUERY_FIELDS.find(f => f.id === cond.field);
  if (!field) return true;
  const cardVal = (() => {
    if (cond.field === "price") return card.price;
    if (cond.field === "priceChange") return card.priceChangePercent;
    if (cond.field === "rarity") return card.rarity;
    if (cond.field === "name") return card.name;
    if (cond.field === "set") return card.set;
    if (cond.field === "type") return card.type;
    if (cond.field === "color") return card.colorIdentity;
    if (cond.field === "format") return card.formats.join(",");
    if (cond.field === "volume") return card.volume;
    return "";
  })();

  switch (cond.operator) {
    case "equals": return String(cardVal).toLowerCase() === cond.value.toLowerCase();
    case "contains": return String(cardVal).toLowerCase().includes(cond.value.toLowerCase());
    case "not_in": return !String(cardVal).toLowerCase().includes(cond.value.toLowerCase());
    case "greater_than": return parseFloat(String(cardVal)) > parseFloat(cond.value);
    case "less_than": return parseFloat(String(cardVal)) < parseFloat(cond.value);
    case "between": return parseFloat(String(cardVal)) >= parseFloat(cond.value) && parseFloat(String(cardVal)) <= parseFloat(cond.value2 || "999999");
    case "in": return String(cardVal).toLowerCase().includes(cond.value.toLowerCase());
    default: return true;
  }
}

function applyQuery(group: QueryGroup) {
  return MOCK_CARDS.filter(card => {
    if (group.logic === "AND") return group.conditions.every(c => matchesCondition(card, c));
    return group.conditions.some(c => matchesCondition(card, c));
  });
}

function newCondition(): Condition {
  return { id: Math.random().toString(36).slice(2), field: "name", operator: "contains", value: "" };
}

export function QueryBuilder() {
  const [group, setGroup] = useState<QueryGroup>({
    id: "g0",
    logic: "AND",
    conditions: [newCondition()],
  });
  const [results, setResults] = useState<typeof MOCK_CARDS>([]);
  const [hasRun, setHasRun] = useState(false);
  const [selectedColumns, setSelectedColumns] = useState(["name", "set", "rarity", "price", "priceChangePercent", "formats"]);
  const [showSQL, setShowSQL] = useState(false);
  const [savedQueries, setSavedQueries] = useState<string[]>([]);

  const addCondition = () => setGroup(g => ({ ...g, conditions: [...g.conditions, newCondition()] }));
  const removeCondition = (id: string) => setGroup(g => ({ ...g, conditions: g.conditions.filter(c => c.id !== id) }));
  const updateCondition = (id: string, update: Partial<Condition>) =>
    setGroup(g => ({ ...g, conditions: g.conditions.map(c => c.id === id ? { ...c, ...update } : c) }));
  const toggleLogic = () => setGroup(g => ({ ...g, logic: g.logic === "AND" ? "OR" : "AND" }));

  const runQuery = () => {
    setResults(applyQuery(group));
    setHasRun(true);
  };

  const loadPreset = (preset: typeof PRESET_QUERIES[0]) => {
    setGroup({ ...preset.group, id: "g0" });
    setHasRun(false);
  };

  const generateSQL = () => {
    const conditions = group.conditions.map(c => {
      const fieldLabel = QUERY_FIELDS.find(f => f.id === c.field)?.label || c.field;
      if (c.operator === "between") return `${fieldLabel} BETWEEN ${c.value} AND ${c.value2}`;
      if (c.operator === "contains") return `${fieldLabel} LIKE '%${c.value}%'`;
      if (c.operator === "in") return `'${c.value}' = ANY(${fieldLabel})`;
      return `${fieldLabel} ${c.operator === "equals" ? "=" : c.operator === "greater_than" ? ">" : "<"} '${c.value}'`;
    });
    return `SELECT *\nFROM cards\nWHERE\n  ${conditions.join(`\n  ${group.logic} `)}`;
  };

  const COLUMN_OPTIONS = [
    { key: "name", label: "Name" },
    { key: "set", label: "Set" },
    { key: "rarity", label: "Rarity" },
    { key: "type", label: "Type" },
    { key: "price", label: "Price" },
    { key: "priceChangePercent", label: "30d Change" },
    { key: "foilPrice", label: "Foil Price" },
    { key: "formats", label: "Formats" },
    { key: "volume", label: "Volume" },
  ];

  const toggleColumn = (key: string) =>
    setSelectedColumns(prev => prev.includes(key) ? prev.filter(c => c !== key) : [...prev, key]);

  return (
    <div className="bg-[#FFFEF0] min-h-screen">
      {/* Header */}
      <div className="border-b-2 border-black bg-white">
        <div className="max-w-screen-xl mx-auto px-4 py-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="inline-block text-xs font-bold px-2 py-0.5 bg-[#00C48C] text-white border border-black mb-1 uppercase tracking-widest" style={{ fontFamily: 'Space Mono' }}>
                Query Engine
              </div>
              <h1 className="text-2xl font-bold text-black">Query Builder</h1>
              <p className="text-sm text-gray-500">Build custom queries to filter and analyze card data</p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setShowSQL(!showSQL)}
                className={`flex items-center gap-1.5 px-3 py-2 border-2 border-black text-sm font-medium brutal-shadow-sm transition-colors ${showSQL ? "bg-[#0A0A0A] text-white" : "bg-white hover:bg-[#FFFEF0]"}`}
              >
                <Code2 className="w-3.5 h-3.5" /> SQL View
              </button>
              <button
                onClick={() => setSavedQueries(s => [...s, `Query ${s.length + 1}`])}
                className="flex items-center gap-1.5 px-3 py-2 border-2 border-black bg-white text-sm font-medium hover:bg-[#FFFEF0] brutal-shadow-sm"
              >
                <Save className="w-3.5 h-3.5" /> Save
              </button>
              <button
                onClick={runQuery}
                className="flex items-center gap-1.5 px-4 py-2 border-2 border-black bg-[#FFE234] text-sm font-bold hover:bg-[#f5d800] brutal-shadow-sm"
              >
                <Play className="w-4 h-4" /> Run Query
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-screen-xl mx-auto px-4 py-6 grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* ── Sidebar: Presets + Saved ──────────────── */}
        <div className="lg:col-span-1 space-y-4">
          {/* Preset Queries */}
          <div className="border-2 border-black bg-white brutal-shadow">
            <div className="border-b-2 border-black px-4 py-2.5 bg-[#0A0A0A]">
              <span className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                <Wand2 className="w-3.5 h-3.5 text-[#FFE234]" /> Preset Queries
              </span>
            </div>
            <div className="p-2 space-y-1">
              {PRESET_QUERIES.map((preset, i) => (
                <button
                  key={i}
                  onClick={() => loadPreset(preset)}
                  className="w-full text-left px-3 py-2.5 text-xs border border-black hover:bg-[#FFE234] transition-colors group"
                >
                  <div className="font-bold text-black group-hover:text-black">{preset.name}</div>
                  <div className="text-gray-400 mt-0.5">{preset.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Saved Queries */}
          {savedQueries.length > 0 && (
            <div className="border-2 border-black bg-white brutal-shadow">
              <div className="border-b-2 border-black px-4 py-2.5 bg-[#0A0A0A]">
                <span className="text-xs font-bold text-white uppercase tracking-wider">Saved Queries</span>
              </div>
              <div className="p-2 space-y-1">
                {savedQueries.map((q, i) => (
                  <div key={i} className="flex items-center justify-between px-3 py-2 border border-black/10 hover:bg-[#FFFEF0]">
                    <span className="text-xs font-medium text-black">{q}</span>
                    <button onClick={() => setSavedQueries(s => s.filter((_, j) => j !== i))} className="text-gray-400 hover:text-[#FF3B3B]">
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Available Fields */}
          <div className="border-2 border-black bg-white brutal-shadow">
            <div className="border-b-2 border-black px-4 py-2.5 bg-[#0A0A0A]">
              <span className="text-xs font-bold text-white uppercase tracking-wider">Field Reference</span>
            </div>
            <div className="p-3 space-y-1">
              {QUERY_FIELDS.map(f => (
                <div key={f.id} className="flex items-center justify-between py-1 border-b border-black/5 last:border-0">
                  <span className="text-xs font-medium text-black">{f.label}</span>
                  <span className="text-[9px] px-1.5 py-0.5 bg-[#FFFEF0] border border-black text-gray-500 uppercase" style={{ fontFamily: 'Space Mono' }}>{f.type}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Main: Query Editor ────────────────────── */}
        <div className="lg:col-span-3 space-y-4">
          {/* Query Builder */}
          <div className="border-2 border-black bg-white brutal-shadow">
            <div className="border-b-2 border-black px-4 py-2.5 flex items-center justify-between bg-[#FFFEF0]">
              <span className="text-xs font-bold text-black uppercase tracking-wider">Conditions</span>
              <button
                onClick={toggleLogic}
                className={`text-xs font-bold px-3 py-1 border-2 border-black transition-colors ${
                  group.logic === "AND" ? "bg-[#3B7EFF] text-white" : "bg-[#FF3B3B] text-white"
                }`}
              >
                Match {group.logic}
              </button>
            </div>

            <div className="p-4 space-y-3">
              {group.conditions.map((cond, idx) => {
                const field = QUERY_FIELDS.find(f => f.id === cond.field);
                const ops = OPERATORS[field?.type || "text"] || OPERATORS.text;
                return (
                  <div key={cond.id} className="flex items-start gap-2">
                    {/* Logic label */}
                    <div className="text-xs font-bold text-gray-400 pt-2.5 w-8 text-right shrink-0" style={{ fontFamily: 'Space Mono' }}>
                      {idx === 0 ? "WHERE" : group.logic}
                    </div>

                    <div className="flex-1 flex flex-wrap items-center gap-2 border-2 border-black px-3 py-2 bg-[#FFFEF0]">
                      {/* Field selector */}
                      <select
                        value={cond.field}
                        onChange={e => updateCondition(cond.id, { field: e.target.value, value: "", value2: "" })}
                        className="text-xs border border-black px-2 py-1 bg-white outline-none font-medium"
                        style={{ fontFamily: 'Space Grotesk' }}
                      >
                        {QUERY_FIELDS.map(f => <option key={f.id} value={f.id}>{f.label}</option>)}
                      </select>

                      {/* Operator selector */}
                      <select
                        value={cond.operator}
                        onChange={e => updateCondition(cond.id, { operator: e.target.value as Operator })}
                        className="text-xs border border-black px-2 py-1 bg-white outline-none font-medium"
                        style={{ fontFamily: 'Space Grotesk' }}
                      >
                        {ops.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                      </select>

                      {/* Value input */}
                      {field?.type === "select" || field?.type === "multiselect" ? (
                        <select
                          value={cond.value}
                          onChange={e => updateCondition(cond.id, { value: e.target.value })}
                          className="text-xs border border-black px-2 py-1 bg-white outline-none font-medium flex-1 min-w-24"
                          style={{ fontFamily: 'Space Grotesk' }}
                        >
                          <option value="">Select...</option>
                          {(field.options || []).map(o => <option key={o} value={o}>{o}</option>)}
                        </select>
                      ) : (
                        <input
                          value={cond.value}
                          onChange={e => updateCondition(cond.id, { value: e.target.value })}
                          placeholder={field?.type === "range" ? "Value..." : "Search value..."}
                          className="text-xs border border-black px-2 py-1 bg-white outline-none flex-1 min-w-24"
                          style={{ fontFamily: 'Space Grotesk' }}
                          type={field?.type === "range" ? "number" : "text"}
                        />
                      )}

                      {/* Second value for "between" */}
                      {cond.operator === "between" && (
                        <>
                          <span className="text-xs text-gray-400">and</span>
                          <input
                            value={cond.value2 || ""}
                            onChange={e => updateCondition(cond.id, { value2: e.target.value })}
                            placeholder="Max value..."
                            className="text-xs border border-black px-2 py-1 bg-white outline-none w-24"
                            type="number"
                            style={{ fontFamily: 'Space Grotesk' }}
                          />
                        </>
                      )}
                    </div>

                    {/* Remove */}
                    <button
                      onClick={() => removeCondition(cond.id)}
                      className="p-2 border-2 border-black text-gray-400 hover:text-[#FF3B3B] hover:border-[#FF3B3B] transition-colors shrink-0 mt-0.5"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                );
              })}

              <button
                onClick={addCondition}
                className="flex items-center gap-1.5 text-xs font-medium text-gray-500 hover:text-black border border-dashed border-gray-300 hover:border-black px-3 py-2 w-full transition-colors"
              >
                <Plus className="w-3.5 h-3.5" /> Add condition
              </button>
            </div>
          </div>

          {/* SQL View */}
          {showSQL && (
            <div className="border-2 border-black bg-[#0A0A0A] brutal-shadow">
              <div className="border-b-2 border-[#333] px-4 py-2.5 flex items-center justify-between">
                <span className="text-xs font-bold text-[#FFE234] uppercase tracking-wider">Generated SQL</span>
                <button
                  onClick={() => navigator.clipboard?.writeText(generateSQL())}
                  className="text-xs text-gray-400 hover:text-white flex items-center gap-1"
                >
                  <Copy className="w-3 h-3" /> Copy
                </button>
              </div>
              <div className="p-4">
                <pre className="text-[#00C48C] text-xs leading-relaxed" style={{ fontFamily: 'Space Mono' }}>
                  {generateSQL()}
                </pre>
              </div>
            </div>
          )}

          {/* Column Selector */}
          <div className="border-2 border-black bg-white brutal-shadow">
            <div className="border-b-2 border-black px-4 py-2.5 bg-[#FFFEF0] flex items-center gap-2">
              <Table className="w-3.5 h-3.5 text-black" />
              <span className="text-xs font-bold text-black uppercase tracking-wider">Output Columns</span>
            </div>
            <div className="p-3 flex flex-wrap gap-1.5">
              {COLUMN_OPTIONS.map(col => (
                <button
                  key={col.key}
                  onClick={() => toggleColumn(col.key)}
                  className={`text-xs px-2.5 py-1 border border-black font-medium transition-colors ${
                    selectedColumns.includes(col.key) ? "bg-[#FFE234]" : "bg-white text-gray-500 hover:bg-gray-50"
                  }`}
                >
                  {col.label}
                </button>
              ))}
            </div>
          </div>

          {/* Results */}
          {hasRun && (
            <div className="border-2 border-black bg-white brutal-shadow">
              <div className="border-b-2 border-black px-4 py-2.5 flex items-center justify-between bg-[#0A0A0A]">
                <span className="text-xs font-bold text-white uppercase tracking-wider">
                  Results — {results.length} card{results.length !== 1 ? "s" : ""} found
                </span>
                <div className="flex gap-2">
                  <button className="text-xs text-gray-400 hover:text-white flex items-center gap-1">
                    <Download className="w-3 h-3" /> CSV
                  </button>
                  <button className="text-xs text-gray-400 hover:text-white flex items-center gap-1">
                    <Copy className="w-3 h-3" /> JSON
                  </button>
                </div>
              </div>

              {results.length === 0 ? (
                <div className="px-4 py-10 text-center">
                  <Info className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                  <div className="text-sm text-gray-400">No cards match your query. Try adjusting your conditions.</div>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-black/10 bg-[#FFFEF0]">
                        {COLUMN_OPTIONS.filter(c => selectedColumns.includes(c.key)).map(col => (
                          <th key={col.key} className="text-left px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-gray-500">{col.label}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {results.map(card => (
                        <tr key={card.id} className="border-b border-black/5 hover:bg-[#FFFEF0] last:border-0">
                          {selectedColumns.includes("name") && (
                            <td className="px-3 py-2.5 font-bold text-black text-xs">{card.name}</td>
                          )}
                          {selectedColumns.includes("set") && (
                            <td className="px-3 py-2.5 text-xs text-gray-500">{card.set}</td>
                          )}
                          {selectedColumns.includes("rarity") && (
                            <td className="px-3 py-2.5">
                              <span className={`text-[9px] font-bold px-1.5 py-0.5 border border-black uppercase ${
                                card.rarity === "Mythic" ? "bg-orange-500 text-white" :
                                card.rarity === "Rare" ? "bg-yellow-600 text-white" : "bg-gray-100"
                              }`}>{card.rarity}</span>
                            </td>
                          )}
                          {selectedColumns.includes("type") && (
                            <td className="px-3 py-2.5 text-xs text-gray-600">{card.type}</td>
                          )}
                          {selectedColumns.includes("price") && (
                            <td className="px-3 py-2.5 font-bold text-xs" style={{ fontFamily: 'Space Mono' }}>${card.price.toFixed(2)}</td>
                          )}
                          {selectedColumns.includes("priceChangePercent") && (
                            <td className={`px-3 py-2.5 text-xs font-bold ${card.priceChangePercent >= 0 ? "text-[#00C48C]" : "text-[#FF3B3B]"}`} style={{ fontFamily: 'Space Mono' }}>
                              {card.priceChangePercent >= 0 ? "+" : ""}{card.priceChangePercent.toFixed(1)}%
                            </td>
                          )}
                          {selectedColumns.includes("foilPrice") && (
                            <td className="px-3 py-2.5 text-xs text-[#3B7EFF]" style={{ fontFamily: 'Space Mono' }}>${card.foilPrice.toFixed(2)}</td>
                          )}
                          {selectedColumns.includes("formats") && (
                            <td className="px-3 py-2.5">
                              <div className="flex flex-wrap gap-1">
                                {card.formats.slice(0, 2).map(f => (
                                  <span key={f} className="text-[9px] px-1 py-0.5 bg-[#3B7EFF] text-white border border-black">{f.slice(0, 3)}</span>
                                ))}
                              </div>
                            </td>
                          )}
                          {selectedColumns.includes("volume") && (
                            <td className="px-3 py-2.5 text-xs" style={{ fontFamily: 'Space Mono' }}>{card.volume.toLocaleString()}</td>
                          )}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
