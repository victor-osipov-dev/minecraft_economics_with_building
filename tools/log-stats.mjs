// Summarize download_log.csv: statuses and failure reasons.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const LOG = path.join(ROOT, "schemes", "download_log.csv");

function parseLine(line) {
  const out = [];
  let cur = "";
  let inQ = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (inQ) {
      if (ch === '"') {
        if (line[i + 1] === '"') {
          cur += '"';
          i++;
        } else inQ = false;
      } else cur += ch;
    } else if (ch === '"') inQ = true;
    else if (ch === ",") {
      out.push(cur);
      cur = "";
    } else cur += ch;
  }
  out.push(cur);
  return out;
}

const lines = fs.readFileSync(LOG, "utf8").trim().split(/\r?\n/);
const rows = lines.slice(1).map(parseLine);
const byStatus = {};
for (const r of rows) byStatus[r[5]] = (byStatus[r[5]] || 0) + 1;
console.log("rows:", rows.length, byStatus);

const grouped = {};
for (const r of rows) {
  if (!["incompatible", "failed"].includes(r[5])) continue;
  const reason = (r[6] || r[7] || "").trim().slice(0, 70);
  grouped[reason] = (grouped[reason] || 0) + 1;
}
console.log("\nfailure reasons:");
for (const [k, v] of Object.entries(grouped).sort((a, b) => b[1] - a[1])) console.log(`  ${String(v).padStart(4)}  ${k}`);
