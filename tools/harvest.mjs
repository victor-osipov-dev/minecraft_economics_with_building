// Gap-filling harvester for the city schematic library.
//
// Reads the game's own parser (src/schematic.js) to verify every download,
// dedupes by sha256, classifies into the game's 13 categories, writes
// <category>_<slug>_<source>_<version>.<ext>, appends catalog.json and
// download_log.csv.
//
// Usage:
//   node tools/harvest.mjs --plan            # run the built-in gap plan
//   node tools/harvest.mjs --source mcmod --q "roundabout" --max 10
//   node tools/harvest.mjs --source mcmod --cat 12363 --max 40
//   node tools/harvest.mjs --dry             # discover only, no download
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { fileURLToPath } from "node:url";
import { parseSchematicFile } from "../src/schematic.js";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const SCHEMES = path.join(ROOT, "schemes");
const CATALOG_PATH = path.join(SCHEMES, "catalog.json");
const LOG_PATH = path.join(SCHEMES, "download_log.csv");

const UA =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0 Safari/537.36";
const SUPPORTED_FORMATS = new Set([".schem", ".schematic", ".nbt"]);
const GAP_MS = 140;

// ---------------------------------------------------------------- state ----
const catalog = JSON.parse(fs.readFileSync(CATALOG_PATH, "utf8"));
const knownPages = new Set(catalog.map((e) => e.page_url).filter(Boolean));
const knownHashes = new Set(catalog.map((e) => e.hash).filter(Boolean));
const knownFiles = new Set(catalog.map((e) => e.file).filter(Boolean));
const knownDownloads = new Set(catalog.map((e) => e.download_url).filter(Boolean));
let nextId = catalog.reduce((m, e) => Math.max(m, Number(e.id) || 0), 0) + 1;

const stats = { downloaded: 0, duplicate: 0, failed: 0, unsupported: 0, skipped: 0 };
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

let lastCall = 0;
async function politeness() {
  const wait = lastCall + GAP_MS - Date.now();
  if (wait > 0) await sleep(wait);
  lastCall = Date.now();
}

function csv(v) {
  return `"${String(v ?? "").replace(/"/g, '""')}"`;
}
function logRow(row) {
  const line = [
    new Date().toISOString(),
    row.source,
    row.page_url,
    row.file_name,
    row.download_url,
    row.status,
    row.error,
    row.notes,
  ]
    .map(csv)
    .join(",");
  fs.appendFileSync(LOG_PATH, line + "\n");
}
function saveCatalog() {
  fs.writeFileSync(CATALOG_PATH, JSON.stringify(catalog, null, 4));
}
function say(msg) {
  console.log(msg);
}

// ----------------------------------------------------------------- http ----
async function httpGet(url, { referer, cookie, tries = 3, accept } = {}) {
  let lastErr;
  for (let i = 0; i < tries; i++) {
    await politeness();
    try {
      const headers = { "user-agent": UA, accept: accept || "*/*" };
      if (referer) headers.referer = referer;
      if (cookie) headers.cookie = cookie;
      const r = await fetch(url, { headers, redirect: "follow" });
      if (r.status >= 400) {
        const err = new Error(`HTTP ${r.status}`);
        err.status = r.status;
        throw err;
      }
      const buf = new Uint8Array(await r.arrayBuffer());
      const setCookie = typeof r.headers.getSetCookie === "function" ? r.headers.getSetCookie() : [];
      return { buf, status: r.status, type: r.headers.get("content-type") || "", setCookie, url: r.url };
    } catch (e) {
      lastErr = e;
      if (e.status && e.status < 500 && e.status !== 429) break;
      await sleep(500 * (i + 1));
    }
  }
  throw lastErr;
}
async function httpText(url, opts) {
  const r = await httpGet(url, opts);
  return { ...r, text: new TextDecoder("utf-8").decode(r.buf) };
}
function cookiesOf(setCookie) {
  return setCookie.map((c) => String(c).split(";")[0]).join("; ");
}
function decodeEntities(s) {
  return String(s)
    .replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(Number(n)))
    .replace(/&#x([0-9a-f]+);/gi, (_, n) => String.fromCodePoint(parseInt(n, 16)))
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#039;|&apos;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&nbsp;/g, " ")
    .replace(/&middot;/g, "·")
    .replace(/&times;/g, "x");
}

