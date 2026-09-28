import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
const DEST = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..", "schemes");
const catalog = JSON.parse(fs.readFileSync(`${DEST}/catalog.json`, "utf8"));

const TAG_RULES = [
  ["modern", ["modern", "contemporary", "futurist"]],
  ["tower", ["tower", "skyscraper", "highrise", "high-rise"]],
  ["tall", []],
  ["house", ["house", "home", "villa", "cottage", "cabin", "bungalow", "mansion", "chateau"]],
  ["apartment", ["apartment", "condo", "residence", "dormitory"]],
  ["shop", ["shop", "store", "mall", "market", "boutique", "kiosk", "stall"]],
  ["road", ["road", "street", "avenue", "highway", "lane"]],
  ["bridge", ["bridge", "viaduct"]],
  ["church", ["church", "chapel", "cathedral"]],
  ["school", ["school", "university", "kindergarten", "academy"]],
  ["hospital", ["hospital", "clinic", "medical"]],
  ["park", ["park", "garden", "plaza", "square", "playground", "gazebo"]],
  ["fountain", ["fountain"]],
  ["tree", ["tree", "oak", "birch", "spruce", "sakura", "cherry", "palm"]],
  ["car", ["car", "truck", "taxi", "van", "pickup", "race"]],
  ["boat", ["boat", "yacht", "ship", "dock", "harbor", "pier"]],
  ["hotel", ["hotel", "motel", "inn"]],
  ["office", ["office"]],
  ["bank", ["bank"]],
  ["station", ["station", "depot", "terminal"]],
  ["stadium", ["stadium", "arena"]],
  ["museum", ["museum", "gallery"]],
  ["library", ["library"]],
  ["pool", ["pool", "pond"]],
  ["parking", ["parking", "garage"]],
  ["castle-like", ["castle", "fort", "keep"]],
  ["water", ["pool", "pond", "fountain", "dock", "pier", "harbor", "lighthouse"]],
  ["small", []],
  ["huge", []],
];

const items = [];
const tagSet = new Set();
let missingThumb = 0;
for (const e of catalog) {
  const base = e.file.replace(/\.(schem|schematic|nbt)$/i, "");
  const thumb = `thumbs/${base}.png`;
  if (!fs.existsSync(`${DEST}/${thumb}`)) missingThumb++;
  const hay = `${e.name} ${e.slug}`.toLowerCase();
  const tags = new Set();
  for (const [tag, keys] of TAG_RULES) {
    if (tag === "tall" || tag === "small" || tag === "huge") continue;
    if (keys.some((k) => hay.includes(k))) tags.add(tag);
  }
  if (e.height > 40) tags.add("tall");
  const vol = e.width * e.height * e.length;
  tags.add(vol < 2000 ? "tiny" : vol < 15000 ? "small" : vol < 120000 ? "medium" : vol < 500000 ? "large" : "huge");
  for (const t of tags) tagSet.add(t);
  items.push({
    file: e.file,
    name: e.name,
    category: e.category,
    w: e.width,
    h: e.height,
    l: e.length,
    blocks: e.blocks,
    tags: [...tags].sort(),
    thumb,
  });
}
const allTags = [...tagSet].sort();
fs.writeFileSync(`${DEST}/index.json`, JSON.stringify({ version: 1, count: items.length, tags: allTags, items }));
console.log(`items=${items.length} tags=${allTags.length} missingThumbs=${missingThumb}`);
console.log(allTags.join(", "));
