// Inspect mc-mod.net WP REST API for schematics.
const UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0 Safari/537.36";

const r = await fetch("https://www.mc-mod.net/wp-json/wp/v2/schematic/562560", { headers: { "user-agent": UA } });
const j = await r.json();
console.log("== single item keys ==", Object.keys(j).join(", "));
for (const k of Object.keys(j)) {
  const v = j[k];
  const s = JSON.stringify(v);
  console.log(`  ${k}: ${s.slice(0, 300)}`);
}

const t = await fetch("https://www.mc-mod.net/wp-json/wp/v2/schematic?per_page=1", { headers: { "user-agent": UA } });
console.log("\n== headers ==");
for (const [k, v] of t.headers) if (k.startsWith("x-wp")) console.log(`  ${k}: ${v}`);

const tax = await fetch("https://www.mc-mod.net/wp-json/wp/v2/taxonomies", { headers: { "user-agent": UA } });
const tj = await tax.json();
console.log("\n== taxonomies ==");
for (const [k, v] of Object.entries(tj)) console.log(`  ${k}: rest_base=${v.rest_base} types=${(v.types || []).join("|")}`);