// ----------------------------------------------------------- classifier ----
// Game categories (must stay inside src/city/buildingTypes.js CATEGORY_FALLBACK).
const NAME_RULES = [
  ["intersections", /\b(intersection|roundabout|crossroad|crossroads|junction)\b|traffic[\s-]?(light|signal|lights)|stoplight/i],
  ["roads", /\b(road|roads|street|streets|avenue|highway|freeway|boulevard|lane|lanes|roadway|sidewalk|pavement|crosswalk|asphalt|tarmac|underpass|tunnel)\b/i],
  ["bridges", /\b(bridge|bridges|viaduct|overpass|aqueduct|footbridge)\b/i],
  ["vehicles", /\b(car|cars|truck|trucks|bus|buses|taxi|van|motorcycle|motorbike|bicycle|bike|ambulance|vehicle|vehicles|locomotive|wagon|tram|trolley|jeep|pickup|trailer)\b/i],
  [
    "transport",
    /\b(station|airport|runway|terminal|depot|parking|metro|subway|railway|railroad|platform|hangar|bus[\s-]?stop|junction)\b/i,
  ],
  ["waterfront", /\b(port|harbor|harbour|dock|docks|pier|piers|quay|marina|lighthouse|ship|boats?|yacht|ferry|barge|wharf|shipyard)\b/i],
  [
    "industrial",
    /\b(factory|factories|warehouse|plant|power[\s-]?plant|powerhouse|substation|solar|turbine|mill|industrial|workshop|silo|refinery|landfill|recycling|incinerator|foundry|depot|quarry)\b/i,
  ],
  [
    "parks",
    /\b(park|parks|garden|gardens|playground|fountain|plaza|square|courtyard|green|nursery)\b|tree\b|bush\b|hedge/i,
  ],
  [
    "public",
    /\b(school|university|college|academy|kindergarten|hospital|clinic|medical|police|fire[\s-]?station|firehouse|city[\s-]?hall|town[\s-]?hall|courthouse|municipal|library|museum|gallery|church|chapel|cathedral|stadium|arena|theatre|theater|cinema|prison|jail|embassy|post[\s-]?office|court)\b/i,
  ],
  [
    "commercial",
    /\b(shop|shops|store|stores|mall|market|supermarket|grocery|cafe|coffee|restaurant|pub|diner|pizzeria|bakery|hotel|motel|gas[\s-]?station|petrol|dealership|bank|boutique|kiosk|mall|mall|store)\b/i,
  ],
  ["towers", /\b(skyscraper|highrise|high-rise|tower|office building|office block|office tower)\b/i],
  [
    "residential",
    /\b(house|houses|home|villa|mansion|cottage|cabin|bungalow|apartment|condo|townhouse|duplex|residence|housing|dorm|residential|row house|terraced)\b/i,
  ],
];

const SOURCE_CAT_MAP = {
  transportation: "transport",
  vehicles: "vehicles",
  "ground-vehicles": "vehicles",
  "cars-and-trains": "vehicles",
  boats: "waterfront",
  "boats-and-ships": "waterfront",
  component: "decor",
  "outdoor-decors": "decor",
  decoration: "decor",
  gardens: "parks",
  trees: "parks",
  towns: "public",
  exterior: "public",
  towers: "towers",
  houses: "residential",
  "houses-and-shops": "residential",
  structure: "public",
  structures: "public",
  "miscellaneous": "public",
  transportation_: "transport",
};

function classify(hay, sourceCat, dims) {
  for (const [cat, re] of NAME_RULES) if (re.test(hay)) return cat;
  if (sourceCat && SOURCE_CAT_MAP[sourceCat]) return SOURCE_CAT_MAP[sourceCat];
  const vol = dims ? dims.W * dims.H * dims.L : 0;
  return vol > 0 && vol < 1500 ? "decor" : "public";
}

// Fantasy, franchises, pixel art, farms and redstone are not city architecture.
const SKIP_RE =
  /(pixel[\s-]?art|painting|statue|sculpture|farm\b|farms\b|mob\s|dungeon|nether\b|end\s*city|pokemon|pvp\b|parkour|minigame|flying machine|contraption|elevator|boss|raid\b|medieval|castle|fantasy|airship|spaceship|space station|dragonball|star wars|tie fighter|aircraft carrier|frigate|galleon|pirate|warship|man o war|navy\b|helicopter|military|tank\b|fighter jet|jet fighter|bomber|arena\b|skyblock|villager|spawner|beacon|mage\b|wizard|sauron|magic\b|krusty|mario\b|jurassic|christmas|halloween|santa\b|pepperkake|igloo|mushroom house|zombie|skull house|schematic test|world download|schematic of me|my house test)/i;

function slugify(s, max = 58) {
  return (
    String(s)
      .toLowerCase()
      .normalize("NFKD")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, max)
      .replace(/-+$/g, "") || "build"
  );
}
function isPlausibleBytes(buf) {
  if (!buf || buf.length < 64) return false;
  const head = new TextDecoder("latin1").decode(buf.slice(0, 200));
  if (/^\s*<!doctype|^\s*<html|^\s*<\?xml/i.test(head)) return false;
  const b0 = buf[0],
    b1 = buf[1];
  const gzip = b0 === 0x1f && b1 === 0x8b;
  const zlib = b0 === 0x78;
  const rawNbt = b0 === 0x0a || b0 === 0x09;
  return gzip || zlib || rawNbt;
}

