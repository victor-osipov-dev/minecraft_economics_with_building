// Metadata audit: name vs category vs tags, without looking at images.
// Produces reports/metadata_audit.json — one record per build.
// Usage: node tools/metadata-audit.mjs
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const DEST = path.join(ROOT, "schemes");
const OUT = path.join(ROOT, "reports");
fs.mkdirSync(OUT, { recursive: true });

const idx = JSON.parse(fs.readFileSync(path.join(DEST, "index.json"), "utf8"));
const cat = JSON.parse(fs.readFileSync(path.join(DEST, "catalog.json"), "utf8"));
const byFile = new Map(cat.map((e) => [e.file, e]));

// Category signature: which words in a name suggest which category.
const CAT_KEYS = {
  residential: ["house", "home", "villa", "cottage", "cabin", "bungalow", "mansion", "townhouse", "row house", "terraced", "apartment", "condo", "residence", "housing", "flat", "duplex", "suburban", "family house"],
  commercial: ["shop", "store", "mall", "market", "supermarket", "grocery", "boutique", "retail", "cafe", "coffee", "restaurant", "bar ", "pub", "bakery", "bank", "office", "hotel", "motel", "mall", "plaza", "kiosk", "showroom", "diner", "bazaar", "warehouse store"],
  public: ["school", "university", "college", "library", "museum", "hospital", "clinic", "police", "fire station", "firehouse", "city hall", "town hall", "courthouse", "church", "cathedral", "chapel", "temple", "mosque", "stadium", "arena", "theatre", "theater", "cinema", "post office", "bank ", "embassy", "prison", "court", "community", "civic", "kindergarten", "academy", "observatory"],
  towers: ["tower", "skyscraper", "highrise", "high-rise", "high tower", "spire", "office tower", "bell tower", "watch tower"],
  parks: ["park", "garden", "playground", "botanical", "plaza park", "green", "picnic", "zoo", "fountain park"],
  industrial: ["factory", "plant", "refinery", "warehouse", "industrial", "workshop", "mill", "silo", "foundry", "power plant", "powerplant", "water plant", "waterplant", "treatment", "depot", "hangar", "mine", "quarry", "junkyard", "scrapyard", "landfill", "brewery"],
  transport: ["station", "airport", "terminal", "train", "railway", "metro", "subway", "bus station", "harbor", "harbour", "port", "dock", "pier", "airfield", "platform", "hangar"],
  bridges: ["bridge", "overpass", "viaduct", "aqueduct", "footbridge"],
  roads: ["road", "street", "avenue", "highway", "lane", "roadway", "sidewalk", "curb", "pavement", "crosswalk", "tunnel", "toll booth", "roundabout", "asphalt"],
  intersections: ["intersection", "crossroad", "junction", "stoplight", "traffic light", "traffic-light", "crossing", "4 way", "four way", "t-junction"],
  vehicles: ["car", "truck", "bus", "taxi", "van", "ambulance", "police car", "motorcycle", "bike", "bicycle", "boat", "ship", "yacht", "ferry", "tank", "train ", "locomotive", "trailer", "excavator", "crane truck", "tractor", "jeep", "suv", "limousine"],
  waterfront: ["waterfront", "beach", "dock", "pier", "marina", "seaside", "coast", "harbor front", "quay", "boat house", "boathouse", "lighthouse", "canal", "river", "lake", "swamp", "underwater", "island"],
  decor: ["bench", "lamp", "streetlight", "street light", "sign", "billboard", "fountain", "statue", "monument", "planter", "trash", "bollard", "flag", "tree", "bush", "hedge", "pot", "scarecrow", "well", "swing", "playground set", "treehouse"],
};

// Words that say "this is not real-life architecture" (project rule) or "not a building".
const FRANCHISE = ["avengers", "fallout", "minecraft", "mario", "krusty", "jurassic", "star wars", "batman", "disney", "harry potter", "hogwarts", "skyrim", "zelda", "pokemon", "spongebob", "simpsons", "gotham", "willy wonka", "hunger games", "game of thrones", "lord of the rings", "spider", "iron man", "captain america", "thanos", "minions", "shrek", "peppa", "fortnite", "roblox", "among us", "pikachu", "naruto", "one piece", "attack on titan", "warcraft", "diablo", "doom", "halo ", "gta", "cs ", "counter strike", "sonic", "mickey", "batman", "superman", "joker", "paw patrol", "frozen", "toy story", "minion"];
const FANTASY = ["medieval", "fantasy", "blacksmith", "castle", "knight", "dragon", "wizard", "dwarf", "elven", "elf ", "tavern", "kingdom", "fortress", "steampunk", "airship", "viking", "pirate", "nether", "end ", "elytra", "spooky", "haunted", "magic", "witch", "hobbit", "orc", "goblin", "throne", "royal", "sultan", "sultanate", "pharaoh", "aztec", "mayan", "ruins of", "ancient temple", "jungle temple", "skyblock", "floating island", "arena", "pvp", "dungeon", "spawn hub", "lobby", "survival base", "starter base"];
const NON_BUILDING = ["pixel art", "painting", "logo", "banner", "redstone", "farm ", "farms", "machine", "contraption", "elevator", "door ", "gate ", "wall kit", "tile set", "texture", "skin", "character", "mob ", "statue of a person", "car ", "truck", "bus "];

const re = (words) => new RegExp(`\\b(?:${words.map((w) => w.trim().replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|")})`, "i");

