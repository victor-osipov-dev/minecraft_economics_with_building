import { Gunzip, Unzlib } from "fflate";
import {
  AIR,
  WALL_CONCRETE,
  RUST_METAL,
  DARK_METAL,
  BARS,
  DIRT,
  STONE,
  WOOD,
  BLACK_WOOL,
  BLUE_WOOL,
  RED_WOOL,
  YELLOW_WOOL,
  BOOKSHELF,
  CAULDRON,
  CHEST,
  ENDER_CHEST,
  COBWEB,
  CYAN_TERRACOTTA,
  GRASS_BLOCK,
  HOPPER,
  GLASS,
  GLASS_PANE,
  IRON_BLOCK,
  IRON_DOOR,
  NETHER_BRICK_FENCE,
  NETHER_BRICK,
  NETHER_BRICK_SLAB,
  OAK_BUTTON,
  OAK_FENCE,
  OAK_PRESSURE_PLATE,
  OAK_SIGN,
  OAK_STAIRS,
  OAK_TRAPDOOR,
  PISTON,
  QUARTZ_BLOCK,
  RED_BED,
  RED_TERRACOTTA,
  SANDSTONE,
  SMOOTH_STONE_SLAB,
  STONE_BRICKS,
  STONE_PRESSURE_PLATE,
  TORCH,
  REDSTONE_TORCH,
  TRIPWIRE_HOOK,
  WATER,
  BLOCKS,
  TORCH_FLOOR,
  SIGN_STANDING,
  SLAB_DOUBLE,
  SLAB_BOTTOM,
  SLAB_TOP,
  STAIR_TOP_BIT,
  BUTTON_FLOOR,
  BUTTON_CEIL,
  TRAP_BOTTOM,
  TRAP_TOP,
} from "./blocks.js";
import { WORLD_H } from "./world.js";
import { t } from "./i18n.js";

// The importer runs synchronously on the main thread.  These limits are
// intentionally conservative: a valid file is small enough to parse and mesh
// without locking the UI for minutes, while a corrupt/decompression-bomb file
// is rejected before a giant allocation is made.
export const SCHEMATIC_LIMITS = Object.freeze({
  maxDimension: 2048,
  maxVoxels: 1_200_000,
  maxBlocks: 4_000_000,
  maxCompressedBytes: 32 * 1024 * 1024,
  maxDecodedBytes: 64 * 1024 * 1024,
  maxNbtDepth: 64,
  maxNbtTags: 2_000_000,
  maxNbtElements: 8_000_000,
  maxNbtStringBytes: 1_048_576,
  maxPaletteIndex: 1_000_000,
  maxPaletteEntries: 1_000_000,
  maxLegacyId: 4095,
  maxPlacementCoordinate: 1_000_000,
});

const MAX_DIMENSION = SCHEMATIC_LIMITS.maxDimension;
const MAX_VOXELS = SCHEMATIC_LIMITS.maxVoxels;
const MAX_PALETTE_INDEX = SCHEMATIC_LIMITS.maxPaletteIndex;
const MAX_BLOCKS = SCHEMATIC_LIMITS.maxBlocks;
const MAX_COMPRESSED_BYTES = SCHEMATIC_LIMITS.maxCompressedBytes;
const MAX_DECODED_BYTES = SCHEMATIC_LIMITS.maxDecodedBytes;
const MAX_NBT_DEPTH = SCHEMATIC_LIMITS.maxNbtDepth;
const MAX_NBT_TAGS = SCHEMATIC_LIMITS.maxNbtTags;
const MAX_NBT_ELEMENTS = SCHEMATIC_LIMITS.maxNbtElements;
const MAX_NBT_STRING_BYTES = SCHEMATIC_LIMITS.maxNbtStringBytes;
const MAX_PALETTE_ENTRIES = SCHEMATIC_LIMITS.maxPaletteEntries;
const MAX_PLACEMENT_COORD = SCHEMATIC_LIMITS.maxPlacementCoordinate;

function checkedDimensions(rawW, rawH, rawL, label) {
  const W = asSafeInt(rawW, t("sch.dimWidth", { label }));
  const H = asSafeInt(rawH, t("sch.dimHeight", { label }));
  const L = asSafeInt(rawL, t("sch.dimLength", { label }));
  if (W <= 0 || H <= 0 || L <= 0) {
    throw new Error(t("sch.badDims", { label }));
  }
  if (W > MAX_DIMENSION || H > MAX_DIMENSION || L > MAX_DIMENSION) {
    throw new Error(t("sch.dimsOverLimit", { label }));
  }
  const volume = W * H * L;
  if (!Number.isSafeInteger(volume) || volume > MAX_VOXELS) {
    throw new Error(t("sch.volumeTooBig", { label }));
  }
  return { W, H, L, volume };
}

function asSafeInt(value, label = t("sch.value")) {
  if (typeof value === "bigint") {
    if (value > BigInt(Number.MAX_SAFE_INTEGER) || value < BigInt(Number.MIN_SAFE_INTEGER)) {
      throw new Error(t("sch.unsafeInt", { label }));
    }
    return Number(value);
  }
  if (!Number.isSafeInteger(value)) {
    throw new Error(t("sch.badInt", { label }));
  }
  return value;
}

function checkedPaletteIndex(value, label = t("sch.schemPaletteIndex")) {
  const index = asSafeInt(value, label);
  if (index < 0 || index > MAX_PALETTE_INDEX) {
    throw new Error(t("sch.outOfRange", { label }));
  }
  return index;
}

function checkBlockLimit(count, label = t("sch.tooManyBlocks")) {
  if (!Number.isSafeInteger(count) || count < 0 || count > MAX_BLOCKS) {
    throw new Error(label);
  }
}

function hasOwn(value, key) {
  return value != null && typeof value === "object" &&
    Object.prototype.hasOwnProperty.call(value, key);
}

function isCompound(value) {
  return value != null && typeof value === "object" &&
    !Array.isArray(value) && !ArrayBuffer.isView(value);
}

function isList(value) {
  return Array.isArray(value);
}

function isSequence(value) {
  return Array.isArray(value) ||
    (ArrayBuffer.isView(value) && !(value instanceof DataView));
}

function isByteSequence(value) {
  if (value instanceof Uint8Array || value instanceof Int8Array) return true;
  return Array.isArray(value);
}

function sequenceLength(value, label) {
  if (!isSequence(value)) throw new Error(t("sch.expectArray", { label }));
  return value.length;
}

function exactSequence(value, expected, label) {
  const length = sequenceLength(value, label);
  if (length !== expected) {
    throw new Error(t("sch.badLength", { label, length, expected }));
  }
  return value;
}

function selectField(container, names, label) {
  const found = [];
  for (const name of names) {
    if (hasOwn(container, name)) found.push({ name, value: container[name] });
  }
  if (found.length > 1) {
    throw new Error(t("sch.ambiguousFields", { label, names: found.map((v) => v.name).join(", ") }));
  }
  return found.length ? found[0] : null;
}

function selectSpongeField(scm, names, label) {
  const found = [];
  const blocks = isCompound(scm.Blocks) ? scm.Blocks : null;
  if (blocks) {
    for (const name of names) {
      if (hasOwn(blocks, name)) found.push({ name: `Blocks.${name}`, value: blocks[name] });
    }
  }
  for (const name of names) {
    if (hasOwn(scm, name)) found.push({ name, value: scm[name] });
  }
  if (found.length > 1) {
    throw new Error(t("sch.ambiguousFields", { label, names: found.map((v) => v.name).join(", ") }));
  }
  return found.length ? found[0] : null;
}

// ============================================================
// Bounded NBT reader
// ============================================================
const T_END = 0;
const T_BYTE = 1;
const T_SHORT = 2;
const T_INT = 3;
const T_LONG = 4;
const T_FLOAT = 5;
const T_DOUBLE = 6;
const T_BYTEARR = 7;
const T_STRING = 8;
const T_LIST = 9;
const T_COMPOUND = 10;
const T_INTARR = 11;
const T_LONGARR = 12;

const UTF8 = new TextDecoder("utf-8", { fatal: true });

function nbtError(message) {
  return new Error(`NBT: ${message}`);
}

function createNbtState(u8, littleEndian) {
  return {
    u8,
    view: new DataView(u8.buffer, u8.byteOffset, u8.byteLength),
    offset: 0,
    littleEndian,
    tags: 0,
    elements: 0,
  };
}

function need(state, count) {
  if (!Number.isSafeInteger(count) || count < 0 ||
      state.offset > state.u8.length - count) {
    throw nbtError(t("sch.truncatedData"));
  }
}

function advance(state, count) {
  need(state, count);
  state.offset += count;
  if (state.offset > MAX_DECODED_BYTES) {
    throw nbtError(t("sch.tooMuchData"));
  }
}

function countTag(state) {
  state.tags++;
  if (state.tags > MAX_NBT_TAGS) throw nbtError(t("sch.tooManyTags"));
}

function countElements(state, count) {
  if (!Number.isSafeInteger(count) || count < 0) throw nbtError(t("sch.badCollectionLen"));
  state.elements += count;
  if (state.elements > MAX_NBT_ELEMENTS) throw nbtError(t("sch.tooManyElements"));
}

function readU16(state) {
  need(state, 2);
  const value = state.view.getUint16(state.offset, state.littleEndian);
  advance(state, 2);
  return value;
}

function readI32(state) {
  need(state, 4);
  const value = state.view.getInt32(state.offset, state.littleEndian);
  advance(state, 4);
  return value;
}