// --------------------------------------------------------------- ingest ----
async function ingest(cand, opts = {}) {
  const key = cand.pageUrl || cand.downloadUrl;
  if (knownPages.has(key) || knownDownloads.has(cand.downloadUrl)) {
    stats.skipped++;
    return { ok: false, reason: "known-page" };
  }
  knownDownloads.add(cand.downloadUrl); // several items often share one file
  if (SKIP_RE.test(cand.title)) {
    stats.skipped++;
    logRow({
      source: cand.source,
      page_url: cand.pageUrl,
      file_name: "",
      download_url: cand.downloadUrl,
      status: "skipped",
      error: "",
      notes: "not city architecture",
    });
    return { ok: false, reason: "skip-title" };
  }

  let bytes;
  try {
    const res = await getCandidateBytes(cand);
    bytes = res;
  } catch (e) {
    stats.failed++;
    logRow({
      source: cand.source,
      page_url: cand.pageUrl,
      file_name: "",
      download_url: cand.downloadUrl,
      status: "failed",
      error: String(e.message || e).slice(0, 160),
      notes: cand.title,
    });
    return { ok: false, reason: "download" };
  }

  if (!isPlausibleBytes(bytes)) {
    stats.failed++;
    logRow({
      source: cand.source,
      page_url: cand.pageUrl,
      file_name: "",
      download_url: cand.downloadUrl,
      status: "failed",
      error: "not a schematic file (html/empty)",
      notes: cand.title,
    });
    return { ok: false, reason: "not-file" };
  }

  const hash = crypto.createHash("sha256").update(bytes).digest("hex");
  if (knownHashes.has(hash)) {
    stats.duplicate++;
    logRow({
      source: cand.source,
      page_url: cand.pageUrl,
      file_name: "",
      download_url: cand.downloadUrl,
      status: "duplicate",
      error: "",
      notes: "sha256 already in library",
    });
    return { ok: false, reason: "duplicate" };
  }

  let plan;
  try {
    plan = parseSchematicFile(bytes);
  } catch (e) {
    stats.unsupported++;
    logRow({
      source: cand.source,
      page_url: cand.pageUrl,
      file_name: "",
      download_url: cand.downloadUrl,
      status: "incompatible",
      error: String(e.message || e).slice(0, 160),
      notes: cand.title,
    });
    return { ok: false, reason: "parse" };
  }

  const { W, H, L, blocks } = plan;
  if (!blocks.length || W < 1 || L < 1 || H < 1 || W > 600 || L > 600 || H > 300 || blocks.length > 700000) {
    stats.unsupported++;
    logRow({
      source: cand.source,
      page_url: cand.pageUrl,
      file_name: "",
      download_url: cand.downloadUrl,
      status: "incompatible",
      error: "",
      notes: `bad dimensions ${W}x${H}x${L} blocks=${blocks.length}`,
    });
    return { ok: false, reason: "dims" };
  }

  const hay = `${cand.title} ${cand.slug || ""}`.toLowerCase();
  const category = classify(hay, cand.sourceCat, { W, H, L });
  const ext = path.extname(new URL(cand.downloadUrl || cand.pageUrl).pathname).toLowerCase() ||
    SUPPORTED_FORMATS.has((cand.format || "").toLowerCase()) ? (cand.format || ".schem").toLowerCase() : ".schem";
  const cleanExt = SUPPORTED_FORMATS.has(ext) ? ext : ".schem";
  const version = cand.mcVersion ? String(cand.mcVersion).replace(/[^0-9.]/g, "").replace(/^\.|\.$/g, "") : "";
  const slug = slugify(cand.slug || cand.title);
  let base = `${category}_${slug}_${cand.source}_${version || "x"}`;
  let file = `${base}${cleanExt}`;
  let n = 2;
  while (knownFiles.has(file) || fs.existsSync(path.join(SCHEMES, file))) file = `${base}-${n++}${cleanExt}`;

  const unsupported = plan.unsupportedCount || 0;
  const simplified = plan.simplifiedCount || 0;
  const ratio = unsupported / Math.max(1, blocks.length);
  let status = "verified";
  if (ratio > 0.5 && unsupported >= 10) status = "review";
  else if (H > 64) status = "verified-tall";

  const entry = {
    id: nextId++,
    slug,
    name: cand.title,
    category,
    source: cand.source,
    page_url: cand.pageUrl || "",
    download_url: cand.downloadUrl || "",
    author: cand.author || "",
    minecraft_version: cand.mcVersion || "",
    format: plan.format,
    width: W,
    height: H,
    length: L,
    blocks: blocks.length,
    file_size: bytes.length,
    hash,
    unsupported_entries: unsupported,
    simplified_entries: simplified,
    status,
    notes: status === "verified-tall" ? "height clipped at 64 in game" : "",
    file,
  };

  fs.writeFileSync(path.join(SCHEMES, file), bytes);
  knownFiles.add(file);
  knownHashes.add(hash);
  knownPages.add(key);
  catalog.push(entry);
  saveCatalog();
  stats.downloaded++;

  logRow({
    source: cand.source,
    page_url: cand.pageUrl,
    file_name: file,
    download_url: cand.downloadUrl,
    status: "downloaded",
    error: "",
    notes: `${W}x${H}x${L}, ${blocks.length} blocks${status === "review" ? ", many unmapped blocks" : ""}`,
  });
  say(`  + ${file}  ${W}x${H}x${L} ${blocks.length}b ${status}`);
  return { ok: true, entry };
}

