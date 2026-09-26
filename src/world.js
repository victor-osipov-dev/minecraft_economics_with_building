import * as BABYLON from "@babylonjs/core";
import {
  AIR,
  ATLAS_COLS as ATL_COLS,
  ATLAS_ROWS as ATL_ROWS,
  STONE,
  GRASS_BLOCK,
  BLOCKS,
  TORCH,
  REDSTONE_TORCH,
  TORCH_FLOOR,
  SIGN_STANDING,
  SLAB_DOUBLE,
  SLAB_BOTTOM,
  SLAB_TOP,
  STAIR_NZ,
  BUTTON_FLOOR,
  BUTTON_CEIL,
  TRAP_BOTTOM,
  TRAP_TOP,
  TRAP_OPEN_PX,
  TRAP_OPEN_NX,
  TRAP_OPEN_PZ,
  TRAP_OPEN_NZ,
} from "./blocks.js";

export const CHUNK = 16;
export const WORLD_H = 64;
export { ATLAS_COLS, ATLAS_ROWS } from "./blocks.js";

const INSET = 0.03;

const FACES = [
  { n: [1, 0, 0], v: [[1, 0, 0], [1, 1, 0], [1, 1, 1], [1, 0, 1]], shade: 0.78 },
  { n: [-1, 0, 0], v: [[0, 0, 1], [0, 1, 1], [0, 1, 0], [0, 0, 0]], shade: 0.78 },
  { n: [0, 1, 0], v: [[0, 1, 0], [0, 1, 1], [1, 1, 1], [1, 1, 0]], shade: 0.95 },
  { n: [0, -1, 0], v: [[0, 0, 1], [0, 0, 0], [1, 0, 0], [1, 0, 1]], shade: 0.5 },
  { n: [0, 0, 1], v: [[1, 0, 1], [1, 1, 1], [0, 1, 1], [0, 0, 1]], shade: 0.86 },
  { n: [0, 0, -1], v: [[0, 0, 0], [0, 1, 0], [1, 1, 0], [1, 0, 0]], shade: 0.68 },
];
const UV = [[0, 0], [0, 1], [1, 1], [1, 0]];

// Простой greedy-merge для opaque-слоя (см. buildGreedyOpaque ниже).
// true = схлопывать видимые грани одинаковых блоков в один прямоугольник.
export const meshSettings = { greedyOpaqueMerge: true };

const levelKey = (cx, cy, cz) => `${cx},${cy},${cz}`;

function tileFor(def, n) {
  if (n[1] === 1) return def.tiles.up;
  if (n[1] === -1) return def.tiles.down;
  return def.tiles.side;
}

export class World {
  constructor() {
    this.chunks = new Map();
    // Состояния неполных блоков (ориентация факела/таблички, половина плиты):
    // data-байт на клетку, трактовка зависит от id блока. 0 = вид по умолчанию
    // (факел на полу, стоячая табличка, двойная плита = полный куб).
    this.states = new Map();
    // Чанки с ручными/схемными данными. Автогенерация плоского пола
    // (ensureFlatAround) их пропускает: иначе пол прорастёт сквозь постройки
    // и не даст игроку выкопать яму (регенерация поверх).
    this.touched = new Set();
    this.dirty = new Set();
    this.meshes = new Map();
  }

  _idx(wx, wy, wz, cx, cy, cz) {
    return (wy - cy * CHUNK) * CHUNK * CHUNK + (wz - cz * CHUNK) * CHUNK + (wx - cx * CHUNK);
  }

  ensureChunk(cx, cy, cz) {
    const key = levelKey(cx, cy, cz);
    let c = this.chunks.get(key);
    if (!c) {
      c = new Uint8Array(CHUNK * CHUNK * CHUNK);
      this.chunks.set(key, c);
    }
    return c;
  }

  getBlock(x, y, z) {
    if (!Number.isFinite(x) || !Number.isFinite(y) || !Number.isFinite(z)) return AIR;
    x = Math.floor(x);
    y = Math.floor(y);
    z = Math.floor(z);
    if (y < 0) return STONE;
    if (y >= WORLD_H) return AIR;
    if (!Number.isSafeInteger(x) || !Number.isSafeInteger(z)) return AIR;
    const cx = Math.floor(x / CHUNK);
    const cy = Math.floor(y / CHUNK);
    const cz = Math.floor(z / CHUNK);
    const c = this.chunks.get(levelKey(cx, cy, cz));
    if (!c) return AIR;
    return c[this._idx(x, y, z, cx, cy, cz)];
  }

  isSolid(x, y, z) {
    const b = BLOCKS[this.getBlock(x, y, z)];
    return !!b && b.solid;
  }

  setBlock(x, y, z, id, data = 0) {
    if (!Number.isFinite(x) || !Number.isFinite(y) || !Number.isFinite(z) ||
        !Number.isInteger(id) || id < 0 || id >= BLOCKS.length || !BLOCKS[id]) {
      return false;
    }
    if (!Number.isInteger(data) || data < 0 || data > 255) return false;
    x = Math.floor(x);
    y = Math.floor(y);
    z = Math.floor(z);
    if (!Number.isSafeInteger(x) || !Number.isSafeInteger(z) || y < 0 || y >= WORLD_H) {
      return false;
    }
    const cx = Math.floor(x / CHUNK);
    const cy = Math.floor(y / CHUNK);
    const cz = Math.floor(z / CHUNK);
    const c = this.ensureChunk(cx, cy, cz);
    const idx = this._idx(x, y, z, cx, cy, cz);
    const prev = c[idx];
    c[idx] = id;
    this.touched.add(levelKey(cx, cy, cz));
    if (data === 0) {
      const st = this.states.get(levelKey(cx, cy, cz));
      if (st) st[idx] = 0;
    } else {
      this.ensureState(cx, cy, cz)[idx] = data;
    }

    this.touch(x, y, z, cx, cy, cz);
    // Запечённый свет пересекает границы чанков: появление/удаление факела
    // меняет glow в радиусе BAKE_RADIUS, поэтому пачкаем все чанки в округе,
    // а не только соседей по границе.
    if (prev === TORCH || prev === REDSTONE_TORCH || id === TORCH || id === REDSTONE_TORCH) {
      const ccx0 = Math.floor((x - BAKE_RADIUS) / CHUNK);
      const ccx1 = Math.floor((x + BAKE_RADIUS) / CHUNK);
      const ccz0 = Math.floor((z - BAKE_RADIUS) / CHUNK);
      const ccz1 = Math.floor((z + BAKE_RADIUS) / CHUNK);
      const ccy0 = Math.floor((y - BAKE_RADIUS) / CHUNK);
      const ccy1 = Math.floor((y + BAKE_RADIUS) / CHUNK);
      for (let dcy = ccy0; dcy <= ccy1; dcy++) {
        if (dcy < 0 || dcy * CHUNK >= WORLD_H) continue;
        for (let dcx = ccx0; dcx <= ccx1; dcx++) {
          for (let dcz = ccz0; dcz <= ccz1; dcz++) {
            this.dirty.add(levelKey(dcx, dcy, dcz));
          }
        }
      }
    }
    return true;
  }

