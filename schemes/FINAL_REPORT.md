# FINAL REPORT — city schematics collection

- Date: 2026-09-28 (round 2; round 1 was 2026-09-26)
- Files in library: **1180** (round 1: 777 → round 2: **+403**)
- All unique by sha256; every file parses with the game's own parser (`src/schematic.js`)
- Categories: 13, **all targets met**

## Round 2 (2026-09-28) — gap filling

Gap analysis (`tools/gaps.mjs`) showed four weak categories: intersections 4, decor 26,
vehicles 10 (vs targets 15/30/30) plus thin subtopics (street lamp 2, bus 2, airport 2,
theatre 2, hospital 4, fence 3, police/fire 5, power 5, city hall 3).

What was done:

1. **mc-mod.net full index** — crawled the WP REST API (101 pages) into
   `tools/mcmod-index.json` (10,053 schematics with title, slug, format, direct storage URL).
   Their search endpoint matches post *body* text (searching "roundabout" returned an Eiffel
   Tower replica), so selection is now done locally by title regex over the whole index —
   precise, cheap, repeatable.
2. **Topic selection with round-robin buckets** — 12 topics (intersections, roads, street
   furniture, vehicles, transport hubs, waterfront, civic, industry, commerce, towers,
   residential, parks); each topic pulls from sub-buckets so one loud family (dump trucks,
   blacksmith shops) cannot fill a whole category. Newest-first ordering.
3. **buildschematics.com + mcbuild.org queries** — targeted searches for the thin subtopics.
   mcbuild's result markup exposes `data-id`/`data-title`, so titles are filtered *before*
   fetching item pages (fewer requests, no rate-limit crashes).
4. **Quality filters** widened: medieval/castle/fantasy/franchise/pixel-art/farm/redstone-machine
   /PvP-arena/space-station titles skipped, consistent with round 1's "real-life architecture" rule.
5. Dedupe by sha256 **and** page_url **and** download_url (many items share one storage file).

### Result of round 2

| category | before | after | target |
|---|---|---|---|
| intersections | 4 | **15** | 15 |
| roads | 26 | **43** | 20 |
| decor | 26 | **34** | 30 |
| vehicles | 10 | **65** | 30 |
| transport | 48 | **93** | 10 |
| public | 64 | **136** | 15 |
| commercial | 91 | **121** | 15 |
| residential | 272 | **311** | 30 |
| towers | 121 | **143** | 15 |
| parks | 33 | **67** | 10 |
| industrial | 25 | **69** | 10 |
| bridges | 41 | **42** | 20 |
| waterfront | 16 | **41** | 10 |

Thin subtopics after round 2: intersection 17, road segment 54, street lamp 3, bus 7,
airport 9, hospital 9, bank 8, fence/railing 6, police/fire 18, power 15, city hall 19,
theatre/cinema 19, school 16, gas station 17, townhouse 22.

## Library totals (round 2)

### By category
- residential: 311
- towers: 143
- public: 136
- commercial: 121
- transport: 93
- industrial: 69
- parks: 67
- vehicles: 65
- roads: 43
- bridges: 42
- waterfront: 41
- decor: 34
- intersections: 15

### By source
- mc-mod: 735
- mcbuild: 266
- buildschematics: 176
- pre-existing: 3

### By format
- .schematic: 662
- .nbt: 50
- .schem v2: 459
- .schem v3: 7
- .schem v1: 2

### Totals
- Total blocks (recognized): 24,481,797
- On disk: 8.6 MiB
- verified: 988 / verified-tall: 127 / review: 65

## Sources

| source | reachable | how |
|---|---|---|
| mc-mod.net | yes | WP REST API index + direct `dl2.9minecraft.net/dl2storage800/…` storage links |
| buildschematics.com | yes | `/presets/search?q=` + preset pages embed direct storage links |
| mcbuild.org | yes | `/search?q=` titles, then PHPSESSID cookie → `/download/…` → embedded signed URL |
| schemcraft.com | inspected | serves ZIP-wrapped `.schem`; catalogue is survival/medieval-heavy, no intersections — not used |
| mc-schematics.com | no | `.litematic` only (unsupported by the game) |
| minecraft-schematics.com | no | Cloudflare challenge on download endpoint — skipped, no bypass attempted |
| planetminecraft.com | no | Cloudflare — skipped, no bypass attempted |

