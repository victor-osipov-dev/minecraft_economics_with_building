// Аудит читаемости: весь текст интерфейса — не меньше 16px
// (стандартный минимум для слабовидящих: 16px ≈ 12pt, базовый размер браузеров).
// Проверяет font-size и font-шорткаты в <style> index.html (весь CSS игры — там).
// Запуск: node tools/check-font-size.mjs
import fs from "node:fs";
import path from "node:path";

const ROOT = path.resolve(import.meta.dirname, "..");
const FLOOR = 16;
const fail = [];

const html = fs.readFileSync(path.join(ROOT, "index.html"), "utf8");
const style = html.split("<style>")[1]?.split("</style>")[0] || "";
const lines = style.split(/\r?\n/);
lines.forEach((line, i) => {
  // font-size: Npx
  for (const m of line.matchAll(/font-size\s*:\s*(\d+)px/g)) {
    if (+m[1] < FLOOR) fail.push(`index.html:${i + 8} — font-size: ${m[1]}px < ${FLOOR}px — ${line.trim().slice(0, 100)}`);
  }
  // font: [weight] Npx family — первое число может быть жирностью, берём число перед px
  for (const m of line.matchAll(/font\s*:(?:\s*\d+\s+)?(\d+)px/g)) {
    if (+m[1] < FLOOR) fail.push(`index.html:${i + 8} — font ${m[1]}px < ${FLOOR}px — ${line.trim().slice(0, 100)}`);
  }
});

console.log(`проверено строк CSS: ${lines.length}, минимум: ${FLOOR}px`);
if (fail.length) {
  console.error(`\nОШИБКИ (${fail.length}) — мелкий текст:`);
  for (const f of fail) console.error("  " + f);
  process.exit(1);
}
console.log("OK: весь текст интерфейса ≥ 16px.");