  // Меняет только состояние (ориентацию/половину), блок остаётся тем же.
  // Нужна инвалидация мешей, т.к. геометрия неполных блоков зависит от data.
  setState(x, y, z, data) {
    if (!Number.isFinite(x) || !Number.isFinite(y) || !Number.isFinite(z)) return false;
    if (!Number.isInteger(data) || data < 0 || data > 255) return false;
    x = Math.floor(x);
    y = Math.floor(y);
    z = Math.floor(z);
    if (!Number.isSafeInteger(x) || !Number.isSafeInteger(z) || y < 0 || y >= WORLD_H) {
      return false;
    }
    const cx = Math.floor(x / CHUNK);
    const cy = Math.floor(y / CHUNK);
    const cz = Math.floor(z / CHUNK);
    const key = levelKey(cx, cy, cz);
    if (!this.chunks.has(key)) return false;
    if (data === 0) {
      const st = this.states.get(key);
      if (st) st[this._idx(x, y, z, cx, cy, cz)] = 0;
    } else {
      this.ensureState(cx, cy, cz)[this._idx(x, y, z, cx, cy, cz)] = data;
    }
    this.touch(x, y, z, cx, cy, cz);
    return true;
  }

  getState(x, y, z) {
    if (!Number.isFinite(x) || !Number.isFinite(y) || !Number.isFinite(z)) return 0;
    x = Math.floor(x);
    y = Math.floor(y);
    z = Math.floor(z);
    if (!Number.isSafeInteger(x) || !Number.isSafeInteger(z) || y < 0 || y >= WORLD_H) {
      return 0;
    }
    const cx = Math.floor(x / CHUNK);
    const cy = Math.floor(y / CHUNK);
    const cz = Math.floor(z / CHUNK);
    const st = this.states.get(levelKey(cx, cy, cz));
    if (!st) return 0;
    return st[this._idx(x, y, z, cx, cy, cz)];
  }

  // Верхняя поверхность блока для физики: null у нематериальных
  // (воздух, факел, табличка, плита нажимная, кровать, кнопка, люк, крюк),
  // 0.5 у нижней половины плиты и у ступеней (верхняя ступенька добирается
  // auto-step; см. physics.js).
  solidTop(x, y, z) {
    const id = this.getBlock(x, y, z);
    const def = BLOCKS[id];
    if (!def || !def.solid) return null;
    const by = Math.floor(y);
    if (def.shape === "stairs") return by + 0.5;
    if (def.shape === "slab" && this.getState(x, y, z) === SLAB_BOTTOM) return by + 0.5;
    return by + 1;
  }

  // Нижняя поверхность блока для физики: 0.5 у верхней половины плиты.
  solidBottom(x, y, z) {
    const id = this.getBlock(x, y, z);
    const def = BLOCKS[id];
    if (!def || !def.solid) return null;
    const by = Math.floor(y);
    if (def.shape === "slab" && this.getState(x, y, z) === SLAB_TOP) return by + 0.5;
    return by;
  }

  ensureState(cx, cy, cz) {
    const key = levelKey(cx, cy, cz);
    let s = this.states.get(key);
    if (!s) {
      s = new Uint8Array(CHUNK * CHUNK * CHUNK);
      this.states.set(key, s);
    }
    return s;
  }

  touch(x, y, z, cx, cy, cz) {
    const lx = x - cx * CHUNK;
    const ly = y - cy * CHUNK;
    const lz = z - cz * CHUNK;
    this.dirty.add(levelKey(cx, cy, cz));
    if (lx === 0) this.dirty.add(levelKey(cx - 1, cy, cz));
    if (lx === CHUNK - 1) this.dirty.add(levelKey(cx + 1, cy, cz));
    if (ly === 0 && cy > 0) this.dirty.add(levelKey(cx, cy - 1, cz));
    // WORLD_H занимает четыре чанка по вертикали. Обновляем соседний
    // чанк также на верхней границе 16/32/48, иначе изменения на стыке
    // оставляют старые грани в меше.
    if (ly === CHUNK - 1 && (cy + 1) * CHUNK < WORLD_H) {
      this.dirty.add(levelKey(cx, cy + 1, cz));
    }
    if (lz === 0) this.dirty.add(levelKey(cx, cy, cz - 1));
    if (lz === CHUNK - 1) this.dirty.add(levelKey(cx, cy, cz + 1));
  }

  markAll() {
    for (const key of this.chunks.keys()) this.dirty.add(key);
  }

  // Remove a rectangular volume without allocating one voxel per coordinate
  // that was already empty.  The extra one-voxel ring in the dirty set is
  // intentional: clearing a boundary also changes the face of the neighboring
  // chunk, even when that neighbor contains no block from the cleared volume.
  clearRegion(x, y, z, width, height, depth) {
    if (![x, y, z, width, height, depth].every(Number.isSafeInteger) ||
        width <= 0 || height <= 0 || depth <= 0) {
      return false;
    }
    const x1 = x + width;
    const y1 = y + height;
    const z1 = z + depth;
    if (!Number.isSafeInteger(x1) || !Number.isSafeInteger(y1) || !Number.isSafeInteger(z1)) {
      return false;
    }
    const cy0 = Math.max(0, y);
    const cy1 = Math.min(WORLD_H, y1);
    if (cy0 >= cy1) return true;

    const firstCx = Math.floor(x / CHUNK);
    const lastCx = Math.floor((x1 - 1) / CHUNK);
    const firstCy = Math.floor(cy0 / CHUNK);
    const lastCy = Math.floor((cy1 - 1) / CHUNK);
    const firstCz = Math.floor(z / CHUNK);
    const lastCz = Math.floor((z1 - 1) / CHUNK);

    for (let cx = firstCx; cx <= lastCx; cx++) {
      for (let cy = firstCy; cy <= lastCy; cy++) {
        for (let cz = firstCz; cz <= lastCz; cz++) {
          const key = levelKey(cx, cy, cz);
          // Очищенная под схему область — тоже "тронутая": пол там не генерим.
          this.touched.add(key);
          const chunk = this.chunks.get(key);
          if (!chunk) continue;
          const minX = Math.max(x, cx * CHUNK);
          const maxX = Math.min(x1, (cx + 1) * CHUNK);
          const minY = Math.max(cy0, cy * CHUNK);
          const maxY = Math.min(cy1, (cy + 1) * CHUNK);
          const minZ = Math.max(z, cz * CHUNK);
          const maxZ = Math.min(z1, (cz + 1) * CHUNK);
          const st = this.states.get(key);
          for (let wy = minY; wy < maxY; wy++) {
            for (let wz = minZ; wz < maxZ; wz++) {
              for (let wx = minX; wx < maxX; wx++) {
                const idx = (wy - cy * CHUNK) * CHUNK * CHUNK +
                  (wz - cz * CHUNK) * CHUNK + (wx - cx * CHUNK);
                chunk[idx] = AIR;
                if (st) st[idx] = 0;
              }
            }
          }
        }
      }
    }

    // Mark the perimeter as well: one voxel for chunk seams plus BAKE_RADIUS
    // for baked torch glow (clearing torches changes light beyond the seam).
    const dirtyCx0 = Math.floor((x - BAKE_RADIUS) / CHUNK);
    const dirtyCx1 = Math.floor((x1 + BAKE_RADIUS) / CHUNK);
    const dirtyCy0 = Math.floor((cy0 - BAKE_RADIUS) / CHUNK);
    const dirtyCy1 = Math.floor((cy1 + BAKE_RADIUS) / CHUNK);
    const dirtyCz0 = Math.floor((z - BAKE_RADIUS) / CHUNK);
    const dirtyCz1 = Math.floor((z1 + BAKE_RADIUS) / CHUNK);
    for (let cx = dirtyCx0; cx <= dirtyCx1; cx++) {
      for (let cy = dirtyCy0; cy <= dirtyCy1; cy++) {
        if (cy < 0 || cy * CHUNK >= WORLD_H) continue;
        for (let cz = dirtyCz0; cz <= dirtyCz1; cz++) {
          this.dirty.add(levelKey(cx, cy, cz));
        }
      }
    }
    return true;
  }