// Sources may need a session/signed link dance before the real bytes arrive.
async function getCandidateBytes(cand) {
  if (cand.fetchKind === "mcbuild") return mcbuildFile(cand);
  const r = await httpGet(cand.downloadUrl, { referer: cand.pageUrl });
  return r.buf;
}

// -------------------------------------------------------------- mcbuild ----
async function mcbuildFile(cand) {
  const page = await httpText(cand.pageUrl, { accept: "text/html" });
  const cookie = cookiesOf(page.setCookie);
  const offered = [...page.text.matchAll(/\/download\/schematic=\d+\?format=(schem|schematic|nbt)/g)].map((m) => m[1]);
  if (!offered.length) throw new Error("no download formats on page");
  const order = ["schem", "schematic", "nbt"].filter((f) => offered.includes(f));
  let lastErr = new Error("no signed link");
  for (const fmt of order) {
    const gateUrl = `https://mcbuild.org/download/schematic=${cand.id}?format=${fmt}`;
    const gate = await httpText(gateUrl, { referer: cand.pageUrl, cookie, accept: "text/html" });
    const m = gate.text.match(/var\s+file\s*=\s*'([^']+)'/);
    if (!m) {
      lastErr = new Error(`no signed link for ${fmt}`);
      continue;
    }
    const signed = new URL(m[1], "https://mcbuild.org").href;
    const file = await httpGet(signed, { referer: cand.pageUrl, cookie, accept: "*/*" });
    const head = file.buf[0] === 0x3c; // "<" -> the gate page, not the file
    if (file.buf.length > 64 && !head) return file.buf;
    lastErr = new Error(`signed link for ${fmt} returned html`);
  }
  throw lastErr;
}

// ================================================================ sources ===
const MCMOD_API = "https://www.mc-mod.net/wp-json/wp/v2";

async function mcmodTaxonomies() {
  const r = await httpText(`${MCMOD_API}/schematic_category?per_page=100`);
  const list = JSON.parse(r.text);
  const map = {};
  for (const t of list) map[t.id] = t.slug;
  return map;
}

async function mcmodList(params, maxPages = 6) {
  const out = [];
  for (let page = 1; page <= maxPages; page++) {
    const url =
      `${MCMOD_API}/schematic?per_page=100&page=${page}` +
      `&_fields=id,slug,title,link,meta,schematic_category&${params}`;
    const r = await httpText(url, { accept: "application/json" });
    let list;
    try {
      list = JSON.parse(r.text);
    } catch {
      break;
    }
    if (!Array.isArray(list) || !list.length) break;
    out.push(...list);
    if (list.length < 100) break;
  }
  return out;
}

function mcmodCandidate(it, taxMap) {
  const meta = it.meta || {};
  const title = decodeEntities(it.title.rendered).trim();
  const fmt = String(meta.sc_format || "").toLowerCase().trim();
  if (!SUPPORTED_FORMATS.has(fmt)) return null;
  let dl = meta.sc_viewer_url || "";
  if (!dl && meta.sc_download_url) {
    const m = String(meta.sc_download_url).match(/[?&]file=([^&]+)/);
    if (m) dl = `https://dl2.9minecraft.net/dl2storage800/${m[1]}`;
  }
  if (!dl) return null;
  const catIds = it.schematic_category || [];
  const sourceCat = catIds.map((id) => taxMap[id]).filter(Boolean)[0] || "";
  return {
    source: "mc-mod",
    pageUrl: it.link,
    downloadUrl: dl,
    title,
    slug: it.slug,
    format: fmt,
    author: meta.sc_source_author || "",
    mcVersion: meta.sc_mc_version || "",
    sourceCat,
    query: it.__query || "",
  };
}

// mc-mod search matches post body text too, so keep only results where at
// least one query word appears in the title/slug (OR keeps "traffic light"
// -> "Modern City Stoplight" working).
function titleMatchesQuery(title, slug, q) {
  const hay = `${title} ${slug}`.toLowerCase();
  return String(q)
    .toLowerCase()
    .split(/[^a-z0-9]+/)
    .filter((w) => w.length > 2)
    .some((w) => hay.includes(w));
}

async function discoverMcmod({ cat, q, max }, taxMap) {
  const params = [];
  if (cat) params.push(`schematic_category=${cat}`);
  if (q) params.push(`search=${encodeURIComponent(q)}`);
  const list = await mcmodList(params.join("&"), q ? 3 : 6);
  const out = [];
  for (const it of list) {
    if (q) it.__query = q;
    const c = mcmodCandidate(it, taxMap);
    if (c && (!q || titleMatchesQuery(c.title, c.slug, q))) out.push(c);
  }
  return out.slice(0, max || 40);
}

