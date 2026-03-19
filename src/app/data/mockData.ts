export interface MTGCard {
  id: string;
  name: string;
  set: string;
  setCode: string;
  rarity: 'Common' | 'Uncommon' | 'Rare' | 'Mythic' | 'Special';
  manaCost: string;
  type: string;
  subtype?: string;
  text: string;
  power?: string;
  toughness?: string;
  price: number;
  priceChange: number;
  priceChangePercent: number;
  foilPrice: number;
  weekHigh: number;
  weekLow: number;
  monthHigh: number;
  monthLow: number;
  allTimeHigh: number;
  volume: number;
  formats: string[];
  colors: string[];
  colorIdentity: string;
  image: string;
  artist: string;
  flavorText?: string;
}

export interface PricePoint {
  date: string;
  price: number;
  foilPrice: number;
  volume: number;
}

export interface DeckArchetype {
  id: string;
  name: string;
  format: string;
  metaShare: number;
  winRate: number;
  avgPrice: number;
  colors: string[];
  trend: 'up' | 'down' | 'stable';
  topCards: string[];
}

export interface MarketStat {
  label: string;
  value: string;
  change: string;
  changePercent: number;
  positive: boolean;
}

// ─── Card Images (using Unsplash) ───────────────────────────────────────────
const CARD_IMAGES = {
  dragon: "https://images.unsplash.com/photo-1764264136582-9bc4c5800596?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400",
  wizard: "https://images.unsplash.com/photo-1635779389310-fc20d01ce0f4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400",
  knight: "https://images.unsplash.com/photo-1734122373993-36745ac6b688?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400",
  phoenix: "https://images.unsplash.com/photo-1669205617241-bf837080affd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400",
  forest: "https://images.unsplash.com/photo-1762765018961-3e482e0415b2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400",
  ruins: "https://images.unsplash.com/photo-1717671996335-2b1812e4f305?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400",
  cards: "https://images.unsplash.com/photo-1637757969279-c4d028905131?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400",
};