  clear() {
    for (const mesh of this.meshes.values()) mesh.dispose();
    this.meshes.clear();
    this.chunks.clear();
    this.states.clear();
    this.touched.clear();
    this.dirty.clear();
  }

  // Бесконечный плоский пол как в flat-мире: один слой травы на y=0 в
  // чанках вокруг (x, z), где ещё ничего нет. Тронутые чанки (постройки,
  // правки игрока, очищенные области) пропускаем. Вызывать периодически
  // (раз в ~0.3 c): создаёт максимум (2r+1)^2 чанков за проход.
  ensureFlatAround(x, z, radius = 2) {
    if (!Number.isFinite(x) || !Number.isFinite(z)) return;
    const ccx = Math.floor(x / CHUNK);
    const ccz = Math.floor(z / CHUNK);
    for (let dx = -radius; dx <= radius; dx++) {
      for (let dz = -radius; dz <= radius; dz++) {
        const cx = ccx + dx;
        const cz = ccz + dz;
        const key = levelKey(cx, 0, cz);
        if (this.chunks.has(key) || this.touched.has(key)) continue;
        const c = this.ensureChunk(cx, 0, cz);
        for (let lz = 0; lz < CHUNK; lz++) {
          for (let lx = 0; lx < CHUNK; lx++) {
            c[lz * CHUNK + lx] = GRASS_BLOCK;
          }
        }
        this.dirty.add(key);
        // Соседям тоже обновить грани (пол могут перекрыть их боковины).
        for (const [nx, nz] of [[cx - 1, cz], [cx + 1, cz], [cx, cz - 1], [cx, cz + 1]]) {
          const nkey = levelKey(nx, 0, nz);
          if (this.chunks.has(nkey)) this.dirty.add(nkey);
        }
      }
    }
  }

  flushMeshes(scene, opaqueMaterial, cutoutMaterial = opaqueMaterial, alphaMaterial = cutoutMaterial, torchMaterial = cutoutMaterial, limit = Infinity) {
    const materials = [
      ["opaque", opaqueMaterial],
      ["cutout", cutoutMaterial],
      ["alpha", alphaMaterial],
      ["torch", torchMaterial],
    ];
    let done = 0;
    for (const key of this.dirty) {
      if (done >= limit) break;
      done++;
      const [cx, cy, cz] = key.split(",").map(Number);
      const layers = buildChunkGeometry(this, cx, cy, cz);
      for (const [layer, material] of materials) {
        const meshKey = `${key}:${layer}`;
        const gd = layers[layer];
        let mesh = this.meshes.get(meshKey);
        if (gd) {
          if (!mesh) {
            mesh = new BABYLON.Mesh(`chunk_${key}_${layer}`, scene);
            mesh.material = material;
            this.meshes.set(meshKey, mesh);
          }
          applyGeometry(mesh, gd);
          mesh.isVisible = true;
        } else if (mesh) {
          mesh.dispose();
          this.meshes.delete(meshKey);
        }
      }
      this.dirty.delete(key);
    }
  }
}

function applyGeometry(mesh, gd) {
  mesh.setVerticesData(BABYLON.VertexBuffer.PositionKind, gd.positions);
  mesh.setVerticesData(BABYLON.VertexBuffer.NormalKind, gd.normals);
  mesh.setVerticesData(BABYLON.VertexBuffer.UVKind, gd.uvs);
  mesh.setVerticesData(BABYLON.VertexBuffer.ColorKind, gd.colors);
  if (gd.tileInfo && gd.tileInfo.length) mesh.setVerticesData("tileInfo", gd.tileInfo, false, 4);
  mesh.setIndices(gd.indices);
}

// corners of an axis-aligned quad at coordinate v (0 or 1) along axis.
// Quad order is bottom,top,top,bottom to match FACES and the UV table below.
// NOTE: Babylon treats clockwise-wound facets (seen from the normal side) as
// front faces — see CreateGroundVertexData in @babylonjs/core, whose visible
// +Y triangles satisfy cross(v1-v0, v2-v0) == -Y.  pushPlane/pushFace therefore
// emit reversed index order (0,2,1 / 0,3,2).  The old CCW order rendered every
// opaque exterior face as a backface: with backFaceCulling=true walls were
// see-through from outside ("inside-out"), while cull-disabled cutout/alpha
// layers looked fine.
function planeCorners(axis, v) {
  if (axis === 0) return [[v, 0, 0], [v, 1, 0], [v, 1, 1], [v, 0, 1]];
  if (axis === 1) return [[0, v, 0], [0, v, 1], [1, v, 1], [1, v, 0]];
  return [[0, 0, v], [0, 1, v], [1, 1, v], [1, 0, v]];
}

// Направление наклона настенного факела: data 1=+X, 2=-X, 3=+Z, 4=-Z.
function torchLean(data) {
  if (data === 1) return [1, 0];
  if (data === 2) return [-1, 0];
  if (data === 3) return [0, 1];
  if (data === 4) return [0, -1];
  return [0, 0];
}

// Арт факела в тайле (доли, должно совпадать с paintTorch в blocks.js):
// палка x28..36/y27..55 (0.1 толщиной), пламя x23..41/y8..34.
const STICK_CROP = [28 / 64, 36 / 64, 27 / 64, 55 / 64];
const FLAME_CROP = [23 / 64, 41 / 64, 8 / 64, 34 / 64];

