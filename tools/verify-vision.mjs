// Strict validation of vision verdict files against their batch assignments.
// Checks: coverage (every file exactly once), line count per batch, enum values,
// suggestCat within the 13 categories, tagNotes within the 32-tag vocabulary.
// Usage: node tools/verify-vision.mjs
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const BATCHES = path.join(ROOT, "reports", "batches");
const VISION = path.join(ROOT, "reports", "vision");

const CATS = new Set(["roads", "intersections", "residential", "commercial", "public", "towers", "parks", "industrial", "transport", "bridges", "decor", "vehicles", "waterfront"]);
const TAGS = new Set("apartment bank boat bridge car castle-like church fountain hospital hotel house huge large library medium modern museum office park parking pool road school shop small stadium station tall tiny tower tree water".split(" "));
const ENUM = {
  nameFit: new Set(["good", "partial", "wrong", "unreadable"]),
  catFit: new Set(["ok", "misfit"]),
  tagsFit: new Set(["ok", "missing", "extra"]),
  verdict: new Set(["ok", "minor", "mismatch", "broken"]),
  flags: new Set(["franchise", "fantasy", "vehicle", "empty", "text", "broken", "non-building"]),
};

if (!fs.existsSync(VISION)) fs.mkdirSync(VISION, { recursive: true });

const batches = fs.readdirSync(BATCHES).filter((f) => f.endsWith(".json")).sort();
const expected = new Map(); // file -> batch
for (const f of batches) {
  const b = JSON.parse(fs.readFileSync(path.join(BATCHES, f), "utf8"));
  for (const it of b.items) expected.set(it.file, b.batch);
}

const seen = new Map(); // file -> {batch, line}
const problems = [];
const byBatch = {};

for (const f of fs.readdirSync(VISION).filter((x) => x.endsWith(".jsonl") || x.endsWith(".json")).sort()) {
  const raw = fs.readFileSync(path.join(VISION, f), "utf8");
  const lines = raw.split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
  let ok = 0;
  lines.forEach((line, i) => {
    let o;
    try { o = JSON.parse(line); } catch { problems.push(`${f}:${i + 1} не-JSON: ${line.slice(0, 70)}`); return; }
    if (!o.file) { problems.push(`${f}:${i + 1} нет file`); return; }
    if (!expected.has(o.file)) { problems.push(`${f}:${i + 1} file не из этой библиотеки: ${o.file}`); return; }
    if (seen.has(o.file)) problems.push(`${f}:${i + 1} дубль: ${o.file} (уже в batch-${seen.get(o.file).batch})`);
    seen.set(o.file, { batch: expected.get(o.file), src: f, line: i + 1 });

    for (const [k, set] of Object.entries(ENUM)) {
      const v = o[k];
      if (k === "flags") {
        if (v !== undefined && (!Array.isArray(v) || v.some((x) => !set.has(x)))) problems.push(`${f}:${i + 1} flags: ${JSON.stringify(v)}`);
      } else if (v === undefined || !set.has(v)) {
        problems.push(`${f}:${i + 1} ${k}=${JSON.stringify(v)} недопустимо`);
      }
    }
    if (o.catFit === "misfit" && (!o.suggestCat || !CATS.has(o.suggestCat))) problems.push(`${f}:${i + 1} suggestCat недопустим: ${JSON.stringify(o.suggestCat)}`);
    if (o.catFit === "ok" && o.suggestCat) problems.push(`${f}:${i + 1} suggestCat указан при catFit=ok: ${o.suggestCat}`);
    if (o.tagNotes !== undefined) {
      if (!Array.isArray(o.tagNotes)) problems.push(`${f}:${i + 1} tagNotes не массив`);
      else for (const t of o.tagNotes) {
        const m = /^\s*([+-])([a-z-]+)\s*$/.exec(String(t));
        if (!m) problems.push(`${f}:${i + 1} tagNotes формат: ${JSON.stringify(t)}`);
        else if (!TAGS.has(m[2])) problems.push(`${f}:${i + 1} tagNotes вне словаря: ${m[2]}`);
      }
    }
    if (o.comment !== undefined && String(o.comment).length > 200) problems.push(`${f}:${i + 1} comment длинный (${String(o.comment).length})`);
    ok++;
  });
  const batchNo = /batch-(\d+)/.exec(f);
  byBatch[f] = { lines: lines.length, ok };
  if (batchNo) {
    const want = [...expected.values()].filter((b) => b === Number(batchNo[1])).length;
    if (lines.length !== want) problems.push(`${f}: строк ${lines.length}, ожидалось ${want}`);
  }
}

const missingByBatch = {};
for (const [file, batch] of expected) if (!seen.has(file)) (missingByBatch[batch] ||= []).push(file);

console.log(`batches=${batches.length} expected=${expected.size} seen=${seen.size} problems=${problems.length}`);
for (const [f, s] of Object.entries(byBatch)) console.log(`  ${f}: ${s.ok}/${s.lines}`);
const missingBatches = Object.keys(missingByBatch).sort((a, b) => a - b);
if (missingBatches.length) {
  console.log(`\nнеполные батчи: ${missingBatches.join(", ")}`);
  for (const b of missingBatches) console.log(`  batch-${String(b).padStart(2, "0")}: не хватает ${missingByBatch[b].length} (${missingByBatch[b].slice(0, 3).join(", ")}${missingByBatch[b].length > 3 ? "…" : ""})`);
}
if (problems.length) {
  console.log(`\nпроблемы формата (первые 25):`);
  for (const p of problems.slice(0, 25)) console.log("  " + p);
}
fs.writeFileSync(path.join(ROOT, "reports", "vision_validation.json"), JSON.stringify({ seen: seen.size, problems: problems.slice(0, 500), missingByBatch }, null, 1));
