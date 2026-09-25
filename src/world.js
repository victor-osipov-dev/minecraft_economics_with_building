import * as BABYLON from "@babylonjs/core";
import { AIR, ATLAS_COLS as ATL_COLS, ATLAS_ROWS as ATL_ROWS, STONE, BLOCKS } from "./blocks.js";

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

  setBlock(x, y, z, id) {
    if (!Number.isFinite(x) || !Number.isFinite(y) || !Number.isFinite(z) ||
        !Number.isInteger(id) || id < 0 || id >= BLOCKS.length || !BLOCKS[id]) {
      return false;
    }
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
    c[this._idx(x, y, z, cx, cy, cz)] = id;

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
    return true;
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
          const chunk = this.chunks.get(key);
          if (!chunk) continue;
          const minX = Math.max(x, cx * CHUNK);
          const maxX = Math.min(x1, (cx + 1) * CHUNK);
          const minY = Math.max(cy0, cy * CHUNK);
          const maxY = Math.min(cy1, (cy + 1) * CHUNK);
          const minZ = Math.max(z, cz * CHUNK);
          const maxZ = Math.min(z1, (cz + 1) * CHUNK);
          for (let wy = minY; wy < maxY; wy++) {
            for (let wz = minZ; wz < maxZ; wz++) {
              for (let wx = minX; wx < maxX; wx++) {
                chunk[(wy - cy * CHUNK) * CHUNK * CHUNK +
                  (wz - cz * CHUNK) * CHUNK + (wx - cx * CHUNK)] = AIR;
              }
            }
          }
        }
      }
    }

    // Mark the one-voxel perimeter as well.  This covers both horizontal
    // chunk seams and the 16/32/48 vertical seams without relying on which
    // side happened to contain the last non-air block.
    const dirtyCx0 = Math.floor((x - 1) / CHUNK);
    const dirtyCx1 = Math.floor(x1 / CHUNK);
    const dirtyCy0 = Math.floor((cy0 - 1) / CHUNK);
    const dirtyCy1 = Math.floor(cy1 / CHUNK);
    const dirtyCz0 = Math.floor((z - 1) / CHUNK);
    const dirtyCz1 = Math.floor(z1 / CHUNK);
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
    this.dirty.clear();
  }

  flushMeshes(scene, opaqueMaterial, cutoutMaterial = opaqueMaterial, alphaMaterial = cutoutMaterial, torchMaterial = cutoutMaterial) {
    const materials = [
      ["opaque", opaqueMaterial],
      ["cutout", cutoutMaterial],
      ["alpha", alphaMaterial],
      ["torch", torchMaterial],
    ];
    for (const key of this.dirty) {
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
    }
    this.dirty.clear();
  }
}

