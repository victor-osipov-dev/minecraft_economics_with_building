// Gap analysis for the scheme library: counts categories + keyword subcategories
// against the city-building targets. Usage: node tools/gaps.mjs
import fs from "node:fs";

const ROOT = "C:/Projects/minecraft_economics_with_building";
const idx = JSON.parse(fs.readFileSync(`${ROOT}/schemes/index.json`, "utf8"));
const items = idx.items || idx;

const TARGETS = {
  roads: 20,
  intersections: 15,
  residential: 30,
  commercial: 15,
  public: 15,
  towers: 15,
  parks: 10,
  industrial: 10,
  transport: 10,
  bridges: 20,
  decor: 30,
  vehicles: 30,
  waterfront: 10,
};

const TOPICS = [
  ["road segment", ["road", "street", "avenue", "highway", "lane", "roadway", "asphalt", "pavement", "curb", "sidewalk"]],
  ["intersection", ["intersection", "crossroad", "crossing", "roundabout", "junction", "traffic light", "traffic-light", "stoplight"]],
  ["marking/sign", ["sign", "marking", "zebra", "crosswalk", "cone", "bollard"]],
  ["street lamp", ["lamp", "streetlight", "street light", "light post", "lantern post"]],
  ["bus", ["bus ", "busstop", "bus-stop", "bus stop", "trolleybus", "tram"]],
  ["train/rail", ["train", "rail", "railway", "metro", "subway", "locomotive"]],
  ["airport", ["airport", "plane", "aircraft", "runway"]],
  ["parking", ["parking", "garage"]],
  ["house", ["house", "home", "villa", "cottage", "cabin", "bungalow", "mansion"]],
  ["townhouse", ["townhouse", "town house", "duplex", "row house", "terraced"]],
  ["apartment", ["apartment", "condo", "residence", "housing", "flat"]],
  ["skyscraper", ["skyscraper", "highrise", "high-rise", "tower", "office tower"]],
  ["shop/mall", ["shop", "store", "mall", "market", "supermarket", "grocery", "boutique", "retail"]],
  ["cafe/restaurant", ["cafe", "coffee", "restaurant", "bar", "pub", "diner", "pizzeria", "bakery"]],
  ["gas station", ["gas station", "petrol", "fuel", "filling station"]],
  ["school", ["school", "university", "kindergarten", "academy", "college"]],
  ["hospital", ["hospital", "clinic", "medical center", "medical centre"]],
  ["police/fire", ["police", "fire station", "firehouse", "sheriff"]],
  ["city hall/civic", ["city hall", "town hall", "courthouse", "municipal", "civic"]],
  ["library/museum", ["library", "museum", "gallery"]],
  ["stadium/sport", ["stadium", "arena", "sport", "gym", "pool"]],
  ["theatre/cinema", ["theatre", "theater", "cinema", "movie"]],
  ["bank", ["bank"]],
  ["park/playground", ["park", "playground", "garden", "plaza", "square", "square ", "green", "recreation"]],
  ["fountain", ["fountain"]],
  ["bench/decor", ["bench", "bench ", "statue", "fountain", "planter", "trash", "bin ", "dumpster", "mailbox", "vending"]],
  ["fence/railing", ["fence", "railing", "guardrail", "barrier", "wall "]],
  ["factory/warehouse", ["factory", "warehouse", "plant", "mill", "industrial", "workshop", "shed"]],
  ["power", ["power", "substation", "solar", "windmill", "turbine", "electricity"]],
  ["port", ["port", "harbor", "harbour", "dock", "pier", "quay", "marina", "crane", "container"]],
  ["ship/boat", ["ship", "boat", "yacht", "barge", "ferry"]],
  ["car/vehicle", ["car", "truck", "taxi", "van", "bus", "ambulance", "police car", "motorcycle", "bike", "bicycle"]],
  ["bridge", ["bridge", "viaduct", "overpass", "tunnel"]],
  ["tree/nature", ["tree", "bush", "tree "]],
  ["sign/advertisement", ["billboard", "advertisement", "billboard", "sign "]],
  ["wall/segment kit", ["wall", "segment", "tile", "module", "kit", "pack"]],
];

function hay(it) {
  return `${it.name} ${it.file}`.toLowerCase();
}

const byCat = {};
for (const it of items) byCat[it.category] = (byCat[it.category] || 0) + 1;

console.log("=== CATEGORIES vs targets ===");
for (const [cat, target] of Object.entries(TARGETS)) {
  const n = byCat[cat] || 0;
  console.log(`${n >= target ? "OK  " : "GAP "} ${cat.padEnd(16)} ${String(n).padStart(4)} / ${target}`);
}
console.log(`(total ${items.length})`);

console.log("\n=== SUBTOPICS (name match) ===");
const rows = [];
for (const [label, keys] of TOPICS) {
  const hits = items.filter((it) => keys.some((k) => hay(it).includes(k)));
  rows.push([label, hits.length]);
}
rows.sort((a, b) => a[1] - b[1]);
for (const [label, n] of rows) console.log(`${String(n).padStart(4)}  ${label}`);