function readString(state) {
  const length = readU16(state);
  if (length > MAX_NBT_STRING_BYTES) throw nbtError(t("sch.stringTooLong"));
  need(state, length);
  const bytes = state.u8.subarray(state.offset, state.offset + length);
  advance(state, length);
  try {
    return UTF8.decode(bytes);
  } catch {
    throw nbtError(t("sch.badUtf8"));
  }
}

function readLongValue(state) {
  need(state, 8);
  const value = state.view.getBigInt64(state.offset, state.littleEndian);
  advance(state, 8);
  if (value >= BigInt(Number.MIN_SAFE_INTEGER) && value <= BigInt(Number.MAX_SAFE_INTEGER)) {
    return Number(value);
  }
  // Keep unsafe longs lossless.  Format readers reject them where an integer
  // dimension/index is required instead of silently rounding it.
  return value;
}

function readArrayLength(state, bytesPerElement, label) {
  const length = readI32(state);
  if (length < 0) throw nbtError(t("sch.negativeLen", { label }));
  if (length > SCHEMATIC_LIMITS.maxPaletteIndex * 4) {
    // This is still below the general element ceiling, but avoids a huge
    // multiplication/allocation for a hostile length header.
    throw nbtError(t("sch.lenTooBig", { label }));
  }
  countElements(state, length);
  if (bytesPerElement > 0 && length > Math.floor((state.u8.length - state.offset) / bytesPerElement)) {
    throw nbtError(t("sch.truncatedArray", { label }));
  }
  return length;
}

function readValue(state, type, depth) {
  if (depth > MAX_NBT_DEPTH) throw nbtError(t("sch.tooDeep"));
  switch (type) {
    case T_BYTE: {
      need(state, 1);
      const value = (state.u8[state.offset] << 24) >> 24;
      advance(state, 1);
      return value;
    }
    case T_SHORT: {
      need(state, 2);
      const value = state.view.getInt16(state.offset, state.littleEndian);
      advance(state, 2);
      return value;
    }
    case T_INT:
      return readI32(state);
    case T_LONG:
      return readLongValue(state);
    case T_FLOAT: {
      need(state, 4);
      const value = state.view.getFloat32(state.offset, state.littleEndian);
      advance(state, 4);
      // NaN/Infinity встречаются в реальных файлах (сущности, частицы);
      // на геометрию блоков они не влияют — пропускаем как есть.
      return value;
    }
    case T_DOUBLE: {
      need(state, 8);
      const value = state.view.getFloat64(state.offset, state.littleEndian);
      advance(state, 8);
      return value;
    }
    case T_BYTEARR: {
      const length = readArrayLength(state, 1, "byte array");
      const value = state.u8.slice(state.offset, state.offset + length);
      advance(state, length);
      return value;
    }
    case T_STRING:
      return readString(state);
    case T_LIST: {
      need(state, 1);
      const elementType = state.u8[state.offset];
      advance(state, 1);
      const length = readI32(state);
      if (length < 0) throw nbtError(t("sch.negativeListLen"));
      if (length === 0 && elementType === T_END) return [];
      if (elementType < T_BYTE || elementType > T_LONGARR) {
        throw nbtError(t("sch.unknownListElem", { type: elementType }));
      }
      if (length > SCHEMATIC_LIMITS.maxPaletteIndex) {
        throw nbtError(t("sch.listTooLong"));
      }
      countElements(state, length);
      const result = [];
      for (let i = 0; i < length; i++) {
        countTag(state);
        result.push(readValue(state, elementType, depth + 1));
      }
      return result;
    }
    case T_COMPOUND: {
      const result = Object.create(null);
      for (;;) {
        need(state, 1);
        const childType = state.u8[state.offset];
        if (childType === T_END) {
          advance(state, 1);
          break;
        }
        if (childType < T_BYTE || childType > T_LONGARR) {
          throw nbtError(t("sch.unknownChildTag", { type: childType }));
        }
        advance(state, 1);
        const name = readString(state);
        if (hasOwn(result, name)) throw nbtError(t("sch.dupTag", { name: JSON.stringify(name) }));
        countTag(state);
        result[name] = readValue(state, childType, depth + 1);
      }
      return result;
    }
    case T_INTARR: {
      const length = readArrayLength(state, 4, "int array");
      const value = new Int32Array(length);
      for (let i = 0; i < length; i++) value[i] = readI32(state);
      return value;
    }
    case T_LONGARR: {
      const length = readArrayLength(state, 8, "long array");
      const value = new Array(length);
      for (let i = 0; i < length; i++) value[i] = readLongValue(state);
      return value;
    }
    default:
      throw nbtError(t("sch.unknownTagType", { type }));
  }
}

function readNbt(u8, littleEndian = false) {
  if (!(u8 instanceof Uint8Array)) u8 = new Uint8Array(u8);
  if (u8.length > MAX_DECODED_BYTES) throw nbtError(t("sch.fileTooBig"));
  const state = createNbtState(u8, littleEndian);

  // A few old NBT writers emitted one or more empty root tags.  Accept only
  // a small, bounded prefix; all bytes after the actual root remain strict.
  let leadingEnds = 0;
  while (state.offset < u8.length && u8[state.offset] === T_END) {
    state.offset++;
    if (++leadingEnds > 8) throw nbtError(t("sch.tooManyEmptyRoots"));
  }
  if (state.offset >= u8.length) throw nbtError(t("sch.noRootTag"));

  const rootType = u8[state.offset++];
  if (rootType === T_END) throw nbtError(t("sch.noRootTag"));
  if (rootType < T_BYTE || rootType > T_LONGARR) {
    throw nbtError(t("sch.unknownRootTag", { type: rootType }));
  }
  readString(state);
  countTag(state);
  const root = readValue(state, rootType, 0);
  // Хвостовой паддинг встречается в реальных файлах — терпим.
  if (state.offset > u8.length) throw nbtError(t("sch.trailingData"));
  if (rootType !== T_COMPOUND) throw nbtError(t("sch.rootNotCompound"));
  return root;
}

// ============================================================
// Bounded gzip/zlib handling and format detection
// ============================================================
function readLeU16(bytes, offset, label) {
  if (offset < 0 || offset + 2 > bytes.length) throw new Error(t("sch.truncatedHeader", { label }));
  return bytes[offset] | (bytes[offset + 1] << 8);
}

function readLeU32(bytes, offset, label) {
  if (offset < 0 || offset + 4 > bytes.length) throw new Error(t("sch.truncatedSize", { label }));
  return (bytes[offset] |
    (bytes[offset + 1] << 8) |
    (bytes[offset + 2] << 16) |
    (bytes[offset + 3] << 24)) >>> 0;
}

function validateGzipHeader(bytes) {
  if (bytes.length < 18) throw new Error(t("sch.gzipTruncated"));
  if (bytes[0] !== 0x1f || bytes[1] !== 0x8b || bytes[2] !== 0x08) {
    throw new Error(t("sch.gzipBadSig"));
  }
  const flags = bytes[3];
  if ((flags & 0xe0) !== 0) throw new Error(t("sch.gzipReservedFlags"));
  let offset = 10;
  if (flags & 0x04) {
    const extraLength = readLeU16(bytes, offset, "gzip");
    offset += 2;
    if (offset + extraLength > bytes.length - 8) throw new Error(t("sch.gzipTruncatedExtra"));
    offset += extraLength;
  }
  for (const flag of [0x08, 0x10]) {
    if (!(flags & flag)) continue;
    while (offset < bytes.length - 8 && bytes[offset] !== 0) offset++;
    if (offset >= bytes.length - 8) throw new Error(t("sch.gzipTruncatedString"));
    offset++;
  }
  if (flags & 0x02) {
    if (offset + 2 > bytes.length - 8) throw new Error(t("sch.gzipTruncatedCrc"));
    offset += 2;
  }
  if (offset > bytes.length - 8) throw new Error(t("sch.gzipBadHeaderLen"));
  const declaredSize = readLeU32(bytes, bytes.length - 4, "gzip");
  if (declaredSize > MAX_DECODED_BYTES) {
    throw new Error(t("sch.gzipTooBig"));
  }
  return declaredSize;
}

function validateZlibHeader(bytes) {
  if (bytes.length < 6) throw new Error(t("sch.zlibTruncated"));
  const cmf = bytes[0];
  const flg = bytes[1];
  if ((cmf & 0x0f) !== 8 || (cmf >> 4) > 7) throw new Error(t("sch.zlibBadMethod"));
  if (((cmf << 8) | flg) % 31 !== 0) throw new Error(t("sch.zlibBadCrc"));
  if ((flg & 0x20) !== 0) throw new Error(t("sch.zlibNoDict"));
  if ((flg >> 6) > 3) throw new Error(t("sch.zlibBadLevel"));
}

function collectDecoded(Decoder, bytes) {
  const chunks = [];
  let total = 0;
  try {
    const decoder = new Decoder((chunk) => {
      if (!chunk || typeof chunk.length !== "number") return;
      total += chunk.length;
      if (!Number.isSafeInteger(total) || total > MAX_DECODED_BYTES) {
        throw new Error(t("sch.unpackedTooBig"));
      }
      chunks.push(chunk.slice());
    });
    decoder.push(bytes, true);
  } catch (error) {
    const message = error?.message || t("sch.corruptStream");
    throw new Error(t("sch.unpackFail", { message }));
  }
  const output = new Uint8Array(total);
  let offset = 0;
  for (const chunk of chunks) {
    output.set(chunk, offset);
    offset += chunk.length;
  }
  return output;
}

