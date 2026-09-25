import { gunzipSync, unzlibSync } from "fflate";
import {
  AIR,
  WALL_CONCRETE,
  RUST_METAL,
  DARK_METAL,
  BARS,
  DIRT,
  STONE,
  WOOD,
} from "./blocks.js";
import { WORLD_H } from "./world.js";

// ============================================================
// Минимальный NBT-ридер (Big-Endian). Покрывает нужные теги.
// ============================================================
const T_END = 0, T_BYTE = 1, T_SHORT = 2, T_INT = 3, T_LONG = 4,
      T_FLOAT = 5, T_DOUBLE = 6, T_BYTEARR = 7, T_STRING = 8,
      T_LIST = 9, T_COMPOUND = 10, T_INTARR = 11, T_LONGARR = 12;

function dv(u8) {
  return new DataView(u8.buffer, u8.byteOffset, u8.byteLength);
}

function readRawString(u8, off) {
  const len = dv(u8).getUint16(off.o);
  off.o += 2;
  const s = new TextDecoder().decode(u8.subarray(off.o, off.o + len));
  off.o += len;
  return s;
}

function readValue(u8, off, type) {
  const buf = dv(u8);
  switch (type) {
    case T_BYTE: return u8[off.o++] << 24 >> 24;
    case T_SHORT: { const v = buf.getInt16(off.o); off.o += 2; return v; }
    case T_INT: { const v = buf.getInt32(off.o); off.o += 4; return v; }
    case T_LONG: { const v = Number(buf.getBigInt64(off.o)); off.o += 8; return v; }
    case T_FLOAT: { const v = buf.getFloat32(off.o); off.o += 4; return v; }
    case T_DOUBLE: { const v = buf.getFloat64(off.o); off.o += 8; return v; }
    case T_BYTEARR: {
      const len = buf.getInt32(off.o); off.o += 4;
      const v = u8.slice(off.o, off.o + len);
      off.o += len;
      return v;
    }
    case T_INTARR: {
      const len = buf.getInt32(off.o); off.o += 4;
      const v = new Int32Array(len);
      for (let i = 0; i < len; i++) { v[i] = buf.getInt32(off.o); off.o += 4; }
      return v;
    }
    case T_STRING: return readRawString(u8, off);
    case T_LIST: {
      const et = u8[off.o++];
      const len = buf.getInt32(off.o); off.o += 4;
      const out = [];
      for (let i = 0; i < len; i++) out.push(readValue(u8, off, et));
      return out;
    }
    case T_COMPOUND: {
      const out = {};
      for (;;) {
        const t = u8[off.o];
        if (t === T_END) { off.o++; break; }
        const type2 = t;
        off.o++;
        const name = readRawString(u8, off);
        out[name] = readValue(u8, off, type2);
      }
      return out;
    }
    case T_LONGARR: {
      const len = buf.getInt32(off.o); off.o += 4;
      off.o += len * 8;
      return null;
    }
    default: throw new Error(`NBT: неизвестный тип тега ${type}`);
  }
}

function readNbt(u8) {
  let off = { o: 0 };
  while (off.o < u8.length && u8[off.o] === T_END) off.o++;
  const t = u8[off.o];
  off.o++;
  const name = readRawString(u8, off);
  void name;
  return readValue(u8, off, t);
}

// ============================================================
// Маппинг имён блоков Minecraft -> наши ID
// ============================================================
function mapBaseName(n) {
  const stripped = n.replace(/_stairs$|_slab$|_step$|_wall$/, "");
  if (stripped !== n) return mapBaseName(stripped);

  if (n === "air" || n === "cave_air" || n === "void_air") return AIR;
  if (n === "water" || n === "lava" || n === "flowing_water" || n === "flowing_lava") return AIR;
  if (n.endsWith("_leaves")) return AIR;
  if (["torch", "lantern", "lever", "button", "rail", "redstone", "grass", "flower",
       "fern", "snow", "vine", "lily", "carpet", "mushroom", "sculk", "cactus",
       "dead_bush", "tall_seagrass", "seagrass", "kelp"].some((d) => n.includes(d))) return AIR;

  if (n.endsWith("_door") || n.includes("_door")) return WALL_CONCRETE;
  if (n.endsWith("_bars") || n.includes("bars") || n.includes("fence") || n === "chain") return BARS;
  if (n.includes("glass")) return BARS;

  if (n.includes("plank") || n.includes("_log") || n.includes("_wood")) return WOOD;

  if (n.includes("concrete") || n.includes("terracotta")) return WALL_CONCRETE;
  if (n === "brick" || n === "bricks") return WALL_CONCRETE;

  if (["cobblestone", "stone_brick", "stone", "deepslate", "blackstone", "andesite",
       "diorite", "granite", "netherrack", "end_stone", "calcite", "tuff", "basalt",
       "quartz", "obsidian"].some((s) => n.includes(s))) return STONE;

  if (n.includes("dirt") || n.includes("sand") || n.includes("gravel") ||
      n === "podzol" || n.includes("mud") || n === "grass_block") return DIRT;

  if (n.includes("wool") || n.includes("shulker")) return WALL_CONCRETE;
  return WALL_CONCRETE;
}