function emitTorch(gd, wx, wy, wz, def, COLS, ROWS, INSET, data) {
  // Torch / redstone torch как в майнкрафте: тонкая палка (0.1) от опоры
  // плюс ВЕРТИКАЛЬНОЕ пламя, центрированное на её конце. Пламя всегда стоит
  // ровно и полностью сидит на палке — ничего не висит рядом в воздухе.
  // Напольная: палка 0..0.5 по центру, пламя 0.45..0.75. Настенная: палка от
  // стены (низ утоплен в опору) до (0.5, 0.78), пламя upright на конце.
  const tile = tileFor(def, [0, 1, 0]);
  const [lx, lz] = torchLean(data);
  const floor = data === TORCH_FLOOR;
  const hw = 0.05; // полуширина палки
  const b = floor ? [0.5, 0, 0.5] : [0.5 - lx * 0.52, 0.22, 0.5 - lz * 0.52];
  const t = floor ? [0.5, 0.5, 0.5] : [0.5, 0.78, 0.5];
  const c = floor ? [0.5, 0.6, 0.5] : [0.5 + lx * 0.02, 0.83, 0.5 + lz * 0.02];
  // Крест палки вдоль оси base->tip: квад A шириной по горизонтальной
  // перпендикуляре к lean, квад B — вдоль lean (оба невырождены).
  const wA = floor ? [0, 0, hw] : [lz * hw, 0, lx * hw];
  const wB = floor ? [hw, 0, 0] : [lx * hw, 0, lz * hw];
  const sub = (p, w) => [p[0] - w[0], p[1] - w[1], p[2] - w[2]];
  const add = (p, w) => [p[0] + w[0], p[1] + w[1], p[2] + w[2]];
  const nA = lz === 1 ? [0, 0, 1] : [1, 0, 0];
  const nB = lz === 1 ? [1, 0, 0] : [0, 0, 1];
  pushPlane(gd, wx, wy, wz, [sub(b, wA), sub(t, wA), add(t, wA), add(b, wA)], nA, 0.85, tile, COLS, ROWS, INSET, false, STICK_CROP);
  pushPlane(gd, wx, wy, wz, [sub(b, wB), sub(t, wB), add(t, wB), add(b, wB)], nB, 0.85, tile, COLS, ROWS, INSET, false, STICK_CROP);
  // Вертикальный крест пламени 0.24x0.3 на конце палки (перекрытие ~0.1).
  const fw = 0.12;
  const fh = 0.15;
  pushPlane(gd, wx, wy, wz,
    [[c[0] - fw, c[1] - fh, c[2]], [c[0] - fw, c[1] + fh, c[2]], [c[0] + fw, c[1] + fh, c[2]], [c[0] + fw, c[1] - fh, c[2]]],
    [0, 0, 1], 1, tile, COLS, ROWS, INSET, false, FLAME_CROP);
  pushPlane(gd, wx, wy, wz,
    [[c[0], c[1] - fh, c[2] - fw], [c[0], c[1] + fh, c[2] - fw], [c[0], c[1] + fh, c[2] + fw], [c[0], c[1] - fh, c[2] + fw]],
    [1, 0, 0], 1, tile, COLS, ROWS, INSET, false, FLAME_CROP);
}

function emitSign(gd, wx, wy, wz, def, COLS, ROWS, INSET, data) {
  const tile = tileFor(def, [0, 1, 0]);
  // Настенная табличка: доска на грани СВОЕЙ опоры, лицевой стороной наружу.
  // facing +X (data 1): опора западнее (x-1), доска у западной грани своей
  // клетки (x≈0), смотрит на восток. Раньше было зеркально — доска висела у
  // противоположной грани. Видимость с обеих сторон даёт cutout-материал
  // (culling выключен), коллизия остаётся non-solid.
  if (data >= 1 && data <= 4) {
    const y0 = 0.3;
    const y1 = 0.8;
    const s0 = 0.125;
    const s1 = 0.875;
    const off = 1 / 16;
    // Углы идут так, чтобы левый край арта (u=0) оказывался слева при взгляде
    // на доску спереди, иначе текст зеркалится (слева = +Z с востока, −Z
    // с запада, −X с юга, +X с севера).
    if (data === 1) {
      pushPlane(gd, wx, wy, wz, [[off, y0, s1], [off, y1, s1], [off, y1, s0], [off, y0, s0]], [1, 0, 0], 0.78, tile, COLS, ROWS, INSET);
    } else if (data === 2) {
      pushPlane(gd, wx, wy, wz, [[1 - off, y0, s0], [1 - off, y1, s0], [1 - off, y1, s1], [1 - off, y0, s1]], [-1, 0, 0], 0.78, tile, COLS, ROWS, INSET);
    } else if (data === 3) {
      pushPlane(gd, wx, wy, wz, [[s0, y0, off], [s0, y1, off], [s1, y1, off], [s1, y0, off]], [0, 0, 1], 0.86, tile, COLS, ROWS, INSET);
    } else {
      pushPlane(gd, wx, wy, wz, [[s1, y0, 1 - off], [s1, y1, 1 - off], [s0, y1, 1 - off], [s0, y0, 1 - off]], [0, 0, -1], 0.68, tile, COLS, ROWS, INSET);
    }
    return;
  }
  // Standing sign: two crossed thin boards in the upper-center of the cell.
  const x0 = 0.125;
  const x1 = 0.875;
  const y0 = 0.1875;
  const y1 = 0.8125;
  pushPlane(gd, wx, wy, wz, [[0.5, y0, x0], [0.5, y1, x0], [0.5, y1, x1], [0.5, y0, x1]], [1, 0, 0], 0.78, tile, COLS, ROWS, INSET);
  pushPlane(gd, wx, wy, wz, [[x0, y0, 0.5], [x0, y1, 0.5], [x1, y1, 0.5], [x1, y0, 0.5]], [0, 0, 1], 0.86, tile, COLS, ROWS, INSET);
}

// Плита (slab) как в майнкрафте: нижняя/верхняя половина или двойная.
// Бока показывают соответствующую половину текстуры (низ плиты = низ тайла).
function emitSlab(gd, world, wx, wy, wz, def, COLS, ROWS, INSET, data) {
  if (data === SLAB_TOP) {
    emitPartialBox(gd, world, wx, wy, wz, def, COLS, ROWS, INSET,
      0, 0.5, 0, 1, 1, 1, [0.5, 0]);
  } else if (data === SLAB_BOTTOM) {
    emitPartialBox(gd, world, wx, wy, wz, def, COLS, ROWS, INSET,
      0, 0, 0, 1, 0.5, 1, [1, 0.5]);
  } else {
    emitPartialBox(gd, world, wx, wy, wz, def, COLS, ROWS, INSET,
      0, 0, 0, 1, 1, 1, null);
  }
}

// Ступени как в майнкрафте (только прямые, без угловых inner/outer):
// нижняя половина на весь отпечаток + верхняя задняя половина по facing
// (data 1..4: спуск в +X/-X/+Z/-Z). Текстура на каждом боксе целиком.
function emitStairs(gd, world, wx, wy, wz, def, COLS, ROWS, INSET, data) {
  emitPartialBox(gd, world, wx, wy, wz, def, COLS, ROWS, INSET,
    0, 0, 0, 1, 0.5, 1, null);
  if (data === 2) {
    emitPartialBox(gd, world, wx, wy, wz, def, COLS, ROWS, INSET,
      0.5, 0.5, 0, 1, 1, 1, null);
  } else if (data === 3) {
    emitPartialBox(gd, world, wx, wy, wz, def, COLS, ROWS, INSET,
      0, 0.5, 0.5, 1, 1, 1, null);
  } else if (data === 4) {
    emitPartialBox(gd, world, wx, wy, wz, def, COLS, ROWS, INSET,
      0, 0.5, 0, 1, 1, 0.5, null);
  } else {
    // 1 (+X, спуск на восток) и неизвестные: верхняя западная половина.
    emitPartialBox(gd, world, wx, wy, wz, def, COLS, ROWS, INSET,
      0, 0.5, 0, 0.5, 1, 1, null);
  }
}

