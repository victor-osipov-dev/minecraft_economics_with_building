// Локальный рендер превью коллекционных построек.
// Берём те же планы, что использует игра, рисуем изометрию в RGB-буфер
// и пишем PNG вручную (zlib + CRC32) — без внешних картинок и зависимостей.
import fs from "node:fs";
import path from "node:path";
import zlib from "node:zlib";
import { COLLECTIBLES, makeCollectiblePlan } from "../src/meta/collectibles.js";
import { BLOCKS } from "../src/blocks.js";

const SCALE = 2;     // суперсэмплинг, потом усредняем в 2 раза
const TW = 16;       // полуширина блока на экране
const TH = 7;        // полувысота ромба сверху
const ZH = 14;       // высота блока на экране
const PAD = 14;

const iso = (x, y, z) => [(x - z) * TW, (x + z) * TH - y * ZH];

function hexRgb(hex) {
  const h = String(hex || "#888888").replace("#", "");
  const v = parseInt(h.length === 3 ? h.split("").map((c) => c + c).join("") : h, 16);
  return [(v >> 16) & 255, (v >> 8) & 255, v & 255];
}
const shade = (rgb, k) => rgb.map((c) => Math.max(0, Math.min(255, Math.round(c * k))));

function fillQuad(buf, w, h, pts, rgb) {
  const ys = pts.map((p) => p[1]);
  const xs = pts.map((p) => p[0]);
  const y0 = Math.max(0, Math.floor(Math.min(...ys)));
  const y1 = Math.min(h - 1, Math.ceil(Math.max(...ys)));
  const x0 = Math.max(0, Math.floor(Math.min(...xs)));
  const x1 = Math.min(w - 1, Math.ceil(Math.max(...xs)));
  if (x1 <= x0 || y1 <= y0) return;
  for (let y = y0; y <= y1; y++) {
    for (let x = x0; x <= x1; x++) {
      const px = x + 0.5, py = y + 0.5;
      let sign = 0;
      let inside = true;
      for (let i = 0; i < pts.length; i++) {
        const a = pts[i], b = pts[(i + 1) % pts.length];
        const cross = (b[0] - a[0]) * (py - a[1]) - (b[1] - a[1]) * (px - a[0]);
        if (Math.abs(cross) < 1e-9) continue;
        const s = cross > 0 ? 1 : -1;
        if (sign === 0) sign = s;
        else if (s !== sign) { inside = false; break; }
      }
      if (!inside) continue;
      const o = (y * w + x) * 3;
      buf[o] = rgb[0]; buf[o + 1] = rgb[1]; buf[o + 2] = rgb[2];
    }
  }
}

