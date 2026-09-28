const UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0 Safari/537.36";
const r = await fetch("https://mcbuild.org/schematics/10601:wooden-house", { headers: { "user-agent": UA } });
const html = await r.text();

// find script variables that look like download config
const pats = [/var\s+\w+\s*=\s*['"][^'"]{0,200}['"]/g, /data-[a-z-]+="[^"]{0,200}"/g];
for (const p of pats) {
  const m = [...html.matchAll(p)].map((x) => x[0]).filter((s) => /(down|file|link|sign|token|key|url|hash)/i.test(s));
  console.log("---", p, "---");
  console.log([...new Set(m)].slice(0, 40).join("\n"));
}

const idx = html.indexOf("/download/");
console.log("\n--- context around /download/ ---");
console.log(html.slice(Math.max(0, idx - 800), idx + 500).replace(/\s+/g, " "));