// Кнопка как в майнкрафте: напольная бляшка 6/16 x 2/16, настенная выступает
// из грани на 2/16, потолочная висит снизу. data 0 пол, 1..4 стены, 5 потолок.
// Лицевая грань (по facing) — круг кнопки, остальные — plain-боковина.
function emitButton(gd, world, wx, wy, wz, def, COLS, ROWS, INSET, data) {
  const circle = def.tiles.up;
  const fx = data === 1 ? [1, 0, 0] : data === 2 ? [-1, 0, 0] :
    data === 3 ? [0, 0, 1] : data === 4 ? [0, 0, -1] : null;
  const tileFn = (n) => (fx && n[0] === fx[0] && n[1] === fx[1] && n[2] === fx[2])
    ? circle
    : tileFor(def, n);
  const box = (x0, y0, z0, x1, y1, z1) =>
    emitPartialBox(gd, world, wx, wy, wz, def, COLS, ROWS, INSET,
      x0, y0, z0, x1, y1, z1, null, tileFn);
  const a = 5 / 16;
  const b = 11 / 16;
  if (data === BUTTON_CEIL) {
    box(a, 14 / 16, a, b, 1, b);
  } else if (data === 2) {
    box(14 / 16, 6 / 16, a, 1, 10 / 16, b);
  } else if (data === 3) {
    box(a, 6 / 16, 0, b, 10 / 16, 2 / 16);
  } else if (data === 4) {
    box(a, 6 / 16, 14 / 16, b, 10 / 16, 1);
  } else if (data === 1) {
    box(0, 6 / 16, a, 2 / 16, 10 / 16, b);
  } else {
    box(a, 0, a, b, 2 / 16, b);
  }
}

// Люк как в майнкрафте: закрытый — тонкая панель 3/16 снизу/сверху клетки,
// открытый — вертикальная панель у своей стороны. data 0/1 закрыт, 2..5 открыт.
function emitTrapdoor(gd, world, wx, wy, wz, def, COLS, ROWS, INSET, data) {
  if (data === TRAP_TOP) {
    emitPartialBox(gd, world, wx, wy, wz, def, COLS, ROWS, INSET,
      0, 13 / 16, 0, 1, 1, 1, null);
  } else if (data === TRAP_OPEN_PX) {
    emitPartialBox(gd, world, wx, wy, wz, def, COLS, ROWS, INSET,
      13 / 16, 0, 0, 1, 1, 1, null);
  } else if (data === TRAP_OPEN_NX) {
    emitPartialBox(gd, world, wx, wy, wz, def, COLS, ROWS, INSET,
      0, 0, 0, 3 / 16, 1, 1, null);
  } else if (data === TRAP_OPEN_PZ) {
    emitPartialBox(gd, world, wx, wy, wz, def, COLS, ROWS, INSET,
      0, 0, 13 / 16, 1, 1, 1, null);
  } else if (data === TRAP_OPEN_NZ) {
    emitPartialBox(gd, world, wx, wy, wz, def, COLS, ROWS, INSET,
      0, 0, 0, 1, 1, 3 / 16, null);
  } else {
    emitPartialBox(gd, world, wx, wy, wz, def, COLS, ROWS, INSET,
      0, 0, 0, 1, 3 / 16, 1, null);
  }
}

// Крюк натяжной проволоки как в майнкрафте: деревянная скоба из двух
// боксов (пластина на стене + рычаг наружу) wood-текстурой. data 1..4.
function emitHook(gd, world, wx, wy, wz, def, COLS, ROWS, INSET, data) {
  const box = (x0, y0, z0, x1, y1, z1) =>
    emitPartialBox(gd, world, wx, wy, wz, def, COLS, ROWS, INSET,
      x0, y0, z0, x1, y1, z1, null);
  if (data === 2) {
    box(14 / 16, 4 / 16, 6 / 16, 1, 12 / 16, 10 / 16);
    box(9 / 16, 8 / 16, 7 / 16, 14 / 16, 10 / 16, 9 / 16);
  } else if (data === 3) {
    box(6 / 16, 4 / 16, 0, 10 / 16, 12 / 16, 2 / 16);
    box(7 / 16, 8 / 16, 2 / 16, 9 / 16, 10 / 16, 7 / 16);
  } else if (data === 4) {
    box(6 / 16, 4 / 16, 14 / 16, 10 / 16, 12 / 16, 1);
    box(7 / 16, 8 / 16, 9 / 16, 9 / 16, 10 / 16, 14 / 16);
  } else {
    // 1 (+X) и неизвестные: опора западнее.
    box(0, 4 / 16, 6 / 16, 2 / 16, 12 / 16, 10 / 16);
    box(2 / 16, 8 / 16, 7 / 16, 7 / 16, 10 / 16, 9 / 16);
  }
}

// Произвольный бокс внутри клетки: 6 граней с кulling'ом по opaque-соседям.
// sideFrac [fBot, fTop] — какую долю тайла (от верха) показывают боковые
// грани: null = весь тайл. Верх/низ бокса всегда с полным тайлом.
function emitPartialBox(gd, world, wx, wy, wz, def, COLS, ROWS, INSET,
    x0, y0, z0, x1, y1, z1, sideFrac, tileFn = null) {
  const boxMin = [wx + x0, wy + y0, wz + z0];
  const boxMax = [wx + x1, wy + y1, wz + z1];
  for (let f = 0; f < FACES.length; f++) {
    const face = FACES[f];
    const n = face.n;
    const nx = wx + n[0];
    const ny = wy + n[1];
    const nz = wz + n[2];
    const nbDef = BLOCKS[world.getBlock(nx, ny, nz)];
    // Свой бокс меньше куба: неполного соседа не прячем целиком,
    // иначе между разными половинами останутся щели без граней.
    const partial = nbDef && (nbDef.shape === "slab" || nbDef.shape === "stairs");
    const nbState = partial ? world.getState(nx, ny, nz) : 0;
    if (faceHiddenByNeighbor(n[0], n[1], n[2], y0, y1, nbDef, nbState)) continue;
    let fBot = 1;
    let fTop = 0;
    if (sideFrac && n[1] === 0) {
      fBot = sideFrac[0];
      fTop = sideFrac[1];
    }
    pushMergedFace(gd, boxMin, boxMax, face, tileFn ? tileFn(n) : tileFor(def, n), face.shade,
      COLS, ROWS, INSET, fBot, fTop);
  }
}

function emitBars(gd, world, wx, wy, wz, def, COLS, ROWS, INSET) {
  // Thin decor (bars, fences, panes, cobwebs) is its own block type: two
  // crossed quads through the cell center, not full-cube faces.  The old
  // boundary-plane version skipped AIR neighbours, so a standalone grate
  // emitted zero triangles and was completely invisible.  The cutout material
  // has culling disabled, so both sides of each quad show.
  const tile = tileFor(def, [0, 1, 0]);
  pushPlane(gd, wx, wy, wz, [[0.5, 0, 0], [0.5, 1, 0], [0.5, 1, 1], [0.5, 0, 1]], [1, 0, 0], 0.78, tile, COLS, ROWS, INSET);
  pushPlane(gd, wx, wy, wz, [[0, 0, 0.5], [0, 1, 0.5], [1, 1, 0.5], [1, 0, 0.5]], [0, 0, 1], 0.86, tile, COLS, ROWS, INSET);
  // Top/bottom caps only against open air: visible from above/below, and no
  // coplanar neighbour face to z-fight with.
  if (world.getBlock(wx, wy + 1, wz) === AIR) {
    pushPlane(gd, wx, wy, wz, planeCorners(1, 1), [0, 1, 0], 0.95, tile, COLS, ROWS, INSET);
  }
  if (world.getBlock(wx, wy - 1, wz) === AIR) {
    pushPlane(gd, wx, wy, wz, planeCorners(1, 0), [0, -1, 0], 0.5, tile, COLS, ROWS, INSET);
  }
}