function inflateMaybe(bytes) {
  if (bytes.length > MAX_COMPRESSED_BYTES) {
    throw new Error(t("sch.compressedTooBig"));
  }
  if (bytes.length >= 3 && bytes[0] === 0x1f && bytes[1] === 0x8b) {
    validateGzipHeader(bytes);
    return collectDecoded(Gunzip, bytes);
  }
  // A valid zlib header has CM=8 and a legal CINFO.  Do not classify an
  // invalid 0x78-like byte sequence as raw NBT: report it as bad zlib.
  if (bytes.length >= 2 && (bytes[0] & 0x0f) === 8 && (bytes[0] >> 4) <= 7) {
    validateZlibHeader(bytes);
    return collectDecoded(Unzlib, bytes);
  }
  if (bytes.length > MAX_DECODED_BYTES) throw new Error(t("sch.fileTooBig"));
  return bytes;
}

// ============================================================
// Minecraft block-name mapping
// ============================================================
const EXACT_BLOCKS = new Map([
  ["air", AIR],
  ["cave_air", AIR],
  ["void_air", AIR],
  ["black_wool", BLACK_WOOL],
  ["blue_wool", BLUE_WOOL],
  ["red_wool", RED_WOOL],
  ["yellow_wool", YELLOW_WOOL],
  ["bookshelf", BOOKSHELF],
  ["cauldron", CAULDRON],
  ["chest", CHEST],
  ["ender_chest", ENDER_CHEST],
  ["cobweb", COBWEB],
  ["cyan_terracotta", CYAN_TERRACOTTA],
  ["red_terracotta", RED_TERRACOTTA],
  ["grass_block", GRASS_BLOCK],
  ["hopper", HOPPER],
  ["glass", GLASS],
  ["glass_pane", GLASS_PANE],
  ["iron_block", IRON_BLOCK],
  ["iron_door", IRON_DOOR],
  ["nether_brick_fence", NETHER_BRICK_FENCE],
  ["nether_bricks", NETHER_BRICK],
  ["nether_brick_slab", NETHER_BRICK_SLAB],
  ["oak_button", OAK_BUTTON],
  ["oak_fence", OAK_FENCE],
  ["oak_pressure_plate", OAK_PRESSURE_PLATE],
  ["oak_sign", OAK_SIGN],
  ["oak_wall_sign", OAK_SIGN],
  ["oak_stairs", OAK_STAIRS],
  ["oak_trapdoor", OAK_TRAPDOOR],
  ["piston", PISTON],
  ["piston_head", PISTON],
  ["quartz_block", QUARTZ_BLOCK],
  ["red_bed", RED_BED],
  ["sandstone", SANDSTONE],
  ["smooth_stone", STONE],
  ["smooth_stone_slab", SMOOTH_STONE_SLAB],
  ["stone_bricks", STONE_BRICKS],
  ["stone_pressure_plate", STONE_PRESSURE_PLATE],
  ["torch", TORCH],
  ["wall_torch", TORCH],
  ["redstone_torch", REDSTONE_TORCH],
  ["redstone_wall_torch", REDSTONE_TORCH],
  ["tripwire_hook", TRIPWIRE_HOOK],
  ["water", WATER],
  ["flowing_water", WATER],
]);

const COMPLEX_BLOCK_RE = /_(slab|stairs|step|door|trapdoor|fence|fence_gate|pane)$/;

function makeMappingStats() {
  return {
    simplified: new Set(),
    unsupported: new Set(),
    ignored: new Set(),
    simplifiedCount: 0,
    unsupportedCount: 0,
    ignoredCount: 0,
  };
}

function addMappingName(stats, setName, name) {
  if (!stats) return;
  const set = stats[setName];
  stats[`${setName}Count`]++;
  if (set.size < 256) set.add(name);
}

function normalizeBlockName(rawName) {
  if (typeof rawName !== "string") return "";
  let name = rawName.trim().toLowerCase();
  if (name.startsWith("minecraft:")) name = name.slice("minecraft:".length);
  const bracket = name.indexOf("[");
  if (bracket >= 0) name = name.slice(0, bracket);
  return name;
}

// Canonical palette key keeps blockstate properties.  Sponge/vanilla palettes
// legitimately contain one entry per blockstate
// ("oak_stairs[facing=north]" vs "oak_stairs[facing=south]"); deduping on the
// stripped base name would falsely reject every real-world map.
function canonicalPaletteKey(rawName) {
  if (typeof rawName !== "string") return "";
  let name = rawName.trim().toLowerCase();
  if (name.startsWith("minecraft:")) name = name.slice("minecraft:".length);
  return name;
}

function markSimplified(stats, name) {
  addMappingName(stats, "simplified", name || "unknown");
}

function markUnsupported(stats, name) {
  addMappingName(stats, "unsupported", name || "unknown");
}

function markIgnored(stats, name) {
  addMappingName(stats, "ignored", name || "unknown");
}

// Свойства из скобочной записи "wall_torch[facing=east,lit=true]".
function parseBracketProps(rawName) {
  const props = Object.create(null);
  if (typeof rawName !== "string") return props;
  const open = rawName.indexOf("[");
  const close = rawName.lastIndexOf("]");
  if (open < 0 || close < open) return props;
  for (const part of rawName.slice(open + 1, close).split(",")) {
    const eq = part.indexOf("=");
    if (eq <= 0) continue;
    const key = part.slice(0, eq).trim().toLowerCase();
    const value = part.slice(eq + 1).trim().toLowerCase();
    if (key) props[key] = value;
  }
  return props;
}

// Свойства из NBT-компаунда Properties ({facing: "east"}).
function compoundProps(value) {
  const props = Object.create(null);
  if (!isCompound(value)) return props;
  for (const key of Object.keys(value)) {
    const v = value[key];
    const k = key.trim().toLowerCase();
    if (!k) continue;
    if (typeof v === "string") props[k] = v.trim().toLowerCase();
    else if (typeof v === "number" && Number.isSafeInteger(v)) props[k] = String(v);
  }
  return props;
}

// facing майнкрафта -> data факела/таблички: east=+X(1), west=-X(2),
// south=+Z(3), north=-Z(4).
function facingData(facing, fallback) {
  switch (facing) {
    case "east": return 1;
    case "west": return 2;
    case "south": return 3;
    case "north": return 4;
    default: return fallback;
  }
}

// type плиты (slab) -> data: bottom=1, top=2, double/нет данных=0 (полный куб).
function slabData(type) {
  if (type === "bottom") return SLAB_BOTTOM;
  if (type === "top") return SLAB_TOP;
  return SLAB_DOUBLE;
}

