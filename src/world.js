import * as BABYLON from "@babylonjs/core";
import { AIR, STONE, BLOCKS } from "./blocks.js";

export const CHUNK = 16;
export const WORLD_H = 32;
export const ATL_COLS = 4;
export const ATL_ROWS = 4;

const INSET = 0.03;

const FACES = [
  { n: [1, 0, 0], v: [[1, 0, 0], [1, 1, 0], [1, 1, 1], [1, 0, 1]], shade: 0.78 },
  { n: [-1, 0, 0], v: [[0, 0, 1], [0, 1, 1], [0, 1, 0], [0, 0, 0]], shade: 0.78 },
  { n: [0, 1, 0], v: [[0, 1, 0], [0, 1, 1], [1, 1, 1], [1, 1, 0]], shade: 0.95 },
  { n: [0, -1, 0], v: [[0, 0, 1], [0, 0, 0], [1, 0, 0], [1, 0, 1]], shade: 0.5 },
  { n: [0, 0, 1], v: [[0, 0, 1], [0, 1, 1], [1, 1, 1], [1, 0, 1]], shade: 0.86 },
  { n: [0, 0, -1], v: [[1, 0, 0], [1, 1, 0], [0, 1, 0], [0, 0, 0]], shade: 0.68 },
];
const UV = [[0, 0], [0, 1], [1, 1], [1, 0]];
const DIRS = [
  [1, 0, 0],
  [-1, 0, 0],
  [0, 1, 0],
  [0, -1, 0],
  [0, 0, 1],
  [0, 0, -1],
];

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
    x = Math.floor(x);
    y = Math.floor(y);
    z = Math.floor(z);
    if (y < 0) return STONE;
    if (y >= WORLD_H) return AIR;
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
    x = Math.floor(x);
    y = Math.floor(y);
    z = Math.floor(z);
    if (y < 0 || y >= WORLD_H) return;
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
    if (ly === CHUNK - 1 && cy < 1) this.dirty.add(levelKey(cx, cy + 1, cz));
    if (lz === 0) this.dirty.add(levelKey(cx, cy, cz - 1));
    if (lz === CHUNK - 1) this.dirty.add(levelKey(cx, cy, cz + 1));
  }

  markAll() {
    for (const key of this.chunks.keys()) this.dirty.add(key);
  }

  flushMeshes(scene, material) {
    for (const key of this.dirty) {
      const [cx, cy, cz] = key.split(",").map(Number);
      const gd = buildChunkGeometry(this, cx, cy, cz);
      let mesh = this.meshes.get(key);
      if (gd) {
        if (!mesh) {
          mesh = new BABYLON.Mesh(`chunk_${key}`, scene);
          mesh.material = material;
          this.meshes.set(key, mesh);
        }
        applyGeometry(mesh, gd);
        mesh.isVisible = true;
      } else if (mesh) {
        mesh.dispose();
        this.meshes.delete(key);
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

// corners of an axis-aligned quad at coordinate v (0 or 1) along axis,
// viewed from the +axis side (winding does not matter: we emit both faces)
function planeCorners(axis, v) {
  if (axis === 0) return [[v, 0, 0], [v, 1, 0], [v, 1, 1], [v, 0, 1]];
  if (axis === 1) return [[0, v, 0], [0, v, 1], [1, v, 1], [1, v, 0]];
  return [[0, 0, v], [0, 1, v], [1, 1, v], [1, 0, v]];
}

function emitBars(gd, world, wx, wy, wz, COLS, ROWS, INSET) {
  // single plane per air-adjacent boundary; the material has backface culling
  // disabled, so the grid texture is visible from both sides without z-fighting
  for (let i = 0; i < DIRS.length; i++) {
    const d = DIRS[i];
    if (world.getBlock(wx + d[0], wy + d[1], wz + d[2]) !== AIR) continue;
    const axis = d[0] ? 0 : d[1] ? 1 : 2;
    const value = d[axis] > 0 ? 1 : 0;
    pushPlane(gd, wx, wy, wz, planeCorners(axis, value), d, 0.92, COLS, ROWS, INSET);
  }
}

function pushPlane(gd, bx, by, bz, corners, n, shade, COLS, ROWS, INSET) {
  const tile = 5;
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
    const v = UV[k][1] === 0 ? tv + aV : tv + 1 / ROWS - aV;
    gd.uvs.push(u, v);
    gd.colors.push(shade, shade, shade, 1);
  }
  gd.indices.push(base, base + 1, base + 2, base, base + 2, base + 3);
}

function buildChunkGeometry(world, cx, cy, cz) {
  const gd = { positions: [], normals: [], uvs: [], colors: [], indices: [] };
  const ox = cx * CHUNK;
  const oy = cy * CHUNK;
  const oz = cz * CHUNK;

  for (let ly = 0; ly < CHUNK; ly++) {
    for (let lz = 0; lz < CHUNK; lz++) {
      for (let lx = 0; lx < CHUNK; lx++) {
        const wx = ox + lx;
        const wy = oy + ly;
        const wz = oz + lz;
        const id = world.getBlock(wx, wy, wz);
        if (id === AIR) continue;
        const def = BLOCKS[id];

        if (def.bars) {
          emitBars(gd, world, wx, wy, wz, ATL_COLS, ATL_ROWS, INSET);
          continue;
        }

        for (let f = 0; f < FACES.length; f++) {
          const face = FACES[f];
          const n = face.n;
          const nb = world.getBlock(wx + n[0], wy + n[1], wz + n[2]);
          const nbDef = BLOCKS[nb];
          if (nbDef.solid && !nbDef.bars) continue;
          pushFace(gd, wx, wy, wz, face, tileFor(def, n), face.shade, ATL_COLS, ATL_ROWS, INSET);
        }
      }
    }
  }

  if (gd.positions.length === 0) return null;
  return gd;
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
    const v = UV[k][1] === 0 ? tv + aV : tv + 1 / ROWS - aV;
    gd.uvs.push(u, v);
    gd.colors.push(shade, shade, shade, 1);
  }
  gd.indices.push(base, base + 1, base + 2, base, base + 2, base + 3);
}