function pushPlane(gd, bx, by, bz, corners, n, shade, tile, COLS, ROWS, INSET, bake = true, crop = null) {
  const tu = (tile % COLS) / COLS;
  const tv = Math.floor(tile / COLS) / ROWS;
  // crop [cu0, cu1, cv0, cv1]: доля тайла с реальным артом (без прозрачных
  // полей). Квад маппится ровно на арт: основание факела оказывается точно на
  // опоре, а не висит в воздухе на высоте поля. Без crop — весь тайл.
  const cu0 = crop ? crop[0] : 0;
  const cu1 = crop ? crop[1] : 1;
  const cv0 = crop ? crop[2] : 0;
  const cv1 = crop ? crop[3] : 1;
  const base = gd.positions.length / 3;
  for (let k = 0; k < 4; k++) {
    const c = corners[k];
    const px = bx + c[0];
    const py = by + c[1];
    const pz = bz + c[2];
    gd.positions.push(px, py, pz);
    gd.normals.push(n[0], n[1], n[2]);
    const u = UV[k][0] === 0 ? tu + (cu0 + INSET) / COLS : tu + (cu1 - INSET) / COLS;
    // Atlas is uploaded with update(false), i.e. UNPACK_FLIP_Y off, so v=0 is
    // the canvas TOP.  Tile art is painted upright on the canvas (flame at the
    // top of the torch tile), therefore the block BOTTOM must sample the tile
    // BOTTOM (tv + 1/ROWS), not tv.  The old mapping showed every directional
    // texture upside down (torch flame at the base, grass strip at the foot).
    const v = UV[k][1] === 0 ? tv + (cv1 - INSET) / ROWS : tv + (cv0 + INSET) / ROWS;
    gd.uvs.push(u, v);
    // Пламя факела — источник света, а не приёмник: без bake (иначе выгорит).
    if (bake) pushBakedColor(gd, px, py, pz, shade);
    else gd.colors.push(shade, shade, shade, 1);
  }
  gd.indices.push(base, base + 2, base + 1, base, base + 3, base + 2);
}

function emptyGeometry() {
  return { positions: [], normals: [], uvs: [], colors: [], indices: [], torches: null };
}

// Запечённый свет факелов: вместо пула PointLight (который не масштабируется
// дальше десятка огней) свечение считается при построении меша и пишется
// прямо в vertex colors. Светят ВСЕ факелы на любом расстоянии, щелчков при
// ходьбе нет в принципе, шейдеры легчают (меньше огней). Цена: свет статичен
// в пределах чанка (обновляется при его перестройке — сломал/поставил факел),
// шаг сетки 1 блок и NPC не подсвечиваются.
const BAKE_RADIUS = 9;
const BAKE_INTENSITY = 2.2;
const BAKE_WARM_G = 0.62;
const BAKE_WARM_B = 0.3;
const BAKE_MAX = 2.2;

// Все факелы в чанке плюс окрестность радиуса: {x, y, z, i} (i — яркость).
function collectTorchGlow(world, ox, oy, oz) {
  const list = [];
  const y0 = Math.max(0, oy - BAKE_RADIUS);
  const y1 = Math.min(WORLD_H, oy + CHUNK + BAKE_RADIUS);
  for (let y = y0; y < y1; y++) {
    for (let z = oz - BAKE_RADIUS; z < oz + CHUNK + BAKE_RADIUS; z++) {
      for (let x = ox - BAKE_RADIUS; x < ox + CHUNK + BAKE_RADIUS; x++) {
        const id = world.getBlock(x, y, z);
        if (id !== TORCH && id !== REDSTONE_TORCH) continue;
        const floorTorch = world.getState(x, y, z) === TORCH_FLOOR;
        list.push({ x: x + 0.5, y: y + (floorTorch ? 0.6 : 0.83), z: z + 0.5, i: id === TORCH ? 1 : 0.7 });
      }
    }
  }
  return list;
}

// Тёплое свечение в точке: сумма по факелам с квадратичным спадом до радиуса.
// Возвращает добавки [r, g, b] к единице (умножаются на shade грани).
function glowAt(torches, x, y, z) {
  let r = 0;
  let g = 0;
  let b = 0;
  for (let i = 0; i < torches.length; i++) {
    const t = torches[i];
    const dx = x - t.x;
    const dy = y - t.y;
    const dz = z - t.z;
    const d2 = dx * dx + dy * dy + dz * dz;
    if (d2 >= BAKE_RADIUS * BAKE_RADIUS) continue;
    const f = 1 - Math.sqrt(d2) / BAKE_RADIUS;
    const gl = t.i * BAKE_INTENSITY * f * f;
    r += gl;
    g += gl * BAKE_WARM_G;
    b += gl * BAKE_WARM_B;
  }
  if (r > BAKE_MAX) r = BAKE_MAX;
  if (g > BAKE_MAX) g = BAKE_MAX;
  if (b > BAKE_MAX) b = BAKE_MAX;
  return [r, g, b];
}

function pushBakedColor(gd, x, y, z, shade) {
  const t = gd.torches;
  if (!t || t.length === 0) {
    gd.colors.push(shade, shade, shade, 1);
    return;
  }
  const gl = glowAt(t, x, y, z);
  gd.colors.push(shade * (1 + gl[0]), shade * (1 + gl[1]), shade * (1 + gl[2]), 1);
}

function isOpaqueBlock(def) {
  return !!def && def.solid && !def.transparent && !def.bars;
}

// Закрывает ли соседний блок грань целиком. Полный куб/двойная плита — да;
// половина плиты закрывает только свою половину, у ступеней низ закрыт
// всегда, а верх — только со стороны зада (против facing).
// Без этого рядом с неполными блоками появляются дыры: грань полного блока
// пряталась целиком, хотя сосед закрывал лишь её часть.
function faceHiddenByNeighbor(nX, nY, nZ, ourY0, ourY1, nbDef, nbState) {
  if (!isOpaqueBlock(nbDef)) return false;
  if (nbDef.shape === "slab") {
    if (nbState !== SLAB_BOTTOM && nbState !== SLAB_TOP) return true; // double
    if (nY === 1) return nbState === SLAB_BOTTOM; // сосед сверху: закрывает своим низом
    if (nY === -1) return nbState === SLAB_TOP; // сосед снизу: закрывает своим верхом
    const lo = nbState === SLAB_BOTTOM ? 0 : 0.5;
    const hi = nbState === SLAB_BOTTOM ? 0.5 : 1;
    return lo <= ourY0 && ourY1 <= hi;
  }
  if (nbDef.shape === "stairs") {
    // Зад ступени (против facing 1..4): [-X, +X, -Z, +Z].
    const back = nbState === 1 ? [-1, 0, 0] : nbState === 2 ? [1, 0, 0] :
      nbState === 3 ? [0, 0, -1] : nbState === 4 ? [0, 0, 1] : null;
    if (!back) return false; // неизвестно — рисуем (дыра хуже overdraw)
    if (nY === 1) return true; // низ ступени закрывает грань сверху целиком
    if (nY === -1) return false; // снизу щель: верхняя половина только сзади
    // Бок: низ закрыт всегда, верх — если грань со стороны зада.
    if (ourY1 <= 0.5) return true;
    return nX === -back[0] && nZ === -back[2];
  }
  return true;
}

function renderLayer(def) {
  if (!def) return "opaque";
  // Torches get their own emissive layer so the flame reads as lit even in
  // daylight.  A shared cutout material cannot glow per-tile.
  if (def.shape === "torch") return "torch";
  // Alpha-tested textures (fences, panes, cobwebs and small decorations) do
  // not need a second translucent pass.  Keeping them in a separate layer
  // makes their binary cutout independent from glass/water blending.
  if (def.bars || (!def.solid && def.transparent)) return "cutout";
  if (def.transparent) return "alpha";
  return "opaque";
}

