// Library report: totals, per-category, per-source, status, formats, sizes.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const DEST = path.join(ROOT, "schemes");
const catalog = JSON.parse(fs.readFileSync(path.join(DEST, "catalog.json"), "utf8"));
const index = JSON.parse(fs.readFileSync(path.join(DEST, "index.json"), "utf8"));

const count = (fn) => catalog.filter(fn).length;
const by = (key) => {
  const out = {};
  for (const e of catalog) out[e[key] || "?"] = (out[e[key] || "?"] || 0) + 1;
  return Object.entries(out).sort((a, b) => b[1] - a[1]);
};

console.log(`total files:      ${catalog.length}`);
console.log(`index.json items: ${index.items ? index.items.length : index.length}`);
console.log(`tags:             ${(index.tags || []).length}`);

console.log("\nby category:");
for (const [k, v] of by("category")) console.log(`  ${k.padEnd(16)} ${v}`);

console.log("\nby source:");
for (const [k, v] of by("source")) console.log(`  ${k.padEnd(18)} ${v}`);

console.log("\nby status:");
for (const [k, v] of by("status")) console.log(`  ${k.padEnd(14)} ${v}`);

console.log("\nby format:");
for (const [k, v] of by("format")) console.log(`  ${k.padEnd(12)} ${v}`);

const bytes = catalog.reduce((s, e) => s + (e.file_size || 0), 0);
console.log(`\nbytes:            ${bytes} (${(bytes / 1048576).toFixed(1)} MiB)`);

const tall = count((e) => e.status === "verified-tall");
const review = catalog.filter((e) => e.status === "review");
const unsupported = catalog.filter((e) => e.unsupported_entries > 0);
console.log(`tall (>64, clipped in game): ${tall}`);
console.log(`review (mostly unsupported):  ${review.length}`);
console.log(`with unsupported blocks:      ${unsupported.length}`);

console.log("\nreview files:");
for (const e of review)
  console.log(`  ${e.file}  ${e.width}x${e.height}x${e.length} blocks=${e.blocks} unsupported=${e.unsupported_entries}`);

const dims = catalog.map((e) => e.width * e.height * e.length).sort((a, b) => a - b);
console.log(`\nvolume: min=${dims[0]} max=${dims[dims.length - 1]} median=${dims[Math.floor(dims.length / 2)]}`);
console.log(`files >64 tall: ${catalog.filter((e) => e.height > 64).length}`);
console.log(`files with 0 blocks: ${catalog.filter((e) => !e.blocks).length}`);
