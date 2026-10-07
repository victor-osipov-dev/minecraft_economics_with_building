// Поиск «голых» русских строк в JS (вне i18n.js) и статичного текста
// в index.html без data-i18n. Запуск: node tools/check-raw-text.mjs
import fs from "node:fs";
import path from "node:path";

const ROOT = path.resolve(import.meta.dirname, "..");
const CYR = /[\u0400-\u04FF]/;
const out = [];

function walk(d, out2 = []) {
  for (const e of fs.readdirSync(d, { withFileTypes: true })) {
    const p = path.join(d, e.name);
    if (e.isDirectory()) walk(p, out2);
    else if (e.name.endsWith(".js")) out2.push(p);
  }
  return out2;
}

function stripComments(s) {
  return s
    .replace(/\/\*[\s\S]*?\*\//g, (m) => m.replace(/[^\n]/g, " "))
    .replace(/(^|[^:"'`\\])\/\/[^\n]*/g, (m, p1) => p1 + m.slice(p1.length).replace(/[^\n]/g, " "));
}

for (const f of walk(path.join(ROOT, "src"))) {
  if (f.endsWith("i18n.js")) continue;
  const lines = stripComments(fs.readFileSync(f, "utf8")).split(/\r?\n/);
  lines.forEach((l, i) => {
    if (!CYR.test(l)) return;
    for (const m of l.matchAll(/(["'`])((?:\\.|(?!\1)[^\\])*)\1/g)) {
      if (!CYR.test(m[2])) continue;
      out.push(`${path.relative(ROOT, f)}:${i + 1}: ${m[2].slice(0, 100)}`);
    }
  });
}

// index.html: элементы с кириллицей, у которых нет data-i18n*
const html = fs.readFileSync(path.join(ROOT, "index.html"), "utf8");
const body = html.slice(html.indexOf("<body>"));
const noTag = [];
const re = /<([a-z0-9]+)((?:[^>"]|"[^"]*")*)>([^<>]*[\u0400-\u04FF][^<>]*)<\/\1>/gi;
for (const m of body.matchAll(re)) {
  const [, tag, attrs, text] = m;
  const txt = text.trim();
  if (!txt) continue;
  if (/data-i18n/.test(attrs)) continue;
  noTag.push(`<${tag}> ${JSON.stringify(txt)}`);
}
const attr = [];
for (const m of body.matchAll(/(?:placeholder|title|value)="([^"]*[\u0400-\u04FF][^"]*)"/g)) {
  attr.push(m[1]);
}

console.log(`голые русские строки в JS: ${out.length}`);
for (const o of out) console.log("  " + o);
console.log(`\nстатичный текст в <body> index.html: ${noTag.length}`);
for (const t of noTag) console.log("  " + JSON.stringify(t));
console.log(`\nplaceholder/title/value с кириллицей: ${attr.length}`);
for (const a of attr) console.log("  " + JSON.stringify(a));