export function mapBlockState(rawName, properties, stats) {
  if (properties != null && !isCompound(properties)) {
    throw new Error(t("sch.paletteBadProps"));
  }
  const name = normalizeBlockName(rawName);
  if (!name) {
    markUnsupported(stats, String(rawName ?? ""));
    return { id: AIR, data: 0 };
  }
  // Скобочные свойства дополняются NBT-компаундом Properties (он точнее).
  const props = { ...parseBracketProps(rawName), ...compoundProps(properties) };

  if (name === "structure_void" || name === "air" || name === "cave_air" || name === "void_air") {
    return { id: AIR, data: 0 };
  }

  // Факелы: напольный и настенный (наклон в сторону facing).
  if (name === "torch") return { id: TORCH, data: TORCH_FLOOR };
  if (name === "wall_torch") return { id: TORCH, data: facingData(props.facing, TORCH_FLOOR) };
  if (name === "redstone_torch") return { id: REDSTONE_TORCH, data: TORCH_FLOOR };
  if (name === "redstone_wall_torch") return { id: REDSTONE_TORCH, data: facingData(props.facing, TORCH_FLOOR) };

  // Таблички: стоячая и настенная (доска смотрит в сторону facing).
  if (name === "oak_wall_sign" || (name.includes("wall_sign") && name.includes("sign"))) {
    return { id: OAK_SIGN, data: facingData(props.facing, 4) };
  }
  if (name === "oak_sign") return { id: OAK_SIGN, data: SIGN_STANDING };

  // Плиты (slabs): нижняя/верхняя/двойная. Проверяем ДО EXACT_BLOCKS,
  // иначе точные совпадения ("smooth_stone_slab") съедят type=half.
  if (name === "nether_brick_slab") return { id: NETHER_BRICK_SLAB, data: slabData(props.type) };
  if (/_slab$|_step$/.test(name)) {
    markSimplified(stats, name);
    return { id: SMOOTH_STONE_SLAB, data: slabData(props.type) };
  }

  // Рычаг крепится как кнопка (face floor/wall/ceiling + facing).
  if (name.includes("lever")) {
    let data = BUTTON_FLOOR;
    if (props.face === "ceiling") data = BUTTON_CEIL;
    else if (props.face === "wall" || (!props.face && props.facing)) data = facingData(props.facing, BUTTON_FLOOR);
    return { id: OAK_BUTTON, data };
  }

  // Кнопка: face floor/wall/ceiling + facing. Тоже до EXACT_BLOCKS:
  // "oak_button"/"stone_button" там есть, но без состояний.
  if (name.includes("button")) {
    let data = BUTTON_FLOOR;
    if (props.face === "ceiling") data = BUTTON_CEIL;
    else if (props.face === "wall" || (!props.face && props.facing)) data = facingData(props.facing, BUTTON_FLOOR);
    if (data === BUTTON_FLOOR && !props.face && !props.facing) markSimplified(stats, name);
    return { id: OAK_BUTTON, data };
  }

  // Люк: half top/bottom + open + facing. До EXACT_BLOCKS ("oak_trapdoor").
  // data: 0 закрыт снизу, 1 закрыт сверху, 2..5 открыт, панель смотрит в
  // +X/-X/+Z/-Z, петля и опора — с противоположной стороны (см. emitTrapdoor).
  if (/_trapdoor$/.test(name)) {
    if (props.open === "true") return { id: OAK_TRAPDOOR, data: 1 + facingData(props.facing, 4) };
    return { id: OAK_TRAPDOOR, data: props.half === "top" ? TRAP_TOP : TRAP_BOTTOM };
  }

  // Крюк натяжной проволоки смотрит facing (как факел). До EXACT (там его
  // нет, но единообразие дешевле путаницы).
  if (name.includes("tripwire_hook") || name === "tripwirehook") {
    return { id: TRIPWIRE_HOOK, data: facingData(props.facing, 4) };
  }

  // Ступени: facing = сторона подъёма (верхняя половина с этой стороны),
  // half=top — перевёрнутая ступенька (бит STAIR_TOP_BIT). До EXACT_BLOCKS
  // ("oak_stairs" там есть). Угловые inner/outer формы упрощаем до прямых —
  // facing при этом не меняется.
  if (/_stairs$/.test(name)) {
    if (props.shape && props.shape !== "straight") markSimplified(stats, `${name}[shape=${props.shape}]`);
    const data = facingData(props.facing, 4);
    return { id: OAK_STAIRS, data: props.half === "top" ? data | STAIR_TOP_BIT : data };
  }

  if (EXACT_BLOCKS.has(name)) {
    if (COMPLEX_BLOCK_RE.test(name)) markSimplified(stats, name);
    return { id: EXACT_BLOCKS.get(name), data: 0 };
  }
  if (/_door$/.test(name)) {
    markSimplified(stats, name);
    return { id: IRON_DOOR, data: 0 };
  }
  if (/_fence(_gate)?$/.test(name)) {
    markSimplified(stats, name);
    return { id: OAK_FENCE, data: 0 };
  }
  if (/_pane$/.test(name)) {
    markSimplified(stats, name);
    return { id: GLASS_PANE, data: 0 };
  }
  if (name === "ice" || name.endsWith("_ice")) return { id: GLASS, data: 0 };
  if (name === "snow_block") return { id: QUARTZ_BLOCK, data: 0 };
  if (name === "clay") return { id: WALL_CONCRETE, data: 0 };
  if (name === "anvil") return { id: IRON_BLOCK, data: 0 };
  if (name === "redstone_block") return { id: RED_WOOL, data: 0 };
  if (name === "weighted_plate_heavy") return { id: STONE_PRESSURE_PLATE, data: 0 };
  if (name === "weighted_plate_light") return { id: OAK_PRESSURE_PLATE, data: 0 };
  if (name.includes("glass")) return { id: GLASS, data: 0 };
  if (name === "water" || name === "flowing_water") return { id: WATER, data: 0 };
  if (name.includes("leaves") || name.includes("lava") || name.includes("flower") ||
      name.includes("tall_grass") || name.includes("dead_bush") || name.includes("vine") ||
      name.includes("rail") || name.includes("carpet") || name.includes("sapling") ||
      name.includes("mushroom") || name.includes("seagrass") || name.includes("kelp") ||
      name === "snow" || name === "snow_layer" ||
      name.includes("coral") || name.includes("candle") || name.includes("tulip") ||
      name.includes("orchid") || name.includes("allium") || name.includes("poppy") ||
      name.includes("peony") || name.includes("lilac") || name.includes("daisy") ||
      name.includes("bluet") || name.includes("bush") || name.includes("azalea") ||
      name.includes("pickle") || name.includes("_pot") || name.includes("petals") ||
      name.includes("blossom") || name.includes("potato") || name.includes("carrot") ||
      name === "tripwire" || name.includes("grass")) {
    markIgnored(stats, name);
    return { id: AIR, data: 0 };
  }
  if (name.includes("concrete") || name.includes("terracotta")) {
    if (name === "cyan_terracotta") return { id: CYAN_TERRACOTTA, data: 0 };
    if (name === "red_terracotta") return { id: RED_TERRACOTTA, data: 0 };
    return { id: WALL_CONCRETE, data: 0 };
  }
  if (name.includes("stone_brick")) return { id: STONE_BRICKS, data: 0 };
  if (name.includes("prismarine")) return { id: STONE_BRICKS, data: 0 };
  if (name.includes("cobblestone") || name.includes("deepslate") ||
      name.includes("blackstone") || name.includes("andesite") || name.includes("diorite") ||
      name.includes("granite") || name.includes("netherrack") || name.includes("end_stone") ||
      name.includes("calcite") || name.includes("tuff") || name.includes("basalt") ||
      name.includes("dripstone") ||
      name.includes("obsidian") || name.includes("ore") || name === "stone") return { id: STONE, data: 0 };
  if (name.includes("quartz")) return { id: QUARTZ_BLOCK, data: 0 };
  if (name.includes("sandstone")) return { id: SANDSTONE, data: 0 };
  if (name.includes("dirt") || name.includes("sand") || name.includes("gravel") ||
      name === "podzol" || name.includes("mud") || name === "mycelium") return { id: DIRT, data: 0 };
  if (name.includes("plank") || name.includes("_log") || name.includes("_wood")) return { id: WOOD, data: 0 };
  if (name.includes("black_wool")) return { id: BLACK_WOOL, data: 0 };
  if (name.includes("blue_wool")) return { id: BLUE_WOOL, data: 0 };
  if (name.includes("red_wool")) return { id: RED_WOOL, data: 0 };
  if (name.includes("yellow_wool")) return { id: YELLOW_WOOL, data: 0 };
  if (name.includes("wool") || name.includes("shulker")) return { id: WALL_CONCRETE, data: 0 };
  if (name.includes("bookshelf")) return { id: BOOKSHELF, data: 0 };
  if (name === "bricks") return { id: RED_TERRACOTTA, data: 0 };
  if (name.includes("note_block")) return { id: WOOD, data: 0 };
  if (name.includes("furnace")) return { id: DARK_METAL, data: 0 };
  if (name.includes("crafting_table")) return { id: WOOD, data: 0 };
  if (name.includes("pumpkin") && !name.includes("jack_o")) return { id: SANDSTONE, data: 0 };
  if (name.includes("nether_portal")) return { id: GLASS, data: 0 };
  if (name.includes("cauldron")) return { id: CAULDRON, data: 0 };
  if (name.includes("ender_chest")) return { id: ENDER_CHEST, data: 0 };
  if (name.includes("chest")) return { id: CHEST, data: 0 };
  if (name.includes("barrel")) return { id: CHEST, data: 0 };
  if (name.includes("shelf") || name.includes("lectern")) return { id: BOOKSHELF, data: 0 };
  if (name.includes("hopper")) return { id: HOPPER, data: 0 };
  if (name.includes("piston")) return { id: PISTON, data: 0 };
  if (name.includes("iron_door")) return { id: IRON_DOOR, data: 0 };
  if (name.includes("diamond_block")) return { id: IRON_BLOCK, data: 0 };
  if (name.includes("monster_egg")) return { id: STONE, data: 0 };
  if (name.includes("iron_block")) return { id: IRON_BLOCK, data: 0 };
  if (name.includes("bed")) return { id: RED_BED, data: 0 };
  if (name.includes("web")) return { id: COBWEB, data: 0 };
  if (name.includes("fence") || name.includes("bars")) return { id: BARS, data: 0 };
  if (name.includes("pressure_plate")) return { id: name.includes("stone") ? STONE_PRESSURE_PLATE : OAK_PRESSURE_PLATE, data: 0 };
  if (name.includes("sign")) {
    if (name.includes("wall_") || props.facing) return { id: OAK_SIGN, data: facingData(props.facing, 4) };
    return { id: OAK_SIGN, data: SIGN_STANDING };
  }
  if (name.includes("jack_o")) return { id: RED_TERRACOTTA, data: 0 };
  if (name.includes("sea_lantern") || name.includes("froglight")) return { id: GLASS, data: 0 };
  if (name.includes("lantern") || name.includes("end_rod") || name.includes("campfire")) {
    return { id: TORCH, data: TORCH_FLOOR };
  }
  if (name.includes("redstone_torch")) return { id: REDSTONE_TORCH, data: TORCH_FLOOR };
  if (name.includes("torch")) return { id: TORCH, data: TORCH_FLOOR };
  if (name.includes("smoker")) return { id: DARK_METAL, data: 0 };
  if (name.includes("metal") || name.includes("iron") || name.includes("copper") ||
      name.includes("gold_block") || name.includes("netherite")) return { id: DARK_METAL, data: 0 };

  // Unknown names are deliberately not concrete.  A corrupt/custom block
  // must not silently turn a doorway into a wall or poison a prison layout.
  markUnsupported(stats, name);
  return { id: AIR, data: 0 };
}

function planResult(format, W, H, L, blocks, stats) {
  let minY = Infinity;
  let maxY = -Infinity;
  for (const block of blocks) {
    if (block[1] < minY) minY = block[1];
    if (block[1] > maxY) maxY = block[1];
  }
  return {
    format,
    W,
    H,
    L,
    blocks,
    minY: minY === Infinity ? 0 : minY,
    maxY: maxY === -Infinity ? 0 : maxY,
    simplifiedBlocks: stats ? [...stats.simplified] : [],
    unsupportedBlocks: stats ? [...stats.unsupported] : [],
    ignoredBlocks: stats ? [...stats.ignored] : [],
    simplifiedCount: stats?.simplifiedCount || 0,
    unsupportedCount: stats?.unsupportedCount || 0,
    ignoredCount: stats?.ignoredCount || 0,
  };
}