function renderPlan(plan) {
  const blocks = plan.blocks.filter(([, , , id]) => id !== 0 && BLOCKS[id]);
  if (!blocks.length) throw new Error("empty plan");

  let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
  for (const [x, y, z] of blocks) {
    for (const [vx, vy, vz] of [[x, y, z], [x + 1, y, z], [x, y + 1, z], [x, y, z + 1], [x + 1, y + 1, z + 1]]) {
      const [px, py] = iso(vx, vy, vz);
      minX = Math.min(minX, px); maxX = Math.max(maxX, px);
      minY = Math.min(minY, py); maxY = Math.max(maxY, py);
    }
  }
  const w = Math.ceil((maxX - minX) * SCALE) + PAD * 2;
  const h = Math.ceil((maxY - minY) * SCALE) + PAD * 2;
  const buf = new Uint8Array(w * h * 3);
  // фон: тёмный градиент, как у игрового мира
  for (let y = 0; y < h; y++) {
    const k = y / h;
    const c = [Math.round(34 - 16 * k), Math.round(39 - 18 * k), Math.round(50 - 22 * k)];
    for (let x = 0; x < w; x++) {
      const o = (y * w + x) * 3;
      buf[o] = c[0]; buf[o + 1] = c[1]; buf[o + 2] = c[2];
    }
  }
  const ox = -minX * SCALE + PAD;
  const oy = -minY * SCALE + PAD;
  const tr = (p) => [Math.round(p[0] * SCALE + ox), Math.round(p[1] * SCALE + oy)];

  // рисователь по глубине: чем больше x+y+z, тем ближе к камере
  blocks.sort((a, b) => (a[0] + a[1] + a[2]) - (b[0] + b[1] + b[2]));
  for (const [x, y, z, id] of blocks) {
    const base = hexRgb(BLOCKS[id].color);
    const right = shade(base, 0.78);
    const left = shade(base, 0.64);
    const top = shade(base, 1.0);
    fillQuad(buf, w, h, [
      tr(iso(x + 1, y, z)), tr(iso(x + 1, y + 1, z)),
      tr(iso(x + 1, y + 1, z + 1)), tr(iso(x + 1, y, z + 1)),
    ], right);
    fillQuad(buf, w, h, [
      tr(iso(x, y, z + 1)), tr(iso(x + 1, y, z + 1)),
      tr(iso(x + 1, y + 1, z + 1)), tr(iso(x, y + 1, z + 1)),
    ], left);
    fillQuad(buf, w, h, [
      tr(iso(x, y + 1, z)), tr(iso(x + 1, y + 1, z)),
      tr(iso(x + 1, y + 1, z + 1)), tr(iso(x, y + 1, z + 1)),
    ], top);
  }

  // даунсэмпл 2×2 — сглаживание ступенчатых краёв
  const ow = Math.floor(w / SCALE), oh = Math.floor(h / SCALE);
  const out = new Uint8Array(ow * oh * 3);
  for (let y = 0; y < oh; y++) {
    for (let x = 0; x < ow; x++) {
      const acc = [0, 0, 0];
      for (let dy = 0; dy < SCALE; dy++) for (let dx = 0; dx < SCALE; dx++) {
        const o = ((y * SCALE + dy) * w + (x * SCALE + dx)) * 3;
        for (let c = 0; c < 3; c++) acc[c] += buf[o + c];
      }
      const o = (y * ow + x) * 3;
      for (let c = 0; c < 3; c++) out[o + c] = Math.round(acc[c] / (SCALE * SCALE));
    }
  }
  return { width: ow, height: oh, pixels: out };
}

// --- минимальный PNG-кодер ---
const CRC_TABLE = (() => {
  const t = new Uint32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) c = (c & 1) ? (0xedb88320 ^ (c >>> 1)) : (c >>> 1);
    t[n] = c >>> 0;
  }
  return t;
})();
function crc32(buf) {
  let c = 0xffffffff;
  for (const b of buf) c = CRC_TABLE[(c ^ b) & 0xff] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
}
function chunk(type, data) {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length);
  const body = Buffer.concat([Buffer.from(type, "ascii"), data]);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(body));
  return Buffer.concat([len, body, crc]);
}
function writePng(file, img) {
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(img.width, 0);
  ihdr.writeUInt32BE(img.height, 4);
  ihdr[8] = 8; ihdr[9] = 2; // 8-bit RGB
  const raw = Buffer.alloc((img.width * 3 + 1) * img.height);
  for (let y = 0; y < img.height; y++) {
    const row = y * (img.width * 3 + 1);
    raw[row] = 0; // filter: none
    Buffer.from(img.pixels.buffer, y * img.width * 3, img.width * 3).copy(raw, row + 1);
  }
  const png = Buffer.concat([
    Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]),
    chunk("IHDR", ihdr),
    chunk("IDAT", zlib.deflateSync(raw, { level: 9 })),
    chunk("IEND", Buffer.alloc(0)),
  ]);
  fs.writeFileSync(file, png);
}

const outDir = path.resolve("schemes/collectibles");
fs.mkdirSync(outDir, { recursive: true });
for (const c of COLLECTIBLES) {
  const img = renderPlan(makeCollectiblePlan(c.id));
  const file = path.join(outDir, `${c.id}.png`);
  writePng(file, img);
  console.log(`${c.id}.png  ${img.width}x${img.height}  ${(fs.statSync(file).size / 1024).toFixed(1)} KB`);
}