function mapBlockName(name) {
  if (!name) return WALL_CONCRETE;
  let n = String(name).replace(/^minecraft:/, "").toLowerCase();
  const br = n.indexOf("[");
  if (br >= 0) n = n.slice(0, br);
  return mapBaseName(n);
}

const LEGACY_ID = {
  0: AIR, 1: STONE, 2: DIRT, 3: DIRT, 4: STONE, 5: WOOD, 6: AIR,
  7: WALL_CONCRETE, 8: WALL_CONCRETE, 9: WALL_CONCRETE, 10: DARK_METAL,
  11: AIR, 12: DIRT, 13: DIRT, 14: WALL_CONCRETE, 17: WOOD, 18: WOOD,
  20: WALL_CONCRETE, 21: WALL_CONCRETE, 22: STONE, 24: WALL_CONCRETE,
  26: WALL_CONCRETE, 27: AIR, 28: AIR, 31: AIR, 32: AIR, 35: WALL_CONCRETE,
  37: AIR, 38: AIR, 39: AIR, 40: AIR, 42: WALL_CONCRETE, 43: WALL_CONCRETE,
  44: WALL_CONCRETE, 45: WALL_CONCRETE, 48: STONE, 49: WALL_CONCRETE,
  50: AIR, 51: AIR, 55: AIR, 59: AIR, 61: RUST_METAL, 62: RUST_METAL,
  64: WALL_CONCRETE, 65: BARS, 66: AIR, 67: STONE, 68: AIR, 69: AIR,
  71: WALL_CONCRETE, 75: AIR, 76: AIR, 77: AIR, 78: AIR, 79: AIR,
  80: WALL_CONCRETE, 82: DIRT, 83: AIR, 85: BARS, 86: WALL_CONCRETE,
  88: AIR, 98: STONE, 99: AIR, 100: AIR, 101: BARS, 106: AIR,
  107: BARS, 110: STONE, 111: AIR, 113: BARS, 115: AIR, 121: STONE,
  123: AIR, 124: AIR, 126: AIR,
};
function mapLegacyId(id) {
  return LEGACY_ID[id] ?? WALL_CONCRETE;
}

// ============================================================
// Распаковка + определение формата
// ============================================================
function inflateMaybe(u8) {
  if (u8.length >= 2 && u8[0] === 0x1f && u8[1] === 0x8b) return gunzipSync(u8);
  if (u8.length >= 2 && u8[0] === 0x78) return unzlibSync(u8);
  return u8;
}

function planResult(format, W, H, L, blocks) {
  let minY = Infinity, maxY = 0;
  for (const [, y, ,] of blocks) {
    if (y < minY) minY = y;
    if (y > maxY) maxY = y;
  }
  return { format, W, H, L, blocks, minY: minY === Infinity ? 0 : minY, maxY };
}