// ============================================================
// Palette and block-data parsing
// ============================================================
function paletteNameAndIndex(entry, implicitIndex, mode, label) {
  let name;
  let rawIndex = implicitIndex;
  if (typeof entry === "string") {
    name = entry;
  } else if (isCompound(entry)) {
    name = hasOwn(entry, "Name") ? entry.Name : entry.name;
    if (hasOwn(entry, "Index")) rawIndex = entry.Index;
    else if (hasOwn(entry, "index")) rawIndex = entry.index;
  } else {
    throw new Error(t("sch.paletteBadEntry", { label }));
  }
  if (typeof name !== "string" || name.length === 0) {
    throw new Error(t("sch.noBlockName", { label }));
  }
  let properties;
  if (entry != null && isCompound(entry) && hasOwn(entry, "Properties")) {
    if (!isCompound(entry.Properties)) {
      throw new Error(t("sch.badBlockProps", { label }));
    }
    properties = entry.Properties;
  }
  if (mode === "v3" && rawIndex !== implicitIndex) {
    throw new Error(t("sch.palV3Continuous", { label }));
  }
  return { name, index: checkedPaletteIndex(rawIndex, t("sch.palIndex", { label })), properties };
}

function paletteEntries(raw, mode, label, stats = null) {
  if (raw == null) throw new Error(t("sch.noPalette", { label }));
  let entries;
  if (isCompound(raw)) {
    const names = Object.keys(raw);
    entries = names.map((name) => {
      const value = raw[name];
      if (isCompound(value)) {
        const index = hasOwn(value, "Index") ? value.Index : value.index;
        if (index == null) throw new Error(t("sch.noPalIndex", { label }));
        return { name, index: checkedPaletteIndex(index, t("sch.palIndex", { label })), properties: value.Properties };
      }
      return { name, index: checkedPaletteIndex(value, t("sch.palIndex", { label })) };
    });
  } else if (isList(raw)) {
    if (raw.length > MAX_PALETTE_ENTRIES) throw new Error(t("sch.palTooMany", { label }));
    entries = raw.map((entry, index) => paletteNameAndIndex(entry, index, mode, label));
  } else {
    throw new Error(t("sch.palCompoundOrList", { label }));
  }
  if (entries.length === 0) throw new Error(t("sch.palEmpty", { label }));
  if (entries.length > MAX_PALETTE_ENTRIES) throw new Error(t("sch.palTooMany", { label }));

  const ids = new Map();
  const names = new Set();
  for (const entry of entries) {
    if (ids.has(entry.index)) throw new Error(t("sch.palDupIndex", { label }));
    const key = canonicalPaletteKey(entry.name);
    if (!key) throw new Error(t("sch.emptyBlockName", { label }));
    if (!normalizeBlockName(entry.name)) throw new Error(t("sch.emptyBlockName", { label }));
    if (names.has(key)) throw new Error(t("sch.dupBlockName", { label }));
    names.add(key);
    ids.set(entry.index, mapBlockState(entry.name, entry.properties, stats));
  }
  return { ids, entries };
}

function parseVarInt(data, offset) {
  let value = 0;
  let shift = 0;
  for (let i = 0; i < 5; i++) {
    if (offset.o >= data.length) throw new Error(t("sch.bdTruncatedVarint"));
    const byte = data[offset.o++] & 0xff;
    if (i === 4 && (byte & 0xf0) !== 0) {
      throw new Error(t("sch.bdVarintTooLong"));
    }
    value += (byte & 0x7f) * (2 ** shift);
    if ((byte & 0x80) === 0) return value;
    shift += 7;
  }
  throw new Error(t("sch.bdVarintTooLong"));
}

function paletteForSponge(scm, version, stats = null) {
  const field = selectSpongeField(
    scm,
    ["Palette", "BlockPalette"],
    t("sch.schemPalette")
  );
  if (!field) throw new Error(t("sch.schemNoPalette"));
  const parsed = paletteEntries(field.value, version === 3 ? "v3" : "v2", t("sch.schem"), stats);
  if (version === 3) {
    for (let i = 0; i < parsed.entries.length; i++) {
      if (parsed.entries[i].index !== i) throw new Error(t("sch.schemV3Gaps"));
    }
  }
  return parsed.ids;
}

function dataForSponge(scm) {
  const field = selectSpongeField(
    scm,
    ["Data", "BlockData"],
    t("sch.schemData")
  );
  if (!field) throw new Error(t("sch.schemNoBlockData"));
  return field.value;
}

function parseSponge(scm, stats) {
  if (!hasOwn(scm, "Version")) throw new Error(t("sch.schemNoVersion"));
  const version = asSafeInt(scm.Version, t("sch.schemVersion"));
  // v1 по структуре совпадает с v2 (VarInt BlockData + палитра) — читаем тем же путём.
  if (version !== 1 && version !== 2 && version !== 3) {
    throw new Error(t("sch.schemBadVersion", { version }));
  }
  const { W, H, L, volume } = checkedDimensions(
    scm.Width,
    scm.Height,
    scm.Length,
    t("sch.schem")
  );
  const palette = paletteForSponge(scm, version, stats);
  const rawData = dataForSponge(scm);
  const blocks = [];
  const blockAt = (index) => {
    const safe = checkedPaletteIndex(index, t("sch.schemBdIndex"));
    if (!palette.has(safe)) throw new Error(t("sch.schemIdxNotInPal"));
    return palette.get(safe);
  };
  const pushBlock = (x, y, z, entry) => {
    if (entry.id !== AIR) {
      blocks.push([x, y, z, entry.id, entry.data]);
      checkBlockLimit(blocks.length);
    }
  };

  if (version === 1 || version === 2) {
    if (!(rawData instanceof Uint8Array || rawData instanceof Int8Array || Array.isArray(rawData))) {
      throw new Error(t("sch.schemVByteArray", { version }));
    }
    for (let i = 0; i < rawData.length; i++) {
      const byte = asSafeInt(rawData[i], t("sch.schemV2Bd", { i }));
      if (byte < -128 || byte > 255) {
        throw new Error(t("sch.schemV2BdNotByte", { i }));
      }
    }
    const offset = { o: 0 };
    for (let y = 0; y < H; y++) {
      for (let z = 0; z < L; z++) {
        for (let x = 0; x < W; x++) {
          const index = parseVarInt(rawData, offset);
          pushBlock(x, y, z, blockAt(index));
        }
      }
    }
    if (offset.o !== rawData.length) throw new Error(t("sch.schemV2Extra"));
  } else {
    // Ряд экспортеров (включая FAWE) пишет v3-Data VarInt byte array вместо
    // int array из спеки. Принимаем оба представления.
    if (rawData instanceof Uint8Array || rawData instanceof Int8Array) {
      for (let i = 0; i < rawData.length; i++) {
        const byte = asSafeInt(rawData[i], t("sch.schemV3Bd", { i }));
        if (byte < -128 || byte > 255) {
          throw new Error(t("sch.schemV3BdNotByte", { i }));
        }
      }
      const offset = { o: 0 };
      for (let y = 0; y < H; y++) {
        for (let z = 0; z < L; z++) {
          for (let x = 0; x < W; x++) {
            pushBlock(x, y, z, blockAt(parseVarInt(rawData, offset)));
          }
        }
      }
      if (offset.o !== rawData.length) throw new Error(t("sch.schemV3Extra"));
      return planResult(`.schem v${version}`, W, H, L, blocks, stats);
    }
    if (!(rawData instanceof Int32Array || Array.isArray(rawData))) {
      throw new Error(t("sch.schemV3IntArray"));
    }
    exactSequence(rawData, volume, t("sch.schemV3BdLabel"));
    for (let i = 0; i < rawData.length; i++) {
      asSafeInt(rawData[i], t("sch.schemV3Bd", { i }));
    }
    for (let y = 0; y < H; y++) {
      for (let z = 0; z < L; z++) {
        for (let x = 0; x < W; x++) {
          pushBlock(x, y, z, blockAt(rawData[y * W * L + z * W + x]));
        }
      }
    }
  }
  return planResult(`.schem v${version}`, W, H, L, blocks, stats);
}

function normalizeVanillaPalettes(raw) {
  if (!isList(raw)) return raw;
  if (raw.length === 0) return raw;

  // A normal palette list is a list of names or {Name, Properties} records.
  const isNamedEntry = (entry) => typeof entry === "string" ||
    (isCompound(entry) && (hasOwn(entry, "Name") || hasOwn(entry, "name")) &&
      !hasOwn(entry, "palette") && !hasOwn(entry, "Palette"));
  if (raw.every(isNamedEntry)) return raw;

  // `palettes` is used by a number of structure writers as a list containing
  // one or more palette containers.  Keep the common single-container form
  // intact; for multiple compound palettes merge them and reject collisions
  // rather than silently choosing one of two interpretations.
  const isContainer = (entry) => isCompound(entry) &&
    (hasOwn(entry, "palette") || hasOwn(entry, "Palette"));
  if (raw.every(isContainer)) {
    const inner = raw.map((entry) => {
      const selected = selectField(entry, ["palette", "Palette"], t("sch.nbtPalettes"));
      return selected.value;
    });
    if (inner.every(isCompound)) {
      const merged = Object.create(null);
      for (const palette of inner) {
        for (const name of Object.keys(palette)) {
          if (hasOwn(merged, name)) {
            throw new Error(t("sch.nbtDupName"));
          }
          merged[name] = palette[name];
        }
      }
      return merged;
    }
    if (inner.every(isList)) return inner.flat();
    throw new Error(t("sch.nbtAmbiguous"));
  }

  // Some writers wrap a single compound palette in `palettes: [ {...} ]`.
  if (raw.every((entry) => isCompound(entry) &&
      Object.values(entry).every((value) => !isCompound(value) && !isList(value)))) {
    if (raw.length === 1) return raw[0];
    const merged = Object.create(null);
    for (const palette of raw) {
      for (const name of Object.keys(palette)) {
        if (hasOwn(merged, name)) {
          throw new Error(t("sch.nbtDupName"));
        }
        merged[name] = palette[name];
      }
    }
    return merged;
  }

  if (raw.every(isList)) return raw.flat();
  return raw;
}