export function buildChunkGeometry(world, cx, cy, cz) {
  const layers = {
    opaque: emptyGeometry(),
    cutout: emptyGeometry(),
    alpha: emptyGeometry(),
    torch: emptyGeometry(),
  };
  // tileInfo только у opaque-слоя: (originU, originV тайла, repeatU, repeatV).
  // Кастомный шейдер повторяет тайл fract()'ом внутри его границ вместо
  // растяжки merged-квада. У одиночных квадов repeat 1,1 (шейдер — identity).
  layers.opaque.tileInfo = [];
  const ox = cx * CHUNK;
  const oy = cy * CHUNK;
  const oz = cz * CHUNK;
  const greedy = meshSettings.greedyOpaqueMerge;
  // Один список факелов на чанк для запекания света во все слои.
  // Пустой/отсутствующий чанк геометрии не даёт — скан ни к чему.
  const home = world.chunks.get(levelKey(cx, cy, cz));
  let hasBlocks = false;
  if (home) {
    for (let i = 0; i < home.length; i++) {
      if (home[i] !== AIR) {
        hasBlocks = true;
        break;
      }
    }
  }
  const glow = hasBlocks ? collectTorchGlow(world, ox, oy, oz) : [];
  layers.opaque.torches = glow;
  layers.cutout.torches = glow;
  layers.alpha.torches = glow;
  layers.torch.torches = glow;

  for (let ly = 0; ly < CHUNK; ly++) {
    for (let lz = 0; lz < CHUNK; lz++) {
      for (let lx = 0; lx < CHUNK; lx++) {
        const wx = ox + lx;
        const wy = oy + ly;
        const wz = oz + lz;
        const id = world.getBlock(wx, wy, wz);
        if (id === AIR) continue;
        const def = BLOCKS[id];
        if (!def) continue;
        const layer = renderLayer(def);
        const gd = layers[layer];

        if (def.shape === "torch") {
          emitTorch(gd, wx, wy, wz, def, ATL_COLS, ATL_ROWS, INSET, world.getState(wx, wy, wz));
          continue;
        }
        if (def.shape === "sign") {
          emitSign(gd, wx, wy, wz, def, ATL_COLS, ATL_ROWS, INSET, world.getState(wx, wy, wz));
          continue;
        }
        if (def.bars) {
          emitBars(gd, world, wx, wy, wz, def, ATL_COLS, ATL_ROWS, INSET);
          continue;
        }
        if (def.shape === "slab") {
          const data = world.getState(wx, wy, wz);
          // Двойная плита геометрией равна полному кубу — её схлопывает
          // greedy-проход ниже вместе с обычными блоками.
          if (greedy && data === SLAB_DOUBLE) continue;
          emitSlab(gd, world, wx, wy, wz, def, ATL_COLS, ATL_ROWS, INSET, data);
          continue;
        }
        if (def.shape === "plate") {
          // Нажимная плита как в майнкрафте: тонкая пластина 14/16 x 1/16 у пола.
          emitPartialBox(gd, world, wx, wy, wz, def, ATL_COLS, ATL_ROWS, INSET,
            1 / 16, 0, 1 / 16, 15 / 16, 1 / 16, 15 / 16);
          continue;
        }
        if (def.shape === "stairs") {
          emitStairs(gd, world, wx, wy, wz, def, ATL_COLS, ATL_ROWS, INSET, world.getState(wx, wy, wz));
          continue;
        }
        if (def.shape === "bed") {
          // Кровать как в майнкрафте: низкий блок 9/16. Изголовье отдельной
          // геометрией не выделяем (вторая клетка ставится рядом при установке).
          emitPartialBox(gd, world, wx, wy, wz, def, ATL_COLS, ATL_ROWS, INSET,
            0, 0, 0, 1, 9 / 16, 1, null);
          continue;
        }
        if (def.shape === "button") {
          emitButton(gd, world, wx, wy, wz, def, ATL_COLS, ATL_ROWS, INSET, world.getState(wx, wy, wz));
          continue;
        }
        if (def.shape === "trapdoor") {
          emitTrapdoor(gd, world, wx, wy, wz, def, ATL_COLS, ATL_ROWS, INSET, world.getState(wx, wy, wz));
          continue;
        }
        if (def.shape === "hook") {
          emitHook(gd, world, wx, wy, wz, def, ATL_COLS, ATL_ROWS, INSET, world.getState(wx, wy, wz));
          continue;
        }
        // Opaque-кубы при включённом флаге рисует buildGreedyOpaque ниже.
        if (greedy && isOpaqueBlock(def)) continue;

        for (let f = 0; f < FACES.length; f++) {
          const face = FACES[f];
          const n = face.n;
          const nx = wx + n[0];
          const ny = wy + n[1];
          const nz = wz + n[2];
          const nb = world.getBlock(nx, ny, nz);
          const nbDef = BLOCKS[nb];
          // Не рисуем внутренние грани соседних прозрачных блоков.
          // Это особенно важно для стекла и воды: иначе при выключенном
          // back-face culling появляются z-fighting и мерцание.
          if (layer === "alpha" && nb === id) continue;
          if (isOpaqueBlock(def)) {
            // Неполный сосед закрывает грань не целиком (см. faceHiddenByNeighbor).
            const partial = nbDef && (nbDef.shape === "slab" || nbDef.shape === "stairs");
            const nbState = partial ? world.getState(nx, ny, nz) : 0;
            if (faceHiddenByNeighbor(n[0], n[1], n[2], 0, 1, nbDef, nbState)) continue;
          }
          pushFace(gd, wx, wy, wz, face, tileFor(def, n), face.shade, ATL_COLS, ATL_ROWS, INSET);
        }
      }
    }
  }

  if (greedy) buildGreedyOpaque(world, layers.opaque, cx, cy, cz);

  return layers;
}

function pushFace(gd, bx, by, bz, face, tile, shade, COLS, ROWS, INSET) {
  const tu = (tile % COLS) / COLS;
  const tv = Math.floor(tile / COLS) / ROWS;
  const aU = INSET / COLS;
  const aV = INSET / ROWS;
  const n = face.n;
  const base = gd.positions.length / 3;
  for (let k = 0; k < 4; k++) {
    const c = face.v[k];
    const px = bx + c[0];
    const py = by + c[1];
    const pz = bz + c[2];
    gd.positions.push(px, py, pz);
    gd.normals.push(n[0], n[1], n[2]);
    const u = UV[k][0] === 0 ? tu + aU : tu + 1 / COLS - aU;
    // Same v convention as pushPlane: v=0 is the canvas top (see above), so
    // the block bottom samples the tile bottom.
    const v = UV[k][1] === 0 ? tv + 1 / ROWS - aV : tv + aV;
    gd.uvs.push(u, v);
    pushBakedColor(gd, px, py, pz, shade);
    // Одиночный квад: repeat 1,1 — шейдер повторяет тождественно.
    if (gd.tileInfo) gd.tileInfo.push(tu, tv, 1, 1);
  }
  gd.indices.push(base, base + 2, base + 1, base, base + 3, base + 2);
}