// ─── Mock MTG Cards ──────────────────────────────────────────────────────────
export const MOCK_CARDS: MTGCard[] = [
  {
    id: "c001",
    name: "Jace, the Mind Sculptor",
    set: "Worldwake",
    setCode: "WWK",
    rarity: "Mythic",
    manaCost: "{2}{U}{U}",
    type: "Legendary Planeswalker",
    subtype: "Jace",
    text: "+2: Look at the top card of target player's library. You may put that card on the bottom of that player's library.\n0: Draw three cards, then put two cards from your hand on top of your library in any order.\n−1: Return target creature to its owner's hand.\n−12: Exile all cards from target player's library, then that player shuffles their hand into their library.",
    price: 89.50,
    priceChange: 12.30,
    priceChangePercent: 15.9,
    foilPrice: 380.00,
    weekHigh: 92.00,
    weekLow: 77.20,
    monthHigh: 95.50,
    monthLow: 71.00,
    allTimeHigh: 150.00,
    volume: 1247,
    formats: ["Legacy", "Vintage", "Commander"],
    colors: ["U"],
    colorIdentity: "Blue",
    image: CARD_IMAGES.wizard,
    artist: "Jason Chan",
    flavorText: "\"The very nature of thought is malleable.\""
  },
  {
    id: "c002",
    name: "Liliana of the Veil",
    set: "Innistrad",
    setCode: "ISD",
    rarity: "Mythic",
    manaCost: "{1}{B}{B}",
    type: "Legendary Planeswalker",
    subtype: "Liliana",
    text: "+1: Each player discards a card.\n−2: Target player sacrifices a creature.\n−6: Separate all permanents target player controls into two piles. That player sacrifices all permanents in the pile of their choice.",
    price: 62.00,
    priceChange: -4.20,
    priceChangePercent: -6.3,
    foilPrice: 280.00,
    weekHigh: 68.50,
    weekLow: 61.00,
    monthHigh: 74.00,
    monthLow: 58.00,
    allTimeHigh: 120.00,
    volume: 892,
    formats: ["Modern", "Legacy", "Vintage", "Commander"],
    colors: ["B"],
    colorIdentity: "Black",
    image: CARD_IMAGES.phoenix,
    artist: "Steve Argyle",
    flavorText: "\"I have no use for regret.\""
  },
  {
    id: "c003",
    name: "Ragavan, Nimble Pilferer",
    set: "Modern Horizons 2",
    setCode: "MH2",
    rarity: "Mythic",
    manaCost: "{R}",
    type: "Legendary Creature",
    subtype: "Monkey Pirate",
    text: "Dash {1}{R}\nWhenever Ragavan, Nimble Pilferer deals combat damage to a player, create a Treasure token and exile the top card of that player's library. Until end of turn, you may cast that spell.",
    power: "2",
    toughness: "1",
    price: 45.00,
    priceChange: 3.50,
    priceChangePercent: 8.4,
    foilPrice: 175.00,
    weekHigh: 47.50,
    weekLow: 41.00,
    monthHigh: 52.00,
    monthLow: 38.50,
    allTimeHigh: 80.00,
    volume: 2341,
    formats: ["Modern", "Legacy", "Vintage", "Commander"],
    colors: ["R"],
    colorIdentity: "Red",
    image: CARD_IMAGES.knight,
    artist: "Simon Dominic",
  },
  {
    id: "c004",
    name: "Wrenn and Six",
    set: "Modern Horizons",
    setCode: "MH1",
    rarity: "Mythic",
    manaCost: "{R}{G}",
    type: "Legendary Planeswalker",
    subtype: "Wrenn",
    text: "+1: Return up to one target land card from your graveyard to your hand.\n−1: Wrenn and Six deals 1 damage to any target.\n−7: You get an emblem with \"Instant and sorcery cards in your graveyard have retrace.\"",
    price: 55.75,
    priceChange: 7.25,
    priceChangePercent: 14.9,
    foilPrice: 220.00,
    weekHigh: 58.00,
    weekLow: 48.50,
    monthHigh: 61.00,
    monthLow: 43.00,
    allTimeHigh: 90.00,
    volume: 1102,
    formats: ["Modern", "Legacy", "Vintage", "Commander"],
    colors: ["R", "G"],
    colorIdentity: "Red/Green",
    image: CARD_IMAGES.forest,
    artist: "Lie Setiawan",
    flavorText: "\"Together we are infinite.\""
  },
  {
    id: "c005",
    name: "Force of Will",
    set: "Alliances",
    setCode: "ALL",
    rarity: "Uncommon",
    manaCost: "{3}{U}{U}",
    type: "Instant",
    text: "You may pay 1 life and exile a blue card from your hand rather than pay this spell's mana cost.\nCounter target spell.",
    price: 118.00,
    priceChange: -8.00,
    priceChangePercent: -6.4,
    foilPrice: 890.00,
    weekHigh: 125.00,
    weekLow: 115.00,
    monthHigh: 132.00,
    monthLow: 110.00,
    allTimeHigh: 175.00,
    volume: 621,
    formats: ["Legacy", "Vintage", "Commander"],
    colors: ["U"],
    colorIdentity: "Blue",
    image: CARD_IMAGES.dragon,
    artist: "Terese Nielsen",
    flavorText: "\"There are no true negations, only assertions of a more complex truth.\""
  },
  {
    id: "c006",
    name: "Tarmogoyf",
    set: "Future Sight",
    setCode: "FUT",
    rarity: "Rare",
    manaCost: "{1}{G}",
    type: "Creature",
    subtype: "Lhurgoyf",
    text: "Tarmogoyf's power is equal to the number of card types among cards in all graveyards and its toughness is equal to that number plus 1.",
    power: "*",
    toughness: "1+*",
    price: 34.50,
    priceChange: -1.20,
    priceChangePercent: -3.4,
    foilPrice: 185.00,
    weekHigh: 37.00,
    weekLow: 33.00,
    monthHigh: 40.00,
    monthLow: 30.50,
    allTimeHigh: 200.00,
    volume: 1876,
    formats: ["Modern", "Legacy", "Vintage", "Commander"],
    colors: ["G"],
    colorIdentity: "Green",
    image: CARD_IMAGES.ruins,
    artist: "Kev Walker",
  },
  {
    id: "c007",
    name: "Uro, Titan of Nature's Wrath",
    set: "Theros Beyond Death",
    setCode: "THB",
    rarity: "Mythic",
    manaCost: "{1}{G}{U}",
    type: "Legendary Creature",
    subtype: "Elder Giant",
    text: "When Uro enters the battlefield, sacrifice it unless it escaped.\nWhenever Uro enters the battlefield or attacks, you gain 3 life and draw a card, then you may put a land card from your hand onto the battlefield.\nEscape—{G}{G}{U}{U}, Exile five other cards from your graveyard.",
    power: "6",
    toughness: "6",
    price: 12.80,
    priceChange: 0.60,
    priceChangePercent: 4.9,
    foilPrice: 48.00,
    weekHigh: 13.50,
    weekLow: 11.90,
    monthHigh: 15.00,
    monthLow: 11.00,
    allTimeHigh: 55.00,
    volume: 1543,
    formats: ["Commander", "Vintage"],
    colors: ["G", "U"],
    colorIdentity: "Green/Blue",
    image: CARD_IMAGES.wizard,
    artist: "Vincent Proce",
  },
  {
    id: "c008",
    name: "Emrakul, the Aeons Torn",
    set: "Rise of the Eldrazi",
    setCode: "ROE",
    rarity: "Mythic",
    manaCost: "{15}",
    type: "Legendary Creature",
    subtype: "Eldrazi",
    text: "This spell can't be countered.\nWhen you cast this spell, take an extra turn after this one.\nFlying, protection from colored spells, annihilator 6\nWhen Emrakul, the Aeons Torn is put into a graveyard from anywhere, its owner shuffles their graveyard into their library.",
    power: "15",
    toughness: "15",
    price: 28.50,
    priceChange: 2.10,
    priceChangePercent: 7.9,
    foilPrice: 155.00,
    weekHigh: 30.00,
    weekLow: 26.00,
    monthHigh: 32.00,
    monthLow: 24.00,
    allTimeHigh: 60.00,
    volume: 789,
    formats: ["Legacy", "Vintage", "Commander"],
    colors: [],
    colorIdentity: "Colorless",
    image: CARD_IMAGES.dragon,
    artist: "Mark Tedin",
    flavorText: "\"Eons ago she tore a hole in the Blind Eternities and drifted into this plane. The plane has never recovered.\""
  },
];

