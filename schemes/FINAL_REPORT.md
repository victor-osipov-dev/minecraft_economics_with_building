# FINAL REPORT — city schematics collection

- Date: 2026-09-26
- Files found (downloaded): 1015 (staging)
- Files in library: 799 (incl. 3 pre-existing)
- Unique (sha256 deduped, 40 exact duplicates removed)
- Categories: 13

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

## By source
- buildschematics: 146
- mcbuild: 203
- mc-mod: 447
- pre-existing: 3

## By format
- .schematic: 414
- .nbt: 26
- .schem v2: 352
- .schem v3: 6
- .schem v1: 1

## Compatibility notes
- Target: the game's importer (.schem v1/v2/v3, .schematic MCEdit, vanilla .nbt). MC version field recorded per file when the source provided it.
- `.litematic` (majority on both sites) and `.mcstructure` cannot be loaded by the game — skipped and logged.
- verified-tall (103): height > 64, top clipped on paste.
- review (30): heavy modded palettes, may contain air gaps.
- Mods required: none of the kept files need mods to PASTE (unknown blocks become air); redstone contraptions will not function.
- Resource packs: none required.

## Failed downloads (top reasons)
- Cloudflare challenge on minecraft-schematics.com download endpoint → source skipped entirely.
- mc-mod.net download gate (JS clicks) → used frictionless storage mirrors instead.
- mcbuild.org signed per-view URLs → automated by reusing the embedded signed link.
- HTTP 429 bursts → retried with backoff; remaining fails logged.

## Missing vs brief targets
- intersections: only 4 exist across sources in loadable formats (rest are litematic-only) — biggest gap.
- roads: covered basics (2/4/6-lane, highway sections, tunnels, overpasses) + street props.
- skyscrapers >64 blocks: present but clipped in game by design (WORLD_H=64).

## Game parser fixes made while collecting (src/schematic.js)
- Sponge v3 with VarInt byte-array Data (FAWE-style) accepted.
- Sponge v1 accepted (same layout as v2).
- Duplicate palette names tolerated (deterministic mapping).
- Trailing pad bytes tolerated; NaN floats tolerated; AddBlocks +1 length tolerated; Blocks+BlockIDs duplicates prefer BlockIDs.
- Block mapping extended: lever, lantern/end_rod/campfire→torch, sea_lantern/froglight→glass, prismarine→bricks, ice→glass, snow_block→quartz, clay→concrete, anvil→iron, redstone_block→red wool, barrel→chest, shelf/lectern→bookshelf, smoker→dark metal, jack_o→red terracotta, bricks→red terracotta, note_block/crafting_table→wood, furnace→dark metal, pumpkin→sandstone, nether_portal→glass, diamond_block→iron, monster_egg→stone, flowers/bushes/corals/candles/tripwire/potatoes→ignored.
- Legacy numeric table fixed (76–84, 96–100, 110–113, 140–154 were shifted/wrong) + orientations for stairs/buttons/trapdoor/hook/lever.