function applyGeometry(mesh, gd) {
  mesh.setVerticesData(BABYLON.VertexBuffer.PositionKind, gd.positions);
  mesh.setVerticesData(BABYLON.VertexBuffer.NormalKind, gd.normals);
  mesh.setVerticesData(BABYLON.VertexBuffer.UVKind, gd.uvs);
  mesh.setVerticesData(BABYLON.VertexBuffer.ColorKind, gd.colors);
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

function emitTorch(gd, wx, wy, wz, def, COLS, ROWS, INSET) {
  // Torch / redstone torch: narrow crossed quads through the cell center.
  // The tile art (stick + flame on transparent background) is alpha-tested,
  // so a full cube would show a floating textured box; the narrow quad reads
  // as a post with a flame from any horizontal side.
  const tile = tileFor(def, [0, 1, 0]);
  const a = 0.25;
  const b = 0.75;
  pushPlane(gd, wx, wy, wz, [[0.5, 0, a], [0.5, 1, a], [0.5, 1, b], [0.5, 0, b]], [1, 0, 0], 0.78, tile, COLS, ROWS, INSET);
  pushPlane(gd, wx, wy, wz, [[a, 0, 0.5], [a, 1, 0.5], [b, 1, 0.5], [b, 0, 0.5]], [0, 0, 1], 0.86, tile, COLS, ROWS, INSET);
}

function emitSign(gd, wx, wy, wz, def, COLS, ROWS, INSET) {
  // Wall-sign placeholder without orientation state: two crossed thin boards
  // in the upper-center of the cell.  Visible from any side; collision stays
  // non-solid, guards keep seeing through it.
  const tile = tileFor(def, [0, 1, 0]);
  const x0 = 0.125;
  const x1 = 0.875;
  const y0 = 0.1875;
  const y1 = 0.8125;
  pushPlane(gd, wx, wy, wz, [[0.5, y0, x0], [0.5, y1, x0], [0.5, y1, x1], [0.5, y0, x1]], [1, 0, 0], 0.78, tile, COLS, ROWS, INSET);
  pushPlane(gd, wx, wy, wz, [[x0, y0, 0.5], [x0, y1, 0.5], [x1, y1, 0.5], [x1, y0, 0.5]], [0, 0, 1], 0.86, tile, COLS, ROWS, INSET);
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

function pushPlane(gd, bx, by, bz, corners, n, shade, tile, COLS, ROWS, INSET) {
  const tu = (tile % COLS) / COLS;
  const tv = Math.floor(tile / COLS) / ROWS;
  const aU = INSET / COLS;
  const aV = INSET / ROWS;
  const base = gd.positions.length / 3;
  for (let k = 0; k < 4; k++) {
    const c = corners[k];
    gd.positions.push(bx + c[0], by + c[1], bz + c[2]);
    gd.normals.push(n[0], n[1], n[2]);
    const u = UV[k][0] === 0 ? tu + aU : tu + 1 / COLS - aU;
    // Atlas is uploaded with update(false), i.e. UNPACK_FLIP_Y off, so v=0 is
    // the canvas TOP.  Tile art is painted upright on the canvas (flame at the
    // top of the torch tile), therefore the block BOTTOM must sample the tile
    // BOTTOM (tv + 1/ROWS), not tv.  The old mapping showed every directional
    // texture upside down (torch flame at the base, grass strip at the foot).
    const v = UV[k][1] === 0 ? tv + 1 / ROWS - aV : tv + aV;
    gd.uvs.push(u, v);
    gd.colors.push(shade, shade, shade, 1);
  }
  gd.indices.push(base, base + 2, base + 1, base, base + 3, base + 2);
}

function emptyGeometry() {
  return { positions: [], normals: [], uvs: [], colors: [], indices: [] };
}

function isOpaqueBlock(def) {
  return !!def && def.solid && !def.transparent && !def.bars;
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
  const ox = cx * CHUNK;
  const oy = cy * CHUNK;
  const oz = cz * CHUNK;
  const greedy = meshSettings.greedyOpaqueMerge;

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
          emitTorch(gd, wx, wy, wz, def, ATL_COLS, ATL_ROWS, INSET);
          continue;
        }
        if (def.shape === "sign") {
          emitSign(gd, wx, wy, wz, def, ATL_COLS, ATL_ROWS, INSET);
          continue;
        }
        if (def.bars) {
          emitBars(gd, world, wx, wy, wz, def, ATL_COLS, ATL_ROWS, INSET);
          continue;
        }
        // Opaque-кубы при включённом флаге рисует buildGreedyOpaque ниже.
        if (greedy && isOpaqueBlock(def)) continue;

        for (let f = 0; f < FACES.length; f++) {
          const face = FACES[f];
          const n = face.n;
          const nb = world.getBlock(wx + n[0], wy + n[1], wz + n[2]);
          const nbDef = BLOCKS[nb];
          // Не рисуем внутренние грани соседних прозрачных блоков.
          // Это особенно важно для стекла и воды: иначе при выключенном
          // back-face culling появляются z-fighting и мерцание.
          if (layer === "alpha" && nb === id) continue;
          if (isOpaqueBlock(def) && isOpaqueBlock(nbDef)) continue;
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
    gd.positions.push(bx + c[0], by + c[1], bz + c[2]);
    gd.normals.push(n[0], n[1], n[2]);
    const u = UV[k][0] === 0 ? tu + aU : tu + 1 / COLS - aU;
    // Same v convention as pushPlane: v=0 is the canvas top (see above), so
    // the block bottom samples the tile bottom.
    const v = UV[k][1] === 0 ? tv + 1 / ROWS - aV : tv + aV;
    gd.uvs.push(u, v);
    gd.colors.push(shade, shade, shade, 1);
  }
  gd.indices.push(base, base + 2, base + 1, base, base + 3, base + 2);
}

// Простой greedy-merge только для opaque-кубов: видимые грани одинаковых
// блоков, лежащие в одной плоскости чанка, объединяются в один прямоугольник
// (1 квад вместо w*h). Условие видимости то же, что и в buildChunkGeometry:
// грань есть тогда и только тогда, когда сосед НЕ opaque.
// ВАЖНО: текстура при этом РАСТЯГИВАЕТСЯ на весь прямоугольник (UV покрывает
// тайл один раз), а не повторяется. Настоящий repeat внутри общего атласа
// невозможен со StandardMaterial: атлас в CLAMP-режиме, и UV за пределами
// тайла засэмплируют соседние тайлы. Для шумовых текстур (бетон, земля,
// шерсть, терракота) растяжка почти незаметна; у узорных (пол, кирпичи,
// книжные полки, песчаник) швы pattern'а потянутся вместе с гранью.
// Следующий шаг, если понадобится именно repeat "как было": отдельные
// повторяемые текстуры на частые блоки или кастомный шейдер с fract() внутри
// тайла. Cutout/alpha/torch/sign/bars сюда не входят и рисуются как раньше.
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
          const nbDef = BLOCKS[world.getBlock(px + n[0], py + n[1], pz + n[2])];
          if (isOpaqueBlock(nbDef)) continue;
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
          pushMergedFace(gd, boxMin, boxMax, face, tileFor(def, n), face.shade, ATL_COLS, ATL_ROWS, INSET);
        }
      }
    }
  }
}

// Как pushFace, но углы берутся из бокса merged-прямоугольника: компонента 0
// угла грани -> boxMin, 1 -> boxMax. Для прямоугольника 1x1 совпадает с
// pushFace один в один. UV покрывают тайл целиком один раз (stretch).
function pushMergedFace(gd, boxMin, boxMax, face, tile, shade, COLS, ROWS, INSET) {
  const tu = (tile % COLS) / COLS;
  const tv = Math.floor(tile / COLS) / ROWS;
  const aU = INSET / COLS;
  const aV = INSET / ROWS;
  const n = face.n;
  const base = gd.positions.length / 3;
  for (let k = 0; k < 4; k++) {
    const c = face.v[k];
    gd.positions.push(
      c[0] ? boxMax[0] : boxMin[0],
      c[1] ? boxMax[1] : boxMin[1],
      c[2] ? boxMax[2] : boxMin[2]
    );
    gd.normals.push(n[0], n[1], n[2]);
    const u = UV[k][0] === 0 ? tu + aU : tu + 1 / COLS - aU;
    const v = UV[k][1] === 0 ? tv + 1 / ROWS - aV : tv + aV;
    gd.uvs.push(u, v);
    gd.colors.push(shade, shade, shade, 1);
  }
  gd.indices.push(base, base + 2, base + 1, base, base + 3, base + 2);
}