// ------------------------------------------------------ buildschematics ----
async function discoverBuildschematics({ q, max }) {
  const url = `https://buildschematics.com/presets/search?q=${encodeURIComponent(q)}`;
  const r = await httpText(url, { accept: "text/html" });
  const slugs = [...new Set([...r.text.matchAll(/href="\/presets\/([a-z0-9-]+)"/g)].map((m) => m[1]))]
    .filter((s) => s !== "search" && !s.startsWith("search"));
  const out = [];
  for (const slug of slugs.slice(0, max || 10)) {
    const pageUrl = `https://buildschematics.com/presets/${slug}`;
    const p = await httpText(pageUrl, { accept: "text/html" });
    const direct = p.text.match(/https:\/\/dl2\.9mcbox\.com\/dl2storage800\/([^"'\s]+)/);
    const gate = p.text.match(/https:\/\/dl2\.buildschematics\.com\/dl2\.php\?file=([^"'\s]+)/);
    const file = direct ? direct[1] : gate ? gate[1] : "";
    if (!file) continue;
    const dl = direct
      ? direct[0]
      : `https://dl2.9mcbox.com/dl2storage800/${file}`;
    const title = decodeEntities((p.text.match(/<title>([^<]+)<\/title>/) || [])[1] || slug)
      .replace(/\s*\|\s*BuildSchematics.*$/i, "")
      .replace(/\s+by\s+[^|]+$/i, "")
      .trim();
    const author = decodeEntities((p.text.match(/<title>[^<]*\sby\s([^|<]+)\|/i) || [])[1] || "").trim();
    const ext = (file.match(/\.(schem|schematic|nbt)$/) || [])[1];
    if (!ext) continue;
    out.push({
      source: "buildschematics",
      pageUrl,
      downloadUrl: dl,
      title: title || slug,
      slug,
      format: `.${ext}`,
      author,
      mcVersion: "",
      sourceCat: "",
      query: q,
    });
  }
  return out;
}

// --------------------------------------------------------------- mcbuild ---
async function discoverMcbuild({ q, max }) {
  const r = await httpText(`https://mcbuild.org/search?q=${encodeURIComponent(q)}`, { accept: "text/html" });
  const slugs = {};
  for (const m of r.text.matchAll(/href="\/schematics\/(\d+):([^"]+)"/g)) if (!slugs[m[1]]) slugs[m[1]] = m[2];
  const cards = [...r.text.matchAll(/data-id="(\d+)" data-title="([^"]+)"/g)].map((m) => ({
    id: m[1],
    title: decodeEntities(m[2]).trim(),
  }));
  const out = [];
  for (const c of cards) {
    const slug = slugs[c.id];
    if (!slug) continue;
    if (q && !titleMatchesQuery(c.title, slug, q)) continue;
    const pageUrl = `https://mcbuild.org/schematics/${c.id}:${slug}`;
    out.push({
      source: "mcbuild",
      pageUrl,
      downloadUrl: `https://mcbuild.org/download/schematic=${c.id}?format=schem`,
      id: c.id,
      fetchKind: "mcbuild",
      title: c.title,
      slug,
      format: ".schem",
      author: "",
      mcVersion: "",
      sourceCat: "",
      query: q,
    });
    if (out.length >= (max || 8)) break;
  }
  return out;
}

// =============================================================== gap plan ===
// Stage 1 works off a local index of the whole mc-mod catalogue (~10k items).
// Their search endpoint matches post body text, so local title matching against
// a complete index is both cheaper and far more precise.
const INDEX_PATH = path.join(ROOT, "tools", "mcmod-index.json");

function mcmodIndexEntry(it) {
  const meta = it.meta || {};
  let dl = meta.sc_viewer_url || "";
  if (!dl && meta.sc_download_url) {
    const m = String(meta.sc_download_url).match(/[?&]file=([^&]+)/);
    if (m) dl = `https://dl2.9minecraft.net/dl2storage800/${m[1]}`;
  }
  return {
    id: it.id,
    slug: it.slug,
    title: decodeEntities(it.title.rendered).trim(),
    link: it.link,
    format: String(meta.sc_format || "").toLowerCase().trim(),
    dl,
    author: meta.sc_source_author || "",
    mcver: meta.sc_mc_version || "",
    size: meta.sc_size || "",
    cats: it.schematic_category || [],
  };
}

async function buildMcmodIndex() {
  const out = [];
  for (let page = 1; ; page++) {
    const url =
      `${MCMOD_API}/schematic?per_page=100&page=${page}&orderby=id&order=asc` +
      `&_fields=id,slug,title,link,meta,schematic_category`;
    const r = await httpText(url, { accept: "application/json" });
    let list;
    try {
      list = JSON.parse(r.text);
    } catch {
      break;
    }
    if (!Array.isArray(list) || !list.length) break;
    for (const it of list) out.push(mcmodIndexEntry(it));
    if (list.length < 100) break;
    if (page % 20 === 0) say(`  ...index page ${page} (${out.length} items)`);
  }
  fs.writeFileSync(INDEX_PATH, JSON.stringify(out));
  say(`  index built: ${out.length} items -> ${INDEX_PATH}`);
  return out;
}

function candidateFromIndexEntry(e, taxMap) {
  if (!SUPPORTED_FORMATS.has(e.format) || !e.dl) return null;
  const sourceCat = (e.cats || []).map((id) => taxMap[id]).filter(Boolean)[0] || "";
  return {
    source: "mc-mod",
    pageUrl: e.link,
    downloadUrl: e.dl,
    title: e.title,
    slug: e.slug,
    format: e.format,
    author: e.author,
    mcVersion: e.mcver,
    sourceCat,
  };
}

// [label, title regex, download cap]
const TOPICS = [
  // hard gaps
  [
    "intersections",
    /intersection|roundabout|crossroad|crossings?\b|junction|stoplight|traffic (light|signal|lights)|zebra cross/i,
    30,
  ],
  [
    "roads / streets",
    /\broads?\b|\bstreets?\b|avenue|highway|freeway|boulevard|sidewalk|pavement|crosswalk|\blanes?\b|roadway|tarmac|toll booth/i,
    35,
  ],
  [
    "street furniture / decor",
    /street ?lamp|streetlight|lamp post|light post|billboard|mailbox|mail box|trash|dumpster|garbage|bollard|hydrant|traffic cone|planter|vending|phone booth|street sign|road sign|fence|railing|guardrail|\bbench/i,
    45,
  ],
  [
    "vehicles",
    /\bcars?\b|trucks?\b|\bbuses?\b|bus stop|taxi|\bvans?\b|motorcycle|bicycle|\bbikes?\b|ambulance|police car|fire truck|tow truck|delivery|\bpickup\b|jeep|\bsuv\b|limo|trams?\b|trolley|tractor|trailer/i,
    50,
  ],
  [
    "transport hubs",
    /airport|runway|airfield|\bterminals?\b|railway|railroad|\bstations?\b|\bdepot\b|parking|metro\b|subway|\bplatform\b|hangar|car park|multi-story garage/i,
    40,
  ],
  [
    "waterfront",
    /\bharbou?rs?\b|\bdocks?\b|\bpiers?\b|\bquay\b|marina|lighthouse|\bports?\b|shipyard|wharf|ferry|\byachts?\b|\bboats?\b|\bships?\b|canal/i,
    30,
  ],
  [
    "public / civic",
    /hospital|clinic|police|fire (station|house|dept)|city hall|town hall|courthouse|municipal|librar|musuem|museum|stadium|arena|theat|cinema|movie|\bschools?\b|university|college|kindergarten|preschool|prison|jail|embassy|post office|community center|firestation/i,
    50,
  ],
  [
    "industry / utilities",
    /factor|warehouse|power (plant|station|house)|substation|powerplant|\bplants?\b|landfill|water tower|\bsilos?\b|refinery|industrial|\bmills?\b|workshop|foundry|solar|wind turbine|recycling|incinerator|water (plant|treatment)/i,
    40,
  ],
  [
    "commerce",
    /shops?\b|stores?\b|\bmalls?\b|markets?\b|supermarket|grocery|\bcafes?\b|restaurants?|\bhotels?\b|gas station|petrol|bakery|\bbanks?\b|dealership|kiosk|boutique|diner|pizzeria|coffee/i,
    40,
  ],
  [
    "towers / offices",
    /skyscraper|high ?rise|\btowers?\b|office (building|block|tower)|highrise/i,
    35,
  ],
  [
    "residential",
    /townhouse|town house|\bduplex\b|apartments?\b|\bcondos?\b|mansion|\bvillas?\b|cottage|\bhouses?\b|\bhomes?\b|residence|terraced|row house/i,
    45,
  ],
  [
    "parks / public space",
    /\bparks?\b|gardens?\b|playground|fountain|\bplazas?\b|\bsquares?\b|\btrees?\b|\bbushes?\b|hedges?\b|botanical|skatepark|picnic/i,
    40,
  ],
];

// Per-topic sub-buckets. Selection round-robins over them so one loud family
// (dump trucks, blacksmith shops, tower spam) cannot eat a whole category.
const TOPIC_BUCKETS = {
  intersections: [/\bintersections?\b/i, /roundabout|crossroad/i, /stoplight|traffic/i, /crossing/i],
  "roads / streets": [
    /\broads?\b|\bstreets?\b/i,
    /highway|expressway|freeway|avenue|boulevard/i,
    /sidewalk|crosswalk|pavement|\blanes?\b/i,
    /toll booth|tunnel|underpass/i,
  ],
  "street furniture / decor": [
    /lamp|streetlight|lantern/i,
    /billboard|advertisement|\bsigns?\b/i,
    /trash|dumpster|garbage|mailbox|bin\b/i,
    /\bbench/i,
    /fence|railing|guardrail/i,
    /planter|hydrant|bollard|vending|container/i,
  ],
  vehicles: [
    /\bcars?\b|\bjeep\b|\bsuv\b|limo|pickup/i,
    /trucks?\b|tractor|trailer|excavator|crane/i,
    /\bbuses?\b|trolley|trams?\b/i,
    /\btaxis?\b/i,
    /bicycle|\bbikes?\b|motorcycle|scooter/i,
    /ambulance|police|fire (truck|engine)|tow truck|garbage/i,
    /\bvans?\b/i,
  ],
  "transport hubs": [
    /airport|runway|airfield|hangar/i,
    /train station|railway|railroad|\bdepot\b|\bplatform\b/i,
    /parking|garage/i,
    /metro\b|subway/i,
    /bus (stop|station|shelter|terminal)/i,
    /\bterminal\b/i,
    /gas station|fuel|fueling/i,
  ],
  waterfront: [
    /harbou?r|\bport\b|\bdocks?\b|\bpiers?\b|\bquay\b|shipyard|marina/i,
    /lighthouse/i,
    /\bboats?\b|\byachts?\b/i,
    /\bships?\b/i,
    /canal|waterfront|seaside/i,
  ],
  "public / civic": [
    /hospital|clinic/i,
    /police/i,
    /fire (station|house|dept)/i,
    /city hall|town hall|courthouse|municipal/i,
    /librar/i,
    /museum|gallery/i,
    /school|university|college|academy|kindergarten/i,
    /stadium|sports? cent(er|re)/i,
    /theat|cinema|movie/i,
    /prison|jail/i,
    /church|chapel|cathedral/i,
    /post office|embassy|community cent(er|re)/i,
  ],
  "industry / utilities": [
    /factor/i,
    /warehouse/i,
    /power|substation|solar|turbine/i,
    /landfill|recycling|incinerator/i,
    /water (tower|plant|treatment)/i,
    /silo|refinery|\bmills?\b/i,
    /industrial|workshop|foundry/i,
  ],
  commerce: [
    /\bshops?\b|\bstores?\b/i,
    /market|supermarket|grocery/i,
    /cafes?|coffee|restaurants?|diner|pizzeria|bakery/i,
    /hotels?|motel/i,
    /gas station|petrol|dealership/i,
    /\bbanks?\b/i,
    /\bmalls?\b/i,
  ],
  "towers / offices": [
    /skyscraper|high ?rise|highrise/i,
    /office/i,
    /\btowers?\b/i,
    /apartment|condo|residence/i,
  ],
  residential: [
    /\bhouses?\b|\bhomes?\b/i,
    /villa|mansion|manor|estate/i,
    /apartment|condo|residence/i,
    /townhouse|town house|duplex|terraced/i,
    /cottage|cabin|bungalow/i,
  ],
  "parks / public space": [
    /\bparks?\b|playground|skatepark/i,
    /gardens?\b/i,
    /fountain/i,
    /\btrees?\b|\bbushes?\b|\bhedges?\b/i,
    /plaza|square/i,
    /pond|pool|lake/i,
  ],
};

function pickRoundRobin(list, buckets, max) {
  if (!buckets || !buckets.length) return list.slice(0, max);
  const out = [];
  const used = new Set();
  const key = (e) => e.id ?? e.pageUrl;
  const queues = buckets.map((re) => list.filter((e) => re.test(e.title)));
  const ptr = queues.map(() => 0);
  let progress = true;
  while (out.length < max && progress) {
    progress = false;
    for (let b = 0; b < queues.length && out.length < max; b++) {
      const q = queues[b];
      while (ptr[b] < q.length && used.has(key(q[ptr[b]]))) ptr[b]++;
      if (ptr[b] < q.length) {
        const e = q[ptr[b]++];
        used.add(key(e));
        out.push(e);
        progress = true;
      }
    }
  }
  if (out.length < max) {
    for (const e of list) {
      if (used.has(key(e))) continue;
      out.push(e);
      if (out.length >= max) break;
    }
  }
  return out;
}
// Stage 2: the two other reachable sources (buildschematics.com, mcbuild.org),
// narrowed to the categories that stage 1 leaves thin.
const WEB_QUERIES = [
  "roundabout",
  "intersection",
  "crossroads",
  "traffic light",
  "road",
  "street lamp",
  "sidewalk",
  "bus stop",
  "airport",
  "hospital",
  "police station",
  "fire station",
  "city hall",
  "town hall",
  "theater",
  "cinema",
  "power plant",
  "substation",
  "landfill",
  "water tower",
  "billboard",
  "bench",
  "mailbox",
  "dumpster",
  "gas station",
  "supermarket",
  "school",
  "stadium",
  "prison",
  "warehouse",
  "parking",
  "taxi",
  "bicycle",
  "ambulance",
  "train station",
  "tunnel",
  "playground",
  "fountain",
  "lighthouse",
  "townhouse",
  "office building",
];

async function runWebPlan(dry) {
  for (const q of WEB_QUERIES) {
    for (const [name, fn, max] of [
      ["buildschematics", discoverBuildschematics, 5],
      ["mcbuild", discoverMcbuild, 4],
    ]) {
      let cands;
      try {
        cands = await fn({ q, max });
      } catch (e) {
        say(`  ! ${name} "${q}": ${e.message}`);
        continue;
      }
      const fresh = cands.filter((c) => !knownPages.has(c.pageUrl) && !knownDownloads.has(c.downloadUrl));
      if (fresh.length) say(`  ${name} "${q}": ${fresh.length} new`);
      if (dry) continue;
      for (const c of fresh) await ingest(c);
    }
  }
  if (dry) return;
  say(
    `stage2 done: +${stats.downloaded} files, dup=${stats.duplicate}, failed=${stats.failed}, ` +
      `incompatible=${stats.unsupported}, skipped=${stats.skipped}, catalog=${catalog.length}`,
  );
}

async function runPlan(dry) {
  const taxMap = await mcmodTaxonomies();
  const idx = fs.existsSync(INDEX_PATH)
    ? JSON.parse(fs.readFileSync(INDEX_PATH, "utf8"))
    : await buildMcmodIndex();
  const seen = new Set();
  let discovered = 0;

  say(`== mc-mod.net: title topics over ${idx.length} indexed schematics ==`);
  for (const [label, re, max] of TOPICS) {
    const hits = idx
      .filter((e) => (re.test(e.title) || re.test(e.slug)) && !SKIP_RE.test(e.title))
      .sort((a, b) => b.id - a.id)
      .map((e) => candidateFromIndexEntry(e, taxMap))
      .filter((c) => c && !seen.has(c.pageUrl) && !knownPages.has(c.pageUrl) && !knownDownloads.has(c.downloadUrl));
    const cands = pickRoundRobin(hits, TOPIC_BUCKETS[label], max);
    for (const c of cands) seen.add(c.pageUrl);
    say(`  ${label}: ${hits.length} usable, ${cands.length} selected (cap ${max})`);
    discovered += cands.length;
    if (dry) {
      if (argv.includes("--verbose")) for (const c of cands) say(`     ${c.title}  [${c.format}]`);
      continue;
    }
    for (const c of cands) await ingest(c);
  }

  if (dry) {
    say(`dry-run: ${discovered} fresh candidates`);
    return;
  }
  say(
    `stage1 done: +${stats.downloaded} files, dup=${stats.duplicate}, failed=${stats.failed}, ` +
      `incompatible=${stats.unsupported}, skipped=${stats.skipped}, catalog=${catalog.length}`,
  );
}

// ------------------------------------------------------------------ cli ----
const argv = process.argv.slice(2);
function arg(name) {
  const i = argv.indexOf(`--${name}`);
  return i >= 0 ? argv[i + 1] : undefined;
}
const dry = argv.includes("--dry");

if (argv.includes("--index")) {
  await buildMcmodIndex();
} else if (argv.includes("--grep")) {
  const re = new RegExp(arg("grep"), "i");
  const max = Number(arg("max") || 25);
  const taxMap = await mcmodTaxonomies();
  const idx = fs.existsSync(INDEX_PATH)
    ? JSON.parse(fs.readFileSync(INDEX_PATH, "utf8"))
    : await buildMcmodIndex();
  const hits = idx.filter((e) => re.test(e.title) || re.test(e.slug));
  const cands = hits
    .map((e) => candidateFromIndexEntry(e, taxMap))
    .filter(Boolean)
    .filter((c) => !knownPages.has(c.pageUrl) && !knownDownloads.has(c.downloadUrl))
    .slice(0, max);
  say(`${hits.length} index hits for /${re.source}/i, ${cands.length} new`);
  if (dry || arg("verbose")) for (const c of cands) say(`  ${c.title}  [${c.format}]`);
  if (!dry) {
    for (const c of cands) await ingest(c);
    say(`done: +${stats.downloaded}, dup=${stats.duplicate}, failed=${stats.failed}, skipped=${stats.skipped}`);
  }
} else if (argv.includes("--plan") || argv.length === 0) {
  await runPlan(dry);
  if (argv.includes("--plan2")) await runWebPlan(dry);
} else if (argv.includes("--plan2")) {
  await runWebPlan(dry);
} else {
  const source = arg("source") || "mcmod";
  const max = Number(arg("max") || 20);
  const q = arg("q");
  const cat = arg("cat");
  const taxMap = source === "mcmod" ? await mcmodTaxonomies() : {};
  let cands = [];
  if (source === "mcmod") cands = await discoverMcmod({ q, cat, max }, taxMap);
  else if (source === "buildschematics") cands = await discoverBuildschematics({ q, max });
  else if (source === "mcbuild") cands = await discoverMcbuild({ q, max });
  else throw new Error(`unknown source ${source}`);
  say(`${cands.length} candidates from ${source} (q=${q || "-"} cat=${cat || "-"})`);
  if (dry) {
    for (const c of cands) say(`  ${c.title}  ->  ${c.downloadUrl}`);
  } else {
    for (const c of cands) await ingest(c);
    say(`done: +${stats.downloaded}, dup=${stats.duplicate}, failed=${stats.failed}, skipped=${stats.skipped}`);
  }
}
