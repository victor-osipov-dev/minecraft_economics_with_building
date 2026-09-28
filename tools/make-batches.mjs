// Split the library into batches for image analysis (one batch = one worker).
// Usage: node tools/make-batches.mjs [batchSize]
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const DEST = path.join(ROOT, "schemes");
const OUT = path.join(ROOT, "reports", "batches");
fs.mkdirSync(OUT, { recursive: true });

const SIZE = Number(process.argv[2] || 40);
const idx = JSON.parse(fs.readFileSync(path.join(DEST, "index.json"), "utf8"));
const audit = JSON.parse(fs.readFileSync(path.join(ROOT, "reports", "metadata_audit.json"), "utf8"));
const auditByFile = new Map(audit.map((a) => [a.file, a]));

// clean previous batches
for (const f of fs.readdirSync(OUT)) fs.unlinkSync(path.join(OUT, f));

const batches = [];
for (let i = 0; i < idx.items.length; i += SIZE) batches.push(idx.items.slice(i, i + SIZE));
batches.forEach((items, bi) => {
  const no = String(bi + 1).padStart(2, "0");
  const rows = items.map((it) => ({
    file: it.file,
    name: it.name,
    category: it.category,
    tags: it.tags,
    dims: `${it.w}x${it.h}x${it.l}`,
    blocks: it.blocks,
    thumb: path.join(DEST, it.thumb),
    // подсказки для сверки, НЕ для принятия решения — решение по картинке
    metaFlags: (auditByFile.get(it.file) || {}).flags || [],
  }));
  fs.writeFileSync(path.join(OUT, `batch-${no}.json`), JSON.stringify({ batch: Number(no), items: rows }, null, 1));
});

console.log(`batches=${batches.length} size=${SIZE} items=${idx.items.length}`);
console.log(fs.readdirSync(OUT).join(" "));
