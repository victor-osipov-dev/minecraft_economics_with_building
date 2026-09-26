# City schematics library

777 files in `schemes/` — ready to place from the game's creative menu (T → Постройки).
Each file verified with the game's own parser (`src/schematic.js`): dimensions, block count, format.
Only real-life architecture: no fantasy, franchises, voxel-art or test builds.

## By category
- residential: 272
- towers: 121
- commercial: 91
- public: 64
- transport: 48
- bridges: 41
- parks: 33
- decor: 26
- roads: 26
- industrial: 25
- waterfront: 16
- vehicles: 10
- intersections: 4

## By format
- .schematic: 407
- .nbt: 25
- .schem v2: 338
- .schem v3: 6
- .schem v1: 1

## By source
- buildschematics: 144
- mcbuild: 189
- mc-mod: 441
- pre-existing: 3

Total blocks (recognized): 18,636,891

## Files
- `catalog.json` — full catalog (id, name, category, source, urls, author, version, format, W×H×L, blocks, size, sha256, status, notes).
- `download_log.csv` — per-download log with failures and reasons.
- `FINAL_REPORT.md` — collection report.

## Statuses
- `verified` — parses and pastes in game as-is.
- `verified-tall` (93) — height > 64, top clipped when pasting.
- `review` (30) — parses, but many palette entries unmapped (usually modded blocks → air gaps possible). Check in creative preview before relying on it.

## Game limits to keep in mind
- World height is 64: taller builds get clipped.
- keep pasted builds within ~1.2M voxels / 32 MB compressed.
- `.litematic` and `.mcstructure` (Bedrock) are NOT supported by the game importer — such files were skipped during collection (see download_log.csv).
