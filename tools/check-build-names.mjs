// Проверка словаря русских названий витрины построек.
// Запуск: node tools/check-build-names.mjs
import fs from "node:fs";

const R = "schemes";
const idx = JSON.parse(fs.readFileSync(`${R}/index.json`, "utf8"));
const cat = JSON.parse(fs.readFileSync(`${R}/catalog.json`, "utf8"));
const ru = JSON.parse(fs.readFileSync(`${R}/names-ru.json`, "utf8"));

const fail = [];
const warn = [];
const byFile = new Map(cat.map((e) => [e.file, e.slug]));

// 1. Ключ = slug из каталога, все схемы переведены.
const slugs = new Set(cat.map((e) => e.slug));
for (const k of Object.keys(ru)) if (!slugs.has(k)) fail.push(`лишний ключ: ${k}`);
for (const s of slugs) if (!ru[s]) fail.push(`нет перевода: ${s}`);
for (const [k, v] of Object.entries(ru)) {
  if (!String(v).trim()) fail.push(`пустое значение: ${k}`);
  if (/&(#\d+|\w+);/.test(v)) fail.push(`HTML-entity в значении: ${k} = ${v}`);
}

// 2. index.json: slug у каждой позиции и совпадает с каталогом.
for (const it of idx.items) {
  if (!it.slug) fail.push(`index.json без slug: ${it.file}`);
  else if (byFile.get(it.file) !== it.slug) fail.push(`index.json slug не совпадает с каталогом: ${it.file}`);
  if (!ru[it.slug]) fail.push(`index.json без перевода: ${it.slug}`);
}

// 3. Качество текста.
const mixedWord = /[\u0400-\u04FF][A-Za-z]|[A-Za-z][\u0400-\u04FF]/;
const latinOnly = [];
for (const [k, v] of Object.entries(ru)) {
  if (mixedWord.test(v)) fail.push(`смешанное слово: ${k} = ${v}`);
  if (!/[\u0400-\u04FF]/.test(v)) latinOnly.push(`${k} = ${v}`);
  if (v.length > 90) warn.push(`длинное название (${v.length}): ${k} = ${v}`);
}

const uniq = new Set(Object.values(ru));
console.log(`index.json: ${idx.items.length} схем, slug: ${idx.items.filter((i) => i.slug).length}`);
console.log(`catalog.json: ${cat.length} записей, уникальных slug: ${slugs.size}`);
console.log(`names-ru.json: ${Object.keys(ru).length} ключей, из них уникальных текстов: ${uniq.size}`);
console.log(`латиница в тексте: ${latinOnly.length}${latinOnly.length ? " — " + latinOnly.slice(0, 40).join(" | ") : ""}`);
if (warn.length) console.log(`\nпредупреждения (${warn.length}):\n  ${warn.slice(0, 20).join("\n  ")}`);
if (fail.length) {
  console.error(`\nОШИБКИ (${fail.length}):\n  ${fail.slice(0, 40).join("\n  ")}`);
  process.exit(1);
}
console.log("\nOK: все 1154 названия на месте, index.json и catalog.json согласованы.");