function parseVanillaPalette(raw, label, stats = null) {
  const normalized = normalizeVanillaPalettes(raw);
  if (isList(normalized)) {
    if (normalized.length === 0) throw new Error(t("sch.palEmpty", { label }));
    if (normalized.length > MAX_PALETTE_ENTRIES) throw new Error(t("sch.palTooMany", { label }));
    const entries = normalized.map((entry, index) => paletteNameAndIndex(entry, index, "vanilla", label));
    const ids = new Map();
    for (const entry of entries) {
      if (ids.has(entry.index)) throw new Error(t("sch.palDupIndex", { label }));
      const key = canonicalPaletteKey(entry.name);
      if (!key || !normalizeBlockName(entry.name)) {
        throw new Error(t("sch.emptyBlockNameKey", { label, key: JSON.stringify(key).slice(0, 120) }));
      }
      // Повтор имени с другим индексом — безобидное дублирование состояния
      // (встречается в реальных файлах): маппинг детерминирован парой
      // (имя, свойства), каждый индекс резолвится независимо.
      ids.set(entry.index, mapBlockState(entry.name, entry.properties, stats));
    }
    return ids;
  }
  if (isCompound(normalized)) {
    const ids = new Map();
    const names = Object.keys(normalized);
    if (names.length === 0) throw new Error(t("sch.palEmpty", { label }));
    if (names.length > MAX_PALETTE_ENTRIES) throw new Error(t("sch.palTooMany", { label }));
    const seenNames = new Set();
    for (const name of names) {
      const index = checkedPaletteIndex(normalized[name], t("sch.palIndex", { label }));
      const key = canonicalPaletteKey(name);
      if (!key || !normalizeBlockName(name) || seenNames.has(key)) throw new Error(t("sch.dupBlockName", { label }));
      seenNames.add(key);
      if (ids.has(index)) throw new Error(t("sch.palDupIndex", { label }));
      ids.set(index, mapBlockState(name, null, stats));
    }
    return ids;
  }
  throw new Error(t("sch.badPalette", { label }));
}

function parseVanilla(scm, stats) {
  const sizeField = selectField(scm, ["size", "Size"], t("sch.nbtSize"));
  const paletteField = selectField(
    scm,
    ["palette", "Palette", "palettes", "Palettes"],
    t("sch.nbtPalette")
  );
  const blocksField = selectField(scm, ["blocks", "Blocks"], t("sch.nbtBlocks"));
  if (!sizeField || !paletteField || !blocksField) {
    throw new Error(t("sch.nbtMissingAll"));
  }
  if (!isSequence(sizeField.value) || sizeField.value.length !== 3) {
    throw new Error(t("sch.nbtSizeCoords"));
  }
  const { W, H, L } = checkedDimensions(
    sizeField.value[0],
    sizeField.value[1],
    sizeField.value[2],
    t("sch.nbt")
  );
  const palette = parseVanillaPalette(paletteField.value, t("sch.nbt"), stats);
  if (!isList(blocksField.value)) throw new Error(t("sch.nbtBlocksList"));
  if (blocksField.value.length > MAX_BLOCKS) throw new Error(t("sch.nbtTooManyEntries"));

  const blocks = [];
  const positions = new Set();
  for (const record of blocksField.value) {
    if (!isCompound(record)) throw new Error(t("sch.nbtBadBlocksEntry"));
    const posField = selectField(record, ["pos", "Pos"], t("sch.nbtPos"));
    const stateField = selectField(record, ["state", "State"], t("sch.nbtState"));
    if (!posField || !stateField || !isSequence(posField.value) || posField.value.length !== 3) {
      throw new Error(t("sch.nbtBadPosState"));
    }
    const x = asSafeInt(posField.value[0], t("sch.nbtPosX"));
    const y = asSafeInt(posField.value[1], t("sch.nbtPosY"));
    const z = asSafeInt(posField.value[2], t("sch.nbtPosZ"));
    if (x < 0 || y < 0 || z < 0 || x >= W || y >= H || z >= L) {
      throw new Error(t("sch.nbtOutOfBounds"));
    }
    const key = `${x},${y},${z}`;
    if (positions.has(key)) throw new Error(t("sch.nbtDupPos"));
    positions.add(key);
    const state = checkedPaletteIndex(stateField.value, t("sch.nbtState"));
    if (!palette.has(state)) throw new Error(t("sch.nbtBadState"));
    const entry = palette.get(state);
    if (entry.id !== AIR) {
      blocks.push([x, y, z, entry.id, entry.data]);
      checkBlockLimit(blocks.length);
    }
  }
  return planResult(".nbt", W, H, L, blocks, stats);
}

const LEGACY_NAMES = {
  0: "air",
  1: "stone",
  2: "grass_block",
  3: "dirt",
  4: "cobblestone",
  5: "oak_planks",
  6: "oak_sapling",
  7: "bedrock",
  8: "flowing_water",
  9: "water",
  10: "flowing_lava",
  11: "lava",
  12: "sand",
  13: "gravel",
  14: "gold_ore",
  15: "iron_ore",
  16: "coal_ore",
  17: "oak_log",
  18: "oak_leaves",
  19: "sponge",
  20: "glass",
  21: "lapis_ore",
  22: "dispenser",
  23: "sandstone",
  24: "note_block",
  25: "red_bed",
  26: "powered_rail",
  27: "sticky_piston",
  28: "piston",
  29: "cobweb",
  30: "short_grass",
  31: "dead_bush",
  32: "piston",
  33: "piston",
  34: "piston",
  35: "wool",
  37: "dandelion",
  38: "poppy",
  39: "brown_mushroom",
  40: "red_mushroom",
  41: "gold_block",
  42: "iron_block",
  43: "smooth_stone_slab",
  44: "smooth_stone_slab",
  45: "bricks",
  46: "tnt",
  47: "bookshelf",
  48: "mossy_cobblestone",
  49: "obsidian",
  50: "torch",
  51: "fire",
  52: "monster_spawner",
  53: "oak_stairs",
  54: "chest",
  55: "redstone",
  56: "diamond_ore",
  57: "diamond_block",
  58: "crafting_table",
  59: "wheat",
  60: "farmland",
  61: "furnace",
  62: "furnace",
  63: "oak_wall_sign",
  64: "oak_door",
  65: "iron_bars",
  66: "rail",
  67: "stone_stairs",
  68: "oak_wall_sign",
  69: "lever",
  70: "stone_pressure_plate",
  71: "iron_door",
  72: "oak_pressure_plate",
  73: "redstone_ore",
  74: "lit_redstone_ore",
  75: "redstone_torch",
  76: "redstone_torch",
  77: "stone_button",
  78: "snow",
  79: "ice",
  80: "snow_block",
  81: "cactus",
  82: "clay",
  83: "sugar_cane",
  84: "jukebox",
  85: "carved_pumpkin",
  86: "netherrack",
  87: "soul_sand",
  88: "glowstone",
  89: "nether_portal",
  90: "jack_o_lantern",
  91: "cake",
  92: "repeater",
  93: "comparator",
  94: "daylight_detector",
  95: "redstone_block",
  96: "oak_trapdoor",
  97: "monster_egg",
  98: "stone_bricks",
  99: "brown_mushroom_block",
  100: "red_mushroom_block",
  101: "iron_bars",
  102: "glass_pane",
  103: "melon",
  104: "pumpkin_stem",
  105: "melon_stem",
  106: "vine",
  107: "oak_fence_gate",
  108: "brick_stairs",
  109: "stone_stairs",
  110: "mycelium",
  111: "waterlily",
  112: "nether_brick_stairs",
  113: "nether_bricks",
  114: "red_sandstone_slab",
  115: "red_sandstone",
  116: "red_sandstone",
  117: "iron_bars",
  118: "glass_pane",
  119: "glass_pane",
  120: "glass_pane",
  121: "glass_pane",
  122: "glass_pane",
  123: "glass_pane",
  124: "glass_pane",
  125: "glass_pane",
  126: "glass_pane",
  127: "glass_pane",
  128: "glass_pane",
  129: "glass_pane",
  130: "glass_pane",
  131: "glass_pane",
  132: "glass_pane",
  133: "glass_pane",
  134: "glass_pane",
  135: "glass_pane",
  136: "glass_pane",
  137: "oak_fence",
  138: "glass_pane",
  139: "glass_pane",
  140: "flower_pot",
  141: "carrots",
  142: "potatoes",
  143: "wooden_button",
  144: "skull",
  145: "anvil",
  146: "trapped_chest",
  147: "weighted_plate_light",
  148: "weighted_plate_heavy",
  149: "comparator",
  150: "daylight_detector",
  151: "redstone_block",
  152: "quartz_ore",
  153: "hopper",
  154: "quartz_block",
  155: "stained_glass",
  156: "stained_glass_pane",
  157: "stained_glass",
  158: "stained_glass_pane",
  159: "stained_glass",
  160: "stained_glass_pane",
  161: "white_terracotta",
  162: "orange_terracotta",
  163: "magenta_terracotta",
  164: "light_blue_terracotta",
  165: "yellow_terracotta",
  166: "lime_terracotta",
  167: "pink_terracotta",
  168: "gray_terracotta",
  169: "light_gray_terracotta",
  170: "cyan_terracotta",
  171: "purple_terracotta",
  172: "blue_terracotta",
  173: "brown_terracotta",
  174: "green_terracotta",
  175: "red_terracotta",
  176: "black_terracotta",
};

