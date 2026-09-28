// Merge metadata audit + per-batch image verdicts into the final report.
// Outputs:
//   schemes/BUILD_REPORT.md  — summary + problems + full per-build table
//   schemes/build_report.csv — one row per build, machine readable
// Usage: node tools/build-report.mjs
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const DEST = path.join(ROOT, "schemes");
const VISION = path.join(ROOT, "reports", "vision");
const OUT_MD = path.join(DEST, "BUILD_REPORT.md");
const OUT_CSV = path.join(DEST, "build_report.csv");

const idx = JSON.parse(fs.readFileSync(path.join(DEST, "index.json"), "utf8"));
const audit = JSON.parse(fs.readFileSync(path.join(ROOT, "reports", "metadata_audit.json"), "utf8"));
const auditBy = new Map(audit.map((a) => [a.file, a]));

// ---------- load vision verdicts ----------
const vision = new Map();
let visionFiles = 0, visionLines = 0, visionBad = 0;
if (fs.existsSync(VISION)) {
  for (const f of fs.readdirSync(VISION).filter((x) => x.endsWith(".jsonl") || x.endsWith(".json")).sort()) {
    visionFiles++;
    const raw = fs.readFileSync(path.join(VISION, f), "utf8");
    for (const line of raw.split(/\r?\n/)) {
      const s = line.trim().replace(/^-\s*/, "");
      if (!s || (s.startsWith("[") && s.endsWith("]"))) continue;
      try {
        const o = JSON.parse(s);
        if (!o || typeof o !== "object" || !o.file) { visionBad++; continue; }
        vision.set(o.file, o);
        visionLines++;
      } catch { visionBad++; }
    }
  }
}

const CATS = ["roads", "intersections", "residential", "commercial", "public", "towers", "parks", "industrial", "transport", "bridges", "decor", "vehicles", "waterfront"];
const NAME_SCORE = { good: 100, partial: 50, wrong: 0 };
const VERDICT_RANK = { broken: 4, mismatch: 3, minor: 2, ok: 1 };
const VERDICT_RU = { ok: "OK", minor: "мелочь", mismatch: "РАСХОЖДЕНИЕ", broken: "СЛОМАНО" };
const NAMEFIT_RU = { good: "совпадает", partial: "частично", wrong: "не совпадает", unreadable: "не читается", none: "—" };
const CATFIT_RU = { ok: "подходит", misfit: "не подходит", none: "—" };
const TAGFIT_RU = { ok: "подходят", missing: "не хватает", extra: "лишние", none: "—" };

const rows = [];
const missing = [];
for (const it of idx.items) {
  const a = auditBy.get(it.file) || { flags: [], catFit: { verdict: "name-silent" }, tagIssues: [] };
  const v = vision.get(it.file);
  if (!v) missing.push(it.file);

  const nameFit = v?.nameFit || "none";
  const catFit = v?.catFit || "none";
  const tagsFit = v?.tagsFit || "none";
  const suggestCat = v?.suggestCat && CATS.includes(v.suggestCat) ? v.suggestCat : "";

  // union of flags: metadata detects word patterns, vision detects what the image shows
  const flags = [...new Set([...(a.flags || []), ...((v && Array.isArray(v.flags)) ? v.flags : [])])].sort();

  // disagreement between word-based and image-based category judgement
  const disagree = v && a.catFit?.suggested && v.catFit === "misfit" && suggestCat && suggestCat !== a.catFit.suggested
    ? `words→${a.catFit.suggested}, image→${suggestCat}`
    : v && a.catFit?.suggested && v.catFit === "ok" ? `words→${a.catFit.suggested}, image→ok` : "";

  let verdict = v?.verdict || (v ? "minor" : "broken");
  if (!v) verdict = "missing";

  rows.push({
    file: it.file,
    name: it.name,
    category: it.category,
    tags: it.tags.join("|"),
    dims: `${it.w}x${it.h}x${it.l}`,
    blocks: it.blocks,
    source: a.source || "",
    nameFit, catFit, suggestCat, tagsFit,
    tagNotes: (v && Array.isArray(v.tagNotes) ? v.tagNotes : []).join(" "),
    metaTagIssues: (a.tagIssues || []).join(" "),
    flags: flags.join("|"),
    catWords: a.catFit?.verdict || "",
    catWordsSuggest: a.catFit?.suggested || "",
    disagree,
    verdict,
    comment: (v && v.comment) ? String(v.comment).replace(/\s+/g, " ").trim() : "",
    thumb: it.thumb,
  });
}

