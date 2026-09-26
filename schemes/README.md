# City schematics library

799 files in `schemes/` — ready to place from the game's creative menu (T → Постройки).
Each file verified with the game's own parser (`src/schematic.js`): dimensions, block count, format.

## By category
- residential: 276
- towers: 129
- commercial: 94
- public: 66
- transport: 49
- bridges: 42
- parks: 35
- decor: 26
- roads: 26
- industrial: 25
- waterfront: 17
- vehicles: 10
- intersections: 4

## By format
- .schematic: 414
- .nbt: 26
- .schem v2: 352
- .schem v3: 6
- .schem v1: 1

## By source
- buildschematics: 146
- mcbuild: 203
- mc-mod: 447
- pre-existing: 3

Total blocks (recognized): 19,224,224

## Files
- `catalog.json` — full catalog (id, name, category, source, urls, author, version, format, W×H×L, blocks, size, sha256, status, notes).
- `download_log.csv` — per-download log with failures and reasons.
- `FINAL_REPORT.md` — collection report.

## Statuses
- `verified` — parses and pastes in game as-is.
- `verified-tall` — same, but height > 64 (top is clipped when pasting, see notes).
- `review` — parses, but many palette entries unmapped (usually modded blocks → air gaps possible). Check in creative preview before relying on it.

## Game limits to keep in mind
- World height is 64: taller builds get clipped.
- keep pasted builds within ~1.2M voxels / 32 MB compressed.
- `.litematic` and `.mcstructure` (Bedrock) are NOT supported by the game importer — such files were skipped during collection (see download_log.csv).
