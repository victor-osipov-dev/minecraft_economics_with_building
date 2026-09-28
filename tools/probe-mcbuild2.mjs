const UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0 Safari/537.36";
const r = await fetch("https://mcbuild.org/schematics/10601:wooden-house", { headers: { "user-agent": UA } });
const html = await r.text();
const i = html.indexOf('data-key="5edf');
console.log("=== context data-key ===");
console.log(html.slice(Math.max(0, i - 1200), i + 800).replace(/\s+/g, " "));

console.log("\n=== scripts src ===");
console.log([...html.matchAll(/<script[^>]*src="([^"]+)"/g)].map((m) => m[1]).join("\n"));

console.log("\n=== inline js mentioning download/key ===");
for (const m of html.matchAll(/<script(?![^>]*src)[^>]*>([\s\S]{0,4000}?)<\/script>/gi)) {
  const js = m[1];
  if (/(download|data-key|fetch\(|XMLHttpRequest)/i.test(js)) console.log("---\n" + js.slice(0, 2500));
}