// ─── Price History ───────────────────────────────────────────────────────────
export function generatePriceHistory(basePrice: number, days: number = 90): PricePoint[] {
  const history: PricePoint[] = [];
  let price = basePrice * 0.7;
  const now = new Date();

  for (let i = days; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    const volatility = (Math.random() - 0.45) * price * 0.05;
    price = Math.max(price + volatility, basePrice * 0.3);
    history.push({
      date: date.toISOString().split('T')[0],
      price: parseFloat(price.toFixed(2)),
      foilPrice: parseFloat((price * 3.8 + Math.random() * 10).toFixed(2)),
      volume: Math.floor(Math.random() * 500 + 200),
    });
  }
  return history;
}

// ─── Metagame Data ───────────────────────────────────────────────────────────
export const DECK_ARCHETYPES: DeckArchetype[] = [
  { id: "d001", name: "Izzet Murktide", format: "Modern", metaShare: 14.2, winRate: 54.8, avgPrice: 780, colors: ["U", "R"], trend: "up", topCards: ["Murktide Regent", "Dragon's Rage Channeler", "Ragavan"] },
  { id: "d002", name: "Amulet Titan", format: "Modern", metaShare: 11.5, winRate: 53.2, avgPrice: 950, colors: ["G"], trend: "stable", topCards: ["Primeval Titan", "Amulet of Vigor", "Tolaria West"] },
  { id: "d003", name: "Hammer Time", format: "Modern", metaShare: 10.8, winRate: 55.1, avgPrice: 650, colors: ["W"], trend: "up", topCards: ["Colossus Hammer", "Urza's Saga", "Stoneforge Mystic"] },
  { id: "d004", name: "Living End", format: "Modern", metaShare: 9.3, winRate: 51.6, avgPrice: 420, colors: ["B", "G", "R"], trend: "down", topCards: ["Living End", "Grief", "Shardless Agent"] },
  { id: "d005", name: "Yawgmoth Combo", format: "Modern", metaShare: 8.7, winRate: 56.3, avgPrice: 1100, colors: ["B", "G"], trend: "up", topCards: ["Yawgmoth", "Undying Evil", "Young Wolf"] },
  { id: "d006", name: "Storm", format: "Legacy", metaShare: 12.1, winRate: 52.4, avgPrice: 2800, colors: ["U", "R"], trend: "down", topCards: ["Grapeshot", "Goblin Electromancer", "Past in Flames"] },
  { id: "d007", name: "UR Delver", format: "Legacy", metaShare: 18.4, winRate: 56.8, avgPrice: 3200, colors: ["U", "R"], trend: "up", topCards: ["Delver of Secrets", "Force of Will", "Daze"] },
  { id: "d008", name: "Reanimator", format: "Legacy", metaShare: 9.8, winRate: 53.7, avgPrice: 1800, colors: ["B", "U"], trend: "stable", topCards: ["Reanimate", "Griselbrand", "Entomb"] },
];