// Ориентация факела в legacy Data: 1=east(+X), 2=west(-X), 3=south(+Z),
// 4=north(-Z), иначе стоит на полу.
function legacyTorchData(data) {
  if (data === 1) return 1;
  if (data === 2) return 2;
  if (data === 3) return 3;
  if (data === 4) return 4;
  return TORCH_FLOOR;
}

// Ориентация настенной таблички в legacy Data: 2=north, 3=south, 4=west, 5=east.
function legacyWallSignData(data) {
  if (data === 2) return 4;
  if (data === 3) return 3;
  if (data === 4) return 2;
  if (data === 5) return 1;
  return 4;
}

// Ступени в legacy Data: биты 0-1 — facing (сторона подъёма), как в modern
// facing: 0=South, 1=West, 2=North, 3=East (та же шкала, что facingData:
// south=3, west=2, north=4, east=1). Бит 0x4 = upside-down, переносим в
// STAIR_TOP_BIT — перевёрнутые ступеньки (угол между потолком и стеной).
function legacyStairData(data) {
  let f;
  switch (data & 3) {
    case 0: f = 3; break; // south -> подъём на юг
    case 1: f = 2; break; // west -> подъём на запад
    case 2: f = 4; break; // north -> подъём на север
    default: f = 1; break; // east -> подъём на восток
  }
  return (data & 0x04) ? f | STAIR_TOP_BIT : f;
}

// Кнопка/рычаг в legacy Data: 0 вниз (потолок), 1 east, 2 west, 3 south,
// 4 north, 5 вверх (пол). Рычаг с тем же nibble маппим так же.
function legacyButtonData(data) {
  switch (data & 7) {
    case 0: return BUTTON_CEIL;
    case 5: return BUTTON_FLOOR;
    case 6: return BUTTON_FLOOR;
    case 7: return BUTTON_CEIL;
    default: return data & 7;
  }
}

// Крюк в legacy Data: 0 south, 1 west, 2 north, 3 east (0x4/0x8 — состояние
// нити, на геометрию не влияет).
function legacyHookData(data) {
  const table = [3, 2, 4, 1];
  return table[data & 3];
}

export function mapLegacyId(id, data, stats) {
  if (!Number.isSafeInteger(id) || id < 0 || id > SCHEMATIC_LIMITS.maxLegacyId) {
    markUnsupported(stats, `legacy:${id}`);
    return { id: AIR, data: 0 };
  }
  const meta = Number.isSafeInteger(data) ? data & 0xff : 0;
  // Факелы и редстоун-факелы несут направление в метаданных.
  if (id === 50) return { id: TORCH, data: legacyTorchData(meta) };
  if (id === 75 || id === 76) return { id: REDSTONE_TORCH, data: legacyTorchData(meta) };
  if (id === 63) return { id: OAK_SIGN, data: SIGN_STANDING };
  if (id === 68) return { id: OAK_SIGN, data: legacyWallSignData(meta) };
  // 43 двойная плита (полный куб), 44 одинарная: бит 0x08 верхняя половина.
  if (id === 43) return { id: SMOOTH_STONE_SLAB, data: SLAB_DOUBLE };
  if (id === 44) return { id: SMOOTH_STONE_SLAB, data: (meta & 0x08) ? SLAB_TOP : SLAB_BOTTOM };
  // Ступени несут facing в битах 0-1.
  if (id === 53 || id === 67 || id === 108 || id === 109 || id === 112 ||
      id === 128 || id === 134 || id === 135 || id === 136) {
    return { id: OAK_STAIRS, data: legacyStairData(meta) };
  }
  // Кнопки и рычаг: ориентация + нажатость (нажатость игнорируем).
  if (id === 69 || id === 77 || id === 143) return { id: OAK_BUTTON, data: legacyButtonData(meta) };
  // Люк: знаем только верх/низ (0x08), открытую рисуем закрытой.
  if (id === 96) return { id: OAK_TRAPDOOR, data: (meta & 0x08) ? TRAP_TOP : TRAP_BOTTOM };
  // Крюк: facing в битах 0-1.
  if (id === 131) return { id: TRIPWIRE_HOOK, data: legacyHookData(meta) };
  const name = LEGACY_NAMES[id];
  if (!name) {
    markUnsupported(stats, `legacy:${id}`);
    return { id: AIR, data: 0 };
  }
  // Metadata is intentionally used only to choose a known simplification.  A
  // missing Data tag is common in old exports and remains valid.
  const mapped = mapBlockState(name, null, stats);
  if (id === 20) return { id: GLASS, data: 0 };
  return mapped;
}

function legacySequence(value, expected, label, byteOnly = false) {
  if (!isSequence(value)) throw new Error(t("sch.expectArray", { label }));
  exactSequence(value, expected, label);
  if (byteOnly) {
    for (let i = 0; i < value.length; i++) {
      const n = asSafeInt(value[i], `${label}[${i}]`);
      if (n < -128 || n > 255) throw new Error(t("sch.notByte", { label }));
    }
  }
  return value;
}

function parseLegacy(scm, stats) {
  if (!hasOwn(scm, "Width") || !hasOwn(scm, "Height") || !hasOwn(scm, "Length")) {
    throw new Error(t("sch.legacyNoDims"));
  }
  const { W, H, L, volume } = checkedDimensions(
    scm.Width,
    scm.Height,
    scm.Length,
    t("sch.legacy")
  );
  const hasBlocks = hasOwn(scm, "Blocks");
  const hasBlockIDs = hasOwn(scm, "BlockIDs");
  if (!hasBlocks && !hasBlockIDs) throw new Error(t("sch.legacyNoBlocks"));
  // Некоторые экспортеры пишут Blocks и BlockIDs одновременно (дубликаты).
  // Предпочитаем BlockIDs как более точные; AddBlocks тогда игнорируем.
  let isBlockIDs = hasBlockIDs;
  if (hasBlocks && hasBlockIDs) {
    try {
      legacySequence(scm.BlockIDs, volume, t("sch.legacyBlockIds"), false);
      isBlockIDs = true;
    } catch {
      isBlockIDs = false;
    }
  }
  legacySequence(isBlockIDs ? scm.BlockIDs : scm.Blocks, volume, t("sch.legacyBlocks"), !isBlockIDs);
  const rawBlocks = isBlockIDs ? scm.BlockIDs : scm.Blocks;
  let data = null;
  if (hasOwn(scm, "Data")) {
    data = legacySequence(scm.Data, volume, t("sch.legacyData"), true);
  }
  let add = null;
  if (hasOwn(scm, "AddBlocks") && !isBlockIDs) {
    // Встречается trailing pad-byte (+1 к ceil(volume/2)) — терпим.
    const raw = scm.AddBlocks;
    if (!isSequence(raw)) throw new Error(t("sch.legacyAddBlocksArray"));
    const expected = Math.ceil(volume / 2);
    if (raw.length !== expected && raw.length !== expected + 1) {
      exactSequence(raw, expected, t("sch.legacyAddBlocks"));
    }
    add = legacySequence(raw, raw.length, t("sch.legacyAddBlocks"), true);
  }

  const blocks = [];
  for (let y = 0; y < H; y++) {
    for (let z = 0; z < L; z++) {
      for (let x = 0; x < W; x++) {
        const i = (y * L + z) * W + x;
        let id;
        if (isBlockIDs) {
          id = asSafeInt(rawBlocks[i], t("sch.legacyBlockIds"));
        } else {
          id = rawBlocks[i] & 0xff;
          if (add) {
            const packed = add[i >> 1] & 0xff;
            // MCEdit/MCEdit-Unified and the format specification use the
            // high nibble for even indexes and the low nibble for odd ones.
            id |= (i & 1 ? packed & 0x0f : (packed >> 4) & 0x0f) << 8;
          }
        }
        const metadata = data ? data[i] & 0xff : 0;
        const mapped = mapLegacyId(id, metadata, stats);
        if (mapped.id !== AIR) {
          blocks.push([x, y, z, mapped.id, mapped.data]);
          checkBlockLimit(blocks.length);
        }
      }
    }
  }
  return planResult(".schematic", W, H, L, blocks, stats);
}

function parseDecodedRoot(root) {
  if (!isCompound(root)) throw new Error(t("sch.nbtRootNotCompound"));
  const scm = hasOwn(root, "Schematic") ? root.Schematic : root;
  if (!isCompound(scm)) throw new Error(t("sch.schemMustBeCompound"));

  const hasSpongeMarkers = hasOwn(scm, "Version") ||
    (hasOwn(scm, "Width") && (hasOwn(scm, "Palette") || hasOwn(scm, "BlockPalette") ||
      (isCompound(scm.Blocks) && (hasOwn(scm.Blocks, "Palette") || hasOwn(scm.Blocks, "BlockPalette")))));
  if (hasSpongeMarkers) {
    const stats = makeMappingStats();
    return parseSponge(scm, stats);
  }

  const vanillaShape = hasOwn(scm, "size") || hasOwn(scm, "Size") ||
    hasOwn(scm, "palette") || hasOwn(scm, "Palette") ||
    hasOwn(scm, "palettes") || hasOwn(scm, "Palettes");
  if (vanillaShape) {
    const stats = makeMappingStats();
    return parseVanilla(scm, stats);
  }

  if (hasOwn(scm, "Width") && hasOwn(scm, "Height") && hasOwn(scm, "Length") &&
      (hasOwn(scm, "Blocks") || hasOwn(scm, "BlockIDs"))) {
    const stats = makeMappingStats();
    return parseLegacy(scm, stats);
  }

  throw new Error(t("sch.unknownFormat"));
}