// ---------- stats ----------
const count = (key) => rows.reduce((m, r) => (m[r[key]] = (m[r[key]] || 0) + 1, m), {});
const nameFitC = count("nameFit");
const catFitC = count("catFit");
const tagsFitC = count("tagsFit");
const verdictC = count("verdict");
const analysed = rows.filter((r) => r.nameFit !== "none");

const nameScore = analysed.length
  ? Math.round(analysed.reduce((s, r) => s + (NAME_SCORE[r.nameFit] ?? 0), 0) / analysed.length)
  : 0;
const catScore = analysed.length ? Math.round((analysed.filter((r) => r.catFit === "ok").length / analysed.length) * 100) : 0;
const tagsScore = analysed.length ? Math.round((analysed.filter((r) => r.tagsFit === "ok").length / analysed.length) * 100) : 0;

const byCat = {};
for (const r of rows) {
  const c = (byCat[r.category] ||= { n: 0, ok: 0, minor: 0, mismatch: 0, broken: 0, missing: 0, catBad: 0, nameBad: 0 });
  c.n++;
  c[r.verdict] = (c[r.verdict] || 0) + 1;
  if (r.catFit === "misfit") c.catBad++;
  if (r.nameFit === "wrong" || r.nameFit === "unreadable") c.nameBad++;
}

const flagCount = {};
for (const r of rows) for (const f of r.flags.split("|").filter(Boolean)) flagCount[f] = (flagCount[f] || 0) + 1;

const suggestCats = {};
for (const r of rows) if (r.catFit === "misfit" && r.suggestCat) suggestCats[`${r.category}→${r.suggestCat}`] = (suggestCats[`${r.category}→${r.suggestCat}`] || 0) + 1;

// ---------- CSV ----------
const cols = ["file", "name", "category", "tags", "dims", "blocks", "source", "nameFit", "catFit", "suggestCat", "tagsFit", "tagNotes", "metaTagIssues", "flags", "catWords", "catWordsSuggest", "disagree", "verdict", "comment"];
const esc = (v) => `"${String(v ?? "").replace(/"/g, '""')}"`;
const csv = [cols.join(",")].concat(rows.map((r) => cols.map((c) => esc(r[c])).join(","))).join("\n");
fs.writeFileSync(OUT_CSV, "\uFEFF" + csv, "utf8");

// ---------- Markdown ----------
const problems = rows.filter((r) => ["broken", "mismatch", "missing"].includes(r.verdict) || r.flags);
const ranked = [...problems].sort((a, b) => (VERDICT_RANK[b.verdict] || 0) - (VERDICT_RANK[a.verdict] || 0) || a.category.localeCompare(b.category));

const L = [];
L.push("# Отчёт по качеству каталога построек");
L.push("");
L.push(`Дата: ${new Date().toISOString().slice(0, 10)} · объектов: **${rows.length}** · проанализировано картинок: **${analysed.length}**${missing.length ? ` · без картинки: ${missing.length}` : ""}`);
L.push("");
L.push("Для каждой постройки проверялось три вещи: **подходит ли название** к тому, что на превью, **подходит ли категория** и **подходят ли теги**.");
L.push("Источники фактов: картинка (`schemes/thumbs/*.png` — глазами) + метаданные (`tools/metadata-audit.mjs` — правила по словам в названии).");
L.push("");
L.push("## Сводка");
L.push("");
L.push("| проверка | результат |");
L.push("|---|---|");
L.push(`| Название ↔ картинка | **${nameScore}%** (${nameFitC.good || 0} совпадает, ${nameFitC.partial || 0} частично, ${nameFitC.wrong || 0} не совпадает, ${nameFitC.unreadable || 0} не читается) |`);
L.push(`| Категория ↔ картинка | **${catScore}%** (${catFitC.ok || 0} подходит, ${catFitC.misfit || 0} не подходит) |`);
L.push(`| Теги ↔ картинка | **${tagsScore}%** (${tagsFitC.ok || 0} подходят, ${tagsFitC.missing || 0} не хватает, ${tagsFitC.extra || 0} лишние) |`);
L.push("");
L.push("Итоговый вердикт по объекту:");
L.push("");
L.push("| вердикт | кол-во | доля |");
L.push("|---|---|---|");
for (const v of ["ok", "minor", "mismatch", "broken", "missing"])
  if (verdictC[v]) L.push(`| ${VERDICT_RU[v] || v} | ${verdictC[v]} | ${Math.round((verdictC[v] / rows.length) * 100)}% |`);
