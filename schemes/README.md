# City schematics library

1180 files in `schemes/` — ready to place from the game's creative menu (T → Постройки).
Each file verified with the game's own parser (`src/schematic.js`): dimensions, block count, format.
Only real-life architecture: no fantasy, franchises, voxel-art or test builds.

## By category
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

All 13 category targets from `tools/gaps.mjs` are met.

## By format
- .schematic: 662
- .schem v2: 459
- .nbt: 50
- .schem v3: 7
- .schem v1: 2

## By source
- mc-mod: 735
- mcbuild: 266
- buildschematics: 176
- pre-existing: 3

Total blocks (recognized): 24,481,797
On disk: 8.6 MiB, all 1180 files unique by sha256.

## Files
- `catalog.json` — full catalog (id, name, category, source, urls, author, version, format, W×H×L, blocks, size, sha256, status, notes).
- `download_log.csv` — per-download log with failures and reasons.
- `FINAL_REPORT.md` — collection report.

## Statuses
- `verified` (988) — parses and pastes in game as-is.
- `verified-tall` (127) — height > 64, top clipped when pasting.
- `review` (65) — parses, but many palette entries unmapped (usually modded blocks → air gaps possible). Check in creative preview before relying on it.

## Collection tooling (`tools/`)
- `harvest.mjs` — discovery + download + validation + catalog update.
  `--index` builds a local index of all 10,053 mc-mod schematics; `--plan` fills gaps by title topic;
  `--plan2` searches buildschematics.com + mcbuild.org; `--grep/--source/--q` for one-off pulls; `--dry` previews.
- `gaps.mjs` — category/subtopic counts vs targets.
- `thumbs-index.mjs` / `thumbs-batch.mjs` — rebuild `index.json` + isometric thumbnails (only renders missing ones).
- `report.mjs`, `log-stats.mjs` — statistics over catalog and download log.

## Running
- `npm.cmd run dev` — dev server (Vite picks up new scheme files automatically).
- `npm.cmd run build` && `npm.cmd run preview` — production build; `schemes/` is copied to
  `dist/schemes/` so thumbnails and schematic files resolve from plain `/schemes/<file>` URLs.
- If the dev page fails to initialise with 502s in the browser, run `node tools/warmup.mjs`
  first (pre-warms Vite's transform cache) or use `npm.cmd run preview`.
- Verified in-game 2026-09-28: panel shows **1180 из 1180**, 0 console errors.

## Game limits to keep in mind
- World height is 64: taller builds get clipped.
- keep pasted builds within ~1.2M voxels / 32 MB compressed.
- `.litematic` and `.mcstructure` (Bedrock) are NOT supported by the game importer — such files were skipped during collection (see download_log.csv).