// Простой greedy-merge только для opaque-кубов: видимые грани одинаковых
// блоков, лежащие в одной плоскости чанка, объединяются в один прямоугольник
// (1 квад вместо w*h). Условие видимости то же, что и в buildChunkGeometry:
// грань есть тогда и только тогда, когда сосед НЕ opaque.
// Текстура НЕ растягивается: UV покрывают тайл один раз, а кастомный шейдер
// opaque-слоя (blockMat в main.js) повторяет тайл fract()'ом внутри его
// границ tileInfo — merged-грань выглядит как отдельные блоки.
// Cutout/alpha/torch/sign/bars сюда не входят и рисуются как раньше.
function buildGreedyOpaque(world, gd, cx, cy, cz) {
  const origin = [cx * CHUNK, cy * CHUNK, cz * CHUNK];
  for (let f = 0; f < FACES.length; f++) {
    const face = FACES[f];
    const n = face.n;
    const axis = n[0] !== 0 ? 0 : (n[1] !== 0 ? 1 : 2);
    const sign = n[axis];
    // Базис плоскости грани выводим из её углов, чтобы порядок обхода и
    // winding совпали с pushFace: U = v3-v0, V = v1-v0 (каждый +-1 по одной оси).
    const U = [
      face.v[3][0] - face.v[0][0],
      face.v[3][1] - face.v[0][1],
      face.v[3][2] - face.v[0][2],
    ];
    const V = [
      face.v[1][0] - face.v[0][0],
      face.v[1][1] - face.v[0][1],
      face.v[1][2] - face.v[0][2],
    ];
    const uAxis = U[0] !== 0 ? 0 : (U[1] !== 0 ? 1 : 2);
    const vAxis = V[0] !== 0 ? 0 : (V[1] !== 0 ? 1 : 2);
    const uSign = U[uAxis];
    const vSign = V[vAxis];
    for (let slice = 0; slice < CHUNK; slice++) {
      const mask = new Uint16Array(CHUNK * CHUNK);
      const axisCoord = origin[axis] + slice;
      for (let v = 0; v < CHUNK; v++) {
        const vCoord = origin[vAxis] + (vSign > 0 ? v : CHUNK - 1 - v);
        for (let u = 0; u < CHUNK; u++) {
          const uCoord = origin[uAxis] + (uSign > 0 ? u : CHUNK - 1 - u);
          const px = axis === 0 ? axisCoord : (uAxis === 0 ? uCoord : vCoord);
          const py = axis === 1 ? axisCoord : (uAxis === 1 ? uCoord : vCoord);
          const pz = axis === 2 ? axisCoord : (uAxis === 2 ? uCoord : vCoord);
          const id = world.getBlock(px, py, pz);
          const def = BLOCKS[id];
          if (!isOpaqueBlock(def)) continue;
          // Мержим полные кубы и двойные плиты (геометрия та же).
          // Половины плит, факелы и таблички рисуются отдельно: их
          // геометрия зависит от data и в merge не участвует.
          if (def.shape !== "cube" &&
              !(def.shape === "slab" && world.getState(px, py, pz) === SLAB_DOUBLE)) continue;
          const nbx = px + n[0];
          const nby = py + n[1];
          const nbz = pz + n[2];
          const nbDef = BLOCKS[world.getBlock(nbx, nby, nbz)];
          // Внутренняя грань между полными кубами не нужна. Рядом с половиной
          // плиты грань видна хотя бы частично — клетку включаем в merge,
          // перекрытая часть закроется соседом по глубине.
          const partial = nbDef && (nbDef.shape === "slab" || nbDef.shape === "stairs");
          const nbState = partial ? world.getState(nbx, nby, nbz) : 0;
          if (faceHiddenByNeighbor(n[0], n[1], n[2], 0, 1, nbDef, nbState)) continue;
          mask[v * CHUNK + u] = id;
        }
      }
      for (let v = 0; v < CHUNK; v++) {
        for (let u = 0; u < CHUNK; u++) {
          const id = mask[v * CHUNK + u];
          if (id === 0) continue;
          let w = 1;
          while (u + w < CHUNK && mask[v * CHUNK + u + w] === id) w++;
          let h = 1;
          let canGrow = true;
          while (v + h < CHUNK && canGrow) {
            for (let k = 0; k < w; k++) {
              if (mask[(v + h) * CHUNK + u + k] !== id) {
                canGrow = false;
                break;
              }
            }
            if (canGrow) h++;
          }
          for (let dv = 0; dv < h; dv++) {
            for (let du = 0; du < w; du++) mask[(v + dv) * CHUNK + u + du] = 0;
          }
          const boxMin = [0, 0, 0];
          const boxMax = [0, 0, 0];
          const plane = axisCoord + (sign > 0 ? 1 : 0);
          boxMin[axis] = plane;
          boxMax[axis] = plane;
          const uLo = uSign > 0 ? origin[uAxis] + u : origin[uAxis] + CHUNK - u - w;
          const vLo = vSign > 0 ? origin[vAxis] + v : origin[vAxis] + CHUNK - v - h;
          boxMin[uAxis] = uLo;
          boxMax[uAxis] = uLo + w;
          boxMin[vAxis] = vLo;
          boxMax[vAxis] = vLo + h;
          const def = BLOCKS[id];
          // Прямоугольник w*h блоков: шейдер повторит тайл w раз по U и h по V.
          pushMergedFace(gd, boxMin, boxMax, face, tileFor(def, n), face.shade, ATL_COLS, ATL_ROWS, INSET, 1, 0, w, h);
        }
      }
    }
  }
}

// Как pushFace, но углы берутся из бокса merged-прямоугольника: компонента 0
// угла грани -> boxMin, 1 -> boxMax. Для прямоугольника 1x1 совпадает с
// pushFace один в один. UV покрывают тайл целиком один раз; сколько раз его
// повторить (в блоках вдоль U/V грани) говорит repU/repV — кастомный шейдер
// делает fract() внутри тайла, и merged-грань выглядит как отдельные блоки.
// fBot/fTop задают долю тайла (от верха, 0..1) на нижней/верхней кромке грани:
// по умолчанию весь тайл, для боков плит — его половину.
function pushMergedFace(gd, boxMin, boxMax, face, tile, shade, COLS, ROWS, INSET, fBot = 1, fTop = 0, repU = 1, repV = 1) {
  const tu = (tile % COLS) / COLS;
  const tv = Math.floor(tile / COLS) / ROWS;
  const aU = INSET / COLS;
  const fB = fBot + (fBot < fTop ? INSET : -INSET);
  const fT = fTop + (fTop < fBot ? INSET : -INSET);
  const n = face.n;
  const base = gd.positions.length / 3;
  for (let k = 0; k < 4; k++) {
    const c = face.v[k];
    const px = c[0] ? boxMax[0] : boxMin[0];
    const py = c[1] ? boxMax[1] : boxMin[1];
    const pz = c[2] ? boxMax[2] : boxMin[2];
    gd.positions.push(px, py, pz);
    gd.normals.push(n[0], n[1], n[2]);
    const u = UV[k][0] === 0 ? tu + aU : tu + 1 / COLS - aU;
    const v = UV[k][1] === 0 ? tv + fB / ROWS : tv + fT / ROWS;
    gd.uvs.push(u, v);
    pushBakedColor(gd, px, py, pz, shade);
    if (gd.tileInfo) gd.tileInfo.push(tu, tv, repU, repV);
  }
  gd.indices.push(base, base + 2, base + 1, base, base + 3, base + 2);
}