L.push("");
if (Object.keys(flagCount).length) {
  L.push("Флаги (наложение правил по названию и того, что видно на картинке):");
  L.push("");
  L.push("| флаг | кол-во |");
  L.push("|---|---|");
  for (const [k, v] of Object.entries(flagCount).sort((a, b) => b[1] - a[1])) L.push(`| ${k} | ${v} |`);
  L.push("");
}
L.push("## По категориям");
L.push("");
L.push("| категория | всего | вердикт OK | мелочь | расхождение | сломано | категория≠картинка | название≠картинка |");
L.push("|---|---|---|---|---|---|---|---|");
for (const c of CATS) {
  const s = byCat[c];
  if (!s) continue;
  L.push(`| ${c} | ${s.n} | ${s.ok || 0} | ${s.minor || 0} | ${s.mismatch || 0} | ${(s.broken || 0) + (s.missing || 0)} | ${s.catBad} | ${s.nameBad} |`);
}
L.push("");
if (Object.keys(suggestCats).length) {
  L.push("Куда по картинке переносили (топ переходов):");
  L.push("");
  for (const [k, v] of Object.entries(suggestCats).sort((a, b) => b[1] - a[1]).slice(0, 20)) L.push(`- ${k} — ${v}`);
  L.push("");
}

L.push("## Проблемные объекты");
L.push("");
L.push(`Всего ${problems.length} записей (сломано, расхождение, флаг или категория не по картинке). Порядок: сначала худшие.`);
L.push("");
for (const r of ranked) {
  const reasons = [];
  if (r.verdict === "broken" || r.verdict === "missing") reasons.push(`вердикт: ${VERDICT_RU[r.verdict]}`);
  if (r.verdict === "mismatch") reasons.push("вердикт: РАСХОЖДЕНИЕ");
  if (r.catFit === "misfit") reasons.push(`категория «${r.category}» не по картинке → ${r.suggestCat}`);
  if (r.nameFit === "wrong" || r.nameFit === "unreadable") reasons.push(`название: ${NAMEFIT_RU[r.nameFit]}`);
  if (r.flags) reasons.push(`флаги: ${r.flags.replace(/\|/g, ", ")}`);
  if (r.tagNotes) reasons.push(`теги: ${r.tagNotes}`);
  if (r.disagree) reasons.push(`разошлись правила и картинка (${r.disagree})`);
  L.push(`### ${r.name}`);
  L.push("");
  L.push(`- файл: \`${r.file}\` · категория: **${r.category}** · теги: ${r.tags} · ${r.dims} · ${r.blocks} блоков${r.source ? ` · источник: ${r.source}` : ""}`);
  L.push(`- превью: \`schemes/${r.thumb}\``);
  L.push(`- ${reasons.join(" · ")}`);
  if (r.comment) L.push(`- комментарий: ${r.comment}`);
  L.push("");
}

L.push("## Полный список по постройкам");
L.push("");
L.push("| # | постройка | категория | название↔картинка | категория↔картинка | теги↔картинка | вердикт | комментарий |");
L.push("|---|---|---|---|---|---|---|---|");
rows.forEach((r, i) => {
  const catCell = r.catFit === "misfit" ? `**не подходит**→${r.suggestCat}` : CATFIT_RU[r.catFit];
  L.push(`| ${i + 1} | ${r.name.replace(/\|/g, "/")} | ${r.category} | ${NAMEFIT_RU[r.nameFit]} | ${catCell} | ${TAGFIT_RU[r.tagsFit]}${r.tagNotes ? ` (${r.tagNotes})` : ""} | ${VERDICT_RU[r.verdict] || r.verdict} | ${r.comment.replace(/\|/g, "/")} |`);
});
L.push("");
if (missing.length) {
  L.push("## Не проанализировано");
  L.push("");
  for (const f of missing) L.push(`- \`${f}\``);
  L.push("");
}
fs.writeFileSync(OUT_MD, L.join("\n"), "utf8");

console.log(`analysed=${analysed.length}/${rows.length} visionFiles=${visionFiles} lines=${visionLines} bad=${visionBad} missing=${missing.length}`);
console.log(`nameFit ${JSON.stringify(nameFitC)}`);
console.log(`catFit  ${JSON.stringify(catFitC)}`);
console.log(`tagsFit ${JSON.stringify(tagsFitC)}`);
console.log(`verdict ${JSON.stringify(verdictC)}`);
console.log(`scores: name=${nameScore}% category=${catScore}% tags=${tagsScore}%`);
console.log(`flags: ${JSON.stringify(flagCount)}`);
console.log(`written: ${OUT_MD}`);
console.log(`written: ${OUT_CSV}`);
if (missing.length) console.log("MISSING:", missing.slice(0, 10).join(", "));
