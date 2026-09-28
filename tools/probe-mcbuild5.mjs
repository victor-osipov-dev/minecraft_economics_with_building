const UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0 Safari/537.36";
const page = "https://mcbuild.org/schematics/10601:wooden-house";
const r1 = await fetch(page, { headers: { "user-agent": UA } });
const cookie = (r1.headers.getSetCookie ? r1.headers.getSetCookie() : []).map((c) => c.split(";")[0]).join("; ");
await r1.text();
const r2 = await fetch("https://mcbuild.org/download/schematic=10601?format=schem", {
  headers: { "user-agent": UA, referer: page, cookie, accept: "text/html" },
});
const html = await r2.text();
const i = html.indexOf("'+file+'");
console.log("=== context ===");
console.log(html.slice(Math.max(0, i - 2500), i + 1500));