## Compatibility notes
- Target: the game's importer (.schem v1/v2/v3, .schematic MCEdit, vanilla .nbt). MC version field recorded per file when the source provided it.
- `.litematic` (3,473 of mc-mod's 10,053 items) and `.mcstructure` cannot be loaded — skipped and logged.
- verified-tall (127): height > 64, top clipped on paste.
- review (65): heavy modded palettes, may contain air gaps.
- Mods required: none of the kept files need mods to PASTE (unknown blocks become air); redstone contraptions will not function.
- Resource packs: none required.

## Download log (all rounds, `download_log.csv`)
- rows: 1889 → downloaded 1168, duplicate 66, incompatible 71, skipped 21, failed 533.
- Top failure reasons:
  - 251 × HTTP 404 (dead storage links / expired mirrors)
  - 155 × `.litematic` unsupported by the game
  - 100 × gate returned HTML instead of bytes
  - 41 × rejected by the game's own size limits ("too large volume" / oversized NBT array)
  - 7 × `.nbt`, 4 × `.mcstructure` unsupported
  - 4 × HTTP 429 (retried with backoff), 6 × network/timeout
- Failures are kept in the log on purpose — nothing that does not load made it into the library.

## Library loader fix (src/main.js + vite.config.js)

Growing the library to 1180 files broke page startup: `import.meta.glob(..., { eager: true })`
emitted **one JS module request per scheme file and per thumbnail** (~2400 requests on load).
The browser/proxy path here answers 502 after ~3s under that load, so core modules
(`/src/main.js`, `/schemes/index.json`) failed and the game never initialized.

- `src/main.js` now builds `schemeUrlByFile` / `schemeThumbByFile` from the already-imported
  `schemes/index.json` (`/schemes/<file>`, `/schemes/<thumb>`) instead of eager globs →
  ~50 startup requests instead of ~2400; thumbnails stay `loading="lazy"` (one request per
  tile actually scrolled into view).
- `vite.config.js` copies `schemes/` into `dist/` on `build`, so those plain paths keep
  working after a production build.
- `tools/warmup.mjs` pre-warms Vite's transform cache for the dev server
  (`node tools/warmup.mjs [baseUrl]`) — first-hit transforms can outlive the proxy timeout.

## Verification in the game (2026-09-28)

Production build (`npm run build` → 1917 modules, 5.5 MB bundle, 2365 files copied) served by
`vite preview` on `http://127.0.0.1:4173/`:

- page loads with **0 console errors**
- Постройки panel: **`1180 из 1180`**, 1180 tiles, 9 economy chips, 32 tag chips
- search works: `intersection` → `9 из 1180` with real intersections
- thumbnails: **845 rendered, 0 failed, 0 in flight** (bounded loader, see below)
- tile click → file fetched + parsed by the game: `City Gas Station: 48×11×39 · R — поворот …`

### Thumbnail loader (src/main.js)

Thumbnails are no longer `loading="lazy"` + eager `<img src>` (all ~25 visible tiles fired at
once). Now: an **IntersectionObserver** (`rootMargin: 400px`) only marks tiles near the
viewport, and a queue loads **at most 3 at a time** (10 s watchdog so a hung request can't
block the queue). Measured on this machine's constrained browser path:

| | requests at once | result |
|---|---|---|
| before (all visible tiles) | ~25 | ~40% answered **502** |
| after (queue of 3) | ≤3 | **845/845 ok, 0 failed** |

### Environment note

The browser used for verification reaches the dev server through a path that returns
intermittent **502** for bursts of parallel requests (server answers in 20–90 ms for the same
URLs — see `tools/probe-parallel.mjs`: 60 parallel fetches, 0 failures, 38 ms). Two tools help:

- `node tools/warmup.mjs [baseUrl]` — pre-warms Vite's transform cache (844 modules) before
  `npm run dev`; first-hit transforms can outlive that proxy timeout.
- `npm run build && npm run preview` — one JS bundle instead of ~30 dep chunks, so the page
  starts reliably.

## Game parser fixes made while collecting (src/schematic.js)

- Sponge v3 with VarInt byte-array Data (FAWE-style) accepted.
- Sponge v1 accepted (same layout as v2).
- Duplicate palette names tolerated (deterministic mapping).
- Trailing pad bytes tolerated; NaN floats tolerated; AddBlocks +1 length tolerated; Blocks+BlockIDs duplicates prefer BlockIDs.
- Block mapping extended: lever, lantern/end_rod/campfire→torch, sea_lantern/froglight→glass, prismarine→bricks, ice→glass, snow_block→quartz, clay→concrete, anvil→iron, redstone_block→red wool, barrel→chest, shelf/lectern→bookshelf, smoker→dark metal, jack_o→red terracotta, bricks→red terracotta, note_block/crafting_table→wood, furnace→dark metal, pumpkin→sandstone, nether_portal→glass, diamond_block→iron, monster_egg→stone, flowers/bushes/corals/candles/tripwire/potatoes→ignored.
- Legacy numeric table fixed (76–84, 96–100, 110–113, 140–154 were shifted/wrong) + orientations for stairs/buttons/trapdoor/hook/lever.

## Top-up attempt 2026-09-27 (new service buildings)
- Goal: fire (0 in lib), landfill (1), farm (2), police (5), powerplant (5), hospital (4), school (10), supermarket, metro, stadium.
- Result: 0 new files. All direct endpoints now serve ad-gate HTML: buildschematics dl2 hosts (both), mcbuild.org downloads (even with session+cookies+Referer+UA), mc-mod.net dl2, minecraft-schematics.com (Cloudflare 403).
- NOTE: the 2026-09-26 batch used the same URLs successfully - gates appeared overnight. Full URL list above with status=blocked for retry.
- Triage 2026-09-27: all 777 files parse OK (0 fail, 0 empty, 0 tiny). Nothing deleted.
- Near-duplicate pairs noticed (kept both - differ slightly, maybe variants): sand-palace-station (mc-mod vs mcbuild), cove-house luxurious vs secluded-with-shops (same 129x45x128), villa vs modern-villa-with-survival-features (same 112x44x158).
- Odd-but-legit giants kept: 1000-long lava tunnel, 229x199 grocery, 314-long gas station, 426k-block parking garage, whole-village-as-one-scheme.
- 101 tall builds (H>64) still clipped at paste by design.
