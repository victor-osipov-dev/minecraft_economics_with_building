import fs from "node:fs";
import { parseSchematicFile } from "file:///C:/Users/victor/Desktop/Projects/babylon/game/src/schematic.js";
import { renderPlan } from "./thumbs-render.mjs";

const DEST = "C:/Users/victor/Desktop/Projects/babylon/game/schemes";
const THUMBS = DEST + "/thumbs";
fs.mkdirSync(THUMBS, { recursive: true });
const catalog = JSON.parse(fs.readFileSync(`${DEST}/catalog.json`, "utf8"));
let ok = 0;
let fail = 0;
let totalBytes = 0;
const t0 = Date.now();
for (const e of catalog) {
  const base = e.file.replace(/\.(schem|schematic|nbt)$/i, "");
  const out = `${THUMBS}/${base}.png`;
  try {
    const plan = parseSchematicFile(new Uint8Array(fs.readFileSync(`${DEST}/${e.file}`)));
    const png = renderPlan(plan);
    if (!png) throw new Error("empty render");
    fs.writeFileSync(out, png);
    totalBytes += png.length;
    ok++;
  } catch (err) {
    fail++;
    console.log("FAIL", e.file, String(err.message || err).slice(0, 100));
  }
  if ((ok + fail) % 100 === 0) console.log(`...${ok + fail}/${catalog.length}`);
}
console.log(`done: ok=${ok} fail=${fail} bytes=${totalBytes} time=${((Date.now() - t0) / 1000).toFixed(0)}s`);
