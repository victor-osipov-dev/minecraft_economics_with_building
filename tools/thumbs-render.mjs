// Offline isometric thumbnail renderer for schemes.
// Parses with the game's parser, rasterizes dimetric projection in software,
// writes PNG (hand-rolled encoder). No WebGL, no canvas.
import fs from "node:fs";
import path from "node:path";
import zlib from "node:zlib";
import { parseSchematicFile } from "../src/schematic.js";
import * as B from "../src/blocks.js";

const TILE_W = 232;
const TILE_H = 176;
const PAD = 10;

function hexRgb(hex) {
  const v = parseInt(hex.slice(1), 16);
  return [(v >> 16) & 255, (v >> 8) & 255, v & 255];
}
const BLOCK_RGB = B.BLOCKS.map((d) => (d ? hexRgb(d.color || "#ffffff") : [255, 0, 255]));

function isOpaque(id) {
  const d = B.BLOCKS[id];
  return !!d && d.solid && !d.transparent && !d.bars;
}
// For thumbnails every recognized block is a (near-)cube: glass, water and
// decor read as volumes, slabs keep halves. Guarantees non-empty renders.
function thumbOpaque(id) {
  return Number.isInteger(id) && id !== 0 && !!B.BLOCKS[id];
}
function shapeOf(id) {
  const d = B.BLOCKS[id];
  return d ? d.shape || "cube" : "cube";
}

// crc32 table
const CRC_T = new Int32Array(256);
for (let n = 0; n < 256; n++) {
  let c = n;
  for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
  CRC_T[n] = c;
}
function crc32(buf) {
  let c = -1;
  for (let i = 0; i < buf.length; i++) c = CRC_T[(c ^ buf[i]) & 255] ^ (c >>> 8);
  return (c ^ -1) >>> 0;
}
function chunk(type, data) {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length);
  const td = Buffer.from(type, "ascii");
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(Buffer.concat([td, data])));
  return Buffer.concat([len, td, data, crc]);
}
export function encodePNG(w, h, rgba) {
  const raw = Buffer.alloc((w * 4 + 1) * h);
  for (let y = 0; y < h; y++) {
    raw[y * (w * 4 + 1)] = 0;
    Buffer.from(rgba.slice(y * w * 4, (y + 1) * w * 4)).copy(raw, y * (w * 4 + 1) + 1);
  }
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(w, 0);
  ihdr.writeUInt32BE(h, 4);
  ihdr[8] = 8;
  ihdr[9] = 6;
  const sig = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
  return Buffer.concat([sig, chunk("IHDR", ihdr), chunk("IDAT", zlib.deflateSync(raw)), chunk("IEND", Buffer.alloc(0))]);
}

// Build voxel grid + per-cell render boxes (slabs as halves).
function buildGrid(plan) {
  const { W, H, L, blocks } = plan;
  const grid = new Uint8Array(W * H * L);
  const data = new Uint8Array(W * H * L);
  const at = (x, y, z) => (x < 0 || y < 0 || z < 0 || x >= W || y >= H || z >= L ? 0 : grid[(y * L + z) * W + x]);
  for (const b of blocks) {
    const [x, y, z, id, dd] = b;
    if (x < 0 || y < 0 || z < 0 || x >= W || y >= H || z >= L) continue;
    grid[(y * L + z) * W + x] = id > 255 ? 0 : id;
    data[(y * L + z) * W + x] = dd || 0;
  }
  return { W, H, L, grid, data, at };
}

// Collect visible quads back-to-front: {pts:[[x,y,z]x4], rgb}
function collectQuads(g) {
  const { W, H, L, at } = g;
  const quads = [];
  const push = (pts, rgb) => quads.push({ pts, rgb, d: pts[0][0] + pts[0][2] });
  for (let s = 0; s <= W - 1 + (L - 1); s++) {
    for (let y = 0; y < H; y++) {
      for (let x = 0; x < W; x++) {
        const z = s - x;
        if (z < 0 || z >= L) continue;
        const id = at(x, y, z);
        if (!thumbOpaque(id)) continue;
        const shape = shapeOf(id);
        const st = g.data[(y * L + z) * W + x];
        let y0 = 0;
        let y1 = 1;
        if (shape === "slab") {
          if (st === 2) y0 = 0.5;
          else if (st === 1) y1 = 0.5;
        }
        const rgb = BLOCK_RGB[id] || [200, 200, 200];
        const top = [rgb[0], rgb[1], rgb[2]];
        const east = [rgb[0] * 0.72, rgb[1] * 0.72, rgb[2] * 0.72];
        const south = [rgb[0] * 0.85, rgb[1] * 0.85, rgb[2] * 0.85];
        // +X (east)
        if (!thumbOpaque(at(x + 1, y, z))) {
          push([[x + 1, y + y0, z], [x + 1, y + y1, z], [x + 1, y + y1, z + 1], [x + 1, y + y0, z + 1]], east);
        }
        // +Z (south)
        if (!thumbOpaque(at(x, y, z + 1))) {
          push([[x, y + y0, z + 1], [x, y + y1, z + 1], [x + 1, y + y1, z + 1], [x + 1, y + y0, z + 1]], south);
        }
        // top
        if (!thumbOpaque(at(x, y + 1, z))) {
          push([[x, y + y1, z], [x, y + y1, z + 1], [x + 1, y + y1, z + 1], [x + 1, y + y1, z]], top);
        }
      }
    }
  }
  return quads;
}