export function parseSchematicFile(u8) {
  let raw;
  try {
    raw = inflateMaybe(u8);
  } catch (err) {
    throw new Error("не удалось распаковать (gzip/zlib)");
  }
  if (!raw || raw.length < 2) throw new Error("файл слишком короткий");

  let root;
  try {
    root = readNbt(raw);
  } catch (err) {
    throw new Error(`не NBT: ${err.message}`);
  }
  if (!root || typeof root !== "object") throw new Error("пустой NBT");

  const scm = root.Schematic && typeof root.Schematic === "object" ? root.Schematic : root;

  // ---- Sponge .schem v2 / v3 ----
  if (scm.Version != null && scm.Width != null) {
    const W = scm.Width & 0xffff;
    const H = scm.Height & 0xffff;
    const L = scm.Length & 0xffff;
    const pal = scm.Blocks?.Palette || scm.Palette || scm.Blocks?.BlockPalette;
    const data = scm.Blocks?.Data || scm.BlockData;
    if (!pal || data == null) throw new Error("схема .schem: нет палитры/данных");
    const names = Object.keys(pal).sort((a, b) => pal[a] - pal[b]);
    const indexNames = new Array(names.length);
    for (const k of names) indexNames[pal[k]] = k;
    const idMap = indexNames.map((nm) => mapBlockName(nm));

    const blocks = [];
    if (ArrayBuffer.isView(data) && data instanceof Int32Array) {
      for (let y = 0; y < H; y++) {
        for (let z = 0; z < L; z++) {
          for (let x = 0; x < W; x++) {
            const id = idMap[data[y * W * L + z * W + x]] ?? AIR;
            if (id !== AIR) blocks.push([x, y, z, id]);
          }
        }
      }
    } else {
      let o = 0;
      let pidx = 0;
      for (let y = 0; y < H; y++) {
        for (let z = 0; z < L; z++) {
          for (let x = 0; x < W; x++) {
            let val = 0, s = 0;
            for (;;) {
              const b = data[o++] & 0xff;
              val |= (b & 0x7f) << s;
              s += 7;
              if (!(b & 0x80)) break;
            }
            pidx = val;
            const id = idMap[pidx] ?? AIR;
            if (id !== AIR) blocks.push([x, y, z, id]);
          }
        }
      }
      if (o > data.length + 4) throw new Error("BlockData короче размера схемы");
    }
    return planResult(`.schem v${scm.Version}`, W, H, L, blocks);
  }

  // ---- Vanilla /structure .nbt ----
  const sizeArr = scm.Size ?? scm.size;
  if (sizeArr != null && Array.isArray(scm.palette)) {
    const W = sizeArr[0];
    const H = sizeArr[1];
    const L = sizeArr[2];
    const idMap = scm.palette.map((p) => mapBlockName(p.Name));
    const blocks = [];
    for (const b of scm.blocks || []) {
      const id = idMap[b.state] ?? AIR;
      if (id === AIR) continue;
      blocks.push([b.pos[0], b.pos[1], b.pos[2], id]);
    }
    return planResult(".nbt", W, H, L, blocks);
  }

  // ---- Legacy MCEdit .schematic ----
  if (scm.Width != null && scm.Blocks != null && ArrayBuffer.isView(scm.Blocks)) {
    const W = scm.Width & 0xffff;
    const H = scm.Height & 0xffff;
    const L = scm.Length & 0xffff;
    const blocksData = scm.Blocks;
    const add = scm.AddBlocks;
    const blocks = [];
    for (let y = 0; y < H; y++) {
      for (let z = 0; z < L; z++) {
        for (let x = 0; x < W; x++) {
          const i = (y * L + z) * W + x;
          let num = blocksData[i] & 0xff;
          if (add) {
            const half = add[i >> 1] & 0xff;
            num |= (i & 1 ? half >> 4 : half & 0x0f) << 8;
          }
          const id = mapLegacyId(num);
          if (id !== AIR) blocks.push([x, y, z, id]);
        }
      }
    }
    return planResult(".schematic", W, H, L, blocks);
  }

  throw new Error("неизвестный формат схемы (поддерживаются .schem, .schematic, .nbt)");
}

// ============================================================
// Вставка в мир
// ============================================================
export function pasteSchematic(world, plan, cx, cz, floorY = 1) {
  if (!plan || plan.blocks.length === 0) throw new Error("в схеме нет блоков");
  const W = plan.W, L = plan.L;
  const x0 = Math.floor(cx - W / 2);
  const z0 = Math.floor(cz - L / 2);
  const dy = floorY - plan.minY;
  const topY = plan.maxY + dy;

  const topClear = Math.min(topY, WORLD_H - 1);
  for (let bx = 0; bx < W; bx++) {
    for (let bz = 0; bz < L; bz++) {
      for (let by = 0; by <= topClear; by++) world.setBlock(x0 + bx, by, z0 + bz, AIR);
    }
  }

  let placed = 0;
  for (const [x, y, z, id] of plan.blocks) {
    const wy = y + dy;
    if (wy < 0 || wy >= WORLD_H) continue;
    world.setBlock(x0 + x, wy, z0 + z, id);
    placed++;
  }
  return { x0, z0, topY, placed };
}