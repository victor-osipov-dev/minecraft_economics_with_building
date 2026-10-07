// Аудит локализации: все ключи t(), data-i18n в index.html, паритет ru/en
// и «голый» текст в UI-присваиваниях (textContent/innerHTML/title/...).
// Запуск: node tools/check-i18n.mjs
import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";

const ROOT = path.resolve(import.meta.dirname, "..");
const fail = [];
const warn = [];

// ---- 1. Загрузка STR/t из src/i18n.js (ESM без JSON-импорта) ----
let src = fs.readFileSync(path.join(ROOT, "src/i18n.js"), "utf8");
src = src.replace(/^import .*$/m, "const schemeNamesRu = {};").replace(/\bexport /g, "");
const { STR, t, pick } = vm.runInNewContext(src + "\n;({ STR, t, pick })", { console });
const langs = Object.keys(STR);
console.log(`языки: ${langs.join(", ")}`);

// ---- 2. Рекурсивное сравнение структуры ru/en ----
function keysOf(obj, prefix = "") {
  const out = [];
  for (const [k, v] of Object.entries(obj)) {
    const key = prefix ? `${prefix}.${k}` : k;
    if (v && typeof v === "object" && !Array.isArray(v)) out.push(...keysOf(v, key));
    else out.push(key);
  }
  return out;
}
const keySets = {};
for (const l of langs) keySets[l] = new Set(keysOf(STR[l]));
const base = keySets.ru;
for (const l of langs) {
  if (l === "ru") continue;
  for (const k of base) if (!keySets[l].has(k)) fail.push(`[${l}] нет ключа: ${k}`);
  for (const k of keySets[l]) if (!base.has(k)) warn.push(`[${l}] лишний ключ (нет в ru): ${k}`);
}
// ru: пустые строки
for (const k of base) {
  const v = pick(STR.ru, k);
  if (typeof v === "string" && !v.trim()) fail.push(`[ru] пустая строка: ${k}`);
}

// ---- 3. Вызовы t("key") в src/**: ключ существует ----
const srcFiles = [];
(function walk(d) {
  for (const e of fs.readdirSync(d, { withFileTypes: true })) {
    const p = path.join(d, e.name);
    if (e.isDirectory()) walk(p);
    else if (e.name.endsWith(".js")) srcFiles.push(p);
  }
})(path.join(ROOT, "src"));

const tKey = /\bt\(\s*["'`]([^"'`$]+)["'`]/g;
const tDotted = /\bt\(\s*`([^`]*\$\{[^`]*)`/g;
const used = new Map(); // key -> file:line
for (const f of srcFiles) {
  const lines = fs.readFileSync(f, "utf8").split(/\r?\n/);
  lines.forEach((line, i) => {
    const code = f.endsWith(path.join("src", "i18n.js"))
      ? line.replace(/\/\/.*$/, "") // комментарий i18n.js:2 упоминает t("key") как пример
      : line;
    for (const m of code.matchAll(tKey)) {
      used.set(m[1], `${path.relative(ROOT, f)}:${i + 1}`);
    }
    for (const m of code.matchAll(tDotted)) {
      if (!/\{/.test(m[1].replace(/\$\{[^}]*\}/g, ""))) fail.push(`[t-template] нестабильный ключ: ${m[1]} (${path.relative(ROOT, f)}:${i + 1})`);
    }
  });
}
for (const [key, where] of used) {
  if (pick(STR.ru, key) === undefined) fail.push(`t(): ключ не найден в ru — "${key}" (${where})`);
}

// ---- 4. data-i18n в index.html ----
const html = fs.readFileSync(path.join(ROOT, "index.html"), "utf8");
for (const m of html.matchAll(/data-i18n(?:-title|-ph)?="([^"]+)"/g)) {
  if (pick(STR.ru, m[1]) === undefined) fail.push(`index.html: data-i18n ключ не найден — "${m[1]}"`);
}

// ---- 5. «Голый» текст в UI: кириллица в строковых литералах рядом с DOM-выводом ----
const UI_CALL = /(textContent|innerHTML|outerHTML|insertAdjacentHTML|\.title|\.placeholder|alt|showMsg|confirm|alert)\s*[=(]|showMsg\(/;
function stripComments(s) {
  return s.replace(/\/\*[\s\S]*?\*\//g, (m) => m.replace(/[^\n]/g, " "))
          .replace(/(^|[^:])\/\/[^\n]*/g, (m, p1) => p1 + m.slice(p1.length).replace(/[^\n]/g, " "));
}
for (const f of srcFiles) {
  if (f.endsWith(path.join("src", "i18n.js"))) continue;
  const raw = fs.readFileSync(f, "utf8");
  const lines = stripComments(raw).split(/\r?\n/);
  lines.forEach((line, i) => {
    if (!/[\u0400-\u04FF]/.test(line)) return;
    if (!UI_CALL.test(line)) return;
    // литерал с кириллицей, НЕ обёрнутый в t("...") и не внутри t(..., vars)
    const lit = line.match(/["'`]([^"'`]*[\u0400-\u04FF][^"'`]*)["'`]/);
    if (!lit) return;
    if (/\bt\(/.test(line)) return;
    warn.push(`[raw-UI] ${path.relative(ROOT, f)}:${i + 1} — ${line.trim().slice(0, 110)}`);
  });
}

// ---- 6. Латиница в ru-строках UI (после удаления {плейсхолдеров}) ----
const latinWord = /[A-Za-z]{4,}/g;
// Имена клавиш/клавиатуры, форматы файлов, бренды — остаются латиницей намеренно.
const allowedLat = new Set([
  "rgba", "Segoe", "Arial", "English", "schem", "schematic", "Space", "Shift",
  "Tab", "Enter", "Esc", "EscUp", "PgUp", "PgDn", "Ctrl", "Home", "End",
]);
for (const k of base) {
  const v = pick(STR.ru, k);
  if (typeof v !== "string") continue;
  const bare = v.replace(/\{[^}]*\}/g, " ").replace(/\$\{[^}]*\}/g, " ");
  for (const m of bare.matchAll(latinWord)) {
    if (!allowedLat.has(m[0]) && !/^[A-Z0-9]+$/.test(m[0])) warn.push(`[lat-in-ru] ${k}: "${m[0]}" в "${v.slice(0, 70)}"`);
  }
}

console.log(`t() ключей использовано: ${used.size}; data-i18n: ${(html.match(/data-i18n/g) || []).length}`);
if (warn.length) {
  console.log(`\nпредупреждения (${warn.length}):`);
  for (const w of warn.slice(0, 60)) console.log("  " + w);
  if (warn.length > 60) console.log(`  … ещё ${warn.length - 60}`);
}
if (fail.length) {
  console.error(`\nОШИБКИ (${fail.length}):`);
  for (const f of fail.slice(0, 60)) console.error("  " + f);
  process.exit(1);
}
console.log("\nOK: ключи i18n полные, ru/en согласованы.");