function rasterize(quads, W = TILE_W, H = TILE_H) {
  // project dimetric 2:1, fit bounds
  let minX = 1e9;
  let maxX = -1e9;
  let minY = 1e9;
  let maxY = -1e9;
  const proj = quads.map((q) =>
    q.pts.map(([x, y, z]) => {
      const sx = x - z;
      const sy = (x + z) * 0.5 - y;
      if (sx < minX) minX = sx;
      if (sx > maxX) maxX = sx;
      if (sy < minY) minY = sy;
      if (sy > maxY) maxY = sy;
      return [sx, sy];
    })
  );
  const sc = Math.min((W - PAD * 2) / Math.max(1e-6, maxX - minX), (H - PAD * 2) / Math.max(1e-6, maxY - minY));
  const ox = PAD - minX * sc + ((W - PAD * 2) - (maxX - minX) * sc) / 2;
  const oy = PAD - minY * sc + ((H - PAD * 2) - (maxY - minY) * sc) / 2;
  const px = proj.map((pts) => pts.map(([sx, sy]) => [ox + sx * sc, oy + sy * sc]));
  const buf = new Uint8ClampedArray(W * H * 4);
  const set = (x, y, r, g, b) => {
    x |= 0;
    y |= 0;
    if (x < 0 || y < 0 || x >= W || y >= H) return;
    const i = (y * W + x) * 4;
    buf[i] = r;
    buf[i + 1] = g;
    buf[i + 2] = b;
    buf[i + 3] = 255;
  };
  quads.forEach((q, qi) => {
    const p = px[qi];
    const [r, g, b] = q.rgb.map((v) => Math.max(0, Math.min(255, Math.round(v))));
    // scanline fill of convex quad via edge interpolation
    let yMin = H;
    let yMax = -1;
    for (const [, yy] of p) {
      yMin = Math.min(yMin, yy);
      yMax = Math.max(yMax, yy);
    }
    const ys = Math.max(0, Math.floor(yMin));
    const ye = Math.min(H - 1, Math.ceil(yMax));
    for (let y = ys; y <= ye; y++) {
      const xs = [];
      for (let e = 0; e < 4; e++) {
        const [x1, y1] = p[e];
        const [x2, y2] = p[(e + 1) % 4];
        if ((y1 <= y && y2 > y) || (y2 <= y && y1 > y)) {
          xs.push(x1 + ((x2 - x1) * (y - y1)) / (y2 - y1));
        }
      }
      if (xs.length < 2) continue;
      xs.sort((a, b2) => a - b2);
      for (let x = Math.ceil(xs[0]); x <= Math.floor(xs[xs.length - 1]); x++) set(x, y, r, g, b);
    }
  });
  return { buf, quads: quads.length };
}

export function renderPlan(plan) {
  const g = buildGrid(plan);
  const quads = collectQuads(g);
  if (!quads.length) return null;
  const { buf } = rasterize(quads);
  return encodePNG(TILE_W, TILE_H, buf);
}

export function renderAscii(plan, cols = 72, rows = 30) {
  const g = buildGrid(plan);
  const quads = collectQuads(g);
  if (!quads.length) return "(empty)";
  // reuse projection math at low res
  let minX = 1e9,
    maxX = -1e9,
    minY = 1e9,
    maxY = -1e9;
  const proj = quads.map((q) =>
    q.pts.map(([x, y, z]) => {
      const sx = x - z;
      const sy = (x + z) * 0.5 - y;
      minX = Math.min(minX, sx);
      maxX = Math.max(maxX, sx);
      minY = Math.min(minY, sy);
      maxY = Math.max(maxY, sy);
      return [sx, sy];
    })
  );
  const sc = Math.min(cols / Math.max(1e-6, maxX - minX), rows / Math.max(1e-6, maxY - minY));
  const grid = Array.from({ length: rows + 1 }, () => new Array(cols + 1).fill(" "));
  const shades = " .:-=+*#%@";
  quads.forEach((q, qi) => {
    const lum = (q.rgb[0] + q.rgb[1] + q.rgb[2]) / 3 / 255;
    const ch = shades[Math.max(0, Math.min(shades.length - 1, Math.round(lum * (shades.length - 1))))];
    for (const [sx, sy] of proj[qi]) {
      const cx = Math.round((sx - minX) * sc);
      const cy = Math.round((sy - minY) * sc);
      if (cx >= 0 && cy >= 0 && cx <= cols && cy <= rows) grid[rows - cy][cx] = ch;
    }
  });
  return grid.map((r) => r.join("")).join("\n");
}

if (process.argv[2] === "--ascii") {
  const plan = parseSchematicFile(new Uint8Array(fs.readFileSync(process.argv[3])));
  console.log(`${plan.W}x${plan.H}x${plan.L} blocks=${plan.blocks.length}`);
  console.log(renderAscii(plan));
}
if (process.argv[2] === "--png") {
  const plan = parseSchematicFile(new Uint8Array(fs.readFileSync(process.argv[3])));
  const png = renderPlan(plan);
  fs.writeFileSync(process.argv[4], png);
  console.log("wrote", process.argv[4], png.length, "bytes");
}