export function parseSchematicFile(input) {
  let bytes;
  try {
    bytes = input instanceof Uint8Array ? input : new Uint8Array(input);
  } catch {
    throw new Error(t("sch.readFail"));
  }
  if (bytes.length < 2) throw new Error(t("sch.fileTooShort"));
  if (bytes.length > MAX_COMPRESSED_BYTES) throw new Error(t("sch.fileOverLimit"));

  let raw;
  try {
    raw = inflateMaybe(bytes);
  } catch (error) {
    throw new Error(t("sch.decompressFail", { message: error.message || t("sch.corruptFile") }));
  }
  if (!(raw instanceof Uint8Array) || raw.length < 2) throw new Error(t("sch.fileTooShort"));
  if (raw.length > MAX_DECODED_BYTES) throw new Error(t("sch.unpackedTooBig"));

  let firstError = null;
  for (const littleEndian of [false, true]) {
    try {
      const root = readNbt(raw, littleEndian);
      return parseDecodedRoot(root);
    } catch (error) {
      if (!firstError) firstError = error;
    }
  }
  const message = firstError?.message || t("sch.unknownError");
  if (message.startsWith(t("sch.unknownFormatShort"))) throw new Error(message);
  throw new Error(t("sch.notNbt", { message }));
}

// ============================================================
// Atomic placement
// ============================================================
function validPlanCoordinate(value, limit, label) {
  if (!Number.isSafeInteger(value) || value < 0 || value >= limit) {
    throw new Error(t("sch.coordOutOfBounds", { label }));
  }
}

function validPlacementCoord(value, label) {
  if (!Number.isSafeInteger(value) || Math.abs(value) > MAX_PLACEMENT_COORD) {
    throw new Error(t("sch.coordOutOfRange", { label }));
  }
}

// Поворот плана на 90° по часовой (вид сверху) вокруг начала координат:
// (x, z) -> (L-1-z, x), W<->L. Направления 1..4 (+X/-X/+Z/-Z): 1->3->2->4->1.
function rotateFacing90(data) {
  if (data === 1) return 3;
  if (data === 3) return 2;
  if (data === 2) return 4;
  if (data === 4) return 1;
  return data;
}

function rotateData90(id, data) {
  // Открытый люк 2..5 крутится своей картой, остальное ненаправленное не трогаем.
  if (id === OAK_TRAPDOOR && data >= 2 && data <= 5) {
    if (data === 2) return 4;
    if (data === 4) return 3;
    if (data === 3) return 5;
    return 2;
  }
  // Перевёрнутая ступенька: крутим только facing, бит half=top сохраняем.
  if (id === OAK_STAIRS && (data & STAIR_TOP_BIT)) {
    return rotateFacing90(data - STAIR_TOP_BIT) | STAIR_TOP_BIT;
  }
  if (id === TORCH || id === REDSTONE_TORCH || id === OAK_SIGN ||
      id === OAK_STAIRS || id === TRIPWIRE_HOOK || id === OAK_BUTTON) {
    return rotateFacing90(data);
  }
  return data;
}

// Новый план, повёрнутый times раз на 90°. Чистая функция (вход не меняется).
export function rotatePlan(plan, times = 1) {
  const steps = ((Math.trunc(times) % 4) + 4) % 4;
  let { W, H, L, blocks } = plan;
  let current = blocks.map((b) => [b[0], b[1], b[2], b[3], b.length > 4 ? b[4] : 0]);
  for (let s = 0; s < steps; s++) {
    const next = [];
    for (const [x, y, z, id, data] of current) {
      next.push([L - 1 - z, y, x, id, rotateData90(id, data)]);
    }
    current = next;
    const swap = W;
    W = L;
    L = swap;
  }
  return { ...plan, W, H, L, blocks: current };
}

export function pasteSchematic(world, plan, cx, cz, floorY = 1, options = {}) {
  if (!world || typeof world.getBlock !== "function" || typeof world.setBlock !== "function" ||
      !plan || !Array.isArray(plan.blocks)) {
    throw new Error(t("sch.placeBadData"));
  }
  const W = asSafeInt(plan.W, t("sch.placeWidth"));
  const H = asSafeInt(plan.H, t("sch.placeHeight"));
  const L = asSafeInt(plan.L, t("sch.placeLength"));
  const { volume } = checkedDimensions(W, H, L, t("sch.place"));
  if (plan.blocks.length > MAX_BLOCKS) throw new Error(t("sch.placeTooMany"));
  if (!Number.isSafeInteger(cx) || !Number.isSafeInteger(cz) || !Number.isSafeInteger(floorY)) {
    throw new Error(t("sch.placeBadCoords"));
  }
  validPlacementCoord(cx, "cx");
  validPlacementCoord(cz, "cz");
  validPlacementCoord(floorY, "floorY");
  const x0 = cx - Math.floor(W / 2);
  const z0 = cz - Math.floor(L / 2);
  const dy = floorY - asSafeInt(plan.minY ?? 0, t("sch.placeMinY"));
  if (!Number.isSafeInteger(x0) || !Number.isSafeInteger(z0) || !Number.isSafeInteger(dy) ||
      !Number.isSafeInteger(x0 + W) || !Number.isSafeInteger(z0 + L)) {
    throw new Error(t("sch.placeBadCoords"));
  }
  validPlacementCoord(x0, "x0");
  validPlacementCoord(z0, "z0");
  validPlacementCoord(x0 + W, "x0+W");
  validPlacementCoord(z0 + L, "z0+L");

  const prepared = [];
  const seen = new Set();
  let placeable = 0;
  let clipped = 0;
  let highestPlaced = -1;
  for (const tuple of plan.blocks) {
    if (!Array.isArray(tuple) || (tuple.length !== 4 && tuple.length !== 5)) {
      throw new Error(t("sch.placeBadBlock"));
    }
    const x = asSafeInt(tuple[0], t("sch.schemX"));
    const y = asSafeInt(tuple[1], t("sch.schemY"));
    const z = asSafeInt(tuple[2], t("sch.schemZ"));
    const id = asSafeInt(tuple[3], t("sch.schemId"));
    const data = tuple.length === 5 ? asSafeInt(tuple[4], t("sch.schemDataField")) : 0;
    validPlanCoordinate(x, W, "x");
    validPlanCoordinate(y, H, "y");
    validPlanCoordinate(z, L, "z");
    if (id < 0 || id >= BLOCKS.length || !BLOCKS[id]) {
      throw new Error(t("sch.unknownBlockId", { id }));
    }
    if (data < 0 || data > 255) {
      throw new Error(t("sch.stateOutOfRange"));
    }
    const key = `${x},${y},${z}`;
    if (seen.has(key)) throw new Error(t("sch.schemDupPos"));
    seen.add(key);
    const wy = y + dy;
    if (!Number.isSafeInteger(wy)) throw new Error(t("sch.yOutOfRange"));
    if (wy < 0 || wy >= WORLD_H) {
      if (id !== AIR) clipped++;
      continue;
    }
    if (id !== AIR) {
      const wx = x0 + x;
      const wz = z0 + z;
      validPlacementCoord(wx, "wx");
      validPlacementCoord(wz, "wz");
      prepared.push([wx, wy, wz, id, data]);
      placeable++;
      highestPlaced = Math.max(highestPlaced, wy);
      checkBlockLimit(placeable);
    }
  }
  if (placeable === 0) throw new Error(t("sch.noBlocksInWorld"));
  const rawTopY = asSafeInt(plan.maxY ?? highestPlaced, t("sch.placeMaxY")) + dy;
  if (!Number.isSafeInteger(rawTopY)) throw new Error(t("sch.placeMaxYRange"));
  const topY = Math.max(highestPlaced, Math.min(WORLD_H - 1, rawTopY));

  // Everything above is preflight-only.  Do not mutate the target world until
  // all dimensions, IDs, coordinates and vertical overlap have passed.
  // For same-world replacement snapshot the footprint so a failed commit can
  // be rolled back instead of leaving a half-cleared map.
  const doClear = options.clear !== false;
  let backup = null;
  if (doClear) {
    backup = [];
    for (let bx = x0; bx < x0 + W; bx++) {
      for (let bz = z0; bz < z0 + L; bz++) {
        for (let by = 0; by < WORLD_H; by++) {
          const prev = world.getBlock(bx, by, bz);
          if (prev !== AIR) backup.push([bx, by, bz, prev, world.getState(bx, by, bz)]);
        }
      }
    }
    let cleared = false;
    if (typeof world.clearRegion === "function") {
      cleared = world.clearRegion(x0, 0, z0, W, WORLD_H, L);
    } else {
      cleared = true;
      for (let bx = 0; bx < W && cleared; bx++) {
        for (let bz = 0; bz < L && cleared; bz++) {
          for (let by = 0; by < WORLD_H; by++) {
            if (!world.setBlock(x0 + bx, by, z0 + bz, AIR)) { cleared = false; break; }
          }
        }
      }
    }
    if (!cleared) {
      for (const [x, y, z, id, data] of backup) world.setBlock(x, y, z, id, data);
      throw new Error(t("sch.placeClearFail"));
    }
  }

  for (const [x, y, z, id, data] of prepared) {
    if (!world.setBlock(x, y, z, id, data)) {
      if (backup) {
        if (typeof world.clearRegion === "function") world.clearRegion(x0, 0, z0, W, WORLD_H, L);
        for (const [bx, by, bz, prev, prevData] of backup) world.setBlock(bx, by, bz, prev, prevData);
      } else {
        for (const [px, py, pz] of prepared) {
          if (px === x && py === y && pz === z) break;
          world.setBlock(px, py, pz, AIR);
        }
      }
      throw new Error(t("sch.placeBlockFail"));
    }
  }
  return { x0, z0, topY, placed: placeable, clipped, volume };
}