// ─── Market Stats ─────────────────────────────────────────────────────────────
export const MARKET_STATS: MarketStat[] = [
  { label: "MTG Market Cap", value: "$2.4B", change: "+$142M", changePercent: 6.3, positive: true },
  { label: "Total Volume (24h)", value: "847K", change: "+12K", changePercent: 1.4, positive: true },
  { label: "Cards Tracked", value: "98,234", change: "+1,432", changePercent: 1.5, positive: true },
  { label: "Avg Card Price", value: "$4.82", change: "-$0.18", changePercent: -3.6, positive: false },
  { label: "Top Gainer (24h)", value: "Mox Ruby +23%", change: "+$45.20", changePercent: 23.1, positive: true },
  { label: "Top Loser (24h)", value: "Tamiyo -11%", change: "-$8.40", changePercent: -11.2, positive: false },
];

// ─── Top Movers ───────────────────────────────────────────────────────────────
export const TOP_MOVERS = [
  { name: "Mox Ruby", set: "Alpha", price: 245.00, change: 23.1, positive: true },
  { name: "Jace, TMS", set: "Worldwake", price: 89.50, change: 15.9, positive: true },
  { name: "Wrenn and Six", set: "MH1", price: 55.75, change: 14.9, positive: true },
  { name: "Ragavan", set: "MH2", price: 45.00, change: 8.4, positive: true },
  { name: "Tamiyo", set: "MOM", price: 68.50, change: -11.2, positive: false },
  { name: "Liliana of Veil", set: "ISD", price: 62.00, change: -6.3, positive: false },
  { name: "Force of Will", set: "ALL", price: 118.00, change: -6.4, positive: false },
  { name: "Tarmogoyf", set: "FUT", price: 34.50, change: -3.4, positive: false },
];

// ─── Format meta share data for pie chart ────────────────────────────────────
export const FORMAT_DATA = [
  { name: "Commander", value: 42, fill: "#FFE234" },
  { name: "Modern", value: 28, fill: "#3B7EFF" },
  { name: "Legacy", value: 15, fill: "#FF3B3B" },
  { name: "Standard", value: 10, fill: "#00C48C" },
  { name: "Vintage", value: 5, fill: "#9B59B6" },
];

// ─── Query Builder fields ─────────────────────────────────────────────────────
export const QUERY_FIELDS = [
  { id: "name", label: "Card Name", type: "text" },
  { id: "set", label: "Set", type: "text" },
  { id: "rarity", label: "Rarity", type: "select", options: ["Common", "Uncommon", "Rare", "Mythic"] },
  { id: "color", label: "Color", type: "multiselect", options: ["White", "Blue", "Black", "Red", "Green", "Colorless"] },
  { id: "type", label: "Card Type", type: "select", options: ["Creature", "Instant", "Sorcery", "Enchantment", "Artifact", "Planeswalker", "Land"] },
  { id: "price", label: "Price (USD)", type: "range" },
  { id: "priceChange", label: "Price Change %", type: "range" },
  { id: "format", label: "Format", type: "multiselect", options: ["Standard", "Modern", "Legacy", "Vintage", "Commander"] },
  { id: "cmc", label: "Mana Value", type: "range" },
  { id: "volume", label: "Volume (24h)", type: "range" },
];

// ─── Mana symbols ─────────────────────────────────────────────────────────────
export const COLOR_SYMBOLS: Record<string, { bg: string; label: string; symbol: string }> = {
  W: { bg: "#F9F6D2", label: "White", symbol: "W" },
  U: { bg: "#C1D7E9", label: "Blue", symbol: "U" },
  B: { bg: "#C2C0C0", label: "Black", symbol: "B" },
  R: { bg: "#F4A26B", label: "Red", symbol: "R" },
  G: { bg: "#9BD3AE", label: "Green", symbol: "G" },
  C: { bg: "#E8E8E8", label: "Colorless", symbol: "C" },
};