function categoryFit(name, category) {
  const n = ` ${name.toLowerCase()} `;
  const scores = {};
  for (const [cat, keys] of Object.entries(CAT_KEYS)) {
    let s = 0;
    for (const k of keys) if (n.includes(k)) s++;
    if (s) scores[cat] = s;
  }
  const own = scores[category] || 0;
  delete scores[category];
  const best = Object.entries(scores).sort((a, b) => b[1] - a[1])[0];
  if (!best) return { verdict: own ? "name-supports" : "name-silent", suggested: null, hits: own };
  if (own && best[1] <= own) return { verdict: "name-supports", suggested: null, hits: own };
  if (own) return { verdict: "name-conflict", suggested: best[0], hits: best[1], ownHits: own };
  return { verdict: "name-elsewhere", suggested: best[0], hits: best[1], ownHits: 0 };
}

const nameCount = new Map();
for (const it of idx.items) nameCount.set(it.name.toLowerCase(), (nameCount.get(it.name.toLowerCase()) || 0) + 1);

const rows = [];
for (const it of idx.items) {
  const meta = byFile.get(it.file) || {};
  const n = it.name.toLowerCase();
  const hay = `${it.name} ${it.file}`.toLowerCase();

  const flags = [];
  if (re(FRANCHISE).test(n)) flags.push("franchise");
  if (re(FANTASY).test(n)) flags.push("non-real/fantasy");
  if (re(NON_BUILDING).test(n)) flags.push("non-building-in-name");
  if (/\b(build|builds|map|schematic|structure|concept|wip|test|template|tutorial|made in|for minecraft|edition|v\d+)\b/.test(n)) flags.push("meta-word-in-name");
  if (nameCount.get(n) > 1) flags.push("duplicate-name");
  if (!it.thumb) flags.push("no-thumb");
  if (!it.blocks || it.blocks < 20) flags.push("almost-empty");
  if (it.w * it.h * it.l > 1_200_000) flags.push("huge-volume");

  const cf = categoryFit(it.name, it.category);

  // tags come from the name only (thumbs-index.mjs), so check internal consistency
  const tagIssues = [];
  const want = (t, cond) => { if (cond && !it.tags.includes(t)) tagIssues.push(`missing:${t}`); if (!cond && it.tags.includes(t) && !["large", "medium", "small", "tiny", "huge", "tall"].includes(t)) tagIssues.push(`extra:${t}`); };
  want("bridge", /\bbridge|viaduct|aqueduct/i.test(it.name) || it.category === "bridges");
  want("tower", /\btower|skyscraper|spire/i.test(it.name));
  want("road", /\broad|street|highway|avenue|lane/i.test(it.name));
  want("modern", /\bmodern|contemporary/i.test(it.name));
  want("house", /\bhouse|villa|cottage|mansion|bungalow|home\b/i.test(it.name));
  want("school", /\bschool|academy|kindergarten|university|college\b/i.test(it.name));
  want("hospital", /\bhospital|clinic|medical/i.test(it.name));
  want("stadium", /\bstadium|arena|sports/i.test(it.name));
  want("station", /\bstation|terminal\b/i.test(it.name));
  want("church", /\bchurch|cathedral|chapel/i.test(it.name));
  want("pool", /\bpool\b/i.test(it.name));
  want("parking", /\bparking|car park/i.test(it.name));
  want("boat", /\bboat|ship|yacht|ferry|barge/i.test(it.name));
  want("car", /\bcar\b|suv|limo/i.test(it.name));
  want("bank", /\bbank\b/i.test(it.name));
  want("library", /\blibrary\b/i.test(it.name));
  want("museum", /\bmuseum\b/i.test(it.name));
  want("fountain", /\bfountain\b/i.test(it.name));
  want("park", /\bpark\b|garden/i.test(it.name));
  want("apartment", /\bapartment|condo|residence\b/i.test(it.name));
  want("office", /\boffice\b/i.test(it.name));
  want("hotel", /\bhotel|motel|resort\b/i.test(it.name));
  want("shop", /\bshop|store|mall|market|boutique\b/i.test(it.name));

  rows.push({
    file: it.file,
    name: it.name,
    category: it.category,
    tags: it.tags,
    dims: `${it.w}x${it.h}x${it.l}`,
    blocks: it.blocks,
    thumb: path.join(DEST, it.thumb),
    flags,
    catFit: cf,
    tagIssues,
    author: meta.author || "",
    source: meta.source || "",
    status: meta.status || "",
  });
}

fs.writeFileSync(path.join(OUT, "metadata_audit.json"), JSON.stringify(rows, null, 1));

// quick console summary
const flagCount = {};
for (const r of rows) for (const f of r.flags) flagCount[f] = (flagCount[f] || 0) + 1;
const catFitCount = {};
for (const r of rows) catFitCount[r.catFit.verdict] = (catFitCount[r.catFit.verdict] || 0) + 1;
const withTagIssues = rows.filter((r) => r.tagIssues.length).length;
console.log(`items=${rows.length}`);
console.log("flags:", JSON.stringify(flagCount));
console.log("catFit:", JSON.stringify(catFitCount));
console.log(`tagIssues=${withTagIssues}`);
console.log("\nname points to another category (sample):");
for (const r of rows.filter((r) => r.catFit.verdict === "name-elsewhere").slice(0, 25))
  console.log(`  [${r.category}->${r.catFit.suggested}] ${r.name}`);
